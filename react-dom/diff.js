import {setAttribute,render} from './index'

export function diff(dom,vnode,container){
    //对比节点的变化
     const ret=diffNode(dom,vnode);
     if(container){
         container.appendChild(ret)
     }
     return ret
}

function diffNode(dom,vnode){
    let out=dom;
    if(vnode===undefined||vnode===null||typeof vnode==='boolean'||vnode==='') return;

    //vnode是数值
    if(typeof vnode==='number') vnode=String(vnode)

    //vnode是字符串
    if(typeof vnode==='string'){
        if(dom&&dom.nodeType===3){
            if(dom.textContent!==vnode){
                dom.textContent=vnode
            }
        }else{
            out=document.createTextNode(vnode);
            if(dom&&dom.parentNode){
                dom.parentNode.replaceNode(out,dom)
            }
        }
        return out;
    }
    //非文本
    if(!dom){
        out=document.createElement(vnode.tag);
    }
    //比较子节点(dom节点和组件)
    if(vnode.childrens&&vnode.childrens.length>0||(out.childrens&&out.childrens.length>0)){
        diffChildren(out,vnode.childrens);
    }
    diffAttribute(out,vnode);
    return out; 
}

function diffAttribute(dom,vnode){
    console.log(11,dom,vnode)
    //保存之前dom所有的属性
    const oldAttrs={}
    
    const  newAttrs=vnode.attrs;
    //dom是原有的dom,vnode是虚拟dom
    const domAttrs=dom.attributes;
    Array.from(domAttrs).forEach(item=>{
        oldAttrs[item.name]=item.value;
    })
  
    //原来的属性和新的属性相比，不在新的属性中，移除
    for(let key in oldAttrs){
        if(!(key in newAttrs)){
            setAttribute(dom,key,undefined)
        }
    }
    //更新
    for(let key in newAttrs){
        if(oldAttrs[key]!==newAttrs[key]){
            setAttribute(dom,key,newAttrs[key])
        }
    }
}