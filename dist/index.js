export function Annyeong(rootEl, param) {
    const { childs, props, attrs, mounted, methods, watchs, beforeDestroy } = param;
    const component = {
        el: document.createElement(rootEl),
        props: Object.assign({}, props),
        childs: [],
        methods: Object.assign({}, methods),
        attrs: Object.assign({}, attrs),
        watchs: Object.assign({}, watchs),
        beforeDestroy: beforeDestroy,
    };
    const childsLength = (childs === null || childs === void 0 ? void 0 : childs.length) || 0;
    for (let idx = 0; idx < childsLength; ++idx) {
        component.el.appendChild(childs[idx].el);
    }
    if (mounted) {
        mounted.apply(param.props);
    }
    for (const key in attrs) {
        const property = attrs[key].call(param.props);
        if (typeof property === 'object') {
            for (const key2 in property) {
                component.el[key][key2] = property[key2];
            }
        }
        else {
            component.el[key] = property;
        }
    }
    return component;
}
