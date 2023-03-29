/*класс tag builder, вызов Tag.build({
  tagName: 'elem-name',
  classes: ['class1', 'class2'],
  attributes: {type: 'text', 'data-set': 'value'},
  text: 'some text',
  inner: 'inner.html',
  value: 'value for inputs'
})
*/
export class Tag {
  static build(options) {
    const tag = document.createElement(options.tagName);
    if (options.classes) tag.classList.add(...options.classes);
    if (options.attributes) {
      for (let key in options.attributes) {
        tag.setAttribute(key, options.attributes[key]);
      }
    }
    if (options.text) tag.textContent = options.text;
    if (options.inner) tag.innerHTML = options.inner;
    if (options.value) tag.value = options.value;
    return tag;
  }
}

export class CheckCallback{
  static check(func) {
    if (typeof func === 'function') {
      return func;
    } else if (func !== undefined && func !== null) {
      throw new Error(`"${func}" must be a function`);
    } else {
      return null
    }
  }
}
