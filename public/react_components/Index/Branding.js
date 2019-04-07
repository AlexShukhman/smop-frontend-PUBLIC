import React, { Proptypes } from 'react'
import { connect } from 'react-redux'

class Branding extends React.Component {
    getStyle() {
        if (this.props.hit) {
            return {visibility: 'hidden'}
        }
        return {visibility: 'initial'}
    }

    render() {
        return (
            <div className='centerHero'>
                <img src="images/smopblacknotaglinebig.png" style={this.getStyle()}/>
                <p style={this.getStyle()}>A flexible freelancing marketplace for creating the best ideas and empowering all developers.</p>
            </div>
        )
    }
}

export default Branding;