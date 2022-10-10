import styleDeclare from './StyleDeclare.js';
import test from './src/test.js';
declare global {
  interface Window {
    test2: any;
  }
}
styleDeclare();

const $app = document.querySelector('#app');
const app = test({ a: '가나다', b: 123 });
window.test2 = app;
$app.appendChild(app.el);
