import React from 'react';
import { store } from '../index.js';
import { NavModal } from './NavModal.js';
import { Grade } from './Grade.js';
var firebase = require("firebase");

//main class that encompesses the entire application
export class App extends React.Component {
    constructor(props) {
        super(props);

        this.changeModal = this.changeModal.bind(this);
        this.GoogleLogin = this.GoogleLogin.bind(this);
        this.save = this.save.bind(this);

        // Initialize Firebase
        var config = {
          apiKey: "AIzaSyD3NYaSGWpcjdwwoUZBC2j_p1y7eylw3kg",
          authDomain: "grade-calculator-dg.firebaseapp.com",
          databaseURL: "https://grade-calculator-dg.firebaseio.com",
          projectId: "grade-calculator-dg",
          storageBucket: "",
          messagingSenderId: "525891462124"
        };
        firebase.initializeApp(config);
    }

    GoogleLogin(){
        //Google login
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
          console.log("Yay :)");
          // This gives you a Google Access Token. You can use it to access the Google API.
          //var token = result.credential.accessToken;
          // The signed-in user info.
          //var user = result.user;
          //console.log(user.email);
        }).catch(function(error) {
            console.log("Uh OH :(")
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("Error " + errorCode + ": " + errorMessage);
          // The email of the user's account used.
          //var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          //var credential = error.credential;
        });
    }

    save(){
        let user = firebase.auth().currentUser;
        if (user){
            firebase.database().ref('users/' + user.uid).set({
                grade: store.getState().grade
            });
        }
        else {
            alert('You need to be signed in to save remotely.\nUse the Download button to save your grades to your computer.');
        }
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
                        {/*Loads a previouslly saved grade frome firebase*/}
                        <li className="nav-item">
                            <a className="nav-link" id='Save' onClick={this.load}><i className="fas fa-cloud-download-alt"></i> Load</a>
                        </li>
                        {/*saves grade to firebase*/}
                        <li className="nav-item">
                            <a className="nav-link" id='Save' onClick={this.save}><i className="fa fa-cloud-upload-alt"></i> Save</a>
                        </li>
                        {/*opens a modal to open a previouslly downloaded grade*/}
                        <li className="nav-item">
                            <a className="nav-link" id='Upload' data-toggle="modal" data-target="#NavModal" onClick={this.changeModal}><i className="fas fa-folder-open"></i> Open</a>
                        </li>
                        {/*opens a modal to download the current grade structure*/}
                        <li className="nav-item">
                            <a className="nav-link" id='Download' data-toggle="modal" data-target="#NavModal" onClick={this.changeModal}><i className="fa fa-download" aria-hidden="true"></i> Download</a>
                        </li>
                        {/*Github repo where this project can be found*/}
                        <li className="nav-item">
                          <a className="nav-link" href="https://github.com/DanTheManGude/Grade-Calculator" target="_blank"><i className="fa fa-code" aria-hidden="true"></i> Source</a>
                        </li>
                        {/*mail to link to get in contact with me*/}
                        <li className="nav-item">
                            <a className="nav-link" href="mailto:contact@dangude.com?Subject=Grade%20Calculator%20Contact"><i className="fa fa-envelope" aria-hidden="true"></i> Contact</a>
                        </li>
                        {/*GoogleLogin*/}
                        <li className="nav-item">
                            <a className="nav-link" id='Login' onClick={this.GoogleLogin}><img src="icons/google.png" alt="Google Login" height='30em'/></a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>

                {/*outershell for the modal created by any of the link in the nav bar*/}
                <div className="modal fade" id="NavModal" role="dialog">
                  <div className="modal-dialog">
                    <div className="modal-content">
                        <NavModal />
                    </div>
                  </div>
                </div>

                {/*main body of the page*/}
                <div className="container default">
                  <div className="row">
                    <div className="col-lg-12 intro">
                      <h2 id="title" className="mt-5">Welcome to Grade Calculator</h2>
                      <h5> A hassle free way to calculate your grade average.</h5>
                      {/*into blurb and a quick get started instructions*/}
                      <div className="alert alert-info alert-dismissable">
                          <a className="close" data-dismiss="alert" aria-label="close">&times;</a>
                          To get started hit plus to create components that make up a grade.
                          <br/>Hit the gears to change the grade value and name.
                          <br/>Hit the <i className="fa fa-question-circle" aria-hidden="true"></i> for Hints and Help using the site.
                      </div>
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
