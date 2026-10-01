import { ArenaShape } from '../types/game';

export interface MapTheme {
  id: string;
  name: string;
  description: string;
  defaultShape: ArenaShape;
  bgGradient: [string, string, string];
  gridColor: string;
  borderColor: string;
  particleColor: string;
  bumperColor: string;
  iconName: string;
  frictionMultiplier: number;
  reboundMultiplier: number;
}

export const MAP_THEMES: MapTheme[] = [
  {
    id: 'magma',
    name: 'Magma Caldera',
    description: 'Volcanic arena with scorching embers and explosive kinetic bounce.',
    defaultShape: 'octagon',
    bgGradient: ['#2a0808', '#1a0404', '#080101'],
    gridColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: '#ef4444',
    particleColor: '#f97316',
    bumperColor: '#dc2626',
    iconName: 'Flame',
    frictionMultiplier: 0.992,
    reboundMultiplier: 1.08
  },
  {
    id: 'cyber',
    name: 'Cyber Neon Grid',
    description: 'High-tech digital matrix with energized walls and hyperspeed rails.',
    defaultShape: 'square',
    bgGradient: ['#031726', '#020b14', '#01050a'],
    gridColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: '#06b6d4',
    particleColor: '#38bdf8',
    bumperColor: '#0ea5e9',
    iconName: 'Cpu',
    frictionMultiplier: 0.995,
    reboundMultiplier: 1.12
  },
  {
    id: 'frozen',
    name: 'Frozen Abyss',
    description: 'Crystalline arctic glacier with frictionless ice and frostbite chimes.',
    defaultShape: 'circle',
    bgGradient: ['#082032', '#05131f', '#02070c'],
    gridColor: 'rgba(186, 230, 253, 0.12)',
    borderColor: '#38bdf8',
    particleColor: '#e0f2fe',
    bumperColor: '#7dd3fc',
    iconName: 'Snowflake',
    frictionMultiplier: 0.998,
    reboundMultiplier: 1.05
  },
  {
    id: 'cosmic',
    name: 'Cosmic Singularity',
    description: 'Deep galaxy arena with twinkling stars and subtle gravitational warp.',
    defaultShape: 'circle',
    bgGradient: ['#1e082b', '#100318', '#05010a'],
    gridColor: 'rgba(168, 85, 247, 0.14)',
    borderColor: '#a855f7',
    particleColor: '#c084fc',
    bumperColor: '#9333ea',
    iconName: 'Sparkles',
    frictionMultiplier: 0.994,
    reboundMultiplier: 1.10
  },
  {
    id: 'golden',
    name: 'Golden Coliseum',
    description: 'Regal Roman amphitheater with polished marble and celebratory banners.',
    defaultShape: 'hexagon',
    bgGradient: ['#241a06', '#140e03', '#080501'],
    gridColor: 'rgba(234, 179, 8, 0.12)',
    borderColor: '#eab308',
    particleColor: '#fde047',
    bumperColor: '#ca8a04',
    iconName: 'Trophy',
    frictionMultiplier: 0.993,
    reboundMultiplier: 1.07
  },
  {
    id: 'toxic',
    name: 'Toxic Mire',
    description: 'Caustic chemical reservoir with glowing radioactive hazard barriers.',
    defaultShape: 'octagon',
    bgGradient: ['#112206', '#091303', '#030801'],
    gridColor: 'rgba(132, 204, 22, 0.14)',
    borderColor: '#84cc16',
    particleColor: '#a3e635',
    bumperColor: '#65a30d',
    iconName: 'Biohazard',
    frictionMultiplier: 0.991,
    reboundMultiplier: 1.06
  }
];
