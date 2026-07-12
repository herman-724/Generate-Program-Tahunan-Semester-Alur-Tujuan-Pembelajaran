import React, { useEffect, useState, useRef } from 'react';
import { auth, db, doc, setDoc, onAuthStateChanged } from './lib/firebase';
import { Project, ProfileData, CurriculumData, TPData, PromesSettings } from './types';

// Components
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import StepIndicator from './components/StepIndicator';
import Step1Profile from './components/Step1Profile';
import Step2EffectiveWeeks from './components/Step2EffectiveWeeks';
import Step3CPTP from './components/Step3CPTP';
import Step4DeepLearning from './components/Step4DeepLearning';
import Step5ATP from './components/Step5ATP';
import Step6Promes from './components/Step6Promes';
import Step7Export from './components/Step7Export';

// Icons
import { ArrowLeft, Cloud, CloudLightning, CloudOff, RefreshCw, Sparkles, BookOpen } from 'lucide-react';

const STEPS = [
  { number: 1, title: 'Profil & Identitas', shortTitle: 'Profil' },
  { number: 2, title: 'Minggu Efektif & Alokasi JP', shortTitle: 'Alokasi JP' },
  { number: 3, title: 'Capaian & Tujuan Pembelajaran', shortTitle: 'CP & TP' },
  { number: 4, title: 'Pemetaan Pembelajaran Mendalam', shortTitle: 'Deep Learning' },
  { number: 5, title: 'Susun ATP & JP', shortTitle: 'Alur ATP' },
  { number: 6, title: 'Kalender Promes', shortTitle: 'Jadwal Promes' },
  { number: 7, title: 'Pratinjau & Ekspor', shortTitle: 'Pratinjau' }
];

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Project state
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isWorkspaceActive, setIsWorkspaceActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Cloud Sync state
  const [syncState, setSyncState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Auto-Save Reactive effect
  useEffect(() => {
    if (!activeProject || !user) return;

    // Trigger auto-save 1.5 seconds after project data updates
    setSyncState('saving');
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const projectRef = doc(db, 'projects', activeProject.id);
        const updatedDoc = {
          ...activeProject,
          updatedAt: { seconds: Math.floor(Date.now() / 1000) } // Mock Firebase timestamp for write
        };
        await setDoc(projectRef, updatedDoc);
        setSyncState('saved');
        // Reset saved text after 3s
        setTimeout(() => setSyncState('idle'), 3000);
      } catch (err) {
        console.error('Auto-save failed:', err);
        setSyncState('error');
      }
    }, 1500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    activeProject?.title,
    activeProject?.profile,
    activeProject?.curriculum,
    activeProject?.tps,
    activeProject?.promesSettings
  ]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-xs font-semibold text-slate-400">Menghubungkan ke EduGen Server...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLoginSuccess={() => {}} />;
  }

  // Dashboard New Project Creator helper
  const handleCreateNewProject = () => {
    const newId = Math.random().toString(36).substring(2, 11);
    const newProj: Project = {
      id: newId,
      userId: user.uid,
      title: 'Perangkat Kurikulum Merdeka Baru',
      createdAt: { seconds: Math.floor(Date.now() / 1000) },
      updatedAt: { seconds: Math.floor(Date.now() / 1000) },
      profile: {
        namaGuru: '',
        nip: '',
        jabatan: 'Guru Kelas / Mata Pelajaran',
        namaSekolah: '',
        kepalaSekolah: '',
        nipKepalaSekolah: '',
        tahunAjaran: '2026/2027',
        fase: 'A',
        kelas: '1',
        mataPelajaran: ''
      },
      curriculum: {
        cp: '',
        weeksEffectiveSem1: 18,
        weeksEffectiveSem2: 18,
        jpPerWeek: 4
      },
      tps: [],
      promesSettings: {
        nonEffectiveWeeks: {}
      }
    };

    setActiveProject(newProj);
    setCurrentStep(1);
    setCompletedSteps([]);
    setIsWorkspaceActive(true);
  };

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    setCurrentStep(1);
    // Mark steps as completed based on what data exists
    const completed: number[] = [1];
    if (project.curriculum.jpPerWeek) completed.push(2);
    if (project.tps.length > 0) {
      completed.push(3);
      completed.push(4);
      completed.push(5);
    }
    setCompletedSteps(completed);
    setIsWorkspaceActive(true);
  };

  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  // State update dispatchers
  const updateProfile = (profileUpdate: Partial<ProfileData>) => {
    if (!activeProject) return;
    setActiveProject({
      ...activeProject,
      profile: { ...activeProject.profile, ...profileUpdate }
    });
    // Mark step 1 completed
    if (!completedSteps.includes(1)) {
      setCompletedSteps([...completedSteps, 1]);
    }
  };

  const updateCurriculum = (curriculumUpdate: Partial<CurriculumData>) => {
    if (!activeProject) return;
    setActiveProject({
      ...activeProject,
      curriculum: { ...activeProject.curriculum, ...curriculumUpdate }
    });
    // Mark step 2 completed
    if (!completedSteps.includes(2)) {
      setCompletedSteps([...completedSteps, 2]);
    }
  };

  const updateTPs = (newTps: TPData[]) => {
    if (!activeProject) return;
    setActiveProject({
      ...activeProject,
      tps: newTps
    });
    // Mark steps 3, 4, 5 completed if TPs exist
    if (newTps.length > 0) {
      const steps = [...completedSteps];
      [3, 4, 5, 6].forEach(stepNum => {
        if (!steps.includes(stepNum)) steps.push(stepNum);
      });
      setCompletedSteps(steps);
    }
  };

  const updatePromesSettings = (newSettings: PromesSettings) => {
    if (!activeProject) return;
    setActiveProject({
      ...activeProject,
      promesSettings: newSettings
    });
  };

  // Navigation callbacks
  const handleNextStep = () => {
    if (currentStep < 7) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExitWorkspace = () => {
    setIsWorkspaceActive(false);
    setActiveProject(null);
  };

  const totalEffectiveJP = activeProject 
    ? (activeProject.curriculum.weeksEffectiveSem1 + activeProject.curriculum.weeksEffectiveSem2) * activeProject.curriculum.jpPerWeek
    : 0;

  return (
    <div className="min-h-screen bg-[#050608] text-slate-300 font-sans flex flex-col relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-cyan-950/15 blur-[140px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-indigo-950/15 blur-[140px] rounded-full pointer-events-none z-0"></div>

      {isWorkspaceActive && activeProject ? (
        <div className="flex-1 flex flex-col relative z-10">
          {/* Workspace Navbar - Hidden in Print */}
          <header className="bg-black/40 backdrop-blur-md text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 print:hidden shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleExitWorkspace}
                className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white"
                title="Kembali ke Dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 bg-gradient-to-tr from-amber-400 to-orange-600 rounded-lg shadow-[0_0_12px_rgba(245,158,11,0.3)] flex items-center justify-center">
                <BookOpen className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <input
                  id="workspace-project-title-input"
                  type="text"
                  value={activeProject.title}
                  onChange={(e) => setActiveProject({ ...activeProject, title: e.target.value })}
                  className="bg-transparent border-b border-transparent hover:border-white/10 focus:border-indigo-500 focus:outline-none font-bold text-sm text-white w-64 transition-colors"
                  placeholder="Ketik judul perangkat ajar..."
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Fase {activeProject.profile.fase} • Kelas {activeProject.profile.kelas} • {activeProject.profile.mataPelajaran || 'Mapel belum diisi'}
                </p>
              </div>
            </div>

            {/* Cloud Auto-save state indicator */}
            <div className="flex items-center gap-3 self-end sm:self-center">
              <div className="text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                {syncState === 'saving' && (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                    <span>Sedang menyimpan otomatis...</span>
                  </>
                )}
                {syncState === 'saved' && (
                  <>
                    <Cloud className="h-3.5 w-3.5 text-emerald-400 shadow-glow" />
                    <span className="text-emerald-400">Semua perubahan tersimpan</span>
                  </>
                )}
                {syncState === 'idle' && (
                  <>
                    <Cloud className="h-3.5 w-3.5 text-slate-500" />
                    <span>Tersimpan di Cloud</span>
                  </>
                )}
                {syncState === 'error' && (
                  <>
                    <CloudOff className="h-3.5 w-3.5 text-rose-400" />
                    <span className="text-rose-400">Gagal simpan otomatis</span>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Wizard Step Progress Tracker - Hidden in Print */}
          <div className="print:hidden">
            <StepIndicator
              currentStep={currentStep}
              steps={STEPS}
              onStepClick={handleStepClick}
              completedSteps={completedSteps}
            />
          </div>

          {/* Master Step Router */}
          <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8">
            {currentStep === 1 && (
              <Step1Profile
                data={activeProject.profile}
                onChange={updateProfile}
                onNext={handleNextStep}
              />
            )}
            {currentStep === 2 && (
              <Step2EffectiveWeeks
                data={activeProject.curriculum}
                onChange={updateCurriculum}
                onPrev={handlePrevStep}
                onNext={handleNextStep}
              />
            )}
            {currentStep === 3 && (
              <Step3CPTP
                cp={activeProject.curriculum.cp}
                tps={activeProject.tps}
                fase={activeProject.profile.fase}
                kelas={activeProject.profile.kelas}
                subject={activeProject.profile.mataPelajaran}
                onChangeCP={(cp) => setActiveProject({
                  ...activeProject,
                  curriculum: { ...activeProject.curriculum, cp }
                })}
                onChangeTPs={updateTPs}
                onPrev={handlePrevStep}
                onNext={handleNextStep}
              />
            )}
            {currentStep === 4 && (
              <Step4DeepLearning
                tps={activeProject.tps}
                onChangeTPs={updateTPs}
                onPrev={handlePrevStep}
                onNext={handleNextStep}
              />
            )}
            {currentStep === 5 && (
              <Step5ATP
                tps={activeProject.tps}
                targetJP={totalEffectiveJP}
                weeksSem1={activeProject.curriculum.weeksEffectiveSem1}
                weeksSem2={activeProject.curriculum.weeksEffectiveSem2}
                jpPerWeek={activeProject.curriculum.jpPerWeek}
                onChangeTPs={updateTPs}
                onPrev={handlePrevStep}
                onNext={handleNextStep}
              />
            )}
            {currentStep === 6 && (
              <Step6Promes
                tps={activeProject.tps}
                promesSettings={activeProject.promesSettings}
                onChangeTPs={updateTPs}
                onChangeSettings={updatePromesSettings}
                onPrev={handlePrevStep}
                onNext={handleNextStep}
              />
            )}
            {currentStep === 7 && (
              <Step7Export
                project={activeProject}
                onPrev={handlePrevStep}
              />
            )}
          </main>
        </div>
      ) : (
        <Dashboard
          onSelectProject={handleSelectProject}
          onNewProject={handleCreateNewProject}
        />
      )}
    </div>
  );
}
