import React, { Proptypes } from 'react'
import { connect } from 'react-redux';
import axios from 'axios';
import Task from '../Common/Task';
import { CoderActions } from '../../react_root/actions';
import AceEditor from 'react-ace';
import brace from 'brace';
import ace from 'brace';
import "brace/ext/modelist";

class File extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='file' onClick={this.props.getFile.bind(this,this.props.name, this.props.coderHome.task._id)}><a>{this.props.name.split('/')[2]}</a></div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getFile: (filename, id) => {
            var modelist = brace.acequire('ace/ext/modelist')
            var f = filename.split('.');
            var mode = modelist.getModeForPath(filename).mode
            if (mode == "ace/mode/text" && f[f.length - 1] != 'txt'){
                dispatch(CoderActions('getFile', filename, '', 'unknown', mode))
            }
            else {
                axios.get('get_file?file=' + filename.split('/')[2] + "&id=" + id + "&read=true").then((res)=>{ 
                    dispatch(CoderActions('getFile', filename, res.data.file, filename.split('/')[2], mode))
                });
            }
        }
    };
}

const mapStateToProps = (state) => {
    return state;
}

const app = connect(mapStateToProps, mapDispatchToProps)(File)

export default app;