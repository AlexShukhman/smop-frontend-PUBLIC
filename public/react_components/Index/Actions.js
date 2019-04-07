import React, { Proptypes } from 'react'
import { connect } from 'react-redux'

class Actions extends React.Component {
    render() {
        return (
            <div className='actions'>
                <br/>
                <br/>
                <br/>
                <br/>
                <a href="new_user">Interested?</a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a href="mailto:info@smop.io">Questions?</a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a href="https://smoptechnologies.wordpress.com/">More Info</a>
            </div>
        )
    }
}

export default Actions;