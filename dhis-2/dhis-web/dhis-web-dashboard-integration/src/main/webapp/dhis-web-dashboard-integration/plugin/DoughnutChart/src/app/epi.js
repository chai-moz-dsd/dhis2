import moment from 'moment';

const YEAR = 'year';
const SUNDAY = 0;
const SATURDAY = 3;
const NEXT_SUNDAY = 7;
const WEEKDAYS = 7;
const MAX_EPI_WEEKS_IN_ONE_YEAR = 52;
const INVALID_VALUE = -1;

export default function epi(dateStr, format = 'YYYY-MM-DD') {
  const date = moment(dateStr, format);
  if (!date.isValid()) {
    throw new Error('date is invalid');
  }

  moment.locale('en');

  const year = date.year();
  const firstEpiWeekDay = getFirstEpiWeekDay(date);

  if (date.isSameOrAfter(firstEpiWeekDay)) {
    let duration;
    if (firstEpiWeekDay.dayOfYear() === 1) {
      duration = date.dayOfYear() - firstEpiWeekDay.dayOfYear() + firstEpiWeekDay.day();
    } else {
      duration = date.dayOfYear() - firstEpiWeekDay.dayOfYear();
    }
    const week = parseInt(duration / WEEKDAYS, 10) + 1;

    if (week > MAX_EPI_WEEKS_IN_ONE_YEAR) {
      const firstDayNextYear = moment({year: year + 1});
      const firstEpiWeekDayNextYear = getFirstEpiWeekDay(firstDayNextYear);

      return firstDayNextYear.isSame(firstEpiWeekDayNextYear) ?
      {year: year + 1, week: 1} : {year: INVALID_VALUE, week: INVALID_VALUE};
    }

    return {year, week};
  }

  const firstDayLastYear = moment({year: year - 1});
  const firstEpiWeekDayLastYear = getFirstEpiWeekDay(firstDayLastYear);

  return firstDayLastYear.isSame(firstEpiWeekDayLastYear) ?
  {year: INVALID_VALUE, week: INVALID_VALUE} : {year: year - 1, week: 52};
}

function containsSaturdayInFirstWeek(date) {
  const firstDay = date.clone().startOf(YEAR);

  return firstDay.day() >= SUNDAY && firstDay.day() <= SATURDAY;
}

function getFirstEpiWeekDay(oriDate) {
  const date = oriDate.clone();

  if (containsSaturdayInFirstWeek(date)) {
    return date.startOf(YEAR);
  }

  return date.startOf(YEAR).day(NEXT_SUNDAY);
}
