

// Fungsi Membership untuk Jumlah Kunjungan
        function membershipJumlahKunjungan(x) {
            const rendah = Math.max(0, Math.min((20 - x) / 20, 1));
            const sedang = Math.max(0, Math.min((x - 10) / 20, (50 - x) / 20));
            const tinggi = Math.max(0, Math.min((x - 40) / 20, 1));
            return [rendah, sedang, tinggi];
        }

        // Fungsi Membership untuk Kepuasan
        function membershipKepuasan(x) {
            const rendah = Math.max(0, Math.min((4 - x) / 4, 1));
            const sedang = Math.max(0, Math.min((x - 2) / 3, (8 - x) / 3));
            const tinggi = Math.max(0, Math.min((x - 6) / 4, 1));
            return [rendah, sedang, tinggi];
        }

        // Fungsi Membership untuk Penjualan (output)
        function membershipPenjualan(z) {
            const rendah = Math.max(0, Math.min((50 - z) / 50, 1));
            const sedang = Math.max(0, Math.min((z - 30) / 40, (100 - z) / 40));
            const tinggi = Math.max(0, Math.min((z - 80) / 40, 1));
            return [rendah, sedang, tinggi];
        }

        // Fungsi Inferensi
        function inferensi(jumlahKunjungan, kepuasan) {
            const [rendahKunjungan, sedangKunjungan, tinggiKunjungan] = membershipJumlahKunjungan(jumlahKunjungan);
            const [rendahKepuasan, sedangKepuasan, tinggiKepuasan] = membershipKepuasan(kepuasan);

            const aturan = [];
            aturan.push([Math.min(rendahKunjungan, rendahKepuasan), 'rendah']);
            aturan.push([Math.min(rendahKunjungan, sedangKepuasan), 'rendah']);
            aturan.push([Math.min(sedangKunjungan, rendahKepuasan), 'rendah']);
            aturan.push([Math.min(sedangKunjungan, sedangKepuasan), 'sedang']);
            aturan.push([Math.min(sedangKunjungan, tinggiKepuasan), 'tinggi']);
            aturan.push([Math.min(tinggiKunjungan, rendahKepuasan), 'sedang']);
            aturan.push([Math.min(tinggiKunjungan, sedangKepuasan), 'tinggi']);
            aturan.push([Math.min(tinggiKunjungan, tinggiKepuasan), 'tinggi']);

            return aturan;
        }

        // Fungsi Defuzzifikasi
        function defuzzifikasi(aturan) {
            let numerator = 0;
            let denominator = 0;

            for (let i = 0; i < aturan.length; i++) {
                let nilai = aturan[i][0];
                let kategori = aturan[i][1];
                let z = 0;

                if (kategori === 'rendah') {
                    z = 25;
                } else if (kategori === 'sedang') {
                    z = 70;
                } else if (kategori === 'tinggi') {
                    z = 100;
                }

                numerator += nilai * z;
                denominator += nilai;
            }

            return numerator / denominator || 0;
        }

        // Fungsi untuk Menghitung Prediksi
        function hitungPrediksi(data) {
            const jumlahKunjungan = data.jumlahKunjungan;
            const kepuasan = data.kepuasan;

            // Inferensi berdasarkan input
            const aturan = inferensi(jumlahKunjungan, kepuasan);

            // Defuzzifikasi untuk mendapatkan hasil numerik
            const hasilDefuzzifikasi = defuzzifikasi(aturan);

            let kategori = '';
            if (hasilDefuzzifikasi <= 40) {
                kategori = 'Rendah';
            } else if (hasilDefuzzifikasi <= 70) {
                kategori = 'Sedang';
            } else {
                kategori = 'Tinggi';
            }
            return {
              hasilDefuzzifikasi,
              kategori
            }

        }

document.getElementById('predictionForm').addEventListener('submit', async function (e) {
      e.preventDefault();

      const jumlah_kunjungan = document.getElementById('jumlah_kunjungan').value;
      const kepuasan = document.getElementById('kepuasan').value;
      const prediksi = document.querySelector("#prediksi");
      const kategori = document.querySelector("#kategori");
      const result = hitungPrediksi({
        jumlahKunjungan: jumlah_kunjungan,
        kepuasan,
      });
      const prediksiContent = `Setelah Melakukan Defuzzifikasi jumlah penjualan polis adalah <strong>${result.hasilDefuzzifikasi}</strong>`
      const kategoriContent = `Dan termasuk kedalam kategori <strong>${result.kategori}</strong>`
      document.getElementById("result").style.display = "block";
      prediksi.innerHTML = prediksiContent;
      kategori.insertAdjacentHTML("afterbegin", kategoriContent);
});