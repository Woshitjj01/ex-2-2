const slides = document.querySelectorAll(".slide");
let current = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) slide.classList.add("active");
  });
}

function nextSlide() {
  current = (current + 1) % slides.length;
  showSlide(current);
}

function prevSlide() {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
}

function startAutoSlide() {
  slideInterval = setInterval(() => {
    nextSlide();
  }, 5000);
}

document.getElementById('menuToggle').addEventListener('click', function () {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle("show");
});

document.getElementById('registrationform').addEventListener('submit', function (event) {
  event.preventDefault();
  let isValid = true;

  document.querySelectorAll('.error').forEach((el) => el.textContent = '');

  const name = document.getElementById("name").value;
  if (!name) {
    document.getElementById("nameError").textContent = "Name is required.";
    isValid = false;
  }
  
  const email = document.getElementById("email").value;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) {
    document.getElementById("emailError").textContent = "Enter a valid email.";
    isValid = false;
  } else if (!emailRegex.test(email)) {
    document.getElementById("emailError").textContent = "Enter a valid email.";
    isValid = false;
  }

  const dob = document.getElementById("dob").value;
  if (!dob) {
    document.getElementById("dobError").textContent = "Select your birth date.";
    isValid = false;
  }

  const gender = document.querySelector('input[name="gender"]:checked');
  if (!gender) {
   document.getElementById("genderError").textContent = "Please select your gender.";
   isValid = false;
  }

  const ticket = document.getElementById("ticket").value;
  if (!ticket) {
   document.getElementById("ticketError").textContent = "Choose a ticket type.";
   isValid = false;
  }

  const visitors = document.getElementById("no-of-visitors").value;
  if (!visitors) {
    document.getElementById("visitorsError").textContent = "Select the number of visitors.";
    isValid = false;
  }

  const visitDate = document.getElementById("date-of-visit").value;
  if (!visitDate) {
    document.getElementById("visitDateError").textContent = "Select your visit date.";
    isValid = false;
  }

  if (isValid) {
    alert("Form submitted successfully!");
    this.reset();
  }
});

let slideInterval;

window.startAutoSlide = function () {
  slideInterval = setInterval(() => {
    nextSlide();
  }, 5000);
};

window.stopAutoSlide = function () {
  clearInterval(slideInterval);
};

if (typeof window.__TEST__ === "undefined") {
  window.startAutoSlide();
}

let cartItems = [];
let products = [];

fetch('assets/ghibli_merchandise.json')
  .then(response => response.json())
  .then(data => {
    products = data;
    displayProducts(products);
  })
  .catch(error => console.error('Error:', error));

function displayProducts(productsToDisplay) {
  const container = document.getElementById('productsContainer');
  container.innerHTML = '';
  
  productsToDisplay.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="./assets/${product.id}.jpg" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>$${product.price.toFixed(2)}</p>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;
    container.appendChild(card);
  });
  
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCart);
  });
}

function addToCart(event) {
  const productId = event.target.getAttribute('data-id');
  const product = products.find(p => p.id === productId);
  
  if (product) {
    cartItems.push(product);
    updateCart();

    if (cartItems.length === 1) {
      document.getElementById('checkoutBtn').classList.remove('hidden');
    }
    
    showNotification(`${product.name} added to cart!`);
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 2000);
}

function updateCart() {
  const cartCounter = document.getElementById('cartCounter');
  if (cartCounter) {
    cartCounter.textContent = cartItems.length;
  }
}

document.getElementById('searchInput').addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) || 
    product.description.toLowerCase().includes(searchTerm)
  );
  displayProducts(filteredProducts);
});

document.getElementById('checkoutBtn').addEventListener('click', function() {
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('hidden');
  });
  
  document.getElementById('checkout').classList.remove('hidden');
  
  const orderSummary = document.getElementById('orderSummary');
  orderSummary.innerHTML = '';
  
  cartItems.forEach(item => {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    orderItem.innerHTML = `
      <span>${item.name}</span>
      <span>$${item.price}</span>
    `;
    orderSummary.appendChild(orderItem);
  });
  
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  document.getElementById('totalPrice').textContent = total.toFixed(2);
});

document.getElementById('proceedToPaymentBtn').addEventListener('click', function() {
  document.getElementById('checkout').classList.add('hidden');
  document.getElementById('paymentForm').classList.remove('hidden');
});

document.getElementById('backToShoppingBtn').addEventListener('click', function() {
  document.getElementById('confirmation').classList.add('hidden');
  document.getElementById('shopping').classList.remove('hidden');
  cartItems = [];
  document.getElementById('checkoutBtn').classList.add('hidden');
});

document.getElementById('paymentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const cardName = document.getElementById('cardName').value;
  const cardNumber = document.getElementById('cardNumber').value;
  const expiryDate = document.getElementById('expiryDate').value;
  const cvv = document.getElementById('cvv').value;
  const address = document.getElementById('address').value;
  
  if (!cardName || !cardNumber || !expiryDate || !cvv || !address) {
    alert('Please fill all payment fields');
    return;
  }
  
  document.getElementById('paymentForm').classList.add('hidden');
  document.getElementById('confirmation').classList.remove('hidden');
  
  const orderConfirmation = document.getElementById('orderConfirmation');
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  
  orderConfirmation.innerHTML = `
    <p>Your order has been confirmed!</p>
    <p>Total: $${total.toFixed(2)}</p>
    <p>Thank you for your order. It will be delivered in the next 3-4 working days.</p>
  `;
});