import { defineStore } from 'pinia'

export const useSiteStore = defineStore('site', {
  state: () => ({
    navItems: [
      { id: 'servicios', label: 'Servicios' },
      { id: 'spot', label: 'Spot' },
      { id: 'seguridad', label: 'Seguridad' },
      { id: 'agenda', label: 'Agenda' },
      { id: 'contacto', label: 'Contacto' },
    ],
    metrics: [
      { label: 'Años enseñando', value: '+10' },
      { label: 'Alumnos certificados', value: '+400' },
      { label: 'Días de viento al año', value: '250' },
      { label: 'Equipo listo para usar', value: 'Quivers Cabrinha' },
    ],
    services: [
      {
        title: 'Clases personalizadas',
        description:
          'Coaching 1:1 o grupos reducidos con radios BBTalkin, demos en tierra y drills en agua para progresar rápido y seguro.',
        tag: 'Clases',
      },
      {
        title: 'Downwind guiados',
        description:
          'Recorridos premium hasta el parador Oeste con bote de apoyo opcional, briefing de ruta y rescate disponible.',
        tag: 'Aventura',
      },
      {
        title: 'Gear listo',
        description:
          'Kites de la escuela listos con barra ajustada, lines chequeadas y control de quivers según condiciones.',
        tag: 'Equipo',
      },
      {
        title: 'Wingfoil y foil',
        description:
          'Sesiones asistidas en foil con zonas despejadas, casco, chaleco de impacto y casco con audio.',
        tag: 'Especial',
      },
    ],
    spotHighlights: [
      {
        title: 'Playa 52, Punta Lara',
        description: 'Spot seguro, amplio, con guardavidas y fácil acceso desde CABA y La Plata.',
      },
      {
        title: 'Orientación E / SE',
        description: 'Viento limpio y side-on: ideal para aprender y navegar con margen de seguridad.',
      },
      {
        title: 'Marea y profundidad',
        description: 'Banco largo y agua al pecho: mucho espacio útil y recates sencillos.',
      },
    ],
    security: {
      intro:
        'Protocolos claros para que cada sesión sea impecable: chequeos previos, comunicación continua y cobertura en agua.',
      steps: [
        {
          title: 'Checklist previo',
          items: [
            'Revisión de líneas, leash, inflado y trimado del kite.',
            'Briefing rápido de condiciones, regla de prioridad y zonas de maniobra.',
            'Asignación de casco con audio y chaleco de impacto cuando corresponde.',
          ],
        },
        {
          title: 'En el agua',
          items: [
            'Asistencia en lanzamiento y body drag controlado para alumnos.',
            'Seguimiento con radios BBTalkin y puntos de referencia en la costa.',
            'Downwind con pick-up y soporte en bote cuando hay derivada fuerte.',
          ],
        },
        {
          title: 'Después de navegar',
          items: [
            'Debrief corto con feedback accionable y drills para la próxima sesión.',
            'Registro de condiciones y equipo usado para ajustar el próximo setup.',
          ],
        },
      ],
    },
    agenda: [
      {
        title: 'Temporada alta',
        detail: 'De octubre a marzo: mayor probabilidad de SE constante y tardes largas.',
      },
      {
        title: 'Mejor ventana del día',
        detail: 'Mediodía a 18 hs: térmicas marcadas, agua más plana y menos deriva.',
      },
      {
        title: 'Cuándo suspender',
        detail: 'Norte fuerte, sudestadas con tormenta eléctrica o ráfagas cruzadas.',
      },
      {
        title: 'Reserva',
        detail: 'Coordinamos por WhatsApp con pronóstico confirmado y backup date.',
      },
    ],
    equipment: [
      'Kites Cabrinha, barras ajustadas y líneas revisadas cada semana.',
      'Boards twin-tip, surf y foil listos con footstraps y pads en buen estado.',
      'Chalecos de impacto, cascos con audio y leash de board incluidos.',
      'Trajes y neoprene opcionales según la estación.',
    ],
    contacts: [
      { label: 'WhatsApp', value: '+54 9 11 3778-7151' },
      { label: 'Instagram', value: '@santakite' },
      { label: 'Ubicación', value: 'Playa 52 – Punta Lara' },
    ],
  }),
})
