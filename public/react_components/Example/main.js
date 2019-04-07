import React, { Proptypes } from 'react'
import { connect } from 'react-redux'
import { ExampleActions } from '../../react_root/actions'

class Example extends React.Component {
    constructor(props) {
        super(props);
    }

    getReact() {
        return this.props.example.message + ' ' + this.props.example.number;
    }

    changeReact() {
        this.props.changeReact();
    }
    
    render() {
        console.log(this) // happens every time anything is rerendered
        return (
            <React.Fragment>
                <h1>Hello! { this.getReact() }</h1>
                <button onClick={ this.changeReact.bind(this) } />
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeReact: () => {
            dispatch(ExampleActions('changeReact', 3))
        }
    };
}

const mapStateToProps = (state) => {
    return state;
}

const app = connect(mapStateToProps, mapDispatchToProps)(Example)

export default app;