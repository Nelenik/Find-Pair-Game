import {Tag, CheckCallback} from './_helpers.js'
/*options = {
  container,
  title: str,
  message: str,
  isActive: true/false,
  success: true/false,
  onResume: (greeting-instance)=>{} (push resume btn)
  onGoingToMenu: (greetin-instance)=> {} (push new-game btn)
} */
export class Greeting{
  constructor(options) {
    const {container, title, message,success, isActive, onResume, onGoingToMenu} = options;
    this.container = container;
    this.createGreetingPage();
    this.success = success || null;
    this.title = title;
    this.message = message;
    this.createContent();
    this.isActive = isActive;
    this.onGoingToMenu = CheckCallback.check(onGoingToMenu);
    this.onResume = CheckCallback.check(onResume);
  }

  
  set title(value) {
    this._title = value;
  }
  
  get title() {
    return this._title
  }
  
  set message(value) {
    this._message = value;
  }
  
  get message() {
    return this._message;
    
  }

  set isActive(value) {
    this._isActive = value;
    value ? this.greetingPage.classList.add('greeting-page--active'): this.greetingPage.classList.remove('greeting-page--active');

  }

  get isActive() {
    return this._isActive;
  }

  set success(value) {
    this._success = value;
    this.greetingPage.classList.remove('greeting-page--success', 'greeting-page--failed');
    if(value == null) return;
    value ? this.greetingPage.classList.add('greeting-page--success') : this.greetingPage.classList.add('greeting-page--failed')
  }

  get success() {
    return this._success;
  }

  createGreetingPage() {
    const page = Tag.build({
      tagName: 'div',
      classes: ['greeting-page']
    });
    const contentWrap = Tag.build({
      tagName: 'div',
      classes: ['greeting-page__content-wrap'],
    });

    page.append(contentWrap)
    this.contentWrap = contentWrap;
    this.greetingPage = page;

    this.container.append(this.greetingPage);
  }
  createContent() {
    this.titleEl = Tag.build({
      tagName: 'h2',
      classes: ['greeting-page__title'],
      text: this._title,
    })
  
    this.messageEl = Tag.build({
      tagName: 'p',
      classes: ['greeting-page__message'],
      text: this._message,
  
    })

    const btnWrap = Tag.build({
      tagName: 'div',
      classes: ['greeting-page__btn-wrap'],

    })

    const resumeBtn = Tag.build({
      tagName: 'button',
      classes: ['greeting-page__resume', 'btn-reset'],
      attributes: {type: 'button'},
      text: 'Resume'
    })

    const newGameBtn = Tag.build({
      tagName: 'button',
      classes: ['greeting-page__new-game', 'btn-reset'],
      attributes: {type: 'button'},
      text: 'New game'
    })

    resumeBtn.addEventListener('click', (e) => {
      if(this.onResume) this.onResume(this);
    });

    newGameBtn.addEventListener('click', (e) => {
      if(this.onGoingToMenu)this.onGoingToMenu(this)
    });
    btnWrap.append(resumeBtn, newGameBtn);
    this.contentWrap.append(this.titleEl, this.messageEl, btnWrap);
  }

  update() {
    this.titleEl.textContent = this.title;
    this.messageEl.textContent = this.message;
  }
}

