// m7awla_ba2sa.js - COMPLETE FILE
const CORRECT_PASSWORD = "cheesecake";
let isAuthenticated = false;

// Wrong password image URL (random funny image)
const WRONG_PASSWORD_IMAGE = "https://images.memegrep.com/d0461d94-6f9a-4352-b4da-adb09fb63b23_600.webp";

document.addEventListener('DOMContentLoaded', function() {
  // Check if already authenticated from session
  const savedAuth = sessionStorage.getItem('authenticated');
  if (savedAuth === 'true') {
    authenticateUser();
  }
  
  // Password field listener
  const passwordBar = document.querySelector('.password-bar');
  if (passwordBar) {
    passwordBar.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const enteredPassword = this.value.trim();
        if (enteredPassword === CORRECT_PASSWORD) {
          authenticateUser();
        } else {
          showPasswordError();
          showWrongPasswordImage();
        }
        this.value = ''; // Clear field
      }
    });
  }
  
  // Load saved items
  loadAllCategories();
  
  // Category button clicks
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.onclick = function() {
      // Non-authenticated users can switch categories (view only)
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const category = this.getAttribute('data-category');
      document.getElementById('current-category-title').textContent = 
        category.charAt(0).toUpperCase() + category.slice(1);
      
      loadCategoryItems(category);
    };
  });
  
  // Add button click
  const addBtn = document.querySelector('.add-btn');
  if (addBtn) {
    addBtn.onclick = function() {
      if (!isAuthenticated) {
        showAuthRequired();
        return;
      }
      
      const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
      document.querySelector('.note-input-overlay').style.display = 'flex';
      document.querySelector('.note-textarea').value = '';
      document.querySelector('.note-textarea').focus();
      document.querySelector('.note-input-overlay').setAttribute('data-category', activeCategory);
    };
  }
  
  // Cancel button
  const cancelBtn = document.querySelector('.cancel-note');
  if (cancelBtn) {
    cancelBtn.onclick = function() {
      document.querySelector('.note-input-overlay').style.display = 'none';
    };
  }
  
  // Save button
  const saveBtn = document.querySelector('.save-note');
  if (saveBtn) {
    saveBtn.onclick = saveCurrentNote;
  }
  
  // Enter to save in textarea
  const textarea = document.querySelector('.note-textarea');
  if (textarea) {
    textarea.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        saveCurrentNote();
      }
    });
  }
});

// ==================== AUTHENTICATION FUNCTIONS ====================

function authenticateUser() {
  isAuthenticated = true;
  sessionStorage.setItem('authenticated', 'true');
  
  // Update UI for authenticated state
  const passwordBar = document.querySelector('.password-bar');
  if (passwordBar) {
    passwordBar.placeholder = "✓ Authenticated";
    passwordBar.style.color = "#4CAF50";
  }
  
  const addBtn = document.querySelector('.add-btn');
  if (addBtn) {
    addBtn.disabled = false;
    addBtn.style.opacity = "1";
    addBtn.style.cursor = "pointer";
  }
  
  // Reload current category to show delete buttons
  const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
  loadCategoryItems(activeCategory);
  
  // Hide any wrong password image
  hideWrongPasswordImage();
}

function showPasswordError() {
  const passwordBar = document.querySelector('.password-bar');
  if (passwordBar) {
    const originalPlaceholder = passwordBar.placeholder;
    passwordBar.placeholder = "✗ Wrong password!";
    passwordBar.style.color = "#f44336";
    
    setTimeout(() => {
      passwordBar.placeholder = originalPlaceholder;
      passwordBar.style.color = "white";
    }, 2000);
  }
}

