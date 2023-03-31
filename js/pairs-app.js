import { PlayField } from "./PlayField.js";
import { HomePage } from "./HomePage.js";
import { loadResource } from "./_helpers.js";

const arr = [
  './css/pairs-app-styles.css',
  './img/drawing-cat.png',
  './img/site-bg.svg',
]
const preloader = document.getElementById('preloader')
const app = document.getElementById('pairs-app')
Promise.all(arr.map(el => loadResource(el)))
  .then(() => {
    let playField;
    const newPage = new HomePage({
      container: document.body,
      isActive: true,
      onSubmit: (form, instance) => {
        if (!playField) {
          playField = new PlayField(app, {
            homePage: instance,
          })
        }
        playField.mode = form.mode.checked;//важен порядок обновления mode и cardsPerRow;
        playField.cardsPerRow = form.sizeSelect.value;
        playField.time = form.timeSelect.value;
        instance.isActive = false;
      }
    })
  })
  .finally(() => {
    preloader.style.display = 'none';
  })
