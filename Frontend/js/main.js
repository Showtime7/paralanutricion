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
    
    document.getElementById('confirmBtn').addEventListener('click', async function() {
    try {
        const formData = {
            nombre: document.querySelector('#paymentForm input[type="text"]:first-of-type').value,
            apellido: document.querySelector('#paymentForm input[type="text"]:last-of-type').value,
            email: document.querySelector('#paymentForm input[type="email"]').value,
            fecha: document.getElementById('appointmentDate').value,
            previsión: document.getElementById('insuranceType').value,
            valor: currentTotal,
            tipo: 'online', // Puedes ajustar esto según tu lógica
            pagado: false
        };
        
        const response = await fetch('http://localhost:5000/api/consultas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Error al agendar');
        
        alert('Consulta agendada exitosamente');
        dateModal.hide();
        
        // Limpiar el modal y redirigir (mantén esta parte)
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al agendar. Por favor intenta nuevamente.');
    }
});

    // En el formulario de contacto
contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (this.checkValidity()) {
        const submitBtn = this.querySelector('button[type="submit"]');
        const submitText = submitBtn.querySelector('.submit-text');
        const spinner = submitBtn.querySelector('.spinner-border');
        
        submitText.textContent = 'Enviando...';
        spinner.classList.remove('d-none');
        submitBtn.disabled = true;
        
        try {
            const formData = {
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apellido').value,
                genero: document.getElementById('genero').value,
                telefono: document.getElementById('telefono').value,
                email: document.getElementById('email').value,
                consulta: document.getElementById('consulta').value
            };
            
            const response = await fetch('http://localhost:5000/api/consultas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            
            alert('Mensaje enviado con éxito. Te responderé a la brevedad.');
            this.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.');
        } finally {
            submitText.textContent = 'Enviar mensaje';
            spinner.classList.add('d-none');
            submitBtn.disabled = false;
        }
    } else {
        this.classList.add('was-validated');
    }
});  
    
});