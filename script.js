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
let offsetX = 0, offsetY = 0; // Смещения для тача
let isTouching = false; // Флаг для определения touch-событий

products.forEach(function (elem) {
  // Для мыши: начало перетаскивания
  elem.addEventListener('dragstart', function () {
    current = this;
  });

  // Для тач-событий: начало переноса
  elem.addEventListener('touchstart', function (e) {
    isTouching = true;
    current = this;

    const rect = current.getBoundingClientRect();
    offsetX = e.touches[0].clientX - rect.left;
    offsetY = e.touches[0].clientY - rect.top;

    // Устанавливаем абсолютное позиционирование
    current.style.position = 'absolute';
    current.style.zIndex = 1000;

    // Приводим элемент к точке касания
    moveElement(current, e.touches[0].clientX, e.touches[0].clientY);
  });

  // Для тач-событий: перемещение
  elem.addEventListener('touchmove', function (e) {
    if (!isTouching || !current) return;
    e.preventDefault(); // Предотвращаем прокрутку экрана
    moveElement(current, e.touches[0].clientX, e.touches[0].clientY);
  });

  // Для тач-событий: завершение переноса
  elem.addEventListener('touchend', function () {
    if (!current) return;

    // Проверяем, попал ли элемент в корзину
    checkDrop(current);

    // Возвращаем исходное состояние
    current.style.position = 'static';
    current.style.left = '';
    current.style.top = '';
    current.style.zIndex = '';
    current = null;
    isTouching = false;
  });
});

// Перемещение элемента к указанным координатам
function moveElement(element, x, y) {
  element.style.left = `${x - offsetX}px`;
  element.style.top = `${y - offsetY}px`;
}

// Проверка, попал ли элемент в корзину
function checkDrop(element) {
  const rects = [
    { cart: cartOne, products: produktsInCart.cartOne },
    { cart: cartTwo, products: produktsInCart.cartTwo },
    { cart: cartThree, products: produktsInCart.cartThree }
  ];

  const elementRect = element.getBoundingClientRect();

  rects.forEach(({ cart, products }) => {
    const cartRect = cart.getBoundingClientRect();
    if (
      elementRect.left < cartRect.right &&
      elementRect.right > cartRect.left &&
      elementRect.top < cartRect.bottom &&
      elementRect.bottom > cartRect.top
    ) {
      const productName = element.className.split(' ')[1];
      if (products.includes(productName)) {
        cart.appendChild(element);
        updateCartVisuals();
      }
    }
  });
}

// Обновление состояния корзины
function updateCartVisuals() {
  let totalItems = 0;
  [cartOne, cartTwo, cartThree].forEach(cart => {
    totalItems += cart.childElementCount;
  });

  buttonPay.style.display = totalItems >= 3 ? 'flex' : 'none';
}

// Для мыши: дроп объекта
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

  updateCartVisuals();
});

// Кнопка "Оплатить"
buttonPay.addEventListener('click', () => {
  window.location.href = 'https://lavka.yandex.ru/';
});
