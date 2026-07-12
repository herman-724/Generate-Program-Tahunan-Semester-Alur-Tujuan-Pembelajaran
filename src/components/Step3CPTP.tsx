import React, { useState, useEffect } from 'react';
import { CP_DATABASE, CPDraft } from '../data/cpDatabase';
import { TPData } from '../types';
import { ArrowLeft, ArrowRight, Sparkles, Plus, Trash2, Library, Wand2 } from 'lucide-react';

interface Step3CPTPProps {
  cp: string;
  tps: TPData[];
  fase: string;
  kelas: string;
  subject: string;
  onChangeCP: (cp: string) => void;
  onChangeTPs: (tps: TPData[]) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Step3CPTP({
  cp,
  tps,
  fase,
  kelas,
  subject,
  onChangeCP,
  onChangeTPs,
  onPrev,
  onNext
}: Step3CPTPProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Filter templates based on fase and subject (or show all matching fase)
  const templates = CP_DATABASE.filter(item => item.fase === fase);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedTemplateId(id);
    const template = CP_DATABASE.find(item => item.id === id);
    if (template) {
      onChangeCP(template.cpText);
      // Auto pre-populate TPs if they are currently empty
      if (tps.length === 0) {
        const newTps: TPData[] = template.suggestedTPs.map((text, idx) => ({
          id: Math.random().toString(36).substring(2, 9),
          text,
          jp: 8,
          order: idx + 1,
          deepLearning: {
            profileDimensions: ['Berpikir Kritis'],
            principles: ['Bermakna'],
            experiences: ['Memahami']
          },
          semester: '1',
          schedule: {}
        }));
        onChangeTPs(newTps);
      }
    }
  };

  const handleAddTP = () => {
    const newTP: TPData = {
      id: Math.random().toString(36).substring(2, 9),
      text: '',
      jp: 4,
      order: tps.length + 1,
      deepLearning: {
        profileDimensions: [],
        principles: [],
        experiences: []
      },
      semester: '1',
      schedule: {}
    };
    onChangeTPs([...tps, newTP]);
  };

  const handleRemoveTP = (id: string) => {
    const filtered = tps.filter(tp => tp.id !== id);
    // Reorder
    const updated = filtered.map((tp, idx) => ({ ...tp, order: idx + 1 }));
    onChangeTPs(updated);
  };

  const handleTPTextChange = (id: string, text: string) => {
    onChangeTPs(tps.map(tp => tp.id === id ? { ...tp, text } : tp));
  };

