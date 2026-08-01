/**
 * Kalkulator Waris Syari'i v.1
 * Logic & Interactive Controller
 */

// Global State
let currentStep = 1;

// DOM Elements & Event Listeners Loaded
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  console.log("Kalkulator Waris v.1 System Ready.");
}

/**
 * 1. Stepper Navigation Controller
 */
function goToStep(step) {
  // Sembunyikan step yang sedang aktif
  const currentContent = document.getElementById(`step-${currentStep}-content`);
  if (currentContent) currentContent.classList.add("hidden");

  // Update State Step
  currentStep = step;

  // Tampilkan step tujuan
  const targetContent = document.getElementById(`step-${currentStep}-content`);
  if (targetContent) targetContent.classList.remove("hidden");

  // Update Stepper Progress Line UI
  const progressBar = document.getElementById("step-progress-bar");
  if (progressBar) {
    if (step === 1) progressBar.style.width = "0%";
    if (step === 2) progressBar.style.width = "50%";
    if (step === 3) progressBar.style.width = "100%";
  }

  // Update Indikator Badge Stepper UI
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
 * 2. Logika Hitung Waris (v.1 Engine)
 */
function calculateResult() {
  // Fetch Nilai Input Harta & Potongan
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

  // Render Nilai Harta Bersih ke UI
  const elHartaBersih = document.getElementById("res-harta-bersih");
  if (elHartaBersih) {
    elHartaBersih.innerText = "Rp " + hartaBersih.toLocaleString("id-ID");
  }

  // Fetch Pilihan Ahli Waris
  const hasIstri = document.getElementById("check-istri")?.checked || false;
  const hasSuami = document.getElementById("check-suami")?.checked || false;
  const hasIbu = document.getElementById("check-ibu")?.checked || false;
  const hasAyah = document.getElementById("check-ayah")?.checked || false;
  const countAnakLk = parseInt(document.getElementById("count-anak-lk")?.value) || 0;
  const countAnakPr = parseInt(document.getElementById("count-anak-pr")?.value) || 0;

  // Render Rincian Pembagian (Sederhana v.1 Demo)
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
 * 3. Render Dynamic Card Hasil & Dalil
 */
function renderResults(data) {
  const container = document.getElementById("results-list");
  if (!container) return;

  // Clear previous result
  container.innerHTML = "";

  const { hartaBersih, hasIstri, hasIbu, countAnakLk } = data;

  // Contoh Logika Dasar: Ibu
  if (hasIbu) {
    const porsiFraction = countAnakLk > 0 ? "1/6" : "1/3";
    const nominal = countAnakLk > 0 ? hartaBersih / 6 : hartaBersih / 3;

    const cardHTML = `
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base">👵</div>
            <div>
              <h4 class="font-bold text-slate-800 text-sm">Ibu Kandung</h4>
              <span class="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">Ashabul Furudh</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400 font-medium">Porsi: <b class="text-slate-700">${porsiFraction}</b></span>
            <p class="text-base font-extrabold text-emerald-600">Rp ${nominal.toLocaleString("id-ID")}</p>
          </div>
        </div>
        
        <details class="group border-t border-slate-100 pt-2.5">
          <summary class="flex items-center justify-between text-xs font-semibold text-emerald-700 cursor-pointer select-none">
            <span>📜 Lihat Dasar Hukum (Dalil)</span>
            <svg class="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </summary>
          <div class="mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
            <p class="font-arabic text-right text-base text-slate-800 font-bold leading-relaxed">
              وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُۥ وَلَدٌ
            </p>
            <p class="text-slate-600 italic">"Dan untuk kedua ibu-bapak, bagi masing-masingnya seperenam dari harta yang ditinggalkan, jika yang meninggal itu mempunyai anak..."</p>
            <p class="text-[10px] font-bold text-emerald-800 pt-1 border-t border-slate-200">📖 QS. An-Nisa' : 11</p>
          </div>
        </details>
      </div>
    `;

    container.innerHTML += cardHTML;
  }
}

/**
 * 4. Modal Export & Print Toggle
 */
function toggleModal(show) {
  const modal = document.getElementById("export-modal");
  if (!modal) return;

  if (show) {
    modal.classList.remove("hidden");
  } else {
    modal.classList.add("hidden");
  }
}

