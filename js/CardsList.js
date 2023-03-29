import { Tag, CheckCallback } from "./_helpers.js";
import { Card } from "./Card.js";
import { AmazingCard } from "./AmazinCard.js";

/*options= {
  container,
  countPerRow,
  mode: false(numbers, def)/true(img)
  onGameOver: ()=>{}
  onUpdate: (cardList)=>{}(делаем что то при обновлении списка, принимает массив с экземплярами карт)
  afterCardsCreating: (cardList) => {вызывается после создания карточек}
} */


export class CardsList {
  _cardsNumbers = []
  _cardList = []
  _moves = 0

  constructor(options) {
    const { container, cardsPerRow, mode, onGameOver, onUpdate, afterCardsCreating } = options;
    this.container = container;
    this.createCardsList();
    this.afterCardsCreating = CheckCallback.check(afterCardsCreating);
    this.cardsPerRow = cardsPerRow || 4;
    this.mode = mode || false;
    this.onGameOver = CheckCallback.check(onGameOver);
    this.onUpdate = CheckCallback.check(onUpdate);
  }

  createCardsList() {
    const list = Tag.build({
      tagName: 'ul',
      classes: ['list-reset', 'pairs-field__list']
    })
    this.list = list;
    this.container.append(this.list)
  }
  // сеттер режима игры, в зависимости от режима создает карточки с цифрами или с изображениями
  set mode(value) {
    this._mode = value;
    let halfOfCards = this.cardsTotalCount / 2;
    this.list.innerHTML = '';
    this._cardList = [];
    this._cardsNumbers = [];
    this._moves = 0;
    if (value) {
      this.getRandomArray(halfOfCards, 1, 50);
      this.shuffle();
      this._cardsNumbers.forEach(el => {
        let card = new AmazingCard({
          container: this.list,
          cardNumber: el,
          flip: this.flip.bind(this)
        })
        this._cardList.push(card)
      })
    } else {
      this.getOrderedArray(halfOfCards);
      this.shuffle();
      this._cardsNumbers.forEach(el => {
        let card = new Card({
          container: this.list,
          cardNumber: el,
          flip: this.flip.bind(this)
        })

        this._cardList.push(card)

      })
    }
    if (this.afterCardsCreating) {
      this.afterCardsCreating(this._cardList)
    }
  }

  get mode() {
    return this._mode;
  }
  // сеттер количества карточек в строке, при его изменении перерисовывается card-list
  set cardsPerRow(value) {
    this._cardsPerRow = value;
    this.cardsTotalCount = Math.pow(value, 2);
    this.list.style.cssText = `grid-template-columns: repeat(${value}, 1fr);`
  }

  get cardsPerRow() {
    return this._cardsPerRow;
  }
  // метод перемешивает массив чисел
  shuffle() {
    let arr = this._cardsNumbers;
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }
  // метод создает массив рандомных чисел в заданном диапазоне. применяется чтобы при каждом обвнолении игры на поле попадали рандомные картинки. 
  getRandomArray(count, n, m) {
    if (count >= Math.max(n, m)) this.getOrderedArray(count);
    while (this._cardsNumbers.length < this.cardsTotalCount) {
      let random = (Math.min(n, m) + Math.floor(Math.random() * Math.abs(n - m)));
      if (!this._cardsNumbers.includes(random)) this._cardsNumbers.push(random, random)
    }
  }
  // метод создает упорядоченный массив чисел для режима с числами
  getOrderedArray(count) {
    let arr = Array.from({ length: count }, (_, i) => i + 1)
    this._cardsNumbers = arr.concat(arr)
  }
  // метод передается в конструктор карты и срабатывает при клике на нее 
  flip() {
    this.compareCards()
    this.checkGameOver()
  }
  // метод сравнивает 2 карты, при совпадении переключает флаг карты success на true, в противном случае переворачивает карты обратно
  compareCards() {
    let getNumber = (arr, i) => {
      return arr[i].card.dataset.cardNumber;
    };
    let opened = this._cardList.filter(el => (el.open && !el.success))
    if (opened.length == 2) {
      this._moves++;
      if (getNumber(opened, 0) === getNumber(opened, 1)) {
        opened.forEach(el => el.success = true);
        return;
      } else {
        setTimeout(() => opened.forEach(el => el.open = false), 900)
      }
    }
  }
  // метод позволяет что то сделать в момент завершения игры, например вывести диалоговое окно.
  checkGameOver() {
    let successful = this._cardList.filter(el => el.success);
    if ((successful.length == this.cardsTotalCount) && this.onGameOver) this.onGameOver(this._moves)
  }
  // метод обновления списка карт
  update() {
    let delay;
    if (this.onUpdate) {
      delay = 900;
      this.onUpdate(this._cardList);
    } else delay = 0;
    setTimeout(() => {
      this.cardsPerRow = this.cardsPerRow;
      this.mode = this.mode;
    }, delay)
  }
}