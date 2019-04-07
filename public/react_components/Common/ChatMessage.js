import React, { Proptypes } from 'react';
import { connect } from 'react-redux';
import { CoderActions } from '../../react_root/actions';

class ChatMessage extends React.Component {
    render() {
        return (
            <React.Fragment>
                {this.props.coder_owner == 'coder'?
                    <div className={"chat " + ((this.props.message.user == this.props.coderHome.user) ? "yourchat " : "theirchat ") + ((this.props.message.owner == this.props.message.user) ? 'ownerchat' : 'coderchat')}>
                        {JSON.parse(this.props.message.value).message}
                    </div>
                    :
                    <div className={"chat " + ((this.props.message.user == this.props.coderHome.user) ? "yourchat ownerchat" : "theirchat coderchat")}>
                        {JSON.parse(this.props.message.value).message}
                    </div>}
                <br/>
            </React.Fragment>
        )
    }
}

export default ChatMessage;