// Global Cart & Shop Management
const STORAGE_KEY = 'LZORA_CART';

// Pre-curated product database
const PRODUCTS = [
  // Earrings
  { id: 'ear-1', category: 'earrings', name: 'Royal Afghan Chandbali Jhumkas', price: 179, mrp: 399, tag: 'Oxidised Bestseller', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80', desc: 'Handcrafted German silver finish vintage mirror jhumkas.' },
  { id: 'ear-2', category: 'earrings', name: 'Korean Pearl Huggie Hoops', price: 149, mrp: 299, tag: 'Minimal Chic', image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80', desc: '18k gold-toned dainty freshwater imitation pearl hoops.' },
  { id: 'ear-3', category: 'earrings', name: 'Floral Enamel Pastel Studs', price: 129, mrp: 249, tag: 'Cute Aesthetic', image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=600&q=80', desc: 'Soft pink glazed alloy studs suitable for everyday college wear.' },
  { id: 'ear-4', category: 'earrings', name: 'Tribal Sun Oxidised Drops', price: 159, mrp: 349, tag: 'Boho Vibe', image: 'https://images.unsplash.com/photo-1596944210900-3445cd1630b5?auto=format&fit=crop&w=600&q=80', desc: 'Lightweight embossed sunburst earrings with tiny metallic beads.' },

  // Pendants & Chains
  { id: 'pen-1', category: 'pendants', name: 'Waterproof Snake Chain Choker', price: 219, mrp: 499, tag: 'Anti-Tarnish', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80', desc: 'Sleek herringbone link chain with premium triple-gold tone plating.' },
  { id: 'pen-2', category: 'pendants', name: 'Celeste Opal Moon Locket', price: 189, mrp: 429, tag: 'Romantic Aura', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80', desc: 'Iridescent moonstone pendant suspended on a gossamer thin gold chain.' },
  { id: 'pen-3', category: 'pendants', name: 'Double Layer Coin & Pearl Chain', price: 249, mrp: 549, tag: 'Trending Layered', image: 'https://images.unsplash.com/photo-1611591475155-42e9fba5ce55?auto=format&fit=crop&w=600&q=80', desc: 'Two attached layered chains with embossed Roman coin and baroque pearl.' },
  { id: 'pen-4', category: 'pendants', name: 'Dainty Butterfly Zircon Pendant', price: 169, mrp: 389, tag: 'Cute Girl Pick', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=600&q=80', desc: 'Sparkling cubic zirconia butterfly motif on micro cable chain.' },

  // Accessories & Combos
  { id: 'acc-1', category: 'accessories', name: 'Aesthetic Pastel Matte Claw Clip Duo', price: 99, mrp: 199, tag: 'Everyday Essential', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80', desc: 'Durable Korean resin hair catchers with soft matte pastel coating.' },
  { id: 'acc-2', category: 'accessories', name: 'Rose Gold Twisted Cuff Bracelet', price: 179, mrp: 399, tag: 'Adjustable', image: 'https://images.unsplash.com/photo-1611591475155-42e9fba5ce55?auto=format&fit=crop&w=600&q=80', desc: 'Minimalist openable cuff with smooth tapered end spheres.' },
  { id: 'acc-3', category: 'accessories', name: 'Silk Satin Scrunchie & Hair Bow', price: 89, mrp: 180, tag: 'Gentle on Hair', image: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&w=600&q=80', desc: 'Grade-A Mulberry feel soft satin scrunchie with detachable bow.' },
  { id: 'acc-4', category: 'accessories', name: 'Bohemian Multilayer Evil-Eye Anklet', price: 139, mrp: 299, tag: 'Summer Chic', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80', desc: 'Double beaded glass nazar charm anklet with extender hook.' }
];

function getCart() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, customName = null, customPrice = null, customDetails = null) {
  const cart = getCart();
  if (productId === 'custom_box') {
    cart.push({
      id: 'custom_' + Date.now(),
      name: customName || 'Custom Curated Hamper',
      price: customPrice,
      desc: customDetails,
      qty: 1,
      isCustom: true
    });
  } else {
    const item = PRODUCTS.find(p => p.id === productId);
    if (!item) return;
    const existing = cart.find(i => i.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        desc: item.desc,
        qty: 1
      });
    }
  }
  saveCart(cart);
  showToast('Added to your gift bag!');
}

function updateCartQty(id, delta) {
  let cart = getCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx !== -1) {
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) {
      cart.splice(idx, 1);
    }
  }
  saveCart(cart);
  if (typeof renderOrderReview === 'function') {
    renderOrderReview();
  }
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  if (typeof renderOrderReview === 'function') {
    renderOrderReview();
  }
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((acc, i) => acc + i.qty, 0);
  const elements = document.querySelectorAll('.cart-counter-badge');
  elements.forEach(el => {
    el.innerText = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-6 right-6 z-50 bg-[#2B2625] text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center space-x-2 animate-bounce';
  toast.innerHTML = `<span>✨</span><span>${msg}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2400);
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
