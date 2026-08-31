export type TeamMember = {
  name: string
  role: string
  bio: string
  image: string
  linkedin: string
  github: string
}

export const team: TeamMember[] = [
  {
    name: 'Henrique Rodrigues',
    role: 'Desenvolvedor',
    bio: 'Perfil profissional e projetos no GitHub.',
    image: '/assets/henrique-rodrigues.png',
    linkedin:
      'https://www.linkedin.com/in/henrique-rodrigues-a4194a351?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    github: 'https://github.com/Henri-7',
  },
  {
    name: 'Pedro Santos',
    role: 'Desenvolvedor',
    bio: 'Perfil profissional e projeto Jimenez Milhas.',
    image: '/assets/pedro-santos.png',
    linkedin: 'https://www.linkedin.com/in/pedro-santos-89551a382',
    github: 'https://github.com/PedroVitorSM',
  },
  {
    name: 'Allana Gimenez Machado',
    role: 'Desenvolvedora',
    bio: 'Perfil profissional e projetos no GitHub.',
    image: '/assets/allana-gimenez.png',
    linkedin: 'https://www.linkedin.com/in/allana-gimenez-machado-765b94256/',
    github: 'https://github.com/allanagimenez15',
  },
]
