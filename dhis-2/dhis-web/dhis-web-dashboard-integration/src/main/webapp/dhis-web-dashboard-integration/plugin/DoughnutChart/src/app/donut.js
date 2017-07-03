import React from 'react';
import axios from 'axios';
import {getRelatedOuList, getDonutChartData, getToday, getTimeFormat} from './utils';
import epi from './epi';
import DoughnutPie from './donutpie';
import DoughnutInfo from './donutinfo';
import Information from './information';
import css from './donut.css';
import corsRequest from './cors-request';
import DatePickerBar from './date-picker-bar/index.jsx'
import Location from './location/index.jsx';
import {Button} from 'react-toolbox/lib/button';
import moment from 'moment';
import calUrl from '../utils/cal-url.js';
import calHead from '../utils/cal-head';
import format from '../utils/cal-format';
import * as calPeriod from '../utils/cal_period';

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

const record = {
  Ccolera: 0,
  Cdisenteria: 0,
  Cpeste: 0,
  CtetanoRecemNascidos: 0,
  CparalisiaFlacidaAguda: 0,
  Craiva: 0,
  Cdiarreia: 0,
  CmalariaClinica: 0,
  CmalariaConfirmada: 0,
  Cmeningite: 0,
  Csarampo: 0,
  Ocolera: 0,
  Odisenteria: 0,
  Opeste: 0,
  OtetanoRecemNascidos: 0,
  OparalisiaFlacidaAguda: 0,
  Oraiva: 0,
  Odiarreia: 0,
  OmalariaClinica: 0,
  OmalariaConfirmada: 0,
  Omeningite: 0,
  Osarampo: 0
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
      maxDate: new Date(moment().subtract((day), 'days').valueOf()),
      head: [],
      oriHead: [],
      mappings: [],
      filter: [],
      record: record
    }
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

    axios.get(calUrl.getIdUrl(), calUrl.getConfig())
      .then(function (response) {
        let mappings = response.data['dataElements'];
        axios.get(calUrl.getHeadUrl(), calUrl.getConfig())
          .then(function (response) {
            let oriHead = response.data['dataElementOperands'];
            let filter = calHead.getFilter(oriHead, mappings);
            let head = calHead.getHead(oriHead, mappings);

            this.setState({
              head: head,
              oriHead: oriHead,
              mappings: mappings,
              filter: filter
            });

            let ous = [];
            ous.push('MOH12345678')

            let periods = calPeriod.getWeekRange({
              startDate: this.state.valueDate,
              endDate: this.state.valueDate
            });

            axios.get(calUrl.getRowUrl(this.state.oriHead, ous, calPeriod.generatePeriod(periods)), calUrl.getConfig())
              .then(function (response) {
                let totalReocrd = format.formatResponse(response.data.rows, record, this.state.oriHead);
                this.setState({totalReocrd});
              }.bind(this))

          }.bind(this))
      }.bind(this));
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

      let ous = [];
      ous.push(this.state.location.id);

      let periods = calPeriod.getWeekRange({
        startDate: this.state.valueDate,
        endDate: this.state.valueDate
      });

      axios.get(calUrl.getRowUrl(this.state.oriHead, ous, calPeriod.generatePeriod(periods)), calUrl.getConfig())
        .then(function (response) {
          let totalRecord = format.formatResponse(response.data.rows, record, this.state.oriHead);
          this.setState({totalRecord});
        }.bind(this))
    }
  };

  render() {
    const lastWeek = epi(getTimeFormat(this.state.valueDate));

    return (
      <div className={css.donutDiv}>
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
            {`mBES submission data for week ${lastWeek.week} ${lastWeek.year}`}
          </h3>
        </div>

        <div className={css.contentContainer}>
          <DoughnutPie data={this.state.data.data1}/>
          <DoughnutInfo data={this.state.data.data1}/>
          <Information data={this.state.record}/>
        </div>
      </div>
    );
  }
}
