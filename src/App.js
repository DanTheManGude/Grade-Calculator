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
            value: 100,
            values: [],
            grades: [],
        };
    }

    renderCalc() {
        return (
            <button className="btn btn-success btn-sm"
                onClick={() => this.handleCalc()}>
    			{'CALC average'}
    		</button>
		);
    }

    handleCalc() {
        console.log('starting handleCalc');

        var avg = 0;

        console.log(this.state.values);

        for(var i in this.state.values) {
            avg += this.state.values[i];
        }

        avg /= this.state.values.length;
        this.setState({value: avg});
        console.log('finished avg ' + avg);
        console.log('finished handleCalc');
    }

    renderAdd() {
		return (
            <button className="btn btn-primary btn-sm"
                onClick={() => this.handleAdd()}>
    			{'ADD Grade'}
    		</button>
		);
    }

    handleAdd(){
        console.log('starting handleAdd');
        var newGrade = <Grade index={this.state.grades.length +1} parent={this} level={this.state.level +1}/>;
        this.setState((prevState) => ({
            grades: prevState.grades.concat([newGrade]),
            values: prevState.values.concat([100]),
        }));

        this.handleCalc();

        console.log('finished handleAdd');
    }

    renderChange(){
        return (
            <button className="btn btn-warning btn-sm"
                onClick={() => this.handleChange()}>
    			{'Change Value'}
    		</button>
		);
    }

    handleChange(){
        this.setState({value: 55});
        //this.props.parent.setState({values[this.props.index]: 0});
    }

    render() {
        var listItems = this.state.grades.map((grades) => <li>{grades}</li>);
        console.log(this.state.values);
        console.log(this.state.value);
        return (
            <div>
                <p>{this.state.name}&nbsp;&nbsp;<strong>{this.state.value}</strong></p>
                <div className="GradesList-container">
                    <ul>
                        {listItems}
                        <li>{this.renderChange()}</li>
                        <li>{this.renderAdd()}</li>
                        <li>{this.renderCalc()}</li>
                    </ul>
                </div>
            </div>
        )
    }

}

export default App;
