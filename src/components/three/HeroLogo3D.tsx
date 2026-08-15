import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Group, MathUtils, Mesh, MeshStandardMaterial } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const MODEL_URL = '/models/techforge-logo.glb'

/**
 * O hero roda em duas fases:
 *   1. queda  — conduzida pelo scroll: o logo entra de fora da tela e para no
 *      centro, sozinho em cena, até `FALL_END` do trilho;
 *   2. recuo  — conduzido por tempo, não por scroll: assim que o texto começa a
 *      ser escrito o scroll trava, então ele sobe e encolhe sozinho para abrir
 *      espaço.
 */
const START_Y = 5.4
const CENTER_Y = 0
const RAISED_Y = 1.1

/**
 * A queda não começa em 0: os primeiros 9% do trilho pertencem à tela de
 * boas-vindas, que some por volta de 0.071 (ver .hero-welcome no styles.css).
 * O logo fica parado fora de quadro até lá.
 */
const FALL_START = 0.09
const FALL_END = 0.78

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

type ThreePerformanceProfile = {
  antialias: boolean
  dpr: [number, number]
  extraLights: boolean
  mode: 'desktop' | 'mobile'
}

const get3DPerformanceProfile = (): ThreePerformanceProfile => {
  if (typeof window === 'undefined') {
    return { antialias: true, dpr: [1, 1], extraLights: true, mode: 'desktop' }
  }

  const isTouchScreen = window.matchMedia('(pointer: coarse)').matches
  const isMobileWidth = window.matchMedia('(max-width: 900px)').matches

  if (isTouchScreen || isMobileWidth) {
    return { antialias: false, dpr: [1, 1], extraLights: false, mode: 'mobile' }
  }

  return { antialias: true, dpr: [1, 1], extraLights: true, mode: 'desktop' }
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const range = (value: number, start: number, end: number) =>
  MathUtils.clamp((value - start) / (end - start), 0, 1)

function LogoModel() {
  const { scene } = useLoader(GLTFLoader, MODEL_URL)

  const model = useMemo(() => {
    const clone = scene.clone(true)

    clone.traverse((child) => {
      if (!(child instanceof Mesh)) return
      const material = Array.isArray(child.material) ? child.material[0] : child.material
      const isAccent = (material?.name ?? '').includes('azul')

      child.material = isAccent
        ? new MeshStandardMaterial({
            color: '#0b3d94',
            metalness: 0.55,
            roughness: 0.28,
            emissive: '#1f6dff',
            emissiveIntensity: 0.6,
          })
        : new MeshStandardMaterial({
            color: '#e9edf3',
            metalness: 0.94,
            roughness: 0.24,
            envMapIntensity: 1.5,
          })
    })

    return clone
  }, [scene])

  return <primitive object={model} />
}

type FallingLogoProps = HeroLogo3DProps & {
  mobile: boolean
  onMotionRest: () => void
}

function FallingLogo({ mobile, onMotionRest, progress, revealed }: FallingLogoProps) {
  const group = useRef<Group>(null)
  const settleRef = useRef(0)
  const wasMoving = useRef(true)
  const viewport = useThree((state) => state.viewport)
  const reduced = useMemo(prefersReducedMotion, [])

  // o logo deitado no Blender (extrusão em Z) precisa encarar a câmera
  const baseRotationX = Math.PI / 2
  const isNarrow = viewport.width < 4.8
  const scale = isNarrow
    ? MathUtils.clamp(viewport.width / 6.2, 0.42, 0.58)
    : MathUtils.clamp(viewport.width / 9.5, 0.38, 0.72)
  const raisedY = isNarrow ? 1.45 : RAISED_Y

  useFrame((state, delta) => {
    const node = group.current
    if (!node) return

    const raw = reduced ? 1 : progress.current
    const fall = easeOutCubic(range(raw, FALL_START, FALL_END))

    // recuo por tempo: o scroll está travado enquanto o texto é escrito
    settleRef.current = reduced
      ? 1
      : MathUtils.damp(settleRef.current, revealed ? 1 : 0, 3.2, delta)
    const settle = easeInOut(settleRef.current)

    const t = state.clock.elapsedTime
    const idle = reduced || mobile ? 0 : fall
    const pointerX = mobile ? 0 : state.pointer.x
    const pointerY = mobile ? 0 : state.pointer.y

    // fase 1: cai de fora da tela até o centro / fase 2: sobe para liberar o texto
    const targetY =
      MathUtils.lerp(START_Y, CENTER_Y, fall) +
      (raisedY - CENTER_Y) * settle +
      Math.sin(t * 0.9) * 0.06 * idle
    const targetZ = MathUtils.lerp(-1.6, 0, fall)

    // tombo: chega inclinado e assenta de frente, com leve balanço depois
    const targetRotX = MathUtils.lerp(baseRotationX + 0.6, baseRotationX, fall) +
      Math.sin(t * 0.5) * 0.04 * idle -
      pointerY * 0.08 * fall
    const targetRotY = MathUtils.lerp(-0.7, 0, fall) +
      Math.sin(t * 0.6) * 0.07 * idle +
      pointerX * 0.14 * fall
    const targetRotZ = MathUtils.lerp(0.28, 0, fall)

    node.position.y = MathUtils.damp(node.position.y, targetY, 6, delta)
    node.position.z = MathUtils.damp(node.position.z, targetZ, 6, delta)
    node.rotation.x = MathUtils.damp(node.rotation.x, targetRotX, 5, delta)
    node.rotation.y = MathUtils.damp(node.rotation.y, targetRotY, 5, delta)
    node.rotation.z = MathUtils.damp(node.rotation.z, targetRotZ, 5, delta)

    const targetScale = scale * MathUtils.lerp(0.86, 1, fall) * MathUtils.lerp(1, 0.8, settle)
    node.scale.setScalar(MathUtils.damp(node.scale.x, targetScale, 6, delta))

    if (mobile) {
      const isMoving =
        Math.abs(node.position.y - targetY) > 0.002 ||
        Math.abs(node.position.z - targetZ) > 0.002 ||
        Math.abs(node.rotation.x - targetRotX) > 0.002 ||
        Math.abs(node.rotation.y - targetRotY) > 0.002 ||
        Math.abs(node.rotation.z - targetRotZ) > 0.002 ||
        Math.abs(node.scale.x - targetScale) > 0.002

      if (wasMoving.current && !isMoving) {
        wasMoving.current = false
        onMotionRest()
      } else if (isMoving) {
        wasMoving.current = true
      }
    }
  })

  return (
    <group ref={group} position={[0, START_Y, -1.6]} rotation={[baseRotationX + 0.6, -0.7, 0.28]}>
      <LogoModel />
    </group>
  )
}

type HeroLogo3DProps = {
  progress: RefObject<number>
  revealed: boolean
}

function Lighting({ lowPower }: { lowPower: boolean }) {
  return (
    <>
      <ambientLight intensity={0.62} />
      <hemisphereLight args={['#f5f8ff', '#0b1020', 0.6]} />
      <directionalLight position={[4, 6, 6]} intensity={2.4} />
      {!lowPower ? (
        <>
          <directionalLight position={[-6, 2, -4]} intensity={1.8} color="#2f7bff" />
          <pointLight position={[0, 2.4, 4]} intensity={0.85} color="#ffffff" />
        </>
      ) : null}
    </>
  )
}

function CanvasSizeSync({ target }: { target: RefObject<HTMLDivElement | null> }) {
  const invalidate = useThree((state) => state.invalidate)
  const setSize = useThree((state) => state.setSize)

  useEffect(() => {
    const node = target.current
    if (!node || typeof ResizeObserver === 'undefined') return

    let raf = 0
    const sync = () => {
      raf = 0
      const { height, width } = node.getBoundingClientRect()
      if (width <= 0 || height <= 0) return
      setSize(width, height)
      invalidate()
    }

    const scheduleSync = () => {
      if (!raf) raf = requestAnimationFrame(sync)
    }

    const observer = new ResizeObserver(scheduleSync)
    observer.observe(node)
    scheduleSync()

    return () => {
      if (raf) cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [invalidate, setSize, target])

  return null
}

const supportsWebGL = () => {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    // o contexto de teste tem que ser devolvido na hora: o Chrome só permite
    // ~16 contextos vivos e mata os mais antigos — inclusive o do hero
    context?.getExtension('WEBGL_lose_context')?.loseContext()
    return Boolean(context)
  } catch {
    return false
  }
}

export function HeroLogo3D({ progress, revealed }: HeroLogo3DProps) {
  const webgl = useMemo(supportsWebGL, [])
  const performance3D = useMemo(get3DPerformanceProfile, [])
  const shell = useRef<HTMLDivElement>(null)
  const isMobileMode = performance3D.mode === 'mobile'
  const [isCanvasVisible, setIsCanvasVisible] = useState(true)
  const [isDocumentVisible, setIsDocumentVisible] = useState(() =>
    typeof document === 'undefined' ? true : document.visibilityState === 'visible',
  )
  const [isMotionActive, setIsMotionActive] = useState(true)

  useEffect(() => {
    const node = shell.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        setIsCanvasVisible(visible)
        if (visible) setIsMotionActive(true)
      },
      { rootMargin: '120% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onVisibilityChange = () => {
      const visible = document.visibilityState === 'visible'
      setIsDocumentVisible(visible)
      if (visible) setIsMotionActive(true)
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  useEffect(() => {
    if (!isMobileMode) return

    const wakeMotion = () => setIsMotionActive((current) => (current ? current : true))

    window.addEventListener('scroll', wakeMotion, { passive: true })
    window.addEventListener('resize', wakeMotion)
    window.addEventListener('orientationchange', wakeMotion)

    return () => {
      window.removeEventListener('scroll', wakeMotion)
      window.removeEventListener('resize', wakeMotion)
      window.removeEventListener('orientationchange', wakeMotion)
    }
  }, [isMobileMode])

  if (!webgl) {
    return (
      <div className="hero-canvas hero-canvas--fallback">
        <img src="/assets/techforge-symbol.png" alt="" />
      </div>
    )
  }

  const frameloop =
    isCanvasVisible && isDocumentVisible && (!isMobileMode || isMotionActive)
      ? 'always'
      : 'demand'

  return (
    <div className="hero-canvas" aria-hidden="true" ref={shell}>
      <Canvas
        frameloop={frameloop}
        camera={{ position: [0, 0, 9], fov: 32 }}
        /**
         * Teto em 1.5 e não 2: com o fundo virando shader de tela cheia, cada
         * pixel passou a custar uma amostra de textura mais grade e degradês.
         * Em tela retina o 2x dobrava esse custo por quadro e o ganho visual
         * num fundo escuro e desfocado é mínimo.
         */
        dpr={performance3D.dpr}
        gl={{
          antialias: performance3D.antialias,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        /**
         * O padrão do r3f mede o container com `scroll: true` e debounce de
         * 50ms. Dentro do palco sticky do hero essa primeira medida se perde e
         * o canvas fica travado em 300x150 com a cena nunca renderizada — só
         * volta se a janela for redimensionada. Medir direto resolve.
         */
        resize={{ scroll: false, debounce: 0 }}
      >
        <Suspense fallback={null}>
          <CanvasSizeSync target={shell} />
          <Lighting lowPower={!performance3D.extraLights} />
          <FallingLogo
            mobile={isMobileMode}
            onMotionRest={() => setIsMotionActive(false)}
            progress={progress}
            revealed={revealed}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

useLoader.preload(GLTFLoader, MODEL_URL)
