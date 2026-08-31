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
      'Site premium com agendamento online.',
    image: '/assets/site-barbeiro-preview.jpg',
    technologies: [],
    link: 'https://site-barbeiro-eight.vercel.app/',
  },
  {
    title: 'Jimenez Milhas',
    category: 'Website / Sistema',
    description:
      'Compra, venda e emissão com milhas aéreas.',
    image: '/assets/jimenez-milhas-preview.jpg',
    technologies: [],
    link: 'https://jimenez-milhas.vercel.app/',
  },
  {
    title: 'EscamBook',
    category: 'Website / Plataforma',
    description:
      'Plataforma brasileira para troca gratuita de livros.',
    image: '/assets/escambook-preview.jpg',
    technologies: [],
    link: 'https://escambook.com.br/',
  },
]
