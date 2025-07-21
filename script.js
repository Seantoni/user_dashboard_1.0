// SimpleGo Enhanced Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard functionality
    initializeDashboard();
});

function initializeDashboard() {
    // Enhanced copy referral code functionality
    initializeCopyButton();
    
    // Initialize rewards carousel
    initializeRewardsCarousel();
    
    // Banner carousel disabled - using single banner
    
    // Initialize historic transactions pagination on the main page
    initializeHistoricTransactionsPagination();
    
    // Initialize balance counter animation
    initializeBalanceCounter();
    
    // Initialize welcome modal with bulletproof system
    initializeWelcomeModal();
}

// BULLETPROOF MODAL SYSTEM
function initializeWelcomeModal() {
    const welcomeModal = document.getElementById('welcomeModal');
    const closeWelcomeModalBtn = document.getElementById('closeWelcomeModal');
    const gotItBtn = document.getElementById('gotItBtn');
    const modalDialog = welcomeModal?.querySelector('.modal-dialog');
    
    if (!welcomeModal || !closeWelcomeModalBtn || !gotItBtn || !modalDialog) return;

    // Force remove any existing event listeners by cloning elements
    const cleanCloseBtn = closeWelcomeModalBtn.cloneNode(true);
    const cleanGotItBtn = gotItBtn.cloneNode(true);
    closeWelcomeModalBtn.parentNode.replaceChild(cleanCloseBtn, closeWelcomeModalBtn);
    gotItBtn.parentNode.replaceChild(cleanGotItBtn, gotItBtn);

    // ALWAYS show modal on every page load (no session storage check)
    setTimeout(() => {
        welcomeModal.style.display = 'flex';
        welcomeModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Force focus trap
        welcomeModal.setAttribute('tabindex', '-1');
        welcomeModal.focus();
        
        // Trigger confetti explosion after modal is visible
        setTimeout(() => {
            createConfettiExplosion();
        }, 300);
    }, 500);

    // Single, clean close function
    function closeModal() {
        welcomeModal.classList.remove('show');
        setTimeout(() => {
            welcomeModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    // Add event listeners only once
    cleanCloseBtn.addEventListener('click', closeModal, { once: false });
    cleanGotItBtn.addEventListener('click', closeModal, { once: false });

    // Handle "Ver todas" CTA click
    const verTodasCTA = modalDialog.querySelector('.highlight-cta');
    if (verTodasCTA) {
        verTodasCTA.addEventListener('click', function(e) {
            // Allow the link to work normally
            closeModal();
        });
    }

    // Prevent ALL other closing mechanisms
    modalDialog.addEventListener('click', function(e) {
        // Don't prevent default for links
        if (e.target.tagName === 'A' || e.target.closest('a')) {
            return;
        }
        e.stopPropagation();
            e.preventDefault();
    });

    welcomeModal.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
    });

    // Block escape key globally for this modal
    const escapeHandler = function(e) {
        if (e.key === 'Escape' && welcomeModal.classList.contains('show')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    };

    document.addEventListener('keydown', escapeHandler, true);
    document.addEventListener('keyup', escapeHandler, true);
}

// CONFETTI EXPLOSION SYSTEM
function createConfettiExplosion() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    confettiContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2500;
        overflow: hidden;
    `;
    
    document.body.appendChild(confettiContainer);
    
    // Create confetti pieces
    const colors = ['#6B64DB', '#8A84E2', '#D4E333', '#FF9800', '#4CAF50', '#E91E63', '#00BCD4'];
    const shapes = ['circle', 'square', 'triangle'];
    
    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            createConfettiPiece(confettiContainer, colors, shapes);
        }, i * 10);
            }
    
    // Remove confetti container after animation
    setTimeout(() => {
        if (confettiContainer.parentNode) {
            confettiContainer.remove();
                }
    }, 4000);
}

function createConfettiPiece(container, colors, shapes) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size = Math.random() * 8 + 4;
    
    // Random starting position (from top of screen)
    const startX = Math.random() * window.innerWidth;
    const startY = -10;
    
    // Random animation properties
    const fallDistance = window.innerHeight + 100;
    const rotation = Math.random() * 720 - 360;
    const drift = Math.random() * 200 - 100;
    const duration = Math.random() * 2000 + 2000;
    
    confetti.style.cssText = `
        position: absolute;
        left: ${startX}px;
        top: ${startY}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        opacity: 0.9;
        animation: confetti-fall ${duration}ms linear forwards;
        z-index: 2501;
    `;
    
    // Shape-specific styles
    if (shape === 'circle') {
        confetti.style.borderRadius = '50%';
    } else if (shape === 'triangle') {
        confetti.style.width = '0';
        confetti.style.height = '0';
        confetti.style.background = 'transparent';
        confetti.style.borderLeft = `${size/2}px solid transparent`;
        confetti.style.borderRight = `${size/2}px solid transparent`;
        confetti.style.borderBottom = `${size}px solid ${color}`;
}

    // Create unique animation
    const animationName = `confetti-fall-${Math.random().toString(36).substr(2, 9)}`;
    const keyframes = `
        @keyframes ${animationName} {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 1;
}
            100% {
                transform: translateY(${fallDistance}px) translateX(${drift}px) rotate(${rotation}deg);
                opacity: 0;
            }
        }
    `;
    
    // Add keyframes to page
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    
    confetti.style.animation = `${animationName} ${duration}ms linear forwards`;
    
    container.appendChild(confetti);
    
    // Clean up
    setTimeout(() => {
        if (confetti.parentNode) {
            confetti.remove();
        }
        if (style.parentNode) {
            style.remove();
        }
    }, duration + 100);
}

function initializeHistoricTransactionsPagination() {
    const transactionsContainer = document.querySelector('.historic-transactions-section .transactions-table-container');
    if (!transactionsContainer) return;

    const rows = transactionsContainer.querySelectorAll('.transaction-row');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');
    
    if (!rows.length || !prevPageBtn || !nextPageBtn || !pageInfo) return;

    const itemsPerPage = 10;
    let currentPage = 1;
    const totalPages = Math.ceil(rows.length / itemsPerPage);
    
    function showPage(page) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        rows.forEach((row, index) => {
            if (index >= startIndex && index < endIndex) {
                row.style.display = 'flex';
            } else {
                row.style.display = 'none';
            }
        });

        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
                }
            });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
        }
    });

    // Initial setup
    showPage(currentPage);
}

// ================================
// ENHANCED COPY FUNCTIONALITY
// ================================
function initializeCopyButton() {
    const copyButton = document.getElementById('copyButton');
    const referralCode = document.getElementById('referralCode');
    
    if (copyButton && referralCode) {
        copyButton.addEventListener('click', async function() {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(referralCode.value);
                        showCopySuccess();
                } else {
                    fallbackCopy();
                }
            } catch (err) {
                console.error('Failed to copy text: ', err);
                showCopyError();
            }
        });
    }
}

function fallbackCopy() {
    const referralCode = document.getElementById('referralCode');
    try {
        referralCode.select();
        referralCode.setSelectionRange(0, 99999);
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('Fallback copy failed: ', err);
    }
}

function showCopySuccess() {
    const copyButton = document.getElementById('copyButton');
    const originalText = copyButton.textContent;
    
    copyButton.textContent = '¡Copiado!';
    copyButton.style.background = 'var(--success)';
    
    setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.style.background = 'var(--primary)';
    }, 2000);
}

function showCopyError() {
    const copyButton = document.getElementById('copyButton');
    const originalText = copyButton.textContent;
    
    copyButton.textContent = 'Error';
    copyButton.style.background = 'var(--danger)';
    
    setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.style.background = 'var(--primary)';
    }, 2000);
}

// Enhanced reward card removal with confirmation
function removeRewardCard(cardId) {
    const card = document.querySelector(`[data-card-id="${cardId}"]`);
    if (!card) return;
    
    // Get the business name for the confirmation message
    const businessName = card.querySelector('.reward-card-title').textContent.split(' en')[0];
    
    // Show confirmation dialog
    showRemoveConfirmation(businessName, () => {
        animateCardRemoval(card, cardId);
    });
}

function showRemoveConfirmation(businessName, onConfirm) {
    // Create confirmation modal
    const confirmModal = document.createElement('div');
    confirmModal.className = 'remove-confirmation-overlay';
    confirmModal.innerHTML = `
        <div class="remove-confirmation-dialog">
            <div class="remove-confirmation-header">
                <h3>¿Eliminar tarjeta de lealtad?</h3>
            </div>
            <div class="remove-confirmation-body">
                <p>¿Estás seguro de que quieres eliminar tu tarjeta de <strong>${businessName}</strong>?</p>
                <p class="warning-text">Esta acción no se podrá revertir y perderás todo el progreso que hayas hecho en esta tarjeta.</p>
            </div>
            <div class="remove-confirmation-footer">
                <button class="cancel-btn">Cancelar</button>
                <button class="confirm-btn">Eliminar</button>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .remove-confirmation-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }
        
        .remove-confirmation-dialog {
            background: white;
            border-radius: 16px;
            max-width: 400px;
            width: 90%;
            max-height: 90vh;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            animation: slideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .remove-confirmation-header {
            padding: 24px 24px 0;
            text-align: center;
        }
        
        .remove-confirmation-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #1d1d1f;
        }
        
        .remove-confirmation-body {
            padding: 16px 24px 24px;
            text-align: center;
        }
        
        .remove-confirmation-body p {
            margin: 0 0 12px 0;
            font-size: 14px;
            line-height: 1.4;
            color: #333;
        }
        
        .warning-text {
            color: #d73527 !important;
            font-size: 13px !important;
            margin-top: 8px !important;
        }
        
        .remove-confirmation-footer {
            padding: 0 24px 24px;
            display: flex;
            gap: 12px;
        }
        
        .cancel-btn, .confirm-btn {
            flex: 1;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
        }
        
        .cancel-btn {
            background: #f5f5f7;
            color: #1d1d1f;
        }
        
        .cancel-btn:hover {
            background: #e8e8ed;
        }
        
        .confirm-btn {
            background: #d73527;
            color: white;
        }
        
        .confirm-btn:hover {
            background: #c42e20;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(20px) scale(0.95);
            }
            to { 
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @media (max-width: 480px) {
            .remove-confirmation-dialog {
                max-width: 340px;
            }
            
            .remove-confirmation-header h3 {
                font-size: 16px;
            }
            
            .remove-confirmation-body p {
                font-size: 13px;
            }
            
            .warning-text {
                font-size: 12px !important;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(confirmModal);
    document.body.style.overflow = 'hidden';
    
    // Handle buttons
    const cancelBtn = confirmModal.querySelector('.cancel-btn');
    const confirmBtn = confirmModal.querySelector('.confirm-btn');
    
    function closeModal() {
        confirmModal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (confirmModal.parentNode) {
                confirmModal.remove();
                style.remove();
                document.body.style.overflow = '';
            }
        }, 300);
    }
    
    cancelBtn.addEventListener('click', closeModal);
    
    confirmBtn.addEventListener('click', () => {
        closeModal();
        onConfirm();
    });
    
    // Close on backdrop click
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Add fadeOut animation
    const fadeOutStyle = document.createElement('style');
    fadeOutStyle.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(fadeOutStyle);
}

