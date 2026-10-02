# Netlify Production Deployment Guide for REYA Luxury Spa

This project is fully configured and optimized for zero-config production deployment on **Netlify**.

---

## 🚀 Option 1: Git-Connected Deploy (Recommended)

1. Push your repository to **GitHub** / **GitLab** / **Bitbucket**.
2. Log in to [Netlify](https://app.netlify.com/) and click **"Add new site"** → **"Import an existing project"**.
3. Select your repository.
4. Netlify will automatically detect the settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `20`
5. Click **"Deploy site"**.

---

## 📦 Option 2: Drag & Drop (Manual Deploy)

1. In your local terminal, build the production bundle:
   ```bash
   npm run build
   ```
2. Navigate to [Netlify Drop](https://app.netlify.com/drop).
3. Drag and drop the generated `dist` folder directly into the browser.
4. Your site will be live instantly!

---

## ⚡ Option 3: Netlify CLI

```bash
# Install Netlify CLI globally (if not already installed)
npm install -g netlify-cli

# Login to your Netlify account
netlify login

# Deploy directly
netlify deploy --prod --dir=dist
```

---

## 🛡️ Production Configurations Included

- **`netlify.toml`**: Configures build command, `dist` publish folder, Node 20 runtime, security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`), and long-term immutable caching for static assets.
- **`public/_redirects`**: Ensures single-page application (SPA) client-side routing rewrites (`/* /index.html 200`) work seamlessly without 404 errors on browser page reloads.
- **`vite.config.ts`**: Implements vendor chunk splitting (`vendor-react`, `vendor-motion`, `vendor-lucide`, `vendor-firebase`) for optimal CDN caching and fast initial page loads.
- **Branding & SEO Assets**:
  - `public/favicon.svg` (Golden Lotus emblem)
  - `public/robots.txt` (Search engine crawler permissions)
  - Canonical metadata, OpenGraph tags, theme-color `#090f10` in `index.html`.
