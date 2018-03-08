import React from 'react';
import { store } from '../index.js';

//banner on the top of the page
export class Banner extends React.Component {
    constructor(props) {
        super(props);

        this.removeBanner = this.removeBanner.bind(this);
    }

    removeBanner(event){
        store.dispatch({
            type: 'REMOVE_BANNER',
            id: event.target.id,
        });
    }

    render() {
        return(
            <div>
                {store.getState().banners.map((banner, index) =>
                    <div className={"alert alert-dismissable fade show " + banner.type}>
                        <a className="close" id={index} onClick={this.removeBanner}>&times;</a>
                        {banner.message}
                    </div>
                )}
            </div>
        );
    }
}
