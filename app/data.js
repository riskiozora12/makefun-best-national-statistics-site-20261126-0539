// NusaStat — data statistik Indonesia.
// Semua angka adalah angka resmi yang diterbitkan Badan Pusat Statistik (BPS),
// Bank Dunia, atau APJII, lengkap dengan tahun dan sumbernya. Angka dibulatkan
// seperti pada publikasi aslinya; lihat halaman "Metodologi & Sumber".

const NUSA_DATA = {
  country: "Indonesia",
  tagline: "Portal Statistik Nasional",
  updated: "26 November 2026",
  note: "Angka pada situs ini berasal dari publikasi resmi. Setiap kartu dan grafik menyebut sumber dan tahunnya.",

  // Kartu indikator utama di beranda.
  kpis: [
    { label: "Penduduk", value: "281,6 jt", sub: "Estimasi pertengahan 2024", source: "BPS, 2024", change: "+0,7% dari 2023", good: null },
    { label: "PDB nominal", value: "US$1.396 M", sub: "M = miliar, harga berlaku", source: "Bank Dunia, 2024", change: "+1,8% dari 2023", good: null },
    { label: "Pertumbuhan ekonomi", value: "5,03%", sub: "PDB riil, tahun ke tahun", source: "BPS, 2024", change: "vs 5,05% pada 2023", good: true },
    { label: "PDB per kapita", value: "US$4.960", sub: "Harga berlaku", source: "Bank Dunia, 2024", change: "+1,7% dari 2023", good: null },
    { label: "Tingkat kemiskinan", value: "8,57%", sub: "September 2024", source: "BPS, 2024", change: "Turun dari 9,03% (Mar 2024)", good: true },
    { label: "Pengangguran terbuka", value: "4,76%", sub: "Agustus 2024", source: "BPS, 2024", change: "Turun dari 5,32% (Agu 2023)", good: true },
    { label: "Inflasi (y-on-y)", value: "1,57%", sub: "Desember 2024", source: "BPS, 2024", change: "vs 2,61% pada Des 2023", good: true },
    { label: "Indeks Pembangunan Manusia", value: "75,02", sub: "Skala 0–100", source: "BPS, 2024", change: "Naik dari 74,39 (2023)", good: true }
  ],

  // Deret tahunan. Nilai = angka publikasi resmi (BPS / Bank Dunia).
  series: {
    population: {
      title: "Jumlah penduduk",
      unit: "juta jiwa",
      source: "BPS — Sensus Penduduk 2020 dan estimasi pertengahan tahun",
      points: [
        { y: 2015, v: 255.6 }, { y: 2016, v: 258.5 }, { y: 2017, v: 261.4 },
        { y: 2018, v: 264.2 }, { y: 2019, v: 267.1 }, { y: 2020, v: 270.2 },
        { y: 2021, v: 272.5 }, { y: 2022, v: 275.8 }, { y: 2023, v: 278.7 },
        { y: 2024, v: 281.6 }
      ]
    },
    growth: {
      title: "Pertumbuhan ekonomi (PDB riil)",
      unit: "% per tahun",
      source: "BPS — Berita Resmi Statistik, pertumbuhan PDB",
      points: [
        { y: 2019, v: 5.02 }, { y: 2020, v: -2.07 }, { y: 2021, v: 3.70 },
        { y: 2022, v: 5.31 }, { y: 2023, v: 5.05 }, { y: 2024, v: 5.03 }
      ]
    },
    gdpNominal: {
      title: "PDB nominal",
      unit: "miliar US$",
      source: "Bank Dunia — World Development Indicators",
      points: [
        { y: 2019, v: 1120 }, { y: 2020, v: 1059 }, { y: 2021, v: 1186 },
        { y: 2022, v: 1319 }, { y: 2023, v: 1371 }, { y: 2024, v: 1396 }
      ]
    },
    poverty: {
      title: "Tingkat kemiskinan",
      unit: "% penduduk",
      source: "BPS — Profil Kemiskinan (angka Maret tiap tahun; 2024 juga September: 8,57%)",
      points: [
        { y: 2019, v: 9.41 }, { y: 2020, v: 9.78 }, { y: 2021, v: 10.14 },
        { y: 2022, v: 9.54 }, { y: 2023, v: 9.36 }, { y: 2024, v: 9.03 }
      ]
    },
    unemployment: {
      title: "Tingkat pengangguran terbuka",
      unit: "% angkatan kerja",
      source: "BPS — Keadaan Ketenagakerjaan (angka Agustus tiap tahun)",
      points: [
        { y: 2019, v: 5.28 }, { y: 2020, v: 7.07 }, { y: 2021, v: 6.49 },
        { y: 2022, v: 5.86 }, { y: 2023, v: 5.32 }, { y: 2024, v: 4.76 }
      ]
    },
    inflation: {
      title: "Inflasi tahunan",
      unit: "% (y-on-y, Desember)",
      source: "BPS — Indeks Harga Konsumen",
      points: [
        { y: 2019, v: 2.72 }, { y: 2020, v: 1.68 }, { y: 2021, v: 1.87 },
        { y: 2022, v: 5.51 }, { y: 2023, v: 2.61 }, { y: 2024, v: 1.57 }
      ]
    },
    exports: {
      title: "Nilai ekspor",
      unit: "miliar US$",
      source: "BPS — Statistik Ekspor",
      points: [
        { y: 2019, v: 167.5 }, { y: 2020, v: 163.2 }, { y: 2021, v: 231.6 },
        { y: 2022, v: 291.9 }, { y: 2023, v: 258.8 }, { y: 2024, v: 264.7 }
      ]
    },
    imports: {
      title: "Nilai impor",
      unit: "miliar US$",
      source: "BPS — Statistik Impor",
      points: [
        { y: 2019, v: 171.3 }, { y: 2020, v: 141.6 }, { y: 2021, v: 196.2 },
        { y: 2022, v: 237.4 }, { y: 2023, v: 221.9 }, { y: 2024, v: 233.7 }
      ]
    },
    hdi: {
      title: "Indeks Pembangunan Manusia (IPM)",
      unit: "skala 0–100",
      source: "BPS — Indeks Pembangunan Manusia",
      points: [
        { y: 2019, v: 71.92 }, { y: 2020, v: 71.94 }, { y: 2021, v: 72.29 },
        { y: 2022, v: 73.05 }, { y: 2023, v: 74.39 }, { y: 2024, v: 75.02 }
      ]
    }
  },

  // Struktur umur 2024 (perkiraan BPS): pangsa penduduk per kelompok umur.
  ageGroups: {
    title: "Struktur umur penduduk",
    unit: "% dari total penduduk",
    source: "BPS — Proyeksi Penduduk 2024 (perkiraan)",
    bars: [
      { label: "0–14 tahun", v: 23.5 },
      { label: "15–64 tahun", v: 68.5 },
      { label: "65 tahun ke atas", v: 8.0 }
    ]
  },

  // Sepuluh provinsi terpadat, Sensus Penduduk 2020 (juta jiwa).
  provinces: {
    title: "Sepuluh provinsi terpadat",
    unit: "juta jiwa",
    source: "BPS — Sensus Penduduk 2020",
    rows: [
      { name: "Jawa Barat", pop: 48.27, share: 17.9, capital: "Bandung" },
      { name: "Jawa Timur", pop: 40.67, share: 15.1, capital: "Surabaya" },
      { name: "Jawa Tengah", pop: 36.52, share: 13.5, capital: "Semarang" },
      { name: "Sumatera Utara", pop: 14.80, share: 5.5, capital: "Medan" },
      { name: "Banten", pop: 11.90, share: 4.4, capital: "Serang" },
      { name: "DKI Jakarta", pop: 10.56, share: 3.9, capital: "Jakarta" },
      { name: "Sulawesi Selatan", pop: 9.07, share: 3.4, capital: "Makassar" },
      { name: "Lampung", pop: 9.00, share: 3.3, capital: "Bandar Lampung" },
      { name: "Sumatera Selatan", pop: 8.47, share: 3.1, capital: "Palembang" },
      { name: "Riau", pop: 6.39, share: 2.4, capital: "Pekanbaru" }
    ]
  },

  // Fakta dasar negara.
  facts: [
    { label: "Luas wilayah", value: "1,92 juta km²", source: "BPS" },
    { label: "Jumlah pulau", value: "17.508", source: "BPS / Kementerian Kelautan dan Perikanan" },
    { label: "Provinsi", value: "38", source: "Kemendagri, 2024" },
    { label: "Kabupaten dan kota", value: "514", source: "Kemendagri, 2024" },
    { label: "Ibu kota", value: "Jakarta", source: "—" },
    { label: "Bahasa resmi", value: "Bahasa Indonesia", source: "UUD 1945" },
    { label: "Mata uang", value: "Rupiah (IDR)", source: "Bank Indonesia" },
    { label: "Zona waktu", value: "WIB, WITA, WIT", source: "Keppres 41/1987" },
    { label: "Angka kelahiran (TFR)", value: "2,1 anak per perempuan", source: "BPS, 2023" },
    { label: "Pengguna internet", value: "221,6 juta orang", source: "APJII, 2024" },
    { label: "Angkatan kerja", value: "155,6 juta orang", source: "BPS, Agustus 2024" },
    { label: "Harapan hidup", value: "71,6 tahun", source: "Bank Dunia, 2023" },
    { label: "Rata-rata lama sekolah", value: "9,0 tahun", source: "BPS, 2024" },
    { label: "Neraca perdagangan 2024", value: "Surplus US$31,0 miliar", source: "BPS, 2024" }
  ],

  // Publikasi yang dikutip — judul, bulan/tahun rilis, penerbit.
  releases: [
    { date: "Feb 2025", title: "Pertumbuhan Ekonomi Indonesia 2024: 5,03%", publisher: "BPS" },
    { date: "Jan 2025", title: "Profil Kemiskinan di Indonesia, September 2024: 8,57%", publisher: "BPS" },
    { date: "Jan 2025", title: "Perkembangan Ekspor dan Impor Indonesia Desember 2024", publisher: "BPS" },
    { date: "Nov 2024", title: "Keadaan Ketenagakerjaan Indonesia Agustus 2024: TPT 4,76%", publisher: "BPS" },
    { date: "Nov 2024", title: "Indeks Pembangunan Manusia 2024: 75,02", publisher: "BPS" },
    { date: "Jan 2021", title: "Hasil Sensus Penduduk 2020: 270,20 juta jiwa", publisher: "BPS" }
  ],

  sources: [
    { name: "Badan Pusat Statistik (BPS)", what: "Sensus Penduduk 2020, estimasi penduduk, PDB, kemiskinan, ketenagakerjaan, inflasi, IPM, ekspor-impor.", url: "bps.go.id" },
    { name: "Bank Dunia — World Development Indicators", what: "PDB nominal dan PDB per kapita dalam US$, harapan hidup.", url: "data.worldbank.org" },
    { name: "APJII", what: "Survei Penetrasi Internet Indonesia 2024: 221,6 juta pengguna.", url: "apjii.or.id" },
    { name: "Bank Indonesia", what: "Rupiah sebagai mata uang resmi.", url: "bi.go.id" },
    { name: "Kementerian Dalam Negeri", what: "Jumlah provinsi (38) serta kabupaten dan kota (514).", url: "kemendagri.go.id" }
  ],

  methodology: [
    "Angka penduduk 2015–2019 dan 2021–2024 adalah estimasi pertengahan tahun BPS; angka 2020 adalah hasil Sensus Penduduk.",
    "Tingkat kemiskinan memakai angka Maret tiap tahun agar deretnya sebanding; angka September 2024 (8,57%) dicantumkan terpisah pada kartu indikator.",
    "Tingkat pengangguran terbuka memakai angka Agustus tiap tahun, sesuai publikasi Keadaan Ketenagakerjaan BPS.",
    "PDB nominal memakai harga berlaku dalam dolar AS menurut Bank Dunia; pertumbuhan ekonomi memakai PDB harga konstan menurut BPS.",
    "Nilai dibulatkan seperti pada publikasi aslinya; selisih pembulatan dapat membuat jumlah komponen tidak persis 100%.",
    "Situs ini bukan situs resmi BPS atau pemerintah. Situs ini menyusun ulang angka publikasi resmi untuk dibaca publik."
  ]
};
