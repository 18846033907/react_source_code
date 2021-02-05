import Component from './component'
// const React={
//     createElement
// }

function createElement(tag,attrs,...childrens){
    return {
        tag,attrs,childrens
    }
}

export default {
    createElement,
    Component
}
