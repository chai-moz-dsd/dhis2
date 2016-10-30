package org.hisp.dhis.webapi.controller;

/*
 * Copyright (c) 2004-2016, University of Oslo
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * Neither the name of the HISP project nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import java.util.List;

import org.hisp.dhis.analytics.*;
import org.hisp.dhis.common.DisplayProperty;
import org.hisp.dhis.common.Grid;
import org.hisp.dhis.common.IdScheme;
import org.hisp.dhis.common.IdentifiableProperty;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.dhis.common.*;
import org.hisp.dhis.common.cache.CacheStrategy;
import org.hisp.dhis.i18n.I18nManager;
import org.hisp.dhis.organisationunit.OrganisationUnit;
import org.hisp.dhis.organisationunit.OrganisationUnitService;
import org.hisp.dhis.system.grid.GridUtils;
import org.hisp.dhis.validation.ValidationResult;
import org.hisp.dhis.validation.ValidationRule;
import org.hisp.dhis.validation.ValidationRuleGroup;
import org.hisp.dhis.validation.ValidationRuleService;
import org.hisp.dhis.webapi.mvc.annotation.ApiVersion;
import org.hisp.dhis.webapi.utils.ContextUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import org.hisp.dhis.analytics.AnalyticsService;
import org.hisp.dhis.dataelement.DataElementService;
import org.hisp.dhis.dataelement.DataElement;
import org.hisp.dhis.period.Period;
import org.hisp.dhis.period.WeeklyPeriodType;

import static org.hisp.dhis.system.util.MathUtils.*;

import org.hisp.dhis.expression.Operator;

import javax.servlet.http.HttpServletResponse;
import java.util.*;

import static org.hisp.dhis.common.DimensionalObjectUtils.getItemsFromParam;

/**
 * @author Lars Helge Overland
 */
@Controller
@ApiVersion({ApiVersion.Version.DEFAULT, ApiVersion.Version.ALL})
public class AnalyticsController {
    private static final String RESOURCE_PATH = "/analytics";

    private static final Log log = LogFactory.getLog(AnalyticsController.class);

    private static final String SIMPLE_RULE_TYPE = "Default";
    private static final String SARAMPO_CASE_IN_MONTHS = "SarampoCaseInMonths";
    private static final String MENINGITE_CASE_INCREASED_BY_TIMES = "MeningiteIncreasedInWeeks";
    private static final String MALARIA_CASE_IN_YEARS = "MalariaCaseInYears";
    private static final String DISENTERIA_CASE_IN_YEARS = "DisenteriaCaseInYears";


    @Autowired
    private DataQueryService dataQueryService;

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private DataElementService dataElementService;

    @Autowired
    private ContextUtils contextUtils;

    @Autowired
    private I18nManager i18nManager;

    @Autowired
    private ValidationRuleService validationRuleService;

    @Autowired
    private OrganisationUnitService organisationUnitService;

    // -------------------------------------------------------------------------
    // Resources
    // -------------------------------------------------------------------------

