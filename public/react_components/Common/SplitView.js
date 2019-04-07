import React, { Proptypes } from 'react'
import { connect } from 'react-redux'

class SplitView extends React.Component {
    render() {
        return (
            <div className='choice customchoice'>
                {this.props.children}
            </div>
        )
    }
}

export default SplitView;