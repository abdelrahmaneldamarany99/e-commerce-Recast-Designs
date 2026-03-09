class ProductPage {
  constructor() {
    this.products = data;
    this.cart = [];
    this.currentProduct = this.products.mainProduct;
    this.selectedSize = null;
    this.selectedColor = null;

    this.init();
  }

  init() {
    this.renderMainProduct();
    this.renderCollection();
    this.updateCartCount();
    this.bindEvents();
  }

  renderMainProduct() {
    const product = this.currentProduct;

    // Dynamic Title
    document.title = `${product.title} | Luxury Jewelry`;

    // Render Text Content
    document.getElementById("product-title").textContent = product.title;
    document.getElementById("product-price").textContent = `${
      product.currency
    }${product.price.toLocaleString()}`;
    document.getElementById("product-desc-1").textContent =
      product.description[0];
    document.getElementById("spec-desc").textContent = product.description[1]; // Piece specifications text

    // Render Gallery (Dynamic)
    this.renderGallery(product);

    // Render Specs
    document.getElementById("gold-spec").textContent = product.specs.gold;
    document.getElementById("diamond-spec").textContent = product.specs.diamond;
    document.getElementById("clarity-spec").textContent = product.specs.clarity;

    // Render Spec Descriptions (Dynamic)
    document.getElementById("gold-text").textContent = product.specs.goldText;
    document.getElementById("diamond-text").textContent =
      product.specs.diamondText;
    document.getElementById("clarity-text").textContent =
      product.specs.clarityText;

    // Render Sizes
    const sizeContainer = document.getElementById("size-options");
    sizeContainer.innerHTML = "";
    product.sizes.forEach((size) => {
      const btn = document.createElement("button");
      btn.className = "option-btn size-btn";
      btn.textContent = size;
      btn.dataset.size = size;
      btn.addEventListener("click", () => this.selectSize(btn, size));
      sizeContainer.appendChild(btn);
    });

    // Render Colors
    const colorContainer = document.getElementById("color-options");
    colorContainer.innerHTML = "";
    product.colors.forEach((color, index) => {
      const btn = document.createElement("button");
      btn.className = "option-btn color-btn";
      // We'll use an SVG or Image for the star icon as per design
      btn.innerHTML = `<img src="./images/starpng.png" alt="Color ${
        index + 1
      }" style="filter: ${index === 0 ? "grayscale(100%)" : "none"};">`;
      // Note: Simplification for now, might need better color logic
      btn.dataset.color = color;
      btn.addEventListener("click", () => this.selectColor(btn, color));
      colorContainer.appendChild(btn);
    });
  }

  renderGallery(product) {
    // Desktop Gallery
    const desktopGallery = document.getElementById("desktop-gallery");
    if (desktopGallery) {
      desktopGallery.innerHTML = `
            <img src="${product.images.main}" alt="${product.title}" class="mosaic-item main">
            <div class="mosaic-row">
                <img src="${product.images.gallery[1]}" alt="Detail 1" class="mosaic-item sub">
                <div class="mosaic-row">
                    <img src="${product.images.gallery[0]}" alt="Detail 2" class="mosaic-item sub">
                    <img src="${product.images.gallery[2]}" alt="Detail 3" class="mosaic-item sub">
                </div>
            </div>
        `;
    }

    // Mobile Gallery
    const mobileGallery = document.getElementById("mobile-gallery");
    if (mobileGallery) {
      const thumbsHtml = product.images.gallery
        .map(
          (src) =>
            `<img src="${src}" onclick="changeImage(this.src)" alt="Thumb">`
        )
        .join("");

      mobileGallery.innerHTML = `
            <img id="mobile-main-image" src="${product.images.main}" alt="${product.title}">
            <div class="mobile-thumbs">
                ${thumbsHtml}
            </div>
        `;
    }

    // Set default selection (optional)
    // this.selectSize(sizeContainer.firstElementChild, product.sizes[0]);
  }

  renderCollection() {
    const grid = document.getElementById("collection-grid");
    grid.innerHTML = "";
    this.products.collection.forEach((item) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.style.cursor = "pointer"; // Indicate clickable
      card.title = "Add to Cart";
      card.innerHTML = `
                <div class="card-image-container">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="card-info">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toLocaleString()}</p>
                </div>
            `;
      // Allow adding logic
      card.addEventListener("click", () => {
        this.addToCart(item); // Pass specific item
        // Optional: Tiny feedback
        alert(`${item.name} added to cart!`);
      });
      grid.appendChild(card);
    });
  }

  selectSize(btn, size) {
    document
      .querySelectorAll(".size-btn")
      .forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    this.selectedSize = size;
  }

  selectColor(btn, color) {
    document
      .querySelectorAll(".color-btn")
      .forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    this.selectedColor = color;
  }

  addToCart(specificItem = null) {
    // If adding a specific item (e.g. from collection), bypass size/color check
    if (specificItem) {
      const cartItem = {
        title: specificItem.name, // Map name to title
        price: specificItem.price,
        currency: "$",
        images: { gallery: [specificItem.image] }, // Map image structure
        selectedSize: "N/A",
        selectedColor: "Standard",
      };
      this.cart.push(cartItem);
      this.updateCartCount();
      this.renderCartItems();
      return;
    }

    // Default Main Product Logic
    if (!this.selectedColor) {
      alert("Please select a color");
      return;
    }
    if (!this.selectedSize) {
      alert("Please select a size");
      return;
    }
    const item = {
      ...this.currentProduct,
      selectedSize: this.selectedSize,
      selectedColor: this.selectedColor,
    };

    this.cart.push(item);
    this.updateCartCount();
    this.renderCartItems();

    // Show cart (optional feedback)
    // this.toggleCart(true);
  }

  removeFromCart() {
    if (this.cart.length === 0) {
      alert("The Cart is empty");
      return;
    }
    this.cart.pop();
    this.updateCartCount();
    this.renderCartItems();
  }

  updateCartCount() {
    document.getElementById("cart-count").textContent = this.cart.length;
  }

  renderCartItems() {
    const container = document.getElementById("cart-items");
    container.innerHTML = "";

    if (this.cart.length === 0) {
      container.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
      return;
    }

    this.cart.forEach((item, index) => {
      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
                <img src="${item.images.gallery[0]}" alt="${item.title}">
                <div>
                    <h4>${item.title}</h4>
                    <p>Size: ${item.selectedSize}</p>
                    <p>Color: ${item.selectedColor}</p>
                    <p>${item.currency}${item.price.toLocaleString()}</p>
                </div>
                <button class="remove-btn" data-index="${index}">×</button>
            `;
      container.appendChild(el);
    });

    // Calculate total
    const total = this.cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById(
      "cart-total"
    ).textContent = `$${total.toLocaleString()}`;

    // Bind remove buttons
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.target.dataset.index);
        this.cart.splice(idx, 1);
        this.updateCartCount();
        this.renderCartItems();
      });
    });
  }

  toggleCart(forceOpen = null) {
    const cart = document.getElementById("cart-sidebar");
    const overlay = document.getElementById("cart-overlay");
    const isOpen =
      forceOpen !== null ? forceOpen : !cart.classList.contains("open");

    if (isOpen) {
      cart.classList.add("open");
      overlay.classList.add("open");
    } else {
      cart.classList.remove("open");
      overlay.classList.remove("open");
    }
  }

  bindEvents() {
    document
      .getElementById("add-to-cart-btn")
      .addEventListener("click", () => this.addToCart());
    document
      .getElementById("remove-from-cart-btn")
      .addEventListener("click", () => this.removeFromCart());
    document
      .getElementById("cart-toggle")
      .addEventListener("click", () => this.toggleCart());
    document
      .getElementById("close-cart")
      .addEventListener("click", () => this.toggleCart(false));
    document
      .getElementById("cart-overlay")
      .addEventListener("click", () => this.toggleCart(false));
  }
}

// Global function for mobile gallery
window.changeImage = function (src) {
  document.getElementById("mobile-main-image").src = src;
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  new ProductPage();
});
