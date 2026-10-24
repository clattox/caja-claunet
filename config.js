// ============================================================
//  CONFIG.JS — Editar aquí antes de cada evento
// ============================================================

const EVENTO = {
  nombre: '🎵 Escuela de Talentos',
  fecha: '2026-10-24',
};

const CATEGORIAS = [
  {
    id: 'comida',
    label: '🍔 Para la guatita',
    productos: [
      { id: 'papas',        emoji: '🍟', nombre: 'Papas Fritas',       precio: 1500 },
      { id: 'salchipapas',  emoji: '🌭', nombre: 'Salchipapas',        precio: 3000 },
      { id: 'completo',     emoji: '🌮', nombre: 'Completo Italiano',   precio: 2500 },
      { id: 'empanadas',    emoji: '🥟', nombre: 'Empanadas pino',      precio: 2500 },
      { id: 'sopaipillas',  emoji: '🫓', nombre: 'Sopaipillas',         precio: 1000 },
      { id: 'sopaipa_agr',  emoji: '🫓+',nombre: 'Sopaipillas +Agr.',   precio: 1500 },
      { id: 'anticuchos',   emoji: '🍢', nombre: 'Anticuchos',          precio: 3000 },
      { id: 'choripan',     emoji: '🥖', nombre: 'Choripán',            precio: 2000 },
      { id: 'choripan_pro', emoji: '🥖⭐',nombre: 'Choripán Pro',       precio: 3000 },
      { id: 'queque',       emoji: '🍰', nombre: 'Trocitos de Queque',  precio: 1000 },
      { id: 'helado_agua',  emoji: '🧊', nombre: 'Helado de Agua',      precio: 500  },
    ]
  },
  {
    id: 'bebida',
    label: '🥤 Bebestibles',
    productos: [
      { id: 'bebida_lata',  emoji: '🥤', nombre: 'Bebida Lata',        precio: 1500 },
      { id: 'jugo',         emoji: '🧃', nombre: 'Jugo',               precio: 500  },
      { id: 'cerveza',      emoji: '🍺', nombre: 'Cerveza 470cc',      precio: 2000 },
      { id: 'michelada',    emoji: '🍻', nombre: 'Michelada 500cc',    precio: 3000 },
      { id: 'te_cafe',      emoji: '☕', nombre: 'Té / Café',          precio: 1000 },
      { id: 'mote',         emoji: '🥤', nombre: 'Mote con Huesillo',  precio: 2500 },
      { id: 'borgona',      emoji: '🍷', nombre: 'Borgoña',            precio: 2500 },
      { id: 'terremoto',    emoji: '🌪️', nombre: 'Terremoto',          precio: 3500 },
    ]
  },
  {
    id: 'otros',
    label: '🎉 Otros',
    productos: [
      { id: 'helado_beb',   emoji: '🍦', nombre: 'Helado con Bebida',  precio: 3000 },
    ]
  }
];
