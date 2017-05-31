import React from 'react';
import axios from 'axios';
import {getRelatedOuList, getDonutChartData, getToday, getTimeFormat} from './utils';
import epi from './epi';
import DoughnutPie from './donutpie';
import DoughnutInfo from './donutinfo';
import css from './donut.css';
import corsRequest from './cors-request';
import DatePickerBar from './date-picker-bar/index.jsx'
import Location from './location/index.jsx';
import {Button} from 'react-toolbox/lib/button';
import moment from 'moment';

// const i18n_donut_title = 'i18n_donut_title';
const LAST_WEEK_OFFSET = -7;

const data = {
  data1: {
    total: 0,
    mBes: [{status: 'completed', amount: 0},
      {status: 'incomplete', amount: 0},
      {status: 'missing', amount: 0}
    ]
  }
};

export default class Donut extends React.Component {
  constructor(props) {
    super(props);

    let date = new Date();
    let day = date.getDay() + 1;

    this.state = {
      data,
      location: null,
      valueDate: new Date(moment().subtract((day), 'days').valueOf()),
      maxDate: new Date(moment().subtract((day), 'days').valueOf())
    };
  }

  updateDoughnutState() {
    axios.get(getRelatedOuList())
      .then(response => {
        const ou = response.data['organisationUnits'][0]['id'];
        const epiWeek = epi(getToday(LAST_WEEK_OFFSET));

        corsRequest.sendCORSRequest('GET', getDonutChartData(epiWeek.year, epiWeek.week, ou), (res) => {
          this.setState({data: {data1: JSON.parse(res)}});
        });
      });
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
    if (!this.state.valueDate) {
      alert('Please select a date in the Epidemiological week.');
    } else {
      const epiWeek = epi(getTimeFormat(this.state.valueDate));
      const ou = this.state.location ? this.state.location.id : 'MOH12345678';

      corsRequest.sendCORSRequest('GET', getDonutChartData(epiWeek.year, epiWeek.week, ou), (res) => {
        this.setState({data: {data1: JSON.parse(res)}});
      });
    }
  };

  render() {
    const lastWeek = epi(getTimeFormat(this.state.valueDate));

    return (
      <div>
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

        <div className={css.titleContainer}>
          <h3 className={css.lastWeek}>
            {`${i18n_donut_title} ${lastWeek.week} ${lastWeek.year}`}
          </h3>
        </div>

        <div className={css.contentContainer}>
          <DoughnutPie data={this.state.data.data1}/>
          <DoughnutInfo data={this.state.data.data1}/>
        </div>
      </div>
    );
  }
}
