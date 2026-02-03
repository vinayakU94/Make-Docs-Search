const API_KEY = config.SEARCH_API_KEY;
let searchContainer = null;

function createSearchUI() {
  if (searchContainer) {
    searchContainer.style.display = 'block';
    searchContainer.querySelector('input').focus();
    return;
  }

  searchContainer = document.createElement('div');
  searchContainer.id = 'make-search-extension';
  
  // Styles based on Make Brand Guidelines (Minimalist, Purple/Black/White)
  const style = document.createElement('style');
  style.textContent = `
    #make-search-extension {
      position: fixed; top: 20px; right: 20px; width: 350px;
      background: white; border: 1px solid #e0e0e0; border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 999999;
      font-family: 'Inter', -apple-system, sans-serif; padding: 16px;
    }
    .make-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .make-logo-text { font-weight: 800; font-size: 18px; color: #000000; letter-spacing: -0.5px; }
    #make-close { cursor: pointer; border: none; background: none; font-size: 20px; color: #666; }
    #make-input {
      width: 100%; padding: 10px; border: 2px solid #6C00FF; border-radius: 6px;
      outline: none; box-sizing: border-box; font-size: 14px;
    }
    #make-results { margin-top: 15px; }
    .result-item {
      padding: 10px; border-bottom: 1px solid #f0f0f0; transition: background 0.2s;
    }
    .result-item:hover { background: #f9f9f9; }
    .result-title { font-weight: 600; font-size: 14px; color: #6C00FF; margin-bottom: 4px; display: block; text-decoration: none; }
    .result-link { font-size: 11px; color: #888; margin-bottom: 8px; display: block; overflow: hidden; text-overflow: ellipsis; }
    .copy-btn {
      background: #000; color: white; border: none; padding: 4px 8px;
      border-radius: 4px; font-size: 10px; cursor: pointer; font-weight: 600;
    }
    .copy-btn:active { opacity: 0.7; }
  `;
  document.head.appendChild(style);

  searchContainer.innerHTML = `
    <div class="make-header">
      <span class="make-logo-text">Make Docs</span>
      <button id="make-close">×</button>
    </div>
    <input type="text" id="make-input" placeholder="Search help & apps..." autocomplete="off">
    <div id="make-results"></div>
  `;

  document.body.appendChild(searchContainer);

  const input = searchContainer.querySelector('#make-input');
  const resultsDiv = searchContainer.querySelector('#make-results');

  // Search Logic
  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const query = input.value;
      resultsDiv.innerHTML = '<p style="font-size:12px; color:#666;">Searching...</p>';
      
      try {
        // Scoped search to help.make.com and apps.make.com
        const siteFilter = "site:help.make.com OR site:apps.make.com";
        const response = await fetch(`https://www.searchapi.io/api/v1/search?engine=google&q=${encodeURIComponent(query + ' ' + siteFilter)}&api_key=${API_KEY}&num=3`);
        const data = await response.json();
        
        displayResults(data.organic_results || []);
      } catch (err) {
        resultsDiv.innerHTML = '<p style="color:red; font-size:12px;">Search failed.</p>';
      }
    }
  });

  function displayResults(results) {
    resultsDiv.innerHTML = '';
    results.slice(0, 3).forEach(res => {
      const item = document.createElement('div');
      item.className = 'result-item';
      item.innerHTML = `
        <a href="${res.link}" target="_blank" class="result-title">${res.title}</a>
        <span class="result-link">${res.link}</span>
        <button class="copy-btn" data-link="${res.link}">COPY LINK</button>
      `;
      resultsDiv.appendChild(item);
    });

    // Copy Button functionality
    searchContainer.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        navigator.clipboard.writeText(e.target.dataset.link);
        const originalText = e.target.innerText;
        e.target.innerText = 'COPIED!';
        setTimeout(() => e.target.innerText = originalText, 2000);
      });
    });
  }

  searchContainer.querySelector('#make-close').onclick = () => {
    searchContainer.style.display = 'none';
  };
}

// Listen for the Cmd+B message from background.js
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "toggle_search") {
    createSearchUI();
  }
});

// ... (keep all your existing UI and Search code from the first response) ...

// MAKE SURE THIS IS AT THE BOTTOM
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "toggle_search") {
    createSearchUI(); 
  }
});