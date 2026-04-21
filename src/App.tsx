import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cloud,
  Shirt,
  Briefcase,
  Gamepad2,
  Brain,
  Sparkles,
  Utensils,
  ChevronLeft,
  RotateCcw,
  Navigation,
  Plus,
  Trash2,
  Minus
} from 'lucide-react';
import { appConfig, Category, SubCategory, OptionDetail } from './constants';

// --- Types ---
type Page = 'hub' | 'primarySelect' | 'secondaryWheel' | 'result';

interface WeightedOption extends OptionDetail {
  weight: number;
}

// --- Components ---

const DynamicIcon = ({ name, className, size = 20 }: { name: string, className?: string, size?: number }) => {
  const IconMap: Record<string, any> = { 
    Cloud, Shirt, Briefcase, Gamepad2, Brain, Sparkles, Utensils, Navigation
  };
  const Icon = IconMap[name] || Cloud;
  return <Icon className={className} size={size} />;
};

const HubPage = ({ onSelect }: { onSelect: (c: Category) => void }) => {
  const [expandingId, setExpandingId] = useState<string | null>(null);

  const handleSelect = (cat: Category) => {
    setExpandingId(cat.id);
    setTimeout(() => onSelect(cat), 300);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence>
        {expandingId && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 25, opacity: 1 }}
            className="fixed inset-0 z-50 pointer-events-none rounded-full"
            style={{ 
              backgroundColor: appConfig.categories.find(c => c.id === expandingId)?.color,
              transition: { duration: 0.3, ease: 'linear' }
            }}
          />
        )}
      </AnimatePresence>

      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-12 text-center z-10 px-6"
      >
        <span className="text-[10px] font-medium tracking-[0.6em] opacity-40 mb-3 block uppercase tracking-widest">Personal Assistant</span>
        <h1 className="text-6xl font-black tracking-tighter">小决定</h1>
        <span className="text-[12px] font-bold tracking-widest opacity-20 block mt-1 uppercase">Tiny Decision</span>
      </motion.header>

      <div className="flex flex-wrap justify-center gap-12 max-w-lg px-10 relative z-10 mt-40">
        {appConfig.categories.map((cat, idx) => (
          <motion.button
            key={cat.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: [0, -15, 0],
              transition: { 
                delay: idx * 0.05,
                y: { repeat: Infinity, duration: 4 + idx, ease: 'easeInOut' }
              }
            }}
            whileHover={{ scale: 1.1 }}
            onClick={() => handleSelect(cat)}
            className="w-28 h-28 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center gap-1 group transition-all"
            style={{ backgroundColor: cat.color }}
          >
            <DynamicIcon name={cat.icon} className="opacity-40 group-hover:scale-125 transition-transform" size={28} />
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold tracking-widest opacity-80">{cat.name}</span>
              <span className="text-[9px] font-bold tracking-widest opacity-30 uppercase">{cat.nameEn}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const PrimarySelectPage = ({ title, items, onSelect, onBack }: { title: string, items: SubCategory[], onSelect: (sub: SubCategory) => void, onBack: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-10 pt-32">
      <button onClick={onBack} className="fixed top-12 left-10 p-4 rounded-full bg-white/40 shadow-sm hover:bg-white transition-all z-20">
        <ChevronLeft size={24} />
      </button>

      <div className="text-center mb-16 px-6">
        <h2 className="text-5xl font-black tracking-tighter mb-4">{title}</h2>
        <div className="w-16 h-1 bg-black/5 mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
        {items.map((sub, idx) => (
          <motion.button
            key={sub.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: idx * 0.05 } }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(sub)}
            className="p-8 rounded-[40px] bg-white harmless-shadow flex flex-col items-center justify-center gap-1 transition-all hover:shadow-xl"
          >
             <div className="flex flex-col items-center">
               <span className="text-xl font-black tracking-tight">{sub.name}</span>
               <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{sub.nameEn}</span>
             </div>
             <span className="text-[10px] font-bold opacity-10 uppercase tracking-widest mt-2">
               {sub.children ? `${sub.children.length} 子类` : `${sub.options?.length || 0} 选项`}
             </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const CustomizableWheelPage = ({ subCategory, onResult, onBack }: { subCategory: SubCategory, onResult: (res: WeightedOption) => void, onBack: () => void }) => {
  const [options, setOptions] = useState<WeightedOption[]>(
    (subCategory.options || []).map(opt => ({ ...opt, weight: 1 }))
  );
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [totalWeight, setTotalWeight] = useState(0);

  useEffect(() => {
    const total = options.reduce((sum, opt) => sum + opt.weight, 0);
    setTotalWeight(total);
  }, [options]);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    const spins = 8 + Math.floor(Math.random() * 5);
    const extraDegrees = Math.floor(Math.random() * 360);
    const target = rotation + (spins * 360) + extraDegrees;
    setRotation(target);

    setTimeout(() => {
      setIsSpinning(false);
      const normalized = 360 - (target % 360);
      let currentAngle = 0;
      for (const opt of options) {
        const sliceAngle = (opt.weight / totalWeight) * 360;
        if (normalized >= currentAngle && normalized < currentAngle + sliceAngle) {
          onResult(opt);
          break;
        }
        currentAngle += sliceAngle;
      }
    }, 4500);
  };

  const colors = ['#FFD1DC', '#FFF9DB', '#B2F2BB', '#A5D8FF', '#E0C3FC'];

  const adjustWeight = (index: number, delta: number) => {
    setOptions(prev => {
      const next = [...prev];
      next[index].weight = Math.max(1, next[index].weight + delta);
      return next;
    });
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(prev => prev.filter((_, i) => i !== index));
  };

  const addOption = () => {
    const name = `新选项 ${options.length + 1}`;
    setOptions(prev => [...prev, { name, weight: 1 }]);
  };

  const updateName = (index: number, name: string) => {
    setOptions(prev => {
      const next = [...prev];
      next[index].name = name;
      return next;
    });
  };

  // Generate conical gradient
  const getGradient = () => {
    let currentDegree = 0;
    const parts: string[] = [];
    options.forEach((opt, i) => {
      const slice = (opt.weight / totalWeight) * 360;
      const start = currentDegree;
      const end = currentDegree + slice;
      parts.push(`${colors[i % colors.length]} ${start}deg ${end}deg`);
      currentDegree = end;
    });
    return `conic-gradient(${parts.join(', ')})`;
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-6 pt-24 overflow-y-auto pb-40">
      <button onClick={onBack} className="fixed top-12 left-10 p-4 rounded-full bg-white/40 shadow-sm hover:bg-white transition-all z-20">
        <ChevronLeft size={24} />
      </button>

      <div className="text-center mb-12">
        <h2 className="text-4xl font-black tracking-tighter mb-2">{subCategory.name}</h2>
        <p className="text-[10px] font-bold opacity-30 tracking-[0.4em] uppercase">Custom Decision Wheel</p>
      </div>

      <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center shrink-0 mb-12">
        <div className="absolute top-0 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-black/10" />

        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4.5, ease: [0.12, 0, 0.39, 0] }}
          className="w-full h-full rounded-full shadow-2xl overflow-hidden flex items-center justify-center relative border-8 border-white/80"
          style={{ background: getGradient() }}
        >
          {options.map((opt, i) => {
             let sliceAngle = (opt.weight / totalWeight) * 360;
             let currentAngle = 0;
             for (let j = 0; j < i; j++) {
               currentAngle += (options[j].weight / totalWeight) * 360;
             }
             const midAngle = currentAngle + (sliceAngle / 2);
             
             return (
               <div 
                 key={i}
                 className="absolute inset-0 flex items-center justify-center pointer-events-none"
                 style={{ transform: `rotate(${midAngle}deg) translateY(-100px) rotate(-${midAngle}deg)` }}
               >
                 <span className="font-extrabold text-[9px] tracking-widest text-black/40 uppercase whitespace-nowrap">
                   {opt.name}
                 </span>
               </div>
             );
          })}
        </motion.div>

        <button 
          onClick={spin}
          disabled={isSpinning}
          className="absolute z-30 w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          <RotateCcw className={`w-8 h-8 opacity-10 ${isSpinning ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-between items-center px-4">
          <span className="text-[11px] font-black opacity-30 tracking-widest uppercase">配置选项 ({options.length})</span>
          <button onClick={addOption} className="p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors">
            <Plus size={16} className="opacity-40" />
          </button>
        </div>

        <div className="space-y-3">
          {options.map((opt, i) => (
            <motion.div 
              layout
              key={i} 
              className="p-5 rounded-[30px] bg-white harmless-shadow flex items-center gap-4 group"
            >
              <input 
                value={opt.name}
                onChange={(e) => updateName(i, e.target.value)}
                className="flex-grow bg-transparent border-none focus:outline-none font-bold text-sm tracking-tight"
              />
              
              <div className="flex items-center gap-2 bg-black/5 px-3 py-1.5 rounded-full">
                <button onClick={() => adjustWeight(i, -1)} className="hover:opacity-100 opacity-40"><Minus size={14}/></button>
                <span className="text-xs font-black min-w-[20px] text-center">{opt.weight}</span>
                <button onClick={() => adjustWeight(i, 1)} className="hover:opacity-100 opacity-40"><Plus size={14}/></button>
              </div>

              <button 
                onClick={() => removeOption(i)}
                className="p-2 text-red-500/30 group-hover:text-red-500/60 transition-colors"
                disabled={options.length <= 2}
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ResultPage = ({ 
  result, 
  categoryName, 
  subCategoryName, 
  onRestart 
}: { 
  result: WeightedOption | OptionDetail | string, 
  categoryName: string,
  subCategoryName: string,
  onRestart: () => void 
}) => {
  const [showCongrats, setShowCongrats] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const resultName = typeof result === 'string' ? result : result.name;
  const resultAttr = typeof result === 'string' ? null : (result as OptionDetail).attr;
  const resultMeta = typeof result === 'string' ? null : (result as OptionDetail).meta;

  useEffect(() => {
    const fetchSuggestion = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/suggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: categoryName,
            subCategory: subCategoryName,
            result: resultName
          })
        });
        const data = await response.json();
        setAiSuggestion(data.suggestion);
      } catch (error) {
        console.error('Failed to fetch AI suggestion:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestion();
  }, [categoryName, subCategoryName, resultName]);

  const handleDone = () => {
    setTimeout(() => {
      setShowCongrats(true);
    }, 1000);
  };

  useEffect(() => {
    if (showCongrats) {
      const timer = setTimeout(() => {
        onRestart();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCongrats, onRestart]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-10 bg-white/10 relative">
      <AnimatePresence>
        {!showCongrats ? (
          <motion.div 
            key="result-card"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className="w-full max-w-sm rounded-[50px] bg-white p-12 harmless-shadow flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-macaron-mint/20" />
            
            <span className="text-[10px] font-bold tracking-[0.6em] opacity-20 mb-10 uppercase">Resolution Ready</span>
            
            <h2 className="text-5xl font-black mb-6 tracking-tight">{resultName}</h2>
            
            {(resultAttr || resultMeta) && (
              <div className="flex gap-4 items-center mb-4">
                {resultAttr && <span className="text-3xl filter grayscale opacity-40">{resultAttr}</span>}
                {resultMeta && <span className="text-[11px] font-black opacity-30 bg-black/5 px-4 py-2 rounded-full tracking-widest">{resultMeta}</span>}
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center gap-2 mt-4 animate-pulse">
                <Sparkles size={16} className="text-yellow-500 opacity-50" />
                <span className="text-[11px] font-bold opacity-20 tracking-widest uppercase">AI 正在思考...</span>
              </div>
            ) : aiSuggestion && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 px-6 py-4 bg-yellow-50/50 rounded-2xl border border-yellow-100/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-yellow-600 opacity-60" />
                  <span className="text-[10px] font-black text-yellow-700/40 tracking-widest uppercase">小决定 AI 建议</span>
                </div>
                <p className="text-sm font-medium text-yellow-900/70 leading-relaxed italic">
                  “{aiSuggestion}”
                </p>
              </motion.div>
            )}

            <div className="w-full h-px bg-black/5 my-10" />

            <button 
              onClick={handleDone}
              className="w-full py-6 rounded-full bg-black text-white font-bold tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase"
            >
              就这么办
            </button>
            
            <button onClick={onRestart} className="mt-8 text-[11px] font-black tracking-widest opacity-20 hover:opacity-100 hover:text-black transition-all">
              回到岛屿
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="congrats-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-[#FDEFF4] flex flex-col items-center justify-center p-10"
          >
            <h2 
              className="text-4xl md:text-5xl font-black mb-12 text-center"
              style={{ 
                color: 'transparent',
                WebkitTextStroke: '2px #5D4037', // Dark brown
              }}
            >
              恭喜你做好决定了
            </h2>

            <button 
              onClick={onRestart}
              className="px-12 py-5 rounded-full bg-white shadow-lg text-[11px] font-black tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity"
            >
              回到首页
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [page, setPage] = useState<Page>('hub');
  const [category, setCategory] = useState<Category | null>(null);
  const [drillDownSub, setDrillDownSub] = useState<SubCategory | null>(null);
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [result, setResult] = useState<WeightedOption | OptionDetail | string | null>(null);
  const [bgColor, setBgColor] = useState('var(--color-island-bg)');

  const reset = () => {
    setPage('hub');
    setCategory(null);
    setDrillDownSub(null);
    setSubCategory(null);
    setResult(null);
    setBgColor('var(--color-island-bg)');
  };

  return (
    <div 
      className="fixed inset-0 flex flex-col transition-colors duration-1000"
      style={{ backgroundColor: bgColor }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'linear' }}
          className="w-full h-full"
        >
          {page === 'hub' && (
            <HubPage onSelect={(cat) => {
              setCategory(cat);
              setBgColor(`${cat.color}44`);
              setPage('primarySelect');
            }} />
          )}

          {page === 'primarySelect' && category && (
            <PrimarySelectPage 
              title={drillDownSub ? drillDownSub.name : category.name}
              items={drillDownSub ? (drillDownSub.children || []) : category.subCategories} 
              onBack={() => {
                if (drillDownSub) {
                  setDrillDownSub(null);
                } else {
                  setPage('hub');
                  setBgColor('var(--color-island-bg)');
                }
              }}
              onSelect={(sub) => {
                if (sub.children && sub.children.length > 0) {
                  setDrillDownSub(sub);
                } else if (sub.options) {
                  setSubCategory(sub);
                  setPage('secondaryWheel');
                }
              }}
            />
          )}

          {page === 'secondaryWheel' && subCategory && (
            <CustomizableWheelPage 
              subCategory={subCategory} 
              onBack={() => setPage('primarySelect')}
              onResult={(res) => {
                setResult(res);
                setPage('result');
              }}
            />
          )}

          {page === 'result' && result && (
            <ResultPage 
              result={result} 
              categoryName={category?.name || ''}
              subCategoryName={subCategory?.name || drillDownSub?.name || ''}
              onRestart={reset} 
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
