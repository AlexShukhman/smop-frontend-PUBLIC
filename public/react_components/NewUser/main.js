import React, { Proptypes } from 'react'
import { connect } from 'react-redux'
import { ExampleActions } from '../../react_root/actions'
import Hero from '../Common/Hero'
import NewUserForm from './NewUserForm'

// Component Imports

class NewUser extends React.Component {
    constructor(props) {
        super(props);
    }

    // Local Methods:
    
    render() {
        console.log(this) // happens every time anything is rerendered
        return (
            <React.Fragment>
                <Hero />
                <NewUserForm />
            </React.Fragment>
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

const app = connect(mapStateToProps, mapDispatchToProps)(NewUser) // Connecting states and props to current Component

export default app;