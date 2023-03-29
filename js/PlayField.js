import { Tag, CheckCallback } from "./_helpers.js";
import { CardsList } from "./CardsList.js";
import { Timer } from "./Timer.js";
import { Greeting } from "./GreetingPage.js";
// import { HomePage } from "./HomePage.js";

/*formSettings = {(данные с формы настроек)
  cardsPerRow,
  mode: false/true,
  time: str,
  homePage: (homePage-instance)
} */

export class PlayField {
  _controlsInners = {
    pauseInner: `<span>Pause</span> <svg class="pause" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="2" height="18" rx="1" fill="#589642"/>
      <rect x="8" width="2" height="18" rx="1" fill="#589642"/>
      </svg>`,
    playInner: `<span>Play</span> <svg class="play" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.69238 15.7965L11.5716 8.79964C12.1428 8.39982 12.1428 7.60018 11.5716 7.20036L1.69238 0.203465C0.994271 -0.296313 0 0.183473 0 1.00311V14.9969C0 15.8165 0.994271 16.2963 1.69238 15.7965Z" fill="#589642"/></svg>`,
    resumeInner: `<span>Resume</span> <svg class="resume" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M891.36 477.76a364.48 364.48 0 0 0-720-40.96c-7.52 35.2-71.68 32-64-8.48a428.48 428.48 0 0 1 847.84 43.36"  /><path d="M127.2 488.64L43.84 352l54.72-33.44 49.92 82.08 81.92-50.08 33.44 54.72-136.64 83.36zM168.96 533.76a364.48 364.48 0 0 0 720 41.12c7.52-35.36 71.68-32 64 8.32a428.48 428.48 0 0 1-847.68-43.36"  /><path d="M932.48 522.72l84.64 135.84-54.24 33.92L912 611.04l-81.44 50.72-33.92-54.24 135.84-84.8z"  /></svg>`
  }
  constructor(container, formSettings) {
    const { cardsPerRow, mode, time, homePage } = formSettings;
    this.container = container;
    this.createField();
    this.time = time;
    this.mode = mode;
    this.cardsPerRow = cardsPerRow;
    this.homePage = homePage;
    this.greetingField = new Greeting({
      container: document.body,
      onResume: (instance) => {
        this.updateField();
        instance.isActive = false;
        instance.success = null;
      },
      onGoingToMenu: (instance) => {
        this.homePage.isActive = true;
        instance.isActive = false;
        instance.success = null;
      }
    })
  }

  createField() {
    this.field = Tag.build({
      tagName: 'div',
      classes: ['pairs-field']
    });
    this.container.append(this.field);

  }

  set mode(value) {
    this._mode = value;
  }

  get mode() {
    return this._mode
  }

  set cardsPerRow(value) {
    if (this.cardList) this.cardList.list.remove()
    this._cardsPerRow = value;
    this.cardList = new CardsList({
      container: this.field,
      mode: this._mode,
      cardsPerRow: value,
      onUpdate: (list) => {
        list.forEach(el => { el.open = false; el.success = false })
      },
      afterCardsCreating: (list) => {
        const delay = (ms) => {
          return new Promise(resolve => setTimeout(resolve, ms))
        }
        delay(300)
          .then(() => {
            list.forEach(el => el.open = true);
            return delay(1500)
          })
          .then(() => {
            list.forEach(el => el.open = false)
          })
      },
      onGameOver: (moves) => {
        if (this.timer) this.timer.pause();
        this.activateGreetingField('Поздравляю, хорошая игра!', `Количество ходов - ${moves}. Пора закрепить результат!`, true)
      }
    })
  }

  get cardsPerRow() {
    return this._cardsPerRow
  }

  set time(value) {
    this._time = value;
    if (this.bar) this.bar.remove();
    this.createControlBar();
    if (value) {
      this.createTimerBlock()
    }
  }

  get time() {
    return this._time
  }

  createControlBar() {
    const bar = Tag.build({
      tagName: 'div',
      classes: ['pairs-field__bar', 'control-bar']
    });

    const restartBtn = Tag.build({
      tagName: 'button',
      classes: ['btn-reset', 'control-bar__btn', 'reset-game-btn'],
      attributes: { type: 'button' },
      inner: this._controlsInners.resumeInner
    });
    const newGameBtn = Tag.build({
      tagName: 'button',
      classes: ['btn-reset', 'control-bar__btn', 'new-game-btn'],
      attributes: { type: 'button' },
      inner: 'New <span>Game</span>'
    });

    restartBtn.addEventListener('click', (e) => {
      this.updateField()
    });

    newGameBtn.addEventListener('click', (e) => {
      this.homePage.isActive = true
    })

    bar.append(restartBtn, newGameBtn)
    this.bar = bar;
    this.field.prepend(this.bar)
  }
  createTimerBlock() {
    const timerBlock = Tag.build({
      tagName: 'div',
      classes: ['control-bar__timer-wrap']
    })
    this.toggleBtn = Tag.build({
      tagName: 'button',
      classes: ['btn-reset', 'control-bar__btn', 'toggle-time-btn'],
      attributes: { type: 'button' },
      inner: this._controlsInners.pauseInner,
    });
    this.toggleBtn.addEventListener('click', (e) => {
      this.timer.isRunning = !this.timer.isRunning
      this.toggleBtn.innerHTML = this.timer.isRunning ? this._controlsInners.pauseInner : this._controlsInners.playInner;
    });
    timerBlock.append(this.toggleBtn)
    this.timer = new Timer({
      container: timerBlock,
      min: this._time,
      onTimeOut: () => {
        this.activateGreetingField('Увы, время закончилось', 'Но вы можете сыграть еще раз!', false)
      }
    })
    this.bar.prepend(timerBlock);
  }

  updateField() {
    if (this.timer) {
      this.timer.reset();
      this.toggleBtn.innerHTML = this._controlsInners.pauseInner;
    }
    this.cardList.update()
  }

  activateGreetingField(title, message, success) {
    this.greetingField.success = success;
    this.greetingField.title = title;
    this.greetingField.message = message;
    this.greetingField.update();
    setTimeout(() => this.greetingField.isActive = true, 1500)
  }
}