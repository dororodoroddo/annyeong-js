import { ComponentParams, Annyeong } from "../index.js";

function AnnyeongDiv<P>(param: ComponentParams<HTMLDivElement, P>) {
    return Annyeong<HTMLDivElement, P>('div', param);
}

const test = (props: { a: string, b: number}) => AnnyeongDiv({
    props: { ...props },
    methods: {
        abc: function() {
            return 12;
        }
    },
    childs: [
        AnnyeongDiv({
            props: { ...props },
            attrs: {
                innerHTML() {
                    return `<<${this.a} // ${this.b}>>`
                },
            }
        })
    ],
    attrs: {
        style() {
            return {
                background: '#999',
                height: '100vh',
            }
        },
    }
})

const app = document.querySelector('#app');
app.appendChild( test({ a: '가나다', b: 123 }).el)