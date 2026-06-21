# Habit Tracker — Rencana Pembangunan

Catatan: Project ini menggunakan **TanStack Start** (bukan Next.js) sesuai template Lovable. Backend akan memakai **Lovable Cloud** (Postgres + Auth + Realtime), bukan MySQL — semua skema tabel akan dipetakan setara.

## Bahasa & Tema
- Seluruh UI dalam Bahasa Indonesia.
- Palet: `#1E2A4A` biru tua, `#4A235A` ungu tua, `#0B0C10` hitam, dengan gradasi premium.
- Dark mode (default) + Light mode, toggle di header.
- Font modern (Inter), border tipis, layout compact ala spreadsheet.

## Backend (Lovable Cloud)
Tabel:
- `profiles` (id=auth.uid, nama, email) + trigger auto-create.
- `habits` (id, user_id, nama, ikon emoji, warna hex, target int, created_at).
- `habit_logs` (id, habit_id, user_id, tanggal date, status bool, unique (habit_id, tanggal)).
- `moods` (id, user_id, tanggal date unique per user, mood 1-10, motivasi 1-10).
- RLS: tiap user hanya akses datanya sendiri.
- Realtime: subscribe `habit_logs`, `habits`, `moods`.

Auth: Email/Password + Google (via Lovable broker).

## Routing (TanStack Start)
- `/login`, `/register`, `/reset-password` — publik.
- `/_authenticated` — layout terlindungi.
  - `/` — Dashboard utama.
  - `/habits` — Pengaturan Habit (tambah/edit/hapus, pilih emoji & warna, target).
  - `/analisis` — opsional ringkasan lengkap (panel ringkas tetap ada di dashboard).

## Dashboard Layout
```
┌─────────────┬──────────────────────────────────────────────┐
│  Sidebar    │  Header (bulan, tahun, toggle tema, export)  │
│  - Logo     ├──────────────────────────────────────────────┤
│  - Bulan    │  Stat cards: Daily | Weekly | Goal | Done |  │
│  - Tahun    │              Left  | Overall % (circle)      │
│  - Navigasi ├───────────────────────────────────┬──────────┤
│             │  Tabel habit × tanggal 1..N       │ Analysis │
│             │  (checkbox grid, sticky col/row)  │  table   │
│             ├───────────────────────────────────┴──────────┤
│             │  Mental State: Mood + Motivasi (1–10 + chart)│
└─────────────┴──────────────────────────────────────────────┘
```

## Fitur Inti
1. **Tabel checklist spreadsheet**: kolom kiri sticky nama habit + emoji, kolom atas tanggal 1..jumlah hari bulan aktif, klik checkbox = upsert ke `habit_logs`, optimistic update + realtime sync.
2. **Statistik realtime** dari React Query + Supabase subscriptions:
   - Daily Progress (bar chart per hari bulan ini, recharts).
   - Weekly Progress (4-5 minggu bulan ini).
   - Goal / Completed / Left / Overall % (circle).
3. **Panel Analisis kanan**: tabel per habit `Target | Aktual | Sisa | Progress bar` dengan animasi.
4. **Mental State**: slider 1–10 mood & motivasi disimpan per tanggal, line chart kecil tren bulan.
5. **Filter bulan**: pilih bulan/tahun di sidebar, semua data refetch.
6. **Export PDF**: tombol export → html2canvas+jsPDF snapshot dashboard.
7. **Pengaturan Habit** (`/habits`): list, form tambah (nama, emoji picker sederhana, warna swatch, target bulanan), edit inline, hapus dengan konfirmasi.

## Komponen Baru
- `AppSidebar`, `MonthPicker`, `StatCards`, `DailyChart`, `WeeklyChart`, `OverallCircle`
- `HabitGrid` (tabel checklist), `AnalysisPanel`, `MentalState`
- `HabitFormDialog`, `HabitList` (di halaman pengaturan)
- `ThemeProvider` (light/dark via class on html)
- Server functions: `habits.functions.ts`, `habit-logs.functions.ts`, `moods.functions.ts`

## Detail Teknis
- React Query untuk caching + invalidate saat realtime event masuk.
- `supabase.channel().on('postgres_changes', ...)` per tabel, hanya filter `user_id=eq.<uid>`.
- Tabel checklist pakai CSS grid agar header sticky & scroll horizontal mulus.
- Recharts untuk bar & line.
- Sonner untuk toast feedback.

## Yang TIDAK dibangun di versi pertama
- Login Apple (hanya Email + Google).
- Export PDF multi-halaman canggih (cukup snapshot dashboard ke satu PDF).

Setelah persetujuan, saya akan: aktifkan Lovable Cloud, buat skema + RLS + trigger, lalu bangun seluruh UI & logika.
