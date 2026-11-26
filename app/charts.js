// NusaStat — grafik SVG buatan sendiri (tanpa pustaka luar).
// Dua pembuat grafik: lineChart untuk deret tahunan, barChart untuk
// perbandingan kategori. Keduanya mengembalikan string SVG yang siap
// disisipkan ke halaman, lengkap dengan sumbu, label nilai, dan judul
// hover di tiap titik/batang.

function escText(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function niceNum(x) {
  if (Math.abs(x) >= 1000) return Math.round(x).toLocaleString("id-ID");
  if (Math.abs(x) >= 100) return (Math.round(x * 10) / 10).toLocaleString("id-ID");
  return (Math.round(x * 100) / 100).toLocaleString("id-ID");
}

// Skala sumbu-Y yang rapi: batas atas dibulatkan ke kelipatan langkah.
function axisScale(values) {
  let lo = Math.min.apply(null, values);
  let hi = Math.max.apply(null, values);
  if (lo > 0) lo = Math.max(0, lo - (hi - lo) * 0.25);
  if (lo === hi) { hi = lo + 1; lo = lo - 1; }
  const span = hi - lo;
  const raw = span / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = raw / mag <= 1 ? mag : raw / mag <= 2 ? 2 * mag : raw / mag <= 5 ? 5 * mag : 10 * mag;
  const top = Math.ceil(hi / step) * step;
  const bottom = Math.floor(lo / step) * step;
  return { bottom, top, step };
}

function lineChart(series, opts) {
  const o = opts || {};
  const w = o.width || 720, h = o.height || 300;
  const padL = 56, padR = 16, padT = 18, padB = 34;
  const pts = series.points;
  const vals = pts.map(function (p) { return p.v; });
  const sc = axisScale(vals);
  const iw = w - padL - padR, ih = h - padT - padB;
  const xAt = function (i) { return padL + (pts.length === 1 ? iw / 2 : (iw * i) / (pts.length - 1)); };
  const yAt = function (v) { return padT + ih - ((v - sc.bottom) / (sc.top - sc.bottom)) * ih; };

  let s = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + escText(series.title) + '">';
  // Garis grid dan label sumbu-Y.
  for (let v = sc.bottom; v <= sc.top + 0.0001; v += sc.step) {
    const y = yAt(v);
    s += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + y.toFixed(1) + '" class="grid"/>';
    s += '<text x="' + (padL - 8) + '" y="' + (y + 4).toFixed(1) + '" class="axis" text-anchor="end">' + escText(niceNum(v)) + '</text>';
  }
  // Sumbu-X.
  s += '<line x1="' + padL + '" y1="' + (h - padB) + '" x2="' + (w - padR) + '" y2="' + (h - padB) + '" class="axis-line"/>';
  pts.forEach(function (p, i) {
    s += '<text x="' + xAt(i).toFixed(1) + '" y="' + (h - 12) + '" class="axis" text-anchor="middle">' + p.y + '</text>';
  });
  // Garis nol yang ditebalkan bila deret melewati nol.
  if (sc.bottom < 0 && sc.top > 0) {
    s += '<line x1="' + padL + '" y1="' + yAt(0).toFixed(1) + '" x2="' + (w - padR) + '" y2="' + yAt(0).toFixed(1) + '" class="zero-line"/>';
  }
  // Area di bawah garis.
  const area = pts.map(function (p, i) { return (i === 0 ? "M" : "L") + xAt(i).toFixed(1) + " " + yAt(p.v).toFixed(1); }).join(" ");
  s += '<path d="' + area + ' L' + xAt(pts.length - 1).toFixed(1) + ' ' + (h - padB) + ' L' + xAt(0).toFixed(1) + ' ' + (h - padB) + ' Z" class="area"/>';
  // Garis deret.
  s += '<path d="' + area + '" class="line" fill="none"/>';
  // Titik + label nilai. Label titik pertama dan terakhir digeser ke
  // dalam agar tidak menabrak label sumbu-Y di kiri atau tepi kanan.
  pts.forEach(function (p, i) {
    const cx = xAt(i), cy = yAt(p.v);
    s += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="4.5" class="dot"><title>' + p.y + ': ' + niceNum(p.v) + ' ' + escText(series.unit) + '</title></circle>';
    const anchor = i === 0 ? 'start' : (i === pts.length - 1 ? 'end' : 'middle');
    const lx = i === 0 ? cx + 7 : (i === pts.length - 1 ? cx - 7 : cx);
    s += '<text x="' + lx.toFixed(1) + '" y="' + (cy - 10).toFixed(1) + '" class="value" text-anchor="' + anchor + '">' + escText(niceNum(p.v)) + '</text>';
  });
  s += '</svg>';
  return s;
}

function barChart(items, opts) {
  const o = opts || {};
  const w = o.width || 720, h = o.height || 300;
  const padL = 56, padR = 16, padT = 18, padB = 34;
  const vals = items.map(function (d) { return d.v; });
  const sc = axisScale(vals.concat([0]));
  const iw = w - padL - padR, ih = h - padT - padB;
  const slot = iw / items.length;
  const bw = Math.min(64, slot * 0.62);
  const xAt = function (i) { return padL + slot * i + (slot - bw) / 2; };
  const yAt = function (v) { return padT + ih - ((v - sc.bottom) / (sc.top - sc.bottom)) * ih; };

  let s = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Grafik batang">';
  for (let v = sc.bottom; v <= sc.top + 0.0001; v += sc.step) {
    const y = yAt(v);
    s += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + y.toFixed(1) + '" class="grid"/>';
    s += '<text x="' + (padL - 8) + '" y="' + (y + 4).toFixed(1) + '" class="axis" text-anchor="end">' + escText(niceNum(v)) + '</text>';
  }
  s += '<line x1="' + padL + '" y1="' + (h - padB) + '" x2="' + (w - padR) + '" y2="' + (h - padB) + '" class="axis-line"/>';
  items.forEach(function (d, i) {
    const x = xAt(i), y = yAt(d.v), bh = (h - padB) - y;
    const cx = x + bw / 2;
    s += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(bh, 1).toFixed(1) + '" rx="3" class="bar"><title>' + escText(d.label) + ': ' + niceNum(d.v) + '</title></rect>';
    s += '<text x="' + cx.toFixed(1) + '" y="' + (y - 8).toFixed(1) + '" class="value" text-anchor="middle">' + escText(niceNum(d.v)) + '</text>';
    s += '<text x="' + cx.toFixed(1) + '" y="' + (h - 12) + '" class="axis" text-anchor="middle">' + escText(d.label) + '</text>';
  });
  s += '</svg>';
  return s;
}

// Batang horizontal untuk perbandingan pangsa (mis. struktur umur).
function hbarChart(items, opts) {
  const o = opts || {};
  const w = o.width || 720;
  const rowH = o.rowH || 44, padL = 150, padR = 70, padT = 10;
  const h = padT + items.length * rowH + 14;
  const max = Math.max.apply(null, items.map(function (d) { return d.v; }));
  const iw = w - padL - padR;
  let s = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Grafik batang horizontal">';
  items.forEach(function (d, i) {
    const y = padT + i * rowH + 8;
    const bw = (d.v / max) * iw;
    s += '<text x="' + (padL - 10) + '" y="' + (y + 15) + '" class="axis" text-anchor="end">' + escText(d.label) + '</text>';
    s += '<rect x="' + padL + '" y="' + y + '" width="' + bw.toFixed(1) + '" height="22" rx="4" class="bar"><title>' + escText(d.label) + ': ' + niceNum(d.v) + '%</title></rect>';
    s += '<text x="' + (padL + bw + 8).toFixed(1) + '" y="' + (y + 16) + '" class="value">' + escText(niceNum(d.v)) + '%</text>';
  });
  s += '</svg>';
  return s;
}

// Dua deret dalam satu grafik garis (mis. ekspor vs impor).
// Deret pertama memakai teal, kedua memakai amber.
function multiLineChart(seriesList, opts) {
  const o = opts || {};
  const w = o.width || 720, h = o.height || 300;
  const padL = 56, padR = 16, padT = 26, padB = 34;
  const all = [];
  seriesList.forEach(function (s) { s.points.forEach(function (p) { all.push(p.v); }); });
  const sc = axisScale(all);
  const years = seriesList[0].points.map(function (p) { return p.y; });
  const iw = w - padL - padR, ih = h - padT - padB;
  const xAt = function (i) { return padL + (years.length === 1 ? iw / 2 : (iw * i) / (years.length - 1)); };
  const yAt = function (v) { return padT + ih - ((v - sc.bottom) / (sc.top - sc.bottom)) * ih; };
  const colors = ["#17809a", "#e8a33d"];

  let s = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Ekspor dan impor">';
  for (let v = sc.bottom; v <= sc.top + 0.0001; v += sc.step) {
    const y = yAt(v);
    s += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + y.toFixed(1) + '" class="grid"/>';
    s += '<text x="' + (padL - 8) + '" y="' + (y + 4).toFixed(1) + '" class="axis" text-anchor="end">' + escText(niceNum(v)) + '</text>';
  }
  s += '<line x1="' + padL + '" y1="' + (h - padB) + '" x2="' + (w - padR) + '" y2="' + (h - padB) + '" class="axis-line"/>';
  years.forEach(function (y, i) {
    s += '<text x="' + xAt(i).toFixed(1) + '" y="' + (h - 12) + '" class="axis" text-anchor="middle">' + y + '</text>';
  });
  seriesList.forEach(function (ser, k) {
    const d = ser.points.map(function (p, i) { return (i === 0 ? "M" : "L") + xAt(i).toFixed(1) + " " + yAt(p.v).toFixed(1); }).join(" ");
    s += '<path d="' + d + '" fill="none" stroke="' + colors[k % colors.length] + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
    ser.points.forEach(function (p, i) {
      s += '<circle cx="' + xAt(i).toFixed(1) + '" cy="' + yAt(p.v).toFixed(1) + '" r="4" fill="' + colors[k % colors.length] + '" stroke="#fff" stroke-width="1.5"><title>' + escText(ser.title) + ' ' + p.y + ': ' + niceNum(p.v) + '</title></circle>';
    });
  });
  // Legenda.
  seriesList.forEach(function (ser, k) {
    const lx = padL + k * 150;
    s += '<rect x="' + lx + '" y="6" width="14" height="4" fill="' + colors[k % colors.length] + '"/>';
    s += '<text x="' + (lx + 20) + '" y="12" class="axis" style="fill:#1d2b30;font-weight:600">' + escText(ser.title) + '</text>';
  });
  s += '</svg>';
  return s;
}

// Format angka Indonesia: pemisah ribuan titik, desimal koma.
function fmtID(n, decimals) {
  return Number(n).toLocaleString("id-ID", {
    minimumFractionDigits: decimals == null ? 0 : decimals,
    maximumFractionDigits: decimals == null ? 2 : decimals
  });
}
