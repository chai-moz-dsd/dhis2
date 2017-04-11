package org.hisp.dhis.webapi.controller.highlight;


import org.hisp.dhis.validation.ValidationRuleType;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
 * Created by wbwang on 09/04/2017.
 */
public class HighLightValidationController {

    private boolean isPeriodOneWeek(DataQueryParams params) {
        return (params.getFilterPeriods().size() == 1)
                && (((Period) params.getFilterPeriods().get(0)).getPeriodType().getName().equals(WeeklyPeriodType.NAME));
    }

    public boolean applyValidate(List<Object> row,
                                 I18nManager i18nManager,
                                 ValidationRuleService validationRuleService,
                                 String ruleType,
                                 final DataQueryParams params,
                                 final ValidationRule rule,
                                 final Collection<OrganisationUnit> organisationUnits) {
        if ((ValidationRuleType.valueOf(ruleType) != ValidationRuleType.DEFAULT) && !isPeriodOneWeek(params)) {
            return false;
        }

        return HighLightValidationProcessor.getInstance().validate(row,
                i18nManager,
                validationRuleService,
                params,
                rule,
                organisationUnits);
    }
}
