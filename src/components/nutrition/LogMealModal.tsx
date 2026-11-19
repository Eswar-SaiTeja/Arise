import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  Plus, 
  X, 
  Check, 
  Utensils, 
  Flame, 
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { FoodItem, MealSlot, LoggedFoodEntry } from '../../types/nutrition';
import { nutritionStorage } from '../../services/nutritionStorage';
import { useBrand } from '../../context/BrandContext';

interface LogMealModalProps {
  isOpen: boolean;
  initialSlot?: MealSlot;
  onClose: () => void;
  onLogged: () => void;
}

export const LogMealModal: React.FC<LogMealModalProps> = ({
  isOpen,
  initialSlot = 'breakfast',
  onClose,
  onLogged,
}) => {
  const { currentTheme } = useBrand();
  const [foods, setFoods] = useState<FoodItem[]>(() => nutritionStorage.getFoodDatabase());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [portionQuantity, setPortionQuantity] = useState<number>(1);
  const [selectedSlot, setSelectedSlot] = useState<MealSlot>(initialSlot);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const filteredFoods = foods.filter(food => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = food.name.toLowerCase().includes(q);
      const matchRegional = food.regionalName?.toLowerCase().includes(q) || false;
      const matchCategory = food.category.toLowerCase().includes(q);
      if (!matchName && !matchRegional && !matchCategory) return false;
    }
    if (selectedCategory === 'indian' && food.cuisine !== 'indian') return false;
    if (selectedCategory === 'veg' && !food.isVegetarian) return false;
    if (selectedCategory === 'protein' && food.proteinGrams < 10) return false;
    return true;
  });

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
  };

  const handleLogFood = () => {
    if (!selectedFood || isSubmitting) return;
    setIsSubmitting(true);

    const calories = Math.round(selectedFood.caloriesPerServing * portionQuantity);
    const protein = Math.round(selectedFood.proteinGrams * portionQuantity * 10) / 10;
    const carbs = Math.round(selectedFood.carbsGrams * portionQuantity * 10) / 10;
    const fat = Math.round(selectedFood.fatGrams * portionQuantity * 10) / 10;
    const fiber = Math.round(selectedFood.fiberGrams * portionQuantity * 10) / 10;

    const entry: LoggedFoodEntry = {
      id: 'log-' + Date.now(),
      slot: selectedSlot,
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      portionQuantity,
      servingUnit: selectedFood.servingUnit,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    nutritionStorage.logFoodEntry(entry);
    setIsSubmitting(false);
    onLogged();
    onClose();
  };

  const slots: { id: MealSlot; label: string }[] = [
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'mid_morning', label: 'Mid-Morning' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'evening_snack', label: 'Evening Snack' },
    { id: 'dinner', label: 'Dinner' }
  ];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#121624] border border-[#252E42] rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#252E42] pb-4">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${currentTheme.accentColor}15`,
                color: currentTheme.accentColor,
                border: `1px solid ${currentTheme.accentColor}30`
              }}
            >
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-display">Log Food & Nutrition</h3>
              <p className="text-xs text-gray-400">Search verified items or custom meals</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meal Slot Picker */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0E121E] border border-white/5 overflow-x-auto">
          {slots.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSlot(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                selectedSlot === s.id
                  ? 'bg-lime-accent text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search food by name, regional dish (Idli, Paneer, Dosa, Chicken, Dal)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0D15] border border-[#252E42] text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-lime-accent"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono pb-1">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'indian', label: 'Indian Classics' },
              { id: 'protein', label: 'High Protein (10g+)' },
              { id: 'veg', label: 'Pure Veg' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white/10 border-white/30 text-white font-bold'
                    : 'bg-transparent border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items Catalog */}
        <div className="max-h-56 overflow-y-auto divide-y divide-white/5 border border-[#222A3E] rounded-2xl bg-[#0A0D15]">
          {filteredFoods.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400 font-mono">
              No matching foods found. Try searching for generic items like 'Rice', 'Egg', 'Dal', or 'Paneer'.
            </div>
          ) : (
            filteredFoods.map((f) => {
              const isSelected = selectedFood?.id === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => handleSelectFood(f)}
                  className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-lime-accent/10 border-l-2 border-lime-accent' : 'hover:bg-white/5'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{f.name}</span>
                      {f.regionalName && (
                        <span className="text-[10px] text-gray-400 font-mono">({f.regionalName})</span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono">Serving: {f.servingUnit}</span>
                  </div>

                  <div className="flex items-center gap-2 text-right shrink-0">
                    <div className="text-xs font-mono">
                      <span className="text-amber-400 font-bold block">{f.caloriesPerServing} kcal</span>
                      <span className="text-[10px] text-gray-400">{f.proteinGrams}g P | {f.carbsGrams}g C | {f.fatGrams}g F</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-lime-accent" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Portion Selector & Totals Preview */}
        {selectedFood && (
          <div className="p-4 rounded-2xl bg-[#0E131F] border border-lime-accent/30 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white font-display block">{selectedFood.name}</span>
                <span className="text-[11px] text-gray-400 font-mono">Select Servings / Multiplier</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[0.5, 1, 1.5, 2].map((q) => (
                  <button
                    key={q}
                    onClick={() => setPortionQuantity(q)}
                    className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      portionQuantity === q
                        ? 'bg-lime-accent text-black'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {q}x
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Macros Preview */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5 text-center font-mono">
              <div className="bg-black/30 p-2 rounded-xl">
                <span className="text-[10px] text-gray-400 block">Calories</span>
                <span className="text-sm font-bold text-amber-400">
                  {Math.round(selectedFood.caloriesPerServing * portionQuantity)} kcal
                </span>
              </div>
              <div className="bg-black/30 p-2 rounded-xl">
                <span className="text-[10px] text-gray-400 block">Protein</span>
                <span className="text-sm font-bold text-blue-400">
                  {Math.round(selectedFood.proteinGrams * portionQuantity * 10) / 10}g
                </span>
              </div>
              <div className="bg-black/30 p-2 rounded-xl">
                <span className="text-[10px] text-gray-400 block">Carbs</span>
                <span className="text-sm font-bold text-emerald-400">
                  {Math.round(selectedFood.carbsGrams * portionQuantity * 10) / 10}g
                </span>
              </div>
              <div className="bg-black/30 p-2 rounded-xl">
                <span className="text-[10px] text-gray-400 block">Fats</span>
                <span className="text-sm font-bold text-purple-400">
                  {Math.round(selectedFood.fatGrams * portionQuantity * 10) / 10}g
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-gray-400 hover:text-white text-xs font-mono"
          >
            Cancel
          </button>
          <button
            disabled={!selectedFood}
            onClick={handleLogFood}
            style={{
              backgroundColor: selectedFood ? currentTheme.accentColor : '#374151',
              boxShadow: selectedFood ? `0 0 15px -3px ${currentTheme.glowColor}` : 'none'
            }}
            className="px-6 py-2.5 rounded-xl text-black font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add to {selectedSlot.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
