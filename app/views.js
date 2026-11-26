// NusaStat — tampilan tiap halaman (hash route).
// Setiap view mengembalikan HTML lengkap untuk #app. Grafik digambar
// oleh charts.js; data berasal dari NUSA_DATA di data.js.

function sourceLine(series) {
  return '<p class="source">Sumber: <b>' + escText(series.source) + '</b> &middot; Satuan: ' + escText(series.unit) + '.</p>';
}

function kpiCards() {
  return NUSA_DATA.kpis.map(function (k) {
    const ch = k.change
      ? '<div class="k-change' + (k.good ? ' good' : '') + '">' + escText(k.change) + '</div>'
      : '';
    return '<article class="kpi"><div class="k-label">' + escText(k.label) + '</div>' +
      '<div class="k-value">' + escText(k.value) + '</div>' +
      '<div class="k-sub">' + escText(k.sub) + ' &middot; ' + escText(k.source) + '</div>' + ch + '</article>';
  }).join("");
}

function factGrid(facts) {
  return '<div class="fact-grid">' + facts.map(function (f) {
    return '<div class="fact"><span>' + escText(f.label) +
      (f.source && f.source !== "—" ? '<small>' + escText(f.source) + '</small>' : '') +
      '</span><span>' + escText(f.value) + '</span></div>';
  }).join("") + '</div>';
}

function provinceRows(rows) {
  return rows.map(function (r, i) {
    return '<tr><td class="rank">' + (i + 1) + '</td><td>' + escText(r.name) + '</td>' +
      '<td>' + escText(r.capital) + '</td>' +
      '<td class="num">' + fmtID(r.pop, 2) + '</td>' +
      '<td class="num">' + fmtID(r.share, 1) + '%</td></tr>';
  }).join("");
}

function provinceTable(idPrefix) {
  const p = NUSA_DATA.provinces;
  return '<div class="table-tools">' +
    '<input type="search" id="' + idPrefix + '-search" placeholder="Cari provinsi…" aria-label="Cari provinsi">' +
    '<span class="count" id="' + idPrefix + '-count">' + p.rows.length + ' provinsi ditampilkan</span>' +
    '<button class="btn ghost" type="button" data-csv="provinces">Unduh CSV</button>' +
    '</div>' +
    '<table class="data" id="' + idPrefix + '-table"><thead><tr>' +
    '<th scope="col">#</th>' +
    '<th scope="col"><button type="button" data-sort="name" data-table="' + idPrefix + '">Provinsi <span aria-hidden="true">↕</span></button></th>' +
    '<th scope="col"><button type="button" data-sort="capital" data-table="' + idPrefix + '">Ibu kota <span aria-hidden="true">↕</span></button></th>' +
    '<th scope="col" class="num"><button type="button" data-sort="pop" data-table="' + idPrefix + '">Penduduk (juta) <span aria-hidden="true">↕</span></button></th>' +
    '<th scope="col" class="num"><button type="button" data-sort="share" data-table="' + idPrefix + '">Pangsa <span aria-hidden="true">↕</span></button></th>' +
    '</tr></thead><tbody>' + provinceRows(p.rows) + '</tbody></table>' +
    sourceLine(p);
}

function viewOverview() {
  const d = NUSA_DATA;
  const releases = d.releases.map(function (r) {
    return '<div class="release"><div class="r-date">' + escText(r.date) + '</div>' +
      '<div><div class="r-title">' + escText(r.title) + '</div>' +
      '<div class="r-pub">' + escText(r.publisher) + '</div></div></div>';
  }).join("");
  return '<h1>Indonesia dalam angka</h1>' +
    '<p class="lede">' + escText(d.note) + ' Mulai dari delapan indikator utama di bawah, lalu telusuri tiap tema lewat menu di atas.</p>' +
    '<p class="updated">Terakhir diperbarui: <b>' + escText(d.updated) + '</b> &middot; Negara: ' + escText(d.country) + '</p>' +
    '<div class="kpi-grid">' + kpiCards() + '</div>' +
    '<section class="card"><h2>Pertumbuhan ekonomi, 2019–2024</h2>' +
    '<div class="chart-box">' + lineChart(d.series.growth) + '</div>' + sourceLine(d.series.growth) +
    '<p>Setelah kontraksi −2,07% pada 2020 saat pandemi, ekonomi kembali tumbuh di atas 5% selama tiga tahun berturut-turut.</p></section>' +
    '<section class="card"><h2>Jumlah penduduk, 2015–2024</h2>' +
    '<div class="chart-box">' + lineChart(d.series.population) + '</div>' + sourceLine(d.series.population) +
    '<p>Sensus Penduduk 2020 mencatat 270,20 juta jiwa; estimasi pertengahan 2024 mencapai 281,6 juta jiwa.</p></section>' +
    '<section class="card"><h2>Rilis terbaru yang dikutip</h2>' + releases + '</section>';
}

