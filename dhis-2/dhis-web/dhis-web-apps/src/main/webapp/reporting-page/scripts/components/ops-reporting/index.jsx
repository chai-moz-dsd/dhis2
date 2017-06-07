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
import corsRequest from "../../utils/cors-request.js";
import calUrl from "../../utils/cal-url.js";
import calRow from "../../utils/cal-row";
import {DEFAULT_OPS_COLUMN, syncStatusMap, syncTimeStatusMap} from "../../configs";
import css from "./index.scss";
import AppTheme from "../../../theme/theme.js";

const HIDE_ICON_CLASS = "glyphicon glyphicon-triangle-right";
const SHOW_ICON_CLASS = "glyphicon glyphicon-triangle-bottom";

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

export default class OpsReporting extends Component {

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
            rootLocation: [],
            rows: [],
            highlightRows: [],
            leftDistance: 0
        };

        this.generateRows = ::calRow.generateRows
    }

    getChildContext() {
        return {
            d2: this.props.routes[0].d2,
            muiTheme: AppTheme,
        };
    }

    componentDidMount() {
        axios.get(calUrl.getLocationMapping(), calUrl.getConfig())
            .then((mapResult) => {
                const namesMapping = _.get(mapResult, 'data.organisationUnits', []);
                this.setState({
                    startDate: new Date(moment().subtract((DEFAULT_OPS_COLUMN - 1), 'weeks').valueOf()),
                    endDate: new Date(),
                    namesMapping
                }, () => {
                    this.generateReport();
                })
            });
    }

    onChange = (item, value) => {
        this.setState({[item]: value});
    };

    initRootLocation(data) {
        let rootLocation = [];

        for (let item of this.state.regionalList) {
            rootLocation.push({
                name: item.displayName,
                id: item.id,
                level: item.level,
                value: data[item.displayName]
            })
        }

        this.setState({rootLocation})
    }

    generateRowsAndUpdate = (item, childrenList, result) => {
        this.generateRows(item, childrenList, result);
        this.forceUpdate();
    };

    generateReport = () => {
        let startWeek, endWeek;

        if (this.state.startDate && this.state.endDate) {
            startWeek = moment(this.state.startDate);
            endWeek = moment(this.state.endDate);
        } else if (this.state.startDate) {
            startWeek = moment(this.state.startDate);
            endWeek = moment(this.state.startDate).add((DEFAULT_OPS_COLUMN - 1), 'weeks');
        } else if (this.state.endDate) {
            startWeek = moment(this.state.endDate).subtract((DEFAULT_OPS_COLUMN - 1), 'weeks');
            endWeek = moment(this.state.endDate);
        } else {
            startWeek = moment().subtract((DEFAULT_OPS_COLUMN - 1), 'weeks').valueOf();
            endWeek = moment();
        }

        this.setState({
            tableStartDate: startWeek,
            tableEndDate: endWeek
        });

        let regionalList = [];

        axios.get(calUrl.getRelatedOuList(), calUrl.getConfig())
            .then((listResult) => {
                const list = _.get(listResult, 'data.organisationUnits', []);

                list.forEach((item) => {
                    const location = _.find(this.state.namesMapping, item);
                    if (location) {
                        regionalList.push(location)
                    }
                });

                const organisationUnits = regionalList.map(item => {
                    return item.displayName
                }).join(':');

                return axios.get(calUrl.getOuLevel(regionalList[0].id)).then((response) => {
                    regionalList[0].level = response.data.level - 1;

                    return corsRequest.sendCORSRequest('GET', calUrl.getIndicatorInfo(organisationUnits, startWeek.valueOf(), endWeek.valueOf()), (res) => {
                        this.setState({regionalList}, () => {
                            this.initRootLocation(JSON.parse(res));
                        });
                    });
                });
            }).catch((err) => {
            console.log(err.message);
        });
    };

    onClean(key) {
        this.setState({[key]: null})
    }

    renderTimePicker() {
        const {startDate, endDate} = this.state;

        return (
            <div>
                <DatePickerBar
                    label={this.props.routes[0].d2.i18n.getTranslation('start_epi_week')}
                    value={startDate}
                    maxDate={this.state.endDate}
                    onClean={this.onClean.bind(this, 'startDate')}
                    onChange={this.onChange.bind(this, 'startDate')}
                />

                <DatePickerBar
                    label={this.props.routes[0].d2.i18n.getTranslation('end_epi_week')}
                    value={endDate}
                    minDate={this.state.startDate}
                    onClean={this.onClean.bind(this, 'endDate')}
                    onChange={this.onChange.bind(this, 'endDate')}
                />
            </div>
        )
    }

    renderSidebar() {
        return (
            <div className={ css.sidebar + ' col-sm-4 col-md-2' }>
                <div className={ css.head }>{this.props.routes[0].d2.i18n.getTranslation('ops_indicator')}</div>
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
        const startDate = this.state.tableStartDate || new Date(moment().subtract((DEFAULT_OPS_COLUMN - 1), 'weeks'));
        const endDate = this.state.tableEndDate || new Date();

        let startWeek = moment(startDate);
        let endWeek = endDate >= startDate ? moment(endDate) : startDate;

        let headerList = [];
        const i18nForDate = (date) => {
            let dateList = date.split(' ');
            dateList[1] = this.props.routes[0].d2.i18n.getTranslation(dateList[1]);
            return dateList.join(' ');
        };

        while (endWeek >= startWeek) {
            const startDayOfWeek = i18nForDate(endWeek.startOf('week').format('D MMM'));
            const endDayOfWeek = i18nForDate(endWeek.endOf('week').format('D MMM'));

            headerList.push({
                moment: endWeek,
                displayText: `${this.props.routes[0].d2.i18n.getTranslation('week')} ${endWeek.weeks()} (${startDayOfWeek} - ${endDayOfWeek} ${endWeek.weekYear()})`
            });

            endWeek.subtract(1, 'weeks');
        }

        headerList.reverse();
        let thInfo = [];
        let thInfoNum = 0;

        while (thInfoNum < headerList.length) {
            thInfoNum++;
            thInfo = _.concat(thInfo,
                <th>{this.props.routes[0].d2.i18n.getTranslation('sync_status')}</th>,
                <th>{this.props.routes[0].d2.i18n.getTranslation('sync_time')}</th>,
                <th>{this.props.routes[0].d2.i18n.getTranslation('odk_version')}</th>,
                <th>{this.props.routes[0].d2.i18n.getTranslation('comments')}</th>
            )
        }

        return !!headerList.length && (
                <thead>
                <tr>
                    <th rowSpan="2">{this.props.routes[0].d2.i18n.getTranslation('location')}</th>
                    {
                        headerList.map((header, idx) => {
                            return (
                                <th colSpan="3" key={idx}>{header.displayText}</th>,
                                    <th colSpan="4" key={idx}>{header.displayText}</th>
                            )
                        })
                    }
                </tr>
                <tr>
                    { thInfo.map(item => {
                        return item
                    }) }
                </tr>
                </thead>
            )
    }

    renderSingleTableHead() {
        const style = {
            height: '45px'
        };

        return (
                <thead>
                <tr>
                    <th style={ style } rowSpan="2">{this.props.routes[0].d2.i18n.getTranslation('location')}</th>
                </tr>
                </thead>
            )
    }

    fetchChild(item, enableFetch) {
        if (item.showChildren || item.children) {
            item.showChildren = !item.showChildren;
            return this.forceUpdate();
        }

        item.isLoading = true;
        this.forceUpdate();

        axios.get(calUrl.getChildrenUrl(item.id), calUrl.getConfig())
            .then((res) => {
                const list = _.get(res, 'data.children', []);
                const childrenList = [];

                list.forEach((item) => {
                    const location = _.find(this.state.namesMapping, item);
                    if (location) {
                        childrenList.push(location)
                    }
                });

                const organisationUnits = childrenList.map((item) => {
                    return item.displayName;
                }).join(':');
                const startDate = this.state.tableStartDate.valueOf();
                const endDate = this.state.tableEndDate.valueOf();

                if (organisationUnits) {
                    return corsRequest.sendCORSRequest('GET', calUrl.getIndicatorInfo(organisationUnits, startDate, endDate), (res) => {
                        item.isLoading = false;
                        this.forceUpdate();
                        this.generateRowsAndUpdate(item, childrenList, JSON.parse(res))
                    });
                } else {
                    item.showChildren = true;
                    item.isLoading = false;
                    item.children = [];
                    this.forceUpdate();
                }
            }).catch((err) => {
            console.log('err', err);
            item.isLoading = false;
            this.forceUpdate();
        });
    }

    renderValue(level, value = [], rowIdx) {
        let columnList = [];
        const bgColor = {
            '-1': 'sick',
            '0': 'normal',
            '1': 'ok',
        };

        value.forEach((item) => {
            const syncStatus = this.props.routes[0].d2.i18n.getTranslation(syncStatusMap[item.syncStatus]);
            const syncTime = (!item.syncTime.status || item.syncTime.status == '0') ? '' :
                this.props.routes[0].d2.i18n.getTranslation(syncTimeStatusMap[item.syncTime.status]);

            const highlightCss = this.state.highlightRows.indexOf(rowIdx) == -1 ? '' : ' ' + css['highlightRow'];

            columnList = _.concat(columnList,
                <td className={(level == 3 ? css.syncStatus + ' ' + css[bgColor[item.syncStatus]] : '') + highlightCss}
                    onClick={this.handleHilightClick.bind(this, rowIdx)}>
                    {level == 3 ? syncStatus : ''}</td>,
                (
                    <td className={(level == 3 ? css.syncTime : '') + highlightCss}
                        onClick={this.handleHilightClick.bind(this, rowIdx)}>
                        <span
                            className={level == 3 ? css.syncTimeStatus + ' ' + (item.syncTime.status < 0 ? css.mark : '') : ''}>
                            {level == 3 ? syncTime : ''}
                        </span>
                        <span>{level == 3 ? item.syncTime.time : ''}</span>
                    </td>
                ),
                <td className={(level == 3 ? css.ODKVersion : '') + highlightCss}
                    onClick={this.handleHilightClick.bind(this, rowIdx)}>
                    {level == 3 ? item.ODKVersion : ''}
                </td>,
                <td className={(level == 3 ? css.comments : '') + highlightCss}
                    onClick={this.handleHilightClick.bind(this, rowIdx)}>
                    {level == 3 ? item.comments : ''}
                </td>
            )
        });

        return columnList;
    };

    renderTableRows(items, rows) {
        const levelStyle = ['primary', 'secondary', 'tertiary'];

        items.forEach((item) => {
            const rowStyle = levelStyle[item.level];
            const rowIdx = rows.length;
            const highlightCss = this.state.highlightRows.indexOf(rowIdx) == -1 ? '' : ' ' + css['highlightRow'];
            const style = {
                left: this.state.leftDistance,
            };

            rows.push((
                <tr className={(css[rowStyle] || css['default']) + ' ReportingRow'}>
                    <td className={`${(css[rowStyle + 'Title'] || '')} ${css.rowName} ${(item.isLoading ? css.loading : '')} ${highlightCss}`}
                        style={ style }
                        onClick={this.fetchChild.bind(this, item)}>
                        { !!rowStyle && <i className={this.getClassName(item.showChildren) + ' ' + css.icon}/> }
                        {item.name}
                    </td>
                    {this.renderValue(item.level, item.value, rowIdx)}
                </tr>
            ));

            if (item.showChildren) {
                this.renderTableRows(item.children, rows);
            }
        });
    }

    renderTableBody() {
        const rootLocation = this.state.rootLocation;

        return !!rootLocation.length && (
                <tbody>
                {
                    rootLocation.map((items) => {
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

    getClassName(showChildren) {
        if (showChildren) {
            return SHOW_ICON_CLASS;
        }

        return HIDE_ICON_CLASS;
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
                        <ToolBoxLink label={this.props.routes[0].d2.i18n.getTranslation('ops_indicator')} active={true}
                                     icon='assignment'/>
                    </Link>
                    <Link to='/message'>
                        <ToolBoxLink label={this.props.routes[0].d2.i18n.getTranslation('message')}
                                     icon='assignment'/>
                    </Link>
                </div>

                <div className={ css.divTable }>
                    <div className={ css.tableContainer }  onScroll={this.handleScroll}>
                        <div className={ css.divLeft }>
                            <div className={ css.divLeftThead }>
                                <table>
                                    { this.renderSingleTableHead() }
                                </table>
                            </div>
                        </div>

                        <div className={ css.divRight }>
                            <div className={ css.divRightThead }>
                                <table>
                                    { this.renderTableHead() }
                                </table>
                            </div>

                            <div className={ css.divRightTbody }>
                                <table className={ css.ReportingTable }>
                                    { this.renderTableHead() }
                                    { this.renderTableBody() }
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

    render() {
        return (
            <div>
                <HeaderBar lastUpdate={new Date()}/>
                { this.renderSidebar() }
                { this.renderTable() }
            </div>
        )
    }

    handleHilightClick(rowIdx) {
        var rows = this.state.highlightRows;
        if (rows.indexOf(rowIdx) == -1) {
            rows.push(rowIdx);
        } else {
            rows.splice(rows.indexOf(rowIdx), 1);
        }
        this.setState({highlightRows: rows});
    }
}
