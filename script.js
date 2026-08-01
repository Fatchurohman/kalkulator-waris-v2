/**
 * Engine Kalkulator Faraidh - Mazhab Syafi'i (v2.6 Stable for Mobile)
 * Developer: fatur62
 */

class FaraidhEngineSyafii {
    constructor(inputData) {
        this.hartaKotor = parseFloat(inputData.hartaKotor) || 0;
        this.hutangBiaya = parseFloat(inputData.hutangBiaya) || 0;
        this.wasiat = parseFloat(inputData.wasiat) || 0;

        let hartaSisaHutang = Math.max(0, this.hartaKotor - this.hutangBiaya);
        let batasWasiat = hartaSisaHutang / 3;
        this.wasiatDiterima = Math.min(this.wasiat, batasWasiat);
        this.hartaBersih = Math.max(0, hartaSisaHutang - this.wasiatDiterima);

        let jmlSuami = inputData.suami ? 1 : 0;
        let jmlIstri = inputData.suami ? 0 : (parseInt(inputData.istri) || 0);

        this.rawWaris = {
            suami: jmlSuami,
            istri: jmlIstri,
            anakLaki: parseInt(inputData.anakLaki) || 0,
            anakPerempuan: parseInt(inputData.anakPerempuan) || 0,
            cucuLaki: parseInt(inputData.cucuLaki) || 0,
            cucuPerempuan: parseInt(inputData.cucuPerempuan) || 0,
            ayah: inputData.ayah ? 1 : 0,
            ibu: inputData.ibu ? 1 : 0,
            kakek: inputData.kakek ? 1 : 0,
            nenekAyah: inputData.nenekAyah ? 1 : 0,
            nenekIbu: inputData.nenekIbu ? 1 : 0,
            saudaraKandungLaki: parseInt(inputData.saudaraKandungLaki) || 0,
            saudaraKandungPerempuan: parseInt(inputData.saudaraKandungPerempuan) || 0,
            saudaraSeayahLaki: parseInt(inputData.saudaraSeayahLaki) || 0,
            saudaraSeayahPerempuan: parseInt(inputData.saudaraSeayahPerempuan) || 0,
            saudaraSeibu: parseInt(inputData.saudaraSeibu) || 0,
            pamanKandung: parseInt(inputData.pamanKandung) || 0,
            pamanSeayah: parseInt(inputData.pamanSeayah) || 0,
            anakPamanKandung: parseInt(inputData.anakPamanKandung) || 0,
            anakPamanSeayah: parseInt(inputData.anakPamanSeayah) || 0
        };

        this.statusHijab = {};
        this.warisAktif = { ...this.rawWaris };
    }

