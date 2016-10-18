import React from 'react';
import moment from 'moment';
import DatePicker from "react-toolbox/lib/date_picker";
import FontIcon from 'react-toolbox/lib/font_icon';
import _ from 'lodash';

import css from './index.scss'

export default class DatePickerBar extends React.Component {
    static defaultProps = {
        label: '',
        value: null,
        minDate: null,
        maxDate: null,
        onChange: _.noop,
        onClean: _.noop
    };

    static contextTypes = {
        d2: React.PropTypes.object
    };

    render() {
        console.log("test",this.context.d2);
        const formatDate = (date) => `${moment(date).format('D MMMM YYYY')} - Week ${moment(date).format('ww')}`;
        const { label, value, minDate, maxDate, onChange, onClean } = this.props;

        return (
            <div>
                <DatePicker icon="event"
                            inputFormat={formatDate}
                            sundayFirstDayOfWeek
                            autoOk
                            label={label}
                            value={value}
                            minDate={minDate}
                            maxDate={maxDate}
                            onChange={onChange}
                >
                    { this.props.value !== null &&
                    <FontIcon className={ css.clear } onClick={ onClean }>clear</FontIcon> }
                </DatePicker>
            </div>
        )
    }
}