function animateCardRemoval(card, cardId) {
    card.style.transform = 'scale(0.8) rotateX(90deg)';
    card.style.opacity = '0';
    
    setTimeout(() => {
        card.remove();
    }, 300);
}

// Terms and Conditions Modal functionality
function openTermsModal(cardType) {
    const modal = document.getElementById('termsModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalTitle || !modalContent) return;
    
    // Set the title and content based on card type
    const content = getTermsContent(cardType);
    modalTitle.textContent = content.title;
    modalContent.innerHTML = content.html;
    
    // Show the modal with animation
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeTermsModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', handleEscapeKey);
}

function closeTermsModal() {
    const modal = document.getElementById('termsModal');
    if (!modal) return;
    
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // Remove event listeners
    document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeTermsModal();
    }
}

function getTermsContent(cardType) {
    const content = {
        'monthly-challenge': {
            title: 'Términos y Condiciones - Reto del Mes',
            html: `
                <h4>🏆 Reto del Mes - Diciembre 2024</h4>
                <p><strong>Objetivo:</strong> Visita 4 restaurantes diferentes durante el mes de diciembre para obtener una recompensa de $20 en créditos.</p>
                
                <h5>Condiciones del Reto</h5>
                <ul>
                    <li>El reto debe completarse entre el 1 y 31 de diciembre de 2024</li>
                    <li>Cada visita debe ser a un restaurante diferente registrado en SimpleGo</li>
                    <li>El gasto mínimo por visita debe ser de $10 USD</li>
                    <li>Los créditos se otorgarán automáticamente al completar las 4 visitas</li>
                    <li>Solo puede participar una vez por usuario al mes</li>
                </ul>
                
                <h5>Elegibilidad</h5>
                <ul>
                    <li>Usuario activo de SimpleGo con cuenta verificada</li>
                    <li>Sin infracciones previas en los términos de servicio</li>
                    <li>Disponible solo para usuarios mayores de 18 años</li>
                </ul>
                
                <h5>Limitaciones</h5>
                <p>Los créditos obtenidos expiran 90 días después de ser otorgados. SimpleGo se reserva el derecho de modificar o cancelar este reto en cualquier momento. En caso de actividad fraudulenta, el usuario será descalificado automáticamente.</p>
                
                <p><small>Última actualización: 1 de diciembre, 2024</small></p>
            `
        },
        'olive-garden': {
            title: 'Términos y Condiciones - Olive Garden',
            html: `
                <h4>🍰 Postre Gratis en Olive Garden</h4>
                <p><strong>Recompensa:</strong> Obtén un postre gratuito al completar 10 visitas a Olive Garden.</p>
                
                <h5>Condiciones de la Tarjeta</h5>
                <ul>
                    <li>Válido solo en ubicaciones participantes de Olive Garden</li>
                    <li>Cada visita debe tener un gasto mínimo de $15 USD</li>
                    <li>Los sellos se otorgan una vez por día por usuario</li>
                    <li>El postre debe canjearse dentro de 30 días después de completar la tarjeta</li>
                    <li>No acumulable con otras promociones</li>
                </ul>
                
                <h5>Postres Disponibles</h5>
                <ul>
                    <li>Tiramisu clásico</li>
                    <li>Cheesecake de fresa</li>
                    <li>Mousse de chocolate</li>
                    <li>Gelato (sabores disponibles según temporada)</li>
                </ul>
                
                <h5>Restricciones</h5>
                <p>El postre gratuito no incluye bebidas adicionales. Válido para cenar en restaurante únicamente, no aplica para órdenes para llevar o delivery. La promoción no tiene valor monetario y no puede ser transferida.</p>
                
                <h5>Cancelación</h5>
                <p>Puedes cancelar esta tarjeta de recompensas en cualquier momento, pero perderás todo el progreso acumulado. Los sellos no son reembolsables.</p>
                
                <p><small>Términos sujetos a cambios. Última actualización: 15 de noviembre, 2024</small></p>
            `
        },
        'papa-johns': {
            title: 'Términos y Condiciones - Papa Johns',
            html: `
                <h4>🍕 Pizza Gratis en Papa Johns</h4>
                <p><strong>Recompensa:</strong> Obtén una pizza mediana gratuita al completar 10 visitas a Papa Johns.</p>
                
                <h5>Condiciones de la Tarjeta</h5>
                <ul>
                    <li>Válido en todas las ubicaciones de Papa Johns participantes</li>
                    <li>Gasto mínimo de $12 USD por visita para obtener sello</li>
                    <li>Máximo un sello por día por usuario</li>
                    <li>La pizza gratuita debe canjearse dentro de 45 días</li>
                    <li>Disponible para órdenes en tienda, para llevar y delivery</li>
                </ul>
                
                <h5>Pizzas Elegibles</h5>
                <ul>
                    <li>Cualquier pizza mediana del menú regular</li>
                    <li>Incluye hasta 3 ingredientes adicionales sin costo</li>
                    <li>Masa disponible: tradicional, delgada o pan</li>
                    <li>No incluye pizzas especiales o de edición limitada</li>
                </ul>
                
                <h5>Términos Adicionales</h5>
                <p>Los costos de delivery y propinas no están incluidos en la promoción. Para órdenes de delivery, se aplican las tarifas normales de envío. La pizza gratuita no puede ser cambiada por efectivo o crédito en tienda.</p>
                
                <h5>Validez y Transferencia</h5>
                <p>Esta tarjeta es personal e intransferible. Los sellos acumulados no pueden ser combinados entre diferentes cuentas de usuario. Papa Johns se reserva el derecho de verificar la elegibilidad en cualquier momento.</p>
                
                <p><small>Promoción válida hasta agotar existencias. Última actualización: 20 de noviembre, 2024</small></p>
            `
        }
    };
    
    return content[cardType] || {
        title: 'Términos y Condiciones',
        html: '<p>No se encontraron términos específicos para esta tarjeta.</p>'
    };
}

