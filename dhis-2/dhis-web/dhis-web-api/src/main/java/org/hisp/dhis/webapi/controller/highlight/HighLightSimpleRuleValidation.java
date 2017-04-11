package org.hisp.dhis.webapi.controller.highlight;

import java.util.Collection;
import java.util.List;

import org.hisp.dhis.analytics.DataQueryParams;
import org.hisp.dhis.validation.ValidationRule;
import org.hisp.dhis.organisationunit.OrganisationUnit;
import org.hisp.dhis.i18n.I18nManager;
import org.hisp.dhis.validation.ValidationRuleService;

import static org.hisp.dhis.system.util.MathUtils.*;


/**
 * Created by wbwang on 09/04/2017.
 */
public class HighLightSimpleRuleValidation extends HighLightValidationService {
    public boolean validate(List<Object> row,
                            I18nManager i18nManager,
                            ValidationRuleService validationRuleService,
                            DataQueryParams params,
                            ValidationRule rule,
                            Collection<OrganisationUnit> organisationUnits) {
        double threshold = Double.valueOf(rule.getRightSide().getExpression());

        return !expressionIsTrue((Double) row.get(2), rule.getOperator(), threshold);
    }
}
