// Pay-Per-View System

// Constants
const WALLET_KEY = 'risadatube_wallet';
const PURCHASES_KEY = 'risadatube_purchases';

// Get wallet balance
function getWalletBalance() {
    const wallet = JSON.parse(localStorage.getItem(WALLET_KEY) || '{"balance": 0}');
    return wallet.balance;
}

// Add funds (simulated - in real app would use payment gateway)
function addFunds(amount) {
    const wallet = JSON.parse(localStorage.getItem(WALLET_KEY) || '{"balance": 0}');
    wallet.balance += amount;
    wallet.transactions = wallet.transactions || [];
    wallet.transactions.push({
        type: 'deposit',
        amount: amount,
        date: new Date().toISOString()
    });
    localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
    return wallet.balance;
}

// Check if user has purchased video
function hasPurchased(videoId) {
    const purchases = JSON.parse(localStorage.getItem(PURCHASES_KEY) || '[]');
    return purchases.some(p => p.videoId === videoId);
}

// Purchase video
function purchaseVideo(videoId, price) {
    const user = checkAuth ? checkAuth() : null;
    if (!user) {
        alert('Faça login primeiro!');
        return false;
    }
    
    const balance = getWalletBalance();
    if (balance < price) {
        alert('Saldo insuficiente! Adicione fundos à sua carteira.');
        return false;
    }
    
    // Deduct from wallet
    const wallet = JSON.parse(localStorage.getItem(WALLET_KEY) || '{"balance": 0}');
    wallet.balance -= price;
    wallet.transactions.push({
        type: 'purchase',
        amount: -price,
        videoId: videoId,
        date: new Date().toISOString()
    });
    localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
    
    // Add to purchases
    const purchases = JSON.parse(localStorage.getItem(PURCHASES_KEY) || '[]');
    purchases.push({
        videoId: videoId,
        price: price,
        date: new Date().toISOString()
    });
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
    
    return true;
}

// Show paywall overlay
function showPaywall(videoId, price) {
    const wrapper = document.getElementById('videoWrapper');
    const isFree = price === 0;
    
    const paywallHTML = `
        <div class="paywall-overlay" id="paywallOverlay">
            <div class="paywall-content">
                <i class="fas fa-lock paywall-icon"></i>
                <h2 class="paywall-title">${isFree ? 'Vídeo Gratuito' : 'Conteúdo Premium'}</h2>
                <div class="paywall-price">
                    ${isFree ? 'GRÁTIS' : `€${price.toFixed(2)}`}
                    ${!isFree ? '<span> / visualização</span>' : ''}
                </div>
                <ul class="paywall-features">
                    <li><i class="fas fa-check"></i> Acesso imediato</li>
                    <li><i class="fas fa-check"></i> Sem anúncios</li>
                    <li><i class="fas fa-check"></i> Qualidade HD</li>
                </ul>
                
                <button class="btn-buy" onclick="handlePurchase('${videoId}', ${price})">
                    <i class="fas ${isFree ? 'fa-play' : 'fa-shopping-cart'}"></i>
                    ${isFree ? 'Assistir Agora' : 'Comprar Agora'}>
                </button>
                
                <p class="paywall-note">
                    ${isFree ? '' : `Saldo disponível: €${getWalletBalance().toFixed(2)}`}
                </p>
            </div>
        </div>
    `;
    
    wrapper.insertAdjacentHTML('beforeend', paywallHTML);
}

// Handle purchase
function handlePurchase(videoId, price) {
    if (hasPurchased(videoId)) {
        removePaywall();
        return;
    }
    
    if (price === 0 || purchaseVideo(videoId, price)) {
        removePaywall();
        alert('Acesso liberado!');
    }
}

// Remove paywall
function removePaywall() {
    const paywall = document.getElementById('paywallOverlay');
    if (paywall) {
        paywall.remove();
    }
}

// Update video card with price tag
function addPriceTag(card, price) {
    const thumbnail = card.querySelector('.video-thumbnail');
    if (!thumbnail) return;
    
    const isFree = price === 0;
    const priceHTML = `
        <span class="price-tag ${isFree ? 'free' : ''}">
            ${isFree ? 'GRÁTIS' : `€${price.toFixed(2)}`}
        </span>
    `;
    
    thumbnail.insertAdjacentHTML('beforeend', priceHTML);
}

// Initialize wallet (add starting balance for testing)
function initWallet() {
    if (!localStorage.getItem(WALLET_KEY)) {
        localStorage.setItem(WALLET_KEY, JSON.stringify({
            balance: 10.00, // Starting balance for testing
            transactions: []
        }));
    }
}

// Initialize on page load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initWallet();
    });
}