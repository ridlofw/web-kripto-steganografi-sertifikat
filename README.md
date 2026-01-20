# Web Kripto Steganografi Sertifikat

## Deskripsi Proyek

Aplikasi web untuk manajemen sertifikat digital yang mengintegrasikan teknologi kriptografi dan steganografi. Sistem ini memungkinkan pengguna untuk menyimpan, mentransfer, dan memverifikasi kepemilikan sertifikat dengan keamanan tinggi melalui penyembunyian data dalam gambar.

## Fitur Utama

- **Autentikasi Pengguna**: Sistem login dan registrasi untuk pengguna dan admin
- **Manajemen Sertifikat**: Upload, edit, transfer, dan penghapusan sertifikat
- **Steganografi**: Penyembunyian data sertifikat dalam gambar menggunakan algoritma steganografi
- **Verifikasi Kepemilikan**: Sistem verifikasi untuk memastikan keaslian sertifikat
- **Dashboard Admin**: Panel admin untuk mengelola pengguna, sertifikat, dan persetujuan transfer
- **Riwayat Kepemilikan**: Timeline kepemilikan sertifikat
- **Notifikasi**: Sistem notifikasi untuk aktivitas penting

## Teknologi yang Digunakan

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (dengan Prisma)
- **Storage**: Supabase untuk file uploads
- **Steganografi**: Python dengan library PIL/Pillow
- **UI Components**: Shadcn/ui
- **Authentication**: Custom auth dengan session

## Instalasi

### Prasyarat

- Node.js 18+
- Python 3.8+
- PostgreSQL
- Supabase account (untuk storage)

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd web-kripto-steganografi-sertifikat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   - Buat database PostgreSQL
   - Copy `.env.example` ke `.env` dan isi konfigurasi database
   - Jalankan migrasi Prisma:
     ```bash
     npx prisma migrate dev
     ```
   - Seed database (opsional):
     ```bash
     npx prisma db seed
     ```

4. **Setup Supabase**
   - Buat project di Supabase
   - Konfigurasi bucket untuk uploads
   - Update environment variables untuk Supabase

5. **Install Python dependencies untuk steganografi**
   ```bash
   pip install pillow
   ```

6. **Jalankan aplikasi**
   ```bash
   npm run dev
   ```

Aplikasi akan berjalan di `http://localhost:3000`

## Penggunaan

### Untuk Pengguna Biasa

1. **Registrasi/Login**: Buat akun atau login ke sistem
2. **Upload Sertifikat**: Upload sertifikat dan gambar untuk embedding
3. **Transfer Sertifikat**: Transfer kepemilikan sertifikat ke pengguna lain
4. **Verifikasi**: Verifikasi kepemilikan sertifikat melalui halaman verifikasi

### Untuk Admin

1. **Login Admin**: Akses panel admin
2. **Kelola Pengguna**: Lihat dan kelola data pengguna
3. **Persetujuan Transfer**: Approve atau reject permintaan transfer sertifikat
4. **Monitoring**: Lihat riwayat aktivitas sistem

## Struktur Proyek

```
web-kripto-steganografi-sertifikat/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   ├── lib/                 # Utilities dan konfigurasi
│   └── middleware.ts        # Middleware Next.js
├── prisma/                  # Database schema dan seed
├── public/                  # Static assets
├── scripts/                 # Utility scripts
└── gambar/                  # Sample images
```

## Scripts yang Tersedia

- `npm run dev`: Jalankan development server
- `npm run build`: Build untuk production
- `npm run start`: Jalankan production server
- `npm run lint`: Jalankan ESLint

## Kontribusi

1. Fork repository
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Proyek ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.

## Kontak

Untuk pertanyaan atau dukungan, silakan buat issue di repository ini.