    @RequestMapping(value = RESOURCE_PATH, method = RequestMethod.GET, produces = {"application/json", "application/javascript"})
    public String getJson( // JSON, JSONP
                           @RequestParam Set<String> dimension,
                           @RequestParam(required = false) Set<String> filter,
                           @RequestParam(required = false) AggregationType aggregationType,
                           @RequestParam(required = false) String measureCriteria,
                           @RequestParam(required = false) boolean skipMeta,
                           @RequestParam(required = false) boolean skipData,
                           @RequestParam(required = false) boolean skipRounding,
                           @RequestParam(required = false) boolean completedOnly,
                           @RequestParam(required = false) boolean hierarchyMeta,
                           @RequestParam(required = false) boolean ignoreLimit,
                           @RequestParam(required = false) boolean hideEmptyRows,
                           @RequestParam(required = false) boolean showHierarchy,
                           @RequestParam(required = false) DisplayProperty displayProperty,
                           @RequestParam(required = false) IdentifiableProperty outputIdScheme,
                           @RequestParam(required = false) IdScheme inputIdScheme,
                           @RequestParam(required = false) String approvalLevel,
                           @RequestParam(required = false) Date relativePeriodDate,
                           @RequestParam(required = false) String userOrgUnit,
                           @RequestParam(required = false) String columns,
                           @RequestParam(required = false) String rows,
                           Model model,
                           HttpServletResponse response) throws Exception {
        DataQueryParams params = dataQueryService.getFromUrl(dimension, filter, aggregationType, measureCriteria, skipMeta, skipData, skipRounding, completedOnly, hierarchyMeta,
                ignoreLimit, hideEmptyRows, showHierarchy, displayProperty, outputIdScheme, inputIdScheme, approvalLevel, relativePeriodDate, userOrgUnit, i18nManager.getI18nFormat());

        contextUtils.configureResponse(response, ContextUtils.CONTENT_TYPE_JSON, CacheStrategy.RESPECT_SYSTEM_SETTING);
        Grid grid = analyticsService.getAggregatedDataValues(params, getItemsFromParam(columns), getItemsFromParam(rows));

        highLightForDataValues(params, grid);

        model.addAttribute("model", grid);
        model.addAttribute("viewClass", "detailed");
        return "grid";
    }

    private void highLightForDataValues(DataQueryParams params, Grid grid) {
        List<ValidationRule> rules = validationRuleService.getAllValidationRules();

        List<List<Object>> allRows = grid.getRows();
        List<Object> r = new ArrayList<>();
//        r.add("ma97d9c69c5");
//        r.add("MOH12345678");
//        r.add(3.0);
//        allRows.add(r);

        for (List<Object> row : allRows) {
            String highLight = "false";
            String diseaseId = (String) row.get(0);

            String ou = grid.getHeaders().get(1).getName().equals("ou") ? (String) row.get(1) : "MOH12345678";
            OrganisationUnit organisationUnit = organisationUnitService.getOrganisationUnit(ou);
            Collection<OrganisationUnit> organisationUnits =
                    organisationUnitService.getOrganisationUnitWithChildren(organisationUnit.getId());

            try {
                for (ValidationRule rule : rules) {
                    if (!isValidRuleForDisease(diseaseId, rule)) {
                        continue;
                    }

                    boolean shouldHighLight = validateDisease(params, row, organisationUnits, rule);
                    highLight = shouldHighLight ? "highlight.true" : "highlight.false";

                    if (shouldHighLight) {
                        break;
                    }
                }
                row.add(highLight);
            }catch (Exception e){
                row.add(e);
            }

        }
    }


    private boolean validateDisease(DataQueryParams params, List<Object> row,
                                    Collection<OrganisationUnit> organisationUnits, ValidationRule rule) {


        switch (rule.getAdditionalRuleType()) {
            case SIMPLE_RULE_TYPE:
                Operator operator = rule.getOperator();
                double threshold = Double.valueOf(rule.getRightSide().getExpression());

                return !expressionIsTrue((Double) row.get(2), operator, threshold);
            case SARAMPO_CASE_IN_MONTHS:
                return isPeriodOneWeek(params) && validateSarampoCaseInWeeks(params, rule, organisationUnits);

            case MENINGITE_CASE_INCREASED_BY_TIMES:
                return isPeriodOneWeek(params) && validateMeningiteCaseIncreasedByTimes(params, rule, organisationUnits);

            case MALARIA_CASE_IN_YEARS:
                return isPeriodOneWeek(params) && validateMalariaCaseInYears(params, rule, organisationUnits);

            case DISENTERIA_CASE_IN_YEARS:
                return isPeriodOneWeek(params) && validateDisenteriaCaseInYears(params, rule, organisationUnits);

            default:
                return false;
        }
    }

