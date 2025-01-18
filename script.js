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
let offsetX = 0, offsetY = 0; // Смещение для touch-событий

products.forEach(function (elem) {
  // Обработчик для начала перетаскивания
  elem.addEventListener('dragstart', function () {
    current = this;
  });

  // Для тач-событий: начало переноса
  elem.addEventListener('touchstart', function (e) {
    current = this;

    const rect = current.getBoundingClientRect();
    offsetX = e.touches[0].clientX - rect.left;
    offsetY = e.touches[0].clientY - rect.top;

    // Устанавливаем абсолютное позиционирование
    current.style.position = 'absolute';
    current.style.zIndex = 1000;
  });

  // Для тач-событий: перемещение
  elem.addEventListener('touchmove', function (e) {
    if (!current) return;

    const touch = e.touches[0];
    current.style.left = `${touch.clientX - offsetX}px`;
    current.style.top = `${touch.clientY - offsetY}px`;
  });

  // Для тач-событий: завершение переноса
  elem.addEventListener('touchend', function (e) {
    if (!current) return;

    const touch = e.changedTouches[0];
    const dropX = touch.clientX;
    const dropY = touch.clientY;

    const cartRects = [
      { cart: cartOne, rect: cartOne.getBoundingClientRect() },
      { cart: cartTwo, rect: cartTwo.getBoundingClientRect() },
      { cart: cartThree, rect: cartThree.getBoundingClientRect() }
    ];

    // Проверяем, попал ли элемент в одну из корзин
    cartRects.forEach(({ cart, rect }) => {
      if (
        dropX > rect.left &&
        dropX < rect.right &&
        dropY > rect.top &&
        dropY < rect.bottom
      ) {
        const productName = current.className.split(' ')[1];
        if (produktsInCart[cart.className.split(' ')[0]].includes(productName)) {
          cart.appendChild(current);
        }
      }
    });

    // Возвращаем элемент в нормальное состояние
    current.style.position = 'static';
    current.style.left = '';
    current.style.top = '';
    current.style.zIndex = '';

    current = null;
  });
});

// Обработчик для перетаскивания на ПК (dragover для drop)
cart.addEventListener('dragover', function (e) {
  e.preventDefault();
});

cart.addEventListener('drop', function () {
  if (!current) return;
  const productName = current.className.split(' ')[1];

  if (produktsInCart.cartOne.includes(productName)) {
    cartOne.appendChild(current);
  } else if (produktsInCart.cartTwo.includes(productName)) {
    cartTwo.appendChild(current);
  } else if (produktsInCart.cartThree.includes(productName)) {
    cartThree.appendChild(current);
  }
});

// Кнопка "Оплатить"
buttonPay.addEventListener('click', () => {
  window.location.href = 'https://lavka.yandex.ru/';
});
