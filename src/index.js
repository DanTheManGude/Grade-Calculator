import React from 'react';
import ReactDOM from 'react-dom';
//import Component from 'react';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { combineReducers } from 'redux';


class Grade extends React.Component {
    constructor(props) {
        super(props);

        this.setModalData = this.setModalData.bind(this);
    }

    setModalData(event) {
        store.dispatch({
            type: 'SET_GRADE_MODAL',
            data: this.props.state
        });
    }

    render() {
        var hideText;
        var children;
        if (this.props.state.hide){
            hideText = 'Show';
            children = null;
        } else {
            hideText = 'Hide';
            children =
                <ul>
                    <li><button
                        className="btn btn-primary btn-sm" onClick={() => {
                            store.dispatch({
                                type: 'ADD',
                                h: this.props.state.heritage.concat(this.props.state.id)
                            })
                        }}>Add</button>
                    </li>
                    {this.props.state.grades.map(grade =>
                        <li key={grade.id}>
                            <Grade state={grade}/>
                        </li>
                    )}
                </ul>
            ;
        }
        return(
            <div>
                <span>
                    {this.props.state.name}
                    &nbsp;&nbsp;
                    <strong>{this.props.state.avg}</strong>
                    &nbsp;&nbsp;&nbsp;
                    <button className="btn btn-info btn-sm" onClick={() => {
                        store.dispatch({
                            type: 'TOGGLE_HIDE',
                            h: this.props.state.heritage.concat(this.props.state.id)
                        })
                    }}>{hideText}</button>
                    &nbsp;&nbsp;
                    <button
                        className="btn btn-warning btn-sm" data-toggle="modal" data-target="#EditModalForm" onClick={this.setModalData}>Edit
                    </button>
                    <div className="modal fade" id="EditModalForm" role="dialog">
                        <div className="modal-dialog modal-sm">
                          <div className="modal-content">
                            <EditModalForm state={this.props.state} />
                          </div>
                        </div>
                    </div>
                </span>
                {children}
            </div>
        );
    }
}

class EditModalForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
    }

    handleName(event) {
        store.dispatch({
            type: 'CHANGE_NAME_MODAL',
            name: event.target.value
        });
    }

    handleAvg(event) {
        store.dispatch({
            type: 'CHANGE_AVG_MODAL',
            avg: event.target.value
        });
    }

    handleWeight(event) {
        store.dispatch({
            type: 'CHANGE_WEIGHT_MODAL',
            weight: event.target.value
        });
    }

    handleClose(event) {
        if (event.target.innerHTML === 'Save') {
            store.dispatch({
                type: 'CHANGE_NAME',
                name: store.getState().editGradeModal.name,
                h: store.getState().editGradeModal.heritage.concat(store.getState().editGradeModal.id)
            });
            store.dispatch({
                type: 'CHANGE_AVG',
                avg: store.getState().editGradeModal.avg,
                h: store.getState().editGradeModal.heritage.concat(store.getState().editGradeModal.id)
            });
            store.dispatch({
                type: 'CHANGE_WEIGHT',
                weight: store.getState().editGradeModal.weight,
                h: store.getState().editGradeModal.heritage.concat(store.getState().editGradeModal.id)
            });
        } else {
            store.dispatch({
                type: 'DELETE_GRADE',
                h: store.getState().editGradeModal.heritage,
                id: store.getState().editGradeModal.id
            });
        }
        store.dispatch({
            type: 'CALCULATE_AVG',
            h: store.getState().editGradeModal.heritage
        });
    }

    render() {
        return(
            <div>
            <div className="modal-header">
              <h4 className="modal-title">Edit Grade</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>
            <div className="modal-body">
                <form className="form-horizontal">
                    <div className="form-group">
                        <label className="control-label col-sm-2"> Name: </label>
                        <input type="text" className="form-control" placeholder="Enter name" value={store.getState().editGradeModal.name} onChange={this.handleName}/>
                    </div>
                    <div className="form-group">
                        <label className="control-label col-sm-2"> Average: </label>
                        <input type="number" step=".01" className="form-control" placeholder="Enter Average" value={store.getState().editGradeModal.avg} onChange={this.handleAvg} disabled={store.getState().editGradeModal.grades.length > 0}/>
                    </div>
                    <div className="form-group">
                        <label className="control-label col-sm-2"> Weight: </label>
                        <input type="number" step=".1" className="form-control" placeholder="Enter Weight" value={store.getState().editGradeModal.weight} onChange={this.handleWeight}/>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <div className="flex-container">
                  <button type="button" onClick={this.handleClose} className="btn btn-danger" data-dismiss="modal">Delete</button>
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" onClick={this.handleClose} className="btn btn-success" data-dismiss="modal">Save</button>
                </div>
            </div>
            </div>
        )
    }
}

const calculatingAvg = (grades) => {
    var value = 0;
    var weight = 0;
        grades.forEach(function(g) {
            value =  ((+(g.avg)) * (+(g.weight))) + value;
            weight = + (g.weight) + weight;
        });

    return (value/weight);
}

const defaultGrade = (h) => {
    return {
        grades: [],
        avg: 100,
        name: 'New Grade',
        heritage: h,
        id: (new Date()).getTime()-1515569653105,
        hide: false,
        weight: 1
    }
}

const editingGrade = (state, h, action) => {
    if (state.id === h[0]) {
        if (h.length > 1) {
            return {...state,grades: state.grades.map(g => editingGrade(g, h.slice(1), action))};
        }
        switch (action.type) {
            case 'ADD':
                return {...state,grades: state.grades.concat({...state,
                    grades: [],
                    name: 'New Grade',
                    heritage: action.h,
                    id: (new Date()).getTime()-1515215358101
                })};
            case 'CHANGE_AVG':
                return {...state,avg: action.avg};
            case 'CHANGE_NAME':
                return {...state,name: action.name};
            case 'CHANGE_WEIGHT':
                return {...state,weight: action.weight};
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

const grade = (state = {...defaultGrade([]),name:'Overall Grade'}, action) => {
    if (['ADD', 'CHANGE_AVG', 'CHANGE_NAME', 'CHANGE_WEIGHT', 'DELETE_GRADE', 'TOGGLE_HIDE'].includes(action.type)) {
        return editingGrade(state, action.h, action);
    }
    switch (action.type) {
        case 'CALCULATE_AVG':
            if (action.h.includes(state.id) && state.grades.length > 0){
                var newGrades = state.grades.map(g => grade(g, action));
                return {...state,avg: calculatingAvg(newGrades), grades: newGrades};
            }
            return state;
        default:
          return state
        }
}

const initialGradeModal = {
    name: '',
    id: 0,
    heritage: [],
    avg: 0,
    grades: [],
    weight: 0
}

const editGradeModal = (state = initialGradeModal, action) => {
    switch (action.type) {
        case 'SET_GRADE_MODAL':
            return action.data;
        case 'CHANGE_NAME_MODAL':
            return {...state,name: action.name};
        case 'CHANGE_AVG_MODAL':
            return {...state,avg: action.avg};
        case 'CHANGE_WEIGHT_MODAL':
            return {...state,weight: action.weight};
        default:
            return state;
        }
}

const gradeApp = combineReducers({
    grade,
    editGradeModal
});

const store = createStore(gradeApp);

const render = () => {
    ReactDOM.render(
        <div className="app">
            <Grade state={store.getState().grade} />
        </div>,
        document.getElementById('root')
    );
};

store.subscribe(render);
render();

registerServiceWorker();
