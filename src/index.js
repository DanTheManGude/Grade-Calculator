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

        this.setModalState = this.setModalState.bind(this);
    }

    setModalState(event) {
        store.dispatch({
            type: 'UPDATE_MODAL',
            state: this.props.state
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
                        className="btn btn-warning btn-sm" data-toggle="modal" data-target="#EditModalForm" onClick={this.setModalState}>Edit
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
            type: 'UPDATE_MODAL',
            state: {...store.getState().editGradeModal,name: event.target.value}
        });
    }

    handleRecieved(event) {
        store.dispatch({
            type: 'UPDATE_MODAL',
            state: {...store.getState().editGradeModal,recieved: event.target.value, avg: 100*event.target.value/store.getState().editGradeModal.available}
        });
    }

    handleAvailable(event) {
        store.dispatch({
            type: 'UPDATE_MODAL',
            state: {...store.getState().editGradeModal,available: event.target.value, avg: 100*store.getState().editGradeModal.recieved/event.target.value}
        });
    }

    handleWeight(event) {
        store.dispatch({
            type: 'UPDATE_MODAL',
            state: {...store.getState().editGradeModal,weight: event.target.value}
        });
    }

    handleClose(event) {
        if (event.target.innerHTML === 'Save') {
            store.dispatch({
                type: 'UPDATE_GRADE',
                state: store.getState().editGradeModal,
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
        var pointsStyle = store.getState().editGradeModal.grades.length > 0 ? {display: 'none'} : {};
        var weightBaseStyle = store.getState().editGradeModal.id === store.getState().grade.id ? {display: 'none'} : {};
        
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
                    <div style={pointsStyle}>
                        <div className="form-group">
                            <label className="control-label col-lg-2"> Points Recieved: </label>
                            <input type="number" step=".01" className="form-control" placeholder="Enter Points Recieved" value={store.getState().editGradeModal.recieved} onChange={this.handleRecieved}/>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-lg-2"> Points Available: </label>
                            <input type="number" step=".01" className="form-control" placeholder="Enter Points Available" value={store.getState().editGradeModal.available} onChange={this.handleAvailable}/>
                        </div>
                    </div>
                    <div className="form-group" style={weightBaseStyle}>
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
        weight: 1,
        recieved: 100,
        available: 100
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

const grade = (state = {...defaultGrade([]),name:'Overall Grade'}, action) => {
    if (['ADD', 'UPDATE_GRADE', 'DELETE_GRADE', 'TOGGLE_HIDE'].includes(action.type)) {
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
        case 'UPDATE_MODAL':
            return action.state;
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