// Make modal functions globally available
window.openTermsModal = openTermsModal;
window.closeTermsModal = closeTermsModal;

// ================================
// BALANCE COUNTER ANIMATION
// ================================
function initializeBalanceCounter() {
    const balanceElement = document.querySelector('.balance-amount');
    if (!balanceElement) return;
    
    // Get the final balance value
    const originalText = balanceElement.textContent;
    const finalValue = parseFloat(originalText.replace('$', '').replace(',', ''));
    
    if (isNaN(finalValue)) return;

    // Start counter from 0
    let currentValue = 0;
    const startTime = performance.now();
    const duration = 3000; // 3 seconds duration
    
    // Set initial value to 0
    balanceElement.textContent = '$0.00';
    
    function updateCounter(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function: starts fast, slows down at the end
        // Using easeOutCubic for smooth deceleration
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        currentValue = finalValue * easedProgress;
        
        // Format the number with proper decimals
        const formattedValue = currentValue.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        balanceElement.textContent = formattedValue;
        
        // Continue animation if not complete
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Ensure final value is exact
            balanceElement.textContent = '$' + finalValue.toFixed(2);
        }
    }
    
    // Start the animation after a short delay
    setTimeout(() => {
        requestAnimationFrame(updateCounter);
    }, 500);
}



