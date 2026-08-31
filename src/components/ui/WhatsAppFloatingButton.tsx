const WHATSAPP_MESSAGE = 'Olá! Vim pelo site da TechForge e quero saber mais sobre os serviços.'
const WHATSAPP_URL = `https://wa.me/5535984752062?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

function WhatsAppIcon() {
  return (
    <svg
      className="whatsapp-floating-button__icon"
      aria-hidden="true"
      viewBox="0 0 24 24"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.9-9.89a9.84 9.84 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.9 7c0 5.45-4.44 9.88-9.9 9.88m8.43-18.31A11.82 11.82 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.59 0 11.94-5.36 11.94-11.94 0-3.19-1.24-6.19-3.52-8.4"
      />
    </svg>
  )
}

export function WhatsAppFloatingButton() {
  return (
    <a
      className="whatsapp-floating-button"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a TechForge pelo WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  )
}
