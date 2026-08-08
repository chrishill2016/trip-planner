# Trip Planner

A small offline-first web app for planning a trip day by day. Installs to an Android
home screen like a native app. All data stays on the device — nothing is sent anywhere.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The whole app — markup, styles, logic |
| `manifest.webmanifest` | Tells Android the name, icon and that it's installable |
| `sw.js` | Service worker — makes it work offline |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | App icons |

All paths are relative, so it works from a subfolder like `username.github.io/trip-planner/`.

## Putting it on GitHub Pages

1. Go to **github.com/new**. Name the repo `trip-planner`. Set it to **Public**
   (Pages needs public on a free account). Don't tick "Add a README". Create it.
2. On the empty repo page, click **uploading an existing file**.
3. Drag in all six files above. Commit.
4. Go to **Settings → Pages**. Under *Source* pick **Deploy from a branch**,
   branch `main`, folder `/ (root)`. Save.
5. Wait 1–2 minutes. Your app is at:
   `https://YOUR-USERNAME.github.io/trip-planner/`

## Installing on Android

1. Open that URL in **Chrome** on your phone.
2. Chrome shows an *Install app* prompt, or use menu **⋮ → Add to Home screen → Install**.
3. It gets its own icon and opens without the browser bar.

If the Install option doesn't appear, the page isn't on HTTPS or the service worker
hasn't registered — reload once and try again.

## Notes

- **Storage is per device.** Two phones each keep their own copy. Use
  *Share plan → Export* to save a `.json` file and *Import* it on the other phone.
- **Updating.** Edit the file on GitHub and commit; the app picks up the new version
  next time it's opened online.
- **Offline.** After the first load everything works with no signal. Fonts fall back
  to the system stack if they haven't been cached yet.
