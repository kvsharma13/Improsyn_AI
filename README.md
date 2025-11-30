# Improsyn AI - Production Ready

## ✅ Features

- Email OTP verification (console-based)
- NO email domain restrictions - accepts ANY email
- Supabase authentication
- Protected voice agent page
- Production-ready code

## ⚡ Quick Setup (10 Minutes)

### 1. Supabase
1. Create project at https://supabase.com
2. Run `supabase-setup.sql` in SQL Editor
3. Get API credentials (Settings → API)

### 2. Configure
Rename `.env.local.example` to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
JWT_SECRET=(generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
NEXT_PUBLIC_LIVEKIT_BOT_URL=https://improsyn-5syt4v.sandbox.livekit.io
```

### 3. Run
```bash
npm install
npm run dev
```

## 📧 How OTP Works

1. User signs up with ANY email
2. OTP appears in terminal console
3. Give OTP to user
4. User enters OTP → Verified!

## ✅ Ready to Deploy

- No email service needed
- Works with any email domain
- FREE forever
- Production-ready

Open http://localhost:3000
