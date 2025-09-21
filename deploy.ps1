# PowerShell Deployment Script for AI Career Toolkit

Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Check if Vercel CLI is installed
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Build the project
Write-Host "📦 Building project..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Blue
vercel --prod

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Your app is now live!" -ForegroundColor Cyan
