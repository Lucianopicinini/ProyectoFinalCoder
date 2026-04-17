// ===============================
// VARIABLES PRINCIPALES
// ===============================

// Array donde se guardan los productos que vienen del JSON
let productos = [];

// Carrito persistente usando localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


// ===============================
// REFERENCIAS AL DOM
// ===============================

const lista = document.getElementById("listaProductos");
const filtroInput = document.getElementById("filtro");

const carritoHTML = document.getElementById("carrito");
const totalHTML = document.getElementById("total");
const btnComprar = document.getElementById("btnComprar");

const precioMinInput = document.getElementById("precioMin");
const precioMaxInput = document.getElementById("precioMax");
const btnPrecio = document.getElementById("btnPrecio");

const btnReset = document.getElementById("btnReset");


// ===============================
// CARGA DE PRODUCTOS (FETCH)
// ===============================

// Función asincrónica que trae los productos desde el JSON
async function cargarProductos() {
  try {
    const res = await fetch("../productos.json");
    productos = await res.json();

    renderProductos(productos);
    renderCarrito();

  } catch (error) {
    // Si falla el fetch, se muestra mensaje
    Toastify({
      text: "Error al cargar productos",
      duration: 2000
    }).showToast();
  }
}

// Ejecutamos la carga al iniciar la app
cargarProductos();


// ===============================
// RENDER DE PRODUCTOS
// ===============================

// Muestra los productos en pantalla
function renderProductos(array) {
  lista.innerHTML = "";

  // Si no hay productos, mostramos mensaje
  if (array.length === 0) {
    lista.innerHTML = "<p>No hay productos</p>";
    return;
  }

  // Recorremos el array y creamos cada card
  array.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${p.imagen}" width="120">
      <h3>${p.modelo}</h3>
      <p>${p.marca}</p>
      <strong>$${p.precio}</strong>
      <button onclick="agregarCarrito(${p.id})">Agregar</button>
    `;

    lista.appendChild(card);
  });
}


// ===============================
// CARRITO
// ===============================

// Agrega un producto al carrito según su id
function agregarCarrito(id) {
  const producto = productos.find(p => p.id === id);

  carrito.push(producto);

  guardarStorage();
  renderCarrito();

  Toastify({
    text: "Producto agregado al carrito",
    duration: 2000
  }).showToast();
}


// Muestra los productos del carrito
function renderCarrito() {
  carritoHTML.innerHTML = "";

  carrito.forEach((p, i) => {
    const item = document.createElement("p");

    item.innerHTML = `
      ${p.modelo} - $${p.precio}
      <button onclick="eliminar(${i})">Eliminar</button>
    `;

    carritoHTML.appendChild(item);
  });

  calcularTotal();
}


// Elimina un producto del carrito por índice
function eliminar(index) {
  carrito.splice(index, 1);

  guardarStorage();
  renderCarrito();
}


// ===============================
// TOTAL DEL CARRITO
// ===============================

// Calcula el total usando reduce
function calcularTotal() {
  const total = carrito.reduce((acc, p) => {
    // Convertimos el precio de string a número
    const precioNumero = parseInt(p.precio.replace(/\./g, ""));
    return acc + precioNumero;
  }, 0);

  // Mostramos el total formateado
  totalHTML.textContent = total.toLocaleString();
}


// ===============================
// LOCAL STORAGE
// ===============================

// Guarda el carrito en el navegador
function guardarStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}


// ===============================
// FILTROS
// ===============================

// Función central que aplica todos los filtros juntos
function aplicarFiltros() {
  const texto = filtroInput.value.toLowerCase();

  // Convertimos inputs de precio a número
  const min = parseInt(precioMinInput.value.replace(/\./g, "")) || 0;
  const max = parseInt(precioMaxInput.value.replace(/\./g, "")) || Infinity;

  // Filtramos productos
  const filtrados = productos.filter(p => {
    const precioNumero = parseInt(p.precio.replace(/\./g, ""));

    return (
      p.marca.toLowerCase().includes(texto) &&
      precioNumero >= min &&
      precioNumero <= max
    );
  });

  renderProductos(filtrados);
}


// Evento filtro por marca (tiempo real)
filtroInput.addEventListener("input", aplicarFiltros);

// Evento filtro por precio (botón)
btnPrecio.addEventListener("click", aplicarFiltros);


// ===============================
// LIMPIAR FILTROS
// ===============================

btnReset.addEventListener("click", () => {
  filtroInput.value = "";
  precioMinInput.value = "";
  precioMaxInput.value = "";

  renderProductos(productos);

  Toastify({
    text: "Filtros limpiados",
    duration: 2000
  }).showToast();
});


// ===============================
// FINALIZAR COMPRA
// ===============================

btnComprar.addEventListener("click", () => {

  // Validación: no permitir comprar si está vacío
  if (carrito.length === 0) {
    Toastify({
      text: "El carrito está vacío",
      duration: 2000
    }).showToast();
    return;
  }

  // Simulación de proceso asincrónico
  Toastify({
    text: "Procesando compra...",
    duration: 2000
  }).showToast();

  setTimeout(() => {
    carrito = [];

    guardarStorage();
    renderCarrito();

    Toastify({
      text: "Compra realizada correctamente",
      duration: 3000
    }).showToast();
  }, 2000);
});