    terapkanHijab() {
        const w = this.warisAktif;
        const h = this.statusHijab;

        for (let k in w) {
            h[k] = { terhalang: false, oleh: "" };
        }

        const adaAnakLaki = w.anakLaki > 0;
        const adaAnakP = w.anakPerempuan > 0;
        const adaCucuLaki = w.cucuLaki > 0;
        const adaKeturunanLaki = adaAnakLaki || adaCucuLaki;
        const adaKeturunan = adaAnakLaki || adaAnakP || adaCucuLaki || (w.cucuPerempuan > 0);
        const adaAyah = w.ayah > 0;
        const adaIbu = w.ibu > 0;

        if (adaAnakLaki) {
            h.cucuLaki = { terhalang: true, oleh: "Anak Laki-laki" };
            w.cucuLaki = 0;
            h.cucuPerempuan = { terhalang: true, oleh: "Anak Laki-laki" };
            w.cucuPerempuan = 0;
        } else if (w.anakPerempuan >= 2 && w.cucuLaki === 0) {
            h.cucuPerempuan = { terhalang: true, oleh: "2+ Anak Perempuan" };
            w.cucuPerempuan = 0;
        }

        if (adaAyah) {
            h.kakek = { terhalang: true, oleh: "Ayah Kandung" };
            w.kakek = 0;
        }

        if (adaIbu) {
            h.nenekIbu = { terhalang: true, oleh: "Ibu Kandung" };
            w.nenekIbu = 0;
            h.nenekAyah = { terhalang: true, oleh: "Ibu Kandung" };
            w.nenekAyah = 0;
        } else if (adaAyah) {
            h.nenekAyah = { terhalang: true, oleh: "Ayah Kandung" };
            w.nenekAyah = 0;
        }

        if (adaKeturunan || adaAyah || w.kakek > 0) {
            h.saudaraSeibu = { terhalang: true, oleh: "Keturunan / Ayah / Kakek" };
            w.saudaraSeibu = 0;
        }

        if (adaKeturunanLaki || adaAyah) {
            let penghalang = adaAyah ? "Ayah Kandung" : "Keturunan Laki-laki";
            h.saudaraKandungLaki = { terhalang: true, oleh: penghalang };
            h.saudaraKandungPerempuan = { terhalang: true, oleh: penghalang };
            w.saudaraKandungLaki = 0;
            w.saudaraKandungPerempuan = 0;
        }

        const sKandungP_IsAshabah = (w.saudaraKandungPerempuan > 0) && (adaAnakP || w.cucuPerempuan > 0) && (!adaKeturunanLaki) && (!adaAyah);

        if (adaKeturunanLaki || adaAyah || w.saudaraKandungLaki > 0 || sKandungP_IsAshabah) {
            let penghalang = "Ayah / Keturunan Laki / Saudara Kandung";
            h.saudaraSeayahLaki = { terhalang: true, oleh: penghalang };
            h.saudaraSeayahPerempuan = { terhalang: true, oleh: penghalang };
            w.saudaraSeayahLaki = 0;
            w.saudaraSeayahPerempuan = 0;
        }

        const adaAshabahLebihDekat = adaKeturunanLaki || adaAyah || w.kakek > 0 || w.saudaraKandungLaki > 0 || w.saudaraSeayahLaki > 0 || sKandungP_IsAshabah;

        if (adaAshabahLebihDekat) {
            h.pamanKandung = { terhalang: true, oleh: "Garis Utama / Saudara Laki" };
            w.pamanKandung = 0;
        }

        if (adaAshabahLebihDekat || w.pamanKandung > 0) {
            h.pamanSeayah = { terhalang: true, oleh: "Paman Kandung" };
            w.pamanSeayah = 0;
        }

        if (adaAshabahLebihDekat || w.pamanKandung > 0 || w.pamanSeayah > 0) {
            h.anakPamanKandung = { terhalang: true, oleh: "Paman" };
            w.anakPamanKandung = 0;
        }

        if (adaAshabahLebihDekat || w.pamanKandung > 0 || w.pamanSeayah > 0 || w.anakPamanKandung > 0) {
            h.anakPamanSeayah = { terhalang: true, oleh: "Sepupu Kandung" };
            w.anakPamanSeayah = 0;
        }
    }

