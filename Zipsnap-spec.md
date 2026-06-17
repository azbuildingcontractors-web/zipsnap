# Zipsnap — Build Specification

**What it does:** Take a photo of a business card or a branded commercial vehicle. Zipsnap reads the contact/company info from the image and creates a **Vendor** in JobTread, with the photo attached.

**Platform:** Installable Progressive Web App (PWA) for Android. Coworkers open a link in Chrome and tap "Install" — no cable, no sideloading warnings, no app store.

---

## How it works (flow)

1. **Capture** — Open Zipsnap, tap the camera, photograph a business card or vehicle signage.
2. **Extract** — A cloud AI reads the image and pulls out the fields.
3. **Review** — An editable form shows the extracted values so you can fix anything before saving.
4. **Duplicate check** — If a vendor with a matching name/phone already exists in JobTread, Zipsnap warns you and lets you choose (create new, or open existing).
5. **Save** — On confirm, Zipsnap creates the vendor in JobTread and attaches the original photo.
6. **Offline** — No signal? The scan is queued on the phone and auto-syncs to JobTread when back online.

---

## Decisions (from scoping)

| # | Topic | Decision |
|---|-------|----------|
| 1 | Text extraction | **Cloud AI** (more accurate on messy vehicle signage; needs internet) |
| 2 | Before saving | **Review/edit screen first** — never auto-create blind |
| 3 | JobTread connection | **Direct API** using your **grant key** |
| 4 | Fields captured | Company name *(required)*, contact name, phone, email, website, address, trade/category, notes |
| 5 | Duplicates | **Warn** and let you choose |
| 6 | Categorization | **AI guesses the trade**, you confirm via dropdown |
| 7 | Photo | **Attach original photo** to the vendor record |
| 8 | Batch mode | **One-at-a-time** in v1, with a **batch option** to snap several in a row |
| 9 | Offline | **Queue and auto-sync** when back online |
| 10 | Install | **PWA** — shareable link, self-install |

---

## JobTread integration

- **Endpoint:** `POST https://api.jobtread.com/pave`
- **Auth:** Grant key (you generate it in your JobTread account; pasted once into Zipsnap's Settings and stored on the device).
- **Capabilities confirmed:** the Pave API creates and manages vendors and vendor contacts, and attaches documents/photos — covering everything above.

## What you'll need to supply

1. **JobTread grant key** — for creating vendors.
2. **A cloud AI key** for the image-reading step (e.g., an OpenAI vision key or Google Vision key). Pasted into Settings once.

Both keys live in the app's Settings screen on each phone; no server of your own required.

---

## Suggested build order

- **v1:** Single-card capture → AI extract → review form → create JobTread vendor + attach photo → Settings screen for keys → installable PWA.
- **v1.1:** Duplicate-warning check against existing vendors.
- **v1.2:** Offline queue + auto-sync.
- **v1.3:** Batch mode (snap several, review as a list).

---

## Open items / notes

- **Vehicle signage** is unstructured (phone might be huge, no email, trade implied by truck wrap). The cloud-AI approach handles this far better than basic on-device OCR — that's why it was chosen.
- **Cost:** cloud AI is a few cents per scan at most; JobTread API use is included with your account.
- **Privacy:** images are sent to the AI provider for reading. Fine for business cards/trucks; worth knowing.
