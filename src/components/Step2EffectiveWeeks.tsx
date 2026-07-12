import React from 'react';
import { CurriculumData } from '../types';
import { Calendar, Clock, ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';

interface Step2EffectiveWeeksProps {
  data: CurriculumData;
  onChange: (data: Partial<CurriculumData>) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Step2EffectiveWeeks({ data, onChange, onPrev, onNext }: Step2EffectiveWeeksProps) {
  const weeksSem1 = data.weeksEffectiveSem1 || 18;
  const weeksSem2 = data.weeksEffectiveSem2 || 18;
  const jpPerWeek = data.jpPerWeek || 4;

  const jpSem1 = weeksSem1 * jpPerWeek;
  const jpSem2 = weeksSem2 * jpPerWeek;
  const totalJP = jpSem1 + jpSem2;

  return (
    <div className="bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 font-sans relative z-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Perhitungan Alokasi Waktu & Minggu Efektif</h3>
        <p className="text-sm text-slate-400">Tentukan jumlah minggu efektif per semester untuk menghitung total Jam Pelajaran (JP) yang tersedia dalam satu tahun ajaran.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/[0.01] rounded-2xl p-5 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Minggu Efektif Semester 1 (Ganjil)</label>
              <div className="relative">
                <input
                  id="input-weeks-sem1"
                  type="number"
                  min="1"
                  max="52"
                  value={weeksSem1}
                  onChange={(e) => onChange({ weeksEffectiveSem1: Math.max(1, parseInt(e.target.value) || 0) })}
                  className="w-full pl-4 pr-16 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white font-semibold text-sm transition-all focus:outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">Minggu</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Standar semester ganjil umumnya adalah 18-20 minggu efektif.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Minggu Efektif Semester 2 (Genap)</label>
              <div className="relative">
                <input
                  id="input-weeks-sem2"
                  type="number"
                  min="1"
                  max="52"
                  value={weeksSem2}
                  onChange={(e) => onChange({ weeksEffectiveSem2: Math.max(1, parseInt(e.target.value) || 0) })}
                  className="w-full pl-4 pr-16 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white font-semibold text-sm transition-all focus:outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">Minggu</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Standar semester genap umumnya adalah 16-18 minggu efektif.</p>
            </div>
          </div>

          <div className="bg-white/[0.01] rounded-2xl p-5 border border-white/5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Beban Mengajar: Jam Pelajaran (JP) per Minggu</label>
            <div className="relative max-w-md">
              <input
                id="input-jp-per-week"
                type="number"
                min="1"
                max="40"
                value={jpPerWeek}
                onChange={(e) => onChange({ jpPerWeek: Math.max(1, parseInt(e.target.value) || 0) })}
                className="w-full pl-4 pr-16 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white font-semibold text-sm transition-all focus:outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">JP / Minggu</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">Jumlah alokasi JP per minggu untuk mata pelajaran ini berdasarkan struktur kurikulum merdeka.</p>
          </div>
        </div>

        {/* Right column: Interactive Stat Breakdown */}
        <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-white/10 rounded-3xl p-6 text-white flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center gap-2 mb-4 text-indigo-400">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Kalkulasi Waktu Tersedia</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-xs text-slate-400">Semester 1 (Ganjil)</span>
                <span className="text-sm font-bold">{weeksSem1} mgg × {jpPerWeek} JP = <span className="text-indigo-400">{jpSem1} JP</span></span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-xs text-slate-400">Semester 2 (Genap)</span>
                <span className="text-sm font-bold">{weeksSem2} mgg × {jpPerWeek} JP = <span className="text-indigo-400">{jpSem2} JP</span></span>
              </div>

              <div className="pt-2">
                <p className="text-xs text-slate-400">Total Jam Pelajaran Setahun:</p>
                <p className="text-4xl font-extrabold text-indigo-400 mt-1 shadow-glow">{totalJP} <span className="text-sm font-medium text-slate-400">JP</span></p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-3.5 flex gap-2.5 items-start">
            <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Angka efektif ini akan menjadi batas acuan (validasi) saat Anda mendistribusikan alokasi JP ke setiap Tujuan Pembelajaran (TP) pada langkah berikutnya.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 border border-white/10 hover:bg-white/5 text-slate-300 font-semibold text-sm px-5 py-3 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Identitas
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          Lanjut ke CP & TP
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
