./update-dependencies.sh

# Build native assets
npm run capacitor:assets > /dev/null
npm run mobile:sync > /dev/null
npx cap sync > /dev/null

# Lint to fix wrongly formatted files
prettier --write --ignore-unknown src > /dev/null
