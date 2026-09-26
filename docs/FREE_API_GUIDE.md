# 🎉 Panduan Lengkap: Mendapatkan API Gratis untuk Semua AI Provider

Dokumentasi ini menjelaskan cara mendapatkan API key gratis dari setiap AI provider yang didukung oleh AI Provider Switcher.

---

## 📋 Daftar Isi

1. [Google Gemini (Gratis)](#google-gemini-gratis)
2. [Claude (Gratis)](#claude-gratis)
3. [GPT (Gratis dengan Kredit)](#gpt-gratis-dengan-kredit)
4. [Deepseek (Gratis)](#deepseek-gratis)
5. [Grok (Gratis)](#grok-gratis)
6. [Ollama (Gratis Lokal)](#ollama-gratis-lokal)
7. [Tips & Trik](#tips--trik)

---

## 🔵 Google Gemini (Gratis)

**Status**: ✅ **Gratis Selamanya** (dengan batasan)

### Langkah-langkah:

1. **Buka halaman Google AI**
   - Kunjungi: https://ai.google.dev/tutorials/setup

2. **Klik "Get API Key"**
   - Atau langsung ke: https://aistudio.google.com/apikey

3. **Pilih Project atau Buat Baru**
   - Jika sudah punya Google Account, akan otomatis membuat project
   - Atau buat project baru di Google Cloud Console

4. **Copy API Key**
   - Klik "Copy" pada API key yang muncul
   - Simpan di tempat aman

5. **Paste di AI Provider Switcher**
   - Buka aplikasi
   - Klik "Add Provider"
   - Provider ID: `gemini`
   - Paste API key Anda
   - Klik "Add"

### Batas Gratis:
- **60 permintaan per menit**
- **1500 permintaan per hari**
- Model: `gemini-2.0-flash`, `gemini-1.5-pro`
- Cukup untuk testing dan penggunaan personal

### Dokumentasi:
- https://ai.google.dev/documentation
- https://ai.google.dev/models/gemini2-flash

---

## 🤖 Claude (Gratis)

**Status**: ✅ **Gratis dengan Kredit Trial** ($5 pertama kali)

### Langkah-langkah:

1. **Buka Anthropic Console**
   - Kunjungi: https://console.anthropic.com/

2. **Sign Up / Login**
   - Gunakan email atau sign in dengan Google/GitHub
   - Verifikasi email Anda

3. **Ke Menu "API Keys"**
   - Klik sidebar: "API Keys" atau Settings → API keys

4. **Generate Baru API Key**
   - Klik "Create Key"
   - Berikan nama (contoh: "ai-switcher")
   - Klik "Generate"
   - **Jangan tutup halaman ini** - copy API key sekarang!

5. **Paste di AI Provider Switcher**
   - Provider ID: `claude`
   - Paste API key Anda
   - Model bisa gunakan: `claude-3-5-sonnet` atau `claude-3-opus`

### Kredit Gratis:
- **$5 kredit trial** untuk 3 bulan pertama
- Sesudahnya bisa pakai model yang lebih murah
- Pricing: https://www.anthropic.com/pricing

### Dokumentasi:
- https://docs.anthropic.com/
- https://docs.anthropic.com/en/api/getting-started

---

## 🟢 GPT / OpenAI (Gratis dengan Kredit)

**Status**: ✅ **Gratis dengan Kredit Trial** ($5)

### Langkah-langkah:

1. **Buka OpenAI Platform**
   - Kunjungi: https://platform.openai.com/

2. **Sign Up / Login**
   - Buat akun dengan email atau Sign in
   - Verifikasi nomor telepon (diperlukan)
   - **Penting**: Verifikasi dengan kartu kredit untuk mendapat trial credit

3. **Ke API Keys**
   - Klik profile icon → "API Keys"
   - Atau langsung ke: https://platform.openai.com/api-keys

4. **Create New Secret Key**
   - Klik "Create new secret key"
   - Nama: "ai-switcher"
   - Copy dan simpan (hanya muncul sekali!)

5. **Paste di AI Provider Switcher**
   - Provider ID: `gpt` atau `openai`
   - Paste API key Anda
   - Model: `gpt-4-turbo` atau `gpt-3.5-turbo` (lebih murah)

### Kredit Gratis:
- **$5 untuk 3 bulan pertama**
- Cukup untuk testing
- Pricing: https://openai.com/pricing

### Tips Hemat:
- Gunakan `gpt-3.5-turbo` daripada `gpt-4` untuk menghemat biaya
- Batasi token output dengan `max_tokens`
- Monitor penggunaan di dashboard

### Dokumentasi:
- https://platform.openai.com/docs/api-reference

---

## 🟣 Deepseek (Gratis)

**Status**: ✅ **Gratis Selamanya** (dengan batasan)

### Langkah-langkah:

1. **Buka Deepseek Platform**
   - Kunjungi: https://api.deepseek.com/

2. **Sign Up**
   - Klik "Sign Up" di kanan atas
   - Gunakan email atau Social Login
   - Verifikasi email

3. **Ke API Keys**
   - Login ke: https://api.deepseek.com/login
   - Klik menu: "API Keys" atau Settings
   - Atau langsung: https://api.deepseek.com/panel/api-keys

4. **Create New Key**
   - Klik "Create API Key"
   - Berikan nama
   - Copy key Anda

5. **Paste di AI Provider Switcher**
   - Provider ID: `deepseek`
   - Paste API key Anda
   - Model: `deepseek-chat`

### Batas Gratis:
- **Gratis dengan token gratis awal**
- Model efisien: `deepseek-chat`
- Pricing sangat murah dibanding kompetitor

### Keuntungan:
- ✅ Response time cepat
- ✅ Model reasoning yang bagus
- ✅ Harga paling murah

### Dokumentasi:
- https://api.deepseek.com/docs

---

## 🟡 Grok / xAI (Gratis dengan Kredit)

**Status**: ✅ **Gratis dengan Trial Credit**

### Langkah-langkah:

1. **Buka xAI Console**
   - Kunjungi: https://api.x.ai/

2. **Sign In dengan X Account**
   - Login dengan akun X (Twitter)
   - Atau buat akun baru

3. **Navigate ke API Keys**
   - Klik "Console" atau "API" di menu
   - Pilih "API Keys"

4. **Create New API Key**
   - Klik "Create Key" atau "Generate"
   - Copy API key Anda

5. **Paste di AI Provider Switcher**
   - Provider ID: `grok`
   - Paste API key Anda
   - Model: `grok-beta` atau `grok-3`

### Kredit Gratis:
- Trial credit tersedia untuk pengguna baru
- Cek dashboard untuk sisa kredit
- Model Grok terkenal dengan kemampuan reasoning

### Dokumentasi:
- https://api.x.ai/documentation

---

## 🏠 Ollama (Gratis Lokal - TIDAK PERLU INTERNET)

**Status**: ✅ **100% Gratis - Berjalan di Komputer Anda**

### Keuntungan Ollama:
- ✅ **Benar-benar gratis** (tidak ada biaya)
- ✅ **Privasi penuh** (data tidak dikirim ke server)
- ✅ **Offline** (tidak perlu internet)
- ✅ **Cepat** (berjalan di GPU Anda)
- ✅ Model open-source berkualitas tinggi

### Langkah-langkah:

#### 1. **Download & Install Ollama**
   - Windows/Mac: https://ollama.ai
   - Linux: 
     ```bash
     curl https://ollama.ai/install.sh | sh
     ```

#### 2. **Jalankan Ollama Service**
   ```bash
   # Secara otomatis jika sudah install di Mac/Windows
   # Atau di terminal Linux:
   ollama serve
   ```

#### 3. **Pull Model (Download Model)**
   ```bash
   # Download model - pilih salah satu:
   
   # Ringan & Cepat (cocok untuk PC biasa):
   ollama pull llama2        # 3.8GB
   ollama pull mistral       # 4.1GB
   ollama pull neural-chat   # 4.1GB
   
   # Lebih Powerful (butuh GPU/RAM banyak):
   ollama pull llama2-uncensored   # 7GB
   ollama pull wizard-vicuna        # 7.3GB
   ollama pull neural-chat:13b      # 7.3GB
   ```

#### 4. **Verifikasi Ollama Berjalan**
   ```bash
   # Di terminal baru, test API:
   curl http://localhost:11434/api/tags
   ```

#### 5. **Konfigurasi di AI Provider Switcher**
   - Provider ID: `ollama`
   - API URL: `http://localhost:11434/v1`
   - Model: `llama2` (atau model yang Anda download)
   - Tidak perlu API Key (biarkan kosong)
   - Klik "Add"

### Model Ollama Populer (Gratis):

| Model | Ukuran | Kecepatan | Kualitas | Kegunaan |
|-------|--------|-----------|----------|----------|
| **llama2** | 3.8GB | ⚡⚡⚡ | ⭐⭐⭐ | Balanced, general purpose |
| **mistral** | 4.1GB | ⚡⚡⚡ | ⭐⭐⭐⭐ | Lebih smart, instruction-following |
| **neural-chat** | 4.1GB | ⚡⚡⚡ | ⭐⭐⭐⭐ | Bagus untuk chat |
| **dolphin-mixtral** | 26GB | ⚡ | ⭐⭐⭐⭐⭐ | Sangat powerful (butuh GPU) |
| **openchat** | 3.5GB | ⚡⚡⚡ | ⭐⭐⭐⭐ | Fast & good |

### Troubleshooting Ollama:

**Masalah**: "Connection refused" pada http://localhost:11434
```bash
# Solusi: Pastikan Ollama service berjalan
# Windows/Mac: Aplikasi Ollama harus terbuka
# Linux: Jalankan: ollama serve
```

**Masalah**: Model tidak bisa didownload (storage penuh)
```bash
# Cek storage Ollama:
ollama list

# Hapus model lama:
ollama rm llama2
```

**Masalah**: Response lambat
```bash
# Gunakan model yang lebih kecil:
ollama pull mistral
# atau
ollama pull neural-chat
```

### Dokumentasi Ollama:
- https://ollama.ai
- https://github.com/jmorganca/ollama
- Model Library: https://ollama.ai/library

---

## 💡 Tips & Trik

### 1. **Strategi Kombinasi Provider**
```
Untuk Development/Testing:
- Gunakan Ollama (gratis, unlimited, offline)
- Backup: Gemini (gratis, online)

Untuk Produktif:
- Gemini untuk query cepat (gratis banyak limit)
- Claude/GPT untuk tugas kompleks (pakai kredit trial)
- Deepseek untuk hemat budget (paling murah)
- Grok untuk hal spesifik
```

### 2. **Maximize Kredit Gratis**
- **OpenAI**: $5 gratis → gunakan untuk testing saja
- **Claude**: $5 gratis → gunakan untuk tugas penting
- **Gemini**: Unlimited gratis dengan rate limit
- **Deepseek**: Harga termurah untuk jangka panjang

### 3. **Monitoring & Tracking**
Setiap provider memiliki dashboard:
- **OpenAI**: https://platform.openai.com/account/billing/overview
- **Claude**: https://console.anthropic.com/account
- **Gemini**: https://ai.google.dev/usage
- **Deepseek**: https://api.deepseek.com/panel/usage

### 4. **Best Practices**
- ✅ Simpan API key di `.env` file (jangan commit!)
- ✅ Rotate API keys secara berkala
- ✅ Monitor penggunaan untuk hindari biaya tiba-tiba
- ✅ Gunakan rate limiting untuk produksi
- ✅ Test dengan model kecil dulu

### 5. **Jika Kehabisan Kredit Gratis**
1. **Gunakan Ollama** - 100% gratis, tidak ada biaya apapun
2. **Switch ke Gemini** - gratis dengan rate limit
3. **Deepseek** - termurah untuk produksi
4. **Tunggu bulan baru** - kredit gratis bisa reset

---

## 🚀 Quick Start Checklist

- [ ] Install Ollama untuk gratis unlimited
- [ ] Daftar Google Gemini untuk gratis online
- [ ] Daftar Claude untuk $5 trial (pilihan)
- [ ] Daftar OpenAI untuk $5 trial (pilihan)
- [ ] Daftar Deepseek untuk budget murah
- [ ] Daftar Grok untuk alternative
- [ ] Tambahkan semua ke AI Provider Switcher
- [ ] Test setiap provider
- [ ] Simpan API keys dengan aman

---

## ❓ FAQ

**Q: API mana yang benar-benar gratis tanpa syarat?**
A: 
- ✅ Gemini (dengan rate limit)
- ✅ Ollama (di komputer Anda sendiri)

**Q: Mana yang paling murah untuk produksi?**
A: Deepseek - harganya ~95% lebih murah dari OpenAI

**Q: Bisa ganti provider di tengah conversation?**
A: Ya! Klik provider lain, semua history tetap tersimpan

**Q: Apakah API key aman?**
A: Di app ini aman - semua tersimpan lokal di browser Anda

**Q: Bisa offline?**
A: Ya, dengan Ollama - 100% offline, tidak perlu internet

**Q: Berapa lama trial credit berlaku?**
A: OpenAI/Claude: 3 bulan dari tanggal sign up

---

## 📞 Support

Jika ada masalah:
1. Baca ulang dokumentasi provider resmi
2. Cek apakah API key sudah di-copy dengan benar
3. Verifikasi internet connection
4. Check rate limits di dashboard provider
5. Buka issue di GitHub: https://github.com/andrytambak-max/ai-provider-switcher-web/issues

---

**Made with ❤️ - Terakhir diupdate: 2026**
