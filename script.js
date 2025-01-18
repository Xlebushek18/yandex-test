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
let offsetX = 0, offsetY = 0;
let isTouching = false;

products.forEach(function (elem) {

  elem.addEventListener('dragstart', function () {
    current = this;
  });

  elem.addEventListener('touchstart', function (e) {
    isTouching = true;
    current = this;

    const rect = current.getBoundingClientRect();
    offsetX = e.touches[0].clientX - rect.left;
    offsetY = e.touches[0].clientY - rect.top;

    current.style.position = 'absolute';
    current.style.zIndex = 1000;

    moveElement(current, e.touches[0].clientX, e.touches[0].clientY);
  });

  elem.addEventListener('touchmove', function (e) {
    if (!isTouching || !current) return;
    e.preventDefault();
    moveElement(current, e.touches[0].clientX, e.touches[0].clientY);
  });

  elem.addEventListener('touchend', function () {
    if (!current) return;

    checkDrop(current);

    current.style.position = 'static';
    current.style.left = '';
    current.style.top = '';
    current.style.zIndex = '';
    current = null;
    isTouching = false;
  });
});

function moveElement(element, x, y) {
  element.style.left = `${x - offsetX}px`;
  element.style.top = `${y - offsetY}px`;
}

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

function updateCartVisuals() {
  let totalItems = 0;
  [cartOne, cartTwo, cartThree].forEach(cart => {
    totalItems += cart.childElementCount;
  });

  buttonPay.style.display = totalItems >= 3 ? 'flex' : 'none';
}

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

buttonPay.addEventListener('click', () => {
  window.location.href = 'https://lavka.yandex.ru/';
});
