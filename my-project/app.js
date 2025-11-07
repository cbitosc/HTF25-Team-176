document.addEventListener('DOMContentLoaded', () => {

  // --- Page Navigation Logic ---
  const allPages = document.querySelectorAll('[id^="page-"]');
  const navButtons = document.querySelectorAll('.page-switcher-btn');

  function showPage(pageId) {
    // Hide all pages
    allPages.forEach(page => {
      page.classList.add('hidden');
    });
    // Show the target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.remove('hidden');
      window.scrollTo(0, 0); // Scroll to top
    } else {
      console.error(`Page not found: ${pageId}`);
      document.getElementById('page-login').classList.remove('hidden'); // Default to login
    }
  }

  // Add click listeners to all nav buttons
  navButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPageId = button.getAttribute('data-page');
      showPage(targetPageId);
      // Add page transition animation
      const targetPage = document.getElementById(targetPageId);
      if (targetPage) {
        targetPage.classList.add('page-enter');
        setTimeout(() => targetPage.classList.remove('page-enter'), 300);
      }
    });
  });

  // --- Login Page Logic ---
  const tabCustomer = document.getElementById('tab-customer');
  const tabVendor = document.getElementById('tab-vendor');
  const tabAdmin = document.getElementById('tab-admin');
  const loginTitle = document.getElementById('login-title');
  const signupFields = document.getElementById('signup-fields');
  const companyField = document.getElementById('company-field');
  const toggleLink = document.getElementById('toggle-link');
  const toggleText = document.getElementById('toggle-text');
  const submitButton = document.getElementById('form-submit-btn');
  const loginForm = document.getElementById('login-form');

  let currentRole = 'customer'; // 'customer', 'vendor', 'admin'
  let isLogin = true; // true for login, false for sign up

  function updateFormState() {
    // Update tabs
    tabCustomer.classList.toggle('tab-active', currentRole === 'customer');
    tabVendor.classList.toggle('tab-active', currentRole === 'vendor');
    tabAdmin.classList.toggle('tab-active', currentRole === 'admin');

    // Update titles and fields
    if (isLogin) {
      loginTitle.textContent = `${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Login`;
      submitButton.textContent = 'Login';
      toggleText.textContent = "Don't have an account? ";
      toggleLink.textContent = 'Sign Up';
      signupFields.classList.add('hidden');
    } else {
      loginTitle.textContent = `${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Sign Up`;
      submitButton.textContent = 'Create Account';
      toggleText.textContent = 'Already have an account? ';
      toggleLink.textContent = 'Login';
      signupFields.classList.remove('hidden');
      
      // Show company field only for vendor sign-up
      companyField.classList.toggle('hidden', currentRole !== 'vendor');
    }
    
    // Admin can't sign up
    toggleLink.classList.toggle('hidden', currentRole === 'admin');
    toggleText.classList.toggle('hidden', currentRole === 'admin');
    if (currentRole === 'admin' && !isLogin) {
        isLogin = true;
        updateFormState();
    }
  }

  // Tab listeners
  tabCustomer.addEventListener('click', () => { currentRole = 'customer'; updateFormState(); });
  tabVendor.addEventListener('click', () => { currentRole = 'vendor'; updateFormState(); });
  tabAdmin.addEventListener('click', () => { currentRole = 'admin'; updateFormState(); });

  // Toggle Login/Sign Up
  toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    updateFormState();
  });

  // Form Submit Handler
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name')?.value;
    const companyName = document.getElementById('company')?.value;

    // Show loading state
    const submitBtn = document.getElementById('form-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    try {
      if (!isLogin) {
        // Sign up
        const response = await fetch('http://localhost:3001/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, role: currentRole, company_name: companyName })
        });

        const data = await response.json();

        if (response.ok) {
          alert('Account created successfully! Please login.');
          isLogin = true;
          updateFormState();
        } else {
          alert(data.error || 'Registration failed');
        }
      } else {
        // Login
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          // Store token
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          // Redirect based on role
          switch (data.user.role) {
            case 'customer':
              showPage('page-landing');
              break;
            case 'vendor':
              showPage('page-vendor-dash');
              break;
            case 'admin':
              showPage('page-admin-dash');
              break;
          }
        } else {
          alert(data.error || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please try again.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // Initialize form state
  updateFormState();

  // Load products on landing page
  if (document.getElementById('page-landing').classList.contains('hidden') === false) {
    loadProducts();
  }
});

// Function to load products from API
async function loadProducts() {
  const productsContainer = document.getElementById('products-container');
  if (!productsContainer) return;

  try {
    const response = await fetch('http://localhost:3001/api/products');
    const data = await response.json();

    if (response.ok) {
      displayProducts(data.products);
    } else {
      console.error('Failed to load products:', data.error);
      productsContainer.innerHTML = '<p class="text-center text-gray-400">Failed to load products. Please try again later.</p>';
    }
  } catch (error) {
    console.error('Error loading products:', error);
    productsContainer.innerHTML = '<p class="text-center text-gray-400">Network error. Please check your connection.</p>';
  }
}

// Function to display products
function displayProducts(products) {
  const productsContainer = document.getElementById('products-container');
  if (!products || products.length === 0) {
    productsContainer.innerHTML = '<p class="text-center text-gray-400">No products available at the moment.</p>';
    return;
  }

  const productsHTML = products.map(product => `
    <div class="product-card group">
      <div class="relative overflow-hidden rounded-lg">
        <img src="${product.image_url || 'https://via.placeholder.com/300x300.png?text=No+Image'}" alt="${product.name}" class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110">
        <button class="absolute top-2 right-2 p-2 bg-gray-900/50 rounded-full text-ghost-white hover:text-pumpkin">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
        </button>
      </div>
      <div class="p-4">
        <span class="text-sm text-gray-400">${product.vendor_name || product.company_name || 'Unknown Vendor'}</span>
        <h4 class="text-lg font-bold text-ghost-white mt-1 mb-2 truncate">${product.name}</h4>
        <div class="flex justify-between items-center">
          <span class="text-xl font-bold text-pumpkin">$${product.price.toFixed(2)}</span>
          <button class="add-to-cart-btn py-2 px-4 bg-witch-purple text-ghost-white font-semibold rounded-md hover:bg-opacity-80 transition duration-300" data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');

  productsContainer.innerHTML = productsHTML;

  // Add event listeners to "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      const productId = e.target.getAttribute('data-product-id');
      await addToCart(productId);
    });
  });
}

// Function to add product to cart
async function addToCart(productId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to add items to cart');
    return;
  }

  try {
    const response = await fetch('http://localhost:3001/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ product_id: productId, quantity: 1 })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Item added to cart successfully!');
    } else {
      alert(data.error || 'Failed to add item to cart');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Network error. Please try again.');
  }
}
