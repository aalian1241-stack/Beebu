// ===== PRODUCT DATA =====
const products = [
    { id: "1", name: "Chocolate Balls", slug: "chocolate-balls", description: "Premium chocolate balls crafted with the finest cocoa. Rich, creamy, and irresistibly delicious.", shortDescription: "Premium chocolate balls", price: 599, originalPrice: 799, weight: "250g", category: "Chocolate", image: "assets/Beebu_Chocolate_balls.png", rating: 4.9, reviewCount: 567, badge: "best-seller", stock: 200, sku: "BEE-CB-001" },
    { id: "2", name: "Chocolate Candy", slug: "chocolate-candy", description: "Delicious chocolate candy made with premium cocoa and natural flavors. A sweet delight for every occasion.", shortDescription: "Premium chocolate candy", price: 649, originalPrice: 849, weight: "200g", category: "Chocolate", image: "assets/Beebu_Chocolate_Candy.png", rating: 4.8, reviewCount: 312, badge: "new", stock: 150, sku: "BEE-CC-001" }
];

const reviews = [
    { name: "Aisha Khan", location: "Lahore", rating: 5, text: "Exceptional quality! The chocolate truffles are outstanding. Quality on par with international brands.", avatar: "A" },
    { name: "Ahmed Raza", location: "Karachi", rating: 5, text: "Best candy brand in Pakistan. The Mango Lassi flavor is authentic and delicious. My kids love them.", avatar: "A" },
    { name: "Sana Malik", location: "Islamabad", rating: 4, text: "Great taste and fast delivery. I order regularly for family gatherings.", avatar: "S" },
];

const faqs = [
    { q: "How long does delivery take?", a: "Standard delivery takes 2-5 working days across Pakistan. Express delivery is available for major cities." },
    { q: "What payment methods do you accept?", a: "Cash on Delivery, JazzCash, Easypaisa, bank transfers, and all major credit/debit cards." },
    { q: "Are your products fresh?", a: "Yes! All products are manufactured fresh with a shelf life of 6-12 months using advanced packaging." },
    { q: "Do you offer wholesale orders?", a: "Yes! We have dedicated wholesale solutions for businesses. Contact us for bulk pricing." },
    { q: "Are your candies suitable for children?", a: "Yes, all products are made with child-safe ingredients and undergo strict quality checks." },
    { q: "Can I cancel my order?", a: "You can cancel within 2 hours of placing an order. Contact support immediately for assistance." },
];

// ===== STATE =====
let cart = JSON.parse(sessionStorage.getItem('beebu_cart') || '[]');
let wishlist = JSON.parse(sessionStorage.getItem('beebu_wishlist') || '[]');
let appliedCoupon = null;
let currentFilter = 'all';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('heroProducts', 8);
    renderReviews();
    renderFAQs();
    renderCartBadge();
    renderWishlistBadge();
    setupEventListeners();
    animateElements();
});

// ===== PRODUCT RENDERING =====
function renderProducts(containerId, count, filter = 'all') {
    const container = document.getElementById(containerId);
    if (!container) return;
    let filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    const toShow = filtered.slice(0, count);
    container.innerHTML = toShow.map((p, i) => createProductCard(p, i)).join('');
}

function createProductCard(p, index = 0) {
    const isWishlisted = wishlist.includes(p.id);
    const badgeClass = p.badge === 'best-seller' ? 'badge-new' : p.badge === 'popular' ? 'badge-popular' : 'badge-sale';
    const badgeText = p.badge === 'best-seller' ? 'Best Seller' : p.badge === 'popular' ? 'Popular' : p.badge === 'new' ? 'New' : 'Sale';
    const origPrice = p.originalPrice ? `<span class="original">PKR ${p.originalPrice}</span>` : '';
    return `<div class="product-card fade-in" style="animation-delay:${index * 0.05}s">
        <div class="product-img-wrap">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
            <span class="product-badge ${badgeClass}">${badgeText}</span>
            <div class="product-wishlist">
                <button class="btn-wishlist ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${p.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? '#FFD54A' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
            </div>
        </div>
        <div class="product-info">
            <div class="product-category">${p.category}</div>
            <h3 class="product-name">${p.name}</h3>
            <div class="product-weight">${p.weight}</div>
            <p class="product-desc">${p.shortDescription}</p>
            <div class="product-price-row">
                <div class="product-price">PKR ${p.price}${origPrice}</div>
            </div>
            <div style="font-size:0.8rem;color:var(--yellow-dark);margin-bottom:8px">${'<i class="fa-solid fa-star" style="color:var(--yellow)"></i>'.repeat(Math.floor(p.rating))} ${p.rating} (${p.reviewCount})</div>
            <div class="product-actions">
                <button class="btn btn-yellow btn-sm" onclick="addToCart('${p.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Add</button>
                <button class="btn btn-outline btn-sm" onclick="openQuickView('${p.id}')">Quick View</button>
            </div>
        </div>
    </div>`;
}

