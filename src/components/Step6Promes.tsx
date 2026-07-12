import React, { useState } from 'react';
import { TPData, PromesSettings, MONTHS_SEM1, MONTHS_SEM2 } from '../types';
import { ArrowLeft, ArrowRight, Info, AlertCircle, X, ShieldAlert } from 'lucide-react';

interface Step6PromesProps {
  tps: TPData[];
  promesSettings: PromesSettings;
  onChangeTPs: (tps: TPData[]) => void;
  onChangeSettings: (settings: PromesSettings) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Step6Promes({
  tps,
  promesSettings,
  onChangeTPs,
  onChangeSettings,
  onPrev,
  onNext
}: Step6PromesProps) {
  const [activeSem, setActiveSem] = useState<'1' | '2'>('1');
  const [editingNonEffectiveKey, setEditingNonEffectiveKey] = useState<string | null>(null);
  const [nonEffectiveLabel, setNonEffectiveLabel] = useState('');

  const months = activeSem === '1' ? MONTHS_SEM1 : MONTHS_SEM2;
  const filteredTps = tps.filter(tp => tp.semester === activeSem);

  const handleToggleCell = (tpId: string, monthIdx: number, weekIdx: number) => {
    // Check if this week is non-effective
    const nonEffectiveKey = `${activeSem}_${monthIdx}_${weekIdx}`;
    if (promesSettings.nonEffectiveWeeks[nonEffectiveKey]) {
      return; // Do not allow teaching on non-effective weeks
    }

    const updated = tps.map(tp => {
      if (tp.id === tpId) {
        const schedule = { ...tp.schedule };
        const key = `${monthIdx}_${weekIdx}`;
        schedule[key] = !schedule[key];
        return { ...tp, schedule };
      }
      return tp;
    });
    onChangeTPs(updated);
  };

  const handleOpenNonEffectiveEditor = (monthIdx: number, weekIdx: number) => {
    const key = `${activeSem}_${monthIdx}_${weekIdx}`;
    setEditingNonEffectiveKey(key);
    setNonEffectiveLabel(promesSettings.nonEffectiveWeeks[key] || '');
  };

  const handleSaveNonEffective = () => {
    if (!editingNonEffectiveKey) return;
    const updatedWeeks = { ...promesSettings.nonEffectiveWeeks };
    if (nonEffectiveLabel.trim() === '') {
      delete updatedWeeks[editingNonEffectiveKey];
    } else {
      updatedWeeks[editingNonEffectiveKey] = nonEffectiveLabel;
    }
    onChangeSettings({ nonEffectiveWeeks: updatedWeeks });
    setEditingNonEffectiveKey(null);
  };

  const handleClearNonEffective = (key: string) => {
    const updatedWeeks = { ...promesSettings.nonEffectiveWeeks };
    delete updatedWeeks[key];
    onChangeSettings({ nonEffectiveWeeks: updatedWeeks });
  };

  // Helper to check total allocated weeks and matching JP per TP
  const getJPWarning = (tp: TPData) => {
    const allocatedWeeks = Object.keys(tp.schedule || {}).filter(k => tp.schedule[k]).length;
    // We assume 1 week = tp.jp / weeks? Actually, in Promes, 
    // each shaded box generally represents a portion of the week's JP, typically 1 week's worth of JP.
    // If a TP has 12 JP, and the subject is 4 JP/week, they should shade exactly 3 weeks.
    // Let's provide an informative info badge.
    return allocatedWeeks;
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 font-sans relative z-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Pengaturan Jadwal Mingguan (Program Semester)</h3>
          <p className="text-sm text-slate-400">Tentukan minggu-minggu tidak efektif (libur, UTS, UAS) dan distribusikan kegiatan ajar ke minggu yang tersedia.</p>
        </div>

        {/* Semester Tabs */}
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl shrink-0">
          <button
            id="tab-sem1"
            onClick={() => setActiveSem('1')}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              activeSem === '1' ? 'bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-500/25' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semester 1 (Ganjil)
          </button>
          <button
            id="tab-sem2"
            onClick={() => setActiveSem('2')}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              activeSem === '2' ? 'bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-500/25' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semester 2 (Genap)
          </button>
        </div>
      </div>

      {/* Info helper */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 flex gap-3 mb-6">
        <Info className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <p className="font-bold">Cara Pengisian Kalender Promes:</p>
          <ul className="list-disc pl-4 mt-1 space-y-1">
            <li>Klik pada baris <strong>"Minggu Efektif"</strong> di kolom minggu tertentu untuk menandai minggu tidak efektif (seperti UTS, UAS, atau Libur).</li>
            <li>Klik pada sel di baris TP untuk <strong>mengarsir/memblok warna</strong> jadwal kegiatan belajar mengajar TP tersebut.</li>
          </ul>
        </div>
      </div>

      {/* Non effective editor Modal/Popup */}
      {editingNonEffectiveKey && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950 rounded-3xl p-6 max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-wide">Atur Keterangan Minggu</h4>
              <button onClick={() => setEditingNonEffectiveKey(null)} className="p-1 hover:bg-white/5 rounded-lg cursor-pointer">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Beri tanda bahwa minggu ini tidak ada KBM (misal: "UTS", "UAS", "Libur Semester"). Kosongkan untuk menjadikannya minggu efektif kembali.
            </p>
            <input
              type="text"
              value={nonEffectiveLabel}
              onChange={(e) => setNonEffectiveLabel(e.target.value)}
              placeholder="Contoh: UTS Ganjil / Libur"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-white text-sm mb-4 font-semibold"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditingNonEffectiveKey(null)}
                className="px-3.5 py-2 text-xs font-bold text-slate-300 border border-white/10 rounded-xl hover:bg-white/5 cursor-pointer"
              >
                Batal
              </button>
              <button
                id="save-non-effective-btn"
                onClick={handleSaveNonEffective}
                className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promes Matrix Container */}
      <div className="overflow-x-auto border border-white/10 rounded-3xl shadow-lg bg-black/40">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            {/* Header row 1: Months */}
            <tr className="bg-white/5">
              <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-wider w-80 border-b border-r border-white/10" rowSpan={2}>
                Tujuan Pembelajaran (TP)
              </th>
              <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-wider w-16 text-center border-b border-r border-white/10" rowSpan={2}>
                JP
              </th>
              {months.map((m, mIdx) => (
                <th key={m.name} className="p-2 text-xs font-bold text-slate-300 text-center uppercase tracking-wider border-b border-r border-white/10" colSpan={5}>
                  {m.name}
                </th>
              ))}
            </tr>
            {/* Header row 2: Weeks 1-5 */}
            <tr className="bg-white/[0.02]">
              {months.map((m, mIdx) => (
                [1, 2, 3, 4, 5].map((w) => (
                  <th key={`${m.name}-${w}`} className="p-1.5 text-[10px] font-bold text-slate-400 text-center border-b border-r border-white/10 w-8">
                    W{w}
                  </th>
                ))
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Special row for non-effective weeks settings */}
            <tr className="bg-amber-500/5">
              <td className="p-4 text-xs font-bold text-amber-300 border-b border-r border-white/10">
                ⭐ Status Minggu Efektif KBM
                <span className="block text-[10px] font-medium text-slate-500 mt-0.5">Klik sel untuk tandai UTS / UAS / Libur</span>
              </td>
              <td className="p-4 border-b border-r border-white/10"></td>
              {months.map((m, mIdx) => (
                [0, 1, 2, 3, 4].map((wIdx) => {
                  const key = `${activeSem}_${mIdx}_${wIdx}`;
                  const label = promesSettings.nonEffectiveWeeks[key];

                  return (
                    <td
                      key={key}
                      onClick={() => handleOpenNonEffectiveEditor(mIdx, wIdx)}
                      className={`p-1.5 border-b border-r border-white/10 text-center text-[8px] font-extrabold cursor-pointer hover:bg-amber-500/10 transition-colors ${
                        label ? 'bg-amber-500/20 text-amber-300' : 'text-slate-500'
                      }`}
                      title={label ? `Non-efektif: ${label}` : 'Klik untuk atur non-efektif'}
                    >
                      {label ? (
                        <span className="bg-amber-500/30 px-1 py-0.5 rounded uppercase font-bold tracking-tighter block truncate max-w-[32px] mx-auto text-amber-300 border border-amber-500/20">
                          {label.substring(0, 3)}
                        </span>
                      ) : (
                        <span className="opacity-0 hover:opacity-100 text-amber-500">+</span>
                      )}
                    </td>
                  );
                })
              ))}
            </tr>

            {/* TP Rows */}
            {filteredTps.length === 0 ? (
              <tr>
                <td colSpan={months.length * 5 + 2} className="p-8 text-center text-xs text-slate-500">
                  Tidak ada TP yang dialokasikan di Semester ini. Ubah alokasi Semester TP Anda pada langkah sebelumnya (Langkah 5).
                </td>
              </tr>
            ) : (
              filteredTps.map((tp) => {
                const allocatedWeeks = getJPWarning(tp);

                return (
                  <tr key={tp.id} className="bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                    <td className="p-4 border-b border-r border-white/10 text-xs font-semibold text-slate-300 leading-relaxed">
                      {tp.text || '(Belum mengisi kalimat TP)'}
                      {allocatedWeeks > 0 && (
                        <span className="block text-[10px] text-emerald-400 font-bold mt-1">
                          ✓ Terjadwal {allocatedWeeks} minggu
                        </span>
                      )}
                    </td>
                    <td className="p-4 border-b border-r border-white/10 text-xs font-bold text-center text-slate-400">
                      {tp.jp}
                    </td>

                    {/* Week cells */}
                    {months.map((m, mIdx) => (
                      [0, 1, 2, 3, 4].map((wIdx) => {
                        const cellKey = `${mIdx}_${wIdx}`;
                        const isChecked = tp.schedule?.[cellKey];
                        const nonEffectiveKey = `${activeSem}_${mIdx}_${wIdx}`;
                        const nonEffectiveLabel = promesSettings.nonEffectiveWeeks[nonEffectiveKey];

                        return (
                          <td
                            key={cellKey}
                            onClick={() => handleToggleCell(tp.id, mIdx, wIdx)}
                            className={`border-b border-r border-white/10 text-center transition-all p-1 ${
                              nonEffectiveLabel
                                ? 'bg-white/[0.02] cursor-not-allowed select-none'
                                : 'cursor-pointer hover:bg-indigo-500/10'
                            }`}
                          >
                            {nonEffectiveLabel ? (
                              <div className="h-6 flex items-center justify-center text-[8px] font-bold text-slate-500 uppercase select-none leading-none rotate-12">
                                {nonEffectiveLabel.substring(0, 3)}
                              </div>
                            ) : isChecked ? (
                              <div className="h-6 w-full rounded-md bg-gradient-to-tr from-indigo-500 to-indigo-700 shadow-[0_0_12px_rgba(99,102,241,0.4)] flex items-center justify-center animate-scale-up text-white font-bold text-[9px]">
                                {tp.jp / allocatedWeeks ? `${Math.round(tp.jp / allocatedWeeks)}J` : '✓'}
                              </div>
                            ) : (
                              <div className="h-6 w-full rounded-md border border-dashed border-white/5 group-hover:border-white/10"></div>
                            )}
                          </td>
                        );
                      })
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 border border-white/10 hover:bg-white/5 text-slate-300 font-semibold text-sm px-5 py-3 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Susun ATP
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          Lanjut ke Review & Ekspor
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
