'use strict';

const products = document.querySelectorAll('.product');
const cartOne = document.querySelector('.cart-one');
const cartTwo = document.querySelector('.cart-two');
const cartThree = document.querySelector('.cart-three');
const buttonPay = document.querySelector('.button-pay');
const cart = document.querySelector('.cart');
const produktsInCart = {
  cartOne: ['sap', 'milk', 'cake', 'cheese'],
  cartTwo: ['meat', 'chicken', 'chips'],
  cartThree: ['pineapple', 'bananas', 'apple', 'salads'],
};

let current;
let offsetX, offsetY, startX, startY;
let isTouchMove = false;
let count = 0; // Переменная для отслеживания количества товаров в корзине

// Функция обновления корзины
function updateCart(produktsInCart, cart, productName) {
  if (produktsInCart.includes(productName) && !cart.querySelector(`.${productName}`)) {
    cart.appendChild(current);
    count += 1;
  }
}

// Проверка попадания в корзину
function isInsideCart(x, y, cartRect) {
  return x > cartRect.left && x < cartRect.right && y > cartRect.top && y < cartRect.bottom;
}

// Обработчик начала перемещения
function handleDragStart(e) {
  if (e.type === 'touchstart') {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    current = e.target;

    const rect = current.getBoundingClientRect();
    offsetX = startX - rect.left;
    offsetY = startY - rect.top;

    current.style.position = 'absolute';
    current.style.zIndex = 1000;
  } else {
    current = this;
  }
}

// Обработчик перемещения для touch-событий
function handleTouchMove(e) {
  if (!current || !e.touches) return;
  isTouchMove = true;

  const moveX = e.touches[0].clientX;
  const moveY = e.touches[0].clientY;

  // Перемещаем элемент
  current.style.left = `${moveX - offsetX}px`;
  current.style.top = `${moveY - offsetY}px`;
}

// Обработчик окончания перемещения для touch-событий
function handleTouchEnd(e) {
  if (!isTouchMove) return;

  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const cartRects = [
    { cart: cartOne, rect: cartOne.getBoundingClientRect() },
    { cart: cartTwo, rect: cartTwo.getBoundingClientRect() },
    { cart: cartThree, rect: cartThree.getBoundingClientRect() },
  ];

  cartRects.forEach(({ cart, rect }) => {
    if (isInsideCart(endX, endY, rect)) {
      const productName = current.className.split(' ')[1];
      updateCart(produktsInCart[cart.className.split(' ')[0]], cart, productName);
    }
  });

  current.style.position = 'static';
  current.style.left = '';
  current.style.top = '';
  isTouchMove = false;

  buttonPay.style.display = count >= 3 ? 'flex' : 'none';
}

// Добавление обработчиков для продуктов
products.forEach(function (elem) {
  elem.addEventListener('dragstart', handleDragStart); // Для drag событий на десктопах
  elem.addEventListener('touchstart', handleDragStart); // Для touch событий на мобильных
  elem.addEventListener('dragend', handleTouchEnd); // Для drag событий на десктопах
  elem.addEventListener('touchend', handleTouchEnd); // Для touch событий на мобильных
  elem.addEventListener('touchmove', handleTouchMove); // Для touch событий на мобильных
  elem.addEventListener('drag', handleTouchMove); // Для drag событий на десктопах
});

// Обработчики для корзины
cart.addEventListener('dragover', function (e) {
  e.preventDefault(); // Чтобы событие drop сработало
});

cart.addEventListener('drop', function (e) {
  e.preventDefault();
  if (!current) return;

  const productName = current.className.split(' ')[1];
  updateCart(produktsInCart.cartOne, cartOne, productName);
  updateCart(produktsInCart.cartTwo, cartTwo, productName);
  updateCart(produktsInCart.cartThree, cartThree, productName);

  buttonPay.style.display = count >= 3 ? 'flex' : 'none';
});

// Кнопка "Оплатить"
buttonPay.addEventListener('click', () => {
  window.location.href = 'https://lavka.yandex.ru/';
});

// Функция для пульсации кнопки
function togglePulse() {
  buttonPay.classList.toggle('pulsate');
}

setInterval(togglePulse, 2000);