// ===== CART =====
function toggleWishlist() {
    if (wishlist.length > 0) showToast(`${wishlist.length} items in wishlist`);
    else showToast('Wishlist is empty');
}

function addToCart(productId) {
    const p = products.find(pr => pr.id === productId);
    if (!p) return;
    const existing = cart.find(item => item.id === productId);
    if (existing) existing.qty += 1;
    else cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 });
    saveCart();
    renderCartBadge();
    showToast(`${p.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
    renderCartBadge();
}

function updateCartQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) { removeFromCart(productId); return; }
    saveCart();
    renderCart();
    renderCartBadge();
}

function saveCart() {
    sessionStorage.setItem('beebu_cart', JSON.stringify(cart));
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = `<div class="cart-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg><p>Your cart is empty</p></div>`;
        totalEl.innerHTML = '<strong>Total: PKR 0</strong>';
        return;
    }
    let subtotal = 0;
    container.innerHTML = cart.map(item => {
        subtotal += item.price * item.qty;
        return `<div class="cart-item">
            <div class="cart-item-img"><img src="assets/Beebu_Chocolate_balls.png" alt="${item.name}"></div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">PKR ${item.price} × ${item.qty}</div>
                <div class="cart-item-qty">
                    <button onclick="updateCartQty('${item.id}', -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="updateCartQty('${item.id}', 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</button>
        </div>`;
    }).join('');
    const discount = appliedCoupon ? subtotal * 0.15 : 0;
    totalEl.innerHTML = `<div><small>Subtotal:</small> PKR ${subtotal}<br><small style="color:#10B981">Discount:</small> -PKR ${discount}</div><strong>Total: PKR ${subtotal - discount}</strong>`;
}

function renderCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function renderWishlistBadge() {
    const badge = document.getElementById('wishBadge');
    if (badge) badge.textContent = wishlist.length;
}

function toggleWishlist(productId) {
    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
        showToast('Removed from wishlist');
    } else {
        wishlist.push(productId);
        showToast('Added to wishlist! ❤️');
    }
    sessionStorage.setItem('beebu_wishlist', JSON.stringify(wishlist));
    renderWishlistBadge();
    document.querySelectorAll('.product-card').forEach(card => {
        const btn = card.querySelector('.btn-wishlist');
        if (btn) {
            const svg = btn.querySelector('svg');
            if (svg) svg.setAttribute('fill', wishlist.includes(productId) ? '#FFD54A' : 'none');
            btn.classList.toggle('active', wishlist.includes(productId));
        }
    });
}

function toggleCart() {
    const overlay = document.getElementById('cartOverlay');
    renderCart();
    overlay.classList.toggle('active');
}

// Close cart on overlay click
document.addEventListener('click', (e) => {
    const overlay = document.getElementById('cartOverlay');
    if (e.target === overlay) { overlay.classList.remove('active'); }
});

// Checkout
document.addEventListener('click', (e) => {
    if (e.target.id === 'checkoutBtn') {
        if (cart.length === 0) { showToast('Your cart is empty!'); return; }
        showToast('Order placed! 🎉 Cash on Delivery available.');
        cart = [];
        saveCart();
        renderCartBadge();
        document.getElementById('cartOverlay').classList.remove('active');
    }
});

// ===== COUPON =====
function applyCoupon() {
    const input = document.getElementById('couponInput');
    const msg = document.getElementById('couponMsg');
    if (!input) return;
    const code = input.value.trim().toUpperCase();
    if (code === 'BEEBU15') {
        appliedCoupon = true;
        msg.innerHTML = '<span style="color:#10B981">✓ 15% discount applied!</span>';
        input.value = '';
        renderCart();
    } else if (code === '') {
        msg.innerHTML = '<span style="color:#DC2626">Please enter a code</span>';
    } else {
        msg.innerHTML = '<span style="color:#DC2626">Invalid coupon code</span>';
    }
}

// ===== FILTER PRODUCTS =====
function filterProducts(cat, btn) {
    currentFilter = cat;
    if (btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    renderProducts('heroProducts', 8, cat);
    const shopContainer = document.getElementById('shopProducts');
    if (shopContainer) renderProducts('shopProducts', 20, cat);
}

// ===== SEARCH =====
function openSearch() {
    document.getElementById('searchOverlay').classList.add('active');
    setTimeout(() => document.getElementById('searchInput').focus(), 100);
}

function performSearch() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const results = document.getElementById('searchResults');
    if (!q || q.length < 2) { results.innerHTML = ''; return; }
    const matched = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q));
    results.innerHTML = matched.map(p => `<div class="search-result-item" onclick="location.href='shop.html'">
        <div class="sr-img">🍫</div>
        <div class="sr-info"><h4>${p.name}</h4><p>PKR ${p.price} · ${p.weight}</p></div>
    </div>`).join('') || '<div style="padding:20px;text-align:center;color:var(--gray)">No products found</div>';
}

