document.addEventListener('DOMContentLoaded', function() {
    // ===== SCROLL SUAVE PARA NAVEGACIÓN =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Excluir elementos que abren modales
            if (this.hasAttribute('data-bs-toggle') && this.getAttribute('data-bs-toggle') === 'modal') {
                return;
            }
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Cerrar cualquier modal abierto
                const openModal = document.querySelector('.modal.show');
                if (openModal) {
                    const modalInstance = bootstrap.Modal.getInstance(openModal);
                    modalInstance.hide();
                    document.body.classList.remove('modal-open');
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) backdrop.remove();
                }
                
                // Calcular posición con offset para el navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                // Scroll suave
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Actualizar URL sin recargar
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });

    // ===== LÓGICA DE RESERVAS (MANTIENE TU CÓDIGO ORIGINAL) =====
    // Variables globales
    const basePrice = 45000;
    let currentTotal = basePrice;
    
    // Inicializar modales
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    const dateModal = new bootstrap.Modal(document.getElementById('dateModal'));
    
    // Manejar el cierre correcto de los modales
    document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(button => {
        button.addEventListener('click', function() {
            // Eliminar manualmente el backdrop
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
            // Habilitar el scroll del body
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0';
        });
    });
    
    // Calcular descuentos según previsión
    document.getElementById('insuranceType').addEventListener('change', function() {
        const discountContainer = document.getElementById('discountContainer');
        const totalAmount = document.getElementById('totalAmount');
        
        switch(this.value) {
            case 'fonasa':
                currentTotal = basePrice - 5000;
                discountContainer.innerHTML = `
                    <span class="small text-muted">Descuento FONASA:</span>
                    <span class="text-success">-CLP$5.000</span>
                `;
                break;
            case 'banmedica':
            case 'cruzblanca':
            case 'colmena':
            case 'masvida':
                const discount = basePrice * 0.3;
                currentTotal = basePrice - discount;
                discountContainer.innerHTML = `
                    <span class="small text-muted">Descuento (30%):</span>
                    <span class="text-success">-CLP$${discount.toLocaleString('es-CL')}</span>
                `;
                break;
            default:
                currentTotal = basePrice;
                discountContainer.innerHTML = '';
        }
        
        totalAmount.textContent = `CLP$${currentTotal.toLocaleString('es-CL')}`;
    });
    
    // Continuar a selección de fecha
    document.getElementById('continueBtn').addEventListener('click', function() {
        if(document.getElementById('paymentForm').checkValidity()) {
            paymentModal.hide();
            
            // Eliminar manualmente el backdrop del primer modal
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
            
            dateModal.show();
        } else {
            alert('Por favor complete todos los campos requeridos');
        }
    });
    
    // Mostrar confirmación al seleccionar fecha
    document.getElementById('appointmentDate').addEventListener('change', function() {
        const date = new Date(this.value);
        if(!isNaN(date.getTime())) {
            const confirmationBox = document.getElementById('confirmationBox');
            
            document.getElementById('displayDay').textContent = date.getDate();
            document.getElementById('displayMonth').textContent = date.toLocaleDateString('es-CL', { month: 'long' });
            document.getElementById('displayYear').textContent = date.getFullYear();
            document.getElementById('finalAmount').textContent = `CLP$${currentTotal.toLocaleString('es-CL')}`;
            
            confirmationBox.classList.remove('d-none');
        }
    });
    
    // Manejar botones de confirmación
    document.getElementById('confirmBtn').addEventListener('click', function() {
        alert('Consulta agendada exitosamente');
        
        // Cerrar modal y limpiar
        dateModal.hide();
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
        
        // Redirigir a página principal
        window.location.href = 'index.html';
    });
    
    document.getElementById('cancelBtn').addEventListener('click', function() {
        document.getElementById('confirmationBox').classList.add('d-none');
        document.getElementById('appointmentDate').value = '';
    });

        // ===== FORMULARIO DE CONTACTO =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (this.checkValidity()) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const submitText = submitBtn.querySelector('.submit-text');
                const spinner = submitBtn.querySelector('.spinner-border');
                
                // Mostrar spinner y deshabilitar botón
                submitText.textContent = 'Enviando...';
                spinner.classList.remove('d-none');
                submitBtn.disabled = true;
                
                // Simular envío (reemplazar con tu lógica real)
                setTimeout(() => {
                    // Aquí iría tu código AJAX para enviar el formulario
                    
                    // Mostrar mensaje de éxito
                    alert('Mensaje enviado con éxito. Te responderé a la brevedad.');
                    
                    // Resetear formulario
                    this.reset();
                    
                    // Restaurar botón
                    submitText.textContent = 'Enviar mensaje';
                    spinner.classList.add('d-none');
                    submitBtn.disabled = false;
                }, 1500);
            } else {
                this.classList.add('was-validated');
            }
        });
    }
});