// Humor para cada estado del viento. Se elige uno por día y spot, y se puede cambiar tocando.
const JOKES = {
  loading: ['Consultando al viento… dice que ya viene.', 'Preguntándole al río cómo anda de humor.'],
  error: ['El viento no contesta. Capaz está de siesta.', 'Sin datos. Mirá las banderas del club, a la antigua.'],
  calm: [
    'Yo quería navegar, pero no sopla…',
    'El kite está listo. El viento, de vacaciones.',
    'Hoy el viento está de licencia sin goce de sueldo.',
    'Sin viento, el kite es un barrilete caro.',
    'Spoiler: no sopla. Andá poniendo el agua para el mate.',
    'Hoy se navega… en el celular.',
  ],
  almost: [
    'Casi, casi… el viento prometió venir. Como siempre.',
    'Falta poquito. Andá armando igual, nadie te juzga.',
    'Un soplido más y arrancamos. Soplá vos, dale.',
  ],
  crossed: [
    'Hay viento, pero viene de donde no debe. Un clásico.',
    'Viento cruzado: el kite quiere ir para un lado y el viento para el otro.',
    'Sopla, sí. Pero del lado equivocado. Qué viento caprichoso.',
  ],
  rain: [
    'Hay viento, pero también agua de arriba. Doble mojada.',
    'Llueve: hoy el río viene con servicio completo.',
  ],
  night: [
    'Navegar de noche es de valientes… o de tontos.',
    'Hasta el viento se fue a dormir. Volvé con luz.',
  ],
  ok: [
    '¡Hoy sopla! Avisale al jefe que hay reunión externa.',
    'Viento: ✔. Excusa para faltar al laburo: pendiente.',
    'Se acabó el mate, empezó el kite.',
    'Dejá todo. Hoy se navega.',
  ],
  strong: [
    'Hoy sopla fuerte: cometa chica y cabeza grande.',
    'Si te sacás los anteojos, te los devuelve el viento en Uruguay.',
  ],
  weekendYes: [
    'Finde con viento: cancelá el asado, o hacelo en la playa.',
    'El finde sopla. Avisale a la familia que no hay plan B.',
  ],
  dayYes: [
    'Ese día sopla. Andá avisando en el laburo.',
    'Día de viento: inventá una excusa buena.',
    'Anotá la fecha: ese día se navega.',
  ],
  dayMaybe: [
    'Ventana cortita: llegá con todo armado.',
    'Poquito viento, pero alcanza para el mate y una pasada.',
  ],
  dayNo: [
    'Ese día no sopla: ideal para asado y siesta.',
    'Ese día el río descansa. Vos también.',
    'Sin viento ese día. El kite se queda en el bolso.',
  ],
  notfound: ['Buscamos esta página y no hay ni una brisa.', 'Esta URL se fue a navegar y no dejó dirección.'],
  weekendMaybe: ['Finde dudoso: llevá el kite y también el mate, por las dudas.'],
  weekendNo: [
    'Finde sin viento: ideal para el asado y la siesta.',
    'Sábado y domingo en calma. El río descansa, vos también.',
  ],
}

const hash = (str) => [...String(str)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

export const pickJoke = (key, seed = '', bump = 0) => {
  const list = JOKES[key] ?? JOKES.calm
  return list[(hash(`${key}${seed}`) + bump) % list.length]
}