function viewPopulation() {
  const d = NUSA_DATA;
  return '<h1>Penduduk</h1>' +
    '<p class="lede">Jumlah, sebaran, dan struktur umur penduduk Indonesia.</p>' +
    '<section class="card"><h2>Jumlah penduduk, 2015–2024</h2>' +
    '<div class="chart-box">' + lineChart(d.series.population) + '</div>' + sourceLine(d.series.population) + '</section>' +
    '<section class="card"><h2>Struktur umur, 2024</h2>' +
    '<div class="chart-box">' + hbarChart(d.ageGroups.bars) + '</div>' +
    '<p class="source">Sumber: <b>' + escText(d.ageGroups.source) + '</b> &middot; Satuan: ' + escText(d.ageGroups.unit) + '.</p>' +
    '<p>Dengan 68,5% penduduk berusia produktif (15–64 tahun), Indonesia berada pada masa bonus demografi.</p></section>' +
    '<section class="card"><h2>Provinsi terpadat</h2>' +
    '<p>Tiga provinsi di Pulau Jawa — Jawa Barat, Jawa Timur, dan Jawa Tengah — menampung hampir setengah penduduk Indonesia.</p>' +
    provinceTable("pop") + '</section>';
}

function viewEconomy() {
  const d = NUSA_DATA;
  return '<h1>Ekonomi</h1>' +
    '<p class="lede">Ukuran ekonomi, laju pertumbuhan, dan perdagangan luar negeri.</p>' +
    '<section class="card"><h2 id="econ-chart-title">PDB nominal, 2019–2024</h2>' +
    '<div class="toggle-row" role="group" aria-label="Pilih grafik ekonomi">' +
    '<button type="button" data-econ="gdpNominal" aria-pressed="true">PDB nominal</button>' +
    '<button type="button" data-econ="growth" aria-pressed="false">Pertumbuhan</button>' +
    '</div>' +
    '<div class="chart-box" id="econ-chart">' + lineChart(d.series.gdpNominal) + '</div>' +
    '<p class="source" id="econ-source">Sumber: <b>' + escText(d.series.gdpNominal.source) + '</b> &middot; Satuan: ' + escText(d.series.gdpNominal.unit) + '.</p></section>' +
    '<section class="card"><h2>Ekspor dan impor, 2019–2024</h2>' +
    '<div class="chart-box">' + multiLineChart([d.series.exports, d.series.imports]) + '</div>' +
    '<p class="source">Sumber: <b>BPS — Statistik Ekspor dan Impor</b> &middot; Satuan: miliar US$ &middot; Garis teal: ekspor, garis amber: impor.</p>' +
    '<p>Ekspor mencatat rekor US$291,9 miliar pada 2022. Pada 2024 neraca perdagangan surplus US$31,0 miliar.</p></section>' +
    '<section class="card"><h2>Fakta ekonomi</h2>' + factGrid([
      { label: "PDB per kapita 2024", value: "US$4.960", source: "Bank Dunia" },
      { label: "Ekspor 2024", value: "US$264,7 miliar", source: "BPS" },
      { label: "Impor 2024", value: "US$233,7 miliar", source: "BPS" },
      { label: "Inflasi Desember 2024", value: "1,57% (y-on-y)", source: "BPS" }
    ]) + '</section>';
}

function viewWork() {
  const d = NUSA_DATA;
  return '<h1>Tenaga Kerja &amp; Kemiskinan</h1>' +
    '<p class="lede">Siapa yang bekerja, siapa yang menganggur, dan berapa banyak yang hidup di bawah garis kemiskinan.</p>' +
    '<section class="card"><h2>Pengangguran terbuka, 2019–2024</h2>' +
    '<div class="chart-box">' + lineChart(d.series.unemployment) + '</div>' + sourceLine(d.series.unemployment) +
    '<p>Pengangguran melonjak ke 7,07% pada Agustus 2020, lalu turun tiap tahun hingga 4,76% pada Agustus 2024 — level terendah dalam deret ini.</p></section>' +
    '<section class="card"><h2>Tingkat kemiskinan, 2019–2024</h2>' +
    '<div class="chart-box">' + lineChart(d.series.poverty) + '</div>' + sourceLine(d.series.poverty) +
    '<p>Kemiskinan sempat naik melewati 10% pada 2020–2021, lalu turun ke 9,03% pada Maret 2024 dan 8,57% pada September 2024.</p>' +
    '<div class="action-row"><button class="btn" type="button" data-csv="work">Unduh data (CSV)</button></div></section>' +
    '<section class="card"><h2>Fakta ketenagakerjaan</h2>' + factGrid([
      { label: "Angkatan kerja", value: "155,6 juta orang", source: "BPS, Agustus 2024" },
      { label: "Penduduk bekerja", value: "148,2 juta orang", source: "BPS, Agustus 2024" },
      { label: "Penduduk miskin (Sep 2024)", value: "24,06 juta orang", source: "BPS, 2024" },
      { label: "Garis kemiskinan (Sep 2024)", value: "Rp595.242/kapita/bulan", source: "BPS, 2024" }
    ]) + '</section>';
}

