# EmilyHsiang.com Internal Plan

Last reviewed: 2026-06-29

## Current Status

### Live domains

- `https://emilyhsiang.com` currently returns a `301` redirect to `https://jenchunhsiang.com`.
- `https://www.emilyhsiang.com` also returns a `301` redirect to `https://jenchunhsiang.com`.
- `https://jenchunhsiang.com` currently returns `200` and is served by GitHub Pages.
- `https://www.jenchunhsiang.com` redirects to `https://jenchunhsiang.com`.

This confirms that the long-standing authority path still points from EmilyHsiang.com to JenChunHsiang.com. Do not reverse that flow. The safer launch path is to stop the EmilyHsiang.com redirect only when the new site is ready to stand on its own, while keeping JenChunHsiang.com as the academic archive.

### Local site

- The repo is a minimal static website with `index.html`, `blog.html`, `style.css`, and `script.js`.
- The current page already positions Emily as:
  - `Emily Hsiang, PhD`
  - co-founder at Semiqlassical
  - neuroscience PhD with computational neuroscience training
  - a builder focused on data, modeling, ML systems, decision-making, and human-inspectable research workflows
- The site includes strong human-readable content: Now, About Me, and Selected Publications.
- The site includes Attryx as the first Semiqlassical product.
- The site includes a visible academic archive bridge to JenChunHsiang.com.
- The site includes a `CNAME` file for `emilyhsiang.com`, plus `robots.txt`, `sitemap.xml`, and `404.html`.
- The visual identity is distinctive: light interface, glass content panel, profile image, multilingual matrix-style canvas background.

### Gaps

- No favicon or dedicated social preview image.
- The blog exists as a shell but does not yet have posts, RSS, or a fuller content architecture.
- The selected publications section is useful, but it risks making the new site feel like another academic portfolio unless it is reframed as research background and linked to the archive.
- JenChunHsiang.com still needs the reciprocal link back to EmilyHsiang.com.
- The animated background should be checked for mobile performance after deployment.

## Strategic Positioning

### EmilyHsiang.com

Role: active professional and business hub.

Primary job:

- Publish current writing, ideas, product thinking, and business updates.
- Establish Emily Hsiang as the current public identity.
- Connect research credibility to practical AI, data, modeling, and founder work.
- Funnel people to semiqlassical, email, newsletter, LinkedIn, GitHub, and selected professional profiles.

Avoid:

- Becoming a duplicate academic archive.
- Over-indexing on the old academic name in visible copy.
- Competing page-for-page with JenChunHsiang.com.

### JenChunHsiang.com

Role: authoritative academic archive.

Primary job:

- Preserve accumulated search authority, academic backlinks, publications, CV, graduate research, and historic projects.
- Make the academic identity legible and trustworthy.
- Link forward to EmilyHsiang.com as the active site.

Avoid:

- Redirecting the whole domain to EmilyHsiang.com.
- Deleting or weakening high-authority academic pages.
- Rewriting all academic pages as business pages.

## Enhancement Plan

### Phase 1: Pre-launch SEO foundation

- Add canonical URL:
  - `https://emilyhsiang.com/`
- Add meta description focused on active professional positioning.
- Add Open Graph and Twitter card tags.
- Add a local profile or preview image and reference it in social metadata.
- Add favicon files.
- Add `robots.txt`.
- Add `sitemap.xml`.
- Add a lightweight `404.html`.
- Add `rel="noopener noreferrer"` to external links that open in a new tab.

### Phase 2: Entity bridge

- Add a visible bridge link on EmilyHsiang.com:
  - Suggested copy: "For my academic research archive and publications, visit JenChunHsiang.com."
  - Use `rel="me"` on the link to `https://jenchunhsiang.com/`.
- Add reciprocal bridge copy on JenChunHsiang.com:
  - Suggested copy: "I now write about AI systems, data, modeling, and founder work at EmilyHsiang.com."
  - Use `rel="me"` on the link to `https://emilyhsiang.com/`.
