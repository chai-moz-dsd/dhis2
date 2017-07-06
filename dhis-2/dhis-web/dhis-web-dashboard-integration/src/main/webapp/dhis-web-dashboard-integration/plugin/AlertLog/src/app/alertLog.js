import React from 'react';
import moment from 'moment';
import Location from './location/index.jsx';
import {Button} from 'react-toolbox/lib/button';
import DatePickerBar from './date-picker-bar/index.jsx'
import ReactPaginate from 'react-paginate';
import {COUNT_PER_PAGE} from '../configs';
import AlertLogTable from './table/index.jsx';
import corsRequest from '../utils/cors-request.js';
import calUrl from '../utils/cal-url.js';
import css from './alertLog.scss';

export default class AlertLog extends React.Component {
  constructor(props) {
    super(props);
    const date = new Date();
    date.setDate(1);

    this.state = {
      location: null,
      startDate: date,
      endDate: new Date(),
      pageCount: 1,
      showData: [],
      alertData: []
    }
  }

  updateDoughnutState() {
    corsRequest.sendCORSRequest('GET', calUrl.getAlertLog('MOH12345678', this.state.startDate.valueOf(), this.state.endDate.valueOf()), (res) => {
      let data = JSON.parse(res);

      this.setState({alertData: data});
      this.setState({pageCount: Math.ceil(data.length / COUNT_PER_PAGE)});

      const arrayTmp = this.state.alertData.slice(0, COUNT_PER_PAGE);
      this.setState({showData: arrayTmp});
    });
  }

  componentDidMount() {
    this.updateDoughnutState();
  }

  handleChange = (item, value) => {
    this.setState({...this.state, [item]: value});
  };

  onClean(key) {
    this.setState({[key]: null})
  }

  onChange = (item, value) => {
    this.setState({[item]: value});
  };

  handleSelectedLocation(location) {
    this.setState({location})
  }

  filterData = () => {
    if (!(this.state.startDate && this.state.endDate && this.state.location)) {
      alert('Please provide start date, end date and location.');
    } else {
      let startDay = moment(this.state.startDate);
      let endDay = moment(this.state.endDate);
      let location = this.state.location.id;

      corsRequest.sendCORSRequest('GET', calUrl.getAlertLog(location, startDay.valueOf(), endDay.valueOf()), (res) => {
        let data = JSON.parse(res);

        this.setState({alertData: data});
        this.setState({pageCount: Math.ceil(data.length / COUNT_PER_PAGE)});

        const arrayTmp = this.state.alertData.slice(0, COUNT_PER_PAGE);
        this.setState({showData: arrayTmp});
      });
    }
  };

  handlePageClick = (data) => {
    let selected = data.selected;
    this.setState({showData: this.state.alertData.slice(selected * COUNT_PER_PAGE, (selected + 1) * COUNT_PER_PAGE)});
  };

  renderPagination() {
    const showData = this.state.alertData;

    return !!showData.length && (
        <div className={css.commentBox}>
          <ReactPaginate previousLabel={'previous'}
                         nextLabel={'next'}
                         breakLabel={<a href="">...</a>}
                         breakClassName={'break-me'}
                         pageCount={this.state.pageCount}
                         marginPagesDisplayed={4}
                         pageRangeDisplayed={2}
                         onPageChange={this.handlePageClick}
                         containerClassName={'pagination'}
                         subContainerClassName={'pages pagination'}
                         activeClassName={'active'}/>
        </div>
      );
  }

  render() {
    const {startDate, endDate} = this.state;

    return (
      <div className={css.alertLogDiv}>
        <div className={css.searchContainer}>
          <div className={css.datepickerDiv}>
            <div className={css.datePickerBar}>
              <DatePickerBar
                label={'Start Date'}
                value={startDate}
                maxDate={this.state.endDate}
                onClean={this.onClean.bind(this, 'startDate')}
                onChange={this.onChange.bind(this, 'startDate')}
              />
            </div>

            <div className={css.datePickerBar}>
              <DatePickerBar
                label={'End Date'}
                value={endDate}
                minDate={this.state.startDate}
                onClean={this.onClean.bind(this, 'endDate')}
                onChange={this.onChange.bind(this, 'endDate')}
              />
            </div>
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

        <div className={css.tableContainer}>
          <AlertLogTable showData={this.state.showData}/>

          <div className={css.pagination}>
            {this.renderPagination()}
          </div>
        </div>
      </div>
    )
  }
}
