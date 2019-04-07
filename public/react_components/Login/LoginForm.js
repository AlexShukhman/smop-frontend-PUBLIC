import React, { Proptypes } from 'react'
import { connect } from 'react-redux'
import { LoginActions } from '../../react_root/actions'

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
    }

    forgotPassword() {
        this.props.forgotPassword();
    }

    render() {
        return (
            <div id="loginForm" className="container">
                <br/>
                <form className="loginForm" action="/login" method="post">
                    <input name="user" placeholder="user" className="customInput" type="text" />
                    <br/>
                    <input name="pass" placeholder="password" className="customInput" type="password" />
                    <br/>
                    <button className="customButton" type="submit"><a>Login</a></button>
                    <br/>
                    <a onClick={this.forgotPassword.bind(this)}>Forgot password?</a>
                    <p id="email" style={{'paddingLeft': '5px', 'paddingRight': '5px', color: 'gray'}}></p>
                </form>
                <br/><a id='newUserButton' className="loginButtonFont" href='new_user' style={{'fontSize':'12pt'}}>New User?</a>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        forgotPassword: () => {
            dispatch(LoginActions('forgot'))
        }
    }
}

const mapStateToProps = (state) => {
    return state;
}

const app = connect(mapStateToProps, mapDispatchToProps)(LoginForm)

export default app;