export type Service = {
  title: string
  description: string
  icon: 'globe' | 'settings' | 'workflow' | 'chart' | 'plug' | 'spark'
}

export const services: Service[] = [
  {
    title: 'Desenvolvimento Web',
    description:
      'Sites, landing pages e aplicações web com estrutura clara, performance e foco no objetivo do negócio.',
    icon: 'globe',
  },
  {
    title: 'Sistemas Personalizados',
    description:
      'Ferramentas sob medida para organizar processos internos, centralizar informações e apoiar a operação.',
    icon: 'settings',
  },
  {
    title: 'Automações',
    description:
      'Fluxos digitais para reduzir tarefas repetitivas, conectar etapas e ganhar eficiência.',
    icon: 'workflow',
  },
  {
    title: 'Dashboards e Painéis',
    description:
      'Interfaces de gestão para visualizar dados, indicadores e informações estratégicas com clareza.',
    icon: 'chart',
  },
  {
    title: 'Integrações',
    description:
      'Conexão entre sistemas, plataformas e serviços para sincronizar dados e simplificar rotinas.',
    icon: 'plug',
  },
  {
    title: 'Soluções Digitais',
    description:
      'Projetos que combinam web, sistemas e automação para resolver desafios específicos.',
    icon: 'spark',
  },
]
