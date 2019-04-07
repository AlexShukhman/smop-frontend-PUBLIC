import React, { Proptypes } from 'react'
import { connect } from 'react-redux'

class Login extends React.Component {
    render() {
        return (
            this.props.user?<LoggedIn user={this.props.user}/>:<LoggedOut/>
        )
    }
}

class LoggedIn extends React.Component {
    render() {
        return (
            <div className="loggedIn">
                <span className='codercolor'>Coder:</span>  {this.props.user}
            </div>
        )
    }
}

class LoggedOut extends React.Component {
    render() {
        return (
            <div className="loggedIn">
                <a href='login'><span className='codercolor'>Login</span></a> | <a href='new_user'>Sign Up</a>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {};
}

const mapStateToProps = (state) => {
    return state;
}

const app = connect(mapStateToProps, mapDispatchToProps)(Login)

export default app;