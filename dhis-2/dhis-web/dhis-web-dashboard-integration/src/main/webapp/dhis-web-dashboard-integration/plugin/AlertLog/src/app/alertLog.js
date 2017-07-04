import React from 'react';
import moment from 'moment';
import Location from './location/index.jsx';
import {Button} from 'react-toolbox/lib/button';
import DatePickerBar from './date-picker-bar/index.jsx'
import css from './alertLog.scss';

export default class Donut extends React.Component {
  constructor(props) {
    super(props);

    let date = new Date();
    let day = date.getDay() + 1;

    this.state = {
      location: null,
      valueDate: new Date(moment().subtract((day), 'days').valueOf()),
      maxDate: new Date(moment().subtract((day), 'days').valueOf())
    }
  }

  updateDoughnutState() {
    console.log('updateDoughnutState function test');
  }

  componentDidMount() {
    this.updateDoughnutState();
  }

  handleChange = (item, value) => {
    this.setState({...this.state, [item]: value});
  };

  onClean(key) {
    this.setState({[key]: null});
  }

  handleSelectedLocation(location) {
    this.setState({location})
  }

  filterData = () => {
    console.log('filter data function test');
  };

  render() {
    return (
      <div className={css.alertLogDiv}>
        <div className={css.searchContainer}>
          <div className={css.datepickerDiv}>
            <DatePickerBar
              label={ 'Epidemiological Week' }
              value={this.state.valueDate}
              maxDate={this.state.maxDate}
              onChange={this.handleChange.bind(this, 'valueDate')}
              onClean={this.onClean.bind(this, 'valueDate')}
            />
          </div>

          <div className={css.locationDiv}>
            <Location cancelLabel={ 'cancel' }
                      okLabel={ 'ok'}
                      onSelect={::this.handleSelectedLocation}
                      onClean={this.onClean.bind(this, 'location')}
            />
          </div>

          <div className={css.buttonDiv}>
            <Button className={ css.reportBtn } label={ 'search' }
                    neutral={ false }
                    onClick={this.filterData}/>
          </div>
        </div>

      </div>
    )}
}
