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
}

let current;

products.forEach(function (elem) {
  elem.addEventListener('dragstart', function (e) {
    current = this
  })
})

cart.addEventListener('dragover', function (e) {
  e.preventDefault()
})

let count = 0
let zIndex = 1

function updateCart(produktsInCart, cart, productName) {
  if (produktsInCart.includes(productName)) {
    cart.appendChild(current)
    cart.style = `z-index: ${zIndex++}`
    count += 1
    console.log(count)
  }
}

cart.addEventListener('drop', function (e) {
  if (!current) return
  let productName = current.className.split(' ')[1]
  console.log(productName)

  updateCart(produktsInCart.cartOne, cartOne, productName)
  updateCart(produktsInCart.cartTwo, cartTwo, productName)
  updateCart(produktsInCart.cartThree, cartThree, productName)

  if (count >= 3) {
    buttonPay.classList.add('button-pay-visible')
  }
})

buttonPay.addEventListener('click', () => {
  window.location.href = 'https://lavka.yandex.ru/';
})

function togglePulse() {
  buttonPay.classList.toggle('pulsate');
}

setInterval(togglePulse, 2000);