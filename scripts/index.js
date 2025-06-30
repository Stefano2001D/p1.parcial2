'use strict';

// Array de productos
let productos = [
    { id: 1, nombre: 'Pearl Pedal de Bombo Demon Drive c/cadena P3000C', descripcion: 'El más rápido, suave y versátil pedal de la historia de Pearl, ahora con cadena. El Pearl P3000C combina las características del mítico Demon Drive de Pearl con el poder que da el uso de la cadena', precio: 652987, imagen: 'imagenes/pedaldemondrive.jpg', categoria: 'Soportes', stock: 10 },
    { id: 2, nombre: 'Gibraltar Banqueta 9608 / 3 Patas / Asiento redondo', descripcion: 'Banqueta a rosca Asiento redondo altura 67 cm diametro 33 cm', precio: 400000, imagen: 'imagenes/banquetagibraltar.jpg', categoria: 'Soportes', stock: 5 },
    { id: 3, nombre: 'Zildjian A Medium Thin Crash 18', descripcion: 'Esta serie se caracteriza por ser la más conocida, usada y famosa, la que le dio su fama a Zildjian, ampliándose con el tiempo la gama de modelos dentro de la serie, variando sus espesores, desarrollo, medidas, pero manteniendo siempre lo que fue el principio, el origen de los platillos más tradicionales', precio: 670000, imagen: 'imagenes/zildjian18.jpg', categoria: 'Platillos', stock: 8 },
    { id: 4, nombre: 'Gibraltar Soporte Boom 6709', descripcion: 'Soporte de 3 niveles con doble refuerzo, Brazo de fundición retráctil con bloqueo de memoria G-Style y ajustable en altura', precio: 350000, imagen: 'imagenes/soportegibraltar.jpg', categoria: 'Soportes', stock: 2 },
    { id: 5, nombre: 'Zildjian A New Beat Hi Hat 14', descripcion: 'Un platillo tradicional, versátil, clásico y de amplio espectro de uso. Aleación: B20. Sonido: Brillante y con volúmen.', precio: 800000, imagen: 'imagenes/hihat.jpg', categoria: 'Platillos', stock: 13 },
    { id: 6, nombre: 'Zildjian K Custom Medium Ride 22', descripcion: 'Oscuramente Vintage y Versátil Estilo: Artesanal. Sonido: Oscuro, Explosivo y Cálido. Aleación: B20. Timbre: Medio a Bajo', precio: 1200000, imagen: 'imagenes/ride.jpg', categoria: 'Platillos', stock: 4 },
    { id: 7, nombre: 'Tama Superstar Classic 22', descripcion: 'Cascos de arce de 6 capas de 5 mm excepto bombo de 8 capas de 7 mm', precio: 2000000, imagen: 'imageness/tama.jpg', categoria: 'Baterias', stock: 3 },
    { id: 8, nombre: 'Gretsch Catalina Jazz 18', descripcion: '7 Láminas de Maple. Aros 2.3 mm. Parches REMO UT Arenados. GTS Suspension System', precio: 2500000, imagen: 'imagenes/gretsch.jpg', categoria: 'Baterias', stock: 3 },
    {id: 9, nombre: 'Sonor Vintage Series', descripcion: 'El ángulo redondeado en el borde del casco crea mayor contacto del parche, lo que genera un sonido mucho más corto en comparación a los aros cortados en 45 grados. El resultado es un sonido cálido, seco pero resonante que recuerda a las baterías vintage.', precio: 3000000, imagen: 'imagenes/sonor.jpg', categoria: 'Baterias', stock: 3 },

    ];


// Clase para manejar el carrito de compras
class Carrito {
    constructor() {
        this.productos = JSON.parse(localStorage.getItem('carrito')) || [];
    }

    // Agrego el producto al carrito 
    agregarProducto(producto) {
        const existe = this.productos.find(item => item.id === producto.id);
        if (existe) {
            if (existe.cantidad < producto.stock) {
                existe.cantidad++;
            } else {
                alert(`No hay más stock disponible para el producto: ${producto.nombre}`);
                return;
            }
        } else {
            if (producto.stock > 0) {
                this.productos.push({ ...producto, cantidad: 1 });
            } else {
                alert(`El producto: ${producto.nombre} no tiene stock disponible.`);
                return;
            }
        }

        // Reducir el stock
        const index = productos.findIndex(p => p.id === producto.id);
        if (index !== -1) {
            productos[index].stock--;
        }

        this.actualizarCarrito();
    }

    // Eliminar producto del carrito
    eliminarProducto(id) {
        this.productos = this.productos.filter(item => item.id !== id);
        this.actualizarCarrito();
    }

    // Vaciar carrito
    vaciarCarrito() {
        this.productos = [];
        this.actualizarCarrito();
    }

    // Actualizar el carrito en la interfaz y guardar en localStorage
    actualizarCarrito() {
        const totalItems = this.productos.reduce((acc, item) => acc + item.cantidad, 0);
        const totalPrecio = this.productos.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

        // Actualizar cantidad y total del carrito
        const carritoCantidad = document.querySelector('#carrito .cantidad');
        const carritoTotal = document.querySelector('#carrito .total');

        if (carritoCantidad && carritoTotal) {
            carritoCantidad.textContent = totalItems;
            carritoTotal.textContent = totalPrecio.toFixed(2);
        }

        // Guardar en el localStorage
        localStorage.setItem('carrito', JSON.stringify(this.productos));

        // Actualizar el total en el modal del carrito
        const montoTotalModal = document.getElementById('monto-total');
        if (montoTotalModal) {
            montoTotalModal.textContent = `Total: $${totalPrecio.toFixed(2)}`;
        }

        // Actualizar la lista de productos en el modal del carrito
        this.actualizarModalCarrito();
    }

