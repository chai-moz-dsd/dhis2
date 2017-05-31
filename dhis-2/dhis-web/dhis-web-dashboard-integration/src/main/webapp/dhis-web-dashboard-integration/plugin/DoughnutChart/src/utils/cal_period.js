import epi from './cal-epi';
import moment from 'moment';
moment.locale('moz');

var _ = {
    each: require('lodash/each')
};

const FORMAT = 'YYYY-MM-DD';

function generateWeek(tempDate) {
    return tempDate.weekYear() + 'W' + tempDate.week()
}

module.exports = {
    getWeekRange: function (dateRange) {
        const startDate = moment(dateRange.startDate);
        const endDate = moment(dateRange.endDate);
        if (startDate.isAfter(endDate)) {
            return ['THIS_YEAR'];
        }

        let epiStartWeek = epi(startDate.format(FORMAT));
        let epiEndWeek = epi(endDate.format(FORMAT));

        if (epiStartWeek && epiEndWeek) {
            let weekRange = [];
            if (epiStartWeek.year === epiEndWeek.year) {
                for (let week = epiStartWeek.week; week <= epiEndWeek.week; week++) {
                    weekRange.push(`${epiStartWeek.year}W${week}`)
                }
            } else {
                for (let year = epiStartWeek.year; year <= epiEndWeek.year; year++) {
                    if (year === epiStartWeek.year) {
                        for (let week = epiStartWeek.week; week <= 52; week++) {
                            weekRange.push(`${epiStartWeek.year}W${week}`)
                        }
                    } else if (year === epiEndWeek.year) {
                        for (let week = 1; week <= epiEndWeek.week; week++) {
                            weekRange.push(`${epiEndWeek.year}W${week}`);
                        }
                    } else {
                        for (let week = 1; week <= 52; week++) {
                            weekRange.push(`${year}W${week}`);
                        }
                    }
                }
            }

            return weekRange;
        }
        else {
            return ['THIS_YEAR']
        }
    },
    generatePeriod: function (period) {
        return period.join(';')
    }
};
