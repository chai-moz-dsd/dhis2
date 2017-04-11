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
 * Created by wbwang on 10/04/2017.
 */
public class HighLightValidationProcessor {
    private Map<ValidationRuleType, HighLightValidation> highLightValidationMap = new HashMap<>();

    private HighLightValidationProcessor() {
        highLightValidationMap.put(ValidationRuleType.DEFAULT, new HighLightSimpleRuleValidation());
        highLightValidationMap.put(ValidationRuleType.MALARIACASEINYEARS, new HighLightMalariaValidation());
        highLightValidationMap.put(ValidationRuleType.SARAMPOCASEINMONTHS, new HighLightSarampoValidation());
        highLightValidationMap.put(ValidationRuleType.DISENTERIACASEINYEARS, new HighLightDisenteriaValidation());
        highLightValidationMap.put(ValidationRuleType.MENINGITEINCREASEDINWEEKS, new HighLightMeningiteValidation());
    }

    private static class HighLightValidationHelper {
        private static final HighLightValidationProcessor INSTANCE = new HighLightValidationProcessor();
    }

    public static HighLightValidationProcessor getInstance() {
        return HighLightValidationHelper.INSTANCE;
    }

    public boolean validate(List<Object> row,
                            I18nManager i18nManager,
                            ValidationRuleService validationRuleService,
                            DataQueryParams params,
                            ValidationRule rule,
                            Collection<OrganisationUnit> organisationUnits) {

        ValidationRuleType validationRuleType = ValidationRuleType.valueOf(rule.getAdditionalRuleType().toUpperCase());
        if (!highLightValidationMap.containsKey(validationRuleType)) {
            return false;
        }

        HighLightValidation highLightValidation = highLightValidationMap.get(validationRuleType);
        return highLightValidation.validate(row,
                i18nManager,
                validationRuleService,
                params,
                rule,
                organisationUnits);
    }
}
