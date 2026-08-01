/**
 * Engine Kalkulator Faraidh (Ilmu Waris Islam) - Mazhab Syafi'i
 * Versi 2.6 (Fixed Radd Status Detection & Full Card UI + Dalil Integrated)
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
            h.cucuPerempuan = { terhalang: true, oleh: "2+ Anak Perempuan (Hak 2/3 Anak habis)" };
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

        const sKandungP_IsAshabahMaalGhair = (w.saudaraKandungPerempuan > 0) && (adaAnakP || w.cucuPerempuan > 0) && (!adaKeturunanLaki) && (!adaAyah);

        if (adaKeturunanLaki || adaAyah || w.saudaraKandungLaki > 0 || sKandungP_IsAshabahMaalGhair) {
            let penghalang = "Ayah / Keturunan Laki / Saudara Kandung";
            h.saudaraSeayahLaki = { terhalang: true, oleh: penghalang };
            h.saudaraSeayahPerempuan = { terhalang: true, oleh: penghalang };
            w.saudaraSeayahLaki = 0;
            w.saudaraSeayahPerempuan = 0;
        } else if (w.saudaraKandungPerempuan >= 2 && w.saudaraSeayahLaki === 0) {
            h.saudaraSeayahPerempuan = { terhalang: true, oleh: "2+ Saudara Kandung Perempuan" };
            w.saudaraSeayahPerempuan = 0;
        }

        const sSeayahP_IsAshabahMaalGhair = (w.saudaraSeayahPerempuan > 0) && (adaAnakP || w.cucuPerempuan > 0) && (!adaKeturunanLaki) && (!adaAyah);
        const adaAshabahLakiLebihDekat = adaKeturunanLaki || adaAyah || w.kakek > 0 || w.saudaraKandungLaki > 0 || w.saudaraSeayahLaki > 0 || sKandungP_IsAshabahMaalGhair || sSeayahP_IsAshabahMaalGhair;

        if (adaAshabahLakiLebihDekat) {
            h.pamanKandung = { terhalang: true, oleh: "Garis Utama / Saudara Laki-laki" };
            w.pamanKandung = 0;
        }

        if (adaAshabahLakiLebihDekat || w.pamanKandung > 0) {
            h.pamanSeayah = { terhalang: true, oleh: "Paman Kandung" };
            w.pamanSeayah = 0;
        }

        if (adaAshabahLakiLebihDekat || w.pamanKandung > 0 || w.pamanSeayah > 0) {
            h.anakPamanKandung = { terhalang: true, oleh: "Paman" };
            w.anakPamanKandung = 0;
        }

        if (adaAshabahLakiLebihDekat || w.pamanKandung > 0 || w.pamanSeayah > 0 || w.anakPamanKandung > 0) {
            h.anakPamanSeayah = { terhalang: true, oleh: "Sepupu Laki-laki Kandung" };
            w.anakPamanSeayah = 0;
        }
    }

    kalkulasi() {
        const raw = this.rawWaris;

        // KASUS GHARRAWAIN
        const totalKeturunanRaw = raw.anakLaki + raw.anakPerempuan + raw.cucuLaki + raw.cucuPerempuan;
        const totalSaudaraRaw = raw.saudaraKandungLaki + raw.saudaraKandungPerempuan + raw.saudaraSeayahLaki + raw.saudaraSeayahPerempuan + raw.saudaraSeibu;

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
                ket.ibu = "1/3 dari SISA HARTA (Kasus Khusus Gharrawain)";
                ket.ayah = "'Ashabah bi Nafsihi (Menerima sisa harta)";
            } else {
                let nominalIstri = 0.25 * this.hartaBersih;
                let sisa = this.hartaBersih - nominalIstri;
                let nominalIbu = sisa / 3;
                let nominalAyah = sisa - nominalIbu;

                hasilNominal.istri = nominalIstri;
                hasilNominal.ibu = nominalIbu;
                hasilNominal.ayah = nominalAyah;

                ket.istri = `1/4 (Dibagi ${raw.istri} Istri)`;
                ket.ibu = "1/3 dari SISA HARTA (Kasus Khusus Gharrawain)";
                ket.ayah = "'Ashabah bi Nafsihi (Menerima sisa harta)";
            }

            return {
                hartaKotor: this.hartaKotor, hutangBiaya: this.hutangBiaya, wasiatDiterima: this.wasiatDiterima,
                hartaBersih: this.hartaBersih, statusKalkulasi: "KASUS KHUSUS: GHARRAWAIN (UMARIYYATAN)",
                penjelasanStatus: "Kasus istimewa keputusan Khalifah Umar bin Khattab RA: Ibu mendapatkan 1/3 dari SISA harta setelah porsi Suami/Istri diambil, agar porsi Ayah tetap lebih besar dari Ibu.",
                rawInput: this.rawWaris, warisAktif: this.warisAktif, statusHijab: this.statusHijab,
                hasilNominal: hasilNominal, keterangan: ket
            };
        }

        // KASUS NORMAL / 'AUL / RADD
        this.terapkanHijab();
        const w = this.warisAktif;
        const p = {};
        const ket = {};

        const adaKeturunan = (w.anakLaki + w.anakPerempuan + w.cucuLaki + w.cucuPerempuan) > 0;
        const totalSaudara = w.saudaraKandungLaki + w.saudaraKandungPerempuan + w.saudaraSeayahLaki + w.saudaraSeayahPerempuan + w.saudaraSeibu;

        // 1. Suami / Istri
        if (w.suami) {
            p.suami = adaKeturunan ? 1/4 : 1/2;
            ket.suami = adaKeturunan ? "1/4 (Fardh - Ada keturunan)" : "1/2 (Fardh - Tanpa keturunan)";
        } else if (w.istri > 0) {
            p.istri = adaKeturunan ? 1/8 : 1/4;
            ket.istri = adaKeturunan ? `1/8 (Fardh - Dibagi ${w.istri} istri)` : `1/4 (Fardh - Dibagi ${w.istri} istri)`;
        }

        // 2. Ibu / Nenek
        if (w.ibu) {
            p.ibu = (adaKeturunan || totalSaudara >= 2) ? 1/6 : 1/3;
            ket.ibu = (adaKeturunan || totalSaudara >= 2) ? "1/6 (Fardh - Ada keturunan / 2+ saudara)" : "1/3 (Fardh - Tanpa keturunan & saudara < 2)";
        }

        let totalNenek = w.nenekIbu + w.nenekAyah;
        if (totalNenek > 0 && w.ibu === 0) {
            p.nenek = 1/6;
            ket.nenek = `1/6 (Fardh - Dibagi rata ${totalNenek} nenek)`;
        }

        // 3. Ayah / Kakek
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

        // 4. Saudara Seibu
        if (w.saudaraSeibu > 0) {
            if (w.saudaraSeibu === 1) {
                p.saudaraSeibu = 1/6;
                ket.saudaraSeibu = "1/6 (Fardh - 1 orang)";
            } else {
                p.saudaraSeibu = 1/3;
                ket.saudaraSeibu = `1/3 (Fardh - Dibagi ${w.saudaraSeibu} orang)`;
            }
        }

        // 5. Anak Perempuan
        if (w.anakLaki === 0 && w.anakPerempuan > 0) {
            if (w.anakPerempuan === 1) {
                p.anakPerempuan = 1/2;
                ket.anakPerempuan = "1/2 (Fardh - Tunggal)";
            } else {
                p.anakPerempuan = 2/3;
                ket.anakPerempuan = `2/3 (Fardh - Dibagi ${w.anakPerempuan} anak perempuan)`;
            }
        } else if (w.anakLaki > 0) {
            ket.anakLaki = "'Ashabah bi Nafsihi (Menerima sisa harta rasio 2:1)";
            if (w.anakPerempuan > 0) {
                ket.anakPerempuan = "'Ashabah bil Ghair (Ditarik Anak Laki-laki, rasio 1:2)";
            }
        }

        // 6. Cucu Perempuan
        if (w.anakLaki === 0 && w.cucuLaki === 0 && w.cucuPerempuan > 0) {
            if (w.anakPerempuan === 0) {
                p.cucuPerempuan = (w.cucuPerempuan === 1) ? 1/2 : 2/3;
                ket.cucuPerempuan = (w.cucuPerempuan === 1) ? "1/2 (Fardh)" : `2/3 (Fardh - Dibagi ${w.cucuPerempuan} cucu)`;
            } else if (w.anakPerempuan === 1) {
                p.cucuPerempuan = 1/6;
                ket.cucuPerempuan = "1/6 (Fardh - Pelengkap 2/3)";
            }
        } else if (w.cucuLaki > 0 && w.anakLaki === 0) {
            ket.cucuLaki = "'Ashabah bi Nafsihi";
            if (w.cucuPerempuan > 0) ket.cucuPerempuan = "'Ashabah bil Ghair";
        }

        // 7. Saudara Kandung Perempuan
        if (w.anakLaki === 0 && w.cucuLaki === 0 && w.ayah === 0 && w.kakek === 0) {
            if (w.saudaraKandungLaki === 0 && w.saudaraKandungPerempuan > 0) {
                if (w.anakPerempuan > 0 || w.cucuPerempuan > 0) {
                    ket.saudaraKandungPerempuan = "'Ashabah ma'al Ghair (Sisa harta bersama keturunan perempuan)";
                } else {
                    p.saudaraKandungPerempuan = (w.saudaraKandungPerempuan === 1) ? 1/2 : 2/3;
                    ket.saudaraKandungPerempuan = (w.saudaraKandungPerempuan === 1) ? "1/2 (Fardh)" : `2/3 (Fardh - Dibagi ${w.saudaraKandungPerempuan} orang)`;
                }
            } else if (w.saudaraKandungLaki > 0) {
                ket.saudaraKandungLaki = "'Ashabah bi Nafsihi";
                if (w.saudaraKandungPerempuan > 0) ket.saudaraKandungPerempuan = "'Ashabah bil Ghair";
            }

            // 8. Saudara Seayah Perempuan
            if (w.saudaraKandungLaki === 0 && w.saudaraSeayahLaki === 0 && w.saudaraSeayahPerempuan > 0) {
                if (w.anakPerempuan > 0 || w.cucuPerempuan > 0) {
                    ket.saudaraSeayahPerempuan = "'Ashabah ma'al Ghair";
                } else if (w.saudaraKandungPerempuan === 0) {
                    p.saudaraSeayahPerempuan = (w.saudaraSeayahPerempuan === 1) ? 1/2 : 2/3;
                    ket.saudaraSeayahPerempuan = (w.saudaraSeayahPerempuan === 1) ? "1/2 (Fardh)" : `2/3 (Fardh - Dibagi ${w.saudaraSeayahPerempuan} orang)`;
                } else if (w.saudaraKandungPerempuan === 1) {
                    p.saudaraSeayahPerempuan = 1/6;
                    ket.saudaraSeayahPerempuan = "1/6 (Fardh - Pelengkap 2/3)";
                }
            } else if (w.saudaraSeayahLaki > 0 && w.saudaraKandungLaki === 0) {
                ket.saudaraSeayahLaki = "'Ashabah bi Nafsihi";
                if (w.saudaraSeayahPerempuan > 0) ket.saudaraSeayahPerempuan = "'Ashabah bil Ghair";
            }
        }

        // HITUNG TOTAL PORSI FARDH
        let totalFardh = 0;
        for (let key in p) {
            totalFardh += p[key];
        }

        let hasilNominal = {};
        let statusKalkulasi = "PEMBAGIAN NORMAL ('ASHABUL FURUDH & 'ASOBAH)";
        let penjelasanStatus = "Pembagian harta berjalan standar sesuai bagian pasti dan porsi sisa harta.";

        // 1. TERJADI 'AUL (TOTAL FARDH > 1)
        if (totalFardh > 1.000001) {
            statusKalkulasi = "TERJADI 'AUL (PENYESUAIAN PORSI PROPORSIOANAL)";
            penjelasanStatus = `Total porsi Ashabul Furudh (${(totalFardh * 100).toFixed(1)}%) melebihi 100%. Pembagi dinaikkan secara proporsional agar seluruh ahli waris tetap mendapatkan haknya secara adil.`;
            for (let key in p) {
                let porsiAul = p[key] / totalFardh;
                hasilNominal[key] = porsiAul * this.hartaBersih;
                ket[key] += ` ['Aul: Porsi disesuaikan dari ${(p[key]*100).toFixed(1)}% menjadi ${(porsiAul*100).toFixed(1)}%]`;
            }
        } else {
            for (let key in p) {
                hasilNominal[key] = p[key] * this.hartaBersih;
            }

            let sisaHarta = Math.max(0, this.hartaBersih * (1 - totalFardh));
            let adaAshabah = false;

            // CEK KEBERADAAN ASHABAH
            if (w.anakLaki > 0) {
                let totalPoin = (w.anakLaki * 2) + (w.anakPerempuan * 1);
                let nilaiPoin = sisaHarta / totalPoin;
                hasilNominal.anakLaki = (hasilNominal.anakLaki || 0) + (nilaiPoin * 2 * w.anakLaki);
                if (w.anakPerempuan > 0) hasilNominal.anakPerempuan = (hasilNominal.anakPerempuan || 0) + (nilaiPoin * 1 * w.anakPerempuan);
                adaAshabah = true;
            } else if (w.cucuLaki > 0) {
                let totalPoin = (w.cucuLaki * 2) + (w.cucuPerempuan * 1);
                let nilaiPoin = sisaHarta / totalPoin;
                hasilNominal.cucuLaki = (hasilNominal.cucuLaki || 0) + (nilaiPoin * 2 * w.cucuLaki);
                if (w.cucuPerempuan > 0) hasilNominal.cucuPerempuan = (hasilNominal.cucuPerempuan || 0) + (nilaiPoin * 1 * w.cucuPerempuan);
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
            } else if (w.saudaraKandungPerempuan > 0 && (w.anakPerempuan > 0 || w.cucuPerempuan > 0)) {
                hasilNominal.saudaraKandungPerempuan = (hasilNominal.saudaraKandungPerempuan || 0) + sisaHarta;
                adaAshabah = true;
            } else if (w.pamanKandung > 0) {
                hasilNominal.pamanKandung = sisaHarta;
                adaAshabah = true;
            } else if (w.pamanSeayah > 0) {
                hasilNominal.pamanSeayah = sisaHarta;
                adaAshabah = true;
            } else if (w.anakPamanKandung > 0) {
                hasilNominal.anakPamanKandung = sisaHarta;
                adaAshabah = true;
            } else if (w.anakPamanSeayah > 0) {
                hasilNominal.anakPamanSeayah = sisaHarta;
                adaAshabah = true;
            }

            // 2. TERJADI RADD (TOTAL FARDH < 1 DAN TANPA ASHABAH)
            if (!adaAshabah && totalFardh < 0.999999) {
                statusKalkulasi = "TERJADI RADD (SISA HARTA DIKEMBALIKAN)";
                penjelasanStatus = "Total porsi pasti Ashabul Furudh kurang dari 100% dan tidak ada penerima sisa ('Ashobah). Sisa harta dikembalikan secara proporsional kepada ahli waris nasabiyah.";
                let totalFardhNonPasangan = 0;
                for (let key in p) {
                    if (key !== "suami" && key !== "istri") totalFardhNonPasangan += p[key];
                }

                if (totalFardhNonPasangan > 0) {
                    for (let key in p) {
                        if (key !== "suami" && key !== "istri") {
                            let porsiRadd = (p[key] / totalFardhNonPasangan) * sisaHarta;
                            hasilNominal[key] += porsiRadd;
                            ket[key] += " + [Dapat Pengembalian Radd]";
                        }
                    }
                } else {
                    hasilNominal.baitulMaal = sisaHarta;
                    ket.baitulMaal = "Baitul Maal / Kas Negara (Sisa harta tidak dikembalikan ke Suami/Istri)";
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

// Map Dalil Al-Qur'an dan Hadits
const DALIL_MAP = {
    suami: {
        arabic: "وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِن لَّمْ يَكُن لَّهُنَّ وَلَدٌ ۚ فَإِن كَانَ لَهُنَّ وَلَدٌ فَلَكُمُ الرُُّبُعُ مِمَّا تَرَكْنَ",
        indo: '"Dan bagimu (suami-suami) seperdua dari harta yang ditinggalkan oleh istri-istrimu, jika mereka tidak mempunyai anak. Jika istri-istrimu itu mempunyai anak, maka kamu mendapat seperempat..."',
        surah: "QS. An-Nisa' : 12"
    },
    istri: {
        arabic: "وَلَهُنَّ الرُُّبُعُ مِمَّا تَرَكْتُمْ إِن لَّمْ يَكُن لَّكُمْ وَلَدٌ ۚ فَإِن كَانَ لَكُمْ وَلَدٌ فَلَهُنَّ الثُُّمُنُ مِمَّا تَرَكْتُم",
        indo: '"Para istri memperoleh seperempat harta yang kamu tinggalkan jika kamu tidak mempunyai anak. Jika kamu mempunyai anak, maka para istri memperoleh seperdelapan..."',
        surah: "QS. An-Nisa' : 12"
    },
    ibu: {
        arabic: "وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُۥ وَلَدٌ ۚ فَإِن لَّمْ يَكُن لَّهُۥ وَلَدٌ وَوَرِثَهُۥٓ أَبَوَاهُ فَلِأُمِّهِ الثُّلُثُ",
        indo: '"Dan untuk kedua ibu-bapak, bagi masing-masingnya seperenam dari harta yang ditinggalkan, jika yang meninggal itu mempunyai anak. Jika orang yang meninggal tidak mempunyai anak dan ia diwarisi oleh ibu-bapaknya (saja), maka ibunya mendapat sepertiga..."',
        surah: "QS. An-Nisa' : 11"
    },
    ayah: {
        arabic: "وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُۥ وَلَدٌ",
        indo: '"Dan untuk kedua ibu-bapak, bagi masing-masingnya seperenam dari harta yang ditinggalkan, jika yang meninggal itu mempunyai anak..."',
        surah: "QS. An-Nisa' : 11 & HR. Bukhari No. 6735"
    },
    anakLaki: {
        arabic: "يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلَّذَكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ",
        indo: '"Allah mensyariatkan bagimu tentang (pembagian pusaka untuk) anak-anakmu. Yaitu: bahagian seorang anak lelaki sama dengan bahagian dua orang anak perempuan..."',
        surah: "QS. An-Nisa' : 11"
    },
    anakPerempuan: {
        arabic: "فَإِن كُنَّ نِسَاءً فَوْقَ اثْنَتَيْنِ فَلَهُنَّ ثُلُثَا مَا تَرَكَ ۖ وَإِن كَانَتْ وَاحِدَةً فَلَهَا النِّصْفُ",
        indo: '"...Dan jika anak perempuan itu seorang saja, maka ia memperoleh separo harta. Jika anak perempuan itu lebih dari dua, maka bagi mereka dua pertiga dari harta yang ditinggalkan..."',
        surah: "QS. An-Nisa' : 11"
    },
    saudaraKandungLaki: {
        arabic: "أَلْحِقُوا الْفَرَائِضَ بِأَهْلِهَا فَمَا بَقِيَ فَهُوَ لِلأَوْلَى رَجُلٍ ذَكَرٍ",
        indo: '"Bagikanlah harta warisan kepada orang-orang yang berhak (*Ashabul Furudh*). Sisanya adalah untuk laki-laki yang paling dekat kekerabatannya."',
        surah: "HR. Bukhari No. 6735 & Muslim No. 1615"
    }
};

const KATEGORI_MAP = {
    suami: "Ashabul Furudh", istri: "Ashabul Furudh", ibu: "Ashabul Furudh", ayah: "Ashabul Furudh / 'Ashobah",
    kakek: "Ashabul Furudh / 'Ashobah", nenekIbu: "Ashabul Furudh", nenekAyah: "Ashabul Furudh", nenek: "Ashabul Furudh",
    anakLaki: "'Ashobah bi Nafsihi", anakPerempuan: "Ashabul Furudh / 'Ashobah",
    cucuLaki: "'Ashobah bi Nafsihi", cucuPerempuan: "Ashabul Furudh / 'Ashobah",
    saudaraKandungLaki: "'Ashobah bi Nafsihi", saudaraKandungPerempuan: "Ashabul Furudh / 'Ashobah",
    saudaraSeayahLaki: "'Ashobah bi Nafsihi", saudaraSeayahPerempuan: "Ashabul Furudh / 'Ashobah",
    saudaraSeibu: "Ashabul Furudh", pamanKandung: "'Ashobah bi Nafsihi", pamanSeayah: "'Ashobah bi Nafsihi",
    anakPamanKandung: "'Ashobah bi Nafsihi", anakPamanSeayah: "'Ashobah bi Nafsihi", baitulMaal: "Kas Negara"
};

const ICON_MAP = {
    suami: "🎩", istri: "💍", ibu: "👵", ayah: "👴", kakek: "🧓", nenekIbu: "👵", nenekAyah: "👵", nenek: "👵",
    anakLaki: "👦", anakPerempuan: "👧", cucuLaki: "👦", cucuPerempuan: "👧",
    saudaraKandungLaki: "🧑", saudaraKandungPerempuan: "👩", saudaraSeayahLaki: "🧑", saudaraSeayahPerempuan: "👩",
    saudaraSeibu: "👥", pamanKandung: "🧔", pamanSeayah: "🧔", anakPamanKandung: "👦", anakPamanSeayah: "👦", baitulMaal: "🏛️"
};

function prosesHitungWaris() {
    const parseRupiah = (id) => {
        let val = document.getElementById(id)?.value || "0";
        let angkaBersih = val.toString().replace(/\./g, '');
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
}

function renderHasilUI(hasil) {
    const container = document.getElementById('hasilOutput');
    if (!container) return;

    let fmt = (val) => "Rp " + Math.round(val || 0).toLocaleString('id-ID');

    let namaMap = {
        suami: "Suami", istri: "Istri", anakLaki: "Anak Laki-laki", anakPerempuan: "Anak Perempuan",
        cucuLaki: "Cucu Laki-laki", cucuPerempuan: "Cucu Perempuan",
        ayah: "Ayah Kandung", ibu: "Ibu Kandung", kakek: "Kakek (Ayah dari Ayah)", nenekIbu: "Nenek (Pihak Ibu)",
        nenekAyah: "Nenek (Pihak Ayah)", nenek: "Nenek", saudaraKandungLaki: "Saudara Kandung Laki-laki",
        saudaraKandungPerempuan: "Saudara Kandung Perempuan", saudaraSeayahLaki: "Saudara Seayah Laki-laki",
        saudaraSeayahPerempuan: "Saudara Seayah Perempuan", saudaraSeibu: "Saudara Seibu",
        pamanKandung: "Paman Kandung", pamanSeayah: "Paman Seayah",
        anakPamanKandung: "Sepupu Laki-laki (Kandung)", anakPamanSeayah: "Sepupu Laki-laki (Seayah)",
        baitulMaal: "Baitul Maal / Kas Negara"
    };

    let cardsHTML = "";
    let mahjubRowsHTML = "";

    for (let key in namaMap) {
        let label = namaMap[key];
        let nominal = hasil.hasilNominal[key] || 0;
        let ket = hasil.keterangan[key] || "-";
        let isHijab = hasil.statusHijab[key] && hasil.statusHijab[key].terhalang;

        if (nominal > 0) {
            let icon = ICON_MAP[key] || "👤";
            let kategori = KATEGORI_MAP[key] || "Ahli Waris";
            let dalilData = DALIL_MAP[key] || {
                arabic: "أَلْحِقُوا الْفَرَائِضَ بِأَهْلِهَا فَمَا بَقِيَ فَهُوَ لِلأَوْلَى رَجُلٍ ذَكَرٍ",
                indo: '"Bagikanlah harta warisan kepada orang-orang yang berhak (*Ashabul Furudh*). Sisanya adalah untuk laki-laki yang paling dekat kekerabatannya."',
                surah: "HR. Bukhari No. 6735"
            };

            cardsHTML += `
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:16px; margin-bottom:12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="font-size:1.5rem; background:#f0fdf4; padding:8px; border-radius:12px;">${icon}</span>
                            <div>
                                <h4 style="margin:0; font-size:0.95rem; font-weight:700; color:#1e293b;">${label}</h4>
                                <span style="font-size:0.7rem; font-weight:600; background:#ecfdf5; color:#047857; padding:2px 8px; border-radius:99px;">${kategori}</span>
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <span style="font-size:0.75rem; color:#64748b;">Hak Diterima:</span>
                            <div style="font-size:1.05rem; font-weight:800; color:#059669;">${fmt(nominal)}</div>
                        </div>
                    </div>
                    <p style="font-size:0.8rem; color:#475569; margin:6px 0 10px 0;"><b>Keterangan:</b> ${ket}</p>

                    <details style="border-top:1px border-slate-100; padding-top:8px;">
                        <summary style="font-size:0.75rem; font-weight:700; color:#047857; cursor:pointer; user-select:none;">📜 Lihat Dasar Hukum (Dalil)</summary>
                        <div style="margin-top:8px; padding:10px; background:#f8fafc; border-radius:8px; font-size:0.75rem; border:1px solid #f1f5f9;">
                            <p style="text-align:right; font-family:serif; font-size:1rem; font-weight:bold; color:#1e293b; margin:0 0 6px 0; line-height:1.6;">${dalilData.arabic}</p>
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
                    <td style="padding:8px 12px; font-weight:bold; color:#9f1239;">${label}</td>
                    <td style="padding:8px 12px; color:#881337;">Mahjub / Terhalang</td>
                    <td style="padding:8px 12px; font-weight:bold; color:#9f1239;">Terhalang oleh <u>${hasil.statusHijab[key].oleh}</u></td>
                </tr>
            `;
        }
    }

    let html = `
        <div style="background: linear-gradient(135deg, #064e3b 0%, #047857 100%); color:white; padding:20px; border-radius:20px; margin-bottom:20px; box-shadow:0 10px 20px -5px rgba(4,120,87,0.3);">
            <div style="display:flex; justify-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:8px; margin-bottom:12px;">
                <span style="font-size:0.8rem; font-weight:600; opacity:0.9;">Total Harta Bersih Pembagian</span>
                <span style="font-size:0.7rem; background:rgba(255,255,255,0.2); padding:2px 8px; border-radius:99px;">Siap Dibagi</span>
            </div>
            <div style="font-size:1.8rem; font-weight:800; color:#fef08a;">${fmt(hasil.hartaBersih)}</div>
            <p style="font-size:0.75rem; opacity:0.8; margin:4px 0 0 0;">*Harta kotor (${fmt(hasil.hartaKotor)}) dikurangi utang/tajhiz (${fmt(hasil.hutangBiaya)}) & wasiat (${fmt(hasil.wasiatDiterima)}).</p>
        </div>

        <div style="background:#f8fafc; border-left:4px solid #047857; padding:12px 16px; border-radius:6px; margin-bottom:20px;">
            <div style="font-weight:800; color:#0f172a; font-size:0.85rem;">Sifat Kasus: <span style="color:#047857;">${hasil.statusKalkulasi}</span></div>
            <div style="font-size:0.75rem; color:#475569; margin-top:2px;">${hasil.penjelasanStatus}</div>
        </div>

        <h3 style="color:#0f172a; font-size:1rem; font-weight:800; margin-bottom:12px;">Rincian Hak Ahli Waris</h3>
        ${cardsHTML}
    `;

    if (mahjubRowsHTML !== "") {
        html += `
            <div style="margin-top:20px; border:1px solid #fecdd3; border-radius:12px; overflow:hidden;">
                <div style="background:#ffe4e6; color:#9f1239; font-weight:bold; font-size:0.85rem; padding:10px 12px;">
                    🚫 Ahli Waris Terhalang Haknya (Mahjub / Hijab)
                </div>
                <table style="width:100%; border-collapse:collapse; font-size:0.8rem;">
                    <tbody>
                        ${mahjubRowsHTML}
                    </tbody>
                </table>
            </div>
        `;
    }

    container.innerHTML = html;
    container.scrollIntoView({ behavior: 'smooth' });
}

      
