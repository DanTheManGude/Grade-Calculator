import React from 'react';
import { store } from '../index.js';

//component that represents a single grade item as well as recursivly renders more Grades
export class Banner extends React.Component {
    render() {
        var type = store.getState().banner.type;
        var show = store.getState().banner.show;
        var clssNme = "alert alert-dismissable fade " + type + " " + show;
        var message = store.getState().banner.message;
        return(
            <div className={clssNme}>
                <a className="close" data-dismiss="alert" aria-label="close">&times;</a>
                {message}
            </div>
        );
    }
}
