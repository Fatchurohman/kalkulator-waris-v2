/**
 * Kalkulator Waris Syari'i v.2
 * Logic & Interactive Controller
 */

let currentStep = 1;

document.addEventListener("DOMContentLoaded", () => {
  console.log("Kalkulator Waris v.2 System Ready.");
});

// Helper Format Currency Rupiah (100.000.000)
function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0
  }).format(Math.round(number));
}

/**
 * 1. Stepper Navigation Controller
 */
function goToStep(step) {
  const currentContent = document.getElementById(`step-${currentStep}-content`);
  if (currentContent) currentContent.classList.add("hidden");

  currentStep = step;

  const targetContent = document.getElementById(`step-${currentStep}-content`);
  if (targetContent) targetContent.classList.remove("hidden");

  const progressBar = document.getElementById("step-progress-bar");
  if (progressBar) {
    if (step === 1) progressBar.style.width = "0%";
    if (step === 2) progressBar.style.width = "50%";
    if (step === 3) progressBar.style.width = "100%";
  }

  for (let i = 1; i <= 3; i++) {
    const badge = document.getElementById(`badge-step-${i}`);
    if (badge) {
      if (i <= step) {
        badge.className =
          "w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md ring-4 ring-white";
      } else {
        badge.className =
          "w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs sm:text-sm ring-4 ring-white";
      }
    }
  }
}

/**
 * 2. Logika Hitung Waris v.2 Engine
 */
