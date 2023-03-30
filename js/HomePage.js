import { Tag, CheckCallback } from "./_helpers.js";

/*options ={
  container,
  isActive: true/false,
  onSubmit:(this.form, home-page-instance)=>{}
} */

export class HomePage {
  constructor(options) {
    const {container, isActive, onSubmit} = options
    this.container = container;
    this.createHomePage();
    this.isActive = isActive || false;
    this.onSubmit = CheckCallback.check(onSubmit);
  }

  set isActive(value) {
    this._isActive = value;
    value ? this.homePage.classList.add('home-page--active') : this.homePage.classList.remove('home-page--active');
  }

  get isActive() {
    return this._isActive
  }

  createHomePage() {
    const wrapper = Tag.build({
      tagName: 'div',
      classes: ['home-page'],
    })

    const content = Tag.build({
      tagName: 'div',
      classes: ['home-page__content'],
    })
    const title = Tag.build({
      tagName: 'h1',
      classes: ['home-page__title'],
      text: 'Find a Pair'
    })
    const descr = Tag.build({
      tagName: 'p',
      classes: ['home-page__descr'],
      text: 'Переворачивай карточки и находи пары '
    })
    content.append(title, descr)
    wrapper.append(content);
    this.homePageContent = content;
    this.homePage = wrapper;
    this.container.append(this.homePage)
    this.createForm()
  }

  createForm() {
    const form = Tag.build({
      tagName: 'form',
      classes: ['home-page__form', 'settings-form'],
    });

    const sbmtBtn = Tag.build({
      tagName: 'button',
      classes: ['btn-reset', 'settings-form__sbmt-btn'],
      text: 'Играть',
    })

    form.append(this.createSizeSelect(),this.createModeField(), this.createTimeSelect(), sbmtBtn)
    this.form = form;
    this.homePageContent.append(this.form)
    
    this.form.addEventListener('submit', (e)=>{
      e.preventDefault();
      if(this.onSubmit) this.onSubmit(this.form, this);
      this.form.reset()
    })
  }

  createSizeSelect() {
    const sizeOptions = [
      new Option('Не выбрано', ''),
      new Option('2X2', '2'),
      new Option('4X4', '4'),
      new Option('6X6', '6'),
      new Option('8X8', '8'),
      new Option('10X10', '10')
    ];
    const sizeLabel = Tag.build({
      tagName: 'label',
      classes: ['settings-form__label', ],
      text: 'Размер поля:'
    });

    const sizeSelect = Tag.build({
      tagName: 'select',
      classes: ['settings-form__select', 'size-select'],
      attributes: { name: 'sizeSelect' }
    });
    sizeSelect.append(...sizeOptions);
    sizeLabel.append(sizeSelect);
    return sizeLabel
  }
  createTimeSelect() {
    const timeOptions = [
      new Option('Не на время', ''),
      new Option('30 сек', '0.5'),
      new Option('1 мин', '1'),
      new Option('2 мин', '2'),
      new Option('3 мин', '3'),
    ];
    const timeLabel = Tag.build({
      tagName: 'label',
      classes: ['settings-form__label'],
      text: 'Время:'
    });
    const timeSelect = Tag.build({
      tagName: 'select',
      classes: ['settings-form__select', 'time-select'],
      attributes: { name: 'timeSelect' }
    });
    timeSelect.append(...timeOptions);
    timeLabel.append(timeSelect);
    return timeLabel
  }
  createModeField() {
    const fieldset = Tag.build({
      tagName: 'fieldset',
      classes: ['settins-form__mode-group', 'mode-group']
    });
    const legend = Tag.build({
      tagName: 'legend',
      classes: ['mode-group__title'],
      text: 'Режим игры:',
    })
    const modeCheck = Tag.build({
      tagName: 'label',
      classes: ['checkbox', 'mode-group__label'],
      inner: `<span class="checkbox__left">Числа</span><input class="checkbox__def" type="checkbox" name="mode" value="true">
      <span class="checkbox__right checkbox__custom">Картинки</span>`
    })
    fieldset.append(legend, modeCheck);
    return fieldset
  }
}