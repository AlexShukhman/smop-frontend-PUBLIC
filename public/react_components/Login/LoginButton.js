import React, { Proptypes } from 'react'
import { connect } from 'react-redux'
import { LoginActions } from '../../react_root/actions'

class LoginButton extends React.Component {
    constructor(props) {
        super(props);
    }

    openLogin() {
        this.props.openLogin();
    }

    render() {
        return (
            <div className='containerCustom' id='loginContainer'> <a id="loginButton" className="loginButtonFont" onClick={this.openLogin.bind(this)} href="#">Login</a> </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        openLogin: () => {
            dispatch(LoginActions('openLogin'))
        }
    }
}

const mapStateToProps = (state) => {
    return state;
}

const app = connect(mapStateToProps, mapDispatchToProps)(LoginButton)

export default app;