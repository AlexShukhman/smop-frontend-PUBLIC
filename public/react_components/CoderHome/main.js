import React, { Proptypes } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { CoderActions } from '../../react_root/actions';
import DropDown from '../Common/Dropdown';
import CoderHero from './Hero';
import SplitView from '../Common/SplitView';
import MiniTaskFeed from '../Common/MiniTaskFeed';
import CoderView from './CoderView';
import Chat from '../Common/Chat';

// Component Imports

class CoderHome extends React.Component {
    constructor(props) {
        super(props);
        this.getUser();
        this.getTasks();
        this.checkTask();
    }

    // Local Methods:
    getUser() {
        axios.get('ssn').then((res)=>{
            res.data.user?this.props.setUser(res.data.user):window.location.replace("login");
        });
    }

    getTasks() {
        axios.get('get_codertaskfeed_ssnless').then((data) => {
            this.props.setTasks(data.data.message);
        });
    }

    checkTask() {
        if (this.props.location.query.task){
            this.props.setTask(this.props.location.query.task);
        }
    }

    render() {
        return (
            <React.Fragment>
                <DropDown />
                <CoderHero user={this.props.coderHome.user}/>
                <SplitView>
                    <CoderView/>
                    <MiniTaskFeed tasks={this.props.coderHome.tasks} location={'coderhome'}/>
                </SplitView>
                <Chat coder_owner="coder"/>
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: (user) => {
            dispatch(CoderActions('setUser', user))
        },
        setTasks: (tasks) => {
            dispatch(CoderActions('setTasks', tasks))
        },
        setTask: (id) => {
            axios.get('get_singleTask?data='+id+"&coder_owner=coder").then((res)=>{
                console.log('files', res.data)
                dispatch(CoderActions('setTask', res.data.result, res.data.files))
            });
        }
    };
}

const mapStateToProps = (state) => {
    return state;
}

const app = connect(mapStateToProps, mapDispatchToProps)(CoderHome) // Connecting states and props to current Component

export default app;