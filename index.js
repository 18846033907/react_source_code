import React from './react'
import ReactDOM from './react-dom'

// const ele=(
//     <div className='active' title='hahh' style={{width:100,backgroundColor:'red'}} onClick={()=>{console.log('click')}}>
//             hello,<span>你猜</span>
//     </div>
// )

// function Home(){
//     return (
//         <div className='active' title='hahh' style={{width:100,backgroundColor:'red'}} onClick={()=>{console.log('click')}}>
//             hello,<span>Home</span>
//     </div>
//     )
// }

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state={
            number:0
        }
    }
    componentWillMount(){
        console.log('组件将要加载')
    }

    componentWillReceiveProps(props){
        console.log('接收props',props)
    }

    componentWillUpdate(){
        console.log('组件将要更新')
    }

    componentDidUpdate(){
        console.log('组件更新完成')
    }

    componentDidMount(){
        console.log('组件加载完成')
    }
     
    handleClick(){
        this.setState({
            number: this.state.number+1
        })
    }
    render(){
        return (
            <div className='active' title='hahh' style={{width:100,backgroundColor:'red'}} onClick={()=>{console.log('click')}}>
                hello,<span>Home{this.state.number}</span>
                <button onClick={this.handleClick.bind(this)}>点我</button>
            </div>
        ) 
    }
}

const title='active'

// ReactDOM.render('React',document.querySelector('#root'))
ReactDOM.render(<Home  name={title} />,document.querySelector('#root'))
// ReactDOM.render(<Home name={title}/>,document.querySelector('#root'))

// createElement(tag,attrs,child1,child2...)
// const ele = /*#__PURE__*/React.createElement("div", {
//     className: "active",
//     title: "hahh"
//   }, "hello,", /*#__PURE__*/React.createElement("span", null, "\u4F60\u731C"))
 