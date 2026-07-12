export interface CPDraft {
  id: string;
  fase: string;
  subject: string;
  cpText: string;
  suggestedTPs: string[];
}

export const CP_DATABASE: CPDraft[] = [
  {
    id: 'sd-a-math',
    fase: 'A',
    subject: 'Matematika',
    cpText: 'Pada akhir Fase A, peserta didik dapat memahami bilangan cacah sampai dengan 100, melakukan operasi penjumlahan dan pengurangan bilangan cacah sampai 20, mengenal dan membandingkan bentuk bangun datar (segitiga, segiempat, lingkaran) dan bangun ruang, serta mengukur panjang dan berat benda menggunakan satuan tidak baku.',
    suggestedTPs: [
      'Membaca, menulis, dan membandingkan bilangan cacah sampai dengan 100.',
      'Melakukan operasi penjumlahan bilangan cacah sampai dengan 20.',
      'Melakukan operasi pengurangan bilangan cacah sampai dengan 20.',
      'Mengenal dan membandingkan bangun datar (segitiga, segiempat, lingkaran) berdasarkan cirinya.',
      'Mengukur panjang dan berat benda menggunakan alat ukur satuan tidak baku.'
    ]
  },
  {
    id: 'sd-b-ipas',
    fase: 'B',
    subject: 'IPAS (Ilmu Pengetahuan Alam dan Sosial)',
    cpText: 'Pada akhir Fase B, peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada manusia, panca indra, siklus hidup makhluk hidup, dan melestarikan lingkungan. Peserta didik mengidentifikasi wujud zat, perubahan wujud zat, serta gaya dan pengaruhnya terhadap benda dalam kehidupan sehari-hari.',
    suggestedTPs: [
      'Menganalisis hubungan antara bentuk dan fungsi bagian tubuh manusia dan panca indra.',
      'Mendeskripsikan tahapan siklus hidup makhluk hidup di lingkungan sekitar.',
      'Mengidentifikasi wujud zat (padat, cair, gas) dan perubahan wujudnya dalam kehidupan sehari-hari.',
      'Mendemonstrasikan gaya (otot, magnet, gesek, gravitasi) serta pengaruhnya terhadap gerak dan bentuk benda.'
    ]
  },
  {
    id: 'sd-c-indo',
    fase: 'C',
    subject: 'Bahasa Indonesia',
    cpText: 'Pada akhir Fase C, peserta didik memiliki kemampuan berbahasa untuk berkomunikasi dan bernalar sesuai dengan tujuan dan konteks. Peserta didik mampu memahami, mengolah, dan menginterpretasi informasi dari teks audiovisual dan teks lisan, serta membaca, memirsa, dan menulis teks naratif, informatif, dan persuasif.',
    suggestedTPs: [
      'Memahami dan mengolah informasi dari teks audiovisual dan lisan dengan kritis.',
      'Membaca dan memirsa teks naratif untuk menginterpretasi watak tokoh dan amanat cerita.',
      'Menulis teks informatif (eksposisi) dengan struktur yang runtut dan ejaan yang benar.',
      'Menulis teks persuasif sederhana untuk mengajak pembaca melakukan hal positif.'
    ]
  },
  {
    id: 'smp-d-math',
    fase: 'D',
    subject: 'Matematika',
    cpText: 'Pada akhir Fase D, peserta didik dapat menyelesaikan masalah yang berkaitan dengan rasio, proporsi, aljabar (persamaan dan pertidaksamaan linear satu variabel), geometri (teorema Pythagoras, transformasi, luas permukaan dan volume prisma/tabung), serta analisis data dan peluang.',
    suggestedTPs: [
      'Menyelesaikan masalah kontekstual yang berkaitan dengan rasio dan proporsi.',
      'Membuat dan menyelesaikan model matematika dari persamaan dan pertidaksamaan linear satu variabel.',
      'Menggunakan teorema Pythagoras dalam menyelesaikan masalah geometri sehari-hari.',
      'Menghitung luas permukaan dan volume bangun ruang (prisma dan tabung).',
      'Menganalisis data dari penyajian diagram batang, garis, dan lingkaran untuk mengambil kesimpulan.'
    ]
  },
  {
    id: 'smp-d-ipa',
    fase: 'D',
    subject: 'IPA (Ilmu Pengetahuan Alam)',
    cpText: 'Pada akhir Fase D, peserta didik memahami klasifikasi makhluk hidup, zat dan sifatnya, sistem organisasi kehidupan, interaksi makhluk hidup dengan lingkungannya, struktur bumi dan tata surya, serta konsep usaha, energi, pesawat sederhana, dan sistem organ pada manusia.',
    suggestedTPs: [
      'Melakukan klasifikasi makhluk hidup dan benda berdasarkan karakteristik yang diamati.',
      'Menganalisis perbedaan sifat zat (padat, cair, gas) serta perubahan fisika dan kimia.',
      'Menjelaskan sistem organisasi kehidupan mulai dari tingkat sel hingga organisme.',
      'Menganalisis interaksi antara makhluk hidup dan lingkungannya dalam ekosistem.',
      'Menjelaskan konsep usaha, energi, pesawat sederhana dan penerapannya dalam kehidupan.'
    ]
  },
  {
    id: 'sma-e-bio',
    fase: 'E',
    subject: 'Biologi',
    cpText: 'Pada akhir Fase E, peserta didik memiliki kemampuan menciptakan solusi atas permasalahan-permasalahan berdasarkan memahami keanekaragaman hayati dan peranannya, virus dan peranannya, inovasi teknologi biologi, komponen ekosistem, serta interaksi antar komponen ekosistem.',
    suggestedTPs: [
      'Menganalisis ancaman terhadap keanekaragaman hayati Indonesia dan merumuskan solusi pelestariannya.',
      'Mengidentifikasi karakteristik virus dan peranan menguntungkan maupun merugikan dalam kehidupan.',
      'Mengevaluasi penerapan inovasi teknologi biologi (bioteknologi konvensional dan modern).',
      'Menganalisis interaksi antar komponen dalam ekosistem dan dampaknya terhadap keseimbangan lingkungan.'
    ]
  }
];
