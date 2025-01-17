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

// Инициализация перетаскивания мышью
products.forEach(function (elem) {
  elem.addEventListener('dragstart', function () {
    current = this;
  });
});

cart.addEventListener('dragover', function (e) {
  e.preventDefault();
});

cart.addEventListener('drop', function () {
  handleDrop();
});

// Добавляем поддержку тач-событий
products.forEach(function (elem) {
  elem.addEventListener('touchstart', function (e) {
    current = this;
    const touch = e.touches[0];
    const rect = current.getBoundingClientRect();
    touchOffset = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };

    current.style.position = 'absolute';
    current.style.zIndex = 1000;
    moveAt(touch.clientX, touch.clientY);
  });

  elem.addEventListener('touchmove', function (e) {
    e.preventDefault(); // Предотвращаем скроллинг страницы при движении
    const touch = e.touches[0];
    moveAt(touch.clientX, touch.clientY);
  });

  elem.addEventListener('touchend', function () {
    handleDrop();
  });
});

function moveAt(x, y) {
  if (current) {
    current.style.left = x - touchOffset.x + 'px';
    current.style.top = y - touchOffset.y + 'px';
  }
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

function handleDrop() {
  if (!current) return;

  const productName = current.className.split(' ')[1];
  console.log(productName);

  const touch = event.changedTouches ? event.changedTouches[0] : null;
  if (touch) {
    const touchX = touch.clientX;
    const touchY = touch.clientY;

    if (isOverCart(touchX, touchY, cartOne)) {
      updateCart(produktsInCart.cartOne, cartOne, productName);
    } else if (isOverCart(touchX, touchY, cartTwo)) {
      updateCart(produktsInCart.cartTwo, cartTwo, productName);
    } else if (isOverCart(touchX, touchY, cartThree)) {
      updateCart(produktsInCart.cartThree, cartThree, productName);
    }
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

let count = 0;
let zIndex = 1;

function updateCart(produktsInCart, cart, productName) {
  if (produktsInCart.includes(productName)) {
    cart.appendChild(current);
    cart.style.zIndex = zIndex++; // Увеличиваем z-index для видимости
    count += 1;
    console.log(`Count: ${count}`);
  }
}

// Кнопка "Оплатить корзину"
buttonPay.addEventListener('click', () => {
  window.location.href = 'https://lavka.yandex.ru/';
});

function togglePulse() {
  buttonPay.classList.toggle('pulsate');
}

setInterval(togglePulse, 2000);
