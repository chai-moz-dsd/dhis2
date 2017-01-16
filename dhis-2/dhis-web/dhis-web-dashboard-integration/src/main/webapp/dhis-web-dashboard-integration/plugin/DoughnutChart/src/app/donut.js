import React from 'react';
import axios from 'axios';
import {getRelatedOuList, getDonutChartData, getToday} from './utils';
import epi from './epi';
import corsRequest from "./cors-request";
import DoughnutPie from './donutpie';
import DoughnutInfo from './donutinfo';
import css from './donut.css';


const LAST_WEEK_OFFSET = -7;
const LAST_TWO_WEEK_OFFSET = -14;

const mBes = [{status: 'completed', amount: 0},
  {status: 'incomplete', amount: 0},
  {status: 'missing', amount: 0}
];

const data = {
  data1: {total: 0, mBes: mBes},
  data2: {total: 0, mBes: mBes}
};

export default class Donut extends React.Component {
  constructor(props) {
    super(props);

    this.state = {data};
  }

  updateDoughnutState(week) {
    let offset = (week === 'thisWeek') ? LAST_WEEK_OFFSET : LAST_TWO_WEEK_OFFSET;

    axios.get(getRelatedOuList())
      .then(response => {
        const ou = response.data['organisationUnits'][0]['id'];
        const epiWeek = epi(getToday(offset));

        corsRequest.sendCORSRequest('GET', getDonutChartData(epiWeek.year, epiWeek.week, ou), (res) => {
          if (week === 'thisWeek') {
            this.setState({data: {data1: JSON.parse(res), data2: this.state.data.data2}});
          }
          else if (week === 'lastWeek') {
            this.setState({data: {data1: this.state.data.data1, data2: JSON.parse(res)}});
          }
        });
      });
  }

  componentDidMount() {
    this.updateDoughnutState('thisWeek');
    this.updateDoughnutState('lastWeek');
  };

  render() {
    const lastWeek = epi(getToday(LAST_WEEK_OFFSET));
    const theWeekBeforeLastWeek = epi(getToday(LAST_TWO_WEEK_OFFSET));
    return (
      <div>
        <div className={css.titleContainer}>
          <h3 className={css.lastWeek}>
            {`National mBES submission data for week ${lastWeek.week} ${lastWeek.year}`}
          </h3>

          <h3 className={css.theWeekBeforeLastWeek}>
            {`National mBES submission data for week ${theWeekBeforeLastWeek.week} ${theWeekBeforeLastWeek.year}`}
          </h3>
        </div>

        <div className={css.contentContainer}>
          <DoughnutPie data={this.state.data.data1}/>
          <DoughnutInfo data={this.state.data.data1}/>
          <DoughnutPie data={this.state.data.data2}/>
          <DoughnutInfo data={this.state.data.data2}/>
        </div>
      </div>
    );
  }
}
