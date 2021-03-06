import React from "react";
import axios from "axios";
import moment from 'moment';
import ReportingHead from "../reporting-head/index.jsx";
import ReportingBody from "../reporting-body/index.jsx";
import ReportingSingleHead from "../reporting-single-head/index.jsx";
import calSpan from "../../utils/cal-span.js";
import calRow from "../../utils/cal-row.js";
import calUrl from "../../utils/cal-url.js";
import calOrgan from "../../utils/cal_organisation";
import css from "./index.scss";
import ToolBoxLink from "react-toolbox/lib/link";
import {Link} from 'react-router';
import "./report-table.scss";
import * as calPeriod from "../../utils/cal_period";
import {DEFAULT_TEXT_LEVEL, DEFAULT_WEEK_ROWS} from '../../configs';

var _ = {
    each: require('lodash/each'),
    noop: require('lodash/noop'),
    cloneDeep: require('lodash/cloneDeep'),
    get: require('lodash/get'),
};


class ReportingTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [{id: '', name: '', values: [], children: [{name: '', values: []}]}],
            isPosition: 'absolute',
            leftDistance: 0
        };

        this.fetchWeekRows = ::this.fetchWeekRows
    }

    static get defaultProps() {
        return {
            head: [],
            oriHead: [],
            currentCategory: 'location',
            changeCategory: _.noop,
            periods: calPeriod.getWeekRange({
                startDate: new Date(moment().subtract((DEFAULT_WEEK_ROWS - 1), 'weeks').valueOf()),
                endDate: new Date()
            }),
            d2: [],
            showChildren: {MoH: true}
        }
    };

    static childContextTypes = {
        d2: React.PropTypes.object
    };

    getChildContext() {
        return {
            d2: this.props.d2
        };
    }

    fetchRows(props) {
        let mohId = 'MOH12345678';

        axios.get(calUrl.getRelatedOuList(), calUrl.getConfig()).then(function (response) {
            let ous = [];

            _.each(response.data['organisationUnits'], function (ou) {
                ous.push(ou.id);
            });
            axios.get(calUrl.getRowUrl(props.oriHead, ous, calPeriod.generatePeriod(props.periods)), calUrl.getConfig())
                .then(function (response) {
                    let rows = calRow.getRows(response.data, props.oriHead);
                    let promises = [];
                    _.each(rows, function (row) {
                        promises.push(axios.get(calUrl.getOuLevel(row.id)).then(function (response) {
                            row.level = response.data.level - 1;
                        }))
                    });

                    axios.all(promises).then(function () {
                        this.setState({rows: rows});
                    }.bind(this));

                    if (rows.length == 1 && rows[0].id === mohId) {
                        axios.get(calUrl.getChildrenUrl(mohId), calUrl.getConfig())
                            .then(function (ous) {
                                axios.get(calUrl.getRowUrl(props.oriHead, calOrgan.getOrganisations(ous.data['children']),
                                    calPeriod.generatePeriod(props.periods)), calUrl.getConfig())
                                    .then(function (provinces) {
                                        var rows = calRow.getRows(provinces.data, props.oriHead);
                                        this.addChildren(mohId, rows);
                                    }.bind(this))
                            }.bind(this));
                    }
                }.bind(this))
        }.bind(this));
    }

    changeToEpiWeek(week) {
        let CALENDAR_FORMAT = 'DD/MM/YYYY';
        let WEEK_FORMAT = 'YYYYW';
        let week_start = moment(week, WEEK_FORMAT).add(-1, 'day').format(CALENDAR_FORMAT);
        let week_end = moment(week, WEEK_FORMAT).add(5, 'day').format(CALENDAR_FORMAT);

        return ' (' + week_start + ' to ' + week_end + ')';
    }

    fetchWeekRows(oriHead, periods, ou) {
        axios.get(calUrl.getWeekRowUrl(oriHead, calPeriod.generatePeriod(periods), ou.id), calUrl.getConfig())
            .then((res) => {
                let rows = calRow.getRows(res.data, oriHead, 'pe').map((row) => {
                    row.name += this.changeToEpiWeek(row.name);
                    return {...row, level: DEFAULT_TEXT_LEVEL}
                });

                this.setState({rows})
            })
    }

    fetchWeekRowsProps(props) {
        let mohId = 'MOH12345678';

        axios.get(calUrl.getWeekRowUrl(props.oriHead, calPeriod.generatePeriod(props.periods), mohId), calUrl.getConfig())
            .then((res) => {
                let rows = calRow.getRows(res.data, props.oriHead, 'pe').map((row) => {
                    row.name += this.changeToEpiWeek(row.name);
                    return {...row, level: DEFAULT_TEXT_LEVEL}
                });

                this.setState({rows})
            })
    }

    addChildren = (id, children) => {
        let rows = _.cloneDeep(this.state.rows);
        calRow.appendChildren(rows, id, children);
        this.setState({rows: rows});
    };

    hasChildren = (id) => {
        return calRow.hasChildren(this.state.rows, id);
    };

    tableToExcel() {
        let uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
                'xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
                'xmlns="http://www.w3.org/TR/REC-html40">' +
                '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">' +
                '<head>' +
                '<!--[if gte mso 9]>' +
                '<xml>' +
                '<style> table, td {border: thin solid black} table {border-collapse:collapse}</style>' +
                '<x:ExcelWorkbook>' +
                '<x:ExcelWorksheets><x:ExcelWorksheet>' +
                '<x:Name>{worksheet}</x:Name>' +
                '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>' +
                '</x:ExcelWorksheet></x:ExcelWorksheets>' +
                '</x:ExcelWorkbook></xml><![endif]-->' +
                '</head>' +
                '<body><table>{table}</table></body>' +
                '</html>',
            base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)))
            },
            format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                    return c[p];
                })
            };
        return function (table, name) {
            let ctx = {worksheet: name || 'Worksheet', table: table.innerHTML};
            return uri + base64(format(template, ctx));
        }
    }

    exportTable = () => {
        if (this.reportingTable) {
            let toExcel = this.tableToExcel();
            let periods = this.props.periods;
            let title = periods.length > 1 ? periods[0] + "-" + periods[periods.length - 1] + "-" + this.props.currentCategory : periods[0] + "-" + this.props.currentCategory;
            let a = document.createElement('a');
            a.download = title + '.xls';
            a.href = toExcel(this.reportingTable, title);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    render() {
        return (
            <div className={ css.content }>
                <div className={ css.changeScreenLabel }>
                    <ToolBoxLink active={this.props.currentCategory == 'location'}
                                 label={this.props.d2.i18n.getTranslation('location')} icon='location_city'
                                 onClick={() => this.props.changeCategory('location')}/>
                    <Link to='/comments'>
                        <ToolBoxLink label={this.props.d2.i18n.getTranslation('comments')} icon='comment'/>
                    </Link>
                    <ToolBoxLink active={this.props.currentCategory == 'week'}
                                 label={this.props.d2.i18n.getTranslation('time_series')} icon='date_range'
                                 onClick={() => this.props.changeCategory('week')}/>
                    <Link to='/ops'>
                        <ToolBoxLink label={this.props.d2.i18n.getTranslation('ops_indicator')} icon='assignment'/>
                    </Link>
                    <Link to='/message'>
                        <ToolBoxLink label={this.props.d2.i18n.getTranslation('message')} icon='note'/>
                    </Link>
                </div>

                <div className={ css.divTable }>

                    <div className={ css.tableContainer } onScroll={this.handleScroll}>

                        <div className={ css.divLeft }>
                            <div className={ css.divLeftThead }>
                                <table className={ css.ReportingTable } ref={(ref) => this.reportingTable = ref}>
                                    <ReportingSingleHead spans={calSpan.calculateSpan(this.props.head)}
                                                         currentCategory={this.props.currentCategory}/>
                                </table>
                            </div>
                        </div>

                        <div className={ css.divRight }>
                            <div className={ css.divRightThead }>
                                <table className={ css.ReportingTableCopy }
                                       ref={(ref) => this.reportingTable = ref}>
                                    <ReportingHead spans={calSpan.calculateSpan(this.props.head)}
                                                   currentCategory={this.props.currentCategory}/>
                                </table>
                            </div>

                            <div className={ css.divRightTbody }>
                                <table className={ css.ReportingTable } ref={(ref) => this.reportingTable = ref}>
                                    <ReportingHead spans={calSpan.calculateSpan(this.props.head)}
                                                   currentCategory={this.props.currentCategory}/>
                                    <ReportingBody data={this.state.rows} oriHead={this.props.oriHead}
                                                   periods={this.props.periods}
                                                   addChildren={this.addChildren}
                                                   hasChildren={this.hasChildren}
                                                   showChildren={this.props.showChildren}
                                                   leftDistance={this.state.leftDistance}
                                    />
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

    handleScroll = (event) => {
        if (event.target.scrollLeft > 0) {
            this.setState({
                leftDistance: event.target.scrollLeft
            });
        } else if (event.target.scrollLeft = 0) {
            this.setState({
                leftDistance: 0
            });
        }
    };

    componentWillReceiveProps(props) {
        // this.setState({rows: []});
        if (props.currentCategory == 'location') {
            this.fetchRows(props);
        }

        if (props.currentCategory == 'week') {
            this.fetchWeekRowsProps(props);
        }
    }
}

export default ReportingTable;
