import Component from './component'
// const React={
//     createElement
// }

function createElement(tag,attrs,...childrens){
    return {
        tag,attrs,childrens,key:attrs?attrs.key:null
    }
}

export default {
    createElement,
    Component
}