    kalkulasi() {
        const raw = this.rawWaris;
        const totalKeturunanRaw = raw.anakLaki + raw.anakPerempuan + raw.cucuLaki + raw.cucuPerempuan;
        const totalSaudaraRaw = raw.saudaraKandungLaki + raw.saudaraKandungPerempuan + raw.saudaraSeayahLaki + raw.saudaraSeayahPerempuan + raw.saudaraSeibu;

        // GHARRAWAIN
        if (totalKeturunanRaw === 0 && totalSaudaraRaw === 0 && raw.ibu === 1 && raw.ayah === 1 && (raw.suami === 1 || raw.istri > 0)) {
            this.terapkanHijab();
            let hasilNominal = {};
            let ket = {};

            if (raw.suami === 1) {
                let nominalSuami = 0.5 * this.hartaBersih;
                let sisa = this.hartaBersih - nominalSuami;
                let nominalIbu = sisa / 3;
                let nominalAyah = sisa - nominalIbu;

                hasilNominal.suami = nominalSuami;
                hasilNominal.ibu = nominalIbu;
                hasilNominal.ayah = nominalAyah;

                ket.suami = "1/2 (Fardh Suami)";
                ket.ibu = "1/3 dari SISA HARTA (Gharrawain)";
                ket.ayah = "'Ashabah bi Nafsihi (Sisa)";
            } else {
                let nominalIstri = 0.25 * this.hartaBersih;
                let sisa = this.hartaBersih - nominalIstri;
                let nominalIbu = sisa / 3;
                let nominalAyah = sisa - nominalIbu;

                hasilNominal.istri = nominalIstri;
                hasilNominal.ibu = nominalIbu;
                hasilNominal.ayah = nominalAyah;

                ket.istri = `1/4 (Dibagi ${raw.istri} Istri)`;
                ket.ibu = "1/3 dari SISA HARTA (Gharrawain)";
                ket.ayah = "'Ashabah bi Nafsihi (Sisa)";
            }

            return {
                hartaKotor: this.hartaKotor, hutangBiaya: this.hutangBiaya, wasiatDiterima: this.wasiatDiterima,
                hartaBersih: this.hartaBersih, statusKalkulasi: "KASUS KHUSUS: GHARRAWAIN",
                penjelasanStatus: "Kasus keputusan Umar bin Khattab RA: Ibu dapat 1/3 dari SISA harta setelah porsi pasangan diambil.",
                rawInput: this.rawWaris, warisAktif: this.warisAktif, statusHijab: this.statusHijab,
                hasilNominal: hasilNominal, keterangan: ket
            };
        }

        // NORMAL / AUL / RADD
        this.terapkanHijab();
        const w = this.warisAktif;
        const p = {};
        const ket = {};

        const adaKeturunan = (w.anakLaki + w.anakPerempuan + w.cucuLaki + w.cucuPerempuan) > 0;
        const totalSaudara = w.saudaraKandungLaki + w.saudaraKandungPerempuan + w.saudaraSeayahLaki + w.saudaraSeayahPerempuan + w.saudaraSeibu;

        if (w.suami) {
            p.suami = adaKeturunan ? 1/4 : 1/2;
            ket.suami = adaKeturunan ? "1/4 (Ada keturunan)" : "1/2 (Tanpa keturunan)";
        } else if (w.istri > 0) {
            p.istri = adaKeturunan ? 1/8 : 1/4;
            ket.istri = adaKeturunan ? `1/8 (Dibagi ${w.istri} istri)` : `1/4 (Dibagi ${w.istri} istri)`;
        }

        if (w.ibu) {
            p.ibu = (adaKeturunan || totalSaudara >= 2) ? 1/6 : 1/3;
            ket.ibu = (adaKeturunan || totalSaudara >= 2) ? "1/6 (Ada keturunan/2+ saudara)" : "1/3 (Tanpa keturunan & saudara < 2)";
        }

        let totalNenek = w.nenekIbu + w.nenekAyah;
        if (totalNenek > 0 && w.ibu === 0) {
            p.nenek = 1/6;
            ket.nenek = `1/6 (Dibagi ${totalNenek} nenek)`;
        }

        if (w.ayah) {
            if (w.anakLaki > 0 || w.cucuLaki > 0) {
                p.ayah = 1/6;
                ket.ayah = "1/6 (Fardh Murni)";
            } else if (w.anakPerempuan > 0 || w.cucuPerempuan > 0) {
                p.ayah = 1/6;
                ket.ayah = "1/6 + 'Ashabah";
            } else {
                ket.ayah = "'Ashabah bi Nafsihi";
            }
        }

        if (w.kakek && w.ayah === 0) {
            if (w.anakLaki > 0 || w.cucuLaki > 0) {
                p.kakek = 1/6;
                ket.kakek = "1/6 (Fardh Murni)";
            } else if (w.anakPerempuan > 0 || w.cucuPerempuan > 0) {
                p.kakek = 1/6;
                ket.kakek = "1/6 + 'Ashabah";
            } else {
                ket.kakek = "'Ashabah bi Nafsihi";
            }
        }

        if (w.saudaraSeibu > 0) {
            if (w.saudaraSeibu === 1) {
                p.saudaraSeibu = 1/6;
                ket.saudaraSeibu = "1/6 (1 orang)";
            } else {
                p.saudaraSeibu = 1/3;
                ket.saudaraSeibu = `1/3 (Dibagi ${w.saudaraSeibu} orang)`;
            }
        }

        if (w.anakLaki === 0 && w.anakPerempuan > 0) {
            if (w.anakPerempuan === 1) {
                p.anakPerempuan = 1/2;
                ket.anakPerempuan = "1/2 (Tunggal)";
            } else {
                p.anakPerempuan = 2/3;
                ket.anakPerempuan = `2/3 (Dibagi ${w.anakPerempuan} anak perempuan)`;
            }
        } else if (w.anakLaki > 0) {
            ket.anakLaki = "'Ashabah bi Nafsihi (Sisa, rasio 2:1)";
            if (w.anakPerempuan > 0) {
                ket.anakPerempuan = "'Ashabah bil Ghair (Rasio 1:2)";
            }
        }

        let totalFardh = 0;
        for (let key in p) totalFardh += p[key];

        let hasilNominal = {};
        let statusKalkulasi = "PEMBAGIAN NORMAL";
        let penjelasanStatus = "Pembagian harta berjalan standar sesuai porsi pasti dan sisa harta.";

        if (totalFardh > 1.000001) {
            statusKalkulasi = "TERJADI 'AUL";
            penjelasanStatus = "Total porsi melebihi 100%. Porsi disesuaikan secara proporsional.";
            for (let key in p) {
                let porsiAul = p[key] / totalFardh;
                hasilNominal[key] = porsiAul * this.hartaBersih;
                ket[key] += ` ['Aul: ${(porsiAul*100).toFixed(1)}%]`;
            }
        } else {
            for (let key in p) hasilNominal[key] = p[key] * this.hartaBersih;

            let sisaHarta = Math.max(0, this.hartaBersih * (1 - totalFardh));
            let adaAshabah = false;

            if (w.anakLaki > 0) {
                let totalPoin = (w.anakLaki * 2) + (w.anakPerempuan * 1);
                let nilaiPoin = sisaHarta / totalPoin;
                hasilNominal.anakLaki = (hasilNominal.anakLaki || 0) + (nilaiPoin * 2 * w.anakLaki);
                if (w.anakPerempuan > 0) hasilNominal.anakPerempuan = (hasilNominal.anakPerempuan || 0) + (nilaiPoin * 1 * w.anakPerempuan);
                adaAshabah = true;
            } else if (w.ayah) {
                hasilNominal.ayah = (hasilNominal.ayah || 0) + sisaHarta;
                adaAshabah = true;
            } else if (w.kakek) {
                hasilNominal.kakek = (hasilNominal.kakek || 0) + sisaHarta;
                adaAshabah = true;
            } else if (w.saudaraKandungLaki > 0) {
                let totalPoin = (w.saudaraKandungLaki * 2) + (w.saudaraKandungPerempuan * 1);
                let nilaiPoin = sisaHarta / totalPoin;
                hasilNominal.saudaraKandungLaki = nilaiPoin * 2 * w.saudaraKandungLaki;
                if (w.saudaraKandungPerempuan > 0) hasilNominal.saudaraKandungPerempuan = nilaiPoin * 1 * w.saudaraKandungPerempuan;
                adaAshabah = true;
            }

            if (!adaAshabah && totalFardh < 0.999999) {
                statusKalkulasi = "TERJADI RADD";
                penjelasanStatus = "Porsi kurang dari 100% tanpa 'Ashobah. Sisa harta dikembalikan proporsional.";
                let totalFardhNonPasangan = 0;
                for (let key in p) {
                    if (key !== "suami" && key !== "istri") totalFardhNonPasangan += p[key];
                }

                if (totalFardhNonPasangan > 0) {
                    for (let key in p) {
                        if (key !== "suami" && key !== "istri") {
                            let porsiRadd = (p[key] / totalFardhNonPasangan) * sisaHarta;
                            hasilNominal[key] += porsiRadd;
                            ket[key] += " + [Radd]";
                        }
                    }
                }
            }
        }

        return {
            hartaKotor: this.hartaKotor, hutangBiaya: this.hutangBiaya, wasiatDiterima: this.wasiatDiterima,
            hartaBersih: this.hartaBersih, statusKalkulasi: statusKalkulasi, penjelasanStatus: penjelasanStatus,
            rawInput: this.rawWaris, warisAktif: this.warisAktif, statusHijab: this.statusHijab,
            hasilNominal: hasilNominal, keterangan: ket
        };
    }
}

