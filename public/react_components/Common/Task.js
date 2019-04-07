import React, { Proptypes } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import ReactTooltip from 'react-tooltip'
import Markdown from 'markdown-to-jsx';
import { CoderActions } from '../../react_root/actions';

class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = {glyph: {}}
        this.getGlyph();
    }

    getValue() {
        return "$" + this.props.task.bounty
    }

    makehtml(glyph, color, message) {
        return {className: 'glyphicon glyphicon-'+glyph+' '+ color+ " statusSymbol", message: message}
    }

    getGlyph() {
        axios.get('get_taskStatus?data='+this.props.task._id).then((res) => {
            this.setState((state)=>{
                switch (res.data.message){
                    case 'error':
                        var glyphhtml = this.makehtml('warning-sign', 'feedmessage', 'contact smop@smop.io');
                        break;
                    case 'Win':
                        var glyphhtml = this.makehtml('thumbs-up', 'ownercolor', 'you won the first round!');
                        break;
                    case 'Big Win':
                        var glyphhtml = this.makehtml('usd', 'ownercolor', 'you won big!');
                        break;
                    case 'Paid':
                        var glyphhtml = this.makehtml('star', 'ok-circle', 'all done');
                        break;
                    case 'Queue Full':
                        var glyphhtml = this.makehtml('check', 'ownercolor', 'three coders submitted');
                        break;
                    case 'One':
                        var glyphhtml = this.makehtml('thumbs-up', 'codercolor', 'times completed: 1/3');
                        break;
                    case 'Two':
                        var glyphhtml = this.makehtml('thumbs-up', 'codercolor', 'times completed: 2/3');
                        break;
                    case 'Started':
                        var glyphhtml = this.makehtml('tasks', 'codercolor', 'nobody has completed this task!');
                        break;
                    case 'Not Started':
                        var glyphhtml = this.makehtml('hourglass', 'notStarted', 'nobody has looked at this task!');
                        break;
                    case 'Not Accepted':
                        var glyphhtml = this.makehtml('exclamation-sign', 'notStarted', 'please wait for this task to be accepted');
                        break;
                }
                return {glyph: glyphhtml};
            });
        })
    }

    getName() {
        return this.props.task.name;
    }

    getDesc() {
        return this.props.task.task.message_short;
    }
    
    render() {
        return (
            <div>
                <style dangerouslySetInnerHTML={{
                    __html:[
                        '.task:before {',
                        '   content: "' + this.getValue() + '  {  ";',
                        '   font-size: 200%;',
                        '   text-align: right;}'
                    ].join('\n')
                }}></style>
                <div className='task' onClick={(this.props.location != 'index') ? this.props.setTask.bind(this, this.props.task._id): null} >
                    <a 
                        style={this.props.mini?{width:"20vw"}:{width:"30vw"}} 
                        data-tip 
                        data-for={'desc'+this.props.task._id}
                        href={(this.props.location == 'index') ? 'coder_home?task='+this.props.task._id: null}>
                        
                        {this.getName()}

                        <br/>
                        
                        {this.getDesc()}
                    </a> 
                    <span className='TaskAfter'>
                        }&nbsp;
                        <span id='icon' className={this.state.glyph.className} data-tip data-for={this.props.task._id}></span>
                    </span>
                </div>
                <ReactTooltip id={this.props.task._id}>
                    <span>{this.state.glyph.message}</span>
                </ReactTooltip>
                <ReactTooltip id={'desc'+this.props.task._id} type='light' effect='solid' className="desc-long-tooltip">
                    <Markdown>{this.props.task.task.message_long}</Markdown>
                </ReactTooltip>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setTask: (id) => {
            axios.get('get_singleTask?data='+id+"&coder_owner=coder").then((res)=>{
                dispatch(CoderActions('setTask', res.data.result, res.data.files))
            });
        }
    };
}

const mapStateToProps = (state) => {
    return state;
}

const app = connect(mapStateToProps, mapDispatchToProps)(Task)

export default app;