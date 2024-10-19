## Architecture overview

This VSCode extension uses Vite as the bundler and Svelte as the UI framework. Contributors can run the UI in a Vite dev server. At the end, extension consumes the assets built by Vite. `app` folder contains the source codes for UI. `src` folder contains the codes for extensions.

## Developer setup

```sh
git clone https://github.com/tomliangg/gemmy.git
cd gemmy
npm install

# create .env.local and add environment variables there
touch .env.local
echo "VITE_GEMINI_API_KEY=YOUR-API-KEY\nVITE_GEMINI_MODEL_NAME=MODEL-NAME" > .env.local

npm run dev
```

## Debug extension

```sh
# build the assets first because extension needs to consume it
npm run build

# open extension.ts file, then press F5; alternatively, open the debug tool and click the run button.
```

## Publish extension

```sh
npm run build
# only needed for first time
# vsce login <publisher id>
vsce package
vsce publish -p <personal_access_token>
```
