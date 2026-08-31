/**
 * The KAF Tarım mark, rebuilt in three dimensions.
 *
 * Geometry is the real logo: outlines lifted from the company's own printed
 * catalogue (true vector, not a trace) and re-coloured from the reference
 * artwork, then extruded.  Nothing here is an approximation of the shapes -
 * every curve is the one the brand actually uses.
 *
 * The choreography follows the brief: the emblem blooms open first, then the
 * KAF tarım wordmark grows out of the emblem towards the right, letter by
 * letter, and the company strapline settles in underneath.
 */
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import logoSvg from '../assets/kaf-logo.svg?raw'

interface Grad {
  x1: number
  y1: number
  x2: number
  y2: number
  c0: THREE.Color
  c1: THREE.Color
}

interface PartSpec {
  /** extrusion depth in logo-height units */
  depth: number
  /** how far in front of z=0 the part sits, for real layered relief */
  lift: number
  roughness: number
  metalness: number
  clearcoat: number
  /** split the path into one mesh per glyph so letters can animate apart */
  perGlyph?: boolean
  bevel?: boolean
  curveSegments?: number
}

const SPEC: Record<string, PartSpec> = {
  'leaf-lime': { depth: 0.075, lift: 0.0, roughness: 0.42, metalness: 0.0, clearcoat: 0.5 },
  'globe-green': { depth: 0.075, lift: 0.012, roughness: 0.42, metalness: 0.0, clearcoat: 0.5 },
  'ring-gold': { depth: 0.09, lift: 0.026, roughness: 0.26, metalness: 0.12, clearcoat: 0.55 },
  'swoosh-pale': { depth: 0.058, lift: 0.05, roughness: 0.3, metalness: 0.02, clearcoat: 0.75 },
  'swoosh-mid': { depth: 0.058, lift: 0.072, roughness: 0.3, metalness: 0.02, clearcoat: 0.75 },
  'swoosh-deep': { depth: 0.058, lift: 0.094, roughness: 0.3, metalness: 0.02, clearcoat: 0.75 },
  kaf: { depth: 0.15, lift: 0.0, roughness: 0.34, metalness: 0.04, clearcoat: 0.6, perGlyph: true },
  tarim: { depth: 0.13, lift: 0.0, roughness: 0.34, metalness: 0.04, clearcoat: 0.6, perGlyph: true },
  'reg-inner': { depth: 0.08, lift: 0.0, roughness: 0.4, metalness: 0.0, clearcoat: 0.4 },
  'reg-ring': { depth: 0.08, lift: 0.0, roughness: 0.4, metalness: 0.0, clearcoat: 0.4 },
  strapline: {
    depth: 0.017,
    lift: 0.0,
    roughness: 0.66,
    metalness: 0.0,
    clearcoat: 0.06,
    bevel: false,
    curveSegments: 4,
  },
}

const EMBLEM = ['leaf-lime', 'globe-green', 'ring-gold', 'swoosh-pale', 'swoosh-mid', 'swoosh-deep']
const WORD = ['kaf', 'tarim', 'reg-inner', 'reg-ring']

/* ── tiny tween helpers ─────────────────────────────────────────────────── */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const outQuint = (t: number) => 1 - Math.pow(1 - t, 5)
const outCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const outBack = (t: number) => {
  const c = 1.44
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)
}
/** progress of a segment that runs from `start` for `dur` seconds */
const seg = (time: number, start: number, dur: number) => clamp01((time - start) / dur)
const mix = (a: number, b: number, t: number) => a + (b - a) * t

/* ── SVG parsing ────────────────────────────────────────────────────────── */

function parseGradients(svg: string): Map<string, Grad> {
  const out = new Map<string, Grad>()
  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml')
  doc.querySelectorAll('linearGradient').forEach((g) => {
    const stops = g.querySelectorAll('stop')
    if (stops.length < 2) return
    out.set(g.id, {
      x1: Number(g.getAttribute('x1')),
      y1: Number(g.getAttribute('y1')),
      x2: Number(g.getAttribute('x2')),
      y2: Number(g.getAttribute('y2')),
      c0: new THREE.Color().setStyle(stops[0].getAttribute('stop-color') ?? '#fff'),
      c1: new THREE.Color().setStyle(stops[stops.length - 1].getAttribute('stop-color') ?? '#fff'),
    })
  })
  return out
}

