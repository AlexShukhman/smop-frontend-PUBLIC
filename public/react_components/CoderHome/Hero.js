import React, { Proptypes } from 'react'
import { connect } from 'react-redux'

class CoderHero extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="pageTitle"><span className='codercolor'>Coder:</span>  {this.props.user || 'Unknown'}</div>
                {this.props.coderHome.task?<div className="pageSubtitle">{"{"}{this.props.coderHome.task.name}{"}"}</div>: null}
            </React.Fragment>
        )
    }
}

export default CoderHero;