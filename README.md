# Zipsnap — setup & install guide

Snap a business card or a branded commercial vehicle → Zipsnap reads the details with AI → you review/edit → it creates a **Vendor** in JobTread. Works as an installable web app (PWA) on Android.

## Files in this folder
- `index.html` — the whole app
- `manifest.webmanifest` — makes it installable
- `service-worker.js` — lets it open offline / be installed
- `icons/` — app icons
- `jobtread-proxy-worker.js` — optional, only if you hit a CORS error (see step 5)

---

## Step 1 — Host it free on GitHub Pages (one time, ~5 min)

A PWA must be served over **https**. GitHub Pages does this for free and permanently. Use a **new repo just for Zipsnap**:

1. Go to https://github.com/new. Name it `zipsnap`, set it **Public** (safe — no keys are in the code), and click **Create repository**.
2. On the new repo page, click **uploading an existing file**.
3. Drag in `index.html`, `manifest.webmanifest`, `service-worker.js`, and the **`icons` folder** (drag the folder so its 3 PNGs stay inside). The README and proxy file are optional.
4. Click **Commit changes**.
5. Go to the repo's **Settings → Pages**. Under "Build and deployment", set **Source = Deploy from a branch**, **Branch = main**, folder **/ (root)**, then **Save**.
6. Wait ~1 minute. The page shows your live link: `https://YOURNAME.github.io/zipsnap/`. That's the link you install and share.

> Keep the structure intact — `index.html` at the top level, `icons/` as a subfolder.

**To update the app later:** in the repo, click `index.html` → the pencil ✎ → paste the new version → Commit. Pages redeploys automatically in about a minute. (On phones, fully close and reopen Zipsnap to pull the update.)

## Step 2 — Get your two keys

**JobTread Grant Key** (starts with `grant_`)
- In JobTread, create/copy a Grant Key with permission to manage vendors. It's shown **only once** — copy it then.
- **Organization ID**: look at your JobTread web address — `app.jobtread.com/organizations/THIS-PART`.

**AI Vision Key** (OpenAI, starts with `sk-`)
- Create one at https://platform.openai.com/api-keys.
- You must add a little billing credit first (Settings → Billing → add ~$5); new keys start at $0 and will return a "quota exceeded" error until you do.
- Default model `gpt-4o-mini` is cheap (well under a cent per scan) and reads signage well.
- **Saved-key switcher:** Settings lets you store several keys with labels (e.g. "Business", "Personal") and pick the **Active key** before scanning. Note this is an OpenAI API key, not a ChatGPT account login — the two are separate. For a team, the simplest setup is one shared key pasted on each phone, billed to one account.

## Step 3 — Install on your phone

1. Open your app link in **Chrome on Android**.
2. Tap the **⋮** menu → **Add to Home screen** / **Install app**.
3. Open Zipsnap from the new icon. Tap **⚙ Settings**, paste your keys + Organization ID, **Save**.
4. Tap **Settings → Run test** to confirm it reaches your JobTread org.

## Step 4 — Share with coworkers

Send them the same link. Each person installs it the same way and enters **their own** keys in Settings (keys are stored only on their phone, never shared). No cable, no app store, no "unknown sources" warning.

## Step 5 — Only if saving fails with a CORS / network error

Browsers sometimes block direct calls to JobTread's API. If the test or a save shows a CORS/network error:
1. Go to https://workers.cloudflare.com (free), create a Worker.
2. Paste the contents of `jobtread-proxy-worker.js`, deploy.
3. Copy the Worker URL into Zipsnap → **Settings → Proxy URL**, Save.
4. Re-run the test. (The AI/OpenAI call doesn't need this — only JobTread might.)

---

## How it works day to day
- **Scan tab** — take a photo or choose one. Turn on **Batch mode** to keep scanning several in a row.
- **Review** — fix any field; **Company name** is required. A ⚠️ banner appears if a vendor with that name already exists.
- **Save** — creates the vendor in JobTread. Offline? It drops into the **Queue** and uploads automatically when you're back online.
- **Queue tab** — see/retry/delete anything waiting to sync.

## Known v1 notes (easy to refine once tested on your account)
- **Vendor creation** uses JobTread's confirmed `createAccount` (name + type `vendor`). The contact name, phone, email, website, address, trade and notes are written into a **comment** on the vendor so nothing is lost. Mapping each of those to JobTread's native contact fields / custom fields is a quick v1.1 tweak once we see a real save — send me one result and I'll wire the exact field names.
- **Photo attach**: JobTread's file-upload step needs to be verified against your account; v1 keeps the photo with the record and in the queue. Tell me to finalize this and I'll add the upload call.
- Keys live in the browser's local storage on each phone. Anyone with the phone unlocked can open Settings — treat the grant key like a password.
