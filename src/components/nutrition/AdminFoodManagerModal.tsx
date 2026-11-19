import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  X, 
  Check, 
  Search,
  Database,
  Utensils
} from 'lucide-react';
import { FoodItem, FoodBudget } from '../../types/nutrition';
import { nutritionStorage } from '../../services/nutritionStorage';
import { useBrand } from '../../context/BrandContext';

interface AdminFoodManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatabaseUpdated: () => void;
}

export const AdminFoodManagerModal: React.FC<AdminFoodManagerModalProps> = ({
  isOpen,
  onClose,
  onDatabaseUpdated,
}) => {
  const { currentTheme } = useBrand();
  const [foods, setFoods] = useState<FoodItem[]>(() => nutritionStorage.getFoodDatabase());
  const [search, setSearch] = useState('');

  // Form states for adding new food
  const [name, setName] = useState('');
  const [regionalName, setRegionalName] = useState('');
  const [category, setCategory] = useState<FoodItem['category']>('proteins');
  const [cuisine, setCuisine] = useState<'indian' | 'global'>('indian');
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [servingUnit, setServingUnit] = useState('100g portion');
  const [servingGrams, setServingGrams] = useState(100);
  const [calories, setCalories] = useState(150);
  const [protein, setProtein] = useState(10);
  const [carbs, setCarbs] = useState(15);
  const [fat, setFat] = useState(3);
  const [fiber, setFiber] = useState(2);
  const [affordability, setAffordability] = useState<FoodBudget>('budget');
  const [substitutions, setSubstitutions] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: FoodItem = {
      id: 'food-admin-' + Date.now(),
      name: name.trim(),
      regionalName: regionalName.trim() || undefined,
      category,
      cuisine,
      isVegetarian,
      isVegan: isVegetarian && category !== 'dairy',
      isEggetarian: isVegetarian,
      servingUnit,
      servingGrams,
      caloriesPerServing: calories,
      proteinGrams: protein,
      carbsGrams: carbs,
      fatGrams: fat,
      fiberGrams: fiber,
      affordability,
      commonSubstitutions: substitutions.split(',').map(s => s.trim()).filter(Boolean)
    };

    nutritionStorage.saveFoodItem(newItem);
    setFoods(nutritionStorage.getFoodDatabase());
    onDatabaseUpdated();
    setSuccessMsg(`Added "${newItem.name}" to verified food catalog!`);
    setTimeout(() => setSuccessMsg(null), 3000);

    // Reset fields
    setName('');
    setRegionalName('');
    setCalories(150);
    setProtein(10);
    setCarbs(15);
    setFat(3);
  };

  const handleDeleteFood = (id: string) => {
    nutritionStorage.deleteFoodItem(id);
    setFoods(nutritionStorage.getFoodDatabase());
    onDatabaseUpdated();
  };

  const filtered = foods.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.regionalName?.toLowerCase().includes(search.toLowerCase())
  );

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#121624] border border-[#252E42] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#252E42] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white font-display">Admin Nutrition Management</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold">
                  Verified Catalog
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage clinical food database items, macro values, regional foods, and substitutions.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add New Food Form */}
        <form onSubmit={handleAddFood} className="bg-[#0A0D15] border border-[#1E2538] rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-lime-accent font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Verified Food Item</span>
          </h4>

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-mono text-gray-400 block mb-1">Food Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sattu Paratha"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#141A28] border border-[#252E42] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-gray-400 block mb-1">Regional Name</label>
              <input
                type="text"
                placeholder="e.g. सत्तू पराठा"
                value={regionalName}
                onChange={(e) => setRegionalName(e.target.value)}
                className="w-full bg-[#141A28] border border-[#252E42] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-gray-400 block mb-1">Serving Unit</label>
              <input
                type="text"
                value={servingUnit}
                onChange={(e) => setServingUnit(e.target.value)}
                className="w-full bg-[#141A28] border border-[#252E42] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Calories (kcal)</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                className="w-full bg-[#141A28] border border-[#252E42] rounded-xl px-3 py-2 text-amber-400 font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Protein (g)</label>
              <input
                type="number"
                step="0.1"
                value={protein}
                onChange={(e) => setProtein(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#141A28] border border-[#252E42] rounded-xl px-3 py-2 text-blue-400 font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Carbs (g)</label>
              <input
                type="number"
                step="0.1"
                value={carbs}
                onChange={(e) => setCarbs(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#141A28] border border-[#252E42] rounded-xl px-3 py-2 text-emerald-400 font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Fats (g)</label>
              <input
                type="number"
                step="0.1"
                value={fat}
                onChange={(e) => setFat(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#141A28] border border-[#252E42] rounded-xl px-3 py-2 text-purple-400 font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Fiber (g)</label>
              <input
                type="number"
                step="0.1"
                value={fiber}
                onChange={(e) => setFiber(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#141A28] border border-[#252E42] rounded-xl px-3 py-2 text-gray-300 font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-xs font-mono">
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-300">
                <input
                  type="checkbox"
                  checked={isVegetarian}
                  onChange={(e) => setIsVegetarian(e.target.checked)}
                  className="rounded accent-lime-accent"
                />
                <span>Vegetarian</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-300">
                <input
                  type="checkbox"
                  checked={cuisine === 'indian'}
                  onChange={(e) => setCuisine(e.target.checked ? 'indian' : 'global')}
                  className="rounded accent-lime-accent"
                />
                <span>Indian Cuisine</span>
              </label>
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-bold text-xs flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Publish Food Item</span>
            </button>
          </div>
        </form>

        {/* Existing Database Catalog */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Database className="w-3.5 h-3.5" />
              <span>Current Food Directory ({foods.length} items)</span>
            </h4>
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter foods..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0A0D15] border border-[#252E42] text-xs text-white"
              />
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto divide-y divide-white/5 border border-[#222A3E] rounded-2xl bg-[#0A0D15]">
            {filtered.map((f) => (
              <div key={f.id} className="p-3 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-bold text-white mr-2">{f.name}</span>
                  {f.regionalName && <span className="text-gray-400 text-[10px]">({f.regionalName})</span>}
                  <span className="text-gray-400 text-[11px] block">{f.servingUnit}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-amber-400 font-bold block">{f.caloriesPerServing} kcal</span>
                    <span className="text-[10px] text-gray-400">{f.proteinGrams}g P | {f.carbsGrams}g C | {f.fatGrams}g F</span>
                  </div>
                  <button
                    onClick={() => handleDeleteFood(f.id)}
                    className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
