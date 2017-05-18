import React from "react";
import axios from "axios";
import ReportingRow from "../reporting-row/index.jsx";
import calRow from "../../utils/cal-row.js";
import calUrl from "../../utils/cal-url.js";
import calOrgan from "../../utils/cal_organisation";
import * as calPeriod from "../../utils/cal_period";

var _ = {
    each: require('lodash/each')
};

class ReportingBody extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: {},
            showChildren: {MoH: true},
            highlightRows: []
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.showChildren !== this.state.showChildren) {
            this.setState({showChildren: nextProps.showChildren});
        }
    }

    render() {
        var rows = this.generateRows(this.props.data, this.state);

        return (
            <tbody className="ReportingBody">
            {
                rows.map(function (row, index) {
                    return <ReportingRow key={index}
                                         row={row}
                                         isLoading={this.state.isLoading}
                                         onClick={this.handleClick}
                                         highlightRows={this.state.highlightRows}
                                         highlightClick={this.handleHighlightClick}
                                         showChildren={this.state.showChildren}
                                         leftDistance={this.props.leftDistance}/>;
                }.bind(this))
            }
            </tbody>
        );
    }

    handleHighlightClick = (id) => {
        var rows = this.state.highlightRows;
        rows.indexOf(id) == -1 ? rows.push(id) : rows.splice(rows.indexOf(id), 1);
        this.setState({highlightRows: rows})
    }

    handleClick = (id, name) => {
        var values = this.state.showChildren;
        values[name] = !this.state.showChildren[name];

        var oriHead = this.props.oriHead;
        var periods = this.props.periods;
        var addChildren = this.props.addChildren;

        this.setState({showChildren: values});

        if (this.props.hasChildren(id)) {
            return;
        }

        this.setState({isLoading: {...this.state.isLoading, [name]: true}});


        axios.get(calUrl.getChildrenUrl(id), calUrl.getConfig())
            .then((ous) => {
                return axios.get(calUrl.getRowUrl(oriHead,
                    calOrgan.getOrganisations(ous.data['children']),
                    calPeriod.generatePeriod(periods)),
                    calUrl.getConfig())
                    .then((provinces) => {
                        var rows = calRow.getRows(provinces.data, oriHead);
                        addChildren(id, rows);
                        this.setState({isLoading: {...this.state.isLoading, [name]: false}});
                    })
            }).catch(() => {
            values[name] = false;
            this.setState({showChildren: values, isLoading: {...this.state.isLoading, [name]: false}});
        });
    };

    generateRows(oriRows, state) {
        var rows = [];

        function generate(data, level = 0) {

            var rowId = data.id;
            var rowName = data.name;
            var rowValue = data.values;
            var showChildren = state.showChildren[rowName];

            rows.push({id: rowId, name: rowName, values: rowValue, level});
            if (showChildren && data.children) {
                level++;
                data.children.map(function (child) {
                    generate(child, level);
                })
            }
        }

        _.each(oriRows, function (oriRow) {
            generate(oriRow, oriRow.level);
        });

        return rows;
    }
}

export default ReportingBody;
