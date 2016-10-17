import React from "react";
import {Button} from "react-toolbox/lib/button";
import TreeView from "../../lib/treeview";
import Link from "react-toolbox/lib/link";
import calPeriod from "../../utils/cal_period.js";
import moment from "moment";
import css from "./index.scss";
import DatePickerBar from '../date-picker-bar/index.jsx'
import { categoryTitle, DEFAULT_WEEK_ROWS } from "../../configs";
import Location from '../location/index.jsx';

class ReportingSidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: null,
            endDate: null,
            location: null
        };

        this.initWeekTable = false;
    }

    static get defaultProps() {
        return {
            filter: [],
            currentCategory: 'location'
        }
    };

    ContextTypes = {
        d2: React.PropTypes.object
    };

    componentWillReceiveProps(next) {
        if(this.props.currentCategory !== next.currentCategory) {
            if (next.currentCategory === 'week') {
                this.setState({
                    startDate: new Date(moment().subtract((DEFAULT_WEEK_ROWS - 1), 'weeks').valueOf()),
                    endDate: new Date()
                })
            } else {
                this.setState({ startDate: null, endDate: null });
                this.initWeekTable = false;
            }
        }
    }

    componentDidUpdate() {
        const isCurrentCategory = this.props.currentCategory === 'week';
        const isHasRequestData = this.state.startDate && this.state.endDate && this.state.location;

        if(!this.initWeekTable && isCurrentCategory && isHasRequestData) {
            this.initWeekTable = true;
            this.generateReport()
        }
    }

    handleChange = (item, value) => {
        this.setState({...this.state, [item]: value});
    };

    exportTable = () => {
        this.props.exportTable();
    };

    generateReport = () => {
        this.props.updateTable(this.treeView.state.data, this.state);
    };

    onClean(key) {
        this.setState({[key]: null})
    }

    handleSelectedLocation(location) {
        this.setState({location})
    }

    render() {
        // const d2 = this.props.routes[0].d2;
        // x = d2.i18n.getTranslation('start_epi_week');
        console.log(this.context)
        return (
            <div className={ css.sidebar + ' col-sm-4 col-md-2' }>
                <div className={ css.head }>{ categoryTitle[this.props.currentCategory] }</div>
                <DatePickerBar
                    label='Start epidemiological week'
                    value={this.state.startDate}
                    maxDate={this.state.endDate}
                    onChange={this.handleChange.bind(this, 'startDate')}
                    onClean={this.onClean.bind(this, 'startDate')}
                />
                <DatePickerBar
                    label='End epidemiological week'
                    value={this.state.endDate}
                    minDate={this.state.startDate}
                    onChange={this.handleChange.bind(this, 'endDate')}
                    onClean={this.onClean.bind(this, 'endDate')}
                />
                { this.props.currentCategory == 'week' && ( <Location onSelect={::this.handleSelectedLocation} /> ) }
                <div className={ css.filterName }>Diseases</div>
                <div className={ css.filter }>
                    {
                        !!this.props.filter.length && (<TreeView data={ this.props.filter }
                                                                 color="#000000"
                                                                 selectedIcon={ css.selected }
                                                                 unselectedIcon={ css.unCheck }
                                                                 expandIcon=""
                                                                 collapseIcon=""
                                                                 showBorder={false}
                                                                 ref={(ref) => this.treeView = ref}/>)
                    }
                </div>
                <Button className={ css.reportBtn } label='GENERATE REPORT' neutral={ false }
                        onClick={this.generateReport}/>
                <div className={ css.exportDiv }>
                    <Link onClick={this.exportTable} label="Export data to xls" icon="get_app"/>
                </div>
            </div>
        )
    }
}

export default ReportingSidebar;
