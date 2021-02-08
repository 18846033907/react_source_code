import Component from '../react/component'
import {diff,diffNode} from "./diff"
const ReactDOM={
    render
}

function render(vnode,container,dom){
  return diff(dom,vnode,container);
//   container.appendChild(_render(vnode))
}

export function createComponent(comp,props){
    let inst;
    if(comp.prototype&&comp.prototype.render){
        //类组件,创建实例
        inst=new comp(props);
    }else{
        //函数组件,扩展成类组件,统一管理
       inst= new Component(props);
       inst.constructor=comp;
       inst.render=function(){
           return this.constructor(props)
       }
        
    }
    return inst

}

//渲染组件
export function renderComponent(comp){
    let base;
    const renderer=comp.render();
    base=_render(renderer);
    if(comp.base && comp.componentWillUpdate){
        comp.componentWillUpdate()
    }

    base = diffNode(comp.base,renderer);
    comp.base = base;

    if(comp.base){
        if(comp.componentDidUpdate) comp.componentDidUpdate()
    }else if (comp.componentDidMount){
        comp.componentDidMount()
    }

    //节点替换
    // if(comp.base&&comp.base.parentNode){
    //     comp.base.parentNode.replaceChild(base,comp.base)
    // }

    comp.base=base;
}

export function setComponentProps(comp,props){
    if(!comp.base){
        if(comp.componentWillMount) comp.componentWillMount()
    }else{
        if(comp.componentWillReceiveProps) comp.componentWillReceiveProps()
    }
    //设置属性
   comp.props=props;
   //渲染组件
   renderComponent(comp)
}

function _render(vnode){
    if(vnode===undefined||vnode===null||typeof vnode==='boolean'||vnode==='') return;

    //vnode是数值
    if(typeof vnode==='number') vnode=String(vnode)

    //vnode是字符串
    if(typeof vnode==='string'){
        //创建文本节点
        return document.createTextNode(vnode)
    }
    const {tag,attrs,childrens}=vnode;
    //tag是函数
    if(typeof tag==='function'){
        //创建组件
        const comp=createComponent(tag,attrs);
        //设置属性
        setComponentProps(comp,attrs);
        //组件渲染的节点对象返回
        return comp.base
    }
    //创建元素节点
    const dom=document.createElement(tag);

    if(attrs){
        //遍历属性对象在tag上添加属性
        Object.keys(attrs).forEach(key=>{
           const value=attrs[key]
           setAttribute(dom,key,value)
        })
    }
    
    //递归渲染子节点
    if(childrens){
        childrens.forEach(child=>render(child,dom))
    }

    return dom
}

//设置属性
export function setAttribute(dom,key,value){ 
    //将属性名转换
    if(key==='className'){
        key='class' 
    }
    //事件
    if(/on\w+/.test(key)){
        key=key.toLowerCase();
        dom[key]=value||'';
    }else if(key==='style'){
        if (!value||typeof value==='string'){
            dom.style.cssText=value||''
        }else if(value&& typeof value==='object'){
            //{width:20}
            for (let k in value){
                if(typeof value[k]==='number'){
                    dom.style[k]=value[k]+'px';
                }else{
                    dom.style[k]=value[k]
                }
            }
        }
    }else{
        //其他属性
        if(key in dom ){
            dom[key]=value||''
        }
        if(value){
            dom.setAttribute(key,value);
        }else{
            dom.removeAttribute(key)
        }
    }
}

export default ReactDOM