import React, { useState } from 'react';
import { Project, MONTHS_SEM1, MONTHS_SEM2 } from '../types';
import { ArrowLeft, Printer, FileSpreadsheet, FileDown, CheckCircle2 } from 'lucide-react';

interface Step7ExportProps {
  project: Project;
  onPrev: () => void;
}

export default function Step7Export({ project, onPrev }: Step7ExportProps) {
  const [activeTab, setActiveTab] = useState<'atp' | 'prota' | 'promes'>('atp');

  const { profile, curriculum, tps, promesSettings } = project;

  // Total JP stats
  const targetJP = curriculum.jpPerWeek * (curriculum.weeksEffectiveSem1 + curriculum.weeksEffectiveSem2);
  const allocatedJP = tps.reduce((acc, tp) => acc + (tp.jp || 0), 0);

  // Group TPs by semester
  const tpsSem1 = tps.filter(tp => tp.semester === '1');
  const tpsSem2 = tps.filter(tp => tp.semester === '2');

  const handlePrint = () => {
    window.print();
  };

  // Export as CSV/HTML Table for Excel/Word
  const handleExportExcel = () => {
    let htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 6px; font-family: Arial, sans-serif; font-size: 11px; }
          th { background-color: #f2f2f2; }
          .header-table { border: none; }
          .header-table td { border: none; font-size: 14px; font-weight: bold; }
        </style>
      </head>
      <body>
    `;

    // Add Kop/Header
    htmlContent += `
      <table class="header-table">
        <tr><td colspan="5" align="center">DOKUMEN PERANGKAT AJAR KURIKULUM MERDEKA</td></tr>
        <tr><td colspan="5" align="center">TAHUN AJARAN ${profile.tahunAjaran || '-'}</td></tr>
        <tr><td></td></tr>
        <tr><td>Mata Pelajaran</td><td>: ${profile.mataPelajaran || '-'}</td></tr>
        <tr><td>Satuan Pendidikan</td><td>: ${profile.namaSekolah || '-'}</td></tr>
        <tr><td>Fase / Kelas</td><td>: ${profile.fase || '-'} / ${profile.kelas || '-'}</td></tr>
        <tr><td>Nama Guru</td><td>: ${profile.namaGuru || '-'}</td></tr>
      </table>
      <br/><br/>
    `;

    if (activeTab === 'atp') {
      htmlContent += `
        <h3>ALUR TUJUAN PEMBELAJARAN (ATP)</h3>
        <table>
          <thead>
            <tr>
              <th>Capaian Pembelajaran (CP)</th>
              <th>Tujuan Pembelajaran (TP)</th>
              <th>Alokasi Jam Pelajaran (JP)</th>
              <th>Integrasi Pembelajaran Mendalam (Deep Learning)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="${tps.length || 1}" valign="top">${curriculum.cp || ''}</td>
              <td>${tps[0]?.text || ''}</td>
              <td align="center">${tps[0]?.jp || 0}</td>
              <td>[Profil: ${tps[0]?.deepLearning?.profileDimensions?.join(', ') || ''}] [Prinsip: ${tps[0]?.deepLearning?.principles?.join(', ') || ''}] [Pengalaman: ${tps[0]?.deepLearning?.experiences?.join(', ') || ''}]</td>
            </tr>
            ${tps.slice(1).map(tp => `
              <tr>
                <td>${tp.text}</td>
                <td align="center">${tp.jp}</td>
                <td>[Profil: ${tp.deepLearning?.profileDimensions?.join(', ') || ''}] [Prinsip: ${tp.deepLearning?.principles?.join(', ') || ''}] [Pengalaman: ${tp.deepLearning?.experiences?.join(', ') || ''}]</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (activeTab === 'prota') {
      htmlContent += `
        <h3>PROGRAM TAHUNAN (PROTA)</h3>
        <table>
          <thead>
            <tr>
              <th>Semester</th>
              <th>No. TP</th>
              <th>Tujuan Pembelajaran (TP)</th>
              <th>Alokasi JP</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            ${tps.map((tp, idx) => `
              <tr>
                <td align="center">${tp.semester === '1' ? 'I (Ganjil)' : 'II (Genap)'}</td>
                <td align="center">${idx + 1}</td>
                <td>${tp.text}</td>
                <td align="center">${tp.jp}</td>
                <td>Sesuai urutan ATP</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      // Promes Table Export
      const semesters = ['1', '2'];
      semesters.forEach(sem => {
        const months = sem === '1' ? MONTHS_SEM1 : MONTHS_SEM2;
        const semTps = tps.filter(tp => tp.semester === sem);

        htmlContent += `
          <h3>PROGRAM SEMESTER (PROMES) SEMESTER ${sem === '1' ? 'I (GANJIL)' : 'II (GENAP)'}</h3>
          <table>
            <thead>
              <tr>
                <th rowspan="2">Tujuan Pembelajaran (TP)</th>
                <th rowspan="2">JP</th>
                ${months.map(m => `<th colspan="5">${m.name}</th>`).join('')}
              </tr>
              <tr>
                ${months.map(m => [1,2,3,4,5].map(w => `<th>W${w}</th>`).join('')).join('')}
              </tr>
            </thead>
            <tbody>
              ${semTps.map(tp => `
                <tr>
                  <td>${tp.text}</td>
                  <td align="center">${tp.jp}</td>
                  ${months.map((m, mIdx) => [0,1,2,3,4].map(wIdx => {
                    const key = `${mIdx}_${wIdx}`;
                    const isChecked = tp.schedule?.[key];
                    const nonEffectiveKey = `${sem}_${mIdx}_${wIdx}`;
                    const label = promesSettings.nonEffectiveWeeks[nonEffectiveKey];
                    return `<td align="center" style="${label ? 'background-color:#e2e8f0;' : isChecked ? 'background-color:#93c5fd;' : ''}">${label || (isChecked ? 'X' : '')}</td>`;
                  }).join('')).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <br/><br/>
        `;
      });
    }

    htmlContent += `</body></html>`;

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTab.toUpperCase()}_${profile.mataPelajaran || 'EduGen'}_${profile.tahunAjaran?.replace('/', '-') || ''}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 font-sans relative z-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      {/* Action Buttons header - Hidden in Print */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Pratinjau Dokumen & Ekspor Akhir</h3>
          <p className="text-sm text-slate-400 font-medium">Dokumen ajar siap dicetak atau diekspor ke Microsoft Excel.</p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            Ekspor ke Excel
          </button>

          <button
            id="print-document-btn"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* Tabs Selector - Hidden in Print */}
      <div className="flex border-b border-white/10 mb-6 print:hidden">
        <button
          id="tab-atp"
          onClick={() => setActiveTab('atp')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'atp' ? 'border-indigo-500 text-indigo-400 font-bold shadow-[0_2px_0_rgba(99,102,241,1)]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          1. Alur Tujuan Pembelajaran (ATP)
        </button>
        <button
          id="tab-prota"
          onClick={() => setActiveTab('prota')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'prota' ? 'border-indigo-500 text-indigo-400 font-bold shadow-[0_2px_0_rgba(99,102,241,1)]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          2. Program Tahunan (Prota)
        </button>
        <button
          id="tab-promes"
          onClick={() => setActiveTab('promes')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'promes' ? 'border-indigo-500 text-indigo-400 font-bold shadow-[0_2px_0_rgba(99,102,241,1)]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          3. Program Semester (Promes)
        </button>
      </div>

      {/* Print Document Wrapper */}
      <div className="bg-slate-950 p-4 sm:p-8 border border-white/5 rounded-3xl print:border-0 print:p-0 print:bg-transparent text-slate-300 print:text-slate-900">
        
        {/* Kop Surat / Header Dokumen */}
        <div className="text-center pb-6 border-b-2 border-white/20 print:border-slate-900 mb-6">
          <h1 className="text-lg font-bold text-white print:text-slate-900 uppercase tracking-wide leading-tight">
            PERANGKAT AJAR KURIKULUM MERDEKA
          </h1>
          <h2 className="text-base font-bold text-slate-300 print:text-slate-800 uppercase tracking-wider leading-relaxed mt-1">
            TAHUN AJARAN {profile.tahunAjaran || '-'}
          </h2>
        </div>

        {/* Identitas Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-300 print:text-slate-700 mb-8 bg-white/[0.02] p-4 rounded-2xl print:bg-transparent print:p-0 print:border-0 border border-white/5">
          <div className="space-y-1.5">
            <p><span className="inline-block w-32 text-slate-500 print:text-slate-400">Mata Pelajaran</span>: <span className="text-white print:text-slate-800 font-bold">{profile.mataPelajaran || '-'}</span></p>
            <p><span className="inline-block w-32 text-slate-500 print:text-slate-400">Satuan Pendidikan</span>: <span className="text-white print:text-slate-800 font-bold">{profile.namaSekolah || '-'}</span></p>
            <p><span className="inline-block w-32 text-slate-500 print:text-slate-400">Fase / Kelas</span>: <span className="text-white print:text-slate-800 font-bold">{profile.fase || '-'} / Kelas {profile.kelas || '-'}</span></p>
          </div>
          <div className="space-y-1.5 md:text-right">
            <p><span className="inline-block w-32 text-slate-500 print:text-slate-400 md:text-left">Nama Pendidik</span>: <span className="text-white print:text-slate-800 font-bold">{profile.namaGuru || '-'}</span></p>
            <p><span className="inline-block w-32 text-slate-500 print:text-slate-400 md:text-left">NIP Pendidik</span>: <span className="text-white print:text-slate-800 font-bold">{profile.nip || '-'}</span></p>
            <p><span className="inline-block w-32 text-slate-500 print:text-slate-400 md:text-left">Kepala Sekolah</span>: <span className="text-white print:text-slate-800 font-bold">{profile.kepalaSekolah || '-'}</span></p>
          </div>
        </div>

        {/* Tab content 1: ATP */}
        {(activeTab === 'atp' || window.matchMedia('print').matches) && (
          <div className={`${activeTab === 'atp' ? 'block' : 'hidden print:block'}`}>
            <h3 className="text-sm font-bold text-white print:text-slate-900 uppercase tracking-wider mb-3">I. ALUR TUJUAN PEMBELAJARAN (ATP)</h3>
            
            <div className="overflow-x-auto border border-white/10 print:border-slate-200 rounded-2xl print:rounded-none">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/5 print:bg-slate-50 border-b border-white/10 print:border-slate-200">
                    <th className="p-3 font-bold text-slate-300 print:text-slate-700 w-1/3 border-r border-white/10 print:border-slate-200">Capaian Pembelajaran (CP)</th>
                    <th className="p-3 font-bold text-slate-300 print:text-slate-700 w-1/3 border-r border-white/10 print:border-slate-200">Tujuan Pembelajaran (TP)</th>
                    <th className="p-3 font-bold text-slate-300 print:text-slate-700 text-center w-16 border-r border-white/10 print:border-slate-200">JP</th>
                    <th className="p-3 font-bold text-slate-300 print:text-slate-700 w-1/4">Integrasi Pembelajaran Mendalam (Deep Learning)</th>
                  </tr>
                </thead>
                <tbody>
                  {tps.map((tp, idx) => (
                    <tr key={tp.id} className="border-b border-white/10 print:border-slate-200">
                      {idx === 0 && (
                        <td className="p-3 text-slate-400 print:text-slate-600 leading-relaxed border-r border-white/10 print:border-slate-200 align-top font-medium" rowSpan={tps.length}>
                          {curriculum.cp || 'Belum diisi'}
                        </td>
                      )}
                      <td className="p-3 text-white print:text-slate-800 font-semibold border-r border-white/10 print:border-slate-200 align-top">
                        {idx + 1}. {tp.text || '-'}
                      </td>
                      <td className="p-3 text-white print:text-slate-800 font-bold text-center border-r border-white/10 print:border-slate-200 align-top">
                        {tp.jp}
                      </td>
                      <td className="p-3 text-slate-400 print:text-slate-600 align-top space-y-1">
                        <div>
                          <strong className="text-[10px] text-slate-500 print:text-slate-400 block uppercase font-bold">Dimensi Profil:</strong>
                          <span className="text-white print:text-slate-800 font-semibold">{tp.deepLearning?.profileDimensions?.join(', ') || '-'}</span>
                        </div>
                        <div>
                          <strong className="text-[10px] text-slate-500 print:text-slate-400 block uppercase font-bold">Prinsip:</strong>
                          <span className="text-white print:text-slate-800 font-semibold">{tp.deepLearning?.principles?.join(', ') || '-'}</span>
                        </div>
                        <div>
                          <strong className="text-[10px] text-slate-500 print:text-slate-400 block uppercase font-bold">Pengalaman:</strong>
                          <span className="text-white print:text-slate-800 font-semibold">{tp.deepLearning?.experiences?.join(', ') || '-'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab content 2: Prota */}
        {(activeTab === 'prota' || window.matchMedia('print').matches) && (
          <div className={`${activeTab === 'prota' ? 'block' : 'hidden print:block'} ${activeTab !== 'prota' ? 'mt-12' : ''}`}>
            <h3 className="text-sm font-bold text-white print:text-slate-900 uppercase tracking-wider mb-3">II. PROGRAM TAHUNAN (PROTA)</h3>
            
            <div className="overflow-x-auto border border-white/10 print:border-slate-200 rounded-2xl print:rounded-none">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/5 print:bg-slate-50 border-b border-white/10 print:border-slate-200">
                    <th className="p-3 font-bold text-slate-300 print:text-slate-700 text-center w-28 border-r border-white/10 print:border-slate-200">Semester</th>
                    <th className="p-3 font-bold text-slate-300 print:text-slate-700 text-center w-16 border-r border-white/10 print:border-slate-200">No. TP</th>
                    <th className="p-3 font-bold text-slate-300 print:text-slate-700 border-r border-white/10 print:border-slate-200">Tujuan Pembelajaran (TP)</th>
                    <th className="p-3 font-bold text-slate-300 print:text-slate-700 text-center w-24 border-r border-white/10 print:border-slate-200">Alokasi Waktu</th>
                    <th className="p-3 font-bold text-slate-300 print:text-slate-700">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {tps.map((tp, idx) => (
                    <tr key={tp.id} className="border-b border-white/10 print:border-slate-200">
                      <td className="p-3 text-white print:text-slate-800 font-bold text-center border-r border-white/10 print:border-slate-200">
                        {tp.semester === '1' ? 'I (Ganjil)' : 'II (Genap)'}
                      </td>
                      <td className="p-3 text-white print:text-slate-800 font-bold text-center border-r border-white/10 print:border-slate-200">
                        {idx + 1}
                      </td>
                      <td className="p-3 text-white print:text-slate-800 font-semibold border-r border-white/10 print:border-slate-200 leading-relaxed">
                        {tp.text || '-'}
                      </td>
                      <td className="p-3 text-white print:text-slate-800 font-extrabold text-center border-r border-white/10 print:border-slate-200">
                        {tp.jp} JP
                      </td>
                      <td className="p-3 text-slate-500 font-medium">
                        Sesuai Alur Tujuan Pembelajaran
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-white/5 print:bg-slate-50 font-bold">
                    <td className="p-3 text-right border-r border-white/10 print:border-slate-200" colSpan={3}>
                      Total Alokasi Waktu Setahun
                    </td>
                    <td className="p-3 text-center text-indigo-400 print:text-blue-600 font-black border-r border-white/10 print:border-slate-200">
                      {allocatedJP} JP
                    </td>
                    <td className="p-3 text-slate-500 print:text-slate-400">
                      Target Efektif: {targetJP} JP
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab content 3: Promes */}
        {(activeTab === 'promes' || window.matchMedia('print').matches) && (
          <div className={`${activeTab === 'promes' ? 'block' : 'hidden print:block'} ${activeTab !== 'promes' ? 'mt-12' : ''}`}>
            <h3 className="text-sm font-bold text-white print:text-slate-900 uppercase tracking-wider mb-3">III. PROGRAM SEMESTER (PROMES)</h3>
            
            {['1', '2'].map((sem) => {
              const months = sem === '1' ? MONTHS_SEM1 : MONTHS_SEM2;
              const semTps = tps.filter(tp => tp.semester === sem);

              return (
                <div key={sem} className="mb-10 last:mb-0">
                  <h4 className="text-xs font-bold text-slate-400 print:text-slate-700 uppercase mb-2">
                    SEMESTER {sem === '1' ? 'I (GANJIL)' : 'II (GENAP)'}
                  </h4>
                  
                  <div className="overflow-x-auto border border-white/10 print:border-slate-200 rounded-2xl print:rounded-none">
                    <table className="w-full text-left text-[10px] border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-white/5 print:bg-slate-50 border-b border-white/10 print:border-slate-200">
                          <th className="p-2.5 font-bold text-slate-300 print:text-slate-700 border-r border-white/10 print:border-slate-200" rowSpan={2}>Tujuan Pembelajaran (TP)</th>
                          <th className="p-2.5 font-bold text-slate-300 print:text-slate-700 text-center w-12 border-r border-white/10 print:border-slate-200" rowSpan={2}>JP</th>
                          {months.map(m => (
                            <th key={m.name} className="p-1 font-bold text-slate-300 print:text-slate-700 text-center border-r border-white/10 print:border-slate-200" colSpan={5}>
                              {m.name}
                            </th>
                          ))}
                        </tr>
                        <tr className="bg-white/[0.02] print:bg-slate-50 border-b border-white/10 print:border-slate-200">
                          {months.map(m => (
                            [1,2,3,4,5].map(w => (
                              <th key={`${m.name}-${w}`} className="p-1 font-semibold text-slate-400 print:text-slate-500 text-center border-r border-white/10 print:border-slate-200 w-6">
                                W{w}
                              </th>
                            ))
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {semTps.length === 0 ? (
                          <tr>
                            <td colSpan={months.length * 5 + 2} className="p-4 text-center text-slate-500 print:text-slate-400">
                              Tidak ada TP terjadwal di semester ini.
                            </td>
                          </tr>
                        ) : (
                          semTps.map(tp => (
                            <tr key={tp.id} className="border-b border-white/10 print:border-slate-200">
                              <td className="p-2 border-r border-white/10 print:border-slate-200 font-semibold text-white print:text-slate-800 leading-relaxed max-w-[280px]">
                                {tp.text || '-'}
                              </td>
                              <td className="p-2 border-r border-white/10 print:border-slate-200 text-center font-bold text-white print:text-slate-800">
                                {tp.jp}
                              </td>
                              {months.map((m, mIdx) => (
                                [0,1,2,3,4].map(wIdx => {
                                  const key = `${mIdx}_${wIdx}`;
                                  const isChecked = tp.schedule?.[key];
                                  const nonEffectiveKey = `${sem}_${mIdx}_${wIdx}`;
                                  const label = promesSettings.nonEffectiveWeeks[nonEffectiveKey];

                                  return (
                                    <td
                                      key={key}
                                      className={`border-r border-white/10 print:border-slate-200 text-center text-[8px] font-black p-0.5 ${
                                        label 
                                          ? 'bg-white/[0.05] print:bg-slate-100 text-slate-500 print:text-slate-400' 
                                          : isChecked 
                                          ? 'bg-indigo-500/25 print:bg-slate-300 text-indigo-300 print:text-slate-900' 
                                          : ''
                                      }`}
                                    >
                                      {label ? label.substring(0, 3).toUpperCase() : isChecked ? 'X' : ''}
                                    </td>
                                  );
                                })
                              ))}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Signatures block */}
        <div className="mt-12 grid grid-cols-2 gap-8 text-xs text-slate-300 print:text-slate-700 font-bold">
          <div>
            <p>Mengetahui,</p>
            <p>Kepala Sekolah {profile.namaSekolah || '-'}</p>
            <br/><br/><br/>
            <p className="border-b border-white/10 print:border-slate-400 inline-block min-w-[200px] pb-1">{profile.kepalaSekolah || '...........................................'}</p>
            <p className="text-slate-500 print:text-slate-400 mt-1">NIP. {profile.nipKepalaSekolah || '...........................................'}</p>
          </div>
          <div className="text-right">
            <p>Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p>Guru Mata Pelajaran</p>
            <br/><br/><br/>
            <p className="border-b border-white/10 print:border-slate-400 inline-block min-w-[200px] pb-1">{profile.namaGuru || '...........................................'}</p>
            <p className="text-slate-500 print:text-slate-400 mt-1">NIP. {profile.nip || '...........................................'}</p>
          </div>
        </div>
      </div>

      {/* Navigation - Hidden in Print */}
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between print:hidden">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 border border-white/10 hover:bg-white/5 text-slate-300 font-semibold text-sm px-5 py-3 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Promes
        </button>

        <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-4 py-2.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shadow-glow" />
          Proses Penyusunan Selesai!
        </span>
      </div>
    </div>
  );
}
