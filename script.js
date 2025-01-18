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

let current; // текущий перемещаемый элемент
let offsetX, offsetY, startX, startY; // координаты касания
let isTouchMove = false; // флаг движения элемента
let count = 0; // для подсчета количества товаров в корзине

// Функция обновления корзины
function updateCart(produktsInCart, cart, productName) {
  if (produktsInCart.includes(productName) && !cart.querySelector(`.${productName}`)) {
    cart.appendChild(current);
    count += 1;
  }
}

// Проверка попадания элемента в корзину
function isInsideCart(x, y, cartRect) {
  return x > cartRect.left && x < cartRect.right && y > cartRect.top && y < cartRect.bottom;
}

// Обработчик начала перемещения
function handleDragStart(e) {
  if (e.type === 'touchstart') {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

    current = e.target; // текущий перетаскиваемый элемент
    const rect = current.getBoundingClientRect();

    offsetX = startX - rect.left;
    offsetY = startY - rect.top;

    current.style.position = 'absolute';
    current.style.zIndex = 1000;
  } else if (e.type === 'dragstart') {
    current = this;
  }
}

// Обработчик перемещения
function handleTouchMove(e) {
  if (!current || !e.touches) return;

  isTouchMove = true;

  const moveX = e.touches[0].clientX;
  const moveY = e.touches[0].clientY;

  // Перемещаем элемент по экрану
  current.style.left = `${moveX - offsetX}px`;
  current.style.top = `${moveY - offsetY}px`;
}

function handleDragEnd(e) {
  const cartRects = [
    { cart: cartOne, rect: cartOne.getBoundingClientRect() },
    { cart: cartTwo, rect: cartTwo.getBoundingClientRect() },
    { cart: cartThree, rect: cartThree.getBoundingClientRect() },
  ];

  // Координаты конца касания
  const endX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
  const endY = e.type === 'touchend' ? e.changedTouches[0].clientY : e.clientY;

  // Проверяем, попал ли элемент в одну из корзин
  cartRects.forEach(({ cart, rect }) => {
    if (isInsideCart(endX, endY, rect)) {
      const productName = current.className.split(' ')[1];
      updateCart(produktsInCart[cart.className.split(' ')[0]], cart, productName);
    }
  });

  // Сбрасываем положение элемента
  current.style.left = '';
  current.style.top = '';
  current.style.position = 'static';

  isTouchMove = false;

  // Обновляем видимость кнопки "Оплатить"
  buttonPay.style.display = count >= 3 ? 'flex' : 'none';
}

// Привязываем обработчики для всех продуктов
products.forEach((product) => {
  product.addEventListener('dragstart', handleDragStart);
  product.addEventListener('dragend', handleDragEnd);
  product.addEventListener('touchstart', handleDragStart);
  product.addEventListener('touchmove', handleTouchMove);
  product.addEventListener('touchend', handleDragEnd);
});

// Настраиваем обработчик для корзины
cart.addEventListener('dragover', (e) => e.preventDefault());
cart.addEventListener('drop', (e) => {
  e.preventDefault();
  if (!current) return;

  const productName = current.className.split(' ')[1];
  updateCart(produktsInCart.cartOne, cartOne, productName);
  updateCart(produktsInCart.cartTwo, cartTwo, productName);
  updateCart(produktsInCart.cartThree, cartThree, productName);

  buttonPay.style.display = count >= 3 ? 'flex' : 'none';
});

// Обработчик для кнопки "Оплатить"
buttonPay.addEventListener('click', () => {
  window.location.href = 'https://lavka.yandex.ru/';
});

// Пульсация кнопки "Оплатить"
function togglePulse() {
  buttonPay.classList.toggle('pulsate');
}
setInterval(togglePulse, 2000);
