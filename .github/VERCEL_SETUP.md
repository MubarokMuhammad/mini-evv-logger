# Vercel Deployment Setup

To enable automatic deployment to Vercel through GitHub Actions, you need to configure several secrets in your GitHub repository.

## Required Secrets

Go to **Settings** → **Secrets and variables** → **Actions** in your GitHub repository, then add the following secrets:

### 1. VERCEL_TOKEN
- **How to get it**: 
  1. Login to [Vercel Dashboard](https://vercel.com/dashboard)
  2. Go to **Settings** → **Tokens**
  3. Click **Create Token**
  4. Give the token a name (e.g., "GitHub Actions")
  5. Copy the generated token

### 2. VERCEL_ORG_ID
- **How to get it**:
  1. Login to Vercel Dashboard
  2. Go to **Settings** → **General**
  3. Copy the **Team ID** (or **User ID** if using a personal account)

### 3. VERCEL_PROJECT_ID_BACKEND
- **How to get it**:
  1. Open your backend project in Vercel Dashboard
  2. Go to **Settings** → **General**
  3. Copy the **Project ID**

### 4. VERCEL_PROJECT_ID_FRONTEND
- **How to get it**:
  1. Open your frontend project in Vercel Dashboard
  2. Go to **Settings** → **General**
  3. Copy the **Project ID**

### 5. REACT_APP_API_URL (Optional)
- **Value**: Your backend API URL in production
- **Example**: `https://your-backend.vercel.app`

## Setting Up Projects in Vercel

### Backend Project
1. Import repository to Vercel
2. Set **Root Directory** to `backend`
3. **Framework Preset**: Other
4. **Build Command**: (leave empty)
5. **Output Directory**: (leave empty)
6. **Install Command**: (leave empty)

### Frontend Project
1. Import repository to Vercel
2. Set **Root Directory** to `frontend`
3. **Framework Preset**: Create React App
4. **Build Command**: `npm run build`
5. **Output Directory**: `build`
6. **Install Command**: `npm ci`

## Verifying Setup

After adding all secrets:
1. Push code to the `main` or `master` branch
2. Check the **Actions** tab in your GitHub repository
3. The workflow will run and deploy automatically if all secrets are available
4. If secrets are not available, deployment will be skipped with an informative message

## Troubleshooting

- **Error "Input required and not supplied: vercel-token"**: Make sure the `VERCEL_TOKEN` secret has been added
- **Error "Project not found"**: Make sure `VERCEL_PROJECT_ID_*` matches the project ID in Vercel
- **Error "Team not found"**: Make sure `VERCEL_ORG_ID` matches the team/user ID in Vercel