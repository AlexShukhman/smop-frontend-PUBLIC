import React, { Proptypes } from 'react'
import { connect } from 'react-redux'
import { LoginActions } from '../../react_root/actions'

class ForgotForm extends React.Component {
    constructor(props) {
        super(props);
    }

    sendForgot() {
        $.post('forgot', {
            email: $.trim($('#femail').val())
        }).done((data)=>{
            if (data.success){
                $('#sent').show();
            }
            else {
                $('#sent').html(data.message);
                $('#sent').show();
            }
        });
    }

    render() {
        return (
            <div id="forgotFormWrap" className="container" style={{'textAlign': 'center'}}>
                    <br/><br/>
                    <form id="forgotForm">
                        <input style={{width: '25%'}} type="text" name="email" id="femail" className="customInput" placeholder="your email"/>
                        <button className="customButton" type="button" onClick={this.sendForgot.bind(this)}>Reset Password</button>
                        <p style={{color: 'gray', 'textAlign': "center"}}>This will send you an email to reset your password</p>
                    </form>
                    <p id="sent" style={{color: "gray"}} hidden>email sent, please close this page and follow link given</p>
                </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

const mapStateToProps = (state) => {
    return state;
}

const app = connect(mapStateToProps, mapDispatchToProps)(ForgotForm)

export default app;