import React, { useState } from 'react';
import { soundManager } from '../utils/audioSystem';
import { SupportedLanguage } from '../i18n/translations';
import { 
  ShoppingBag, 
  Lock, 
  Gem, 
  Sparkles, 
  Clock, 
  Glasses, 
  Crown, 
  Smile, 
  Check, 
  AlertCircle,
  ShieldAlert,
  Flame,
  ArrowRight,
  Info
} from 'lucide-react';

interface AccessoryItem {
  id: string;
  category: 'gorros' | 'gafas' | 'bigotes' | 'reliquias';
  name: string;
  description: string;
  icon: string;
  priceEmeralds: number;
  rarity: 'Común' | 'Rara' | 'Épica' | 'Legendaria';
}

const ACCESSORIES_CATALOG: AccessoryItem[] = [
  // GORROS (Hats & Helmets)
  {
    id: 'hat-tophat',
    category: 'gorros',
    name: 'Sombrero de Copa Aristócrata',
    description: 'Sombrero victoriano de satén negro pulido para canicas elegantes.',
    icon: '🎩',
    priceEmeralds: 75,
    rarity: 'Rara'
  },
  {
    id: 'hat-cap',
    category: 'gorros',
    name: 'Gorra Urbana Streetwear',
    description: 'Gorra con visera plana y pegatina dorada estilo rapero urbano.',
    icon: '🧢',
    priceEmeralds: 50,
    rarity: 'Común'
  },
  {
    id: 'hat-crown',
    category: 'gorros',
    name: 'Corona Imperial de Oro y Rubíes',
    description: 'Corona señorial forjada con metales sagrados de la arena.',
    icon: '👑',
    priceEmeralds: 250,
    rarity: 'Legendaria'
  },
  {
    id: 'hat-viking',
    category: 'gorros',
    name: 'Casco Vikingo del Valhalla',
    description: 'Casco con cuernos de hierro nórdico para embestir con furia.',
    icon: '🪖',
    priceEmeralds: 120,
    rarity: 'Épica'
  },
  {
    id: 'hat-cowboy',
    category: 'gorros',
    name: 'Sombrero Vaquero del Salvaje Oeste',
    description: 'Auténtico sombrero tejano de cuero para duelos al amanecer.',
    icon: '🤠',
    priceEmeralds: 90,
    rarity: 'Rara'
  },
  {
    id: 'hat-wizard',
    category: 'gorros',
    name: 'Gorro de Archimago Astral',
    description: 'Cono de terciopelo morado bordado con constelaciones mágicas.',
    icon: '🧙',
    priceEmeralds: 160,
    rarity: 'Épica'
  },

  // GAFAS (Glasses & Visors)
  {
    id: 'glasses-sunglasses',
    category: 'gafas',
    name: 'Gafas de Sol Clásicas Wayfarer',
    description: 'Lentes oscuros con filtro UV que otorgan +100 de estilo.',
    icon: '🕶️',
    priceEmeralds: 60,
    rarity: 'Común'
  },
  {
    id: 'glasses-monocle',
    category: 'gafas',
    name: 'Monóculo de Oro 24K',
    description: 'Lente individual con cadena de oro para examinar rivales con clase.',
    icon: '🧐',
    priceEmeralds: 95,
    rarity: 'Rara'
  },
  {
    id: 'glasses-cyber',
    category: 'gafas',
    name: 'Visor Holográfico Cyberpunk',
    description: 'Pantalla HUD neon con telemetría de trayectorias en tiempo real.',
    icon: '🥽',
    priceEmeralds: 180,
    rarity: 'Épica'
  },
  {
    id: 'glasses-snorkel',
    category: 'gafas',
    name: 'Gafas de Buceo Submarino',
    description: 'Lentes impermeables herméticos con tubo de respiración.',
    icon: '🤿',
    priceEmeralds: 70,
    rarity: 'Común'
  },
  {
    id: 'glasses-aviator',
    category: 'gafas',
    name: 'Gafas de Aviador de Combate',
    description: 'Montura de titanio dorado diseñada para velocidades hipersónicas.',
    icon: '✈️',
    priceEmeralds: 110,
    rarity: 'Rara'
  },

  // BIGOTES (Mustaches & Beards)
  {
    id: 'mustache-dali',
    category: 'bigotes',
    name: 'Bigote Dalí Puntiagudo',
    description: 'Bigote encerado con puntas curvas apuntando hacia el infinito.',
    icon: '🥸',
    priceEmeralds: 65,
    rarity: 'Común'
  },
  {
    id: 'mustache-charro',
    category: 'bigotes',
    name: 'Bigote Mexicano Charro',
    description: 'Bigote frondoso y tupido con carácter indomable de cantina.',
    icon: '🧔',
    priceEmeralds: 85,
    rarity: 'Rara'
  },
  {
    id: 'mustache-gentleman',
    category: 'bigotes',
    name: 'Bigote Inglés Barón',
    description: 'Arreglo impecable de caballero inglés para canicas nobles.',
    icon: '✨',
    priceEmeralds: 90,
    rarity: 'Rara'
  },
  {
    id: 'mustache-vikingbeard',
    category: 'bigotes',
    name: 'Barba Vikinga Trenzada',
    description: 'Larga barba espesa con abalorios rúnicos de batalla.',
    icon: '🪓',
    priceEmeralds: 150,
    rarity: 'Épica'
  },
  {
    id: 'mustache-villain',
    category: 'bigotes',
    name: 'Perilla de Villano Maquiavélico',
    description: 'Bigotillo afilado y perilla siniestra para maestros del caos.',
    icon: '😈',
    priceEmeralds: 130,
    rarity: 'Épica'
  },

  // RELIQUIAS (Relics & Auras)
  {
    id: 'relic-emeraldaura',
    category: 'reliquias',
    name: 'Aura Carmesí de Esmeraldas Rojas',
    description: 'Halo radiante de gemas incandescentes que sigue tu estela.',
    icon: '💎',
    priceEmeralds: 300,
    rarity: 'Legendaria'
  },
  {
    id: 'relic-cape',
    category: 'reliquias',
    name: 'Capa de Campeón Cósmico',
    description: 'Capa ondulante con polvo de estrellas que ondea al rodar.',
    icon: '🧣',
    priceEmeralds: 220,
    rarity: 'Legendaria'
  }
];

