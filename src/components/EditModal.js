import React from 'react';
import { store } from '../index.js';

//component to handle the editing of the grade which this lives in
export class EditModal extends React.Component {
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
        store.dispatch({
            type: 'UPDATE_MODAL_LETTER',
            letter: event.target.name,
            number: event.target.value
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
            if (store.getState().editGradeModal.id === store.getState().grade.id){
                //sets state to single grade with default values
                store.dispatch({
                    type: 'CLEAR_GRADE'
                });
                return;
            }
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
                  <button type="button" className="close btn" data-dismiss="modal">&times;</button>
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
                            <label className="radio-inline flex-element pointer">
                              <input className="pointer" onClick={this.handleKind} type="radio" name="kindradio" checked={numericChecked}/> Numeric
                            </label>
                            <label className="radio-inline flex-element pointer">
                              <input className="pointer" onClick={this.handleKind} type="radio" name="kindradio" checked={!numericChecked}/> Letter
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
                                    <input name='As' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="A" value={store.getState().editGradeModal.As}/>
                                </div>
                                <div className="flex-element">
                                    <label className="control-label">A-</label>
                                    <input name='Am' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="A-" value={store.getState().editGradeModal.Am}/>
                                </div>
                                <div className="flex-element">
                                    <label className="control-label">B+</label>
                                    <input name='Bp' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="B+" value={store.getState().editGradeModal.Bp}/>
                                </div>
                            </div>
                            <div className="flex-container">
                                <div className="flex-element">
                                    <label className="control-label">B</label>
                                    <input name='Bs' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="B" value={store.getState().editGradeModal.Bs}/>
                                </div>
                                <div className="flex-element">
                                    <label className="control-label">B-</label>
                                    <input name='Bm' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="B-" value={store.getState().editGradeModal.Bm}/>
                                </div>
                                <div className="flex-element">
                                    <label className="control-label">C+</label>
                                    <input name='Cp' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="C+" value={store.getState().editGradeModal.Cp}/>
                                </div>
                            </div>
                            <div className="flex-container">
                                <div className="flex-element">
                                    <label className="control-label">C</label>
                                    <input name='Cs' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="C" value={store.getState().editGradeModal.Cs}/>
                                </div>
                                <div className="flex-element">
                                    <label className="control-label">C-</label>
                                    <input name='Cm' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="C-" value={store.getState().editGradeModal.Cm}/>
                                </div>
                                <div className="flex-element">
                                    <label className="control-label">D</label>
                                    <input name='Ds' onChange={this.handleLetterForm} step=".01" min="0" className="form-control" placeholder="D" value={store.getState().editGradeModal.Ds}/>
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
                            <label className="radio-inline flex-element pointer">
                              <input className="pointer" onClick={this.handleRadio} type="radio" name="optradio" checked={!radioChecked}/> Actual
                            </label>
                            <label className="radio-inline flex-element pointer">
                              <input className="pointer" onClick={this.handleRadio} type="radio" name="optradio" checked={radioChecked}/> Expected
                            </label>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    {/*delete, close and save buttons*/}
                    <div className="flex-container">
                      <button type="button" onClick={this.handleClose} className="btn btn-danger flex-element" id="Delete" data-dismiss="modal">Delete</button>
                      <button type="button" className="btn btn-secondary flex-element" data-dismiss="modal">Close</button>
                      <button type="button" onClick={this.handleClose} className="btn btn-success flex-element" id="Save" data-dismiss="modal">Save</button>
                    </div>
                </div>
            </div>
        )
    }
}