function showWrongPasswordImage() {
  // Remove any existing image
  hideWrongPasswordImage();
  
  // Create image container
  const imgContainer = document.createElement('div');
  imgContainer.id = 'wrong-password-image';
  imgContainer.style.position = 'fixed';
  imgContainer.style.top = '60px';
  imgContainer.style.left = '50%';
  imgContainer.style.transform = 'translateX(-50%)';
  imgContainer.style.zIndex = '2000';
  imgContainer.style.textAlign = 'center';
  imgContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
  imgContainer.style.padding = '20px';
  imgContainer.style.borderRadius = '10px';
  imgContainer.style.border = '2px solid #f44336';
  
  // Create image
  const img = document.createElement('img');
  img.src = WRONG_PASSWORD_IMAGE;
  img.alt = 'Wrong Password';
  img.style.width = '200px';
  img.style.height = 'auto';
  img.style.borderRadius = '5px';
  
  // Create message
  const message = document.createElement('p');
  message.textContent = 'SUS';
  message.style.color = 'white';
  message.style.marginTop = '10px';
  message.style.fontSize = '14px';
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '5px';
  closeBtn.style.right = '5px';
  closeBtn.style.background = '#f44336';
  closeBtn.style.color = 'white';
  closeBtn.style.border = 'none';
  closeBtn.style.borderRadius = '50%';
  closeBtn.style.width = '25px';
  closeBtn.style.height = '25px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = hideWrongPasswordImage;
  
  // Assemble and show
  imgContainer.appendChild(closeBtn);
  imgContainer.appendChild(img);
  imgContainer.appendChild(message);
  document.body.appendChild(imgContainer);
  
  // Auto-hide after 5 seconds
  setTimeout(hideWrongPasswordImage, 5000);
}

function hideWrongPasswordImage() {
  const imgContainer = document.getElementById('wrong-password-image');
  if (imgContainer) {
    imgContainer.remove();
  }
}

function showAuthRequired() {
  const contentDisplay = document.getElementById('content-display');
  if (!contentDisplay) return;
  
  contentDisplay.innerHTML = `
    <div class="auth-required">
      <h3>🔒 Authentication Required</h3>
    </div>
  `;
}

// ==================== NOTE/ITEM FUNCTIONS ====================

function saveCurrentNote() {
  if (!isAuthenticated) {
    showAuthRequired();
    return;
  }
  
  const textarea = document.querySelector('.note-textarea');
  const overlay = document.querySelector('.note-input-overlay');
  
  if (!textarea || !overlay) return;
  
  const text = textarea.value.trim();
  const category = overlay.getAttribute('data-category');
  
  if (text && category) {
    saveCategoryItem(category, text);
    overlay.style.display = 'none';
    loadCategoryItems(category);
  }
}

function autoLink(text) {
  // Detect URLs and make them clickable
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  return text.replace(urlRegex, function(url) {
    // Clean up URL (remove trailing punctuation)
    const cleanUrl = url.replace(/[.,;:!?]$/, '');
    return `<a href="${cleanUrl}" target="_blank" style="color: #4dabf7; text-decoration: underline;">${cleanUrl}</a>`;
  });
}

function saveCategoryItem(category, text) {
  // Get all categories from localStorage
  let categories = JSON.parse(localStorage.getItem('categoryItems') || '{}');
  
  // Initialize category if it doesn't exist
  if (!categories[category]) {
    categories[category] = [];
  }
  
  // Add new item
  categories[category].push({
    id: Date.now(), // Unique ID based on timestamp
    text: text,
    date: new Date().toLocaleDateString(),
    category: category
  });
  
  // Save back to localStorage
  localStorage.setItem('categoryItems', JSON.stringify(categories));
}

