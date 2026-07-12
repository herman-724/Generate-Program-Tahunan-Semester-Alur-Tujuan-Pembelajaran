import React, { useEffect, useState } from 'react';
import { ProfileData } from '../types';
import { User, School, Calendar, ArrowRight } from 'lucide-react';

interface Step1ProfileProps {
  data: ProfileData;
  onChange: (data: Partial<ProfileData>) => void;
  onNext: () => void;
}

export default function Step1Profile({ data, onChange, onNext }: Step1ProfileProps) {
  const [fase, setFase] = useState(data.fase || 'A');

  // Sync state if prop changes
  useEffect(() => {
    if (data.fase) {
      setFase(data.fase);
    }
  }, [data.fase]);

  // Determine available classes based on Fase
  const getClassesForFase = (selectedFase: string) => {
    switch (selectedFase) {
      case 'A': return ['1', '2'];
      case 'B': return ['3', '4'];
      case 'C': return ['5', '6'];
      case 'D': return ['7', '8', '9'];
      case 'E': return ['10'];
      case 'F': return ['11', '12'];
      default: return ['1', '2'];
    }
  };

  const handleFaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFase = e.target.value;
    setFase(newFase);
    const availableClasses = getClassesForFase(newFase);
    // Auto select first class in that Fase
    onChange({ fase: newFase, kelas: availableClasses[0] });
  };

  const classes = getClassesForFase(fase);

  return (
    <div className="bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 font-sans relative z-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Identitas & Profil Satuan Pendidikan</h3>
        <p className="text-sm text-slate-400">Lengkapi data profil guru dan satuan pendidikan untuk dicantumkan di lembar dokumen kurikulum.</p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Profil Guru */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-indigo-400">
            <User className="h-5 w-5" />
            <span className="font-bold text-sm tracking-wide uppercase">Profil Pendidik</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nama Guru</label>
              <input
                id="input-nama-guru"
                type="text"
                value={data.namaGuru || ''}
                onChange={(e) => onChange({ namaGuru: e.target.value })}
                placeholder="Contoh: Budi Santoso, S.Pd."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white placeholder-slate-500 text-sm transition-colors focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">NIP</label>
              <input
                id="input-nip"
                type="text"
                value={data.nip || ''}
                onChange={(e) => onChange({ nip: e.target.value })}
                placeholder="Contoh: 19850312 201101 1 002"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white placeholder-slate-500 text-sm transition-colors focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Jabatan</label>
              <input
                id="input-jabatan"
                type="text"
                value={data.jabatan || ''}
                onChange={(e) => onChange({ jabatan: e.target.value })}
                placeholder="Contoh: Guru Madya / Wali Kelas"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white placeholder-slate-500 text-sm transition-colors focus:outline-none"
              />
            </div>
          </div>
        </div>

        <hr className="border-white/5" />

        {/* Section 2: Profil Sekolah */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-indigo-400">
            <School className="h-5 w-5" />
            <span className="font-bold text-sm tracking-wide uppercase">Satuan Pendidikan</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nama Sekolah</label>
              <input
                id="input-nama-sekolah"
                type="text"
                value={data.namaSekolah || ''}
                onChange={(e) => onChange({ namaSekolah: e.target.value })}
                placeholder="Contoh: SDN Merdeka Belajar"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white placeholder-slate-500 text-sm transition-colors focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Kepala Sekolah</label>
              <input
                id="input-kepala-sekolah"
                type="text"
                value={data.kepalaSekolah || ''}
                onChange={(e) => onChange({ kepalaSekolah: e.target.value })}
                placeholder="Contoh: Dra. H. Siti Aminah, M.Pd."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white placeholder-slate-500 text-sm transition-colors focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">NIP Kepala Sekolah</label>
              <input
                id="input-nip-kepala-sekolah"
                type="text"
                value={data.nipKepalaSekolah || ''}
                onChange={(e) => onChange({ nipKepalaSekolah: e.target.value })}
                placeholder="Contoh: 19740508 199903 2 001"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white placeholder-slate-500 text-sm transition-colors focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tahun Ajaran</label>
              <input
                id="input-tahun-ajaran"
                type="text"
                value={data.tahunAjaran || ''}
                onChange={(e) => onChange({ tahunAjaran: e.target.value })}
                placeholder="Contoh: 2026/2027"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white placeholder-slate-500 text-sm transition-colors focus:outline-none"
              />
            </div>
          </div>
        </div>

        <hr className="border-white/5" />

        {/* Section 3: Kurikulum Dasar */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-indigo-400">
            <Calendar className="h-5 w-5" />
            <span className="font-bold text-sm tracking-wide uppercase">Pembagian Kelas & Mapel</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Fase</label>
              <select
                id="select-fase"
                value={fase}
                onChange={handleFaseChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white text-sm transition-colors cursor-pointer focus:outline-none"
              >
                <option value="A">Fase A (Kelas 1-2)</option>
                <option value="B">Fase B (Kelas 3-4)</option>
                <option value="C">Fase C (Kelas 5-6)</option>
                <option value="D">Fase D (Kelas 7-9)</option>
                <option value="E">Fase E (Kelas 10)</option>
                <option value="F">Fase F (Kelas 11-12)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Kelas</label>
              <select
                id="select-kelas"
                value={data.kelas || classes[0]}
                onChange={(e) => onChange({ kelas: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white text-sm transition-colors cursor-pointer focus:outline-none"
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>Kelas {cls}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mata Pelajaran</label>
              <input
                id="input-mata-pelajaran"
                type="text"
                value={data.mataPelajaran || ''}
                onChange={(e) => onChange({ mataPelajaran: e.target.value })}
                placeholder="Contoh: Matematika"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white placeholder-slate-500 text-sm transition-colors focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          id="btn-next-step-1"
          onClick={onNext}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          Lanjut ke Minggu Efektif
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