// Map Dalil Sederhana
const DALIL_MAP = {
    suami: { arabic: "وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِن لَّمْ يَكُن لَّهُنَّ وَلَدٌ", indo: '"Dan bagimu seperdua dari harta yang ditinggalkan istri-istrimu..."', surah: "QS. An-Nisa' : 12" },
    istri: { arabic: "وَلَهُنَّ الرُُّبُعُ مِمَّا تَرَكْتُمْ إِن لَّمْ يَكُن لَّكُمْ وَلَدٌ", indo: '"Para istri memperoleh seperempat harta jika kamu tidak mempunyai anak..."', surah: "QS. An-Nisa' : 12" },
    ibu: { arabic: "وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُۥ وَلَدٌ", indo: '"Dan untuk kedua ibu-bapak, bagi masing-masingnya seperenam..."', surah: "QS. An-Nisa' : 11" },
    ayah: { arabic: "وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ", indo: '"Bagi masing-masing ibu-bapak seperenam dari harta..."', surah: "QS. An-Nisa' : 11" },
    anakLaki: { arabic: "يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلَّذَكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ", indo: '"Bagian seorang anak lelaki sama dengan bagian dua anak perempuan..."', surah: "QS. An-Nisa' : 11" },
    anakPerempuan: { arabic: "فَإِن كُنَّ نِسَاءً فَوْقَ اثْنَتَيْنِ فَلَهُنَّ ثُلُثَا مَا تَرَكَ", indo: '"Jika anak perempuan lebih dari dua, bagi mereka dua pertiga..."', surah: "QS. An-Nisa' : 11" }
};

