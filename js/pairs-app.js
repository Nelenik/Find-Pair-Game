import { PlayField } from "./PlayField.js";
import { HomePage } from "./HomePage.js";

import { Greeting } from "./GreetingPage.js";

const preloader = document.getElementById('preloader')
const app = document.getElementById('pairs-app')
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
      instance.isActive = false
    }
  })


