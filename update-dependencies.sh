# Update client dependencies
rm package-lock.json
ncu --cacheClear -u --reject filesize,typescript,@google/model-viewer
npm install


# Update server dependencies
rm functions/package-lock.json
ncu --cacheClear --cwd functions --reject node-fetch,typescript -u
npm install --prefix functions


# Update material design font
# Step 1: Download the CSS file
curl -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.2228.0 Safari/537.36' \
  "https://fonts.googleapis.com/icon?family=Material+Icons&display=block" -o material-icons-temp.css
# Step 2: Extract the URL for the WOFF2 file and download it to the appropriate location
woff2_url=$(sed -nE 's#.*url\((https?://.*)\) .*#\1#p' material-icons-temp.css)
curl $woff2_url -o src/assets/fonts/material-icons/material.woff2
# TODO: subset the material icons font to only relevant icons (see src/assets/fonts/material-icons/font-config.json)
# Step 3: Update the CSS file to use the new local font path
echo "/* Automatically Updated via update-dependencies.sh */" > src/theme/fonts/material-icons.css
sed "s#url($woff2_url)#url(/assets/fonts/material-icons/material.woff2)#" "material-icons-temp.css" >> src/theme/fonts/material-icons.css
# Clean up: Delete the temporary CSS file
rm material-icons-temp.css
