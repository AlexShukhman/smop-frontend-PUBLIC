import React, { Proptypes } from 'react';
import { connect } from 'react-redux';
import File from './File';
import AceEditor from 'react-ace';
import brace from 'brace';
import ace from 'brace';
import Resizable from 're-resizable';
import ContainerDimensions from 'react-container-dimensions';
import ReactTooltip from 'react-tooltip';
import Markdown from 'markdown-to-jsx';

import '../Common/bracemodes';
import 'brace/theme/monokai';
import 'brace/ext/modelist';
import { CoderActions } from '../../react_root/actions';
import axios from 'axios';

// Component Imports

class CoderView extends React.Component {
    constructor(props) {
        super(props);
        this.xhr = null;
    }

    // Local Methods:

    editorSubmit(){
        this.xhr?this.check():this.submit();
    }

    check() {
        if (this.xhr.readyState === 4) {
            this.submit();
        }
        else {
            this.props.updateMessage('working on it!');
        }
    }

    submit() {
        this.xhr = new XMLHttpRequest();
		this.xhr.open('POST', '/post_CodeCheck');
		this.xhr.setRequestHeader('Content-Type', 'application/json');
		this.xhr.onprogress = (e) => {
			this.props.updateMessage(JSON.parse(this.xhr.response.split('\n')[this.xhr.response.split('\n').length - 3].split('data: ')[1]).progress);
		}
		this.xhr.send(JSON.stringify({
			id: this.props.coderHome.task._id
		}));
    }

    render() {
        var modelist = brace.acequire('ace/ext/modelist');
        return (
            <React.Fragment>
                <div style={{width: '75vw', marginLeft:'3vw'}}>
                    {(this.props.coderHome.task)?<button className="customButton getButton downloadAll">
                        <a href={"/get_zip?path=" + this.props.coderHome.task._id+"/"+this.props.coderHome.user} download={this.props.coderHome.task.name + '.zip'}>Get All Files</a>
                    </button>:null}
                    {(this.props.coderHome.task)?<h2 id="filename">{this.props.coderHome.filename.split('/')[2]}</h2>: null}
                    <Resizable className="box" defaultSize={{width:window.innerWidth*.55, height:window.innerHeight/2}}>
                        <ContainerDimensions>
                            {({height, width}) => <React.Fragment>
                                {((this.props.coderHome.task) && !(this.props.coderHome.file == 'unknown' || this.props.coderHome.file == 'desc'))?
                                    <AceEditor 
                                        mode={this.props.coderHome.mode}
                                        theme='monokai'
                                        height={height + 'px'}
                                        width={width + 'px'}
                                        onChange= {(newFile) => {
                                            this.props.saveFile(newFile, this.props.coderHome.filename, this.props.coderHome.task._id);
                                        }}
                                        value={this.props.coderHome.editorvalue}
                                        editorProps= {{
                                            $blockScrolling: Infinity,
                                            $showPrintMargin:false,
                                            $highlightActiveLine:true,
                                            wrap:true,
                                            $liveAutocompletion:true,
                                            $enableBasicAutocompletion:true,
                                            $tabSize: 4    
                                        }}
                                    />
                                    :null}
                                {(this.props.coderHome.task && this.props.coderHome.file == 'unknown')?<div className='downloader'>
                                    <button className="customButton" id="downloader">
                                        <a href={"/get_file?file=" + this.props.coderHome.filename.split('/')[2] + '&id=' + this.props.coderHome.task._id} download={this.props.coderHome.filename.split('/')[2]}>Download File</a>
                                    </button>
                                </div>:null}
                                {((this.props.coderHome.task) && (this.props.coderHome.file == 'desc'))?<Markdown className='description' id='md'>{"_Task `"+this.props.coderHome.task.name+"` (id: _**"+this.props.coderHome.task._id+"**_) was posted by "+this.props.coderHome.task.owner+" who has defined the task as such:_ \n\n"+ this.props.coderHome.task.task.message_long + "\n\n_Pet code and/or helpful files have been attached below._ \n\n#### Task Value: **$"+this.props.coderHome.task.bounty/6+"** *for a successful submission*\n\n###### **+$"+this.props.coderHome.task.bounty/2+"** *if submission is chosen by owner*\n\n**Feel free to code right in the online editors** \n\nand ***Good Luck!***"}</Markdown>:null}
                                {!(this.props.coderHome.task)?<div className="welcomemessage" id="welcomemessage" >
                                    Click any task to start &rarr;
                                </div>:null}
                            </React.Fragment>}
                        </ContainerDimensions>
                    </Resizable>
                    {(this.props.coderHome.task)?
                    <React.Fragment>
                        <div className='fileslist' id="fileslist"> 
                            <i>files: </i>
                            <div className='file' onClick={this.props.getDesc.bind(this)}><a>Task Description</a></div>
                            {this.props.coderHome.files.map((filename) => <File key={filename} name={filename}/>)}
                        </div>
                        <div id="editorReturn">{this.props.coderHome.message}</div>
                    </React.Fragment>: null}
                    {((this.props.coderHome.task) && this.props.coderHome.saved)?<button id="editorSubmitButton" className="customButton submitButton" type="button" onClick={()=>{this.editorSubmit()}} data-tip data-for='Submit' >
                        <a>Submit</a>
                    </button>:null}
                    <ReactTooltip id='Submit'>
                        <span>This may take some time, please do not submit until ready</span>
                    </ReactTooltip>
                </div>
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getDesc: () => {
            dispatch(CoderActions('getDesc'))
        },
        updateMessage: (message) => {
            dispatch(CoderActions('updateMessage', message))
        },
        saveFile: (file, filename, id) => {
            dispatch(CoderActions('unsaved'));
            axios.post('post_createFile', {
                filename: filename.split('/')[2],
                file: file
            }).then(() => {
                axios.post('post_petCode?taskid', {
                    filename: filename.split('/')[2],
                    id: id
                }).then(() => {
                    dispatch(CoderActions('saved'));
                });
            })
        }
    };
}

const mapStateToProps = (state) => {
    return state;
}

const app = connect(mapStateToProps, mapDispatchToProps)(CoderView) // Connecting states and props to current Component

export default app;