// ================================
// REWARDS CAROUSEEL FUNCTIONALITY
// ================================
function initializeRewardsCarousel() {
    const carousel = document.querySelector('.rewards-cards-grid');
    const indicators = document.querySelectorAll('.scroll-indicator');
    
    if (!carousel || !indicators.length) return;
    
    // Handle scroll events to update indicators
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateActiveIndicator();
        }, 100);
    });
    
    // Handle indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            scrollToCard(index);
        });
    });
    
    // Touch/swipe handling for better mobile experience
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;
    
    carousel.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        carousel.style.cursor = 'grabbing';
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.5;
        carousel.scrollLeft = scrollLeft - walk;
    });
    
    carousel.addEventListener('touchend', () => {
        isDown = false;
        carousel.style.cursor = 'grab';
    });
    
    function updateActiveIndicator() {
        const scrollLeft = carousel.scrollLeft;
        const cardWidth = carousel.querySelector('.reward-card').offsetWidth;
        const containerWidth = carousel.offsetWidth;
        
        // Calculate which card is most visible
        let activeIndex = 0;
        const cards = carousel.querySelectorAll('.reward-card');
        
        cards.forEach((card, index) => {
            const cardLeft = card.offsetLeft;
            const cardCenter = cardLeft + (cardWidth / 2);
            const containerCenter = scrollLeft + (containerWidth / 2);
            
            if (Math.abs(cardCenter - containerCenter) < cardWidth / 2) {
                activeIndex = index;
            }
        });
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === activeIndex);
        });
    }
    
    function scrollToCard(index) {
        const cards = carousel.querySelectorAll('.reward-card');
        if (cards[index]) {
            const cardLeft = cards[index].offsetLeft;
            const containerWidth = carousel.offsetWidth;
            const cardWidth = cards[index].offsetWidth;
            
            // Center the card in the viewport
            const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);
            
            carousel.scrollTo({
                left: Math.max(0, scrollPosition),
                behavior: 'smooth'
            });
        }
    }
    

    
    // Initialize first indicator as active
    setTimeout(() => {
        updateActiveIndicator();
    }, 500);
    
    // Update indicators on resize
    window.addEventListener('resize', () => {
        setTimeout(() => {
            updateActiveIndicator();
        }, 100);
    });
}

