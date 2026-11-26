// NusaStat — router hash dan interaksi.
// Rute: #/ (beranda), #/penduduk, #/ekonomi, #/kerja, #/kesehatan,
// #/daerah, #/sumber. Tabel provinsi bisa diurutkan (klik judul kolom)
// dan disaring (kotak pencarian); tombol "Unduh CSV" mengunduh data
// deret yang sedang ditampilkan.

(function () {
  var app = document.getElementById("app");
  // sortState.key null = urutan asli data (penduduk terbanyak dulu).
  var sortState = { key: null, dir: 1 };

  function route() {
    var hash = (location.hash || "#/").replace(/^#\/?/, "");
    var name = hash.split("/")[0];
    var view = VIEWS[name] || VIEWS[""];
    app.innerHTML = view();
    document.querySelectorAll("nav.main-nav a").forEach(function (a) {
      a.classList.toggle("active", (a.getAttribute("data-route") || "") === (VIEWS[name] ? name : ""));
    });
    window.scrollTo(0, 0);
  }

  // ---- Tabel provinsi: urutkan + saring ----
  function sortedRows() {
    var rows = NUSA_DATA.provinces.rows.slice();
    if (!sortState.key) return rows;
    rows.sort(function (a, b) {
      var av = a[sortState.key], bv = b[sortState.key];
      var cmp = typeof av === "number"
        ? av - bv
        : String(av).localeCompare(String(bv), "id");
      return cmp * sortState.dir;
    });
    return rows;
  }

  function applyProvinceFilter(tableId) {
    var table = document.getElementById(tableId + "-table");
    if (!table) return;
    var q = (document.getElementById(tableId + "-search").value || "").toLowerCase();
    var shown = sortedRows().filter(function (r) {
      return r.name.toLowerCase().indexOf(q) !== -1 || r.capital.toLowerCase().indexOf(q) !== -1;
    });
    var body = table.querySelector("tbody");
    if (shown.length === 0) {
      body.innerHTML = '<tr class="empty-row"><td colspan="5">Tidak ada provinsi yang cocok dengan pencarian.</td></tr>';
    } else {
      body.innerHTML = provinceRows(shown);
    }
    var count = document.getElementById(tableId + "-count");
    if (count) count.textContent = shown.length + " provinsi ditampilkan";
  }

  // ---- Unduh CSV ----
  function downloadCSV(kind) {
    var lines = [], name = "nusastat.csv";
    if (kind === "provinces") {
      name = "nusastat-provinsi-2020.csv";
      lines.push("Provinsi,Ibu kota,Penduduk (juta jiwa),Pangsa (%)");
      NUSA_DATA.provinces.rows.forEach(function (r) {
        lines.push('"' + r.name + '","' + r.capital + '",' + r.pop + ',' + r.share);
      });
    } else {
      name = "nusastat-kerja-kemiskinan.csv";
      lines.push("Tahun,Pengangguran (%),Kemiskinan (%)");
      var u = NUSA_DATA.series.unemployment.points, p = NUSA_DATA.series.poverty.points;
      u.forEach(function (pt, i) {
        lines.push(pt.y + "," + pt.v + "," + (p[i] ? p[i].v : ""));
      });
    }
    var blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  // ---- Delegasi klik di seluruh #app ----
  app.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-sort]");
    if (t) {
      var key = t.getAttribute("data-sort");
      if (sortState.key === key) {
        sortState.dir = -sortState.dir;
      } else {
        sortState.key = key;
        // Kolom angka: klik pertama mengurutkan terbesar dulu;
        // kolom teks: klik pertama A–Z.
        sortState.dir = (key === "pop" || key === "share") ? -1 : 1;
      }
      applyProvinceFilter(t.getAttribute("data-table"));
      return;
    }
    var econ = ev.target.closest("[data-econ]");
    if (econ) {
      var key2 = econ.getAttribute("data-econ");
      var ser = NUSA_DATA.series[key2];
      document.getElementById("econ-chart").innerHTML = lineChart(ser);
      document.getElementById("econ-chart-title").textContent = ser.title + ", 2019–2024";
      document.getElementById("econ-source").innerHTML =
        "Sumber: <b>" + escText(ser.source) + "</b> &middot; Satuan: " + escText(ser.unit) + ".";
      document.querySelectorAll("[data-econ]").forEach(function (b) {
        b.setAttribute("aria-pressed", b === econ ? "true" : "false");
      });
      return;
    }
    var csv = ev.target.closest("[data-csv]");
    if (csv) downloadCSV(csv.getAttribute("data-csv"));
  });

  app.addEventListener("input", function (ev) {
    if (ev.target && ev.target.id && ev.target.id.slice(-7) === "-search") {
      applyProvinceFilter(ev.target.id.replace("-search", ""));
    }
  });

  window.addEventListener("hashchange", route);
  route();
})();
