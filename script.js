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

let current;
let startX, startY, isTouchMove = false;
let count = 0; // Переменная для отслеживания количества товаров в корзине

// Функция обновления корзины
function updateCart(produktsInCart, cart, productName) {
  if (produktsInCart.includes(productName) && !cart.querySelector(`.${productName}`)) {
    cart.appendChild(current);
    count += 1;
    console.log(count);
  }
}

// Проверка попадания в корзину для мобильных устройств
function isInsideCart(x, y, cartRect) {
  return x > cartRect.left && x < cartRect.right && y > cartRect.top && y < cartRect.bottom;
}

// Обработчик начала перемещения
function handleDragStart(e) {
  if (e.type === 'touchstart') {
    // Для touch-событий
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  } else {
    // Для drag-событий
    current = this;
  }
}

// Обработчик перемещения для touch-событий
function handleTouchMove(e) {
  if (!current || !e.touches) return;
  isTouchMove = true;

  const moveX = e.touches[0].clientX;
  const moveY = e.touches[0].clientY;

  const deltaX = moveX - startX;
  const deltaY = moveY - startY;

  current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
}

// Обработчик окончания перемещения для touch-событий
function handleTouchEnd(e) {
  if (!isTouchMove) return;

  // Получаем координаты касания, чтобы определить, в какую корзину попал элемент
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const cartOneRect = cartOne.getBoundingClientRect();
  const cartTwoRect = cartTwo.getBoundingClientRect();
  const cartThreeRect = cartThree.getBoundingClientRect();

  if (isInsideCart(endX, endY, cartOneRect)) {
    updateCart(produktsInCart.cartOne, cartOne, current.className.split(' ')[1]);
  } else if (isInsideCart(endX, endY, cartTwoRect)) {
    updateCart(produktsInCart.cartTwo, cartTwo, current.className.split(' ')[1]);
  } else if (isInsideCart(endX, endY, cartThreeRect)) {
    updateCart(produktsInCart.cartThree, cartThree, current.className.split(' ')[1]);
  }

  // Сброс трансформации
  current.style.transform = '';
  isTouchMove = false;

  // Показываем или скрываем кнопку "Оплатить"
  if (count >= 3) {
    buttonPay.style.display = "flex";
  } else {
    buttonPay.style.display = "none";
  }
}

// Событие при движении объекта (для drag и touch)
function handleMove(e) {
  if (e.type === 'touchmove') {
    handleTouchMove(e);
  }
}

// Событие при окончании движения объекта (для drag и touch)
function handleEnd(e) {
  if (e.type === 'touchend') {
    handleTouchEnd(e);
  }
}

// Добавляем обработчики для перетаскивания товаров
products.forEach(function (elem) {
  elem.addEventListener('dragstart', handleDragStart);  // Для drag события на десктопах
  elem.addEventListener('touchstart', handleDragStart); // Для touch события на мобильных
  elem.addEventListener('dragend', handleEnd);          // Для drag события на десктопах
  elem.addEventListener('touchend', handleEnd);         // Для touch события на мобильных
  elem.addEventListener('touchmove', handleMove);       // Для touch события на мобильных
  elem.addEventListener('drag', handleMove);            // Для drag события на десктопах
});

// Обработчики для корзины
cart.addEventListener('dragover', function (e) {
  e.preventDefault();  // Чтобы событие drop сработало
});

cart.addEventListener('drop', function (e) {
  e.preventDefault();
  if (!current) return;
  
  let productName = current.className.split(' ')[1];

  // Добавляем товар в соответствующую корзину
  updateCart(produktsInCart.cartOne, cartOne, productName);
  updateCart(produktsInCart.cartTwo, cartTwo, productName);
  updateCart(produktsInCart.cartThree, cartThree, productName);

  // Показываем или скрываем кнопку "Оплатить"
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

// Функция для пульсации кнопки
function togglePulse() {
  buttonPay.classList.toggle('pulsate');
}

setInterval(togglePulse, 2000);
