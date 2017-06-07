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
import Location from '../location/index.jsx';

const HIDE_ICON_CLASS = "glyphicon glyphicon-triangle-right";
const SHOW_ICON_CLASS = "glyphicon glyphicon-triangle-bottom";

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
            rootLocation: [],
            rows: [],
            highlightRows: [],
            leftDistance: 0,
            location: null
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
                const date = new Date();
                date.setDate(1);
                this.setState({
                    startDate: date,
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

    generateReport = () => {
        console.log('generate report...')
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
                          onSelect={::this.handleSelectedLocation}/>
            </div>
        )
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

    handleHilightClick(rowIdx) {
        const rows = this.state.highlightRows;
        if (rows.indexOf(rowIdx) === -1) {
            rows.push(rowIdx);
        } else {
            rows.splice(rows.indexOf(rowIdx), 1);
        }
        this.setState({highlightRows: rows});
    }
}
