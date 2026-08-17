export type Service = {
  title: string
  description: string
  icon: 'globe' | 'settings' | 'workflow' | 'chart' | 'plug' | 'spark'
}

export const services: Service[] = [
  {
    title: 'Criação de sites',
    description:
      'Sites e aplicações com estrutura clara, performance e foco no negócio.',
    icon: 'globe',
  },
  {
    title: 'Desenvolvimento de programas',
    description:
      'Ferramentas sob medida para organizar processos e centralizar informações.',
    icon: 'settings',
  },
  {
    title: 'Automações',
    description:
      'Fluxos digitais para reduzir tarefas repetitivas e ganhar eficiência.',
    icon: 'workflow',
  },
  {
    title: 'Dashboards e Painéis',
    description:
      'Interfaces para visualizar dados e indicadores com clareza.',
    icon: 'chart',
  },
  {
    title: 'Integrações',
    description:
      'Conexão entre sistemas para sincronizar dados e simplificar rotinas.',
    icon: 'plug',
  },
  {
    title: 'Soluções Digitais',
    description:
      'Web, sistemas e automação para desafios específicos.',
    icon: 'spark',
  },
]
