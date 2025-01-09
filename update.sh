./update-dependencies.sh

# Build native assets
npm run capacitor:assets > /dev/null
npm run mobile:sync > /dev/null
npx cap sync > /dev/null

cd ios/App && fastlane run update_fastlane && cd ../..
cd android && fastlane run update_fastlane && cd ..

# Lint to fix wrongly formatted files
#prettier --write --ignore-unknown src > /dev/null
