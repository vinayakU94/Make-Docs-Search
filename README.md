# Onboarding Guide

### 1. Get API Key
* Sign up at [SearchApi.io](https://www.searchapi.io/).
* Copy your **API Key** from the dashboard.

### 2. Local Configuration
* Create a file named `config.js` in the root folder.
* Add your key using this format:
  ```javascript
  const config = {
    SEARCH_API_KEY: 'YOUR_API_KEY_HERE'
  };

### 3. Installation

* Open `chrome://extensions/`.
* Enable **Developer mode** (top right).
* Click **Load unpacked** and select the extension folder.
* **Refresh** your browser tabs to activate.

### 4. Usage

* **Open UI:** `Cmd + B` (Mac) or `Ctrl + B` (Windows).
* **Search:** Type query and press `Enter`.
* **Copy:** Click the **COPY LINK** button.
* **Close:** Click the `X` or use the shortcut again.