function prosesHitungWaris() {
    try {
        const parseRupiah = (id) => {
            let el = document.getElementById(id);
            if (!el) return 0;
            let val = el.value || "0";
            let angkaBersih = val.toString().replace(/\./g, '').replace(/,/g, '');
            return parseFloat(angkaBersih) || 0;
        };

        const inputData = {
            hartaKotor: parseRupiah('hartaKotor'),
            hutangBiaya: parseRupiah('hutangBiaya'),
            wasiat: parseRupiah('wasiat'),
            suami: document.getElementById('suami')?.checked || false,
            istri: document.getElementById('istri')?.value || 0,
            anakLaki: document.getElementById('anakLaki')?.value || 0,
            anakPerempuan: document.getElementById('anakPerempuan')?.value || 0,
            cucuLaki: document.getElementById('cucuLaki')?.value || 0,
            cucuPerempuan: document.getElementById('cucuPerempuan')?.value || 0,
            ayah: document.getElementById('ayah')?.checked || false,
            ibu: document.getElementById('ibu')?.checked || false,
            kakek: document.getElementById('kakek')?.checked || false,
            nenekAyah: document.getElementById('nenekAyah')?.checked || false,
            nenekIbu: document.getElementById('nenekIbu')?.checked || false,
            saudaraKandungLaki: document.getElementById('saudaraKandungLaki')?.value || 0,
            saudaraKandungPerempuan: document.getElementById('saudaraKandungPerempuan')?.value || 0,
            saudaraSeayahLaki: document.getElementById('saudaraSeayahLaki')?.value || 0,
            saudaraSeayahPerempuan: document.getElementById('saudaraSeayahPerempuan')?.value || 0,
            saudaraSeibu: document.getElementById('saudaraSeibu')?.value || 0,
            pamanKandung: document.getElementById('pamanKandung')?.value || 0,
            pamanSeayah: document.getElementById('pamanSeayah')?.value || 0,
            anakPamanKandung: document.getElementById('anakPamanKandung')?.value || 0,
            anakPamanSeayah: document.getElementById('anakPamanSeayah')?.value || 0
        };

        const engine = new FaraidhEngineSyafii(inputData);
        const hasil = engine.kalkulasi();

        renderHasilUI(hasil);
    } catch (err) {
        alert("Terjadi masalah saat menghitung: " + err.message);
    }
}

