/**
 * Engine Kalkulator Faraidh - Mazhab Syafi'i (v2.0 Final Engine)
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
            anakPamanSeayah: parseInt(inputData.anakPamanSeayah) || 0,
            
            // Variabel Kasus Khusus v.2
            anakLuarNikah: parseInt(inputData.anakLuarNikah) || 0,
            warisBedaAgama: parseInt(inputData.warisBedaAgama) || 0,
            adaHamil: inputData.adaHamil || false
        };

        this.statusHijab = {};
        this.warisAktif = { ...this.rawWaris };
        this.catatanKhusus = [];
    }

    terapkanHijab() {
        const w = this.warisAktif;
        const h = this.statusHijab;

        for (let k in w) {
            h[k] = { terhalang: false, oleh: "" };
        }

        // 1. PENANGANAN AHLI WARIS BEDA AGAMA (MAHRUM)
        if (w.warisBedaAgama > 0) {
            this.catatanKhusus.push(`🚫 ${w.warisBedaAgama} orang Ahli Waris Beda Agama/Murtad terhalang mutlak (Mahrūm) menerima warisan berdasarkan kesepakatan ulama.`);
        }

        // 2. PENANGANAN ANAK DI LUAR NIKAH (ANAK ZINA)
        if (w.anakLuarNikah > 0) {
            this.catatanKhusus.push(`👶 ${w.anakLuarNikah} Anak Di Luar Nikah hanya memiliki hubungan nasab & waris dengan IBU KANDUNG. Tidak mewarisi dari Ayah Biologis.`);
        }

        // 3. PENANGANAN ANAK DALAM KANDUNGAN
        if (w.adaHamil) {
            this.catatanKhusus.push(`🤰 Ada Anak Dalam Kandungan: Disarankan pembagian ditangguhkan hingga bayi lahir, atau disisihkan porsi terbesar (anak laki-laki).`);
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
                penjelasanStatus: "Kasus Umar bin Khattab RA: Ibu dapat 1/3 dari SISA harta setelah porsi pasangan diambil.",
                rawInput: this.rawWaris, warisAktif: this.warisAktif, statusHijab: this.statusHijab,
                hasilNominal: hasilNominal, keterangan: ket, catatanKhusus: this.catatanKhusus
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

        if (w.saudaraSeibu > 0) {
            p.saudaraSeibu = (w.saudaraSeibu === 1) ? 1/6 : 1/3;
            ket.saudaraSeibu = (w.saudaraSeibu === 1) ? "1/6 (1 orang)" : `1/3 (Dibagi ${w.saudaraSeibu} orang)`;
        }

        if (w.anakLaki === 0 && w.anakPerempuan > 0) {
            p.anakPerempuan = (w.anakPerempuan === 1) ? 1/2 : 2/3;
            ket.anakPerempuan = (w.anakPerempuan === 1) ? "1/2 (Tunggal)" : `2/3 (Dibagi ${w.anakPerempuan} anak perempuan)`;
        } else if (w.anakLaki > 0) {
            ket.anakLaki = "'Ashabah bi Nafsihi (Sisa, rasio 2:1)";
            if (w.anakPerempuan > 0) ket.anakPerempuan = "'Ashabah bil Ghair (Rasio 1:2)";
        }

        if (w.anakLaki === 0 && w.cucuLaki === 0 && w.ayah === 0 && w.kakek === 0) {
            if (w.saudaraKandungLaki === 0 && w.saudaraKandungPerempuan > 0) {
                if (w.anakPerempuan > 0 || w.cucuPerempuan > 0) {
                    ket.saudaraKandungPerempuan = "'Ashabah ma'al Ghair (Sisa bersama keturunan pr)";
                } else {
                    p.saudaraKandungPerempuan = (w.saudaraKandungPerempuan === 1) ? 1/2 : 2/3;
                    ket.saudaraKandungPerempuan = (w.saudaraKandungPerempuan === 1) ? "1/2 (Tunggal)" : `2/3 (Dibagi ${w.saudaraKandungPerempuan} orang)`;
                }
            } else if (w.saudaraKandungLaki > 0) {
                ket.saudaraKandungLaki = "'Ashabah bi Nafsihi";
                if (w.saudaraKandungPerempuan > 0) ket.saudaraKandungPerempuan = "'Ashabah bil Ghair";
            }
        }

        let totalFardh = 0;
        for (let key in p) totalFardh += p[key];

        let hasilNominal = {};
        let statusKalkulasi = "PEMBAGIAN NORMAL";
        let penjelasanStatus = "Pembagian harta berjalan standar sesuai porsi pasti dan sisa harta.";

        if (totalFardh > 1.000001) {
            statusKalkulasi = "TERJADI 'AUL";
            penjelasanStatus = `Total porsi pasti (${(totalFardh * 100).toFixed(1)}%) melebihi 100%. Porsi pembagi dinaikkan proporsional.`;
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
                            ket[key] += " + [Dapat Radd]";
                        }
                    }
                }
            }
        }

        return {
            hartaKotor: this.hartaKotor, hutangBiaya: this.hutangBiaya, wasiatDiterima: this.wasiatDiterima,
            hartaBersih: this.hartaBersih, statusKalkulasi: statusKalkulasi, penjelasanStatus: penjelasanStatus,
            rawInput: this.rawWaris, warisAktif: this.warisAktif, statusHijab: this.statusHijab,
            hasilNominal: hasilNominal, keterangan: ket, catatanKhusus: this.catatanKhusus
        };
    }
}

const DALIL_MAP = {
    suami: { arabic: "وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِن لَّمْ يَكُن لَّهُنَّ وَلَدٌ", indo: '"Dan bagimu seperdua dari harta yang ditinggalkan istri-istrimu..."', surah: "QS. An-Nisa' : 12" },
    istri: { arabic: "وَلَهُنَّ الرُُّبُعُ مِمَّا تَرَكْتُمْ إِن لَّمْ يَكُن لَّكُمْ وَلَدٌ", indo: '"Para istri memperoleh seperempat harta jika kamu tidak mempunyai anak..."', surah: "QS. An-Nisa' : 12" },
    ibu: { arabic: "وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُۥ وَلَدٌ", indo: '"Dan untuk kedua ibu-bapak, bagi masing-masingnya seperenam..."', surah: "QS. An-Nisa' : 11" },
    ayah: { arabic: "وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ", indo: '"Bagi masing-masing ibu-bapak seperenam dari harta..."', surah: "QS. An-Nisa' : 11" },
    anakLaki: { arabic: "يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلَّذَكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ", indo: '"Bagian seorang anak lelaki sama dengan bagian dua anak perempuan..."', surah: "QS. An-Nisa' : 11" },
    anakPerempuan: { arabic: "فَإِن كُنَّ نِسَاءً فَوْقَ اثْنَتَيْنِ فَلَهُنَّ ثُلُثَا مَا تَرَكَ", indo: '"Jika anak perempuan lebih dari dua, bagi mereka dua pertiga..."', surah: "QS. An-Nisa' : 11" },
    saudaraKandungPerempuan: { arabic: "فَإِن كَانَتَا اثْنَتَيْنِ فَلَهُمَا الثُّلُثَانِ مِمَّا تَرَكَ", indo: '"Jika saudara perempuan dua orang, bagi keduanya dua pertiga..."', surah: "QS. An-Nisa' : 176" }
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

        const getValue = (id) => {
            let el = document.getElementById(id);
            return el ? el.value : 0;
        };

        const inputData = {
            hartaKotor: parseRupiah('hartaKotor'),
            hutangBiaya: parseRupiah('hutangBiaya'),
            wasiat: parseRupiah('wasiat'),
            suami: document.getElementById('suami')?.checked || false,
            istri: getValue('istri'),
            anakLaki: getValue('anakLaki'),
            anakPerempuan: getValue('anakPerempuan'),
            cucuLaki: getValue('cucuLaki'),
            cucuPerempuan: getValue('cucuPerempuan'),
            ayah: document.getElementById('ayah')?.checked || false,
            ibu: document.getElementById('ibu')?.checked || false,
            kakek: document.getElementById('kakek')?.checked || false,
            nenekAyah: document.getElementById('nenekAyah')?.checked || false,
            nenekIbu: document.getElementById('nenekIbu')?.checked || false,
            saudaraKandungLaki: getValue('saudaraKandungLaki'),
            saudaraKandungPerempuan: getValue('saudaraKandungPerempuan'),
            saudaraSeayahLaki: getValue('saudaraSeayahLaki'),
            saudaraSeayahPerempuan: getValue('saudaraSeayahPerempuan'),
            saudaraSeibu: getValue('saudaraSeibu'),
            pamanKandung: getValue('pamanKandung'),
            pamanSeayah: getValue('pamanSeayah'),
            anakPamanKandung: getValue('anakPamanKandung'),
            anakPamanSeayah: getValue('anakPamanSeayah'),
            
            // Fetch Input Kasus Khusus v.2
            anakLuarNikah: getValue('anakLuarNikah'),
            warisBedaAgama: getValue('warisBedaAgama'),
            adaHamil: document.getElementById('adaHamil')?.checked || false
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
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:16px; margin-bottom:12px;">
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

    // RENDER CATATAN KHUSUS (ANAK ZINA / BEDA AGAMA / KANDUNGAN)
    let catatanKhususHTML = "";
    if (hasil.catatanKhusus && hasil.catatanKhusus.length > 0) {
        catatanKhususHTML = `
            <div style="background:#fffbeb; border:1px solid #fef3c7; border-radius:12px; padding:12px; margin-bottom:16px;">
                <h4 style="font-size:0.8rem; font-weight:bold; color:#92400e; margin:0 0 6px 0;">⚠️ Catatan Status Khusus Fiqh:</h4>
                <ul style="font-size:0.75rem; color:#78350f; margin:0; padding-left:18px;">
                    ${hasil.catatanKhusus.map(c => `<li style="margin-bottom:4px;">${c}</li>`).join('')}
                </ul>
            </div>
        `;
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

        ${catatanKhususHTML}

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

    const btnCetak = document.getElementById('btnCetakPDF');
    if (btnCetak) btnCetak.classList.remove('hidden');

    container.scrollIntoView({ behavior: 'smooth' });
}
