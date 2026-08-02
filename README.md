# Omar Sharif Photography Portfolio

Static portfolio prepared for GitHub Pages. It includes category filters, a keyboard-accessible lightbox, responsive layouts, a booking/contact page, social links, visible watermark overlays, disabled image dragging/right-click, copyright notices, and a local image-preparation workflow.

## Personalize the site

Edit `assets/js/site-config.js` and replace:
- email address
- Instagram/Facebook/YouTube links
- photographer name, watermark, and biography if needed

## Add photographs safely

1. Keep original, full-resolution photographs outside the repository or place them in `originals-private/<category>/`. The `.gitignore` prevents this folder from being uploaded.
2. Install Pillow: `python -m pip install Pillow`
3. Run `python tools/prepare_images.py`. It creates reduced JPEG copies, strips inherited metadata, adds copyright/artist metadata, and bakes in a subtle visible watermark.
4. Add each web copy to `assets/js/gallery-data.js` using the examples already there.
5. Commit only the `images/` web copies—not the originals.

Recommended web image size: no more than 2,000 pixels on the longest edge and usually under 1 MB.

## Deploy to GitHub Pages

1. Create a new public GitHub repository.
2. Upload the contents of this folder so `index.html` is in the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.

Your site will appear at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

## Important limitation

Browser protections discourage casual copying but cannot prevent screenshots or determined downloads. Protect originals by publishing only reduced-resolution, watermarked copies.
