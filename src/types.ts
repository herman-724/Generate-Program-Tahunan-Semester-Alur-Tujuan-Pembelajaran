export interface ProfileData {
  namaGuru: string;
  nip: string;
  jabatan: string;
  namaSekolah: string;
  kepalaSekolah: string;
  tahunAjaran: string;
  fase: string;
  kelas: string;
  mataPelajaran: string;
}

export interface DeepLearningMapping {
  profileDimensions: string[]; // 8 Dimensi
  principles: string[];        // 3 Prinsip
  experiences: string[];       // 3 Pengalaman
}

export interface TPData {
  id: string;
  text: string;
  jp: number;
  order: number;
  deepLearning: DeepLearningMapping;
  semester: '1' | '2';
  // key: "monthIndex_weekIndex" where monthIndex is 0..5 and weekIndex is 0..4
  schedule: {
    [key: string]: boolean;
  };
}

export interface CurriculumData {
  cp: string;
  weeksEffectiveSem1: number;
  weeksEffectiveSem2: number;
  jpPerWeek: number;
}

export interface PromesSettings {
  // key: "semester_monthIndex_weekIndex" -> "1_2_3" => "UTS" | "UAS" | "Libur"
  nonEffectiveWeeks: {
    [key: string]: string;
  };
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  createdAt: any;
  updatedAt: any;
  profile: ProfileData;
  curriculum: CurriculumData;
  tps: TPData[];
  promesSettings: PromesSettings;
}

export const DIMENSI_PROFIL = [
  'Iman/Taqwa',
  'Cinta Tanah Air',
  'Berpikir Kritis',
  'Kreatif',
  'Kolaboratif',
  'Mandiri',
  'Sehat',
  'Komunikatif'
];

export const PRINSIP_PEMBELAJARAN = [
  'Berkesadaran (Mindful)',
  'Bermakna',
  'Menggembirakan'
];

export const PENGALAMAN_BELAJAR = [
  'Memahami',
  'Mengaplikasikan',
  'Merefleksi'
];

// Months for semester 1 (Ganjil): Jul - Des
export const MONTHS_SEM1 = [
  { name: 'Juli', days: 31 },
  { name: 'Agustus', days: 31 },
  { name: 'September', days: 30 },
  { name: 'Oktober', days: 31 },
  { name: 'November', days: 30 },
  { name: 'Desember', days: 31 }
];

// Months for semester 2 (Genap): Jan - Jun
export const MONTHS_SEM2 = [
  { name: 'Januari', days: 31 },
  { name: 'Februari', days: 28 },
  { name: 'Maret', days: 31 },
  { name: 'April', days: 30 },
  { name: 'Mei', days: 31 },
  { name: 'Juni', days: 30 }
];
