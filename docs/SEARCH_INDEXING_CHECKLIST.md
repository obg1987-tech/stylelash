# Search Indexing Checklist

This checklist is for production deployment and search registration.

## 1) Domain + metadata sanity

- [ ] Set `NEXT_PUBLIC_SITE_URL` to your real production domain
- [ ] Deploy and verify these URLs return HTTP 200:
  - [ ] `/robots.txt`
  - [ ] `/sitemap.xml`
  - [ ] `/manifest.webmanifest`
- [ ] Confirm canonical tags are present on:
  - [ ] `/`
  - [ ] `/community`
  - [ ] `/brow-preview`

## 2) Google Search Console

- [ ] Create/Search property for your domain: `https://search.google.com/search-console`
- [ ] Add verification token to `.env.local`:
  - [ ] `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- [ ] Redeploy
- [ ] In Search Console > Sitemaps, submit:
  - [ ] `https://YOUR_DOMAIN/sitemap.xml`
- [ ] Request indexing for:
  - [ ] `https://YOUR_DOMAIN/`
  - [ ] `https://YOUR_DOMAIN/community`

## 3) Naver Search Advisor

- [ ] Register site in Naver Search Advisor
- [ ] Add verification token to `.env.local`:
  - [ ] `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`
- [ ] Redeploy
- [ ] Submit sitemap URL:
  - [ ] `https://YOUR_DOMAIN/sitemap.xml`
- [ ] Submit feed/URL collection for key pages:
  - [ ] `/`
  - [ ] `/community`

## 4) Bing Webmaster Tools (optional, recommended)

- [ ] Register site in Bing Webmaster Tools
- [ ] Add verification token to `.env.local`:
  - [ ] `NEXT_PUBLIC_BING_SITE_VERIFICATION`
- [ ] Redeploy
- [ ] Submit sitemap:
  - [ ] `https://YOUR_DOMAIN/sitemap.xml`

## 5) Re-crawl trigger after major updates

- [ ] Update `NEXT_PUBLIC_DEPLOYED_AT` to latest deploy timestamp
- [ ] Redeploy
- [ ] Re-submit sitemap in Google/Naver/Bing
- [ ] Request indexing for changed pages
