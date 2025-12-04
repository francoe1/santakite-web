import { defineStore } from 'pinia'

export const useSiteStore = defineStore('site', {
  state: () => ({
    navItems: [
      { id: 'spot', label: 'Spot' },
      { id: 'mapa', label: 'Mapa' },
      { id: 'pronostico', label: 'Pronóstico' },
      { id: 'seguridad', label: 'Seguridad' },
      { id: 'contacto', label: 'Contacto' },
    ],
    spotHighlights: [
      {
        title: 'Santa Ana, Entre Ríos',
        description: 'Playa 52 es un spot abierto, sobre río, con espacio para armar y lanzar sin obstáculos.',
      },
      {
        title: 'Vientos útiles: S · SE · E',
        description: 'Direcciones limpias con entrada lateral; se evita navegar con norte fuerte o tormentas.',
      },
      {
        title: 'Terreno y orilla',
        description: 'Arena amplia y fondo parejo; permite delimitar zona de kites y separar bañistas.',
      },
    ],
    security: {
      intro:
        'Ordenamos el spot para proteger a navegantes y bañistas: zonas marcadas, comunicación clara y criterio conservador.',
      steps: [
        {
          title: 'Antes de armar',
          items: [
            'Revisar líneas, leash y que no haya obstáculos en la zona de despegue.',
            'Respetar la orientación recomendada: Sur, Sudeste o Este.',
            'Evitar lanzar si hay tormenta eléctrica o ráfagas cruzadas.',
          ],
        },
        {
          title: 'Durante la sesión',
          items: [
            'Usar la zona de kites para maniobras y mantener distancia de la orilla.',
            'Ceder prioridad a riders ya navegando y no cruzar la zona de bañistas.',
            'Si el viento cae, regresar por la franja marcada para evitar cruces.',
          ],
        },
        {
          title: 'Cierre de jornada',
          items: [
            'Bajar cometas en la zona señalada y revisar que no queden líneas desplegadas.',
            'Informar condiciones cambiantes al resto para ajustar el uso del spot.',
          ],
        },
      ],
    },
    contacts: [
      { label: 'WhatsApp', value: '+54 3456 479677' },
      { label: 'Instagram', value: 'instagram.com/santakitechajari' },
      { label: 'Ubicación', value: 'Playa 52 – Santa Ana, Entre Ríos' },
    ],
  }),
})