    // Actualizar el modal con los productos actuales
    actualizarModalCarrito() {
        const contenidoCarrito = document.getElementById('contenido-carrito');
        contenidoCarrito.innerHTML = ''; // Limpiar el contenido antes de volver a cargarlo

        // Si el carrito está vacío...
        if (this.productos.length === 0) {
            const mensajeVacio = document.createElement('p');
            mensajeVacio.textContent = 'No hay ningún producto en el carrito.';
            contenidoCarrito.appendChild(mensajeVacio);
        } else {
            // Sino...
            this.productos.forEach(producto => {
                const itemCarrito = document.createElement('li');
                
                // Productos agregados al carrito
                const nombre = document.createElement('h2');
                nombre.textContent = producto.nombre;

                const precio = document.createElement('p');
                precio.textContent = `$${producto.precio}`;

                const cantidad = document.createElement('p');
                cantidad.textContent = `${producto.cantidad}`;

                const botonEliminar = document.createElement('button');
                botonEliminar.textContent = 'X';
                botonEliminar.setAttribute('data-id', producto.id);
                botonEliminar.classList.add('eliminar-producto');

                itemCarrito.appendChild(nombre);
                itemCarrito.appendChild(precio);
                itemCarrito.appendChild(cantidad);
                itemCarrito.appendChild(botonEliminar);

                contenidoCarrito.appendChild(itemCarrito);

                // Agregar evento para eliminar el producto
                itemCarrito.querySelector('.eliminar-producto').addEventListener('click', (e) => {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    this.eliminarProducto(id);
                });
            });
        }
    }

}

// Inicializar carrito
const carrito = new Carrito();

// Mostrar el modal 
document.getElementById('ver-carrito').addEventListener('click', () => {
    const modal = document.getElementById('modal-carrito');
    modal.style.display = 'flex'; 
    carrito.actualizarCarrito(); 
});

// Cerrar el modal
document.getElementById('cerrar-modal').addEventListener('click', () => {
    document.getElementById('modal-carrito').style.display = 'none';
});

// Vaciar el carrito
document.getElementById('vaciar-carrito').addEventListener('click', () => {
    carrito.vaciarCarrito();
});

// Cargar productos
function cargarProductos(listaProductos = productos) {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';

    listaProductos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('producto');

        const img = document.createElement('img');
        img.setAttribute('src', producto.imagen);
        img.setAttribute('alt', producto.nombre);
        card.appendChild(img);

        const nombre = document.createElement('h2');
        const nombreTexto = document.createTextNode(producto.nombre);
        nombre.appendChild(nombreTexto);
        card.appendChild(nombre);

        const descripcion = document.createElement('p');
        const descripcionTexto = document.createTextNode(producto.descripcion);
        descripcion.appendChild(descripcionTexto);
        card.appendChild(descripcion);

        const precio = document.createElement('p');
        const precioTexto = document.createTextNode(`$${producto.precio}`);
        const precioFuerte = document.createElement('strong');
        precioFuerte.appendChild(precioTexto);
        precio.appendChild(precioFuerte);
        card.appendChild(precio);

        const boton = document.createElement('button');
        const botonTexto = document.createTextNode('Agregar al carrito');
        boton.appendChild(botonTexto);
        boton.setAttribute('data-id', producto.id);
        card.appendChild(boton);

        // Agregar evento al botón de agregar al carrito
        boton.addEventListener('click', () => {
            carrito.agregarProducto(producto);
        });

        contenedor.appendChild(card);
    });
}

let productosFiltrados = productos; // Esta variable guarda la lista de productos filtrados
let ordenActual = true; // Esta variable guarda el orden actual

// Filtrar productos por categoría
document.getElementById('filtrar-por').addEventListener('change', (e) => {
    const categoria = e.target.value;
    if (categoria === 'todos') {
        productosFiltrados = productos;
    } else {
        productosFiltrados = productos.filter(producto => producto.categoria === categoria);
    }

    // Aplicar el orden actual después de filtrar
    if (ordenActual === 'precio-ascendente') {
        ordenarPorPrecio(true);
    } else if (ordenActual === 'precio-descendente') {
        ordenarPorPrecio(false);
    } else {
        ordenarPorRelevancia();
    }
});

// Ordenar productos por...
document.getElementById('ordenar-por').addEventListener('change', (e) => {
    const orden = e.target.value;
    ordenActual = orden; // Actualizar a orden actual

    if (orden === 'precio-ascendente') {
        ordenarPorPrecio(true);
    } else if (orden === 'precio-descendente') {
        ordenarPorPrecio(false);
    } else if (orden === 'mas-relevante') {
        ordenarPorRelevancia();
    }
});

// Ordenar los productos por precio
function ordenarPorPrecio(ascendente = true) {
    productosFiltrados.sort((a, b) => (ascendente ? a.precio - b.precio : b.precio - a.precio));
    cargarProductos(productosFiltrados); // Cargar productos ordenados
}

// Ordenar los productos por mayor relevancia (se hace por orden de ID ascendente)
function ordenarPorRelevancia() {
    productosFiltrados.sort((a, b) => a.id - b.id);
    cargarProductos(productosFiltrados); // Cargar productos ordenados
}

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    carrito.actualizarCarrito();
});



