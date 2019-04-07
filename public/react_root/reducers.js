/**
 * For Redux
 */
// Initial State -- must define
const global = {
    ssn: ''
}

const example = {
    number: 0,
    message: 'react'
}

const login = {
    button: true,
    form: false,
    forgot: false
}

const newUser = {}

const coderHome = {
    user: '',
    tasks: [],
    task: null,
    files: [],
    mode: 'txt',
    file: 'desc',
    filename: 'placeholder/placeholder/Task Description',
    saved: true,
    editorvalue: '',
    message:'',
    chatMin: true,
    chat: []
}

const index = {}

// State Changing

/*
Boilerplate

export function viewView(state, action) {
    if (typeof state === "undefined") {
        return view;
    }

    switch (action.type){
        default:
            return state;
    }
}
*/

// For session variables
export function rootApp(state, action) {
    if (typeof state === "undefined") {
        return global;
    }

    switch (action.type) {
        case "update_ssn":
            return Object.assign({}, state, {
                ssn: action.ssn
            });

        default:
            return state;
    }
}

// /example
export function exampleView(state, action) {
    if (typeof state === "undefined") {
        return example;
    }

    switch (action.type) {
        case "changeReact": 
            return Object.assign({}, state, {
                number: action.number+state.number
            });
        
        default:
            return state;
    }
}

// /login
export function loginView(state, action) {
    if (typeof state === "undefined") {
        return login;
    }

    switch (action.type) {
        case 'openLogin':
            return Object.assign({}, state, {
                button: false,
                form: true
            });
        
        case 'forgot':
            return Object.assign({}, state, {
                forgot: true
            });


        default:
            return state;
    }
}

// /new_user
export function newUserView(state, action) {
    if (typeof state === "undefined") {
        return newUser;
    }

    switch (action.type){
        default:
            return state;
    }
}

// /coder_home
export function coderHomeView(state, action) {
    if (typeof state === "undefined") {
        return coderHome;
    }

    switch (action.type){
        case "setUser":
            return Object.assign({}, state, {
                user: action.user
            });
        
        case "setTasks":
            return Object.assign({}, state, {
                tasks: action.tasks
            });

        case "setTask":
            return Object.assign({}, state, {
                task: action.task,
                mode: 'txt',
                file: 'desc',
                files: action.files,
                chatMin: false
            });

        case "saveFile":
            return Object.assign({}, state, {
                saved: true
            });

        case "unsaveFile":
            return Object.assign({}, state, {
                saved: false
            });
        
        case "getFile":
            return Object.assign({}, state, {
                filename: action.filename,
                editorvalue: action.editorvalue,
                file: action.file,
                mode: action.mode.split('/')[2]
            });
        
        case "getDesc":
            return Object.assign({}, state, {
                file: "desc",
                filename: "placeholder/placeholder/Task Description"
            });
        
        case "updateMessage":
            return Object.assign({}, state, {
                message: action.message
            });
        
        case "minimizeChat":
            return Object.assign({}, state, {
                chatMin: true
            });
        
        case "maximizeChat":
            return Object.assign({}, state, {
                chatMin: false
            });

        case "newChat":
            return Object.assign({}, state, {
                chat: action.data
            });

        default:
            return state;
    }
}

// /
export function indexView(state, action) {
    if (typeof state === "undefined") {
        return index;
    }

    switch (action.type){
        default:
            return state;
    }
}
