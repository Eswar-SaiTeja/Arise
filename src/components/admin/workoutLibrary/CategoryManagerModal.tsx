import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Layers, 
  Plus, 
  Edit2, 
  GitMerge, 
  Check, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';
import { WorkoutCategory } from '../../../types/workoutLibrary';
import { workoutLibraryService } from '../../../services/workoutLibraryService';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoriesChanged: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  onCategoriesChanged
}) => {
  const [categories, setCategories] = useState<WorkoutCategory[]>(() => workoutLibraryService.getCategories());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Merge state
  const [showMergeForm, setShowMergeForm] = useState(false);
  const [sourceSlug, setSourceSlug] = useState('');
  const [targetSlug, setTargetSlug] = useState('');
  const [mergeResult, setMergeResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    workoutLibraryService.addCategory({
      name: newName.trim(),
      slug,
      description: newDesc.trim() || `Exercises focused on ${newName} development.`,
      isActive: true,
      displayOrder: categories.length + 1
    });

    setCategories(workoutLibraryService.getCategories());
    setNewName('');
    setNewDesc('');
    setShowAddForm(false);
    onCategoriesChanged();
  };

  const handleToggleActive = (id: string, current: boolean) => {
    workoutLibraryService.updateCategory(id, { isActive: !current });
    setCategories(workoutLibraryService.getCategories());
    onCategoriesChanged();
  };

  const handleExecuteMerge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceSlug || !targetSlug || sourceSlug === targetSlug) return;

    const result = await workoutLibraryService.mergeCategories(sourceSlug, targetSlug);
    setMergeResult(`Successfully merged! ${result.affectedCount} workouts re-assigned to target category.`);
    setCategories(workoutLibraryService.getCategories());
    setShowMergeForm(false);
    setSourceSlug('');
    setTargetSlug('');
    onCategoriesChanged();
    setTimeout(() => setMergeResult(null), 5000);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#111927] to-[#0A0E17] border border-cyan-500/30 rounded-3xl shadow-2xl p-6 md:p-8 text-white space-y-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-black tracking-widest uppercase rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              CATEGORY GOVERNANCE SYSTEM
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {categories.length} Configurable Categories
            </span>
          </div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            Workout Category Architecture
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage anatomical and functional category classifications. Add new domains or merge overlapping categories.
          </p>
        </div>

        {mergeResult && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{mergeResult}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowAddForm(!showAddForm); setShowMergeForm(false); }}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
            <button
              onClick={() => { setShowMergeForm(!showMergeForm); setShowAddForm(false); }}
              className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Merge Categories</span>
            </button>
          </div>
        </div>

        {/* Add Category Form */}
        {showAddForm && (
          <form onSubmit={handleAddCategory} className="bg-black/40 border border-cyan-500/30 rounded-2xl p-4 space-y-3 animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold uppercase tracking-wider text-cyan-300">Create New Workout Category</span>
              <button type="button" onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-gray-400 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Olympic Weightlifting"
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="font-mono text-gray-400 block mb-1">Description</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief summary of included movement mechanics..."
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs"
              >
                Save Category
              </button>
            </div>
          </form>
        )}

        {/* Merge Categories Form */}
        {showMergeForm && (
          <form onSubmit={handleExecuteMerge} className="bg-purple-950/30 border border-purple-500/40 rounded-2xl p-4 space-y-3 animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <GitMerge className="w-3.5 h-3.5" />
                Merge Overlapping Categories
              </span>
              <button type="button" onClick={() => setShowMergeForm(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <p className="text-[11px] text-gray-300">
              Merging will re-assign all workouts belonging to the Source Category into the Target Category and safely archive the source.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-gray-400 block mb-1">Source Category (To Merge Away)</label>
                <select
                  required
                  value={sourceSlug}
                  onChange={(e) => setSourceSlug(e.target.value)}
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white"
                >
                  <option value="">Select source category...</option>
                  {categories.filter(c => c.isActive).map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-mono text-gray-400 block mb-1">Target Category (To Keep)</label>
                <select
                  required
                  value={targetSlug}
                  onChange={(e) => setTargetSlug(e.target.value)}
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white"
                >
                  <option value="">Select target category...</option>
                  {categories.filter(c => c.slug !== sourceSlug).map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="submit"
                disabled={!sourceSlug || !targetSlug || sourceSlug === targetSlug}
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs disabled:opacity-50"
              >
                Execute Merge
              </button>
            </div>
          </form>
        )}

        {/* Categories List */}
        <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                cat.isActive 
                  ? 'bg-black/30 border-white/10 hover:border-white/20' 
                  : 'bg-black/10 border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md bg-white/10 font-mono text-[11px] text-gray-400 flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{cat.name}</span>
                    <span className="text-[10px] font-mono text-gray-500">({cat.slug})</span>
                  </div>
                  <div className="text-[11px] text-gray-400 line-clamp-1">{cat.description}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleActive(cat.id, cat.isActive)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase border transition-colors ${
                    cat.isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-white/5 text-gray-500 border-white/10'
                  }`}
                >
                  {cat.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
