import React, { Proptypes } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import $ from 'jquery';
import { IndexActions } from '../../react_root/actions';
import Header from './Header'
import Social from './Social'
import Login from './Login'
import LoremIpsum from '../Example/LoremIpsum'
import MiniLogo from './MiniLogo'
import Branding from './Branding'
import TaskFeed from '../Common/TaskFeed'
import Brag from './Brag'
import Actions from './Actions';

// Component Imports

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.m1 = React.createRef();
        this.state = {user: '', height: 0, tasks: []};
        this.hit = this.state.height<0;
        this.getUser();
        this.getTasks();
        window.addEventListener('scroll', () => {
            this.getHeight(this);
        });
    }

    componentDidMount(){
        $(".footer").addClass('unfixed');
    }

    getHeight(parent) {
        const box = parent.m1.current.getBoundingClientRect();
        var y = box.y
        parent.setState((state) => { 
            return { height: y }
        });
        parent.hit = y<0;
    }

    getUser() {
        axios.get('ssn').then((res)=>{
            this.setState((state)=> {
                return {user: res.data.user}
            });
        });
    }

    getTasks() {
        axios.get('get_codertaskfeed_ssnless').then((data) => {
            this.setState((state) => {
                return {tasks: data.data.message}
            }) 
        });
    }

    render() {
        return (
            <React.Fragment>
                <Header>
                    <Social />
                    {this.hit?<MiniLogo/>:null}
                    <Login user={this.state.user}/>
                </Header>
                {/* Measures from here (about halfway up the branding for some reason...) */}
                <div ref={this.m1}></div>
                <Branding hit={this.hit}/>
                <TaskFeed tasks={this.state.tasks} location='index'/>
                <Brag />
                <Actions />
            </React.Fragment>
        )
    }
}

export default Index;