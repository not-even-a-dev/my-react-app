# How to View the App

## Step 1: Install Node.js
You need to install Node.js (which includes npm) to run this app.

### Option A: Download from website (Recommended)
1. Go to https://nodejs.org/
2. Download the LTS (Long Term Support) version for macOS
3. Install the downloaded package
4. Verify installation by opening Terminal and running:
   ```bash
   node --version
   npm --version
   ```

### Option B: Install using Homebrew (if you have it)
```bash
brew install node
```

## Step 2: Install Dependencies
Once Node.js is installed, navigate to this folder and run:
```bash
cd "/Users/ramgod/Desktop/To Do app"
npm install
```

This will install all the required packages (React, TypeScript, Vite, etc.)

## Step 3: Start the Development Server
```bash
npm run dev
```

## Step 4: View in Browser
After running `npm run dev`, you should see output like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and go to **http://localhost:5173/** to see the app!

## Alternative: Preview Production Build
If you want to see the optimized production version:
```bash
npm run build
npm run preview
```

---

**Note**: The app stores all data locally in your browser using IndexedDB, so no server setup is required!
