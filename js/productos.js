/**
 * productos.js
 * Script para agregar productos al carrito desde la página principal.
 * Agrega este script en productos.html con:
 *   <script src="./js/productos.js"></script>
 *
 * CAMBIOS NECESARIOS EN productos.html / paginaprincipal.html:
 * 1. Agregar data-* a cada botón "Agregar al carrito":
 *    data-nombre="Nombre del producto"
 *    data-precio="60"
 *    data-imagen="img/nombre-del-juego.jpg"
 *    data-codigo="COD001"
 *
 * 2. El ícono del carrito (🛒 en el nav) debe tener:
 *    <a href="/html/carrito.html" class="cart-btn">
 *        🛒 <span id="contador-carrito">0</span>
 *    </a>
 *
 * Ejemplo de botón correcto en productos.html:
 *   <button class="add-cart-btn"
 *           data-nombre="Tomodachi Life 2"
 *           data-precio="60"
 *           data-imagen="img/tomodachi.jpg"
 *           data-codigo="GAME001">
 *       🛒 Agregar
 *   </button>
 */

// ──────────────────────────────────────────────
// CLAVE del localStorage (debe ser la misma que carrito.js)
// ──────────────────────────────────────────────
const CLAVE_CARRITO = 'nomtech_carrito';

// ──────────────────────────────────────────────
// OBTENER carrito
// ──────────────────────────────────────────────
function obtenerCarrito() {
    const datos = localStorage.getItem(CLAVE_CARRITO);
    return datos ? JSON.parse(datos) : [];
}

// ──────────────────────────────────────────────
// GUARDAR carrito
// ──────────────────────────────────────────────
function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

// ──────────────────────────────────────────────
// AGREGAR PRODUCTO al carrito
// ──────────────────────────────────────────────
function agregarAlCarrito(nombre, precio, imagen, codigo) {
    const carrito = obtenerCarrito();

    // Verificar si el producto ya existe
    const indiceExistente = carrito.findIndex(p => p.codigo === codigo);

    if (indiceExistente >= 0) {
        // Aumentar cantidad si ya existe
        carrito[indiceExistente].cantidad += 1;
    } else {
        // Agregar nuevo producto
        carrito.push({
            nombre: nombre,
            precio: parseFloat(precio),
            imagen: imagen,
            codigo: codigo,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    actualizarContadorCarrito();
    mostrarNotificacion(nombre);
}

// ──────────────────────────────────────────────
// ACTUALIZAR el contador del ícono del carrito
// ──────────────────────────────────────────────
function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

// ──────────────────────────────────────────────
// NOTIFICACIÓN visual al agregar producto
// ──────────────────────────────────────────────
function mostrarNotificacion(nombre) {
    // Remover notificación existente si hay
    const existente = document.getElementById('notif-carrito');
    if (existente) existente.remove();

    const notif = document.createElement('div');
    notif.id = 'notif-carrito';
    notif.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #e60012;
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 700;
        z-index: 9999;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        animation: fadeInOut 2.5s ease forwards;
    `;
    notif.textContent = `✓ "${nombre}" agregado al carrito`;

    // Estilo de animación
    if (!document.getElementById('estilo-notif')) {
        const estilo = document.createElement('style');
        estilo.id = 'estilo-notif';
        estilo.textContent = `
            @keyframes fadeInOut {
                0%   { opacity: 0; transform: translateY(20px); }
                15%  { opacity: 1; transform: translateY(0); }
                75%  { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(estilo);
    }

    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2600);
}

// ──────────────────────────────────────────────
// VINCULAR botones "Agregar al carrito"
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    // Actualizar contador al cargar
    actualizarContadorCarrito();

    // Escuchar clicks en todos los botones add-cart-btn
    document.querySelectorAll('.add-cart-btn').forEach(function (boton) {
        boton.addEventListener('click', function () {
            const nombre  = this.dataset.nombre  || 'Producto';
            const precio  = this.dataset.precio  || '0';
            const imagen  = this.dataset.imagen  || '';
            const codigo  = this.dataset.codigo  || Math.random().toString(36).substring(2, 9);

            agregarAlCarrito(nombre, precio, imagen, codigo);
        });
    });

    // Vincular ícono del carrito para ir a carrito.html
    const carritoIcono = document.querySelector('.cart-btn, .cart-icon');
    if (carritoIcono && !carritoIcono.closest('a')) {
        carritoIcono.style.cursor = 'pointer';
        carritoIcono.addEventListener('click', function () {
            window.location.href = '/html/carrito.html';
        });
    }
});