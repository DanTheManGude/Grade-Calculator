import React from 'react';
import ReactDOM from 'react-dom';
//import Component from 'react';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { combineReducers } from 'redux';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        store.dispatch({
            type: 'UPDATE_FILENAME',
            fileName: event.target.value
        });
    }

    render() {
        var data = ("text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store.getState().grade)));
        return(
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                  <div className="container">
                    <a className="navbar-brand" href="https://github.com/DanTheManGude/Grade-Calculator">Grade Calculator</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarResponsive">
                      <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="modal" data-target="#DownloadModal">Download</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="https://github.com/DanTheManGude/Grade-Calculator">Source</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="https://dangude.com">Dan Gude</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>

                <div className="modal fade" id="DownloadModal" role="dialog">
                  <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Download Grades</h4>
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body">
                        <form className="form-horizontal">
                            <div className="form-group">
                                <label className="control-label">Name of file: </label>
                                <input type="text" defaultValue="MyGrades"
                                onChange={this.handleChange} className="form-control" placeholder="Enter file name"/>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <div className="flex-container">
                          <a className="btn btn-outline-dark flex-element"  href={"data:" + data} download={store.getState().fileName + ".json"}>DOWNLOAD</a>
                        </div>
                    </div>
                    </div>
                  </div>
              </div>

                <div className="container">
                  <div className="row">
                    <div className="col-lg-12 intro">
                      <h2 className="mt-5">Welcome to Grade Calculator</h2>
                      <p>
                          A hassle free way to calculate your grade average.
                          <br/>To get started hit the blue 'Add' button to create components that make up a grade.
                          <br/>Hit the yellow 'Edit' button to change the grade value and name.
                      </p>
                      <div className="rootGrade">
                        <Grade state={store.getState().grade} />
                      </div>

                    </div>
                  </div>
                </div>
            </div>
        );
    }
}

class Grade extends React.Component {
    constructor(props) {
        super(props);

        this.setModalState = this.setModalState.bind(this);
        this.handleAdd = this.handleAdd.bind(this);

    }

    setModalState(event) {
        store.dispatch({
            type: 'UPDATE_MODAL',
            state: this.props.state
        });
    }

    handleAdd(event) {
        store.dispatch({
            type: 'ADD',
            h: this.props.state.heritage.concat(this.props.state.id),
            id: (new Date()).getTime()-1515569653105
        });
        store.dispatch({
            type: 'CALCULATE_AVG',
            h: this.props.state.heritage.concat(this.props.state.id),
        });
    }

    render() {
        var hideText;
        var listStyle = store.getState().editGradeModal.id === store.getState().grade.id ? {display: 'none'} : {};
        if (this.props.state.hide){
            hideText = 'Show';
            listStyle = {display: 'none'};
        } else {
            hideText = 'Hide';
            listStyle = {};
        }

        return(
            <div>
                <span>
                    {this.props.state.name}
                    &nbsp;&nbsp;
                    <strong>{Math.round(this.props.state.avg * 100) / 100}</strong>
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
                <ul style={listStyle}>
                    <li><button
                        className="btn btn-primary btn-sm" onClick={this.handleAdd}>Add</button>
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

    handleChange(event){
        if (event.target.value >= 0){
            var newRecieved = store.getState().editGradeModal.recieved;
            var newAvailable = store.getState().editGradeModal.available;
            var newWeight = store.getState().editGradeModal.weight;
            switch (event.target.name) {
                case 'recieved':
                    newRecieved = event.target.value;
                    break;
                case 'available':
                    newAvailable = event.target.value;
                    break;
                case 'weight':
                    newWeight = event.target.value;
                    break;
                default:
            }
            store.dispatch({
                type: 'UPDATE_MODAL',
                state: {...store.getState().editGradeModal,recieved: newRecieved, available: newAvailable, weight: newWeight, avg: 100*newRecieved/newAvailable}
            });
        }
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
        var baseStyle = store.getState().editGradeModal.id === store.getState().grade.id ? {display: 'none'} : {};

        return(
            <div>
            <div className="modal-header">
              <h4 className="modal-title">Edit Grade</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>
            <div className="modal-body">
                <form className="form-horizontal">
                    <div className="form-group">
                        <label className="control-label">Name: </label>
                        <input type="text" className="form-control" placeholder="Enter name" value={store.getState().editGradeModal.name} onChange={this.handleName}/>
                    </div>
                    <div style={pointsStyle} className="form-group flex-container">
                        <div className="flex-element">
                            <label className="control-label">Points Recieved: </label>
                            <input name='recieved' type="number" step=".01" min="0" className="form-control" placeholder="Points Recieved" value={store.getState().editGradeModal.recieved} onChange={this.handleChange}/>
                        </div>
                        <div className="flex-element">
                            <label className="control-label">Points Available: </label>
                            <input name='available' type="number" step=".01" min="0" className="form-control" placeholder="Points Available" value={store.getState().editGradeModal.available} onChange={this.handleChange}/>
                        </div>
                    </div>
                    <div className="form-group" style={baseStyle}>
                        <label className="control-label">Weight: </label>
                        <input name='weight' type="number" step=".01" min="0" className="form-control" placeholder="Enter Weight" value={store.getState().editGradeModal.weight} onChange={this.handleChange}/>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <div className="flex-container">
                  <button style={baseStyle} type="button" onClick={this.handleClose} className="btn btn-danger flex-element" data-dismiss="modal">Delete</button>
                  <button type="button" className="btn btn-secondary flex-element" data-dismiss="modal">Close</button>
                  <button type="button" onClick={this.handleClose} className="btn btn-success flex-element" data-dismiss="modal">Save</button>
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

const defaultGrade = (id, h) => {
    return {
        grades: [],
        avg: 100,
        name: 'New Grade',
        heritage: h,
        id,
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
                return {...state,grades: state.grades.concat(defaultGrade(action.id, action.h))};
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

const grade = (state = {...defaultGrade(0,[]),name:'Overall Grade'}, action) => {
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

const fileName = (state = "MyGrades", action) => {
    switch (action.type) {
        case 'UPDATE_FILENAME':
            return action.fileName;
        default:
            return state;
        }
}

const gradeApp = combineReducers({
    grade,
    editGradeModal,
    fileName
});

const store = createStore(gradeApp);

const render = () => {
    ReactDOM.render(
        <div className="app">
            <App />
        </div>,
        document.getElementById('root')
    );
};

store.subscribe(render);
render();

registerServiceWorker();
