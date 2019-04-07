import React, { Proptypes } from 'react'
import { connect } from 'react-redux'
import Task from './Task'

class TaskFeed extends React.Component {
    render() {
        return (
            <div className='taskFeed'>
                <br/>
                <br/>
                <h1><b>Available Tasks:</b><br/><i>(click one to get started)</i></h1>
                <br/>
                {this.props.tasks.map((task) => <Task key={task._id} task={task} mini={false} location={this.props.location} changeTask={this.props.changeTask}/>)}
            </div>
        )
    }
}

export default TaskFeed;