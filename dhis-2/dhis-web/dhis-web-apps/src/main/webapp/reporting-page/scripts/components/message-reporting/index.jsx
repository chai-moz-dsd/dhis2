import React, {Component} from "react";
import moment from "moment";
import axios from "axios";
import _ from "lodash";
import {Button} from "react-toolbox/lib/button";
import HeaderBarComponent from "d2-ui/lib/app-header/HeaderBar";
import headerBarStore$ from "d2-ui/lib/app-header/headerBar.store";
import withStateFrom from "d2-ui/lib/component-helpers/withStateFrom";
import ToolBoxLink from "react-toolbox/lib/link";
import {Link} from "react-router";
import DatePickerBar from "../date-picker-bar/index.jsx";
import calUrl from "../../utils/cal-url.js";
import calRow from "../../utils/cal-row";
import css from "./index.scss";
import AppTheme from "../../../theme/theme.js";
import Location from '../location/index.jsx';
import corsRequest from "../../utils/cors-request.js";
import ReactPaginate from 'react-paginate';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

export default class MessageReporting extends Component {

    static childContextTypes = {
        d2: React.PropTypes.object,
        muiTheme: React.PropTypes.object,
    };

    constructor() {
        super();

        this.state = {
            startDate: null,
            endDate: null,
            tableStartDate: null,
            tableEndDate: null,
            namesMapping: [],
            regionalList: [],
            showedData: [{
                province: 'province1',
                district: 'district1',
                facility: 'facility1',
                message: '1111111',
                created: '1233123',
                submitted: '342423423'
            },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                },
                {
                    province: 'province1',
                    district: 'district1',
                    facility: 'facility1',
                    message: '1111111',
                    created: '1233123',
                    submitted: '342423423'
                }],
            rows: [],
            location: null,
            offset: 0,
            pageCount: 1
        };

