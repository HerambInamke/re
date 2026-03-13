# Deployment Guide

## Deploy to Vercel (Recommended)

### Method 1: Deploy via Vercel CLI

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Navigate to the project directory:
```bash
cd wind-forecast-app
```

3. Login to Vercel:
```bash
vercel login
```

4. Deploy:
```bash
vercel
```

5. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **wind-forecast-app** (or your preferred name)
   - Directory? **./wind-forecast-app**
   - Override settings? **N**

6. For production deployment:
```bash
vercel --prod
```

### Method 2: Deploy via Vercel Dashboard

1. Push your code to GitHub, GitLab, or Bitbucket

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "Add New Project"

4. Import your repository

5. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: **wind-forecast-app**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

6. Click "Deploy"

### Method 3: Deploy Button

Add this to your repository README:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL&project-name=wind-forecast-app&root-directory=wind-forecast-app)
```

## Environment Variables

No environment variables are required for this application as it uses public BMRS APIs.

## Post-Deployment

After deployment, your application will be available at:
- Production: `https://your-project-name.vercel.app`
- Preview: Automatic preview URLs for each commit

## Vercel Configuration (Optional)

Create `vercel.json` in the project root for custom configuration:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

## Performance Optimization

The application is already optimized for production:
- ✅ Static page generation where possible
- ✅ API routes for server-side data fetching
- ✅ Responsive images and components
- ✅ Tailwind CSS purging for minimal CSS bundle
- ✅ TypeScript for type safety

## Monitoring

After deployment, monitor your application:
- Vercel Analytics: Automatic performance monitoring
- Vercel Logs: View API route logs and errors
- Real User Monitoring: Track actual user experience

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Fails
- Check Node.js version (requires Node 18+)
- Verify all dependencies are installed
- Review build logs in Vercel dashboard

### API Routes Not Working
- Ensure API routes are in `src/app/api/` directory
- Check that route.ts files export GET/POST functions
- Review function logs in Vercel dashboard

### Slow Performance
- Consider implementing data caching
- Use smaller date ranges for initial load
- Implement pagination for large datasets

## Local Testing Before Deployment

```bash
# Build production version locally
npm run build

# Test production build
npm start

# Open http://localhost:3000
```

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Commits to main/master branch
- **Preview**: Pull requests and other branches

Configure branch settings in Vercel project settings.