function calculateResult() {
  const hartaKotor = parseFloat(document.getElementById("input-harta").value) || 0;
  const tajhiz = parseFloat(document.getElementById("input-tajhiz").value) || 0;
  const utang = parseFloat(document.getElementById("input-utang").value) || 0;
  const wasiatInput = parseFloat(document.getElementById("input-wasiat").value) || 0;

  // Sisa Harta setelah Tajhiz & Utang
  const sisaAwal = Math.max(0, hartaKotor - tajhiz - utang);

  // Wasiat Syar'i (Maksimal 1/3 dari Sisa Awal)
  const maxWasiat = sisaAwal / 3;
  const wasiatValid = Math.min(wasiatInput, maxWasiat);

  // Harta Bersih Siap Bagi
  const hartaBersih = Math.max(0, sisaAwal - wasiatValid);

  // Render Nilai Harta Bersih dengan Format Ribuan
  const elHartaBersih = document.getElementById("res-harta-bersih");
  if (elHartaBersih) {
    elHartaBersih.innerText = "Rp " + formatRupiah(hartaBersih);
  }

  // Fetch Pilihan Ahli Waris
  const hasIstri = document.getElementById("check-istri")?.checked || false;
  const hasSuami = document.getElementById("check-suami")?.checked || false;
  const hasIbu = document.getElementById("check-ibu")?.checked || false;
  const hasAyah = document.getElementById("check-ayah")?.checked || false;
  const countAnakLk = parseInt(document.getElementById("count-anak-lk")?.value) || 0;
  const countAnakPr = parseInt(document.getElementById("count-anak-pr")?.value) || 0;

  // Render Rincian Seluruh Ahli Waris
  renderResults({
    hartaBersih,
    hasIstri,
    hasSuami,
    hasIbu,
    hasAyah,
    countAnakLk,
    countAnakPr
  });

  // Tampilkan Container Hasil & Scroll Halus
  const resultSection = document.getElementById("result-section");
  if (resultSection) {
    resultSection.classList.remove("hidden");
    resultSection.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * 3. Render Dynamic Cards (Ibu, Istri, Anak Lk & Pr)
 */
function renderResults(data) {
  const container = document.getElementById("results-list");
  if (!container) return;

  container.innerHTML = ""; // Bersihkan hasil lama

  const { hartaBersih, hasIstri, hasIbu, countAnakLk, countAnakPr } = data;
  const totalAnak = countAnakLk + countAnakPr;

  let sisaHarta = hartaBersih;

  // --- A. HITUNG ASHABUL FURUDH (Porsi Pasti) ---

  // 1. Istri
  if (hasIstri) {
    // Dapat 1/8 jika ada anak, 1/4 jika tidak ada anak
    const fraction = totalAnak > 0 ? 1 / 8 : 1 / 4;
    const fractionText = totalAnak > 0 ? "1/8" : "1/4";
    const nominal = hartaBersih * fraction;
    sisaHarta -= nominal;

    container.innerHTML += createCardHTML({
      icon: "💍",
      title: "Istri",
      category: "Ashabul Furudh",
      fractionText: fractionText,
      nominal: nominal,
      keterangan: totalAnak > 0 ? "Mendapat 1/8 karena pewaris memiliki keturunan/anak." : "Mendapat 1/4 karena pewaris tidak memiliki anak.",
      arabicDalil: "فَإِن كَانَ لَكُمْ وَلَدٌ فَلَهُنَّ الثُُّمُنُ مِمَّا تَرَكْتُم",
      indoDalil: '"Jika kamu mempunyai anak, maka para istri memperoleh seperdelapan dari harta yang kamu tinggalkan..."',
      surahDalil: "QS. An-Nisa' : 12"
    });
  }

  // 2. Ibu
  if (hasIbu) {
    // Dapat 1/6 jika ada anak, 1/3 jika tidak ada anak
    const fraction = totalAnak > 0 ? 1 / 6 : 1 / 3;
    const fractionText = totalAnak > 0 ? "1/6" : "1/3";
    const nominal = hartaBersih * fraction;
    sisaHarta -= nominal;

    container.innerHTML += createCardHTML({
      icon: "👵",
      title: "Ibu Kandung",
      category: "Ashabul Furudh",
      fractionText: fractionText,
      nominal: nominal,
      keterangan: totalAnak > 0 ? "Mendapat 1/6 karena pewaris memiliki keturunan/anak." : "Mendapat 1/3 karena pewaris tidak memiliki anak.",
      arabicDalil: "وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُۥ وَلَدٌ",
      indoDalil: '"Dan untuk kedua ibu-bapak, bagi masing-masingnya seperenam dari harta yang ditinggalkan, jika yang meninggal itu mempunyai anak..."',
      surahDalil: "QS. An-Nisa' : 11"
    });
  }

  // --- B. HITUNG 'ASOBAH (Penerima Sisa Harta) ---

  if (sisaHarta > 0 && (countAnakLk > 0 || countAnakPr > 0)) {
    if (countAnakLk > 0) {
      // Rasio Anak Laki : Anak Perempuan = 2 : 1 ('Asobah Bil Ghair)
      const totalPoin = (countAnakLk * 2) + countAnakPr;
      const poinPerSatuPorsi = sisaHarta / totalPoin;

      // Porsi Total Anak Laki-Laki
      const totalAnakLkNominal = poinPerSatuPorsi * 2 * countAnakLk;
      const nominalPerAnakLk = totalAnakLkNominal / countAnakLk;

      container.innerHTML += createCardHTML({
        icon: "👦",
        title: `Anak Laki-Laki (${countAnakLk} Orang)`,
        category: "'Asobah Binafsihi",
        fractionText: "Sisa (2 Poin/Orang)",
        nominal: totalAnakLkNominal,
        keterangan: `Menerima sisa harta bersama anak perempuan dengan rasio 2:1. (Per orang mendapat Rp ${formatRupiah(nominalPerAnakLk)})`,
        arabicDalil: "يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلَّذَكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ",
        indoDalil: '"Allah mensyariatkan bagimu tentang (pembagian pusaka untuk) anak-anakmu. Yaitu: bahagian seorang anak lelaki sama dengan bahagian dua orang anak perempuan..."',
        surahDalil: "QS. An-Nisa' : 11"
      });

      // Porsi Total Anak Perempuan (Jika ada)
      if (countAnakPr > 0) {
        const totalAnakPrNominal = poinPerSatuPorsi * 1 * countAnakPr;
        const nominalPerAnakPr = totalAnakPrNominal / countAnakPr;

        container.innerHTML += createCardHTML({
          icon: "👧",
          title: `Anak Perempuan (${countAnakPr} Orang)`,
          category: "'Asobah Bil Ghair",
          fractionText: "Sisa (1 Poin/Orang)",
          nominal: totalAnakPrNominal,
          keterangan: `Menerima sisa harta ditarik oleh anak laki-laki dengan rasio 1:2. (Per orang mendapat Rp ${formatRupiah(nominalPerAnakPr)})`,
          arabicDalil: "يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلَّذَكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ",
          indoDalil: '"Bahagian seorang anak lelaki sama dengan bahagian dua orang anak perempuan..."',
          surahDalil: "QS. An-Nisa' : 11"
        });
      }
    } else {
      // Anak Perempuan SAJA (Tanpa Anak Laki-Laki)
      let fractionText = countAnakPr === 1 ? "1/2" : "2/3";
      let nominal = countAnakPr === 1 ? hartaBersih * 0.5 : hartaBersih * (2 / 3);

      container.innerHTML += createCardHTML({
        icon: "👧",
        title: `Anak Perempuan (${countAnakPr} Orang)`,
        category: "Ashabul Furudh",
        fractionText: fractionText,
        nominal: nominal,
        keterangan: countAnakPr === 1 ? "Mendapat 1/2 karena tunggal (tidak ada anak laki-laki)." : "Mendapat 2/3 dibagi rata karena lebih dari satu orang.",
        arabicDalil: "فَإِن كُنَّ نِسَاءً فَوْقَ اثْنَتَيْنِ فَلَهُنَّ ثُلُثَا مَا تَرَكَ ۖ وَإِن كَانَتْ وَاحِدَةً فَلَهَا النِّصْفُ",
        indoDalil: '"Dan jika anak perempuan itu seorang saja, maka ia memperoleh separo harta. Jika anak perempuan itu lebih dari dua, maka bagi mereka dua pertiga..."',
        surahDalil: "QS. An-Nisa' : 11"
      });
    }
  }
}

/**
 * Helper Generator Card HTML
 */
function createCardHTML(item) {
  return `
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base">${item.icon}</div>
          <div>
            <h4 class="font-bold text-slate-800 text-sm">${item.title}</h4>
            <span class="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">${item.category}</span>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs text-slate-400 font-medium">Porsi: <b class="text-slate-700">${item.fractionText}</b></span>
          <p class="text-base font-extrabold text-emerald-600">Rp ${formatRupiah(item.nominal)}</p>
        </div>
      </div>
      
      <p class="text-xs text-slate-500 font-medium">${item.keterangan}</p>

      <details class="group border-t border-slate-100 pt-2.5">
        <summary class="flex items-center justify-between text-xs font-semibold text-emerald-700 cursor-pointer select-none">
          <span>📜 Lihat Dasar Hukum (Dalil)</span>
          <svg class="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </summary>
        <div class="mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
          <p class="font-arabic text-right text-base text-slate-800 font-bold leading-relaxed">
            ${item.arabicDalil}
          </p>
          <p class="text-slate-600 italic">${item.indoDalil}</p>
          <p class="text-[10px] font-bold text-emerald-800 pt-1 border-t border-slate-200">📖 ${item.surahDalil}</p>
        </div>
      </details>
    </div>
  `;
}

/**
 * 4. Modal Controller
 */
function toggleModal(show) {
  const modal = document.getElementById("export-modal");
  if (!modal) return;
  if (show) modal.classList.remove("hidden");
  else modal.classList.add("hidden");
}
