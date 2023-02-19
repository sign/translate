./update-dependencies.sh

# Build native assets
npm run capacitor:assets
npm run mobile:sync
npx cap sync

# Lint to fix wrongly formatted files
prettier --write --ignore-unknown src
