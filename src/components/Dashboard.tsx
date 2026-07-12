import React, { useEffect, useState } from 'react';
import { db, auth, collection, query, where, orderBy, getDocs, deleteDoc, doc, setDoc } from '../lib/firebase';
import { Project } from '../types';
import { Plus, Trash2, Edit, LogOut, FileText, Calendar, Sparkles, BookOpen } from 'lucide-react';

interface DashboardProps {
  onSelectProject: (project: Project) => void;
  onNewProject: () => void;
}

export default function Dashboard({ onSelectProject, onNewProject }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, 'projects'),
        where('userId', '==', user.uid),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const loadedProjects: Project[] = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        loadedProjects.push({
          id: docSnapshot.id,
          ...data,
        } as Project);
      });
      setProjects(loadedProjects);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError('Gagal memuat daftar dokumen. Silakan coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Apakah Anda yakin ingin menghapus dokumen ini? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(projects.filter(p => p.id !== id));
    } catch (err: any) {
      console.error('Error deleting project:', err);
      alert('Gagal menghapus dokumen.');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.reload();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const getFaseLabel = (fase: string) => {
    if (!fase) return '';
    return `Fase ${fase}`;
  };

  return (
    <div className="min-h-screen bg-[#050608] text-slate-300 font-sans relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-950/15 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-950/15 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Top Navbar */}
      <nav className="bg-black/40 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-tr from-amber-400 to-orange-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight">EduGen Merdeka</span>
            <span className="ml-2 text-xs font-semibold bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20">Kurikulum Merdeka + Deep Learning</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Masuk sebagai</p>
            <p className="text-sm font-medium text-slate-200">
              {auth.currentUser?.email || 'Tamu EduGen'}
            </p>
          </div>
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white text-xs font-medium rounded-lg cursor-pointer transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Daftar Dokumen Anda</h2>
            <p className="text-sm text-slate-400">Kelola dan susun perangkat ajar Prota, Promes, dan ATP Kurikulum Merdeka Anda di satu tempat.</p>
          </div>
          <button
            id="create-new-project-btn"
            onClick={onNewProject}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all"
          >
            <Plus className="h-4 w-4" />
            Buat Dokumen Baru
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-sm text-slate-500">Memuat dokumen Anda...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center text-sm text-rose-400">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white/[0.02] rounded-3xl border border-dashed border-white/10 py-16 px-4 text-center max-w-lg mx-auto backdrop-blur-md">
            <div className="mx-auto h-12 w-12 bg-white/5 text-indigo-400 border border-white/5 rounded-xl flex items-center justify-center mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Belum ada dokumen</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
              Anda belum membuat dokumen ajar. Mulai dengan membuat dokumen baru untuk menyusun Prota, Promes, dan ATP Anda secara otomatis.
            </p>
            <button
              onClick={onNewProject}
              className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-sm px-4 py-2 rounded-xl cursor-pointer transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              <Plus className="h-4 w-4" />
              Mulai Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="bg-white/[0.02] rounded-2xl border border-white/5 hover:border-white/15 hover:bg-white/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_30px_rgba(99,102,241,0.1)] transition-all cursor-pointer p-6 flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/20">
                      {project.profile.mataPelajaran || 'Belum diisi'}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {getFaseLabel(project.profile.fase)} - Kelas {project.profile.kelas || '-'}
                    </span>
                  </div>

                  <h4 className="font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
                    {project.title || 'Dokumen Tanpa Judul'}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                    {project.profile.namaSekolah ? `${project.profile.namaSekolah} • TA ${project.profile.tahunAjaran}` : 'Detail satuan pendidikan belum diisi'}
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                      {project.tps.length} TP Terpetakan
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-amber-500" />
                      {project.curriculum.jpPerWeek * (project.curriculum.weeksEffectiveSem1 + project.curriculum.weeksEffectiveSem2) || 0} JP Efektif
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-white/5">
                  <span>
                    Diperbarui: {project.updatedAt ? new Date(project.updatedAt.seconds * 1000).toLocaleDateString('id-ID') : 'Baru'}
                  </span>
                  <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelectProject(project); }}
                      className="p-1.5 hover:bg-white/5 hover:text-white text-slate-400 rounded-lg transition-colors"
                      title="Edit Dokumen"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(project.id, e)}
                      className="p-1.5 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg transition-colors"
                      title="Hapus Dokumen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
