/**
 * Action Creators For Redux
 */

// Imports
import axios from 'axios';

/*
Boilerplate:

export function ViewActions(type) {
    var e = {
        type: type
    }

    switch (type){
        default:
            return e;
    }
}
*/

export function ExampleActions(type) {
    var e = {
        type: type
    }
    switch (type) {
        case 'changeReact':
            e.number = arguments[1];
            return e;

        default:
            return e;
    }
}

export function LoginActions(type) {
    var e = {
        type: type
    }
    switch (type) {
        case 'openLogin':
            return e;

        case 'forgot':
            return e;

        case 'sendForgot':
            return e;
        
        default:
            return e;
    }
}

export function NewUserActions(type) {
    var e = {
        type: type
    }

    switch (type){
        default:
            return e;
    }
}

export function CoderActions(type) {
    var e = {
        type: type
    }

    switch (type){
        case "setUser":
            e.user = arguments[1];
            return e;
        
        case "setTasks":
            e.tasks = arguments[1];
            return e;
        
        case "setTask":
            e.task = arguments[1];
            e.files = arguments[2];
            return e;

        case "saveFile":
            return e;

        case "unsaveFile":
            return e;
        
        case "chooseFile":
            e.filename = arguments[1];
            return e;
        
        case 'getFile':
            e.filename = arguments[1];
            e.editorvalue = arguments[2];
            e.file = arguments[3];
            e.mode = arguments[4];
            return e;
        
        case 'getDesc':
            return e;
        
        case 'updateMessage':
            e.message = arguments[1];
            return e;

        case 'minimizeChat':
            return e;
        
        case 'maximizeChat':
            return e;

        case 'newChat':
            e.data = arguments[1];
            return e;

        default:
            return e;
    }
}