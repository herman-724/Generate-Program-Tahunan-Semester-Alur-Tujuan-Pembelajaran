import React, { useState } from 'react';
import { BookOpen, Sparkles, User, School, Hash, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [namaGuru, setNamaGuru] = useState('');
  const [nip, setNip] = useState('');
  const [namaSekolah, setNamaSekolah] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      // Create local user profile based on inputs or default guest values
      const mockUser = {
        uid: 'local-user-' + Math.random().toString(36).substring(2, 9),
        email: 'guru@edugenmerdeka.id',
        displayName: namaGuru.trim() || 'Guru EduGen',
        nip: nip.trim(),
        namaSekolah: namaSekolah.trim(),
        isLocal: true,
        photoURL: null
      };
      
      localStorage.setItem('edugen_local_user', JSON.stringify(mockUser));
      onLoginSuccess(mockUser);
      setLoading(false);
    }, 400);
  };

  const handleGuestLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const mockUser = {
        uid: 'local-guest-user',
        email: 'tamu@edugenmerdeka.id',
        displayName: 'Tamu EduGen',
        nip: '',
        namaSekolah: '',
        isLocal: true,
        photoURL: null
      };
      localStorage.setItem('edugen_local_user', JSON.stringify(mockUser));
      onLoginSuccess(mockUser);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#050608] text-slate-300 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-950/20 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-950/10 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="max-w-md mx-auto w-full my-auto z-10">
        <div className="text-center mb-6">
          <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            EduGen Merdeka
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Penyusunan Prota, Promes, dan ATP Kurikulum Merdeka Terintegrasi Pembelajaran Mendalam (Deep Learning).
          </p>
          <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
            <span>● 100% Offline &amp; Local Storage</span>
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md py-6 px-6 shadow-2xl rounded-3xl border border-white/10">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-3.5 flex gap-3">
              <Sparkles className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-200 leading-relaxed">
                <strong>Penyimpanan Aman di Browser:</strong> Semua dokumen disimpan di perangkat Anda secara instan tanpa membutuhkan koneksi internet atau database cloud.
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nama Lengkap &amp; Gelar</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    id="login-nama-guru"
                    type="text"
                    required
                    value={namaGuru}
                    onChange={(e) => setNamaGuru(e.target.value)}
                    placeholder="Contoh: Herman, S.Pd"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white placeholder-slate-500 text-sm transition-colors focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">NIP (Opsional)</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    id="login-nip"
                    type="text"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="Contoh: 19820512 200903 1 004"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white placeholder-slate-500 text-sm transition-colors focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Satuan Pendidikan / Sekolah (Opsional)</label>
                <div className="relative">
                  <School className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    id="login-sekolah"
                    type="text"
                    value={namaSekolah}
                    onChange={(e) => setNamaSekolah(e.target.value)}
                    placeholder="Contoh: SDN 2 Lembar Selatan"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-white placeholder-slate-500 text-sm transition-colors focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              id="submit-login-btn"
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(99,102,241,0.25)] cursor-pointer"
            >
              <span>{loading ? 'Menyiapkan Workspace...' : 'Mulai Menyusun Sekarang'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0b0c10] px-2 text-slate-500">Atau</span>
              </div>
            </div>

            <button
              id="anonymous-login-btn"
              type="button"
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] cursor-pointer disabled:opacity-50"
            >
              Masuk Langsung Sebagai Tamu
            </button>
          </form>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 max-w-sm mx-auto z-10 leading-relaxed mt-6">
        <div className="mb-2 text-indigo-400 font-bold tracking-wide">
          @Karya HERMAN, S.Pd &bull; SDN 2 LEMBAR SELATAN
        </div>
        EduGen Merdeka adalah perangkat penyusunan dokumen ajar Kurikulum Merdeka secara otomatis, berfokus pada kualitas pembelajaran mendalam (Deep Learning) siswa.
      </div>
    </div>
  );
}
