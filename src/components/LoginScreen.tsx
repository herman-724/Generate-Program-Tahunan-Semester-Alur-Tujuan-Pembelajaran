import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup, signInAnonymously } from '../lib/firebase';
import { BookOpen, LogIn, Sparkles, UserCheck } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onLoginSuccess();
    } catch (err: any) {
      console.error(err);
      setError('Gagal masuk dengan Google. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInAnonymously(auth);
      onLoginSuccess();
    } catch (err: any) {
      console.error(err);
      setError('Gagal masuk sebagai tamu. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-slate-300 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-950/20 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-950/20 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="max-w-md mx-auto w-full my-auto z-10">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] mb-5">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            EduGen Merdeka
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Penyusunan Prota, Promes, dan ATP Kurikulum Merdeka Terintegrasi Pembelajaran Mendalam (Deep Learning).
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl border border-white/10">
          <div className="space-y-6">
            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-4 flex gap-3">
              <Sparkles className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5 shadow-glow" />
              <div className="text-xs text-indigo-200 leading-relaxed">
                <strong>Teknologi AI Terintegrasi:</strong> Pecah Capaian Pembelajaran (CP) menjadi Tujuan Pembelajaran (TP) secara instan dibantu AI yang diselaraskan dengan 8 Dimensi Profil Lulusan.
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs text-rose-400">
                {error}
              </div>
            )}

            <button
              id="google-login-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex justify-center items-center gap-3 px-4 py-3 border border-white/10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-medium text-sm transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Masuk dengan Google
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
              onClick={handleAnonymousLogin}
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="h-4 w-4" />
              Coba Gratis (Masuk Tamu)
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 max-w-sm mx-auto z-10 leading-relaxed">
        <div className="mb-2 text-indigo-400 font-bold tracking-wide">
          @Karya HERMAN, S.Pd &bull; SDN 2 LEMBAR SELATAN
        </div>
        EduGen Merdeka adalah perangkat penyusunan dokumen ajar Kurikulum Merdeka secara otomatis, berfokus pada kualitas pembelajaran mendalam (Deep Learning) siswa.
      </div>
    </div>
  );
}
