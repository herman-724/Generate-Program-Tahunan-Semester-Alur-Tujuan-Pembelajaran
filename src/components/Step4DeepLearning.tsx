import React, { useState } from 'react';
import { TPData, DIMENSI_PROFIL, PRINSIP_PEMBELAJARAN, PENGALAMAN_BELAJAR } from '../types';
import { ArrowLeft, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface Step4DeepLearningProps {
  tps: TPData[];
  onChangeTPs: (tps: TPData[]) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Step4DeepLearning({ tps, onChangeTPs, onPrev, onNext }: Step4DeepLearningProps) {
  const [activeTpId, setActiveTpId] = useState<string>(tps[0]?.id || '');

  const activeTp = tps.find(tp => tp.id === activeTpId) || tps[0];

  const handleToggleDimension = (tpId: string, dimension: string) => {
    const updated = tps.map(tp => {
      if (tp.id === tpId) {
        const dims = tp.deepLearning.profileDimensions;
        const exists = dims.includes(dimension);
        const newDims = exists 
          ? dims.filter(d => d !== dimension) 
          : [...dims, dimension];
        return {
          ...tp,
          deepLearning: { ...tp.deepLearning, profileDimensions: newDims }
        };
      }
      return tp;
    });
    onChangeTPs(updated);
  };

  const handleTogglePrinciple = (tpId: string, principle: string) => {
    const updated = tps.map(tp => {
      if (tp.id === tpId) {
        const princs = tp.deepLearning.principles;
        const exists = princs.includes(principle);
        const newPrincs = exists 
          ? princs.filter(p => p !== principle) 
          : [...princs, principle];
        return {
          ...tp,
          deepLearning: { ...tp.deepLearning, principles: newPrincs }
        };
      }
      return tp;
    });
    onChangeTPs(updated);
  };

  const handleToggleExperience = (tpId: string, experience: string) => {
    const updated = tps.map(tp => {
      if (tp.id === tpId) {
        const exps = tp.deepLearning.experiences;
        const exists = exps.includes(experience);
        const newExps = exists 
          ? exps.filter(e => e !== experience) 
          : [...exps, experience];
        return {
          ...tp,
          deepLearning: { ...tp.deepLearning, experiences: newExps }
        };
      }
      return tp;
    });
    onChangeTPs(updated);
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 font-sans relative z-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Pemetaan Kerangka Pembelajaran Mendalam (Deep Learning Mapping)</h3>
        <p className="text-sm text-slate-400">Petakan keselarasan setiap Tujuan Pembelajaran (TP) dengan dimensi profil, prinsip, dan pengalaman belajar mendalam.</p>
      </div>

      {!activeTp ? (
        <div className="text-center py-10 text-slate-400">Belum ada Tujuan Pembelajaran yang ditambahkan. Kembali ke langkah sebelumnya.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: TP List Selector */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Pilih Tujuan Pembelajaran (TP)</span>
            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {tps.map((tp, index) => {
                const isActive = tp.id === activeTp.id;
                const totalMapped = 
                  tp.deepLearning.profileDimensions.length + 
                  tp.deepLearning.principles.length + 
                  tp.deepLearning.experiences.length;

                return (
                  <button
                    key={tp.id}
                    onClick={() => setActiveTpId(tp.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer block ${
                      isActive 
                        ? 'bg-white/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                        : 'bg-white/[0.02] hover:bg-white/5 border-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">TP 0{index + 1}</span>
                      {totalMapped > 0 && (
                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {totalMapped} Terpetakan
                        </span>
                      )}
                    </div>
                    <p className={`text-xs font-semibold line-clamp-2 leading-relaxed ${isActive ? 'text-white' : 'text-slate-400'}`}>
                      {tp.text || '(Belum mengisi kalimat TP)'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Mapping Core Engine */}
          <div className="lg:col-span-8 bg-white/[0.01] rounded-3xl p-6 border border-white/5 space-y-6">
            <div>
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">Sedang Dipetakan</span>
              <p className="text-sm font-bold text-white leading-relaxed mt-1">{activeTp.text || '(Kalimat TP Kosong)'}</p>
            </div>

            <hr className="border-white/5" />

            <div className="space-y-6">
              {/* Category 1: 8 Dimensi Profil Lulusan */}
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">8 Dimensi Profil Lulusan</span>
                  <span className="text-[10px] font-medium text-slate-500">(Bisa pilih lebih dari satu)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {DIMENSI_PROFIL.map((dim) => {
                    const isChecked = activeTp.deepLearning.profileDimensions.includes(dim);
                    return (
                      <button
                        key={dim}
                        onClick={() => handleToggleDimension(activeTp.id, dim)}
                        className={`px-3 py-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-gradient-to-tr from-indigo-500 to-indigo-700 border-indigo-400/30 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)]' 
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {dim}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category 2: 3 Prinsip Pembelajaran */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">3 Prinsip Pembelajaran</span>
                  </div>
                  <div className="space-y-2">
                    {PRINSIP_PEMBELAJARAN.map((princ) => {
                      const isChecked = activeTp.deepLearning.principles.includes(princ);
                      return (
                        <button
                          key={princ}
                          onClick={() => handleTogglePrinciple(activeTp.id, princ)}
                          className={`w-full px-4 py-3 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer flex justify-between items-center ${
                            isChecked 
                              ? 'bg-gradient-to-tr from-indigo-500 to-indigo-700 border-indigo-400/30 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)]' 
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {princ}
                          {isChecked && <ShieldCheck className="h-4 w-4 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category 3: 3 Pengalaman Belajar */}
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">3 Pengalaman Belajar</span>
                  </div>
                  <div className="space-y-2">
                    {PENGALAMAN_BELAJAR.map((exp) => {
                      const isChecked = activeTp.deepLearning.experiences.includes(exp);
                      return (
                        <button
                          key={exp}
                          onClick={() => handleToggleExperience(activeTp.id, exp)}
                          className={`w-full px-4 py-3 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer flex justify-between items-center ${
                            isChecked 
                              ? 'bg-gradient-to-tr from-indigo-500 to-indigo-700 border-indigo-400/30 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)]' 
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {exp}
                          {isChecked && <ShieldCheck className="h-4 w-4 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 border border-white/10 hover:bg-white/5 text-slate-300 font-semibold text-sm px-5 py-3 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke CP & TP
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          Lanjut ke Alur (ATP)
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
