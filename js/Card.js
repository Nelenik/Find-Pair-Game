import { Tag, CheckCallback } from "./_helpers.js";
/*options = {
  container: nodeEl,
  cardNumber: 1, 
  flip: ()=> {}
} */

export class Card {
  _open = false
  _success = false

  constructor(options) {
    const {container, cardNumber, flip} = options;
    this.container = container;
    this.createElement();
    this.cardNumber = cardNumber;
    this.flip = CheckCallback.check(flip);
  }
  // создаем карту
  createElement() {
    const cardEl = Tag.build({
      tagName: 'li',
      classes: ['pairs-field__item', 'card'],
    })
    const cardInner = Tag.build({
      tagName: 'div',
      classes: ['card__inner']
    })
    cardEl.addEventListener('click', ()=> {
      this.open = true;
      if(this.flip) this.flip(this);
    })
    cardEl.append(cardInner);
    this.card = cardEl;
    this.container.append(this.card)
  }
  // сеттер номера карты, создает содержимое обратной стороы карты
  set cardNumber(value) {
    this._cardNumber = value;
    this.card.dataset.cardNumber = `${value}`;
    const cardBack = Tag.build({
      tagName: 'div',
      classes: ['card__back'],
      inner: `<span class="card__back-content">${value}</span>`
    })
    cardBack.style.fontSize = `${this.card.clientWidth/2}px`
    const target = this.card.firstElementChild;
    target.innerHTML = ''
    target.append(cardBack)
  }

  get cardNumber() {
    return this._cardNumber;
  }
  // сеттер флага open карты
  set open(value) {
    this._open = value;
    value ? this.card.classList.add('card--flipped') : this.card.classList.remove('card--flipped')
  }

  get open() {
    return this._open;
  }
  //сеттер флага success карты
  set success(value) {
    this._success = value;
    value ? this.card.classList.add('card--success') : this.card.classList.remove('card--success')
  }

  get success() {
    return this._success;
  }
}