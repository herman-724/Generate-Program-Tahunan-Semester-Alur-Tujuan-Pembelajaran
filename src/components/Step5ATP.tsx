import React from 'react';
import { TPData } from '../types';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

interface Step5ATPProps {
  tps: TPData[];
  targetJP: number;
  weeksSem1: number;
  weeksSem2: number;
  jpPerWeek: number;
  onChangeTPs: (tps: TPData[]) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Step5ATP({
  tps,
  targetJP,
  weeksSem1,
  weeksSem2,
  jpPerWeek,
  onChangeTPs,
  onPrev,
  onNext
}: Step5ATPProps) {

  const totalAllocatedJP = tps.reduce((acc, tp) => acc + (tp.jp || 0), 0);
  const isJPMatching = totalAllocatedJP === targetJP;

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...tps];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;

    // Recalculate orders
    const final = updated.map((tp, idx) => ({ ...tp, order: idx + 1 }));
    onChangeTPs(final);
  };

  const handleMoveDown = (index: number) => {
    if (index === tps.length - 1) return;
    const updated = [...tps];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;

    // Recalculate orders
    const final = updated.map((tp, idx) => ({ ...tp, order: idx + 1 }));
    onChangeTPs(final);
  };

  const handleJPChange = (id: string, jp: number) => {
    const updated = tps.map(tp => tp.id === id ? { ...tp, jp: Math.max(1, jp) } : tp);
    onChangeTPs(updated);
  };

  const handleSemesterChange = (id: string, semester: '1' | '2') => {
    const updated = tps.map(tp => tp.id === id ? { ...tp, semester } : tp);
    onChangeTPs(updated);
  };

  const handleDistributeEvenly = () => {
    if (tps.length === 0) return;
    // Distribute JP evenly among TPs
    const baseJP = Math.floor(targetJP / tps.length);
    const remainder = targetJP % tps.length;

    const updated = tps.map((tp, idx) => {
      // Allocate leftover remainder to first few TPs
      const allocated = baseJP + (idx < remainder ? 1 : 0);
      return {
        ...tp,
        jp: allocated,
        // Distribute semesters naturally based on ordering
        semester: idx < tps.length / 2 ? '1' : ('2' as '1' | '2')
      };
    });
    onChangeTPs(updated);
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 font-sans relative z-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Penyusunan Alur Tujuan Pembelajaran (ATP) & Alokasi JP</h3>
        <p className="text-sm text-slate-400">Urutkan Tujuan Pembelajaran (TP) dari yang paling sederhana ke kompleks, tentukan semester, dan tentukan alokasi JP per TP.</p>
      </div>

      {/* Validation Banner */}
      <div className={`p-5 rounded-2xl border mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors ${
        isJPMatching 
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
          : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
      }`}>
        <div className="flex gap-3 items-start">
          {isJPMatching ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5 shadow-glow" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-bold text-sm block">
              {isJPMatching ? 'Alokasi Waktu Sesuai & Valid!' : 'Alokasi Waktu Belum Sesuai'}
            </span>
            <span className="text-xs opacity-90 block mt-0.5">
              Total JP Dialokasikan: <strong className="text-sm font-bold text-white">{totalAllocatedJP} JP</strong> dari Target Efektif: <strong className="text-sm font-bold text-white">{targetJP} JP</strong> 
              {` (Sem 1: ${weeksSem1 * jpPerWeek} JP, Sem 2: ${weeksSem2 * jpPerWeek} JP)`}
            </span>
            {!isJPMatching && (
              <span className="text-xs font-bold text-rose-400 block mt-1">
                ⚠️ Peringatan: Harap sesuaikan kembali JP setiap TP agar total bernilai tepat {targetJP} JP.
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleDistributeEvenly}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Bagi JP Rata otomatis
        </button>
      </div>

      {/* ATP Table List */}
      <div className="space-y-3">
        {tps.map((tp, index) => (
          <div key={tp.id} className="bg-white/[0.01] rounded-2xl p-4 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex gap-3 items-center grow">
              {/* Reordering Buttons */}
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  disabled={index === 0}
                  onClick={() => handleMoveUp(index)}
                  className="p-1 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 rounded-md transition-colors cursor-pointer"
                  title="Naikkan Urutan"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  disabled={index === tps.length - 1}
                  onClick={() => handleMoveDown(index)}
                  className="p-1 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 rounded-md transition-colors cursor-pointer"
                  title="Turunkan Urutan"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Urutan Alur ATP {index + 1}</span>
                <p className="text-xs font-bold text-white leading-relaxed max-w-lg">{tp.text || '(TP Belum diisi)'}</p>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {tp.deepLearning.profileDimensions.map(dim => (
                    <span key={dim} className="text-[9px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                      {dim}
                    </span>
                  ))}
                  {tp.deepLearning.principles.map(princ => (
                    <span key={princ} className="text-[9px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
                      {princ}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Inputs: JP and Semester */}
            <div className="flex gap-4 items-center shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
              {/* Semester Select */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Semester</label>
                <select
                  value={tp.semester || '1'}
                  onChange={(e) => handleSemesterChange(tp.id, e.target.value as '1' | '2')}
                  className="px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs font-semibold text-white focus:outline-none cursor-pointer focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="1">Semester 1 (Ganjil)</option>
                  <option value="2">Semester 2 (Genap)</option>
                </select>
              </div>

              {/* JP Alokasi Input */}
              <div className="w-24">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Alokasi JP</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={tp.jp || 4}
                    onChange={(e) => handleJPChange(tp.id, parseInt(e.target.value) || 0)}
                    className="w-full pl-3 pr-8 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">JP</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 border border-white/10 hover:bg-white/5 text-slate-300 font-semibold text-sm px-5 py-3 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Pemetaan Deep Learning
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          Lanjut ke Kalender Promes
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
