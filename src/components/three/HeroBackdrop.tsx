import { useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, type RefObject } from 'react'
import { NoColorSpace, Vector2 } from 'three'

const TEXTURE_URL = '/assets/hero-background.webp'

/**
 * Fundo do hero em WebGL. Roda dentro do mesmo <Canvas> do logo — um contexto
 * só — e desenha antes de tudo (`renderOrder` -10 + depthTest desligado).
 *
 * O shader reproduz exatamente o que antes eram três camadas de CSS
 * (a imagem, a grade de 96px e os degradês de escurecimento) e por cima disso
 * anima: respiro nas diagonais azuis, uma faixa de luz que percorre a
 * diagonal, deriva lenta da imagem e parallax de mouse.
 *
 * A textura é lida como NoColorSpace de propósito: assim os valores chegam
 * crus ao framebuffer e o fundo fica pixel a pixel igual ao que o CSS pintava.
 */

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const backdropVertex = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }
`

const backdropFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uTexAspect;
  uniform float uTime;
  uniform float uProgress;

  varying vec2 vUv;

  const vec3 SHADE = vec3(18.0, 18.0, 20.0) / 255.0;
  const vec3 GRID = vec3(0.961);
  const vec3 GLOW = vec3(0.12, 0.42, 1.0);

  void main() {
    float screenAspect = uResolution.x / uResolution.y;

    // enquadramento "cover", igual ao background-size: cover
    vec2 fit = screenAspect > uTexAspect
      ? vec2(1.0, uTexAspect / screenAspect)
      : vec2(screenAspect / uTexAspect, 1.0);
    vec2 uv = (vUv - 0.5) * fit + 0.5;

    // zoom conduzido pelo scroll, com origem em 60%/40% (herdado do CSS)
    vec2 origin = vec2(0.6, 0.6);
    uv = (uv - origin) / (1.0 + uProgress * 0.07) + origin;

    // deriva lenta + parallax de mouse
    uv += vec2(sin(uTime * 0.05) * 0.006, cos(uTime * 0.043) * 0.005);
    uv += uPointer * vec2(-0.008, 0.008);

    vec3 color = texture2D(uTexture, uv).rgb;

    // máscara das diagonais: pixels claros e puxados para o azul
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    float mask = smoothstep(0.05, 0.30, luma) *
      clamp((color.b - max(color.r, color.g)) * 4.0, 0.0, 1.0);

    // respiro constante nas diagonais
    color += GLOW * mask * (0.10 + 0.08 * sin(uTime * 0.55));

    // faixa de luz percorrendo o sentido da diagonal
    float axis = dot(vUv, normalize(vec2(0.78, -0.62)));
    float travel = fract(axis * 0.85 - uTime * 0.055);
    float band = smoothstep(0.0, 0.05, travel) * (1.0 - smoothstep(0.05, 0.24, travel));
    color += GLOW * mask * band * 0.7;

    // grade de 96px, esmaecendo até 62% da altura (era .hero-stage::before)
    vec2 cell = vUv * uResolution / 96.0;
    vec2 line = 1.0 - smoothstep(vec2(0.0), fwidth(cell), fract(cell));
    float grid = max(line.x, line.y) * smoothstep(0.38, 1.0, vUv.y);
    color = mix(color, GRID, 0.035 * grid);

    // degradês de escurecimento (era .hero-stage::after)
    float y = 1.0 - vUv.y;
    float horizontal = 0.6 * (1.0 - clamp(vUv.x / 0.55, 0.0, 1.0));
    float vertical = mix(
      mix(0.5, 0.0, clamp(y / 0.30, 0.0, 1.0)),
      0.86 * clamp((y - 0.30) / 0.48, 0.0, 1.0),
      step(0.30, y)
    );
    color = mix(color, SHADE, horizontal);
    color = mix(color, SHADE, vertical);

    gl_FragColor = vec4(color, 1.0);
  }
`

type HeroBackdropProps = {
  progress: RefObject<number>
}

export function HeroBackdrop({ progress }: HeroBackdropProps) {
  const texture = useTexture(TEXTURE_URL)
  const size = useThree((state) => state.size)
  const reduced = useMemo(prefersReducedMotion, [])

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uResolution: { value: new Vector2(1, 1) },
      uPointer: { value: new Vector2(0, 0) },
      uTexAspect: { value: 1 },
      uTime: { value: 0 },
      uProgress: { value: 0 },
    }),
    [texture],
  )

  // valores crus: sem conversão de espaço de cor, o fundo sai idêntico ao CSS
  useMemo(() => {
    texture.colorSpace = NoColorSpace
    const image = texture.image as { width: number; height: number } | undefined
    uniforms.uTexAspect.value = image ? image.width / image.height : 1
  }, [texture, uniforms])

  useFrame((state, delta) => {
    uniforms.uResolution.value.set(size.width, size.height)
    uniforms.uProgress.value = reduced ? 1 : progress.current
    if (reduced) return

    uniforms.uTime.value += delta
    uniforms.uPointer.value.lerp(state.pointer, 0.05)
  })

  return (
    <mesh frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={backdropVertex}
        fragmentShader={backdropFragment}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

useTexture.preload(TEXTURE_URL)
