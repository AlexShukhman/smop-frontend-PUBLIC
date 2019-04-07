import React, { Proptypes } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

class NewUserForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {user:''}
    }

    blur() {
        axios.get("get_username?username="+ this.state.user).then((res) => {
            console.log(res)
            if (res.data.exists) {
                $("#usernameError").show();
                $('#submitButton').hide();
                $('#info').hide();
            } else {
                $("#usernameError").hide();
                $('#submitButton').show();
                $('#info').show();
            }
        });
    }

    keyup() {
        if ($('#pass').val() == $('#passCheck').val()) {
            $('#passwordError').hide();
        }
        else $('#passwordError').show();
    }

    render() {
        return (
            <div id="loginForm" className="container">
            <br/>
            <form id="newUserForm" className='loginForm' action="/create_user" method='post'>
                <input id='usernameField' name="user" placeholder="user" className="customInput" type="text" autoFocus val={this.state.user} onChange={evt=>this.setState({user:evt.target.value})} onBlur={this.blur.bind(this)}/>
                <br/>
                <input name="email" placeholder="email" className="customInput" type="text" />
                <br/>
                <input id='pass' name="pass" placeholder="password" className="customInput" type="password" />
                <br/>
                <input id='passCheck' name="passCheck" placeholder="re-enter password" className="customInput" type="password" onKeyUp={this.keyup.bind(this)}/>
                <br/>
                <p id="passwordError" style={{color:'red'}} hidden>passwords don't match.</p>
                <p id="usernameError" style={{color:'red'}} hidden>username already exists.</p>
                <br/>
                <button id = "submitButton" className="customButton" type="submit" hidden><a>Submit</a></button>
                <p id="info" hidden>This will send you an email to verify your email address. Please check to see if you have it, it may have gone to spam.</p>
            </form>
        </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // Dispatch Method Definitions:
    };
}

const mapStateToProps = (state) => {
    return state;
}

const app = connect(mapStateToProps, mapDispatchToProps)(NewUserForm) // Connecting states and props to current Component

export default app;