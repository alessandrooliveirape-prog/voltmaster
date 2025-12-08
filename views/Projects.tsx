
import React, { useState, useEffect } from 'react';
import { Plus, Folder, Search, Trash2, Edit2, X, AlertTriangle, ArrowLeft, Calendar, User, FileText, Clock } from 'lucide-react';
import { Project } from '../types';
import { Button } from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';

export const Projects: React.FC = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Navigation State
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Edit/Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Delete Confirmation State
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    client: '',
    startDate: '',
    endDate: '',
    status: 'pending',
    notes: ''
  });

  // Calculate status based on dates
  const getAutoStatus = (startDate: string, endDate: string, currentStatus?: string): Project['status'] => {
    if (currentStatus === 'completed') return 'completed';
    if (!startDate || !endDate) return 'pending';

    const now = new Date();
    // Reset time to start of day for comparison
    now.setHours(0,0,0,0);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
    end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

    if (now < start) return 'pending';
    if (now > end) return 'delayed';
    return 'in-progress';
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('voltmaster_projects');
      if (stored) {
        let parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) {
          console.warn("Corrupted project data found, resetting.");
          parsed = [];
        }
        
        const updatedProjects = parsed.map((p: any) => {
          const startDate = p.startDate || p.date || new Date().toISOString().split('T')[0];
          const endDate = p.endDate || p.date || new Date(Date.now() + 604800000).toISOString().split('T')[0]; 
          const status = getAutoStatus(startDate, endDate, p.status);

          return {
            ...p,
            startDate,
            endDate,
            status,
            date: undefined
          } as Project;
        });

        setProjects(updatedProjects);
        localStorage.setItem('voltmaster_projects', JSON.stringify(updatedProjects));
      } else {
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 604800000).toISOString().split('T')[0];
        
        const seeds: Project[] = [
          { 
            id: '1', 
            name: 'Factory A - Panel Upgrade', 
            client: 'IndusCorp', 
            startDate: '2023-10-01', 
            endDate: '2023-10-25', 
            status: 'completed', 
            notes: 'Main breaker 1200A needs replacement. \n\nComponents:\n- ABB Emax 2\n- Busbar copper 100x10' 
          },
          { 
            id: '2', 
            name: 'Res. Johnson - Wiring', 
            client: 'Mr. Johnson', 
            startDate: today, 
            endDate: nextWeek, 
            status: 'in-progress', 
            notes: 'Waiting for architectural plans.' 
          },
        ];
        setProjects(seeds);
        localStorage.setItem('voltmaster_projects', JSON.stringify(seeds));
      }
    } catch (error) {
      console.error("Failed to load projects from storage:", error);
      setProjects([]);
      localStorage.removeItem('voltmaster_projects');
    }
  }, []);

  const saveToStorage = (updatedList: Project[]) => {
    setProjects(updatedList);
    localStorage.setItem('voltmaster_projects', JSON.stringify(updatedList));
  };

  const handleOpenModal = (project?: Project) => {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 604800000).toISOString().split('T')[0];

    if (project) {
      setEditingId(project.id);
      setFormData({
        name: project.name,
        client: project.client,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        notes: project.notes
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        client: '',
        startDate: today,
        endDate: nextWeek,
        status: 'pending',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const finalStatus = formData.status === 'completed' 
      ? 'completed' 
      : getAutoStatus(formData.startDate!, formData.endDate!);

    const projectData = {
      ...formData,
      status: finalStatus
    } as Project;

    if (editingId) {
      const updated = projects.map(p => 
        p.id === editingId ? { ...p, ...projectData, id: editingId } : p
      );
      saveToStorage(updated);
    } else {
      const newProject: Project = {
        ...projectData,
        id: Date.now().toString(),
      };
      saveToStorage([newProject, ...projects]);
    }
    handleCloseModal();
  };

  const requestDelete = (id: string, e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    setProjectToDelete(id);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      const updated = projects.filter(p => p.id !== projectToDelete);
      saveToStorage(updated);
      setProjectToDelete(null);
      if (selectedProjectId === projectToDelete) {
        setSelectedProjectId(null);
      }
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-900/50';
      case 'in-progress': return 'text-amber-600 dark:text-amber-500 bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/50';
      case 'delayed': return 'text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-900/50';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'completed': return t('proj.st_completed');
      case 'in-progress': return t('proj.st_progress');
      case 'delayed': return t('proj.st_delayed');
      default: return t('proj.st_pending');
    }
  };

  // --- RENDER DETAIL VIEW ---
  const activeProject = projects.find(p => p.id === selectedProjectId);

  if (activeProject) {
    return (
      <div className="p-4 pb-24 h-full flex flex-col relative animate-in slide-in-from-right duration-200">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setSelectedProjectId(null)} 
            className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold ml-2 text-slate-900 dark:text-white">{t('proj.details')}</h2>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
          
          <div className="flex justify-between items-start">
             <div>
               <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-2">{activeProject.name}</h1>
               <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getStatusColor(activeProject.status)}`}>
                  {getStatusLabel(activeProject.status)}
               </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
             <div className="col-span-2 flex items-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-lg border border-slate-100 dark:border-transparent">
                <User size={18} className="mr-3 text-slate-400 dark:text-slate-500" />
                <div>
                   <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-600">{t('proj.lbl_client')}</span>
                   <span className="text-slate-800 dark:text-white text-sm font-medium">{activeProject.client}</span>
                </div>
             </div>
             
             <div className="flex items-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-lg border border-slate-100 dark:border-transparent">
                <Calendar size={18} className="mr-3 text-amber-500" />
                <div>
                   <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-600">{t('proj.lbl_start')}</span>
                   <span className="text-slate-800 dark:text-white text-sm font-mono">{activeProject.startDate}</span>
                </div>
             </div>
             <div className="flex items-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-lg border border-slate-100 dark:border-transparent">
                <Clock size={18} className="mr-3 text-amber-500" />
                <div>
                   <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-600">{t('proj.lbl_end')}</span>
                   <span className="text-slate-800 dark:text-white text-sm font-mono">{activeProject.endDate}</span>
                </div>
             </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
             <div className="flex items-center mb-2">
                <FileText size={18} className="mr-2 text-amber-500" />
                <span className="text-sm font-bold text-slate-500 dark:text-slate-300 uppercase">{t('proj.lbl_notes')}</span>
             </div>
             <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                {activeProject.notes || "No notes available."}
             </div>
          </div>

          <div className="flex gap-4 pt-4">
             <Button 
                variant="secondary" 
                fullWidth 
                icon={<Edit2 size={16}/>}
                onClick={() => handleOpenModal(activeProject)}
                className="bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-50 dark:hover:bg-slate-600"
             >
                Edit
             </Button>
             <Button 
                variant="danger" 
                fullWidth 
                icon={<Trash2 size={16}/>}
                onClick={() => requestDelete(activeProject.id)}
             >
                {t('proj.delete')}
             </Button>
          </div>
        </div>
        
        {renderModals()}
      </div>
    );
  }

  // --- RENDER LIST VIEW ---
  return (
    <div className="p-4 pb-24 h-full flex flex-col relative animate-in slide-in-from-left duration-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('proj.title')}</h2>
        <Button 
          onClick={() => handleOpenModal()}
          className="!px-3 !py-2 rounded-xl text-sm"
        >
          <Plus size={20} className="mr-1" /> {t('proj.new_btn')}
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('proj.search')} 
          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm"
        />
      </div>

      <div className="space-y-3 overflow-y-auto pb-4">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 opacity-50 flex flex-col items-center">
            <Folder size={64} className="mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-slate-400">{t('proj.none')}</p>
          </div>
        ) : (
          filteredProjects.map((proj) => (
            <div 
              key={proj.id} 
              onClick={() => setSelectedProjectId(proj.id)}
              className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-sm cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-2">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">{proj.name}</h3>
                  <div className="flex flex-wrap items-center text-xs text-slate-500 dark:text-slate-400 gap-2">
                     <span className="bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded flex items-center border border-slate-100 dark:border-transparent">
                       <Calendar size={10} className="mr-1"/> 
                       {proj.startDate} → {proj.endDate}
                     </span>
                     <span className="flex items-center"><User size={10} className="mr-1"/> {proj.client}</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${getStatusColor(proj.status)}`}>
                  {getStatusLabel(proj.status)}
                </div>
              </div>
              
              {proj.notes && (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded text-sm text-slate-600 dark:text-slate-400 mb-3 border border-slate-100 dark:border-slate-700/50 line-clamp-2">
                   {proj.notes}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <button 
                  onClick={(e) => requestDelete(proj.id, e)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors z-10"
                >
                  <Trash2 size={18} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenModal(proj); }}
                  className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors z-10"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {renderModals()}
    </div>
  );

  function renderModals() {
    return (
      <>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 sticky top-0">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  {editingId ? t('proj.edit_title') : t('proj.new_title')}
                </h3>
                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-400 uppercase mb-1">{t('proj.lbl_name')}</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-colors"
                    placeholder="e.g. Panel Upgrade"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-400 uppercase mb-1">{t('proj.lbl_client')}</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({...formData, client: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-400 uppercase mb-1">{t('proj.lbl_start')}</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-400 uppercase mb-1">{t('proj.lbl_end')}</label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-400 uppercase mb-1">{t('proj.lbl_status')}</label>
                  <div className="grid grid-cols-2 gap-2">
                     <button
                       type="button"
                       onClick={() => setFormData({...formData, status: 'completed'})}
                       className={`py-3 px-2 rounded-lg text-xs font-bold uppercase transition-all border ${
                         formData.status === 'completed' 
                          ? 'bg-green-600 text-white border-green-500 shadow-md' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500'
                       }`}
                     >
                       {t('proj.st_completed')}
                     </button>
                     <button
                       type="button"
                       onClick={() => setFormData({...formData, status: 'pending'})}
                       className={`py-3 px-2 rounded-lg text-xs font-bold uppercase transition-all border ${
                         formData.status !== 'completed' 
                          ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-md' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500'
                       }`}
                     >
                       {t('proj.auto_status')}
                     </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-400 uppercase mb-1">{t('proj.lbl_notes')}</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none min-h-[100px] transition-colors"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={handleCloseModal} 
                    className="flex-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {t('proj.cancel')}
                  </Button>
                  <Button type="submit" className="flex-1">
                    {t('proj.save')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {projectToDelete && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm border border-slate-200 dark:border-slate-700 shadow-2xl p-6 text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('proj.delete')}</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">{t('proj.confirm_delete')}</p>
                
                <div className="flex gap-3">
                  <Button 
                    variant="secondary" 
                    fullWidth 
                    onClick={() => setProjectToDelete(null)}
                    className="bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-50 dark:hover:bg-slate-600"
                  >
                    {t('proj.cancel')}
                  </Button>
                  <Button variant="danger" fullWidth onClick={confirmDelete}>
                    {t('proj.delete')}
                  </Button>
                </div>
             </div>
          </div>
        )}
      </>
    );
  }
};