function viewHealth() {
  const d = NUSA_DATA;
  return '<h1>Kesehatan &amp; Pendidikan</h1>' +
    '<p class="lede">Kualitas hidup manusia: umur panjang, sekolah, dan pembangunan manusia.</p>' +
    '<section class="card"><h2>Indeks Pembangunan Manusia, 2019–2024</h2>' +
    '<div class="chart-box">' + lineChart(d.series.hdi) + '</div>' + sourceLine(d.series.hdi) +
    '<p>IPM naik dari 71,92 pada 2019 menjadi 75,02 pada 2024 — masuk kategori "tinggi" menurut klasifikasi BPS.</p></section>' +
    '<section class="card"><h2>Fakta kesehatan &amp; pendidikan</h2>' + factGrid([
      { label: "Harapan hidup saat lahir", value: "71,6 tahun", source: "Bank Dunia, 2023" },
      { label: "Rata-rata lama sekolah", value: "9,0 tahun", source: "BPS, 2024" },
      { label: "Pengguna internet", value: "221,6 juta orang", source: "APJII, 2024" },
      { label: "Angka kelahiran (TFR)", value: "2,1 anak per perempuan", source: "BPS, 2023" }
    ]) + '</section>' +
    '<section class="card"><h2>Membaca IPM</h2>' +
    '<p>IPM menggabungkan tiga dimensi: umur panjang dan hidup sehat, pengetahuan, dan standar hidup layak. Kenaikan 2024 didorong membaiknya ketiga komponennya, terutama harapan lama sekolah dan pengeluaran per kapita.</p>' +
    '<p class="source">Sumber: <b>BPS — Indeks Pembangunan Manusia 2024</b>.</p></section>';
}

function viewRegions() {
  const d = NUSA_DATA;
  return '<h1>Daerah</h1>' +
    '<p class="lede">Penduduk menurut provinsi. Klik judul kolom untuk mengurutkan, ketik di kotak pencarian untuk menyaring.</p>' +
    '<section class="card"><h2>' + escText(d.provinces.title) + '</h2>' +
    provinceTable("regions") +
    '<p>Indonesia memiliki 38 provinsi (Kemendagri, 2024). Tabel ini menampilkan sepuluh provinsi terpadat menurut Sensus Penduduk 2020; ketiganya di Pulau Jawa menampung 46,5% penduduk nasional.</p></section>' +
    '<section class="card"><h2>Fakta wilayah</h2>' + factGrid([
      { label: "Luas wilayah", value: "1,92 juta km²", source: "BPS" },
      { label: "Jumlah pulau", value: "17.508", source: "BPS / KKP" },
      { label: "Provinsi", value: "38", source: "Kemendagri, 2024" },
      { label: "Kabupaten dan kota", value: "514", source: "Kemendagri, 2024" }
    ]) + '</section>';
}

function viewSources() {
  const d = NUSA_DATA;
  const srcs = d.sources.map(function (s) {
    return '<li><b>' + escText(s.name) + '</b> (' + escText(s.url) + ') — ' + escText(s.what) + '</li>';
  }).join("");
  const meth = d.methodology.map(function (m) { return '<li>' + escText(m) + '</li>'; }).join("");
  return '<h1>Metodologi &amp; Sumber</h1>' +
    '<p class="lede">Dari mana angka-angka di situs ini berasal, dan bagaimana angka itu disusun.</p>' +
    '<section class="card"><h2>Sumber data</h2><ul class="tight">' + srcs + '</ul></section>' +
    '<section class="card"><h2>Catatan metodologi</h2><ul class="tight">' + meth + '</ul></section>' +
    '<section class="card"><h2>Tentang situs ini</h2>' +
    '<p>NusaStat disusun sebagai portal statistik yang mudah dibaca publik. Situs ini bukan situs resmi BPS atau pemerintah Indonesia; untuk angka terbaru dan tabel lengkap, kunjungi bps.go.id.</p>' +
    '<p>Semua grafik digambar dari data yang tersimpan di situs ini (app/data.js); tidak ada angka yang diambil dari server lain saat halaman dibuka.</p></section>';
}

const VIEWS = {
  "": viewOverview,
  "penduduk": viewPopulation,
  "ekonomi": viewEconomy,
  "kerja": viewWork,
  "kesehatan": viewHealth,
  "daerah": viewRegions,
  "sumber": viewSources
};
