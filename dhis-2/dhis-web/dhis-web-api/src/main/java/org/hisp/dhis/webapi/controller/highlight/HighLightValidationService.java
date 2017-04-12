package org.hisp.dhis.webapi.controller.highlight;

import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.hisp.dhis.analytics.*;

import org.hisp.dhis.analytics.DataQueryParams;
import org.hisp.dhis.validation.ValidationRule;
import org.hisp.dhis.organisationunit.OrganisationUnit;
import org.hisp.dhis.validation.ValidationRuleService;
import org.hisp.dhis.i18n.I18nManager;
import org.hisp.dhis.validation.ValidationResult;
import org.hisp.dhis.validation.ValidationRuleGroup;
import org.hisp.dhis.period.Period;
import org.hisp.dhis.period.WeeklyPeriodType;

/**
 * Created by wbwang on 11/04/2017.
 */
public abstract class HighLightValidationService implements HighLightValidation {
    protected Calendar initCalendar(int currentWeek, int currentYear) {
        Calendar cal = Calendar.getInstance();
        cal.setMinimalDaysInFirstWeek(4);
        cal.set(currentYear, 1, 1);
        cal.set(Calendar.WEEK_OF_YEAR, currentWeek);
        cal.setFirstDayOfWeek(Calendar.MONDAY);
        return cal;
    }

    protected Date calculateStartDate(int earlyWeeks, int afterWeeks, int currentWeek, int currentYear) {
        Calendar cal = initCalendar(currentWeek, currentYear);

        cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
        cal.add(Calendar.DAY_OF_YEAR, (-1 * (earlyWeeks + afterWeeks)) * 7);
        return cal.getTime();
    }

    protected Date calculateEndDate(int earlyWeeks, int afterWeeks, int currentWeek, int currentYear) {
        Calendar cal = initCalendar(currentWeek, currentYear);

        cal.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
        cal.add(Calendar.DAY_OF_YEAR, (1 * (earlyWeeks + afterWeeks)) * 7);
        return cal.getTime();
    }
}
