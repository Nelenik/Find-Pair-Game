import { PlayField } from "./PlayField.js";
import { HomePage } from "./HomePage.js";

import { Greeting } from "./GreetingPage.js";

const app = document.getElementById('pairs-app')
let playField;
const newPage = new HomePage({
  container: document.body,
  isActive: true,
  onSubmit: (form, instance) =>{
    if(!playField) {
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


// let greeting = new Greeting({
//   container: document.body,
//   isActive: true,
//   // title: 'you win',
//   // message: 'the count of moves-10'
// })

// greeting.message = 'hello'
// greeting.title = 'failed'
// greeting.update()
// console.log(greeting.title)

// greeting.message = '3 message'
// greeting.title = 'i am 3 message'
// greeting.update()