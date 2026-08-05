darkimages.com
================

Standalone static landing page that uses the three-witch artwork as the full-page visual background and places three animated logo portals in front of it.

WHAT CHANGED
------------
- Background image now uses a contained fit so the faces are smaller and no longer heavily cropped.
- The three portal logos were rebuilt to follow the original hero logo animation styles from:
  - PaulBooth.ai
  - PaulBoothArt.com
  - PaulBoothBrand.com

FILES
-----
- index.html
- styles.css
- script.js
- README.txt
- assets/witches-bg.png
- assets/pb-brand-monogram-cutout.png

NOTES
-----
- The PaulBooth.ai and PaulBoothArt.com logo images are loaded from their site asset URLs so the page can use the official live logo images.
- The PaulBoothBrand.com emblem is included locally in /assets.
- No build step is required.

QUICK LOCAL PREVIEW
-------------------
From this folder run:
  python -m http.server 8080
Then open:
  http://localhost:8080

LATEST UPDATE
-------------
- All three logos now sit inside 3D glass spheres.
- All orbiting orbs / orbital elements were removed from all three logos.

- The background artwork now also sits inside a large 3D glass sphere.

- The large background glass sphere now moves with desktop mouse movement using smooth parallax and 3D tilt.

- Inner-sphere shadows were substantially deepened on all four spheres.