/**
 * SVG's y axis points down and three's points up.  Mirroring the geometry
 * reverses triangle winding, so the vertex order and the normals have to be
 * fixed up as well or every face renders inside-out.
 */
function flipY(geo: THREE.BufferGeometry) {
  const pos = geo.getAttribute('position') as THREE.BufferAttribute
  const nor = geo.getAttribute('normal') as THREE.BufferAttribute | undefined
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, -pos.getY(i))
    if (nor) nor.setY(i, -nor.getY(i))
  }
  const attrs = [pos, nor].filter(Boolean) as THREE.BufferAttribute[]
  const uv = geo.getAttribute('uv') as THREE.BufferAttribute | undefined
  if (uv) attrs.push(uv)
  for (const a of attrs) {
    const it = a.itemSize
    const arr = a.array as Float32Array
    for (let t = 0; t + 2 < a.count; t += 3) {
      for (let k = 0; k < it; k++) {
        const i = (t + 1) * it + k
        const j = (t + 2) * it + k
        const tmp = arr[i]
        arr[i] = arr[j]
        arr[j] = tmp
      }
    }
    a.needsUpdate = true
  }
  pos.needsUpdate = true
}

/**
 * Bake the path's gradient into vertex colours, darkening the extruded walls.
 *
 * `scale` is the SVG-unit -> world-unit factor already applied to the geometry:
 * the gradient endpoints are still in SVG user units, so they have to be
 * brought into the same space or every vertex lands at t=0 and the gradient
 * collapses to a flat colour.
 */
