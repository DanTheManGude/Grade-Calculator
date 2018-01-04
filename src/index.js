import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';

const grade = (state = 0, action) => {
    switch (action.type) {
        case 'CHANGE':
          return state + 1
        default:
          return state
      }
}

const Grade = ({
    value,
    onChange
}) => (
    <div>
      <p><strong>{value}</strong></p>
      <ul>
        <li><button className="btn btn-warning btn-sm" onClick={onChange}>Change</button></li>
      </ul>
    </div>
)

const store = createStore(grade);

const render = () => {
    ReactDOM.render(
        <div className="app">
          <p>
            Work in progress, check back soon.
          </p>
          <div className="base-grade">
              <Grade
                value={store.getState()}
                onChange={() =>
                    store.dispatch({
                        type: 'CHANGE'
                    })
                }
              />
          </div>
        </div>,
        document.getElementById('root')
    );
};

store.subscribe(render);
render();

registerServiceWorker();