    private boolean isValidRuleForDisease(String diseaseId, ValidationRule rule) {
        return rule.getLeftSide().getExpression().contains(diseaseId);
    }

    private boolean isPeriodOneWeek(DataQueryParams params) {
        return (params.getFilterPeriods().size() == 1)
                && (((Period) params.getFilterPeriods().get(0)).getPeriodType().getName().equals(WeeklyPeriodType.NAME));
    }

    private boolean validateSarampoCaseInWeeks(DataQueryParams params, ValidationRule rule,
                                               Collection<OrganisationUnit> organisationUnits) {
        String additionalRuleExpression = rule.getAdditionalRule();
        int weeks = Integer.valueOf(additionalRuleExpression.split("\r\n")[0].split(":")[1], 10);
        int threshold = Integer.valueOf(additionalRuleExpression.split("\r\n")[1].split(":")[1], 10);

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

                if (validationResults.isEmpty()) {
                    continue;
                }

                double diseaseNum = 0.0;
                for (ValidationResult result : validationResults) {
                    diseaseNum += result.getLeftsideValue();
                }

                if (diseaseNum >= threshold) {
                    return true;
                }
            }
        }

        return false;
    }

    private boolean validateMeningiteCaseIncreasedByTimes(DataQueryParams params, ValidationRule rule,
                                                          Collection<OrganisationUnit> organisationUnits) {
        String additionalRuleExpression = rule.getAdditionalRule();
        int times = Integer.valueOf(additionalRuleExpression.split("\r\n")[0].split(":")[1], 10);
        int weeks = Integer.valueOf(additionalRuleExpression.split("\r\n")[1].split(":")[1], 10);

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

    private boolean validateDisenteriaCaseInYears(DataQueryParams params, ValidationRule rule,
                                                  Collection<OrganisationUnit> organisationUnits) {
        String additionalRuleExpression = rule.getAdditionalRule();
        int years = Integer.valueOf(additionalRuleExpression.split("\r\n")[0].split(":")[1], 10);
        int times = Integer.valueOf(additionalRuleExpression.split("\r\n")[1].split(":")[1], 10);

        int currentWeek = Integer.valueOf(((Period) ((DataQueryParams) params).getFilterPeriods().get(0)).getIsoDate().split("W")[1], 10);
        int currentYear = Integer.valueOf(((Period) ((DataQueryParams) params).getFilterPeriods().get(0)).getIsoDate().split("W")[0], 10);

        Date startDate = ((Period) params.getFilterPeriods().get(0)).getStartDate();
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

                for (int i = 1; i < years; i++) {
                    startDate = calculateStartDate(0, 0, currentWeek, currentYear - i);
                    endDate = calculateEndDate(0, 0, currentWeek, currentYear - i);

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

                if (checkResultForDisenteriaRule(times, currentWeekResults, previousYearsResults)) return true;
            }
        }

        return false;


    }

    private boolean validateMalariaCaseInYears(DataQueryParams params, ValidationRule rule,
                                               Collection<OrganisationUnit> organisationUnits) {
        String additionalRuleExpression = rule.getAdditionalRule();
        int earlyWeeks = Integer.valueOf(additionalRuleExpression.split("\r\n")[0].split(":")[1], 10);
        int afterWeeks = Integer.valueOf(additionalRuleExpression.split("\r\n")[1].split(":")[1], 10);
        int pastYears = Integer.valueOf(additionalRuleExpression.split("\r\n")[2].split(":")[1], 10);
        int stddevTimes = Integer.valueOf(additionalRuleExpression.split("\r\n")[3].split(":")[1], 10);

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

    private Calendar initCalendar(int currentWeek, int currentYear) {
        Calendar cal = Calendar.getInstance();
        cal.setMinimalDaysInFirstWeek(4);
        cal.set(currentYear, 1, 1);
        cal.set(Calendar.WEEK_OF_YEAR, currentWeek);
        cal.setFirstDayOfWeek(Calendar.MONDAY);
        return cal;
    }

    private Date calculateStartDate(int earlyWeeks, int afterWeeks, int currentWeek, int currentYear) {
        Calendar cal = initCalendar(currentWeek, currentYear);

        cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
        cal.add(Calendar.DAY_OF_YEAR, (-1 * (earlyWeeks + afterWeeks)) * 7);
        return cal.getTime();
    }

    private Date calculateEndDate(int earlyWeeks, int afterWeeks, int currentWeek, int currentYear) {
        Calendar cal = initCalendar(currentWeek, currentYear);

        cal.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
        cal.add(Calendar.DAY_OF_YEAR, (-1 * (earlyWeeks + afterWeeks)) * 7);
        return cal.getTime();
    }

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

    private boolean checkResultForDisenteriaRule(int times, List<ValidationResult> currentWeekResults, List<ValidationResult> previousYearsResults) {
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
        if (currentWeekResults.get(0).getLeftsideValue() > averageDiseaseNum + times * stdDevDiseaseNum) {
            return true;
        }
        return false;
    }

    @RequestMapping(value = RESOURCE_PATH + ".xml", method = RequestMethod.GET)
    public void getXml(
            @RequestParam Set<String> dimension,
            @RequestParam(required = false) Set<String> filter,
            @RequestParam(required = false) AggregationType aggregationType,
            @RequestParam(required = false) String measureCriteria,
            @RequestParam(required = false) boolean skipMeta,
            @RequestParam(required = false) boolean skipData,
            @RequestParam(required = false) boolean skipRounding,
            @RequestParam(required = false) boolean completedOnly,
            @RequestParam(required = false) boolean hierarchyMeta,
            @RequestParam(required = false) boolean ignoreLimit,
            @RequestParam(required = false) boolean hideEmptyRows,
            @RequestParam(required = false) boolean showHierarchy,
            @RequestParam(required = false) DisplayProperty displayProperty,
            @RequestParam(required = false) IdentifiableProperty outputIdScheme,
            @RequestParam(required = false) IdScheme inputIdScheme,
            @RequestParam(required = false) String approvalLevel,
            @RequestParam(required = false) Date relativePeriodDate,
            @RequestParam(required = false) String userOrgUnit,
            @RequestParam(required = false) String columns,
            @RequestParam(required = false) String rows,
            Model model,
            HttpServletResponse response) throws Exception {
        DataQueryParams params = dataQueryService.getFromUrl(dimension, filter, aggregationType, measureCriteria, skipMeta, skipData, skipRounding, completedOnly, hierarchyMeta,
                ignoreLimit, hideEmptyRows, showHierarchy, displayProperty, outputIdScheme, inputIdScheme, approvalLevel, relativePeriodDate, userOrgUnit, i18nManager.getI18nFormat());

        contextUtils.configureResponse(response, ContextUtils.CONTENT_TYPE_XML, CacheStrategy.RESPECT_SYSTEM_SETTING);
        Grid grid = analyticsService.getAggregatedDataValues(params, getItemsFromParam(columns), getItemsFromParam(rows));
        GridUtils.toXml(grid, response.getOutputStream());
    }

    @RequestMapping(value = RESOURCE_PATH + ".html", method = RequestMethod.GET)
    public void getHtml(
            @RequestParam Set<String> dimension,
            @RequestParam(required = false) Set<String> filter,
            @RequestParam(required = false) AggregationType aggregationType,
            @RequestParam(required = false) String measureCriteria,
            @RequestParam(required = false) boolean skipMeta,
            @RequestParam(required = false) boolean skipData,
            @RequestParam(required = false) boolean skipRounding,
            @RequestParam(required = false) boolean completedOnly,
            @RequestParam(required = false) boolean hierarchyMeta,
            @RequestParam(required = false) boolean ignoreLimit,
            @RequestParam(required = false) boolean hideEmptyRows,
            @RequestParam(required = false) boolean showHierarchy,
            @RequestParam(required = false) DisplayProperty displayProperty,
            @RequestParam(required = false) IdentifiableProperty outputIdScheme,
            @RequestParam(required = false) IdScheme inputIdScheme,
            @RequestParam(required = false) String approvalLevel,
            @RequestParam(required = false) Date relativePeriodDate,
            @RequestParam(required = false) String userOrgUnit,
            @RequestParam(required = false) String columns,
            @RequestParam(required = false) String rows,
            Model model,
            HttpServletResponse response) throws Exception {
        DataQueryParams params = dataQueryService.getFromUrl(dimension, filter, aggregationType, measureCriteria, skipMeta, skipData, skipRounding, completedOnly, hierarchyMeta,
                ignoreLimit, hideEmptyRows, showHierarchy, displayProperty, outputIdScheme, inputIdScheme, approvalLevel, relativePeriodDate, userOrgUnit, i18nManager.getI18nFormat());

        contextUtils.configureResponse(response, ContextUtils.CONTENT_TYPE_HTML, CacheStrategy.RESPECT_SYSTEM_SETTING);
        Grid grid = analyticsService.getAggregatedDataValues(params, getItemsFromParam(columns), getItemsFromParam(rows));
        GridUtils.toHtml(grid, response.getWriter());
    }

    @RequestMapping(value = RESOURCE_PATH + ".html+css", method = RequestMethod.GET)
    public void getHtmlCss(
            @RequestParam Set<String> dimension,
            @RequestParam(required = false) Set<String> filter,
            @RequestParam(required = false) AggregationType aggregationType,
            @RequestParam(required = false) String measureCriteria,
            @RequestParam(required = false) boolean skipMeta,
            @RequestParam(required = false) boolean skipData,
            @RequestParam(required = false) boolean skipRounding,
            @RequestParam(required = false) boolean completedOnly,
            @RequestParam(required = false) boolean hierarchyMeta,
            @RequestParam(required = false) boolean ignoreLimit,
            @RequestParam(required = false) boolean hideEmptyRows,
            @RequestParam(required = false) boolean showHierarchy,
            @RequestParam(required = false) DisplayProperty displayProperty,
            @RequestParam(required = false) IdentifiableProperty outputIdScheme,
            @RequestParam(required = false) IdScheme inputIdScheme,
            @RequestParam(required = false) String approvalLevel,
            @RequestParam(required = false) Date relativePeriodDate,
            @RequestParam(required = false) String userOrgUnit,
            @RequestParam(required = false) String columns,
            @RequestParam(required = false) String rows,
            Model model,
            HttpServletResponse response) throws Exception {
        DataQueryParams params = dataQueryService.getFromUrl(dimension, filter, aggregationType, measureCriteria, skipMeta, skipData, skipRounding, completedOnly, hierarchyMeta,
                ignoreLimit, hideEmptyRows, showHierarchy, displayProperty, outputIdScheme, inputIdScheme, approvalLevel, relativePeriodDate, userOrgUnit, i18nManager.getI18nFormat());

        contextUtils.configureResponse(response, ContextUtils.CONTENT_TYPE_HTML, CacheStrategy.RESPECT_SYSTEM_SETTING);
        Grid grid = analyticsService.getAggregatedDataValues(params, getItemsFromParam(columns), getItemsFromParam(rows));
        GridUtils.toHtmlCss(grid, response.getWriter());
    }

    @RequestMapping(value = RESOURCE_PATH + ".csv", method = RequestMethod.GET)
    public void getCsv(
            @RequestParam Set<String> dimension,
            @RequestParam(required = false) Set<String> filter,
            @RequestParam(required = false) AggregationType aggregationType,
            @RequestParam(required = false) String measureCriteria,
            @RequestParam(required = false) boolean skipMeta,
            @RequestParam(required = false) boolean skipData,
            @RequestParam(required = false) boolean skipRounding,
            @RequestParam(required = false) boolean completedOnly,
            @RequestParam(required = false) boolean hierarchyMeta,
            @RequestParam(required = false) boolean ignoreLimit,
            @RequestParam(required = false) boolean hideEmptyRows,
            @RequestParam(required = false) boolean showHierarchy,
            @RequestParam(required = false) DisplayProperty displayProperty,
            @RequestParam(required = false) IdentifiableProperty outputIdScheme,
            @RequestParam(required = false) IdScheme inputIdScheme,
            @RequestParam(required = false) String approvalLevel,
            @RequestParam(required = false) Date relativePeriodDate,
            @RequestParam(required = false) String userOrgUnit,
            @RequestParam(required = false) String columns,
            @RequestParam(required = false) String rows,
            Model model,
            HttpServletResponse response) throws Exception {
        DataQueryParams params = dataQueryService.getFromUrl(dimension, filter, aggregationType, measureCriteria, skipMeta, skipData, skipRounding, completedOnly, hierarchyMeta,
                ignoreLimit, hideEmptyRows, showHierarchy, displayProperty, outputIdScheme, inputIdScheme, approvalLevel, relativePeriodDate, userOrgUnit, i18nManager.getI18nFormat());

        contextUtils.configureResponse(response, ContextUtils.CONTENT_TYPE_CSV, CacheStrategy.RESPECT_SYSTEM_SETTING, "data.csv", true);
        Grid grid = analyticsService.getAggregatedDataValues(params, getItemsFromParam(columns), getItemsFromParam(rows));
        GridUtils.toCsv(grid, response.getWriter());
    }

    @RequestMapping(value = RESOURCE_PATH + ".xls", method = RequestMethod.GET)
    public void getXls(
            @RequestParam Set<String> dimension,
            @RequestParam(required = false) Set<String> filter,
            @RequestParam(required = false) AggregationType aggregationType,
            @RequestParam(required = false) String measureCriteria,
            @RequestParam(required = false) boolean skipMeta,
            @RequestParam(required = false) boolean skipData,
            @RequestParam(required = false) boolean skipRounding,
            @RequestParam(required = false) boolean completedOnly,
            @RequestParam(required = false) boolean hierarchyMeta,
            @RequestParam(required = false) boolean ignoreLimit,
            @RequestParam(required = false) boolean hideEmptyRows,
            @RequestParam(required = false) boolean showHierarchy,
            @RequestParam(required = false) DisplayProperty displayProperty,
            @RequestParam(required = false) IdentifiableProperty outputIdScheme,
            @RequestParam(required = false) IdScheme inputIdScheme,
            @RequestParam(required = false) String approvalLevel,
            @RequestParam(required = false) Date relativePeriodDate,
            @RequestParam(required = false) String userOrgUnit,
            @RequestParam(required = false) String columns,
            @RequestParam(required = false) String rows,
            Model model,
            HttpServletResponse response) throws Exception {
        DataQueryParams params = dataQueryService.getFromUrl(dimension, filter, aggregationType, measureCriteria, skipMeta, skipData, skipRounding, completedOnly, hierarchyMeta,
                ignoreLimit, hideEmptyRows, showHierarchy, displayProperty, outputIdScheme, inputIdScheme, approvalLevel, relativePeriodDate, userOrgUnit, i18nManager.getI18nFormat());

        contextUtils.configureResponse(response, ContextUtils.CONTENT_TYPE_EXCEL, CacheStrategy.RESPECT_SYSTEM_SETTING, "data.xls", true);
        Grid grid = analyticsService.getAggregatedDataValues(params, getItemsFromParam(columns), getItemsFromParam(rows));
        GridUtils.toXls(grid, response.getOutputStream());
    }

    @RequestMapping(value = RESOURCE_PATH + ".jrxml", method = RequestMethod.GET)
    public void getJrxml(
            @RequestParam Set<String> dimension,
            @RequestParam(required = false) Set<String> filter,
            @RequestParam(required = false) AggregationType aggregationType,
            @RequestParam(required = false) String measureCriteria,
            @RequestParam(required = false) boolean skipMeta,
            @RequestParam(required = false) boolean skipData,
            @RequestParam(required = false) boolean skipRounding,
            @RequestParam(required = false) boolean completedOnly,
            @RequestParam(required = false) boolean hierarchyMeta,
            @RequestParam(required = false) boolean ignoreLimit,
            @RequestParam(required = false) boolean hideEmptyRows,
            @RequestParam(required = false) boolean showHierarchy,
            @RequestParam(required = false) DisplayProperty displayProperty,
            @RequestParam(required = false) IdentifiableProperty outputIdScheme,
            @RequestParam(required = false) IdScheme inputIdScheme,
            @RequestParam(required = false) Integer approvalLevel,
            @RequestParam(required = false) Date relativePeriodDate,
            @RequestParam(required = false) String userOrgUnit,
            @RequestParam(required = false) String columns,
            @RequestParam(required = false) String rows,
            Model model,
            HttpServletResponse response) throws Exception {
        DataQueryParams params = dataQueryService.getFromUrl(dimension, filter, null, null,
                true, false, false, false, false, false, false, false, null, null, null, null, null, null, i18nManager.getI18nFormat());

        contextUtils.configureResponse(response, ContextUtils.CONTENT_TYPE_XML, CacheStrategy.RESPECT_SYSTEM_SETTING, "data.jrxml", false);
        Grid grid = analyticsService.getAggregatedDataValues(params);

        GridUtils.toJrxml(grid, null, response.getWriter());
    }

    @RequestMapping(value = RESOURCE_PATH + "/debug/sql", method = RequestMethod.GET, produces = {"text/html", "text/plain"})
    public
    @ResponseBody
    String getDebugSql(
            @RequestParam Set<String> dimension,
            @RequestParam(required = false) Set<String> filter,
            @RequestParam(required = false) AggregationType aggregationType,
            @RequestParam(required = false) String measureCriteria,
            @RequestParam(required = false) boolean skipMeta,
            @RequestParam(required = false) boolean skipData,
            @RequestParam(required = false) boolean skipRounding,
            @RequestParam(required = false) boolean completedOnly,
            @RequestParam(required = false) boolean hierarchyMeta,
            @RequestParam(required = false) boolean ignoreLimit,
            @RequestParam(required = false) boolean hideEmptyRows,
            @RequestParam(required = false) boolean showHierarchy,
            @RequestParam(required = false) DisplayProperty displayProperty,
            @RequestParam(required = false) IdentifiableProperty outputIdScheme,
            @RequestParam(required = false) IdScheme inputIdScheme,
            @RequestParam(required = false) String approvalLevel,
            @RequestParam(required = false) Date relativePeriodDate,
            @RequestParam(required = false) String userOrgUnit,
            @RequestParam(required = false) String columns,
            @RequestParam(required = false) String rows,
            Model model,
            HttpServletResponse response) throws Exception {
        DataQueryParams params = dataQueryService.getFromUrl(dimension, filter, aggregationType, measureCriteria, skipMeta, skipData, skipRounding, completedOnly, hierarchyMeta,
                ignoreLimit, hideEmptyRows, showHierarchy, displayProperty, outputIdScheme, inputIdScheme, approvalLevel, relativePeriodDate, userOrgUnit, i18nManager.getI18nFormat());

        contextUtils.configureResponse(response, ContextUtils.CONTENT_TYPE_TEXT, CacheStrategy.NO_CACHE, "debug.sql", false);
        return AnalyticsUtils.getDebugDataSql(params);
    }
}
