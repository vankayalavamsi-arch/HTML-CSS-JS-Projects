let isDark = localStorage.getItem('ecDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('ecDark', !isDark);
    isDark = !isDark;
}

const products = [
    { id: 1, name: 'MacBook Pro', cat: 'laptop', price: 1299, emoji: '💻' },
    { id: 2, name: 'iPhone 15', cat: 'phone', price: 999, emoji: '📱' },
    { id: 3, name: 'AirPods Pro', cat: 'audio', price: 249, emoji: '🎧' },
    { id: 4, name: 'Gaming Laptop', cat: 'laptop', price: 1500, emoji: '🖥️' },
    { id: 5, name: 'Android Phone', cat: 'phone', price: 699, emoji: '📲' },
    { id: 6, name: 'Speaker', cat: 'audio', price: 99, emoji: '🔊' }
];

let cart = [];
let currentFilter = 'all';

function filter(cat, btn) {
    currentFilter = cat;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGrid();
}

function renderGrid() {
    let data = currentFilter === 'all' ? products : products.filter(p => p.cat === currentFilter);
    document.getElementById('grid').innerHTML = data.map(p => `
        <div class="product">
            <div class="img">${p.emoji}</div>
            <div class="info">
                <h3>${p.name}</h3>
                <p>High quality tech</p>
                <div class="price">$${p.price}</div>
                <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const item = cart.find(c => c.id === id);
    if (item) {
        item.qty++;
    } else {
        cart.push({ ...products.find(p => p.id === id), qty: 1 });
    }
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    renderCart();
}

function changeQty(id, d) {
    const item = cart.find(c => c.id === id);
    item.qty += d;
    if (item.qty <= 0) {
        removeFromCart(id);
    } else {
        renderCart();
    }
}

function renderCart() {
    document.getElementById('count').innerText = cart.reduce((a, c) => a + c.qty, 0);
    document.getElementById('total').innerText = cart.reduce((a, c) => a + c.price * c.qty, 0);
    
    document.getElementById('cartItems').innerHTML = cart.map(c => `
        <div class="cart-item">
            <h4>${c.name}</h4>
            <button class="sm" onclick="changeQty(${c.id}, -1)">-</button>
            <span>${c.qty}</span>
            <button class="sm" onclick="changeQty(${c.id}, 1)">+</button>
            <span>$${c.price * c.qty}</span>
            <button class="sm" onclick="removeFromCart(${c.id})">❌</button>
        </div>
    `).join('');
}

renderGrid();