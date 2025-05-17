const socket = io();

const productForm = document.getElementById('product-form');
const productList = document.getElementById('product-list');

productForm.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(productForm);
  const product = Object.fromEntries(formData.entries());
  product.price = parseFloat(product.price);
  product.stock = parseInt(product.stock);
  product.status = true;
  product.thumbnails = product.thumbnail ? [product.thumbnail] : [];

  socket.emit('new-product', product);
  productForm.reset();
});

socket.on('products', products => {
  productList.innerHTML = '';

  products.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${p.title}</strong> - ${p.description} | $${p.price}
      <button onclick="deleteProduct(${p.id})">Eliminar</button>
    `;
    productList.appendChild(li);
  });
});

function deleteProduct(id) {
  socket.emit('delete-product', id);
}