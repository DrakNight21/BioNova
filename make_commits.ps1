function Commit-Stage ($paths, $msg) {
    foreach ($p in $paths) {
        if (Test-Path $p) {
            git add $p
        }
    }
    $status = git diff --cached --name-only
    if ($status) {
        git commit -m $msg
    }
}

Commit-Stage @("backend/composer.json", "backend/composer.lock", "backend/artisan") "Initial backend setup"
Commit-Stage @("backend/config", "backend/bootstrap") "Configure backend settings and bootstrap"
Commit-Stage @("backend/database/migrations") "Create database migrations for core tables"
Commit-Stage @("backend/database/seeders", "backend/database/factories") "Add database seeders and factories"
Commit-Stage @("backend/app/Models") "Implement Eloquent models with relationships"
Commit-Stage @("backend/app/Http/Controllers") "Develop API controllers for core features"
Commit-Stage @("backend/routes", "backend/app/Http/Middleware", "backend/app/Providers") "Setup API routes and middleware"
Commit-Stage @("backend") "Finalize backend setup and bug fixes"
Commit-Stage @("frontend/package.json", "frontend/package-lock.json", "frontend/vite.config.ts", "frontend/tsconfig.json", "frontend/tsconfig.node.json", "frontend/index.html") "Initial frontend React/Vite setup"
Commit-Stage @("frontend/public", "frontend/eslint.config.js", "frontend/postcss.config.js", "frontend/tailwind.config.js") "Add frontend static assets and config"
Commit-Stage @("frontend/src/components/layout", "frontend/src/components/ui") "Create core UI components and layout"
Commit-Stage @("frontend/src/components") "Implement feature-specific components"
Commit-Stage @("frontend/src/pages") "Develop frontend pages and routing"
Commit-Stage @("frontend/src/context", "frontend/src/hooks", "frontend/src/services", "frontend/src/lib", "frontend/src/store", "frontend/src/types") "Integrate state management, types and API services"
Commit-Stage @("frontend/src/App.tsx", "frontend/src/main.tsx", "frontend/src/index.css", "frontend/src/assets", "frontend/src/styles") "Finalize frontend integration and styling"
Commit-Stage @("frontend") "Complete frontend implementation"
git add .
$status = git diff --cached --name-only
if ($status) {
    git commit -m "Final polish and minor tweaks"
}
