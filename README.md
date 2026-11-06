# Landing Page Pendaftaran Lomba Agustusan

Landing page responsif untuk menampilkan dan menerima pendaftaran lomba
perayaan kemerdekaan Indonesia. Peserta dapat memilih cabang lomba, mengisi
data diri, dan mengunggah berkas audio untuk lomba yang membutuhkan.

## Fitur

- Daftar lomba dengan ilustrasi dan rentang usia peserta
- Form pendaftaran dalam tampilan modal
- Validasi rentang usia sesuai cabang lomba
- Unggah audio dengan batas ukuran maksimal 10 MB untuk lomba tari-tarian
- Notifikasi status berhasil atau gagal
- Animasi antarmuka menggunakan Motion
- Pengiriman data ke Google Apps Script melalui variabel `VITE_WEB_APP_URL`

## Cabang Lomba

| Lomba            | Rentang Usia |
| ---------------- | ------------ |
| Balap Karung     | 7-15 tahun   |
| Lomba Kelereng   | 5-12 tahun   |
| Makan Kerupuk    | 5-12 tahun   |
| Paku Dalam Botol | 7-15 tahun   |
| Tarik Tambang    | 16-50 tahun  |
| Tari-tarian      | 5-50 tahun   |

## Teknologi

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Motion
- Lucide React

## Persyaratan

- Node.js 20 atau versi yang kompatibel
- npm

## Instalasi dan Menjalankan

```bash
git clone https://github.com/N00bie16/landingpage-agustusan.git
cd landingpage-agustusan
npm install
```

Untuk Playwright, pasang browser Chromium setelah instalasi:

```bash
npx playwright install chromium
```

Buat file `.env` dari contoh konfigurasi berikut:

```env
VITE_WEB_APP_URL=https://script.google.com/macros/s/ID_DEPLOYMENT/exec
```

Kemudian jalankan aplikasi:

```bash
npm run dev
```

Aplikasi tersedia di `http://localhost:3000`.

## Perintah NPM

| Perintah          | Kegunaan                                |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Menjalankan server pengembangan         |
| `npm run build`   | Membuat versi produksi ke folder `dist` |
| `npm run preview` | Meninjau hasil build produksi           |
| `npm run lint`    | Memeriksa tipe dengan TypeScript        |
| `npm run clean`   | Menghapus folder `dist` dan `server.js` |
| `npm test` | Menjalankan unit test dengan Vitest |
| `npm run test:watch` | Menjalankan Vitest dalam mode watch |
| `npm run test:e2e` | Menjalankan end-to-end test dengan Playwright |

## Testing

Vitest digunakan untuk unit test data dan logika TypeScript. Tambahkan file
test berakhiran `.test.ts` atau `.test.tsx` di dalam folder `src`.

```bash
npm test
```

Playwright digunakan untuk pengujian end-to-end di browser. Test berada pada
folder `tests/e2e` dan server Vite dijalankan otomatis.

```bash
npm run test:e2e
```

## Struktur Proyek

```text
src/
├── App.tsx             # Komponen utama dan alur pendaftaran
├── data.ts             # Data cabang lomba
├── index.css           # Style global
├── main.tsx            # Entry point React
└── components/
    ├── Footer.tsx
    ├── Header.tsx
    └── Modal.tsx
public/images/          # Ilustrasi lomba dan ornamen
```

## Menambah atau Mengubah Lomba

Data lomba berada di `src/data.ts`. Tambahkan atau ubah item pada array
`competitions`. Set `requiresAudio` menjadi `true` jika peserta harus mengunggah
file audio, lalu simpan gambar baru pada folder `public/images`.

## Konfigurasi Backend

Pendaftaran dikirim sebagai payload JSON ke URL Google Apps Script pada
`VITE_WEB_APP_URL`. Backend deployment perlu menerima permintaan `POST`, menyimpan
data peserta, dan menangani pengunggahan audio jika digunakan.

Jangan commit URL deployment atau credential rahasia ke repository.
