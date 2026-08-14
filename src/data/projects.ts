export type Project = {
  title: string
  category: string
  description: string
  image: string
  technologies: string[]
  link: string
}

export const projects: Project[] = [
  {
    title: 'Barbearia Elite',
    category: 'Website / Agendamento',
    description:
      'Site de barbearia com apresentação premium e fluxo de agendamento online.',
    image: '/assets/site-barbeiro-preview.png',
    technologies: [],
    link: 'https://site-barbeiro-eight.vercel.app/',
  },
  {
    title: 'Jimenez Milhas',
    category: 'Website / Sistema',
    description:
      'Site para compra, venda e emissão com milhas aéreas, com apresentação clara do serviço.',
    image: '/assets/jimenez-milhas-preview.png',
    technologies: [],
    link: 'https://jimenez-milhas.vercel.app/',
  },
  {
    title: 'EscamBook',
    category: 'Website / Plataforma',
    description:
      'Plataforma brasileira para troca gratuita de livros, conectando leitores de forma simples.',
    image: '/assets/escambook-preview.png',
    technologies: [],
    link: 'https://escambook.com.br/',
  },
]
