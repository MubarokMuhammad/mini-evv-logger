# Deployment Setup Guide

This guide explains how to set up automated deployment to Vercel using GitHub Actions.

## Required GitHub Secrets

To enable automatic deployment, you need to configure the following secrets in your GitHub repository:

### 1. Navigate to Repository Settings
- Go to your GitHub repository
- Click on "Settings" tab
- Select "Secrets and variables" → "Actions"

### 2. Add Required Secrets

Click "New repository secret" and add each of the following:

#### VERCEL_TOKEN
- **Description**: Your Vercel authentication token
- **How to get**: 
  1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
  2. Click on your profile → "Settings"
  3. Go to "Tokens" tab
  4. Create a new token with appropriate scope

#### VERCEL_ORG_ID
- **Description**: Your Vercel organization/team ID
- **How to get**:
  1. Go to your Vercel dashboard
  2. Select your team/organization
  3. Go to "Settings" → "General"
  4. Copy the "Team ID" or "Organization ID"

#### VERCEL_PROJECT_ID_BACKEND
- **Description**: Project ID for your backend deployment
- **How to get**:
  1. Go to your backend project in Vercel dashboard
  2. Go to "Settings" → "General"
  3. Copy the "Project ID"

#### VERCEL_PROJECT_ID_FRONTEND
- **Description**: Project ID for your frontend deployment
- **How to get**:
  1. Go to your frontend project in Vercel dashboard
  2. Go to "Settings" → "General"
  3. Copy the "Project ID"

#### REACT_APP_API_URL (Optional)
- **Description**: API URL for the frontend to connect to backend
- **Example**: `https://your-backend-url.vercel.app`

## Deployment Workflow

The GitHub Actions workflow will:

1. **Test Backend**: Run Go tests
2. **Test Frontend**: Run React tests and build
3. **Deploy Backend**: Deploy to Vercel (if secrets are configured)
4. **Deploy Frontend**: Deploy to Vercel (if secrets are configured)

## Manual Deployment

If you prefer manual deployment or don't want to set up secrets:

### Backend
```bash
cd backend
vercel --prod
```

### Frontend
```bash
cd frontend
npm run build
vercel --prod
```

## Troubleshooting

### Common Issues

1. **"VERCEL_TOKEN secret is not set"**
   - Solution: Add the VERCEL_TOKEN secret as described above

2. **"Project not found"**
   - Solution: Verify VERCEL_PROJECT_ID_BACKEND and VERCEL_PROJECT_ID_FRONTEND are correct

3. **"Insufficient permissions"**
   - Solution: Ensure your Vercel token has the necessary permissions

### Skipping Deployment

If secrets are not configured, the workflow will skip deployment steps and only run tests. This allows the CI/CD pipeline to work even without deployment setup.

## Security Notes

- Never commit secrets to your repository
- Use GitHub repository secrets for sensitive information
- Regularly rotate your Vercel tokens
- Limit token permissions to only what's necessary