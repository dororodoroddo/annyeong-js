import { AnnyeongDiv } from '../ComponentDeclare.js';
import { Annyeong } from '../../index.js';

const test = (props: { a: string; b: number }) => {
  return AnnyeongDiv({
    props: { ...props },
    methods: {
      ab: function () {
        return 12;
      },
    },
    childs() {
      return [
        test2({ abc: this.b, c: this.a }),
        test2({ abc: this.b, c: '123' }),
        test2({ abc: this.b, c: '123' }),
        inputEl(),
      ];
    },
    attrs: {
      style() {
        return {
          background: '#999',
          height: '100vh',
        };
      },
    },
  });
};

const test2 = (props: { abc: number; c: string }) => {
  return AnnyeongDiv({
    props: {
      ...props,
    },
    attrs: {
      innerHTML() {
        return `abc = ${this.abc}/ // ${this.c}`;
      },
    },
  });
};

let prevVal = '';
const inputEl = () => {
  return Annyeong<HTMLInputElement, { data: void }>('input', {
    attrs: {
      type: 'text',
      oninput() {
        return (e: InputEvent) => {
          const target = e.target as HTMLInputElement;
          const numstr = target.value.replace(/([^0-9])/g, '');
          if (numstr === '0' || numstr === '') {
            target.value = '';
            prevVal = '';
            return;
          }
          if (prevVal === numstr && /[0-9]$/.test(target.value)) {
            prevVal = prevVal.slice(0, prevVal.length - 1);
            target.value = prevVal.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (prevVal ? '원' : '');
            return;
          }
          prevVal = numstr;
          target.value = numstr.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
        };
      },
      style() {
        return {
          width: '100vw',
          color: 'transparent',
          textShadow: '0 0 0 #000'
        };
      },
    },
  });
};
export default test;
