/**
 * Símbolo estático que ocupa o lugar do logo 3D quando a cena não entra em
 * quadro: sem WebGL, chunk que não carregou, ou erro dentro do canvas.
 *
 * Mora aqui, e não dentro do HeroLogo3D, porque um dos casos que ele cobre é
 * justamente o chunk lazy do 3D falhar — o fallback precisa estar no bundle
 * principal para continuar alcançável quando isso acontece.
 */
export function HeroLogoFallback() {
  return (
    <div className="hero-canvas hero-canvas--fallback" aria-hidden="true">
      <img src="/assets/techforge-symbol.png" alt="" />
    </div>
  )
}
