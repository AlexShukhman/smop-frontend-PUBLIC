import React, { Proptypes } from 'react';
import { connect } from 'react-redux';
import socketIOClient from 'socket.io-client'
import { CoderActions } from '../../react_root/actions';
import ChatMessage from './ChatMessage';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.socket = null;
        this.task = null;
    }

    componentDidUpdate() {
        if (this.props.coderHome.task && this.props.coderHome.task != this.task) {
            this.task = this.props.coderHome.task;
            this.socket = socketIOClient();
            this.socket.on('connect', (data) => {
                this.socket.emit('join', JSON.stringify({
                    id: this.props.coderHome.task._id,
                    user: this.props.coderHome.user
                }));
            });
            this.socket.on('messages', (data) => {
                if (data.length == 0) {
                    this.props.newChat([]);
                    socket.emit('message', 'Start of Messages');
                }
                else {
                    this.props.newChat(data);
                }
                this.scrollToBottom();
            });
            this.socket.on('message', (data) => {
                if (data.user == this.props.coderHome.user) this.playSound();
                this.props.newMessage(data);
                this.scrollToBottom();
            });
        }
    }

    playSound() {
        document.getElementById("audio").play();
    }

    handleKeyUp(event) {
        this.scrollToBottom();
        if (event.keyCode == 13) return this.newChat(event.target.value); // on enter
        else if (event.keyCode == 27) this.props.minimizeChat(); // on esc
    }

    newChat(message) {
        if (this.socket){
            this.refs.input.value="";
            this.socket.emit('message', message);
        }
        else {
            this.props.newChat('Chat is available for individual tasks only');
        }
    }

    scrollToBottom () {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }

    render() {
        return (
            <div className="chatWrapper">
                {this.props.coderHome.task?
                <div className="chatHead">
                    <div id="chatMessage" title="got questions? ask the owner here">Chat with {this.props.coder_owner=="coder"?"Owner":"Coder"}</div>
                    {this.props.coderHome.chatMin?null:<button className="customButton rightbutton" id="chatMin" onClick={()=>{this.props.minimizeChat()}}>
                        <a>-</a>
                    </button>}
                    {this.props.coderHome.chatMin?<button className="customButton rightbutton" id="chatMax" onClick={()=>{this.props.maximizeChat()}}>
                        <a>+</a>
                    </button>:null}
                </div>:null}
                {this.props.coderHome.task && !this.props.coderHome.chatMin?<div className="chatView">
                    <div id="chat">
                        {this.props.coderHome.chat.map((message) => <ChatMessage key={message._id} coder_owner={this.props.coder_owner} message={message}/>)}
                        <div ref={(el)=>{ this.messagesEnd = el; }}></div>
                    </div>
                    <input onKeyUp={this.handleKeyUp.bind(this)} id="chatIn" className="customInput" placeholder="Type a message..." ref="input"/>
                </div>:null}
                <audio id="audio" src="https://www.soundjay.com/switch/sounds/switch-20.mp3" autostart="false"></audio>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        minimizeChat: () => {
            dispatch(CoderActions('minimizeChat'))
        },
        maximizeChat: () => {
            dispatch(CoderActions('maximizeChat'))
        },
        newChat: (data) => {
            dispatch(CoderActions('newChat', data))
        },
        newMessage: (message) => {
            dispatch(CoderActions('newMessage', message))
        }
    }
}

const mapStateToProps = (state) => {
    return state;
}

const app = connect(mapStateToProps, mapDispatchToProps)(Chat) // Connecting states and props to current Component

export default app;