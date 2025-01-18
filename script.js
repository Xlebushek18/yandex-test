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
  cartThree: ['pineapple', 'bananas', 'apple', 'salads']
};

let current;
let startX, startY, offsetX, offsetY;
let count = 0; // Переменная для отслеживания количества товаров в корзине
let zIndex = 1; // Индекс для управления слоями перетаскиваемых элементов

// Функция обновления корзины
function updateCart(produktsInCart, cart, productName) {
  if (produktsInCart.includes(productName)) {
    cart.appendChild(current);
    cart.style.zIndex = zIndex++;
    count += 1;
    console.log(count);
  }
}

// Функция для проверки, попал ли объект в корзину
function isInsideCart(x, y, cartRect) {
  return x > cartRect.left && x < cartRect.right && y > cartRect.top && y < cartRect.bottom;
}

// Обработчик начала перетаскивания
function handleDragStart(e) {
  if (e.type === 'touchstart') {
    // Для touch-событий
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    current = e.target;
    
    const rect = current.getBoundingClientRect();
    offsetX = startX - rect.left;
    offsetY = startY - rect.top;
    
    current.style.position = 'absolute';
    current.style.zIndex = zIndex++;
  } else {
    // Для drag-событий на ПК
    current = this;
  }
}

// Обработчик перемещения объекта (для touch и drag)
function handleMove(e) {
  if (!current) return;

  let moveX, moveY;

  if (e.type === 'touchmove') {
    // Для touch-событий
    moveX = e.touches[0].clientX;
    moveY = e.touches[0].clientY;
  } else {
    // Для drag-событий на ПК
    moveX = e.clientX;
    moveY = e.clientY;
  }

  // Перемещение объекта по экрану
  current.style.left = `${moveX - offsetX}px`;
  current.style.top = `${moveY - offsetY}px`;
}

// Обработчик окончания перетаскивания
function handleEnd(e) {
  if (!current) return;

  let endX, endY;

  if (e.type === 'touchend') {
    // Для touch-событий
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
  } else {
    // Для drag-событий на ПК
    endX = e.clientX;
    endY = e.clientY;
  }

  const cartRects = [
    { cart: cartOne, rect: cartOne.getBoundingClientRect() },
    { cart: cartTwo, rect: cartTwo.getBoundingClientRect() },
    { cart: cartThree, rect: cartThree.getBoundingClientRect() }
  ];

  // Проверка попадания в корзину
  cartRects.forEach(({ cart, rect }) => {
    if (isInsideCart(endX, endY, rect)) {
      const productName = current.className.split(' ')[1];
      updateCart(produktsInCart[cart.className.split(' ')[0]], cart, productName);
    }
  });

  // Сброс позиции объекта
  current.style.position = 'static';
  current.style.left = '';
  current.style.top = '';

  // Показ или скрытие кнопки "Оплатить"
  buttonPay.style.display = count >= 3 ? 'flex' : 'none';
}

// Обработчики для продуктов
products.forEach(function (elem) {
  elem.addEventListener('dragstart', handleDragStart); // Для ПК (drag)
  elem.addEventListener('touchstart', handleDragStart); // Для мобильных устройств (touch)
  elem.addEventListener('dragend', handleEnd); // Для ПК (drag)
  elem.addEventListener('touchend', handleEnd); // Для мобильных устройств (touch)
  elem.addEventListener('touchmove', handleMove); // Для мобильных устройств (touch)
  elem.addEventListener('drag', handleMove); // Для ПК (drag)
});

// Обработчик для корзины (dragover для drop)
cart.addEventListener('dragover', function (e) {
  e.preventDefault(); // Чтобы событие drop сработало
});

cart.addEventListener('drop', function () {
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
