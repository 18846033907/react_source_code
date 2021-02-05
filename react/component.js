import {renderComponent} from '../react-dom'

class Component{
    constructor(props={}){
        this.props=props;
        this.state={}
    }
    setState=function(changeState){
        Object.assign(this.state,changeState);
        console.log(12,this)
        renderComponent(this)
    }
}

export default Component