- Add JSON-LD `Person` schema on EmilyHsiang.com with:
  - `name`: `Emily Hsiang`
  - `alternateName`: `Jen-Chun Hsiang`
  - `url`: `https://emilyhsiang.com/`
  - `sameAs`: JenChunHsiang.com, GitHub, LinkedIn, Google Scholar, semiqlassical, and other stable public profiles
  - `alumniOf`: Washington University in St. Louis
  - `affiliation` or `worksFor`: semiqlassical
  - `knowsAbout`: computational neuroscience, machine learning, AI systems, data modeling, decision-making
- Add compatible schema to JenChunHsiang.com, with JenChunHsiang.com as the archive URL and EmilyHsiang.com in `sameAs`.

### Phase 3: Content architecture

- Keep the homepage as a concise active hub.
- Reframe publications as "Research Background" with a link to the full academic archive.
- Add a dedicated writing area:
  - `/writing/`
  - individual posts under `/writing/post-slug/`
  - optional RSS feed later
- Add a dedicated About page if the site grows beyond one page:
  - `/about/`
  - include the strongest entity-bridge schema here too
- Add a Projects or Work page only when there are concrete public artifacts to show.

### Phase 4: Domain launch

- Prepare the EmilyHsiang.com site on the chosen host before changing redirects.
- Pick one canonical host:
  - Recommended: `https://emilyhsiang.com/`
  - Redirect `https://www.emilyhsiang.com/` to the apex.
- Remove the registrar/Squarespace-level redirect from EmilyHsiang.com to JenChunHsiang.com only when the new site is deployed and HTTPS is ready.
- Do not redirect JenChunHsiang.com to EmilyHsiang.com.
- After launch, verify:
  - `https://emilyhsiang.com/` returns `200`.
  - `https://www.emilyhsiang.com/` redirects to `https://emilyhsiang.com/`.
  - `https://jenchunhsiang.com/` still returns `200`.
  - both sites link to each other with `rel="me"`.
  - canonical tags point to the correct domain on each site.
- Submit both domains in Google Search Console.
- Submit the EmilyHsiang.com sitemap after launch.
- Monitor indexing and search appearance for at least 2-4 weeks.

## Publishing Runbook

Recommended host: GitHub Pages from this repo.

1. Push this repo to GitHub.
2. In the GitHub repo, go to Settings -> Pages.
3. Set the source to deploy from the main branch and root folder.
4. Confirm the custom domain is `emilyhsiang.com`; the repo already includes a `CNAME` file with that value.
5. In the DNS/registrar settings for `emilyhsiang.com`, remove the old redirect to `jenchunhsiang.com`.
6. Add GitHub Pages DNS records for `emilyhsiang.com`:
   - Apex `A` records to GitHub Pages IPs.
   - Optional `www` CNAME to the GitHub Pages host.
7. In GitHub Pages, enable "Enforce HTTPS" after the certificate is ready.
8. Keep `jenchunhsiang.com` live as the academic archive.
9. Add a reciprocal `rel="me"` link on JenChunHsiang.com pointing to `https://emilyhsiang.com/`.
10. After launch, submit `https://emilyhsiang.com/sitemap.xml` in Google Search Console and inspect the homepage URL.

## Immediate Implementation Checklist

- [x] Add metadata, canonical tag, and social preview tags to `index.html`.
- [x] Add JSON-LD `Person` schema to `index.html`.
- [x] Add a visible academic archive link with `rel="me"` to the Emily homepage.
- [x] Normalize external link attributes.
- [x] Add `robots.txt`.
- [x] Add `sitemap.xml`.
- [x] Add `404.html`.
- [x] Add `CNAME` for `emilyhsiang.com`.
- [x] Move the profile image into local assets.
- [ ] Add favicon and social preview image assets.
- [x] Add reduced-motion handling for the canvas animation.
- [ ] Update JenChunHsiang.com with reciprocal `rel="me"` link and matching schema.
- [ ] Deploy EmilyHsiang.com.
- [ ] Remove the EmilyHsiang.com to JenChunHsiang.com redirect after deployment is ready.
- [ ] Verify HTTP status codes after launch.
- [ ] Submit sitemap and inspect URLs in Google Search Console.

## Recommended First Build Step

Start with the static-site SEO/entity layer before redesigning anything. The current page is a good seed: it already has the right human story. The first technical pass should make that story machine-readable and make the two-domain identity relationship explicit.
