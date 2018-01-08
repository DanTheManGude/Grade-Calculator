import React from 'react';
import ReactDOM from 'react-dom';
//import Component from 'react';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { combineReducers } from 'redux';

class GradeApp extends React.Component {
    render() {
        return(
            <div>
                <p>{this.props.state.baseData.name} <strong>{this.props.state.baseData.avg}</strong></p>
                <ul>
                    <li><button
                        className="btn btn-warning btn-sm" onClick={() => {
                            store.dispatch({
                                type: 'MODIFY',
                            })
                        }}>Modify</button>
                    </li>
                    <li><button
                        className="btn btn-primary btn-sm" onClick={() => {
                            store.dispatch({
                                type: 'MORE',
                                h: []
                            })
                        }}>More</button>
                    </li>
                    {this.props.state.grades.map(grade =>
                        <li key={grade.id}>
                            <Grade state={grade}/>
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}

class Grade extends React.Component {
    constructor(props) {
        super(props);

        this.handleName = this.handleName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleName(event) {
        store.dispatch({
            type: 'CHANGE_NAME',
            name: event.target.value,
            h: this.props.state.heritage.concat(this.props.state.id)
        });
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.props.state.name);
    }

    render() {
        return(
            <div>
                <p>{this.props.state.name} <strong>{this.props.state.avg}</strong>
                </p>
                <ul>
                    <li><button
                        className="btn btn-primary btn-sm" onClick={() => {
                            store.dispatch({
                                type: 'ADD',
                                h: this.props.state.heritage.concat(this.props.state.id)
                            })
                        }}>Add</button>
                    </li>
                    <li><button
                        className="btn btn-warning btn-sm" data-toggle="modal" data-target="#EditModalForm">Change Name</button>
                        <div className="modal fade" id="EditModalForm" role="dialog">
                            <div className="modal-dialog modal-sm">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h4 className="modal-title">Edit Grade</h4>
                                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <form className="form-horizontal">
                                        <div className="form-group">
                                            <label className="control-label col-sm-2"> Name: </label>
                                            <div className="">
                                                <input type="text" className="form-control" placeholder="Enter name" defaultValue={this.props.state.name} onChange={this.handleName}/>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                  <button type="button" onClick={this.handleSubmit} className="btn btn-info" data-dismiss="modal">Close</button>
                                </div>
                              </div>
                            </div>
                        </div>
                    </li>
                    <li><button
                        className="btn btn-info btn-sm" onClick={() => {
                            store.dispatch({
                                type: 'CHANGE_AVG',
                                avg: 229,
                                h: this.props.state.heritage.concat(this.props.state.id)
                            });
                        }}>Change Grade</button>
                    </li>
                    {this.props.state.grades.map(grade =>
                        <li key={grade.id}>
                            <Grade state={grade}/>
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}

const defaultGrade = (h) => {
    return {
        grades: [],
        avg: 100,
        name: 'New Grade',
        heritage: h,
        id: (new Date()).getTime()-1515215358101
    }
}

const adding = (state, h, ogH) => {
    if (state.id === h[0]) {
        if (h.length > 1) {
            return {...state,grades: state.grades.map(g => adding(g, h.slice(1), ogH))};
        }
        return {...state,grades: state.grades.concat(defaultGrade(ogH))};
    }
    return state;
}

const changingAvg = (state, h, avg) => {
    if (state.id === h[0]) {
        if (h.length > 1) {
            return {...state,grades: state.grades.map(g => changingAvg(g, h.slice(1), avg))};
        }
        return { ...state,avg: avg};
    }
    return state;
}

const changingName = (state, h, name) => {
    if (state.id === h[0]) {
        if (h.length > 1) {
            return {...state,grades: state.grades.map(g => changingName(g, h.slice(1), name))};
        }
        return { ...state,name: name};
    }
    return state;
}

const grade = (state, action) => {
    switch (action.type) {
        case 'MORE':
            return defaultGrade(action.h);
        case 'ADD':
            return adding(state, action.h, action.h);
        case 'CHANGE_AVG':
            return changingAvg(state, action.h, action.avg);
        case 'CHANGE_NAME':
            return changingName(state, action.h, action.name);
        default:
          return state
      }
}

const grades = (state = [], action) => {
    switch (action.type) {
        case 'MORE':
            return [...state,grade(undefined, action)];
        case 'ADD':
            return state.map(g => grade(g, action));
        case 'CHANGE_AVG':
            return state.map(g => grade(g, action));
        case 'CHANGE_NAME':
            return state.map(g => grade(g, action));
        default:
          return state;
      }
}

const initialData = {
    avg: 100,
    name: 'Overall Grade',
    id: (new Date()).getTime()
}

const baseData = (state = initialData, action) => {
    switch (action.type) {
        case 'MODIFY':
            return state;
        default:
            return state;
        }
}

const gradeApp = combineReducers({
    grades,
    baseData
});

const store = createStore(gradeApp);

const render = () => {
    ReactDOM.render(
        <div className="app">
          <p>
            Work in progress, check back soon.
          </p>
          <div className="base-grade">
              <GradeApp
                state={store.getState()}
              />
          </div>
        </div>,
        document.getElementById('root')
    );
};

store.subscribe(render);
render();

registerServiceWorker();
