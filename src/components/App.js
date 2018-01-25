import React from 'react';
import '../index.css';
import { store } from '../index.js';


//main class that encompesses the entire application
export class App extends React.Component {
    constructor(props) {
        super(props);

        this.changeModal = this.changeModal.bind(this);
    }

    //updates a piece of state to determine what link in the nav bar provoked the showing of a modal
    changeModal(event) {
        store.dispatch({
            type: 'UPDATE_MODAL_TYPE',
            modal: event.target.id
        });
    }

    render() {
        return(
            <div>
                {/*bootstrap navbar*/}
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                  <div className="container">
                    <a className="navbar-brand" href="http://DanTheManGude.github.io/Grade-Calculator">Grade Calculator</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarResponsive">
                      <ul className="navbar-nav ml-auto">
                        {/*opens a modal with helpful how-tos*/}
                        <li className="nav-item">
                            <a className="nav-link" id='Hints' data-toggle="modal" data-target="#NavModal" onClick={this.changeModal}><i className="fa fa-question-circle" aria-hidden="true"></i> Help</a>
                        </li>
                        {/*opens a modal to upload a previouslly downloaded grade*/}
                        <li className="nav-item">
                            <a className="nav-link" id='Upload' data-toggle="modal" data-target="#NavModal" onClick={this.changeModal}><i className="fa fa-upload" aria-hidden="true"></i> Upload</a>
                        </li>
                        {/*opens a modal to download the current grade structure*/}
                        <li className="nav-item">
                            <a className="nav-link" id='Download' data-toggle="modal" data-target="#NavModal" onClick={this.changeModal}><i className="fa fa-download" aria-hidden="true"></i> Download</a>
                        </li>
                        {/*Github repo where this project can be found*/}
                        <li className="nav-item">
                          <a className="nav-link" href="https://github.com/DanTheManGude/Grade-Calculator"><i className="fa fa-code" aria-hidden="true"></i> Source</a>
                        </li>
                        {/*feedback form*/}
                        <li className="nav-item">
                            <a className="nav-link" href="https://goo.gl/forms/xehYVVhdNWTMEygm1"><i className="fa fa-paper-plane" aria-hidden="true"></i> Feedback</a>
                        </li>
                        {/*mail to link to get in contact with me*/}
                        <li className="nav-item">
                            <a className="nav-link" href="mailto:contact@dangude.com?Subject=Grade%20Calculator%20Contact"><i className="fa fa-envelope" aria-hidden="true"></i> Contact</a>
                        </li>
                        {/*my main homepage*/}
                        <li className="nav-item">
                          <a className="nav-link" href="https://dangude.com"><img src="icons/favicon.png" alt="DG" height='25'/> Dan Gude</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>

                {/*outershell for the modal created by any of the link in the nav bar*/}
                <div className="modal fade" id="NavModal" role="dialog">
                  <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <NavModal />
                    </div>
                  </div>
                </div>

                {/*main body of the page*/}
                <div className="container">
                  <div className="row">
                    <div className="col-lg-12 intro">
                      <h2 className="mt-5">Welcome to Grade Calculator</h2>
                      {/*into blurb and a quick get started instructions*/}
                      <p>
                          A hassle free way to calculate your grade average.
                          <br/>To get started hit plus to create components that make up a grade.
                          <br/>Hit the gears to change the grade value and name.
                      </p>
                      {/*the base grade which all other grade items exist in*/}
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


//modal component created from one of the nav bar links
class NavModal extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.onFileSubmit = this.onFileSubmit.bind(this);
    }

    //updates a piece of state that keeps track of the desired filename entered
    handleChange(event) {
        store.dispatch({
            type: 'UPDATE_FILENAME',
            fileName: event.target.value
        });
    }

    //updates a piece of state that holds the actual file uploaded
    onChangeFile(event) {
        store.dispatch({
            type: 'UPDATE_FILE',
            file: event.target.files[0]
        });
    }

    //takes the file stored, extracts the data, and sets the rootgrade to the data
    onFileSubmit(event) {
        var json;
        var file = store.getState().file;
        var fileReader = new FileReader();
        fileReader.onload = (function (theFile) {
            return function(e) {
                try {
                    json = JSON.parse(e.target.result);
                    store.dispatch({
                        type: 'UPLOAD_GRADE',
                        state: json
                    });
                } catch (ex) {
                    alert('JSON files created from this website only!');
                }
            }
        })(file);
        fileReader.readAsText(file);
    }

    render() {
        //determines which content the modal should be filled with based on which linked provoked it
        switch (store.getState().navModal) {
            case 'Hints':
                return (<div>
                    <div className="modal-header">
                      <h4 className="modal-title">Hints and How-Tos</h4>
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body">
                        <div className="flex-container">
                            {/*button to set the root grade to an example grade*/}
                            <button  data-dismiss="modal" className="btn btn-outline-primary btn-sm flex-element" onClick={() => {
                                store.dispatch({
                                    type: 'UPLOAD_GRADE',
                                    state: require('../ExampleGrades.json')
                                })
                            }}>Set to example grades</button>
                        </div>
                        {/*various how-tos on how to use and navigate the application as a user*/}
                        <p>
                            Hints to come, check back soon.
                        </p>
                    </div>
                    <div className="modal-footer">
                        <div className="flex-container">
                            <button className="btn btn-outline-dark flex-element" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>);
            case 'Upload':
                return (<div>
                    <div className="modal-header">
                      <h4 className="modal-title">Upload Grades</h4>
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body">
                        <h6>FILES FROM THIS SITE ONLY</h6>
                        {/*form for the user to select a file from their computer*/}
                        <div className="form-group">
                            <input accept="json" className="form-control" type="file" onChange={this.onChangeFile} />
                        </div>
                    </div>
                    {/*activates the funtion to upload the file*/}
                    <div className="modal-footer">
                        <div className="flex-container">
                            <button className="btn btn-outline-dark flex-element" data-dismiss="modal" onClick={this.onFileSubmit}>UPLOAD</button>
                        </div>
                    </div>
                </div>);
            case 'Download':
                var data = ("text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store.getState().grade)));
                return (<div>
                    <div className="modal-header">
                      <h4 className="modal-title">Download Grades</h4>
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body">
                        <form className="form-horizontal">
                            {/*text form to type the desired name of the file of the download*/}
                            <div className="form-group">
                                <label className="control-label">Name of file: </label>
                                <input type="text" defaultValue={store.getState().fileName}
                                onChange={this.handleChange} className="form-control" placeholder="Enter file name"/>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        {/*dowloads the json of the root grade to the user's computer*/}
                        <div className="flex-container">
                          <a className="btn btn-outline-dark flex-element"  href={"data:" + data} download={store.getState().fileName + ".json"}>DOWNLOAD</a>
                        </div>
                    </div>
                </div>);
            default:
                return(<div></div>);
        }
    }
}

//component that represents a single grade item as well as recursivly renders more Grades
class Grade extends React.Component {
    constructor(props) {
        super(props);

        this.setModalState = this.setModalState.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }

    /*sets a piece of state with what the current state of this grade is
        in order for the modal actions to change that rather than this grade directly*/
    setModalState(event) {
        store.dispatch({
            type: 'UPDATE_MODAL',
            state: this.props.state
        });
    }
    //provokes the action to create a new grade item
    handleAdd(event) {
        store.dispatch({
            type: 'ADD',
            h: this.props.state.heritage.concat(this.props.state.id),
            id: (new Date()).getTime()-1515569653105
        });
        //calculate the average with the new grade incorperated
        store.dispatch({
            type: 'CALCULATE_AVG',
            h: this.props.state.heritage.concat(this.props.state.id),
        });
    }

    //returns the appropriate letter grade given the gpa on a 4.0 scale
    findGPA(gpa){
        switch (gpa) {
            case 4:
                return 'A';
            case 3.67:
                return 'A-';
            case 3.33:
                return 'B+';
            case 3:
                return 'B';
            case 2.67:
                return 'B-';
            case 2.33:
                return 'C+';
            case 2:
                return 'C';
            case 1.67:
                return 'C-';
            case 1:
                return 'D';
            default:
                return 'F';
        }
    }

    render() {
        //checks hiding toggle state and changes values according
        var hideText;
        var listStyle;
        if (this.props.state.hide){
            hideText = <i className="fa fa-caret-right" aria-hidden="true"></i>;
            listStyle = {display: 'none'};
        } else {
            hideText = <i className="fa fa-caret-down" aria-hidden="true"></i>;
            listStyle = {listStyleType: 'none'};
        }
        //value to represent the value of the grade, kind is determined by a toggle
        var show = this.props.state.numeric ? (Math.round(this.props.state.avg * 100) / 100) : this.findGPA(this.props.state.avg);
        //determines if the current grade needs to be signified as expected
        var showStyle = this.props.state.expected ? {backgroundColor: '#ffc107'} : {};
        return(
            <div>
                <span>
                    {/*toggles the hiding of all of the children of the current grade*/}
                    <button className="btn btn-link btn-sm" onClick={() => {
                        store.dispatch({
                            type: 'TOGGLE_HIDE',
                            h: this.props.state.heritage.concat(this.props.state.id)
                        })
                    }}>{hideText}</button>
                    {this.props.state.name}
                    &nbsp;&nbsp;
                    <strong style={showStyle}>{show}</strong>
                    &nbsp;&nbsp;&nbsp;
                    <ins>[{this.props.state.weight}]</ins>
                    &nbsp;
                    {/*brings up the edit modal*/}
                    <button
                        className="btn btn-link" data-toggle="modal" data-target="#EditModalForm" onClick={this.setModalState}><i className="fa fa-cogs fa-lg" aria-hidden="true"></i>
                    </button>
                    {/*provoks the addition of a new grade as a child of the current*/}
                    <button
                        className="btn btn-link" onClick={this.handleAdd}><i className="fa fa-plus-square fa-lg" aria-hidden="true"></i>
                    </button>
                    {/*outer shell of the editing modal*/}
                    <div className="modal fade" id="EditModalForm" role="dialog">
                        <div className="modal-dialog modal-sm">
                          <div className="modal-content">
                            <EditModalForm state={this.props.state} />
                          </div>
                        </div>
                    </div>
                </span>
                {/*list of the children grades*/}
                <ul style={listStyle}>
                    {this.props.state.grades.map(grade =>
                        <li key={grade.id}>
                            {/*passes the state of child to the component as a prop*/}
                            <Grade state={grade}/>
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}

//component to handle the editing of the grade which this lives in
class EditModalForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
    }

    //updates the state of the modal with the changing name
    handleName(event) {
        store.dispatch({
            type: 'UPDATE_MODAL',
            state: {...store.getState().editGradeModal,name: event.target.value}
        });
    }

    //toggles the expected or given
    handleRadio(event) {
        store.dispatch({
            type: 'UPDATE_MODAL',
            state: {...store.getState().editGradeModal,expected: !store.getState().editGradeModal.expected}
        });
    }

    //toggles the numeric or letter kind
    handleKind(event) {
        store.dispatch({
            type: 'UPDATE_MODAL',
            state: {...store.getState().editGradeModal,numeric: !store.getState().editGradeModal.numeric}
        });
    }

    //toggles the hide letter state
    handleLetter(event) {
        store.dispatch({
            type: 'UPDATE_MODAL',
            state: {...store.getState().editGradeModal,letterHide: !store.getState().editGradeModal.letterHide}
        });
    }

    handleLetterForm(event){
        var newScale = store.getState().editGradeModal.letterScale;
        var newValue = event.target.value;
        switch (event.target.name) {
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
        }
        store.dispatch({
            type: 'UPDATE_MODAL',
            state: {...store.getState().editGradeModal,letterScale: newScale}
        });
    }

    //updates the state of the modal with the changing points feilds and weight
    handleChange(event){
        //checking to reject negative numbers
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

    //method called whenever the modal is being closed
    handleClose(event) {
        //when the save button initiated the close
        if (event.target.id === 'Save') {
            //transfers all of the changes being stored in the modal's state to the grade's state
            store.dispatch({
                type: 'UPDATE_GRADE',
                state: store.getState().editGradeModal,
                h: store.getState().editGradeModal.heritage.concat(store.getState().editGradeModal.id)
            });
        } else if ((event.target.id === 'Delete')){
            //deletes this grade
            store.dispatch({
                type: 'DELETE_GRADE',
                h: store.getState().editGradeModal.heritage,
                id: store.getState().editGradeModal.id
            });
        }
        //either way calculate the average after the changes are done
        store.dispatch({
            type: 'CALCULATE_AVG',
            h: store.getState().editGradeModal.heritage.concat(store.getState().editGradeModal.id)
        });
    }

    render() {
        //used to hide certain elements
        var leafStyle = store.getState().editGradeModal.grades.length > 0 ? {display: 'none'} : {};
        var baseStyle = store.getState().editGradeModal.id === store.getState().grade.id ? {display: 'none'} : {};
        var radioChecked = store.getState().editGradeModal.expected;
        var numericChecked = store.getState().editGradeModal.numeric;
        var letterStyle = numericChecked ? {display: 'none'} : {};
        var letterText;
        var letterFormStyle;
        if (store.getState().editGradeModal.letterHide || numericChecked){
            letterText = "Edit Letter Scale";
            letterFormStyle = {display: 'none'};
        } else {
            letterText = "Hide Letter Scale";
            letterFormStyle = {};
        }

        return(
            <div>
                <div className="modal-header">
                  <h4 className="modal-title">Edit Grade</h4>
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                </div>
                <div className="modal-body">
                    <form className="form-horizontal">
                        {/*Edit name text form*/}
                        <div className="form-group">
                            <label className="control-label">Name: </label>
                            <input type="text" className="form-control" placeholder="Enter name" value={store.getState().editGradeModal.name} onChange={this.handleName}/>
                        </div>
                        {/*kind radio buttons*/}
                        <div className="form-group flex-container">
                            <label className="radio-inline flex-element">
                              <input onClick={this.handleKind} type="radio" name="kindradio" checked={numericChecked}/>Numeric
                            </label>
                            <label className="radio-inline flex-element">
                              <input onClick={this.handleKind} type="radio" name="kindradio" checked={!numericChecked}/>Letter
                            </label>
                        </div>
                        {/*edit letter scale button*/}
                        <div className="form-group flex-container">
                          <button style={letterStyle} type="button" onClick={this.handleLetter} className="btn btn-outline-info flex-element">{letterText}</button>
                        </div>
                        {/*letter scale form*/}
                        <div className="form-group" style={letterFormStyle}>
                            <h6>Minimum value needed for grade</h6>
                            <div className="flex-container">
                                <div className="flex-element">
                                    <label className="control-label">A</label>
                                    <input name='As' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="A" value={store.getState().editGradeModal.letterScale.As}/>
                                </div>
                                <div className="flex-element">
                                    <label className="control-label">A-</label>
                                    <input name='Am' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="A-" value={store.getState().editGradeModal.letterScale.Am}/>
                                </div>
                                <div className="flex-element">
                                    <label className="control-label">B+</label>
                                    <input name='Bp' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="B+" value={store.getState().editGradeModal.letterScale.Bp}/>
                                </div>
                            </div>
                            <div className="flex-container">
                                <div className="flex-element">
                                    <label className="control-label">B</label>
                                    <input name='Bs' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="B" value={store.getState().editGradeModal.letterScale.Bs}/>
                                </div>
                                <div className="flex-element">
                                    <label className="control-label">B-</label>
                                    <input name='Bm' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="B-" value={store.getState().editGradeModal.letterScale.Bm}/>
                                </div>
                                <div className="flex-element">
                                    <label className="control-label">C+</label>
                                    <input name='Cp' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="C+" value={store.getState().editGradeModal.letterScale.Cp}/>
                                </div>
                            </div>
                            <div className="flex-container">
                                <div className="flex-element">
                                    <label className="control-label">C</label>
                                    <input name='Cs' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="C" value={store.getState().editGradeModal.letterScale.Cs}/>
                                </div>
                                <div className="flex-element">
                                    <label className="control-label">C-</label>
                                    <input name='Cm' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="C-" value={store.getState().editGradeModal.letterScale.Cm}/>
                                </div>
                                <div className="flex-element">
                                    <label className="control-label">D</label>
                                    <input name='Ds' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="D" value={store.getState().editGradeModal.letterScale.Ds}/>
                                </div>
                            </div>
                        </div>
                        {/*points forms*/}
                        <div style={leafStyle} className="form-group flex-container">
                            <div className="flex-element">
                                <label className="control-label">Points Recieved: </label>
                                <input name='recieved' type="number" step=".01" min="0" className="form-control" placeholder="Points Recieved" value={store.getState().editGradeModal.recieved} onChange={this.handleChange}/>
                            </div>
                            <div className="flex-element">
                                <label className="control-label">Points Available: </label>
                                <input name='available' type="number" step=".01" min="0" className="form-control" placeholder="Points Available" value={store.getState().editGradeModal.available} onChange={this.handleChange}/>
                            </div>
                        </div>
                        {/*weight form*/}
                        <div className="form-group" style={baseStyle}>
                            <label className="control-label">Weight: </label>
                            <input name='weight' type="number" step=".01" min="0" className="form-control" placeholder="Enter Weight" value={store.getState().editGradeModal.weight} onChange={this.handleChange}/>
                        </div>
                        {/*actual or expected radio buttons*/}
                        <div className="form-group flex-container" style={leafStyle}>
                            <label className="radio-inline flex-element">
                              <input onClick={this.handleRadio} type="radio" name="optradio" checked={!radioChecked}/>Actual
                            </label>
                            <label className="radio-inline flex-element">
                              <input onClick={this.handleRadio} type="radio" name="optradio" checked={radioChecked}/>Expected
                            </label>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    {/*delete, close and save buttons*/}
                    <div className="flex-container">
                      <button style={baseStyle} type="button" onClick={this.handleClose} className="btn btn-danger flex-element" id="Delete" data-dismiss="modal">Delete</button>
                      <button type="button" className="btn btn-secondary flex-element" data-dismiss="modal">Close</button>
                      <button type="button" onClick={this.handleClose} className="btn btn-success flex-element" id="Save" data-dismiss="modal">Save</button>
                    </div>
                </div>
            </div>
        )
    }
}
