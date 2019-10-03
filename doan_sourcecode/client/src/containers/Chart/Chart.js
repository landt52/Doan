import React, { Component } from 'react';
import drawChart from './ChartDrawer.js'
import {selectAll} from 'd3-selection';
import {Form, FormGroup, Label, Input} from 'reactstrap';

class Chart extends Component {
    state = {
        types: [],
        selected: ''
    }

    componentDidMount(){
        const charts = this.props.data.map(data => Object.keys(data)[0]);
        const keys = Object.keys(this.props.data);
        this.setState({
          types: charts,
          selected: keys[0]
        }, () => drawChart(this.props.data[this.state.selected]));
    }

    componentWillUnmount() {
        selectAll('.n').remove()
    }

    changeChart = (e) => {
        this.setState({ selected: e.target.value }, () => {
            selectAll('.n').remove();
            selectAll('.chart > *').remove();
            drawChart(this.props.data[this.state.selected]);
          }
        );
    }
    
    render() {
        const select = (
          <Form>
            <FormGroup>
              <Label for='selectType'>Select</Label>
              <Input type='select' name='selectType' id='selectType' onChange={this.changeChart}>
                {this.state.types.map((type, id) => <option key={type} value={id}>{type}</option>)}
              </Input>
            </FormGroup>
          </Form>
        );
        return (
            <div>
                {select}
                <div className='chart' />
            </div>
        );
    }
}

export default Chart;