function loadCategoryItems(category) {
  const contentDisplay = document.getElementById('content-display');
  if (!contentDisplay) return;
  
  // Get items for this category
  const categories = JSON.parse(localStorage.getItem('categoryItems') || '{}');
  const items = categories[category] || [];
  
  // Clear display
  contentDisplay.innerHTML = '';
  
  // Show authentication message if no items and not authenticated
  if (!isAuthenticated && items.length === 0) {
    showAuthRequired();
    return;
  }
  
  // Display each item
  items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'content-item';
    
    // Convert text with auto-linking (ALWAYS show links clickable)
    const linkedText = autoLink(item.text.replace(/\n/g, '<br>'));
    
    // Delete button - ONLY show if authenticated
    const deleteButton = isAuthenticated ? 
      `<button class="delete-item" data-id="${item.id}" data-category="${category}" 
        style="float: right; background: #555; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; margin-left: 10px;">
        Delete
      </button>` : '';
    
    // Edit button - ONLY show if authenticated
    const editButton = isAuthenticated ?
      `<button class="edit-item" data-id="${item.id}" data-category="${category}" data-text="${item.text.replace(/"/g, '&quot;')}"
        style="float: right; background: #555; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer;">
        Edit
      </button>` : '';
    
    itemDiv.innerHTML = `
      <div style="word-break: break-word; margin-bottom: 10px;">
        ${linkedText}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <small style="color: #888">${item.date}</small>
        <div>
          ${editButton}
          ${deleteButton}
        </div>
      </div>
    `;
    
    contentDisplay.appendChild(itemDiv);
  });
  
  // Add event listeners for authenticated actions
  if (isAuthenticated) {
    // Delete buttons
    document.querySelectorAll('.delete-item').forEach(btn => {
      btn.onclick = function() {
        const id = parseInt(this.getAttribute('data-id'));
        const cat = this.getAttribute('data-category');
        deleteCategoryItem(cat, id);
      };
    });
    
    // Edit buttons
    document.querySelectorAll('.edit-item').forEach(btn => {
      btn.onclick = function() {
        const id = parseInt(this.getAttribute('data-id'));
        const cat = this.getAttribute('data-category');
        const text = this.getAttribute('data-text').replace(/&quot;/g, '"');
        editCategoryItem(cat, id, text);
      };
    });
  }
}

function deleteCategoryItem(category, id) {
  if (!isAuthenticated) {
    showAuthRequired();
    return;
  }
  
  // Confirm deletion
  if (!confirm("Are you sure you want to delete this item?")) {
    return;
  }
  
  let categories = JSON.parse(localStorage.getItem('categoryItems') || '{}');
  
  if (categories[category]) {
    // Filter out the item with matching ID
    categories[category] = categories[category].filter(item => item.id !== id);
    localStorage.setItem('categoryItems', JSON.stringify(categories));
    loadCategoryItems(category);
  }
}

function editCategoryItem(category, id, currentText) {
  if (!isAuthenticated) {
    showAuthRequired();
    return;
  }
  
  document.querySelector('.note-input-overlay').style.display = 'flex';
  document.querySelector('.note-textarea').value = currentText;
  document.querySelector('.note-textarea').focus();
  
  const overlay = document.querySelector('.note-input-overlay');
  overlay.setAttribute('data-category', category);
  overlay.setAttribute('data-edit-id', id);
  
  const saveBtn = document.querySelector('.save-note');
  saveBtn.textContent = 'Update';
  saveBtn.onclick = function() {
    updateCategoryItem(category, id);
  };
}

function updateCategoryItem(category, id) {
  const textarea = document.querySelector('.note-textarea');
  const text = textarea.value.trim();
  
  if (!text) return;
  
  let categories = JSON.parse(localStorage.getItem('categoryItems') || '{}');
  
  if (categories[category]) {
    const itemIndex = categories[category].findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      categories[category][itemIndex].text = text;
      categories[category][itemIndex].date = new Date().toLocaleDateString();
      
      localStorage.setItem('categoryItems', JSON.stringify(categories));
      
      document.querySelector('.note-input-overlay').style.display = 'none';
      const saveBtn = document.querySelector('.save-note');
      saveBtn.textContent = 'Save';
      saveBtn.onclick = saveCurrentNote;
      
      loadCategoryItems(category);
    }
  }
}

function loadAllCategories() {
  const firstBtn = document.querySelector('.category-btn');
  if (firstBtn) {
    const firstCategory = firstBtn.getAttribute('data-category');
    loadCategoryItems(firstCategory);
  }
}

const additionalStyles = `
  .content-item a {
    color: #4dabf7 !important;
    text-decoration: underline !important;
    word-break: break-all !important;
  }
  
  .content-item a:hover {
    color: #339af0 !important;
    text-decoration: none !important;
  }
  
  .content-item a:visited {
    color: #9c88ff !important;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = additionalStyles;
document.head.appendChild(styleSheet);