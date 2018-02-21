import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { combineReducers } from 'redux';
import { App } from './components/App.js';


//given an array of grades, returns an average of all of the grades
const calculatingAvg = (grades, numeric, scale) => {
    var value = 0;
    var weight = 0;
    grades.forEach(function(g) {
        value =  ((+(g.avg)) * (+(g.weight))) + value;
        weight = + (g.weight) + weight;
    });
    value = (value/weight);

    //converts the percentage to the apropiate GPA points if desired
    if (numeric) {
        return value;
    }
    else if (value >= (+scale.As)) {
        return 4.0
    }
    else if (value >= (+scale.Am)) {
        return 3.67
    }
    else if (value >= (+scale.Bp)) {
        return 3.33
    }
    else if (value >= (+scale.Bs)) {
        return 3.0
    }
    else if (value >= (+scale.Bm)) {
        return 2.67
    }
    else if (value >= (+scale.Cp)) {
        return 2.33
    }
    else if (value >= (+scale.Cs)) {
        return 2.0
    }
    else if (value >= (+scale.Cm)) {
        return 1.67
    }
    else if (value >= (+scale.Ds)) {
        return 1.0
    }
    else {
        return 0
    }
}

//calcualates if any of the children recusivly is expected
const calculatingExpected = (grades) => {
    var newExpected = false;
    grades.forEach(function(g) {
        if (g.expected){
            newExpected = true;
        }
    });

    return newExpected;
}

//starting values for a grade item
const defaultGrade = (id, h) => {
    return {
        grades: [],
        avg: 100,
        name: 'New Grade',
        heritage: h,
        id,
        hide: true,
        weight: 1,
        recieved: 100,
        available: 100,
        expected: false,
        numeric: true,
        letterHide: true,
        'As': 92.5,
        'Am': 89.5,
        'Bp': 86.5,
        'Bs': 82.5,
        'Bm': 79.5,
        'Cp': 76.5,
        'Cs': 72.5,
        'Cm': 69.5,
        'Ds': 64.5,
        isGude: true
    }
}

//recursivly finds the desired grade item starting with the root grade, then applies the dispatched actions
const editingGrade = (state, h, action) => {
    if (state.id === h[0]) {
        if (h.length > 1) {
            return {...state,grades: state.grades.map(g => editingGrade(g, h.slice(1), action))};
        }
        switch (action.type) {
            case 'ADD':
                return {...state,grades: state.grades.concat(defaultGrade(action.id, action.h)),hide: false};
            case 'UPDATE_GRADE':
                return action.state;
            case 'DELETE_GRADE':
                return {...state,grades: state.grades.filter(g => g.id !== action.id)};
            case 'TOGGLE_HIDE':
                return {...state,hide: !state.hide};
            default:
              return state
        }
    }
    return state;
}

//reducer for the grade states,
const grade = (state = require('./ExampleGrades.json'), action) => {
    if (['ADD', 'UPDATE_GRADE', 'DELETE_GRADE', 'TOGGLE_HIDE'].includes(action.type)) {
        return editingGrade(state, action.h, action);
    }
    switch (action.type) {
        case 'CALCULATE_AVG':
            if (action.h.includes(state.id) && state.grades.length > 0){
                var newGrades = state.grades.map(g => grade(g, action));
                return {...state,avg: calculatingAvg(newGrades, state.numeric, state), expected: calculatingExpected(newGrades), grades: newGrades};
            }
            return state;
        case 'UPLOAD_GRADE':
            return action.state;
        case 'CLEAR_GRADE':
            return defaultGrade(0,[]);
        default:
          return state
        }
}

//reducer for the editing grade modal
const editGradeModal = (state = defaultGrade(0,[]), action) => {
    switch (action.type) {
        case 'UPDATE_MODAL':
            return action.state;
        case 'UPDATE_MODAL_LETTER':
            var newScale = state;
            var newValue = action.number;
            switch (action.letter) {
                case "As":
                    newScale.As = newValue
                    break;
                case "Am":
                    newScale.Am = newValue
                    break;
                case "Bp":
                    newScale.Bp = newValue
                    break;
                case "Bs":
                    newScale.Bs = newValue
                    break;
                case "Bm":
                    newScale.Bm = newValue
                    break;
                case "Cp":
                    newScale.Cp = newValue
                    break;
                case "Cs":
                    newScale.Cs = newValue
                    break;
                case "Cm":
                    newScale.Cm = newValue
                    break;
                case "Ds":
                    newScale.Ds = newValue
                    break;
                default:
                    console.log("whoops");
            }
            return newScale;
        default:
            return state;
        }
}

//reducer to handle the changing filename of the download
const fileName = (state = "MyGrades", action) => {
    switch (action.type) {
        case 'UPDATE_FILENAME':
            return action.fileName;
        default:
            return state;
        }
}

//reducer for the uploaded file
const file = (state = null, action) => {
    switch (action.type) {
        case 'UPDATE_FILE':
            return action.file;
        default:
            return state;
        }
}

//reducer for which modal the nav bar links activated
const navModal = (state = null, action) => {
    switch (action.type) {
        case 'UPDATE_MODAL_TYPE':
            return action.modal;
        default:
            return state;
        }
}

//main reducer
const gradeApp = combineReducers({
    grade,
    editGradeModal,
    fileName,
    file,
    navModal
});

//redux store
export const store = createStore(gradeApp, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

//root render of the application
const render = () => {
    ReactDOM.render(
        <div className="app">
            <App />
        </div>,
        document.getElementById('root')
    );
};

//linking the store to rendering the application
store.subscribe(render);
render();

registerServiceWorker();