function paint(geo: THREE.BufferGeometry, grad: Grad | null, flat: THREE.Color, scale: number) {
  const pos = geo.getAttribute('position') as THREE.BufferAttribute
  const nor = geo.getAttribute('normal') as THREE.BufferAttribute | null
  const col = new Float32Array(pos.count * 3)
  const c = new THREE.Color()
  let dx = 0
  let dy = 0
  let len2 = 1
  let gx1 = 0
  let gy1 = 0
  if (grad) {
    gx1 = grad.x1 * scale
    gy1 = grad.y1 * scale
    dx = (grad.x2 - grad.x1) * scale
    dy = (grad.y2 - grad.y1) * scale
    len2 = dx * dx + dy * dy || 1
  }
  for (let i = 0; i < pos.count; i++) {
    if (grad) {
      // geometry is already flipped, so undo the mirror to sample in SVG space
      const x = pos.getX(i)
      const y = -pos.getY(i)
      const t = clamp01(((x - gx1) * dx + (y - gy1) * dy) / len2)
      c.copy(grad.c0).lerp(grad.c1, t)
    } else {
      c.copy(flat)
    }
    // side walls read a touch deeper - cheap, stable ambient occlusion
    if (nor) {
      const facing = Math.abs(nor.getZ(i))
      const k = 0.78 + 0.22 * facing
      c.multiplyScalar(k)
    }
    col[i * 3] = c.r
    col[i * 3 + 1] = c.g
    col[i * 3 + 2] = c.b
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
}

/* ── the animated pieces ────────────────────────────────────────────────── */

interface Piece {
  mesh: THREE.Mesh
  pivot: THREE.Group
  group: 'emblem' | 'word' | 'strap'
  /** left-to-right order within its group, drives the stagger */
  order: number
  /** resting local position of the mesh inside its pivot */
  rest: THREE.Vector3
  /** where the piece starts: inside the emblem */
  from: THREE.Vector3
  delay: number
  material: THREE.MeshPhysicalMaterial
}

export interface LogoSceneOptions {
  container: HTMLElement
  quality?: 'high' | 'low'
  onReady?: () => void
  onProgress?: (t: number) => void
  /** the GPU dropped the context; the host should show the flat mark instead */
  onContextLost?: () => void
}

export class LogoScene {
  readonly renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private root = new THREE.Group()
  private tilt = new THREE.Group()
  private pieces: Piece[] = []
  /** sweep plane: keeps everything to the LEFT of `constant` */
  private clip = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0)
  /** gate plane: permanently hides whatever is still tucked inside the emblem */
  private gate = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0)
  private clipFrom = 0
  private clipTo = 0
  private key!: THREE.DirectionalLight
  private rim!: THREE.DirectionalLight
  private hemi!: THREE.HemisphereLight
  private fill!: THREE.DirectionalLight
  private envTarget?: THREE.WebGLRenderTarget
  private raf = 0
  private last = 0
  private time = 0
  private pointer = new THREE.Vector2()
  private pointerTarget = new THREE.Vector2()
  private ro?: ResizeObserver
  private container: HTMLElement
  private disposed = false
  private reduced: boolean
  private visible = true
  private io?: IntersectionObserver
  private opts: LogoSceneOptions

  /** seconds; keep in sync with the caption timings in the hero */
  static readonly DURATION = 4.2

  constructor(opts: LogoSceneOptions) {
    this.opts = opts
    this.container = opts.container
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const quality = opts.quality ?? 'high'

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 2 : 1.5))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    // No filmic curve: the whole point of the mark is that its greens, gold
    // and blues come out at their exact brand values.  Brightness is dialled
    // in with light intensities instead.
    this.renderer.toneMapping = THREE.NoToneMapping
    this.renderer.localClippingEnabled = true
    this.renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:pan-y'
    this.container.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    this.camera.position.set(0, 0, 7.4)

    this.tilt.add(this.root)
    this.scene.add(this.tilt)

    this.buildLights()
    this.buildGeometry(quality)
    this.resize()

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(this.container)

    this.io = new IntersectionObserver(
      (entries) => {
        this.visible = entries.some((e) => e.isIntersecting)
      },
      { rootMargin: '120px' },
    )
    this.io.observe(this.container)

    window.addEventListener('pointermove', this.onPointerMove, { passive: true })
    window.addEventListener('scroll', this.invalidateRect, { passive: true })
    this.renderer.domElement.addEventListener('webglcontextlost', this.onContextLost)

    if (this.reduced) this.time = LogoScene.DURATION
    this.last = performance.now()
    this.applyFrame(this.time)
    this.renderer.render(this.scene, this.camera)
    this.raf = requestAnimationFrame(this.tick)
    opts.onReady?.()
  }

  /* ---------------------------------------------------------------- lights */

  private buildLights() {
    // A room IBL gives the extrusions believable reflections.  RoomEnvironment
    // is very bright, so it is dialled right down - the mark's own colours have
    // to survive, and scene.environmentIntensity (not material.envMapIntensity)
    // is the knob that actually governs scene-level IBL.
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    const room = new RoomEnvironment()
    this.envTarget = pmrem.fromScene(room, 0.04)
    this.scene.environment = this.envTarget.texture
    this.scene.environmentIntensity = 0.06
    room.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        m.geometry.dispose()
        for (const mat of Array.isArray(m.material) ? m.material : [m.material]) mat.dispose()
      }
    })
    pmrem.dispose()

    this.hemi = new THREE.HemisphereLight(0xf4f8ea, 0x2a3320, 0.56)
    this.scene.add(this.hemi)

    // Key light sits high and to the left so the extruded walls on the right
    // of every stroke stay readable.
    this.key = new THREE.DirectionalLight(0xffffff, 2.8)
    this.key.position.set(-3.4, 4.2, 5.2)
    this.scene.add(this.key)

    // Cool back-rim picks out the silhouette against a dark page.
    this.rim = new THREE.DirectionalLight(0xcfe9ff, 1.4)
    this.rim.position.set(5.4, -1.4, -3.2)
    this.scene.add(this.rim)

    this.fill = new THREE.DirectionalLight(0xe8f4c4, 0.62)
    this.fill.position.set(3.6, 0.9, 4.2)
    this.scene.add(this.fill)
  }

  /* -------------------------------------------------------------- geometry */

  private buildGeometry(quality: 'high' | 'low') {
    const grads = parseGradients(logoSvg)
    const data = new SVGLoader().parse(logoSvg)

    // viewBox is "0 0 W 100"; normalise so the mark is 1 unit tall.
    const vb = /viewBox="([^"]+)"/.exec(logoSvg)?.[1].split(/\s+/).map(Number) ?? [0, 0, 363, 100]
    const S = 1 / vb[3]
    const W = vb[2] * S

    const tmp = new THREE.Vector3()

    interface Raw {
      id: string
      shapes: THREE.Shape[]
      grad: Grad | null
      flat: THREE.Color
    }
    const raws: Raw[] = []

    for (const p of data.paths) {
      const node = p.userData?.node as SVGElement | undefined
      const id = node?.id ?? ''
      if (!SPEC[id]) continue
      const rawFill = node?.getAttribute('fill') ?? ''
      const m = /url\(#([^)]+)\)/.exec(rawFill)
      raws.push({
        id,
        shapes: p.toShapes(),
        grad: m ? (grads.get(m[1]) ?? null) : null,
        flat: new THREE.Color().setStyle(
          m ? (node?.getAttribute('data-solid') ?? '#888') : rawFill || '#888',
        ),
      })
    }

    // Emblem bounds drive the "grows out of the emblem" motion.
    const emblemBox = new THREE.Box2()
    for (const r of raws) {
      if (!EMBLEM.includes(r.id)) continue
      for (const s of r.shapes) {
        for (const pt of s.getPoints(8)) emblemBox.expandByPoint(pt)
      }
    }
    const emblemCx = ((emblemBox.min.x + emblemBox.max.x) / 2) * S
    const emblemCy = -((emblemBox.min.y + emblemBox.max.y) / 2) * S
    const emblemRight = emblemBox.max.x * S

    for (const r of raws) {
      const spec = SPEC[r.id]
      const group: Piece['group'] =
        EMBLEM.includes(r.id) ? 'emblem' : WORD.includes(r.id) ? 'word' : 'strap'

      const bevel = spec.bevel !== false && quality === 'high'
      // The gaps between the "tarım" glyphs are only a couple of SVG units
      // wide, so the bevel has to stay well under that or the letters fuse.
      const bevelSize = Math.min(spec.depth * 0.14, 0.006)
      const extrude: THREE.ExtrudeGeometryOptions = {
        depth: spec.depth / S,
        bevelEnabled: bevel,
        bevelThickness: (bevelSize * 1.5) / S,
        bevelSize: bevelSize / S,
        bevelOffset: 0,
        bevelSegments: quality === 'high' ? 3 : 2,
        curveSegments: spec.curveSegments ?? (quality === 'high' ? 12 : 8),
      }

      // One mesh per glyph for the wordmark, one mesh per path otherwise.
      const batches: THREE.Shape[][] = spec.perGlyph
        ? r.shapes.map((s) => [s])
        : [r.shapes]

      const ordered = batches
        .map((b) => {
          let cx = 0
          let n = 0
          for (const s of b) {
            for (const pt of s.getPoints(6)) {
              cx += pt.x
              n++
            }
          }
          return { b, cx: n ? cx / n : 0 }
        })
        .sort((a, z) => a.cx - z.cx)

      ordered.forEach(({ b }, i) => {
        const geo = new THREE.ExtrudeGeometry(b, extrude)
        geo.scale(S, S, S)
        flipY(geo)
        geo.computeBoundingBox()
        paint(geo, r.grad, r.flat, S)

        const material = new THREE.MeshPhysicalMaterial({
          vertexColors: true,
          roughness: spec.roughness,
          metalness: spec.metalness,
          clearcoat: spec.clearcoat,
          clearcoatRoughness: 0.3,
          envMapIntensity: 1,
          transparent: true,
          opacity: 1,
          side: THREE.FrontSide,
        })
        if (group !== 'emblem') material.clippingPlanes = [this.clip, this.gate]

        const mesh = new THREE.Mesh(geo, material)
        mesh.frustumCulled = false

        // recentre the mesh on its own bounds so it can be scaled/rotated in place
        const bb = geo.boundingBox!
        bb.getCenter(tmp)
        geo.translate(-tmp.x, -tmp.y, -tmp.z)
        const rest = new THREE.Vector3(tmp.x, tmp.y, tmp.z + spec.lift)

        const pivot = new THREE.Group()
        pivot.position.copy(rest)
        mesh.position.set(0, 0, 0)
        pivot.add(mesh)
        this.root.add(pivot)

        this.pieces.push({
          mesh,
          pivot,
          group,
          order: i,
          rest,
          // letters start tucked inside the emblem, behind its face
          from: new THREE.Vector3(emblemCx, emblemCy, -0.38),
          delay: 0,
          material,
        })
      })
    }

    // Centre the whole mark on the origin.
    this.root.position.set(-W / 2, 0.5, 0)

    // Stagger: emblem parts in draw order, glyphs left to right.
    const emblemPieces = this.pieces.filter((p) => p.group === 'emblem')
    emblemPieces.forEach((p, i) => (p.delay = i * 0.085))

    const wordPieces = this.pieces
      .filter((p) => p.group === 'word')
      .sort((a, b) => a.rest.x - b.rest.x)
    wordPieces.forEach((p, i) => (p.delay = 1.05 + i * 0.062))

    this.pieces
      .filter((p) => p.group === 'strap')
      .forEach((p) => (p.delay = 2.35))

    // Both planes live in world space, and the mark is centred on the origin.
    const emblemEdge = emblemRight - W / 2 - 0.015
    this.gate.constant = -emblemEdge
    this.clipFrom = emblemEdge
    this.clipTo = W / 2 + 0.4
    this.clip.constant = this.clipFrom
  }

  /* ------------------------------------------------------------- animation */

  private applyFrame(t: number) {
    const dur = 0.95

    for (const p of this.pieces) {
      const local = seg(t, p.delay, dur)

      if (p.group === 'emblem') {
        const e = outQuint(local)
        const back = outBack(local)
        p.pivot.position.set(
          mix(p.rest.x + (p.rest.x - 0.4) * 0.55, p.rest.x, e),
          mix(p.rest.y + 0.34, p.rest.y, e),
          mix(p.rest.z - 1.5, p.rest.z, e),
        )
        p.mesh.rotation.set(mix(0.55, 0, e), mix(-1.15, 0, e), mix(0.34, 0, e))
        const s = mix(0.42, 1, back)
        p.mesh.scale.setScalar(s)
        p.material.opacity = outCubic(seg(t, p.delay, 0.4))
      } else if (p.group === 'word') {
        const e = outQuint(local)
        p.pivot.position.lerpVectors(p.from, p.rest, e)
        p.mesh.rotation.set(0, mix(1.25, 0, outCubic(local)), 0)
        p.mesh.scale.setScalar(mix(0.18, 1, outBack(local)))
        p.material.opacity = outCubic(seg(t, p.delay, 0.3))
      } else {
        const e = outQuint(local)
        p.pivot.position.set(p.rest.x, mix(p.rest.y - 0.055, p.rest.y, e), p.rest.z)
        p.mesh.scale.setScalar(1)
        p.material.opacity = outCubic(seg(t, p.delay, 0.75))
      }
    }

    // The wordmark is revealed by a plane sweeping out of the emblem to the
    // right - the "içten sağa doğru" reveal.
    this.clip.constant = mix(this.clipFrom, this.clipTo, outQuint(seg(t, 1.02, 1.5)))

    // The whole mark settles from a three-quarter view to face-on.
    const settle = outQuint(seg(t, 0.05, 2.5))
    this.root.rotation.y = mix(-0.62, 0, settle)
    this.root.rotation.x = mix(0.24, 0, settle)
  }

  private rect: DOMRect | null = null

  private onPointerMove = (e: PointerEvent) => {
    const r = this.rect ?? (this.rect = this.container.getBoundingClientRect())
    if (!r.width) return
    // Clamped: a pointer far outside the canvas would otherwise swing the mark
    // through a huge angle.
    const c = (v: number) => (v < -1 ? -1 : v > 1 ? 1 : v)
    this.pointerTarget.set(
      c(((e.clientX - r.left) / r.width - 0.5) * 2),
      c(((e.clientY - r.top) / r.height - 0.5) * 2),
    )
  }

  private tick = () => {
    if (this.reduced) {
      // Nothing moves, so there is nothing to redraw.
      this.raf = 0
      return
    }
    this.raf = requestAnimationFrame(this.tick)
    const now = performance.now()
    const dt = Math.min((now - this.last) / 1000, 0.12)
    this.last = now
    if (!this.visible) return

    this.time += dt
    const t = this.reduced ? LogoScene.DURATION : this.time
    this.applyFrame(t)
    this.opts.onProgress?.(clamp01(t / LogoScene.DURATION))

    // idle life: pointer parallax plus a slow breathing drift
    this.pointer.lerp(this.pointerTarget, 1 - Math.pow(0.001, dt))
    const settled = clamp01((t - 2.0) / 1.2)
    const idle = this.reduced ? 0 : settled
    this.tilt.rotation.y = (this.pointer.x * 0.15 + Math.sin(t * 0.34) * 0.05) * idle
    this.tilt.rotation.x = (this.pointer.y * 0.09 + Math.cos(t * 0.28) * 0.028) * idle
    this.tilt.position.y = Math.sin(t * 0.5) * 0.018 * idle

    this.renderer.render(this.scene, this.camera)
  }

  /* ------------------------------------------------------------------ misc */

  setTheme(dark: boolean) {
    this.hemi.intensity = dark ? 0.5 : 0.62
    this.hemi.groundColor.set(dark ? 0x131a0f : 0x424c36)
    this.key.intensity = dark ? 2.85 : 2.7
    this.rim.intensity = dark ? 1.75 : 0.95
    this.fill.intensity = dark ? 0.56 : 0.68
    this.scene.environmentIntensity = dark ? 0.055 : 0.075
  }

  /** true when the visitor asked for reduced motion; the intro does not play */
  get isStatic() {
    return this.reduced
  }

  replay() {
    if (this.reduced) return
    this.time = 0
    this.last = performance.now()
    if (!this.raf) this.raf = requestAnimationFrame(this.tick)
  }

  /** Jump the choreography to an absolute time - used by tests and by the
   *  "skip intro" affordance. */
  seek(t: number) {
    this.time = t
    this.last = performance.now()
    this.applyFrame(t)
    this.renderer.render(this.scene, this.camera)
  }

  /** logical size of the mark plus the room its 3D rotation needs */
  private static readonly FIT_W = 4.0
  private static readonly FIT_H = 1.35

  private invalidateRect = () => {
    this.rect = null
  }

  private onContextLost = (e: Event) => {
    e.preventDefault()
    cancelAnimationFrame(this.raf)
    this.raf = 0
    this.opts.onContextLost?.()
  }

  private resize() {
    this.rect = null
    const w = this.container.clientWidth || 1
    const h = this.container.clientHeight || 1
    this.renderer.setSize(w, h, false)
    const aspect = w / h
    this.camera.aspect = aspect
    // Dolly so the mark fills a fixed fraction of whichever axis binds first.
    const fill = aspect < 2 ? 0.96 : 0.9
    const tan = Math.tan((this.camera.fov / 2) * THREE.MathUtils.DEG2RAD)
    const byW = LogoScene.FIT_W / 2 / (fill * tan * aspect)
    const byH = LogoScene.FIT_H / 2 / (fill * tan)
    this.camera.position.z = THREE.MathUtils.clamp(Math.max(byW, byH), 2.6, 24)
    this.camera.updateProjectionMatrix()
    // With reduced motion the render loop is idle, so redraw on resize.
    if (this.reduced && this.pieces.length) {
      this.applyFrame(LogoScene.DURATION)
      this.renderer.render(this.scene, this.camera)
    }
  }

  dispose() {
    if (this.disposed) return
    this.disposed = true
    cancelAnimationFrame(this.raf)
    this.ro?.disconnect()
    this.io?.disconnect()
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('scroll', this.invalidateRect)
    for (const p of this.pieces) {
      p.mesh.geometry.dispose()
      p.material.dispose()
    }
    this.envTarget?.dispose()
    this.scene.environment = null
    this.renderer.domElement.removeEventListener('webglcontextlost', this.onContextLost)
    this.renderer.dispose()
    // dispose() alone leaves the context alive; browsers cap how many a page
    // may hold, and this component remounts on every route change.
    this.renderer.forceContextLoss()
    this.renderer.domElement.remove()
  }
}

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}