function closeSearch() {
    document.getElementById('searchOverlay').classList.remove('active');
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
}

document.getElementById('searchOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'searchOverlay') closeSearch();
});

// ===== QUICK VIEW =====
function openQuickView(productId) {
    const p = products.find(pr => pr.id === productId);
    if (!p) return;
    const isWishlisted = wishlist.includes(p.id);
    const origPrice = p.originalPrice ? `<span style="text-decoration:line-through;color:#999;margin-left:8px">PKR ${p.originalPrice}</span>` : '';
    document.getElementById('modalContent').innerHTML = `
        <button class="modal-close" onclick="closeQuickView()">&times;</button>
        <div style="display:flex;gap:24px;align-items:center">
            <div style="width:120px;height:120px;background:var(--gray-light);border-radius:var(--radius);display:flex;align-items:center;justify-content:center"><img src="assets/Beebu_Chocolate_balls.png" alt="${p.name}" style="max-width:100%;max-height:100%"></div>
            <div>
                <div style="font-size:0.75rem;color:var(--yellow-dark);font-weight:700;text-transform:uppercase">${p.category}</div>
                <h3 style="font-size:1.2rem;color:var(--blue);margin:8px 0">${p.name}</h3>
                <div style="font-size:1.3rem;font-weight:800;color:var(--blue)">PKR ${p.price}${origPrice}</div>
                <p style="color:var(--gray);font-size:0.9rem;margin:8px 0">${p.description}</p>
                <div style="color:var(--yellow-dark);margin-bottom:16px">${'<i class="fa-solid fa-star" style="color:var(--yellow)"></i>'.repeat(Math.floor(p.rating))} ${p.rating} (${p.reviewCount})</div>
                <div style="display:flex;gap:8px">
                    <button class="btn btn-yellow" style="flex:1" onclick="addToCart('${p.id}');closeQuickView()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Add to Cart</button>
                    <button class="btn ${isWishlisted ? 'btn-yellow' : 'btn-outline'}" style="width:50px" onclick="toggleWishlist('${p.id}');closeQuickView()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? '#FFD54A' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </button>
                </div>
            </div>
        </div>`;
    document.getElementById('quickViewModal').classList.add('active');
}

function closeQuickView() {
    document.getElementById('quickViewModal').classList.remove('active');
}

document.getElementById('quickViewModal').addEventListener('click', (e) => {
    if (e.target.id === 'quickViewModal') closeQuickView();
});

// ===== REVIEWS =====
function renderReviews() {
    const container = document.getElementById('reviewsGrid');
    if (!container) return;
    container.innerHTML = reviews.map(t => `
        <div class="testimonial-card">
            <div class="testimonial-stars">${'<i class="fa-solid fa-star" style="color:var(--yellow)"></i>'.repeat(t.rating)}</div>
            <p class="testimonial-text">"${t.text}"</p>
            <div class="testimonial-author">
                <div class="testimonial-avatar">${t.avatar}</div>
                <div><div class="testimonial-name">${t.name}</div><div class="testimonial-location">${t.location}</div></div>
            </div>
        </div>
    `).join('');
}

// ===== FAQ =====
function renderFAQs() {
    const container = document.getElementById('faqList');
    if (!container) return;
    container.innerHTML = faqs.map(f => `
        <div class="faq-item" onclick="this.classList.toggle('active')">
            <div class="faq-question">
                <span>${f.q}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div class="faq-answer">${f.a}</div>
        </div>
    `).join('');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    document.getElementById('hamburger').addEventListener('click', () => {
        document.getElementById('navLinks').classList.toggle('active');
    });
    document.getElementById('cartClose').addEventListener('click', () => {
        document.getElementById('cartOverlay').classList.remove('active');
    });
    document.getElementById('searchBtn').addEventListener('click', openSearch);
    document.getElementById('wishlistBtn').addEventListener('click', () => {
        if (wishlist.length > 0) showToast(`${wishlist.length} items in wishlist`);
        else showToast('Wishlist is empty');
    });
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    window.addEventListener('scroll', () => {
        document.getElementById('header').classList.toggle('scrolled', window.scrollY > 50);
        document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
    });
    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => document.getElementById('navLinks').classList.remove('active'));
    });
}

// ===== TOAST =====
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== NEWSLETTER =====
function handleNewsletter(e) {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value;
    showToast('Welcome to the Beebu Family!');
    document.getElementById('newsletterEmail').value = '';
}

// ===== CONTACT =====
function handleContact(e) {
    e.preventDefault();
    showToast('Message sent! We will get back to you soon!');
    e.target.reset();
}

// ===== ANIMATIONS =====
function animateElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.product-card, .testimonial-card, .feature-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ===== KEYBOARD =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSearch();
        closeQuickView();
        document.getElementById('cartOverlay').classList.remove('active');
    }
});