function renderHasilUI(hasil) {
    const container = document.getElementById('hasilOutput');
    if (!container) return;

    let fmt = (val) => "Rp " + Math.round(val || 0).toLocaleString('id-ID');

    let namaMap = {
        suami: "Suami", istri: "Istri", anakLaki: "Anak Laki-laki", anakPerempuan: "Anak Perempuan",
        cucuLaki: "Cucu Laki-laki", cucuPerempuan: "Cucu Perempuan",
        ayah: "Ayah Kandung", ibu: "Ibu Kandung", kakek: "Kakek", nenekIbu: "Nenek (Ibu)",
        nenekAyah: "Nenek (Ayah)", nenek: "Nenek", saudaraKandungLaki: "Saudara Kandung Laki-laki",
        saudaraKandungPerempuan: "Saudara Kandung Perempuan", saudaraSeayahLaki: "Saudara Seayah Laki-laki",
        saudaraSeayahPerempuan: "Saudara Seayah Perempuan", saudaraSeibu: "Saudara Seibu",
        pamanKandung: "Paman Kandung", pamanSeayah: "Paman Seayah",
        anakPamanKandung: "Sepupu Laki (Kandung)", anakPamanSeayah: "Sepupu Laki (Seayah)"
    };

    let cardsHTML = "";
    let mahjubRowsHTML = "";

    for (let key in namaMap) {
        let label = namaMap[key];
        let nominal = hasil.hasilNominal[key] || 0;
        let ket = hasil.keterangan[key] || "-";
        let isHijab = hasil.statusHijab[key] && hasil.statusHijab[key].terhalang;

        if (nominal > 0) {
            let dalilData = DALIL_MAP[key] || {
                arabic: "أَلْحِقُوا الْفَرَائِضَ بِأَهْلِهَا فَمَا بَقِيَ فَهُوَ لِلأَوْلَى رَجُلٍ ذَكَرٍ",
                indo: '"Bagikanlah harta warisan kepada yang berhak. Sisanya untuk laki-laki yang paling dekat."',
                surah: "HR. Bukhari No. 6735"
            };

            cardsHTML += `
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:16px; margin-bottom:12px; shadow-sm">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <h4 style="margin:0; font-size:0.95rem; font-weight:700; color:#1e293b;">${label}</h4>
                            <span style="font-size:0.7rem; font-weight:600; background:#ecfdf5; color:#047857; padding:2px 8px; border-radius:99px;">Ahli Waris</span>
                        </div>
                        <div style="text-align:right;">
                            <span style="font-size:0.7rem; color:#64748b;">Hak Diterima:</span>
                            <div style="font-size:1.05rem; font-weight:800; color:#059669;">${fmt(nominal)}</div>
                        </div>
                    </div>
                    <p style="font-size:0.8rem; color:#475569; margin:8px 0;"><b>Keterangan:</b> ${ket}</p>

                    <details style="border-top:1px solid #f1f5f9; padding-top:6px;">
                        <summary style="font-size:0.75rem; font-weight:700; color:#047857; cursor:pointer;">📜 Lihat Dasar Hukum (Dalil)</summary>
                        <div style="margin-top:6px; padding:8px; background:#f8fafc; border-radius:8px; font-size:0.75rem;">
                            <p style="text-align:right; font-family:serif; font-size:0.95rem; font-weight:bold; color:#1e293b; margin:0 0 4px 0;">${dalilData.arabic}</p>
                            <p style="font-style:italic; color:#475569; margin:0 0 4px 0;">${dalilData.indo}</p>
                            <span style="font-weight:bold; color:#047857;">📖 ${dalilData.surah}</span>
                        </div>
                    </details>
                </div>
            `;
        }

        if (isHijab) {
            mahjubRowsHTML += `
                <tr style="border-bottom:1px solid #fecdd3; background:#fff1f2;">
                    <td style="padding:8px; font-weight:bold; color:#9f1239;">${label}</td>
                    <td style="padding:8px; color:#881337;">Terhalang oleh <u>${hasil.statusHijab[key].oleh}</u></td>
                </tr>
            `;
        }
    }

    let html = `
        <div style="background: linear-gradient(135deg, #064e3b 0%, #047857 100%); color:white; padding:18px; border-radius:18px; margin-bottom:16px;">
            <div style="font-size:0.75rem; opacity:0.9;">Total Harta Bersih Pembagian</div>
            <div style="font-size:1.6rem; font-weight:800; color:#fef08a;">${fmt(hasil.hartaBersih)}</div>
            <p style="font-size:0.7rem; opacity:0.8; margin:4px 0 0 0;">*Harta kotor (${fmt(hasil.hartaKotor)}) dikurangi utang/tajhiz (${fmt(hasil.hutangBiaya)}) & wasiat (${fmt(hasil.wasiatDiterima)}).</p>
        </div>

        <div style="background:#f8fafc; border-left:4px solid #047857; padding:10px 14px; border-radius:6px; margin-bottom:16px;">
            <div style="font-weight:800; color:#0f172a; font-size:0.85rem;">Sifat Kasus: <span style="color:#047857;">${hasil.statusKalkulasi}</span></div>
            <div style="font-size:0.75rem; color:#475569;">${hasil.penjelasanStatus}</div>
        </div>

        <h3 style="color:#0f172a; font-size:0.95rem; font-weight:800; margin-bottom:10px;">Rincian Hak Ahli Waris</h3>
        ${cardsHTML}
    `;

    if (mahjubRowsHTML !== "") {
        html += `
            <div style="margin-top:16px; border:1px solid #fecdd3; border-radius:12px; overflow:hidden;">
                <div style="background:#ffe4e6; color:#9f1239; font-weight:bold; font-size:0.8rem; padding:8px 12px;">
                    🚫 Ahli Waris Terhalang Haknya (Mahjub)
                </div>
                <table style="width:100%; border-collapse:collapse; font-size:0.75rem;">
                    <tbody>${mahjubRowsHTML}</tbody>
                </table>
            </div>
        `;
    }

    container.innerHTML = html;

    // Tampilkan tombol cetak
    const btnCetak = document.getElementById('btnCetakPDF');
    if (btnCetak) btnCetak.classList.remove('hidden');

    container.scrollIntoView({ behavior: 'smooth' });
}
