import React, { Proptypes } from 'react'
import { connect } from 'react-redux'
import { LoginActions } from '../../react_root/actions'
import Hero from '../Common/Hero';
import LoginButton from './LoginButton';
import LoginForm from './LoginForm';
import ForgotForm from './ForgotForm';

class Login extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        console.log(this)
        return (
            <React.Fragment>
                <Hero />
                { this.props.login.button ? <LoginButton /> : null }
                { this.props.login.form ? <LoginForm /> : null }
                { this.props.login.forgot ? <ForgotForm /> : null }
            </React.Fragment>
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