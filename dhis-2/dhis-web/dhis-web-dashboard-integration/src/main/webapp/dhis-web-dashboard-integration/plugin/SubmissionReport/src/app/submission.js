import React from 'react';
import Location from './location/index.jsx';
import {Button} from 'react-toolbox/lib/button';
import Link from 'react-toolbox/lib/link';
import DatePickerBar from './date-picker-bar/index.jsx'
import ReactPaginate from 'react-paginate';
import {COUNT_PER_PAGE} from '../configs';
import SubmissionTable from './table/index.jsx';
import corsRequest from '../utils/cors-request.js';
import calUrl from '../utils/cal-url.js';
import css from './submission.css';

export default class Submission extends React.Component {
  constructor(props) {
    super(props);
    const date = new Date();
    date.setDate(1);

    this.state = {
      location: null,
      startDate: date,
      endDate: new Date(),
      pageCount: 0,
      showData: [],
      currentPage: 1
    }
  }

  updateDoughnutState() {
    corsRequest.sendCORSRequest('GET', calUrl.getSubmissionNumber('MOH12345678', this.state.startDate.valueOf(), this.state.endDate.valueOf()), (res) => {
      this.setState({pageCount: Math.ceil(res / COUNT_PER_PAGE)})
    });

    corsRequest.sendCORSRequest('GET', calUrl.getSubmission('MOH12345678', this.state.startDate.valueOf(), this.state.endDate.valueOf(), this.state.currentPage), (res) => {
      this.setState({showData: JSON.parse(res)})
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

  exportTable = () => {
    window.open(calUrl.getSubmissionExcel(this.state.location.id, this.state.startDate.valueOf(), this.state.endDate.valueOf()),'_blank');
  };

  filterData = () => {
    if (!(this.state.startDate && this.state.endDate && this.state.location)) {
      alert('Please provide start date, end date and location.');
    } else {
      this.setState({currentPage: 1}, function () {
        corsRequest.sendCORSRequest('GET', calUrl.getSubmissionNumber(this.state.location.id, this.state.startDate.valueOf(), this.state.endDate.valueOf()), (res) => {
          this.setState({pageCount: Math.ceil(res / COUNT_PER_PAGE)})
        });

        corsRequest.sendCORSRequest('GET', calUrl.getSubmission(this.state.location.id, this.state.startDate.valueOf(), this.state.endDate.valueOf(), this.state.currentPage), (res) => {
          this.setState({showData: JSON.parse(res)})
        });
      });
    }
  };

  handlePageClick = (data) => {
    this.setState({currentPage: (data.selected + 1)}, function () {
      corsRequest.sendCORSRequest('GET', calUrl.getSubmission(this.state.location.id, this.state.startDate.valueOf(), this.state.endDate.valueOf(), (data.selected + 1)), (res) => {
        this.setState({showData: JSON.parse(res)})
      });
    });
  };

  renderPagination() {
    return (this.state.pageCount !== 0) && (
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
                label={'Start Week'}
                value={startDate}
                maxDate={this.state.endDate}
                onClean={this.onClean.bind(this, 'startDate')}
                onChange={this.onChange.bind(this, 'startDate')}
              />
            </div>

            <div className={css.datePickerBar}>
              <DatePickerBar
                label={'End Week'}
                value={endDate}
                minDate={this.state.startDate}
                onClean={this.onClean.bind(this, 'endDate')}
                onChange={this.onChange.bind(this, 'endDate')}
              />
            </div>
          </div>

          <div className={css.locationDiv}>
            <Location cancelLabel={'cancel'}
                      okLabel={'ok'}
                      onSelect={::this.handleSelectedLocation}
                      onClean={this.onClean.bind(this, 'location')}
            />
          </div>

          <div className={css.buttonDiv}>
            <Button className={css.reportBtn} label={'search'}
                    neutral={false}
                    onClick={this.filterData}/>
          </div>

          <div className={css.exportDiv}>
            <Link onClick={this.exportTable} label={'export to xls'}
                  icon="get_app"/>
          </div>
        </div>

        <div className={css.tableContainer}>
          <SubmissionTable showData={this.state.showData}/>

          <div className={css.pagination}>
            {this.renderPagination()}
          </div>
        </div>
      </div>
    )
  }
}
