document.addEventListener('DOMContentLoaded', function() {
    // BULLETPROOF REWARDS MODAL SYSTEM
    const rewardsWelcomeModal = document.getElementById('rewardsWelcomeModal');
    
    if (rewardsWelcomeModal) {
        const closeRewardsWelcomeBtn = document.getElementById('closeRewardsWelcomeModal');
        const startRewardsBtn = document.getElementById('startRewardsBtn');
        const rewardsModalDialog = rewardsWelcomeModal.querySelector('.modal-dialog');

        if (closeRewardsWelcomeBtn && startRewardsBtn && rewardsModalDialog) {
            // Force remove any existing event listeners by cloning elements
            const cleanCloseBtn = closeRewardsWelcomeBtn.cloneNode(true);
            const cleanStartBtn = startRewardsBtn.cloneNode(true);
            closeRewardsWelcomeBtn.parentNode.replaceChild(cleanCloseBtn, closeRewardsWelcomeBtn);
            startRewardsBtn.parentNode.replaceChild(cleanStartBtn, startRewardsBtn);

            // ALWAYS show modal on every page load
            setTimeout(() => {
                rewardsWelcomeModal.style.display = 'flex';
                rewardsWelcomeModal.classList.add('show');
                document.body.style.overflow = 'hidden';
                
                // Force focus trap
                rewardsWelcomeModal.setAttribute('tabindex', '-1');
                rewardsWelcomeModal.focus();
            }, 500);

            // Single, clean close function
            function closeRewardsModal() {
                rewardsWelcomeModal.classList.remove('show');
                setTimeout(() => {
                    rewardsWelcomeModal.style.display = 'none';
                    document.body.style.overflow = '';
                }, 300);
            }

            // Add event listeners only once
            cleanCloseBtn.addEventListener('click', closeRewardsModal, { once: false });
            cleanStartBtn.addEventListener('click', closeRewardsModal, { once: false });

            // Prevent ALL other closing mechanisms
            rewardsModalDialog.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
            });

            rewardsWelcomeModal.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
            });

            // Block escape key globally for this modal
            const escapeHandler = function(e) {
                if (e.key === 'Escape' && rewardsWelcomeModal.classList.contains('show')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            };

            document.addEventListener('keydown', escapeHandler, true);
            document.addEventListener('keyup', escapeHandler, true);
        }
    }

    // Existing rewards functionality
    const addButtons = document.querySelectorAll('.cta-button.add');

    // Handle add button clicks
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Change button to "added" state
            this.classList.remove('add');
            this.classList.add('added');
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-check"></i> Agregada';

            // Update the row to active state
            const row = this.closest('.rewards-row');
            row.classList.add('active');

            // Show success message
            const businessName = row.querySelector('.business-name').textContent;
            showNotification(`¡${businessName} agregado a tus recompensas!`, 'success');
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 300px;
            animation: slideIn 0.3s ease;
            ${type === 'success' ? 'background: #4CAF50;' : ''}
            ${type === 'warning' ? 'background: #FF9800;' : ''}
            ${type === 'info' ? 'background: #6b64db;' : ''}
        `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
            line-height: 1;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }

    // Hover effects removed per user request

    // Terms and Conditions Modal functionality
    window.openTermsModal = function(cardType) {
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
    };

    window.closeTermsModal = function() {
        const modal = document.getElementById('termsModal');
        if (!modal) return;
        
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Remove event listeners
        document.removeEventListener('keydown', handleEscapeKey);
    };

    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            closeTermsModal();
        }
    }

    function getTermsContent(cardType) {
        const content = {
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
            },
            'starbucks': {
                title: 'Términos y Condiciones - Starbucks',
                html: `
                    <h4>☕ Bebida Gratis en Starbucks</h4>
                    <p><strong>Recompensa:</strong> Obtén una bebida gratuita al completar 12 visitas a Starbucks.</p>
                    
                    <h5>Condiciones de la Tarjeta</h5>
                    <ul>
                        <li>Válido en todas las ubicaciones de Starbucks participantes</li>
                        <li>Gasto mínimo de $8 USD por visita para obtener sello</li>
                        <li>Máximo un sello por día por usuario</li>
                        <li>La bebida gratuita debe canjearse dentro de 60 días</li>
                        <li>Disponible para órdenes en tienda, para llevar y delivery</li>
                    </ul>
                    
                    <h5>Bebidas Elegibles</h5>
                    <ul>
                        <li>Cualquier bebida del menú regular (hasta tamaño Venti)</li>
                        <li>Incluye personalizaciones sin costo adicional</li>
                        <li>Frappuccinos, lattes, americanos, tés y más</li>
                        <li>No incluye bebidas de temporada limitada o premium</li>
                    </ul>
                    
                    <h5>Restricciones</h5>
                    <p>La bebida gratuita no incluye alimentos adicionales. Válido para consumo en tienda, para llevar y delivery. No puede ser combinado con otras promociones de Starbucks Rewards.</p>
                    
                    <h5>Términos Adicionales</h5>
                    <p>Esta promoción es independiente del programa oficial Starbucks Rewards. Los puntos acumulados en SimpleGo no afectan tu cuenta Starbucks Rewards y viceversa.</p>
                    
                    <p><small>Términos sujetos a cambios. Última actualización: 10 de diciembre, 2024</small></p>
                `
            },
            'mcdonalds': {
                title: 'Términos y Condiciones - McDonald\'s',
                html: `
                    <h4>🍔 Combo Gratis en McDonald's</h4>
                    <p><strong>Recompensa:</strong> Obtén un combo mediano gratuito al completar 15 visitas a McDonald's.</p>
                    
                    <h5>Condiciones de la Tarjeta</h5>
                    <ul>
                        <li>Válido en todas las ubicaciones de McDonald's participantes</li>
                        <li>Gasto mínimo de $10 USD por visita para obtener sello</li>
                        <li>Máximo un sello por día por usuario</li>
                        <li>El combo gratuito debe canjearse dentro de 30 días</li>
                        <li>Disponible para órdenes en tienda, para llevar, drive-thru y delivery</li>
                    </ul>
                    
                    <h5>Combos Elegibles</h5>
                    <ul>
                        <li>Cualquier combo mediano del menú regular</li>
                        <li>Big Mac, Quarter Pounder, McNuggets (10 piezas), etc.</li>
                        <li>Incluye papas medianas y bebida mediana</li>
                        <li>No incluye combos de desayuno o ediciones limitadas</li>
                    </ul>
                    
                    <h5>Personalizaciones</h5>
                    <p>Puedes personalizar tu combo gratuito con ingredientes disponibles sin costo adicional. Las mejoras de tamaño (Large) requieren pago de la diferencia.</p>
                    
                    <h5>Términos Adicionales</h5>
                    <p>Esta promoción es independiente de la app oficial de McDonald's. Los puntos no se combinan con McCafé Rewards u otras promociones internas de McDonald's.</p>
                    
                    <p><small>Válido por tiempo limitado. Última actualización: 5 de diciembre, 2024</small></p>
                `
            },
            'chipotle': {
                title: 'Términos y Condiciones - Chipotle',
                html: `
                    <h4>🌮 Burrito Gratis en Chipotle</h4>
                    <p><strong>Recompensa:</strong> Obtén un burrito gratuito al completar 8 visitas a Chipotle.</p>
                    
                    <h5>Condiciones de la Tarjeta</h5>
                    <ul>
                        <li>Válido en todas las ubicaciones de Chipotle participantes</li>
                        <li>Gasto mínimo de $9 USD por visita para obtener sello</li>
                        <li>Máximo un sello por día por usuario</li>
                        <li>El burrito gratuito debe canjearse dentro de 45 días</li>
                        <li>Disponible para órdenes en tienda, para llevar y delivery</li>
                    </ul>
                    
                    <h5>Opciones de Burrito</h5>
                    <ul>
                        <li>Cualquier burrito del menú regular</li>
                        <li>Pollo, carne asada, carnitas, barbacoa o sofritas</li>
                        <li>Incluye todos los ingredientes estándar sin costo adicional</li>
                        <li>Guacamole y queso incluidos (normalmente costo extra)</li>
                    </ul>
                    
                    <h5>Restricciones</h5>
                    <p>El burrito gratuito no incluye bebidas o acompañamientos adicionales. No válido para bowls, tacos o quesadillas - solo burritos. No puede ser dividido en múltiples órdenes.</p>
                    
                    <h5>Política de Frescura</h5>
                    <p>Como siempre en Chipotle, si no estás satisfecho con tu burrito gratuito, te haremos uno nuevo sin costo adicional. Garantizamos ingredientes frescos y de calidad.</p>
                    
                    <p><small>Términos sujetos a cambios. Última actualización: 8 de diciembre, 2024</small></p>
                `
            },
            'kfc': {
                title: 'Términos y Condiciones - KFC',
                html: `
                    <h4>🍗 Bucket Gratis en KFC</h4>
                    <p><strong>Recompensa:</strong> Obtén un bucket familiar gratuito al completar 12 visitas a KFC.</p>
                    
                    <h5>Condiciones de la Tarjeta</h5>
                    <ul>
                        <li>Válido en todas las ubicaciones de KFC participantes</li>
                        <li>Gasto mínimo de $14 USD por visita para obtener sello</li>
                        <li>Máximo un sello por día por usuario</li>
                        <li>El bucket gratuito debe canjearse dentro de 30 días</li>
                        <li>Disponible para órdenes en tienda, para llevar y delivery</li>
                    </ul>
                    
                    <h5>Opciones de Bucket</h5>
                    <ul>
                        <li>Bucket familiar de 8 piezas de pollo Original Recipe</li>
                        <li>Opción de mezcla: Original Recipe y Extra Crispy</li>
                        <li>Incluye 2 acompañamientos familiares a elegir</li>
                        <li>Incluye 4 galletas de mantequilla</li>
                    </ul>
                    
                    <h5>Acompañamientos Disponibles</h5>
                    <ul>
                        <li>Puré de papa con gravy</li>
                        <li>Ensalada de col</li>
                        <li>Macarrones con queso</li>
                        <li>Ejotes verdes</li>
                        <li>Papas fritas familiares</li>
                    </ul>
                    
                    <h5>Términos Adicionales</h5>
                    <p>El bucket familiar está diseñado para 3-4 personas. No puede ser cambiado por piezas individuales o combos. Las bebidas se venden por separado.</p>
                    
                    <p><small>Sujeto a disponibilidad de ingredientes. Última actualización: 12 de diciembre, 2024</small></p>
                `
            },
            'subway': {
                title: 'Términos y Condiciones - Subway',
                html: `
                    <h4>🥗 Sub Gratis en Subway</h4>
                    <p><strong>Recompensa:</strong> Obtén un sub de 12 pulgadas gratuito al completar 10 visitas a Subway.</p>
                    
                    <h5>Condiciones de la Tarjeta</h5>
                    <ul>
                        <li>Válido en todas las ubicaciones de Subway participantes</li>
                        <li>Gasto mínimo de $8 USD por visita para obtener sello</li>
                        <li>Máximo un sello por día por usuario</li>
                        <li>El sub gratuito debe canjearse dentro de 45 días</li>
                        <li>Disponible para órdenes en tienda, para llevar y delivery</li>
                    </ul>
                    
                    <h5>Opciones de Sub</h5>
                    <ul>
                        <li>Cualquier sub de 12" del menú regular</li>
                        <li>Incluye todos los vegetales y condimentos sin costo</li>
                        <li>Opción de pan: italiano, integral, hierbas y queso, etc.</li>
                        <li>No incluye subs premium o de edición limitada</li>
                    </ul>
                    
                    <h5>Personalizaciones</h5>
                    <p>Tu sub gratuito incluye queso y todos los vegetales disponibles. Los extras como aguacate, bacon adicional o doble carne requieren pago adicional.</p>
                    
                    <h5>Política de Satisfacción</h5>
                    <p>Si no estás completamente satisfecho con tu sub gratuito, Subway te hará uno nuevo siguiendo sus estándares de calidad. Tu satisfacción es nuestra prioridad.</p>
                    
                    <p><small>Términos sujetos a cambios según ubicación. Última actualización: 18 de noviembre, 2024</small></p>
                `
            },
            'baskin-robbins': {
                title: 'Términos y Condiciones - Baskin-Robbins',
                html: `
                    <h4>🍦 Helado Gratis en Baskin-Robbins</h4>
                    <p><strong>Recompensa:</strong> Obtén un helado gratuito al completar 6 visitas a Baskin-Robbins.</p>
                    
                    <h5>Condiciones de la Tarjeta</h5>
                    <ul>
                        <li>Válido en todas las ubicaciones de Baskin-Robbins participantes</li>
                        <li>Gasto mínimo de $6 USD por visita para obtener sello</li>
                        <li>Máximo un sello por día por usuario</li>
                        <li>El helado gratuito debe canjearse dentro de 60 días</li>
                        <li>Disponible para consumo en tienda y para llevar</li>
                    </ul>
                    
                    <h5>Opciones de Helado</h5>
                    <ul>
                        <li>Cualquier sabor disponible en tienda (hasta 2 bolas)</li>
                        <li>Cono regular o copa</li>
                        <li>Acceso a los 31 sabores clásicos</li>
                        <li>Sabores de temporada según disponibilidad</li>
                    </ul>
                    
                    <h5>Sabores Populares Incluidos</h5>
                    <ul>
                        <li>Vainilla francesa</li>
                        <li>Chocolate con chispas</li>
                        <li>Fresa con trozos reales</li>
                        <li>Menta con chispas de chocolate</li>
                        <li>Cookies 'n Cream</li>
                        <li>Pralines 'n Cream</li>
                    </ul>
                    
                    <h5>Restricciones</h5>
                    <p>El helado gratuito no incluye toppings premium, sundaes elaborados o productos de panadería. Válido solo para helado en bolas, no para smoothies o bebidas heladas.</p>
                    
                    <p><small>Sabores sujetos a disponibilidad estacional. Última actualización: 22 de noviembre, 2024</small></p>
                `
            }
        };
        
        return content[cardType] || {
            title: 'Términos y Condiciones',
            html: '<p>No se encontraron términos específicos para esta tarjeta.</p>'
        };
    }
}); 