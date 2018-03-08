import React from 'react';
import { store } from '../index.js';

//banner on the top of the page
export class Banner extends React.Component {
    render() {
        return(
            <div>
                {store.getState().banners.reverse().map(banner =>
                    <div className={"alert alert-dismissable fade show " + banner.type}>
                        <a className="close" data-dismiss="alert" aria-label="close">&times;</a>
                        {banner.message}
                    </div>
                )}
            </div>
        );
    }
}
