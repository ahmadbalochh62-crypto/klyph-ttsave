# Klyph (TTSave ke liye tayyar copy) — Vercel par deploy karne ke steps

Ye copy Klyph ki hai jisme aik chhoti si tabdeeli ki gayi hai taake
ttsave.world ki website is API ko bula sake (CORS fix sirf
https://ttsave.world ke liye). TikTok wala hissa TikWM service se
chalta hai, is liye Vercel par koi extra setting nahi chahiye.

## Step 1 — GitHub par repo banayein
1. github.com par login karein (account nahi hai to pehle bana lein).
2. Upar dayein taraf "+" → "New repository".
3. Naam dein: `klyph` — Public rakhein — "Create repository".
4. "uploading an existing file" par click karke is folder ki SAARI
   files aur folders upload karein (node_modules nahi hai, fikar na karein).
5. "Commit changes" dabayein.

## Step 2 — Vercel par deploy karein
1. vercel.com par login karein — "Continue with GitHub" wala option
   lein taake GitHub khud connect ho jaye.
2. "Add New..." → "Project".
3. Apna `klyph` repo "Import" karein.
4. Koi setting NA badlein — Framework khud "Next.js" ayega,
   koi Environment Variable nahi chahiye.
5. "Deploy" dabayein. 1–3 minute mein tayyar ho jayega.

## Step 3 — Link Muse ko bhej dein
Deploy ke baad jo link milega, jaisay:
    https://klyph-xxxx.vercel.app
wo link Muse ko bhej dein. Muse usi ko ttsave.world ke download
button se jor dega — phir download box sach mein kaam karega.

## UPDATE 2026-11-16 — Download fast karne ke liye (redeploy zaroori)
Download ~40 second le raha tha. Wajah: API ka server US (iad1) mein
tha aur TikWM ka jawab wahin se slow aa raha tha (TikWM khud ~15
second leta hai). Do tabdeeliyan ki gayi hain (build test ho chuka hai):
1. `vercel.json` (naya): `/api/fetch` Singapore region (`sin1`) par
   chalega — TikWM ke zyada qareeb, jawab jaldi aane ki umeed hai.
2. `src/app/api/fetch/route.ts`: same video link dobara aaye to
   10 minute tak cache se foran jawab milega (dobara TikWM nahi).
Redeploy: Vercel CLI se is folder mein `vercel --prod` chalayein
(ya GitHub repo update karke Vercel se redeploy karein). URL wohi
rahega: https://klyph-ttsave.vercel.app — deploy ke baad Muse ko
batayein, wo dobara speed test karke batayega kitna fast hua.

Note: Is app ke YouTube / Instagram / Facebook wale hisse kuch extra
cheezon (Python, FFmpeg) ke baghair Vercel par nahi chalenge, lekin
TTSave ko sirf TikTok chahiye aur woh bilkul chalega.
