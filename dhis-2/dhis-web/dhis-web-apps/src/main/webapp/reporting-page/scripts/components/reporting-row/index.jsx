import React from "react";
import css from "./index.scss";

var HIDE_ICON_CLASS = "glyphicon glyphicon-triangle-right";
var SHOW_ICON_CLASS = "glyphicon glyphicon-triangle-bottom";

class ReportingRow extends React.Component {
    constructor(props) {
        super(props);
    }

    static get defaultProps() {
        return {
            showChildren: {},
            row: {id: '', name: '', values: []}
        }
    };

    render() {
        var id = this.props.row.id;
        var name = this.props.row.name;
        const levelStyle = ['primary', 'secondary', 'tertiary'];
        const rowStyle = levelStyle[this.props.row.level];
        const isLoading = this.props.isLoading[name];
        const isHighlightRow = this.props.highlightRows.indexOf(id) != -1 ? true : false;
        const style = {
            position: 'absolute',
            left: this.props.leftDistance,
            height: '23px',
            width: '200px',
            overflow: 'hidden'
        };

        return (
            <tr className={(css[rowStyle] || css['default']) + ' ReportingRow'}>
                <td className={ (`${(css[rowStyle + 'Title'] || '')} ${css[rowStyle + 'Color']} ${(isHighlightRow ? css.highlightRow : '')} ${css.rowName} `)}
                    style={ style }
                    onClick={this.handleClick.bind(this, id, name)}>
                    { !!rowStyle &&
                    <i className={this.getClassName(this.props.row.name) + ' ' + css.icon}/> }
                    {this.props.row.name}
                    <span className={`${css.loadingWrapper} ${(isLoading ? css.loading : '')}`}/>
                </td>
                {
                    this.props.row.values.map(function (column, index) {
                        return <td key={index}
                                   className={`${(isHighlightRow ? css.highlightRow : (column.highlight ? css.highlight : ''))}`}
                                   onClick={this.handleClickNormalCell.bind(this, id)}>
                            {column.value}
                        </td>;
                    }.bind(this))
                }
            </tr>
        );
    }

    handleClick(id, name) {
        this.props.onClick(id, name);
    }

    handleClickNormalCell(id) {
        this.props.highlightClick(id);
    }

    getClassName(name) {
        if (!this.props.showChildren[name] || this.props.showChildren[name] == undefined) {
            return HIDE_ICON_CLASS;
        }

        return SHOW_ICON_CLASS;
    }
}

export default  ReportingRow;
