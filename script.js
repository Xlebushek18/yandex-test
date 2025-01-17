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

let current; // Текущий перетаскиваемый элемент
let touchOffset = { x: 0, y: 0 }; // Смещение при касании
let count = 0;
let zIndex = 1;

// Инициализация перетаскивания мышью и тачем
function startDrag(e) {
  current = this;
  const touch = e.touches ? e.touches[0] : e; // Проверяем, это тач или мышь
  const rect = current.getBoundingClientRect();
  touchOffset = {
    x: touch.clientX - rect.left, // Смещение по оси X
    y: touch.clientY - rect.top   // Смещение по оси Y
  };

  current.style.position = 'absolute';
  current.style.zIndex = 1000;
  moveAt(touch.clientX, touch.clientY);
}

function moveAt(x, y) {
  if (current) {
    current.style.left = x - touchOffset.x + 'px'; // Смещение по X
    current.style.top = y - touchOffset.y + 'px';  // Смещение по Y
  }
}

function endDrag() {
  if (!current) return;

  const productName = current.className.split(' ')[1];
  console.log(productName);

  const touch = event.changedTouches ? event.changedTouches[0] : event;
  const touchX = touch.clientX;
  const touchY = touch.clientY;

  if (isOverCart(touchX, touchY, cartOne)) {
    updateCart(produktsInCart.cartOne, cartOne, productName);
  } else if (isOverCart(touchX, touchY, cartTwo)) {
    updateCart(produktsInCart.cartTwo, cartTwo, productName);
  } else if (isOverCart(touchX, touchY, cartThree)) {
    updateCart(produktsInCart.cartThree, cartThree, productName);
  }

  // Сбрасываем текущий элемент в исходное состояние
  current.style.position = '';
  current.style.zIndex = '';
  current.style.left = '';
  current.style.top = '';
  current = null;

  // Проверяем, показывать ли кнопку оплаты
  buttonPay.style.display = count >= 3 ? 'flex' : 'none';
}

function isOverCart(touchX, touchY, cart) {
  const rect = cart.getBoundingClientRect();
  return (
    touchX >= rect.left &&
    touchX <= rect.right &&
    touchY >= rect.top &&
    touchY <= rect.bottom
  );
}

function updateCart(produktsInCart, cart, productName) {
  if (produktsInCart.includes(productName)) {
    cart.appendChild(current);
    cart.style.zIndex = zIndex++; // Увеличиваем z-index для видимости
    count += 1;
    console.log(`Count: ${count}`);
  }
}

// Обработчики для тач-событий и мышиных событий
products.forEach(function (elem) {
  elem.addEventListener('dragstart', function () {
    current = this;
  });

  // Обработчик тач-события
  elem.addEventListener('touchstart', startDrag);
  elem.addEventListener('touchmove', function (e) {
    e.preventDefault(); // Предотвращаем скроллинг страницы
    const touch = e.touches[0];
    moveAt(touch.clientX, touch.clientY);
  });
  elem.addEventListener('touchend', endDrag);

  // Обработчик для мышиных событий
  elem.addEventListener('mousedown', startDrag);
  elem.addEventListener('mousemove', function (e) {
    if (current) {
      moveAt(e.clientX, e.clientY);
    }
  });
  elem.addEventListener('mouseup', endDrag);
  elem.addEventListener('mouseleave', endDrag); // Для мыши, если выходим за пределы экрана
});

cart.addEventListener('dragover', function (e) {
  e.preventDefault(); // Нужно для поддержки drop-события
});

cart.addEventListener('drop', function () {
  endDrag(); // Вызываем drop-логику
});

// Кнопка "Оплатить корзину"
buttonPay.addEventListener('click', () => {
  window.location.href = 'https://lavka.yandex.ru/';
});

function togglePulse() {
  buttonPay.classList.toggle('pulsate');
}

setInterval(togglePulse, 2000);
