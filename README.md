# GHOST-MD Pair Portal (Secure + Free Deploy)

Pairing logic same. Source + backend URLs protected.

---

## Best FREE options (Render nahi)

### 1) Koyeb (recommended — free forever tier)

1. Open → https://www.koyeb.com  
2. GitHub se login  
3. **Create App → Deploy from GitHub**  
4. Repo select karo  
5. Settings:
   - **Builder:** Buildpack / Node
   - **Run command:** `node index.js`
   - **Port:** `3000` (ya jo auto detect kare)
6. Deploy

Link milega: `https://your-app-xxxxx.koyeb.app`

---

### 2) Railway (bahut asaan)

1. Open → https://railway.app  
2. GitHub login  
3. **New Project → Deploy from GitHub repo**  
4. Repo select  
5. Automatically detect ho jayega (`npm start`)  
6. Deploy

Link: `https://xxxx.up.railway.app`

Pehle 30 din ~$5 free credit milta hai.

---

### 3) Northflank (free, almost always-on)

1. https://northflank.com  
2. GitHub connect  
3. New service → Node  
4. Start command: `node index.js`

---

## Security (already applied)

- Backend Heroku URLs browser ko **kabhi nahi** milte
- `index.js` / source files public nahi hain
- Sirf website HTML serve hoti hai
- Extra security headers on

---

## Local test

```bash
npm install
npm start
```

http://localhost:3000

---

## WhatsApp ke liye

`koyeb.app` / `up.railway.app` domains `vercel.app` se **kaafi safe** hain.
