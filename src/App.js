import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
        <div className="app">
          <p>
            Work in progress, check back soon.
          </p>
          <div className="base-grade">
              <Grade level={0}/>
          </div>
        </div>
    );
  }
}

class Grade extends Component {
    constructor(props) {
		super(props);
        this.state = {
            name: "New Grade",
            level: this.props.level,
            value: 95,
            grades: [],
        };
    }


    addGrade() {
        const newGrade = <Grade level={this.state.level +1}/>;
		return (
            <button className="btn btn-primary"
                onClick={() => this.setState({grades: this.state.grades.concat(newGrade)})}>
    			{'ADD Grade'}
    		</button>
		);
	}

    render() {
        const listItems = this.state.grades.map((grades) => <li>{grades}</li>);
        return (
            <div>
                <p>{this.state.name}</p>
                <div className="GradesListcontainer">
                    <ul>
                        {listItems}
                        <li>{this.addGrade()}</li>
                    </ul>
                </div>
            </div>
        )
    }

}

export default App;
