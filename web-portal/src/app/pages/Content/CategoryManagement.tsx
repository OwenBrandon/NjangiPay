import { useState } from 'react';
import {
  Plus, Edit3, Trash2,
  Search, Grid, List, Layers, FileText, ChevronRight, Terminal, X
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { toast } from 'sonner';
import type { ArticleCategory } from '../../types';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '../../components/ui/dialog';

const colorOptions = [
  'bg-blue-500', 'bg-emerald-500', 'bg-orange-500',
  'bg-purple-500', 'bg-pink-500', 'bg-cyan-500', 'bg-rose-500', 'bg-amber-500',
];

export default function CategoryManagement() {
  const { categories, articles, addCategory, updateCategory, deleteCategory } = useMockData();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ArticleCategory | null>(null);
  const [form, setForm] = useState({ name: '', description: '', color: colorOptions[0] });

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const countFor = (name: string) => articles.filter(a => a.category === name).length;

  const q = query.trim().toLowerCase();
  const visibleCategories = q
    ? categories.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    : categories;

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', color: colorOptions[0] });
    setModalOpen(true);
  };

  const openEdit = (cat: ArticleCategory) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description, color: cat.color });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Name Required', { description: 'Please enter a category name.' });
      return;
    }
    const duplicate = categories.some(
      c => c.name.toLowerCase() === form.name.trim().toLowerCase() && c.id !== editing?.id
    );
    if (duplicate) {
      toast.error('Duplicate Category', { description: 'A category with this name already exists.' });
      return;
    }

    if (editing) {
      updateCategory({ ...editing, name: form.name.trim(), description: form.description.trim(), color: form.color });
      toast.success('Category Updated', { description: `"${form.name.trim()}" has been saved.` });
    } else {
      addCategory({ id: `CAT-${Date.now()}`, name: form.name.trim(), description: form.description.trim(), color: form.color });
      toast.success('Category Created', { description: `"${form.name.trim()}" was added to the taxonomy.` });
    }
    setModalOpen(false);
  };

  const handleDelete = (cat: ArticleCategory) => {
    const count = countFor(cat.name);
    if (count > 0) {
      toast.error('Category In Use', { description: `Reassign the ${count} article(s) in "${cat.name}" before deleting.` });
      return;
    }
    if (window.confirm(`Delete category "${cat.name}"?`)) {
      deleteCategory(cat.id);
      toast.success('Category Deleted', { description: `"${cat.name}" has been removed.` });
    }
  };

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid} p-8 lg:p-12`}>
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] size-[50%] bg-blue-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[50%] bg-indigo-400/5 blur-[120px] rounded-full" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic">Knowledge Taxonomy</div>
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">SYS_COMPLIANT</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
            Category <span className="text-blue-600 underline decoration-slate-900 decoration-8 underline-offset-8">Management</span>
          </h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.4em] mt-8 flex items-center gap-3 italic">
            <Terminal className="size-4 text-blue-600" />
            Organize and structure the taxpayer knowledge base
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
        >
          <Plus className="size-4" />
          Add Category
        </button>
      </div>

      {/* Controls */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all placeholder:text-slate-400 text-slate-700"
          />
        </div>
        <div className="flex bg-white/80 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-sm gap-1 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center justify-center p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
            title="Grid View"
          >
            <Grid className="size-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center justify-center p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
            title="List View"
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {visibleCategories.map((cat) => (
            <div
              key={cat.id}
              className={`${glassCard} group relative overflow-hidden transition-all duration-500 hover:translate-y-[-6px] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] flex flex-col justify-between`}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-3.5 ${cat.color} text-white rounded-2xl shadow-lg transition-transform group-hover:scale-105`}>
                    <Layers className="size-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="Edit Category"
                    >
                      <Edit3 className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed min-h-[40px] font-medium">{cat.description}</p>

                <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 font-mono">
                    <FileText className="size-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">{countFor(cat.name)} Articles</span>
                  </div>
                  <button
                    onClick={() => openEdit(cat)}
                    className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1 group/btn font-mono"
                  >
                    Manage <ChevronRight className="size-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
              <div className={`h-1.5 w-full ${cat.color} opacity-20`} />
            </div>
          ))}

          {/* Add New Placeholder */}
          <button
            onClick={openCreate}
            className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 min-h-[260px] hover:border-blue-400 hover:bg-blue-50/20 group transition-all relative z-10"
          >
            <div className="p-4 bg-white border border-slate-200 text-slate-400 rounded-2xl group-hover:text-blue-600 group-hover:border-blue-300 group-hover:shadow-md transition-all">
              <Plus className="size-6" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono group-hover:text-blue-600">Create New Category</span>
          </button>
        </div>
      ) : (
        <div className={`${glassCard} relative z-10`}>
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200/50 text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">
              <tr>
                <th className="px-8 py-5">Category Name</th>
                <th className="px-8 py-5">Description</th>
                <th className="px-8 py-5">Article Count</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`size-3 rounded-full ${cat.color}`} />
                      <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs text-slate-500 font-medium">{cat.description}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-[9px] font-black font-mono">
                      {countFor(cat.name)}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="inline-flex items-center justify-center size-8 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                      >
                        <Edit3 className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="inline-flex items-center justify-center size-8 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleCategories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
              {editing ? 'Edit Category' : 'New Category'}
            </DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
              {editing ? 'Update taxonomy details' : 'Add a new knowledge base category'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Category Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Tax Guides"
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description of this category..."
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 outline-none resize-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">Accent Color</label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm({ ...form, color })}
                    className={`size-8 rounded-lg ${color} transition-all ${form.color === color ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'opacity-70 hover:opacity-100'}`}
                    title={color}
                  />
                ))}
              </div>
            </div>
            <DialogFooter className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-black uppercase tracking-wider rounded-xl transition-colors"
              >
                <X className="size-3.5" /> Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-200 transition-all text-xs"
              >
                {editing ? 'Save Changes' : 'Create Category'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
