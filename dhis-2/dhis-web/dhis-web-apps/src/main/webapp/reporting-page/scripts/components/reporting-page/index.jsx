import React from "react";
import axios from "axios";
import HeaderBarComponent from "d2-ui/lib/app-header/HeaderBar";
import headerBarStore$ from "d2-ui/lib/app-header/headerBar.store";
import withStateFrom from "d2-ui/lib/component-helpers/withStateFrom";
import calHead from "../../utils/cal-head";
import calUrl from "../../utils/cal-url.js";
import ReportingTable from "../reporting-table/index.jsx";
import ReportingSidebar from "../reporting-sidebar/index.jsx";
import css from "./index.scss";
import * as calPeriod from "../../utils/cal_period";
import AppTheme from "../../../theme/theme.js";
import { categoryList } from '../../configs';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

class ReportingPage extends React.Component {

    static childContext = {
        d2: React.PropTypes.object,
        muiTheme: React.PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = {
            head: [],
            oriHead: [],
            updatedOriHead: [],
            filter: [],
            periods: ['THIS_YEAR'],
            currentCategory: 'location'
        };

        this.exportTable = this.exportTable.bind(this);
    }

    getChildContext() {
        return {
            d2: this.props.routes[0].d2,
            muiTheme: AppTheme,
        };
    }

    fetchHead() {
        axios.get(calUrl.getIdUrl(), calUrl.getConfig())
            .then(function (response) {
                var mappings = response.data['dataElements'];
                axios.get(calUrl.getHeadUrl(), calUrl.getConfig())
                    .then(function (response) {
                        var oriHead = response.data['dataElementOperands'];
                        var filter = calHead.getFilter(oriHead, mappings);
                        var head = calHead.getHead(oriHead, mappings);
                        this.setState({
                            head: head,
                            oriHead: oriHead,
                            updatedOriHead: oriHead,
                            mappings: mappings,
                            filter: filter
                        });
                    }.bind(this))
            }.bind(this))
    }

    exportTable() {
        this.reportingTable.exportTable();
    }

    onChangeCategory(currentCategory) {
        this.setState({currentCategory})
    }

    updateTable = (data, state) => {
        var status = {};
        var weekRange = calPeriod.getWeekRange(state);
        _.each(data, function (element) {
            if (element.nodes.length > 0) {
                _.each(element.nodes, function (node) {
                    status[[element.text, node.text].join(" ")] = node.state.selected;
                })
            } else {
                status[element.text] = element.state.selected;
            }
        });
        var filteredHead = calHead.updateHead(this.state.oriHead, status);
        this.setState({
            head: calHead.getHead(filteredHead, this.state.mappings),
            updatedOriHead: filteredHead,
            filter: data,
            periods: weekRange
        }, () => {
            if (this.state.currentCategory === 'week') {
                this.reportingTable.fetchWeekRows(filteredHead, weekRange, state.location)
            }
        });
    };

    render() {
        return (
            <div className={ css.ReportingPage }>
                <HeaderBar lastUpdate={new Date()}/>
                <ReportingSidebar filter={this.state.filter} exportTable={this.exportTable}
                                  currentCategory={ this.state.currentCategory }
                                  updateTable={this.updateTable}/>
                <ReportingTable head={this.state.head}
                                oriHead={this.state.updatedOriHead}
                                ref={(ref) => this.reportingTable = ref}
                                currentCategory={ this.state.currentCategory }
                                periods={ this.state.periods}
                                changeCategory={ ::this.onChangeCategory }/>
            </div>
        )
    }

    componentDidMount() {
        const { category } = this.props.location.query;

        if(category && categoryList.indexOf(category) !== -1) {
            this.onChangeCategory(category)
        }

        this.fetchHead();
    }
}

export default ReportingPage;