interface ShopComingSoonViewProps {
  onGoToBattle?: () => void;
  onGoToGacha?: () => void;
  currentLang?: SupportedLanguage;
}

export const ShopComingSoonView: React.FC<ShopComingSoonViewProps> = ({
  onGoToBattle,
  onGoToGacha,
  currentLang = 'es'
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'gorros' | 'gafas' | 'bigotes' | 'reliquias'>('all');
  const [selectedItemToast, setSelectedItemToast] = useState<string | null>(null);

  const filteredItems = activeCategory === 'all' 
    ? ACCESSORIES_CATALOG 
    : ACCESSORIES_CATALOG.filter(item => item.category === activeCategory);

  const handleItemClick = (item: AccessoryItem) => {
    soundManager.playMarbleClick(0.4);
    setSelectedItemToast(`🔒 "${item.name}" estará disponible próximamente en la tienda por ${item.priceEmeralds} Esmeraldas Rojas.`);
    setTimeout(() => {
      setSelectedItemToast(null);
    }, 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-500/10 via-red-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold">
            <ShoppingBag className="w-3.5 h-3.5 text-rose-400" />
            <span>TIENDA DE ACCESORIOS & COSMÉTICOS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Tienda de Canicas</span>
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
              Próximamente
            </span>
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            ¡Personaliza el aspecto de tus canicas favoritas con accesorios exclusivos! Equipa gorros, gafas, bigotes y auras legendarias desbloqueándolos con la nueva moneda de la arena: las <span className="text-rose-400 font-bold">Esmeraldas Rojas</span>.
          </p>
        </div>

        {/* Currency Display Pill (Esmeraldas Rojas) in disabled grey */}
        <div className="flex items-center flex-wrap gap-3 relative z-10">
          <div className="px-5 py-3 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center gap-3 shadow-inner">
            <div className="w-9 h-9 rounded-xl bg-rose-950/40 border border-rose-900/60 flex items-center justify-center text-rose-500/60">
              <Gem className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500 block font-bold">
                Moneda Cosmética
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-slate-400 font-mono">0</span>
                <span className="text-xs font-bold text-slate-500">Esmeraldas Rojas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent PRÓXIMAMENTE Banner Alert */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
            <Clock className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-xs space-y-0.5">
            <div className="flex items-center gap-2 font-mono font-bold text-slate-300">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] border border-rose-500/30">
                PRÓXIMAMENTE
              </span>
              <span>Todos los accesorios están bloqueados en gris</span>
            </div>
            <p className="text-slate-500">
              Los accesorios y las Esmeraldas Rojas se desbloquearán en la siguiente gran actualización de contenido.
            </p>
          </div>
        </div>

        {selectedItemToast && (
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-rose-500/40 text-xs font-mono text-rose-300 animate-in fade-in slide-in-from-right duration-200 shadow-lg">
            {selectedItemToast}
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'Todos los Accesorios', icon: '✨' },
          { id: 'gorros', label: 'Gorros & Cascos', icon: '🎩' },
          { id: 'gafas', label: 'Gafas & Visores', icon: '🕶️' },
          { id: 'bigotes', label: 'Bigotes & Barbas', icon: '🥸' },
          { id: 'reliquias', label: 'Reliquias & Auras', icon: '👑' }
        ].map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playMarbleClick(0.4);
                setActiveCategory(cat.id as any);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-slate-200 border border-slate-700 shadow-md'
                  : 'bg-slate-950/60 text-slate-500 hover:text-slate-300 hover:bg-slate-900 border border-slate-800/80'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Greyed Out Locked Accessories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map(item => {
          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-lg relative overflow-hidden group transition-all duration-200 hover:border-slate-700 cursor-pointer grayscale opacity-80 hover:opacity-95"
            >
              {/* Lock Badge in Top Right */}
              <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/90 border border-slate-800 text-[10px] font-mono font-bold text-slate-400">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Bloqueado</span>
              </div>

              {/* Rarity Tag */}
              <div className="text-[10px] font-mono font-black uppercase text-slate-500 tracking-wider mb-3">
                {item.rarity} · {item.category.toUpperCase()}
              </div>

              {/* Item Avatar Icon */}
              <div className="w-20 h-20 mx-auto my-2 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-center text-4xl shadow-inner relative group-hover:scale-105 transition-transform">
                <span className="select-none filter drop-shadow">{item.icon}</span>
                <div className="absolute inset-0 bg-slate-950/40 rounded-2xl backdrop-blur-[1px] flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-slate-900/90 border border-slate-700 flex items-center justify-center text-slate-400 shadow">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="text-center space-y-1 mt-3">
                <h3 className="text-sm font-bold text-slate-300 truncate">
                  {item.name}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Price in Esmeraldas Rojas (in Grey) & Próximamente CTA */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-xs font-bold">
                  <Gem className="w-3.5 h-3.5 text-slate-500" />
                  <span>{item.priceEmeralds} Esmeraldas</span>
                </div>

                <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono font-black uppercase tracking-wider text-slate-500 group-hover:text-slate-300 transition-colors">
                  Próximamente
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-2xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
          <Gem className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-white">¿Cómo se conseguirán las Esmeraldas Rojas?</h4>
        <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
          Las Esmeraldas Rojas serán una recompensa especial que podrás obtener al alcanzar rangos elevados en el Modo Competitivo (Oro, Diamante y Maestro), completando misiones semanales o participando en torneos de la comunidad.
        </p>
      </div>
    </div>
  );
};
