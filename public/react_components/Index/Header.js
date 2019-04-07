import React, { Proptypes } from 'react'
import { connect } from 'react-redux'

class Header extends React.Component {
    render() {
        return (
            <div className='header'>
                {this.props.children}
            </div>
        )
    }
}

export default Header;