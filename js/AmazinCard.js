import { Card } from "./Card.js";

export class AmazingCard extends Card {
  // сеттер номера карты создает изображение
  set cardNumber(value) {
    this._cardNumber = value;
    this.card.dataset.cardNumber = `${value}`;
    const cardBackImg = document.createElement('img');
    cardBackImg.classList.add('card__back');
    this._imgPromise = new Promise((resolve, reject) => {
      cardBackImg.src = `./img/amazing-cards/${value}.jpg`;
      cardBackImg.addEventListener('load', resolve)
      cardBackImg.addEventListener('error', () => {
        cardBackImg.src = './img/default.jpg';
        reject(new Error('Не удалось загрузить изображение'))
      })
    })
      .catch((error) => {
        console.log(error.message)
      })
      .finally(() => {
        const target = this.card.firstElementChild;
        target.innerHTML = ''
        target.append(cardBackImg)
      })
  }
  get cardNumber() {
    return this._cardNumber;
  }

  get imgPromise() {
    return this._imgPromise;
  }
}