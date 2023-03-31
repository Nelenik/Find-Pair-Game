import { PlayField } from "./PlayField.js";
import { HomePage } from "./HomePage.js";

import { Greeting } from "./GreetingPage.js";
const promisesCache = new Map()
function loadResource(src) {
  if (!src) return src;
  if (src.endsWith('.css')) {
    if (!promisesCache.has(src)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = src;

      const cssPromise = new Promise(resolve => {
        link.addEventListener('load', () => {
          resolve()
        })
      })
      promisesCache.set(src, cssPromise)
      document.head.append(link)
    }
    return promisesCache.get(src);
  }
  if (/.png|.jpg|.webp|.svg?/gi.test(src)) {
    if (!promisesCache.has(src)) {
      const imagePromise = new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.addEventListener('load', () => {
          resolve(img);
        });
      });
      promisesCache.set(src, imagePromise);
    }
    return promisesCache.get(src);
  }
}
const arr = [
  './css/pairs-app-styles.css',
  './img/card-front3.svg',
  './img/drawing-cat.png',
  './img/greet-bg.svg',
  './img/site-bg.svg',
  './img/smile-poz.svg',
  './img/smile-sad.svg',
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
        instance.isActive = false
      }
    })
  })
  .finally(() => {
    preloader.style.display = 'none';
  })






// const promisesCache = new Map()
// export function loadResource(src) {
//   if (!src) return src;
//   //js-file
//   if (src.endsWith('.js')) {
//     return import(src);
//   }
//   //css-file
//   if (src.endsWith('.css')) {
//     if (!promisesCache.has(src)) {
//       const link = document.createElement('link');
//       link.rel = 'stylesheet';
//       link.href = src;

//       const cssPromise = new Promise(resolve => {
//         link.addEventListener('load', () => {
//           resolve()
//         })
//       })
//       promisesCache.set(src, cssPromise)
//       document.head.append(link)
//     }
//     return promisesCache.get(src);
//   }
//   // Image file
//   if (/.png|.jpg|.webp|.svg?/gi.test(src)) {
//     if (!promisesCache.has(src)) {
//       const imagePromise = new Promise((resolve) => {
//         const img = new Image();
//         img.src = src;
//         img.addEventListener('load', () => {
//           resolve(img);
//         });
//       });
//       promisesCache.set(src, imagePromise);
//     }
//     return promisesCache.get(src);
//   }
//   //server responce
//   return fetch(src).then(res => res.json())
// }