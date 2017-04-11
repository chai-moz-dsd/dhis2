package org.hisp.dhis.webapi.controller.highlight;


import java.util.*;

import org.hisp.dhis.analytics.DataQueryParams;
import org.hisp.dhis.validation.ValidationRule;
import org.hisp.dhis.organisationunit.OrganisationUnit;
import org.hisp.dhis.validation.ValidationRuleService;
import org.hisp.dhis.i18n.I18nManager;
import org.hisp.dhis.validation.ValidationResult;
import org.hisp.dhis.validation.ValidationRuleGroup;
import org.hisp.dhis.period.Period;

/**
 * Created by wbwang on 09/04/2017.
 */
public class HighLightMeningiteValidation extends HighLightValidationService {

    public boolean validate(List<Object> row,
                            I18nManager i18nManager,
                            ValidationRuleService validationRuleService,
                            DataQueryParams params,
                            ValidationRule rule,
                            Collection<OrganisationUnit> organisationUnits) {
        String additionalRuleExpression = rule.getAdditionalRule();
        int times = Integer.valueOf(additionalRuleExpression.split("\n")[0].split(":")[1], 10);
        int weeks = Integer.valueOf(additionalRuleExpression.split("\n")[1].split(":")[1], 10);

        int currentWeek = Integer.valueOf(((Period) ((DataQueryParams) params).getFilterPeriods().get(0)).getIsoDate().split("W")[1], 10);
        int currentYear = Integer.valueOf(((Period) ((DataQueryParams) params).getFilterPeriods().get(0)).getIsoDate().split("W")[0], 10);

        Date startDate = calculateStartDate(weeks, 0, currentWeek, currentYear);
        Date endDate = ((Period) params.getFilterPeriods().get(0)).getEndDate();

        for (ValidationRuleGroup group : rule.getGroups()) {
            for (OrganisationUnit org : organisationUnits) {
                Collection<OrganisationUnit> orgUnits = new ArrayList<OrganisationUnit>();
                orgUnits.add(org);

                List<ValidationResult> validationResults = new ArrayList<>(validationRuleService.validate(
                        startDate,
                        endDate,
                        orgUnits,
                        null,
                        group,
                        false,
                        i18nManager.getI18nFormat()));

                if (validationResults.size() == weeks) {
                    boolean increasedFlag = false;
                    double diseaseNum = 0.0;

                    for (ValidationResult result : validationResults) {
                        if (result.getLeftsideValue() < times * diseaseNum) {
                            increasedFlag = false;
                            break;
                        }

                        increasedFlag = true;
                        diseaseNum = result.getLeftsideValue();
                    }

                    if (increasedFlag) {
                        return true;
                    }
                }
            }

        }

        return false;

    }
}
