/**
 * carrito.js
 * Maneja el carrito de compras: carga productos del localStorage,
 * permite cambiar cantidades, eliminar productos y procesar el pago.
 */

// ──────────────────────────────────────────────
// CLAVE del localStorage donde se guarda el carrito
// ──────────────────────────────────────────────
const CLAVE_CARRITO = 'nomtech_carrito';

// ──────────────────────────────────────────────
// OBTENER carrito del localStorage
// ──────────────────────────────────────────────
function obtenerCarrito() {
    const datos = localStorage.getItem(CLAVE_CARRITO);
    return datos ? JSON.parse(datos) : [];
}

// ──────────────────────────────────────────────
// GUARDAR carrito en el localStorage
// ──────────────────────────────────────────────
function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

// ──────────────────────────────────────────────
// RENDERIZAR lista de productos en el panel
// ──────────────────────────────────────────────
function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const lista = document.getElementById('lista-productos');
    const totalMonto = document.getElementById('total-monto');

    lista.innerHTML = '';

    if (carrito.length === 0) {
        lista.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
        totalMonto.textContent = '0$';
        return;
    }

    let total = 0;

    carrito.forEach((producto, indice) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const item = document.createElement('div');
        item.classList.add('producto-item');

        // Imagen o placeholder
        let imagenHTML = '';
        if (producto.imagen) {
            imagenHTML = `<img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.outerHTML='<div class=\\'producto-item-placeholder\\'>Sin imagen</div>'">`;
        } else {
            imagenHTML = `<div class="producto-item-placeholder">Sin imagen</div>`;
        }

        item.innerHTML = `
            ${imagenHTML}
            <div class="producto-datos">
                <span class="producto-nombre">${producto.nombre}</span>
                <span class="producto-precio-item">${subtotal}$</span>
                <div class="producto-cantidad">
                    Quantity:
                    <button class="btn-cantidad" onclick="cambiarCantidad(${indice}, -1)">−</button>
                    <span class="cantidad-num">${producto.cantidad}</span>
                    <button class="btn-cantidad" onclick="cambiarCantidad(${indice}, 1)">+</button>
                </div>
            </div>
            <button class="btn-eliminar" onclick="eliminarProducto(${indice})" title="Eliminar">✕</button>
        `;

        lista.appendChild(item);
    });

    totalMonto.textContent = total + '$';
}

// ──────────────────────────────────────────────
// CAMBIAR CANTIDAD de un producto
// ──────────────────────────────────────────────
function cambiarCantidad(indice, cambio) {
    const carrito = obtenerCarrito();
    carrito[indice].cantidad += cambio;

    if (carrito[indice].cantidad <= 0) {
        carrito.splice(indice, 1);
    }

    guardarCarrito(carrito);
    renderizarCarrito();
}

// ──────────────────────────────────────────────
// ELIMINAR un producto del carrito
// ──────────────────────────────────────────────
function eliminarProducto(indice) {
    const carrito = obtenerCarrito();
    carrito.splice(indice, 1);
    guardarCarrito(carrito);
    renderizarCarrito();
}

// ──────────────────────────────────────────────
// FORMATEAR número de tarjeta (grupos de 4)
// ──────────────────────────────────────────────
document.getElementById('numero-tarjeta')?.addEventListener('input', function () {
    let valor = this.value.replace(/\D/g, '').substring(0, 16);
    this.value = valor.replace(/(.{4})/g, '$1 ').trim();
});

// ──────────────────────────────────────────────
// FORMATEAR fecha MM/YY
// ──────────────────────────────────────────────
document.getElementById('fecha-tarjeta')?.addEventListener('input', function () {
    let valor = this.value.replace(/\D/g, '').substring(0, 4);
    if (valor.length >= 3) {
        this.value = valor.substring(0, 2) + ' / ' + valor.substring(2);
    } else {
        this.value = valor;
    }
});

// ──────────────────────────────────────────────
// SOLO números en CVC
// ──────────────────────────────────────────────
document.getElementById('cvc-tarjeta')?.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').substring(0, 4);
});

// ──────────────────────────────────────────────
// PROCESAR PAGO
// ──────────────────────────────────────────────
document.getElementById('btn-pagar')?.addEventListener('click', function () {
    const email = document.getElementById('email').value.trim();
    const numeroTarjeta = document.getElementById('numero-tarjeta').value.trim();
    const fecha = document.getElementById('fecha-tarjeta').value.trim();
    const cvc = document.getElementById('cvc-tarjeta').value.trim();
    const nombreTarjeta = document.getElementById('nombre-tarjeta').value.trim();
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de pagar.');
        return;
    }

    if (!email || !numeroTarjeta || !fecha || !cvc || !nombreTarjeta) {
        alert('Por favor completa todos los campos antes de continuar.');
        return;
    }

    // Validar email básico
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        alert('Por favor ingresa un correo electrónico válido.');
        return;
    }

    // Mostrar modal de confirmación
    mostrarModalPago();
});

// ──────────────────────────────────────────────
// MODAL de pago exitoso
// ──────────────────────────────────────────────
function mostrarModalPago() {
    const modal = document.createElement('div');
    modal.classList.add('mensaje-pago');
    modal.innerHTML = `
        <div class="mensaje-pago-caja">
            <h2>¡Pago exitoso! 🎉</h2>
            <p>Tu compra ha sido procesada correctamente. ¡Gracias por tu compra en NomTech!</p>
            <button onclick="confirmarPago()">Volver a la tienda</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function confirmarPago() {
    // Limpiar carrito
    localStorage.removeItem(CLAVE_CARRITO);
    // Redirigir a la página principal
    window.location.href = '/html/productos.html';
}

// ──────────────────────────────────────────────
// INICIALIZAR al cargar la página
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    renderizarCarrito();
});