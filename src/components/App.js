import React from 'react';
import { store } from '../index.js';
import { NavBar } from './NavBar.js';
import { Grade } from './Grade.js';
import { Banner } from './Banner.js';
import { config } from '../config.js';
export var firebase = require("firebase");

export function GoogleLogin(){
    //Google login
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var message = "Successfully logged in. Welcome " + result.user.email;
        store.dispatch({
            type: 'ADD_BANNER',
            message: message,
            'kind': 'alert-success'
        });
    }).catch(function(error) {
        store.dispatch({
            type: 'ADD_BANNER',
            message: "Something went wrong trying to login.",
            'kind': 'alert-danger'
        });
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error " + errorCode + ": " + errorMessage);
    });
}

//main class that encompesses the entire application
export class App extends React.Component {
    constructor(props) {
        super(props);

        // Initialize Firebase
        firebase.initializeApp(config);
    }

    render() {
        return(
            <div>
                <NavBar />

                {/*main body of the page*/}
                <div className="container default">
                  <div className="row">
                    <div className="col-lg-12 intro">
                      <h2 id="title" className="mt-5">Welcome to Grade Calculator</h2>
                      <h5> A hassle free way to calculate your grade average.</h5>
                      <Banner />
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
