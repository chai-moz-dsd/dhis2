import React from 'react';
import moment from 'moment';
import DatePicker from "react-toolbox/lib/date_picker";
import FontIcon from 'react-toolbox/lib/font_icon';
import _ from 'lodash';
import epi from '../../utils/cal-epi';

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

    i18nForDate(date, d2) {
        const formatDate = `${moment(date).format('D MMMM YYYY')}`;
        let dateList = formatDate.split(' ');
        dateList[1] = d2.i18n.getTranslation(dateList[1]);

        return ' '.join(dateList);
    }

    render() {
        // moment.locale(this.context.d2.i18n.getTranslation('locale'));
        const formatWeek = (date) => this.context.d2.i18n.getTranslation('week') + ` ${epi(date).week}`;
        const weekAndDate = formatWeek + ', ' + i18nForDate(date, d2);
        const {label, value, minDate, maxDate, onChange, onClean} = this.props;

        return (
            <div>
                <DatePicker icon="event"
                            inputFormat={weekAndDate}
                            sundayFirstDayOfWeek
                            autoOk
                            label={label}
                            value={value}
                            minDate={minDate}
                            maxDate={maxDate}
                            onChange={onChange}
                            locale={this.context.d2.i18n.getTranslation('locale')}
                >
                    { this.props.value !== null &&
                    <FontIcon className={ css.clear } onClick={ onClean }>clear</FontIcon> }
                </DatePicker>
            </div>
        )
    }
}
