import React from 'react';
import { store } from '../index.js';
import { NavModal } from './NavModal.js';
import { firebase } from "./App.js";
import { GoogleLogin } from './App.js';

//Navbar on top housing various links related to application wide functions
export class NavBar extends React.Component {

    //updates a piece of state to determine what link in the nav bar provoked the showing of a modal
    changeModal(kind) {
        if ((kind === 'Save' || kind === 'Load') && firebase.auth().currentUser === null){
            store.dispatch({
                    type: 'UPDATE_MODAL_TYPE',
                    modal: 'NotAuth'
            });
        }
        else {
            store.dispatch({
                type: 'UPDATE_MODAL_TYPE',
                modal: kind
            });
        }
    }

    render() {
        return(
            <div>
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
                            <a className="nav-link" data-toggle="modal" data-target="#NavModal" onClick={() => {this.changeModal("Hints")}}><i className="fa fa-question-circle" aria-hidden="true"></i> Help</a>
                        </li>
                        {/*saves grade*/}
                        <li className="nav-item dropdown">
                            <a className="nav-link"><i className="fas fa-save"></i> Save <i className="fas fa-caret-down"></i>
                            </a>
                            <div className="dropdown-content">
                              {/*saves grade to firebase*/}
                              <a data-toggle="modal" data-target="#NavModal" onClick={() => {this.changeModal("Save")}}><i className="fa fa-cloud-upload-alt"></i> Save</a>
                              {/*opens a modal to download the current grade structure*/}
                              <a data-toggle="modal" data-target="#NavModal" onClick={() => {this.changeModal("Download")}}><i className="fa fa-download" aria-hidden="true"></i> Download</a>
                            </div>
                        </li>
                        {/*loads grade*/}
                        <li className="nav-item dropdown">
                            <a className="nav-link"><i className="fas fa-folder-open"></i> Load <i className="fas fa-caret-down"></i>
                            </a>
                            <div className="dropdown-content">
                              {/*Loads a previouslly saved grade frome firebase*/}
                              <a data-toggle="modal" data-target="#NavModal" onClick={() => {this.changeModal("Load")}}><i className="fas fa-cloud-download-alt"></i> Load</a>
                              {/*opens a modal to open a previouslly downloaded grade*/}
                              <a data-toggle="modal" data-target="#NavModal" onClick={() => {this.changeModal("Open")}}><i className="fas fa-desktop"></i> Open</a>
                            </div>
                        </li>
                        {/*Github repo where this project can be found*/}
                        <li className="nav-item">
                          <a className="nav-link" href="https://github.com/DanTheManGude/Grade-Calculator" target="_blank"><i className="fa fa-code" aria-hidden="true"></i> Source</a>
                        </li>
                        {/*mail to link to get in contact with me*/}
                        <li className="nav-item">
                            <a className="nav-link" href="mailto:contact@dangude.com?Subject=Grade%20Calculator%20Contact"><i className="fa fa-envelope" aria-hidden="true"></i> Contact</a>
                        </li>
                        {/*my main homepage*/}
                        <li className="nav-item">
                          <a className="nav-link" href="https://dangude.com" target="_blank"><img src="icons/DG.png" alt="DG" height='25'/> Homepage</a>
                        </li>
                        {/*GoogleLogin*/}
                        <li className="nav-item">
                            <a className="nav-link" id='Login' onClick={GoogleLogin}><img src="icons/G.png" alt="Google Login" height='25em'/> Login</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>

                {/*outershell for the modal created by any of the link in the nav bar*/}
                <div className="modal fade" id="NavModal" role="dialog">
                  <div className="modal-dialog">
                    <div className="modal-content default">
                        <NavModal />
                    </div>
                  </div>
                </div>
            </div>
        );
    }
}