  // AI Generator using Gemini endpoint /api/generate-tps
  const handleGenerateAI = async () => {
    if (!cp) {
      alert('Tulis atau pilih Capaian Pembelajaran (CP) terlebih dahulu!');
      return;
    }

    setAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch('/api/generate-tps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cp,
          fase,
          kelas,
          subject
        })
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi server asisten AI.');
      }

      const result = await response.json();
      if (result.tps && Array.isArray(result.tps)) {
        const generated: TPData[] = result.tps.map((item: any, idx: number) => ({
          id: Math.random().toString(36).substring(2, 9),
          text: item.text,
          jp: item.jp || 8,
          order: idx + 1,
          deepLearning: {
            profileDimensions: item.deepLearning?.profileDimensions || ['Berpikir Kritis'],
            principles: item.deepLearning?.principles || ['Bermakna'],
            experiences: item.deepLearning?.experiences || ['Memahami']
          },
          semester: '1',
          schedule: {}
        }));

        if (tps.length > 0) {
          if (window.confirm('AI berhasil membuat rekomendasi Tujuan Pembelajaran. Apakah Anda ingin menimpa (replace) daftar TP saat ini?')) {
            onChangeTPs(generated);
          } else if (window.confirm('Apakah Anda ingin menambahkan (append) hasil rekomendasi ke daftar saat ini?')) {
            onChangeTPs([...tps, ...generated.map((tp, i) => ({ ...tp, order: tps.length + i + 1 }))]);
          }
        } else {
          onChangeTPs(generated);
        }
      } else {
        throw new Error('Hasil AI tidak valid.');
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Gagal memproses AI.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 font-sans relative z-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Ekstraksi Capaian Pembelajaran (CP) ke Tujuan Pembelajaran (TP)</h3>
          <p className="text-sm text-slate-400">Tentukan Capaian Pembelajaran (CP) mata pelajaran, kemudian pecahkan menjadi beberapa kalimat Tujuan Pembelajaran (TP).</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Template CP Selector */}
        <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Library className="h-5 w-5 text-indigo-400" />
            <div>
              <span className="text-sm font-bold text-white block">Database CP Kemdikbud</span>
              <span className="text-xs text-slate-400 block">Tersedia template standar berdasarkan Fase {fase}</span>
            </div>
          </div>
          <div className="w-full md:w-80">
            <select
              id="select-cp-template"
              value={selectedTemplateId}
              onChange={handleTemplateChange}
              className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-xs text-white cursor-pointer focus:outline-none"
            >
              <option value="">-- Pilih Template CP --</option>
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>{tpl.subject} ({tpl.fase})</option>
              ))}
            </select>
          </div>
        </div>

        {/* CP Text Area */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Bunyi Capaian Pembelajaran (CP)</label>
          <textarea
            id="textarea-cp"
            value={cp}
            onChange={(e) => onChangeCP(e.target.value)}
            rows={4}
            placeholder="Ketikkan rumusan Capaian Pembelajaran (CP) di sini, atau pilih dari template di atas..."
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white placeholder-slate-500 text-sm transition-colors leading-relaxed focus:outline-none"
          />
        </div>

        {/* AI & TP Section */}
        <div className="pt-4 border-t border-white/5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tujuan Pembelajaran (TP) Terinci</span>
            <button
              id="ai-generate-tps-btn"
              onClick={handleGenerateAI}
              disabled={aiLoading || !cp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50"
            >
              {aiLoading ? (
                <span className="animate-spin h-3.5 w-3.5 border-b-2 border-white rounded-full"></span>
              ) : (
                <Wand2 className="h-3.5 w-3.5" />
              )}
              {aiLoading ? 'Sedang Memproses...' : 'Urai dengan AI EduGen'}
            </button>
          </div>

          {aiError && (
            <div className="mb-4 bg-rose-950/20 border border-rose-500/25 rounded-xl p-3 text-xs text-rose-300">
              {aiError}
            </div>
          )}

          {tps.length === 0 ? (
            <div className="bg-white/[0.01] rounded-2xl border border-dashed border-white/10 py-10 px-4 text-center">
              <p className="text-xs text-slate-400">Belum ada Tujuan Pembelajaran (TP) yang dibuat.</p>
              <button
                onClick={handleAddTP}
                className="mt-3 inline-flex items-center gap-1 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs px-3 py-1.5 rounded-lg border border-white/10 cursor-pointer shadow-sm transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah TP Manual
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {tps.map((tp, index) => (
                <div key={tp.id} className="flex gap-3 items-start group">
                  <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                    TP {index + 1}
                  </div>
                  <div className="grow">
                    <input
                      id={`input-tp-text-${tp.id}`}
                      type="text"
                      value={tp.text}
                      onChange={(e) => handleTPTextChange(tp.id, e.target.value)}
                      placeholder={`Contoh: Memahami operasi dasar bilangan cacah sampai 100`}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white placeholder-slate-500 text-sm transition-colors focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveTP(tp.id)}
                    className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer mt-1"
                    title="Hapus TP"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2 justify-start pt-2">
                <button
                  id="btn-add-tp-row"
                  onClick={handleAddTP}
                  className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-bold text-xs bg-white/5 border border-white/15 hover:bg-white/10 px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Tambah TP Baru
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 border border-white/10 hover:bg-white/5 text-slate-300 font-semibold text-sm px-5 py-3 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Waktu Efektif
        </button>

        <button
          onClick={onNext}
          disabled={tps.length === 0}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          Lanjut ke Pemetaan Deep Learning
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
