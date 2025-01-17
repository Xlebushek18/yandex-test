'use strict'

const products = document.querySelectorAll('.product');
const cartOne = document.querySelector('.cart-one');
const cartTwo = document.querySelector('.cart-two');
const cartThree = document.querySelector('.cart-three');
const buttonPay = document.querySelector('.button-pay');
const cart = document.querySelector('.cart');
const produktsInCart = {
  cartOne: ['sap', 'milk', 'cake', 'cheese'],
  cartTwo: ['meat', 'chicken', 'chips'],
  cartThree: ['pineapple', 'bananas', 'apple', 'salads']
};

let current, touchStartX, touchStartY, isTouchMove = false;
let count = 0; // Переменная для отслеживания количества товаров в корзине

// Обработчик начала перемещения
function handleDragStart(e) {
  if (e.type === 'touchstart') {
    // Для touch-событий
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  } else {
    // Для drag-событий
    current = this;
  }
}

// Обработчик перемещения для touch-событий
function handleTouchMove(e) {
  if (!current || !e.touches) return;
  isTouchMove = true;
  let touchMoveX = e.touches[0].clientX;
  let touchMoveY = e.touches[0].clientY;

  let deltaX = touchMoveX - touchStartX;
  let deltaY = touchMoveY - touchStartY;

  current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
}

// Обработчик окончания перемещения для touch-событий
function handleTouchEnd(e) {
  if (!isTouchMove) return;
  let targetCart = getCartFromTouch(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  if (targetCart) {
    appendToCart(targetCart);
  }
  current.style.transform = '';
  isTouchMove = false;
}

// Проверка, попал ли элемент в корзину
function getCartFromTouch(x, y) {
  const cartOneRect = cartOne.getBoundingClientRect();
  const cartTwoRect = cartTwo.getBoundingClientRect();
  const cartThreeRect = cartThree.getBoundingClientRect();

  if (isInsideCart(x, y, cartOneRect)) return cartOne;
  if (isInsideCart(x, y, cartTwoRect)) return cartTwo;
  if (isInsideCart(x, y, cartThreeRect)) return cartThree;

  return null;
}

function isInsideCart(x, y, cartRect) {
  return x > cartRect.left && x < cartRect.right && y > cartRect.top && y < cartRect.bottom;
}

// Добавление товара в корзину
function appendToCart(cart) {
  let productName = current.className.split(' ')[1];
  updateCart(produktsInCart.cartOne, cartOne, productName);
  updateCart(produktsInCart.cartTwo, cartTwo, productName);
  updateCart(produktsInCart.cartThree, cartThree, productName);

  // Проверка и показ кнопки
  if (count >= 3) {
    buttonPay.style.display = "flex"; // Показываем кнопку
  } else {
    buttonPay.style.display = "none"; // Скрываем кнопку
  }
}

// Обновление корзины
function updateCart(produktsInCart, cart, productName) {
  if (produktsInCart.includes(productName) && !cart.querySelector(`.${productName}`)) {
    cart.appendChild(current);
    count += 1;
    console.log(count);
  }
}

// Обработчики для продуктов
products.forEach(function (elem) {
  elem.addEventListener('dragstart', handleDragStart);
  elem.addEventListener('touchstart', handleDragStart);
});

// События для корзины
cart.addEventListener('dragover', function (e) {
  e.preventDefault();
});

cart.addEventListener('drop', function (e) {
  if (!current) return;
  let productName = current.className.split(' ')[1];
  console.log(productName);

  updateCart(produktsInCart.cartOne, cartOne, productName);
  updateCart(produktsInCart.cartTwo, cartTwo, productName);
  updateCart(produktsInCart.cartThree, cartThree, productName);

  // Проверка и показ кнопки
  if (count >= 3) {
    buttonPay.style.display = "flex";
  } else {
    buttonPay.style.display = "none";
  }
});

// Кнопка "Оплатить"
buttonPay.addEventListener('click', () => {
  window.location.href = 'https://lavka.yandex.ru/';
});

function togglePulse() {
  buttonPay.classList.toggle('pulsate');
}

setInterval(togglePulse, 2000);

// Обработчики для перемещения товара
products.forEach(function (elem) {
  elem.addEventListener('touchmove', handleTouchMove);
  elem.addEventListener('touchend', handleTouchEnd);
});
