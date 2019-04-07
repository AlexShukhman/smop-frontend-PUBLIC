import React, { Proptypes } from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip';
import Task from './Task';

class MiniTaskFeed extends React.Component {
    render() {
        return (
            <div className='feed'>
                <div className="feedheader-small" data-tip data-for='FeedHeader'>Available Tasks:</div>
                <br/>
                {this.props.tasks.map((task) => <Task key={task._id} task={task} mini={true} location={this.props.location}/>)}
                <ReactTooltip id='FeedHeader'>
                    <span>click any task below to get started</span>
                </ReactTooltip>
            </div>
        )
    }
}

export default MiniTaskFeed;