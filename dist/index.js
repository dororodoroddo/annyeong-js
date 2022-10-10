let id = 0;
function getHash() {
    return `ANID${++id}`;
}
export class AnnyeongComponent {
    constructor(el, param) {
        this.childsIds = [];
        this.propsTree = {};
        this.updateChilds = () => {
            var _a;
            AnnyeongComponent.returnProps = true;
            const newProps = ((_a = this.childsFunction) === null || _a === void 0 ? void 0 : _a.apply(this.props)) || [];
            AnnyeongComponent.returnProps = false;
            for (let idx = 0; idx < newProps.length; ++idx) {
                this.childs[idx].updateProps(newProps[idx]);
            }
        };
        this.handler = {
            set(obj, prop, value) {
                return Reflect.set(obj, prop, value);
            },
            get: function (target, prop, receiver) {
                return Reflect.get(target, prop, receiver);
            },
            apply: function (target, thisArg, argumentsList) {
                return Reflect.apply(target, thisArg, argumentsList);
            },
            deleteProperty(target, prop) {
                if (prop in target) {
                    delete target[prop];
                    return true;
                }
                return false;
            },
        };
        const { childs, props, attrs, mounted, methods, watchs, beforeDestroy, key } = param;
        this.el = document.createElement(el);
        this.props = Object.assign({}, props);
        this.methods = Object.assign({}, methods);
        this.watchs = Object.assign({}, watchs);
        this.attrs = Object.assign({}, attrs);
        this.childs = [];
        this.beforeDestroy = beforeDestroy;
        this.key = key ? key : getHash();
        this.props = new Proxy(this.props, {
            set: (obj, prop, value) => {
                if (obj[prop] === value) {
                    return;
                }
                for (const func of this.propsTree[prop] || []) {
                    func();
                }
                return Reflect.set(obj, prop, value);
            },
            get: (target, prop, receiver) => {
                if (this.observeTarget) {
                    if (this.propsTree[prop] === undefined) {
                        this.propsTree[prop] = [];
                    }
                    this.propsTree[prop].push(this.observeTarget);
                }
                return Reflect.get(target, prop, receiver);
            },
        });
        if (childs) {
            this.observeTarget = this.updateChilds;
            const childComponents = (childs === null || childs === void 0 ? void 0 : childs.apply(Object.assign({}, this.props))) || [];
            const childsLength = (childComponents === null || childComponents === void 0 ? void 0 : childComponents.length) || 0;
            const childsKeys = {};
            for (let idx = 0; idx < childsLength; ++idx) {
                const childComponent = childComponents[idx];
                this.el.appendChild(childComponent.el);
                this.childs.push(childComponent);
                this.childsIds.push(childComponent.key);
                if (childComponent.key in childsKeys) {
                    throw new Error(`has duplicated key in ${this.key}`);
                }
                childsKeys[childComponent.key] = true;
            }
            this.childsFunction = childs;
        }
        for (const key in attrs) {
            const attr = attrs[key];
            if (typeof attr === 'string') {
                this.el[key] = attr;
                continue;
            }
            const property = attr.call(param.props);
            if (typeof property === 'object') {
                for (const key2 in property) {
                    const attrDepth2 = this.el[key];
                    if (attrDepth2[key2] !== property[key2]) {
                        attrDepth2[key2] = property[key2];
                    }
                }
            }
            else {
                if (this.el[key] !== property) {
                    this.el[key] = property;
                }
            }
        }
        if (mounted) {
            mounted.apply(this);
        }
    }
    updateProps(newProps) {
        for (const propKey in newProps) {
            if (this.props[propKey] !== newProps[propKey]) {
                this.props[propKey] = newProps[propKey];
            }
        }
    }
}
AnnyeongComponent.returnProps = false;
export function Annyeong(rootEl, param) {
    return new AnnyeongComponent(rootEl, param);
}
