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
public class HighLightMalariaValidation extends HighLightValidationService {

    private boolean checkMalariaResultsForCustomizedRule(int stddevTimes, List<ValidationResult> currentWeekResults, List<ValidationResult> previousYearsResults) {
        double totalDiseaseNum = 0.0;
        for (ValidationResult previousYearsResult : previousYearsResults) {
            totalDiseaseNum += previousYearsResult.getLeftsideValue();
        }

        double averageDiseaseNum = totalDiseaseNum / previousYearsResults.size();

        double powDiseaseNum = 0.0;
        for (ValidationResult previousYearsResult : previousYearsResults) {
            powDiseaseNum += Math.pow(Math.abs(previousYearsResult.getLeftsideValue() - averageDiseaseNum), 2);
        }

        double stdDevDiseaseNum = Math.sqrt(powDiseaseNum / previousYearsResults.size());

        double recentWeeksDiseaseNum = 0.0;
        for (ValidationResult currentWeekResult : currentWeekResults) {
            recentWeeksDiseaseNum += currentWeekResult.getLeftsideValue();
        }

        if (recentWeeksDiseaseNum > averageDiseaseNum + stddevTimes * stdDevDiseaseNum) {
            return true;
        }
        return false;
    }


    public boolean validate(List<Object> row,
                            I18nManager i18nManager,
                            ValidationRuleService validationRuleService,
                            DataQueryParams params,
                            ValidationRule rule,
                            Collection<OrganisationUnit> organisationUnits) {
        String additionalRuleExpression = rule.getAdditionalRule();
        int earlyWeeks = Integer.valueOf(additionalRuleExpression.split("\n")[0].split(":")[1], 10);
        int afterWeeks = Integer.valueOf(additionalRuleExpression.split("\n")[1].split(":")[1], 10);
        int pastYears = Integer.valueOf(additionalRuleExpression.split("\n")[2].split(":")[1], 10);
        int stddevTimes = Integer.valueOf(additionalRuleExpression.split("\n")[3].split(":")[1], 10);

        int currentWeek = Integer.valueOf(((Period) ((DataQueryParams) params).getFilterPeriods().get(0)).getIsoDate().split("W")[1], 10);
        int currentYear = Integer.valueOf(((Period) ((DataQueryParams) params).getFilterPeriods().get(0)).getIsoDate().split("W")[0], 10);

        Date startDate = calculateStartDate(earlyWeeks, afterWeeks, currentWeek, currentYear);
        Date endDate = ((Period) params.getFilterPeriods().get(0)).getEndDate();

        for (ValidationRuleGroup group : rule.getGroups()) {

            for (OrganisationUnit org : organisationUnits) {

                Collection<OrganisationUnit> orgUnits = new ArrayList<OrganisationUnit>();
                orgUnits.add(org);

                List<ValidationResult> currentWeekResults = new ArrayList<>(validationRuleService.validate(
                        startDate,
                        endDate,
                        orgUnits,
                        null,
                        group,
                        false,
                        i18nManager.getI18nFormat()));

                if (currentWeekResults.isEmpty()) {
                    continue;
                }

                List<ValidationResult> previousYearsResults = new ArrayList<>();

                for (int i = 1; i < pastYears; i++) {
                    startDate = calculateStartDate(earlyWeeks, 0, currentWeek, currentYear - i);
                    endDate = calculateEndDate(0, afterWeeks, currentWeek, currentYear - i);

                    previousYearsResults.addAll(validationRuleService.validate(
                            startDate,
                            endDate,
                            orgUnits,
                            null,
                            group,
                            false,
                            i18nManager.getI18nFormat()));

                }

                if (previousYearsResults.isEmpty()) {
                    continue;
                }

                if (checkMalariaResultsForCustomizedRule(stddevTimes, currentWeekResults, previousYearsResults))
                    return true;

            }

        }

        return false;

    }
}
