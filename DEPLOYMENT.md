# 🚀 Deployment Guide

This guide will help you deploy ShopHub to production using Vercel (frontend), Render (backend), and Supabase (database).

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- Accounts on Vercel, Render, and Supabase
- Domain name (optional)

## 🗄️ Step 1: Set Up Supabase

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project name: `shophub`
5. Set a strong database password
6. Choose a region close to your users
7. Click "Create new project"

### 2. Set Up Database Schema
1. Go to the SQL Editor in your Supabase project
2. Copy and paste the contents of `supabase-schema.sql`
3. Click "Run" to execute the schema

### 3. Configure Authentication
1. Go to Authentication → Settings
2. Configure your site URL: `https://your-domain.vercel.app`
3. Enable redirect URLs:
   - `http://localhost:3000` (for development)
   - `https://your-domain.vercel.app` (for production)

### 4. Set Up OAuth Providers
1. Go to Authentication → Providers
2. Configure Google OAuth:
   - Enable Google provider
   - Add your Google Client ID and Secret
3. Configure GitHub OAuth:
   - Enable GitHub provider
   - Add your GitHub Client ID and Secret

### 5. Get Environment Variables
1. Go to Project Settings → API
2. Copy the following values:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - anon public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - service_role key (SUPABASE_SERVICE_ROLE_KEY)

## 🔧 Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Optional: Email Configuration
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@yourdomain.com

# Optional: Analytics
GOOGLE_ANALYTICS_ID=your-ga-id
```

## 🌐 Step 3: Deploy to Vercel (Frontend)

### 1. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the `shophub` project

### 2. Configure Vercel Settings
1. **Build Settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

2. **Environment Variables**:
   - Add all environment variables from Step 2

3. **Domains**:
   - Use the default `.vercel.app` domain or add a custom domain

### 3. Deploy
1. Click "Deploy"
2. Wait for the deployment to complete
3. Test your live application

## 🖥️ Step 4: Deploy to Render (Backend API)

### 1. Prepare for Render
1. Create a `render.yaml` file in your project root:

```yaml
services:
  - type: web
    name: shophub-api
    env: node
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: NEXT_PUBLIC_SUPABASE_URL
        sync: false
      - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: NEXTAUTH_SECRET
        sync: false
      - key: NEXTAUTH_URL
        sync: false
```

### 2. Connect to Render
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure settings:
   - Name: `shophub-api`
   - Environment: `Node`
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Instance Type: `Free` (or paid for production)

### 3. Set Environment Variables
Add all environment variables from Step 2 to your Render service

### 4. Deploy
1. Click "Create Web Service"
2. Wait for the deployment to complete
3. Note your Render URL for API configuration

## 🔗 Step 5: Update API Configuration

### 1. Update NextAuth Configuration
In your `.env.local` and production environment:
```env
NEXTAUTH_URL=https://your-domain.vercel.app
```

### 2. Update Supabase CORS
1. Go to Supabase Project Settings → API
2. Add your Vercel domain to CORS settings
3. Add your Render URL to CORS settings

## ✅ Step 6: Final Configuration

### 1. Update OAuth Redirect URLs
1. Go to Supabase Authentication → Settings
2. Add your Vercel domain to redirect URLs
3. Update your OAuth provider redirect URLs

### 2. Test Everything
1. Test user registration and login
2. Test product search and filtering
3. Test cart and wishlist functionality
4. Test admin dashboard (with admin account)

### 3. Set Up Custom Domain (Optional)
1. Configure DNS settings for your domain
2. Add custom domain in Vercel dashboard
3. Update OAuth provider URLs
4. Update Supabase redirect URLs

## 🔍 Step 7: Monitor and Maintain

### 1. Set Up Monitoring
- Vercel Analytics for frontend performance
- Render metrics for backend performance
- Supabase logs for database monitoring

### 2. Regular Maintenance
- Update dependencies regularly
- Monitor database usage
- Check error logs
- Update OAuth credentials if needed

## 🚨 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check NEXTAUTH_URL matches your domain
   - Verify OAuth provider credentials
   - Check Supabase redirect URLs

2. **Database Connection Issues**
   - Verify Supabase credentials
   - Check Supabase project status
   - Ensure RLS policies are correct

3. **Build Errors**
   - Check Node.js version compatibility
   - Verify all environment variables
   - Check for missing dependencies

4. **CORS Issues**
   - Add all domains to Supabase CORS settings
   - Check API endpoint configurations
   - Verify environment variables

### Debug Mode
Add these environment variables for debugging:
```env
DEBUG=next-auth
NEXTAUTH_DEBUG=true
```

## 📊 Performance Optimization

### 1. Enable Caching
- Configure Vercel Edge Network
- Enable Supabase caching
- Use CDN for static assets

### 2. Monitor Performance
- Set up Lighthouse CI
- Monitor Core Web Vitals
- Track user engagement metrics

### 3. Optimize Images
- Use Next.js Image optimization
- Configure responsive images
- Enable WebP format

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit secrets to Git
   - Use different keys for development/production
   - Rotate keys regularly

2. **Database Security**
   - Enable Row Level Security (RLS)
   - Use service role keys sparingly
   - Regular security audits

3. **API Security**
   - Enable rate limiting
   - Use HTTPS everywhere
   - Validate all inputs

## 📈 Scaling Considerations

### When to Scale
- High traffic (>1000 concurrent users)
- Large database (>10GB)
- Complex business logic

### Scaling Options
1. **Vercel Pro** - More bandwidth and features
2. **Render Paid Plans** - Better performance
3. **Supabase Pro** - More database resources
4. **CDN** - Global content delivery

## 🎉 You're Live!

Your ShopHub e-commerce platform is now live and ready for users! Here's what you have:

- ✅ Modern, responsive e-commerce site
- ✅ User authentication and profiles
- ✅ Advanced search and filtering
- ✅ Shopping cart and wishlist
- ✅ Admin dashboard with analytics
- ✅ Real-time features
- ✅ PWA capabilities
- ✅ Production-ready deployment

**Next Steps:**
1. Add your products to the database
2. Customize the design and branding
3. Set up payment processing
4. Configure email notifications
5. Add analytics and monitoring
6. Promote your store!

Congratulations on launching your modern e-commerce platform! 🚀