        this.generateRows = ::calRow.generateRows
    }

    getChildContext() {
        return {
            d2: this.props.routes[0].d2,
            muiTheme: AppTheme,
        };
    }

    loadCommentsFromServer() {
        console.log('------------');
    }

    componentDidMount() {
        const date = new Date();
        date.setDate(1);
        this.setState({
            startDate: date,
            endDate: new Date(),
        });

        this.setState({
            tableStartDate: startDay,
            tableEndDate: endDay
        });

        corsRequest.sendCORSRequest('GET', calUrl.getMessageCount('MOH12345678', this.state.startDate.valueOf(), this.state.endDate.valueOf()), (res) => {
            let pageCount = res / 20;
            this.setState({pageCount: pageCount});
        });

        corsRequest.sendCORSRequest('GET', calUrl.getMessageInfo('MOH12345678', this.state.startDate.valueOf(), this.state.endDate.valueOf(), 1), (res) => {
            this.setState({showedData: res})
        });

        this.loadCommentsFromServer();
    }

    onChange = (item, value) => {
        this.setState({[item]: value});
    };

    generateReport = () => {
        if (!(this.state.startDate && this.state.endDate && this.state.location)) {
            alert('Please check the start date, the end date and the location.');
        } else {
            let startDay = moment(this.state.startDate);
            let endDay = moment(this.state.endDate);
            let location = this.state.location.id;

            this.setState({
                tableStartDate: startDay,
                tableEndDate: endDay
            });

            corsRequest.sendCORSRequest('GET', calUrl.getMessageInfo(location, startDay.valueOf(), endDay.valueOf(), 1), (res) => {
                this.setState({showedData: res})
            });
        }
    };

    onClean(key) {
        this.setState({[key]: null})
    }

    handleSelectedLocation(location) {
        this.setState({location})
    }

    renderTimePicker() {
        const {startDate, endDate} = this.state;

        return (
            <div>
                <DatePickerBar
                    label={this.props.routes[0].d2.i18n.getTranslation('start_date')}
                    value={startDate}
                    maxDate={this.state.endDate}
                    onClean={this.onClean.bind(this, 'startDate')}
                    onChange={this.onChange.bind(this, 'startDate')}
                />

                <DatePickerBar
                    label={this.props.routes[0].d2.i18n.getTranslation('end_date')}
                    value={endDate}
                    minDate={this.state.startDate}
                    onClean={this.onClean.bind(this, 'endDate')}
                    onChange={this.onChange.bind(this, 'endDate')}
                />

                <Location cancelLabel={this.props.routes[0].d2.i18n.getTranslation('cancel')}
                          okLabel={this.props.routes[0].d2.i18n.getTranslation('ok')}
                          onSelect={::this.handleSelectedLocation}
                          onClean={this.onClean.bind(this, 'location')}
                />
            </div>
        )
    }

    handlePageClick = (data) => {
        let selected = data.selected + 1;

        if (!(this.state.startDate && this.state.endDate && this.state.location)) {
            alert('Please check the start date, the end date and the location.');
        } else {
            let startDay = moment(this.state.startDate);
            let endDay = moment(this.state.endDate);
            let location = this.state.location.id;

            this.setState({
                tableStartDate: startDay,
                tableEndDate: endDay
            });

            corsRequest.sendCORSRequest('GET', calUrl.getMessageInfo(location, startDay.valueOf(), endDay.valueOf(), selected), (res) => {
                this.setState({showedData: res})
            });
        }
    };

    renderPagination() {
        return (
            <div className={css.commentBox}>
                <ReactPaginate previousLabel={"previous"}
                               nextLabel={"next"}
                               breakLabel={<a href="">...</a>}
                               breakClassName={"break-me"}
                               pageCount={this.state.pageCount}
                               marginPagesDisplayed={4}
                               pageRangeDisplayed={2}
                               onPageChange={this.handlePageClick}
                               containerClassName={"pagination"}
                               subContainerClassName={"pages pagination"}
                               activeClassName={"active"}/>
            </div>
        );
    }

    renderSidebar() {
        return (
            <div className={ css.sidebar + ' col-sm-4 col-md-2' }>
                <div className={ css.head }>{this.props.routes[0].d2.i18n.getTranslation('message_head')}</div>
                { this.renderTimePicker() }
                <Button
                    className={ css.reportBtn }
                    label={this.props.routes[0].d2.i18n.getTranslation('gen_report')}
                    neutral={ false }
                    onClick={this.generateReport}
                />
            </div>
        )
    }

    renderTableHead() {
        return (
            <thead>
            <tr>
                <th>Province</th>
                <th>District</th>
                <th>Facility</th>
                <th>Message</th>
                <th>Create On</th>
                <th>Submitted On</th>
            </tr>
            </thead>
        )
    }

    renderTableRows(items, rows) {
        items.forEach((item) => {
            const rowIdx = rows.length;

            rows.push((
                <tr>
                    <td>
                        {item.province}
                    </td>
                    <td>
                        {item.district}
                    </td>
                    <td>
                        {item.facility}
                    </td>
                    <td>
                        {item.message}
                    </td>
                    <td>
                        {item.created}
                    </td>
                    <td>
                        {item.submitted}
                    </td>
                </tr>
            ))
        });
    }

    renderTableBody() {
        const showedData = this.state.showedData;

        return !!showedData.length && (
                <tbody>
                {
                    showedData.map((items) => {
                        let list = [];

                        this.renderTableRows([items], list);

                        return list.map((item) => {
                            return item;
                        });
                    })
                }
                </tbody>
            )
    }

    renderTable() {
        return (
            <div className={ css.content }>
                <div className={ css.changeScreenLabel }>
                    <Link to='/?category=location'>
                        <ToolBoxLink label={this.props.routes[0].d2.i18n.getTranslation('location')}
                                     icon='location_city'/>
                    </Link>
                    <Link to='/?category=week'>
                        <ToolBoxLink label={this.props.routes[0].d2.i18n.getTranslation('time_series')}
                                     icon='date_range'/>
                    </Link>
                    <Link to='/ops'>
                        <ToolBoxLink label={this.props.routes[0].d2.i18n.getTranslation('ops_indicator')}
                                     icon='assignment'/>
                    </Link>
                    <Link to='/message'>
                        <ToolBoxLink label={this.props.routes[0].d2.i18n.getTranslation('message')} active={true}
                                     icon='assignment'/>
                    </Link>
                </div>

                <div className={ css.divTable }>
                    <div className={ css.tableContainer } onScroll={this.handleScroll}>
                        <table className={ css.reportingTable }>
                            { this.renderTableHead() }
                            { this.renderTableBody() }
                        </table>
                        { this.renderPagination() }
                    </div>
                </div>

            </div>
        )
    }

    render() {
        return (
            <div>
                <HeaderBar lastUpdate={new Date()}/>
                { this.renderSidebar() }
                { this.renderTable() }
            </div>
        )
    }

}
