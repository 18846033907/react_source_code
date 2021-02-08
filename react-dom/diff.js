import {setAttribute,createComponent,setComponentProps} from './index'

export function diff(dom,vnode,container){
    //对比节点的变化
     const ret=diffNode(dom,vnode);
     if(container){
         container.appendChild(ret)
     }
     return ret
}

export function diffNode(dom,vnode){
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
    //如果是一个组件
    if(typeof vnode.tag==='function'){
        return diffComponent(dom,vnode)
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

function diffComponent(dom,vnode){
    const {tag,attrs}=vnode;
    let comp=dom;
    //如果组件没有变化，则重新设置props;执行
    if(comp&&comp.constructor===vnode.tag){
        //重新设置props
        setComponentProps(comp,attrs)
    }else{
        if(comp){
            unmountComponent(comp);
            comp=null;
        }
        //创建新组件
        comp=createComponent(tag,attrs);
        //设置组件属性
        setComponentProps(comp,attrs);
        dom=comp.base
    }
    return dom
}

function diffChildren(dom, vchildren) {
    const domChildren = dom.childNodes;
    const children = [];
    const keyed = {};
    // 将有key的节点(用对象保存)和没有key的节点(用数组保存)分开
    if (domChildren.length > 0) {
        [...domChildren].forEach(item => {
            // 获取key
            const key = item.key;
            if (key) {
                // 如果key存在,保存到对象中
                keyed[key] = item;
            } else {
                // 如果key不存在,保存到数组中
                children.push(item)
            }

        })
    }
    if (vchildren && vchildren.length > 0) {
        let min = 0;
        let childrenLen = children.length; //2
        [...vchildren].forEach((vchild, i) => {
            // 获取虚拟DOM中所有的key
            const key = vchild.key;
            let child;
            if (key) {
                // 如果有key,找到对应key值的节点
                if (keyed[key]) {
                    child = keyed[key];
                    keyed[key] = undefined;
                }
            } else if (childrenLen > min) {
                // alert(1);
                // 如果没有key,则优先找类型相同的节点
                for (let j = min; j < childrenLen; j++) {
                    let c = children[j];
                    if (c) {
                        child = c;
                        children[j] = undefined;
                        if (j === childrenLen - 1) childrenLen--;
                        if (j === min) min++;
                        break;
                    }
                }
            }
            // 对比
            child = diffNode(child, vchild);
            // 更新DOM
            const f = domChildren[i];
            if (child && child !== dom && child !== f) {
                // 如果更新前的对应位置为空，说明此节点是新增的
                if (!f) {
                    dom.appendChild(child);
                    // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
                } else if (child === f.nextSibling) {
                    removeNode(f);
                    // 将更新后的节点移动到正确的位置
                } else {
                    // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
                    dom.insertBefore(child, f);
                }
            }
        })
    }
} 