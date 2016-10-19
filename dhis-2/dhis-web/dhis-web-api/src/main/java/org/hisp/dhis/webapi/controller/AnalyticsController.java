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

import java.awt.*;
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
@ApiVersion( { ApiVersion.Version.DEFAULT, ApiVersion.Version.ALL } )
public class AnalyticsController
{
    public static final String SIMPLE_RULE_TYPE = "Default";
    public static final String SARAMPO_CASE_IN_MONTHS = "SarampoCaseInMonths";

    private static final String RESOURCE_PATH = "/analytics";

    private static final Log log = LogFactory.getLog( AnalyticsController.class );
    public static final String MENINGITE_CASE_INCREASED_BY_TIMES = "meningite case increased by times";

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

    @RequestMapping( value = RESOURCE_PATH, method = RequestMethod.GET, produces = { "application/json", "application/javascript" } )
    public String getJson( // JSON, JSONP
        @RequestParam Set<String> dimension,
        @RequestParam( required = false ) Set<String> filter,
        @RequestParam( required = false ) AggregationType aggregationType,
        @RequestParam( required = false ) String measureCriteria,
        @RequestParam( required = false ) boolean skipMeta,
        @RequestParam( required = false ) boolean skipData,
        @RequestParam( required = false ) boolean skipRounding,
        @RequestParam( required = false ) boolean completedOnly,
        @RequestParam( required = false ) boolean hierarchyMeta,
        @RequestParam( required = false ) boolean ignoreLimit,
        @RequestParam( required = false ) boolean hideEmptyRows,
        @RequestParam( required = false ) boolean showHierarchy,
        @RequestParam( required = false ) DisplayProperty displayProperty,
        @RequestParam( required = false ) IdentifiableProperty outputIdScheme,
        @RequestParam( required = false ) IdScheme inputIdScheme,
        @RequestParam( required = false ) String approvalLevel,
        @RequestParam( required = false ) Date relativePeriodDate,
        @RequestParam( required = false ) String userOrgUnit,
        @RequestParam( required = false ) String columns,
        @RequestParam( required = false ) String rows,
        Model model,
        HttpServletResponse response ) throws Exception
    {
        DataQueryParams params = dataQueryService.getFromUrl( dimension, filter, aggregationType, measureCriteria, skipMeta, skipData, skipRounding, completedOnly, hierarchyMeta,
            ignoreLimit, hideEmptyRows, showHierarchy, displayProperty, outputIdScheme, inputIdScheme, approvalLevel, relativePeriodDate, userOrgUnit, i18nManager.getI18nFormat() );

        contextUtils.configureResponse( response, ContextUtils.CONTENT_TYPE_JSON, CacheStrategy.RESPECT_SYSTEM_SETTING );
        Grid grid = analyticsService.getAggregatedDataValues( params, getItemsFromParam( columns ), getItemsFromParam( rows ) );
        highLightForDataValues(params, grid);

        model.addAttribute( "model", grid );
        model.addAttribute( "viewClass", "detailed" );
        return "grid";
    }

    private void highLightForDataValues(DataQueryParams params, Grid grid) {
        List<ValidationRule> rules = validationRuleService.getAllValidationRules();

        List<List<Object>> allRows = grid.getRows();
        List<Object> r = new ArrayList<>();
        r.add("af47c3c71d0");
        r.add("MOH12345678");
        r.add(3.0);
        allRows.add(r);

        for (List<Object> row : allRows) {
            String highLight = "";
            String diseaseId = (String) row.get(0);

            for (ValidationRule rule : rules) {
                if (!rule.getLeftSide().getExpression().contains(diseaseId))
                {
                    continue;
                }

                boolean shouldStop = false;

                switch (rule.getAdditionalRuleType())
                {
                    case SIMPLE_RULE_TYPE:
                        Operator operator = rule.getOperator();
                        double threshold = Double.valueOf(rule.getRightSide().getExpression());

                        if (!expressionIsTrue((Double)row.get(2), operator, threshold)) {
                            highLight = String.format("highlight.%b", true);

                            shouldStop = true;
                        }
                        break;

                    case SARAMPO_CASE_IN_MONTHS:
                        if (notCustomizedPeroids(params)) {
                            break;
                        }

                        if (isSarampoCaseInMonthsValidationSucc(params, row, rule)){
                            highLight = String.format("highlight.%b", true);

                            shouldStop = true;
                        }
                        break;

                    case MENINGITE_CASE_INCREASED_BY_TIMES:
                        if (notCustomizedPeroids(params)) {
                            break;
                        }

                        if (isMeningiteCaseIncreasedByTimesValidationSucc(params, row, rule)){
                            highLight = String.format("highlight.%b", true);

                            shouldStop = true;
                        }
                        break;

                    default:
                        highLight = "highlight.false";
                        shouldStop = false;
                        break;
                }

                if (shouldStop)
                {
                    break;
                }

            }
            row.add(highLight);

        }
    }

    private boolean notCustomizedPeroids(DataQueryParams params)
    {
        return (params.getFilterPeriods().size() != 1) && (((Period) params.getFilterPeriods().get(0)).getPeriodType() instanceof WeeklyPeriodType);
    }

    private boolean isSarampoCaseInMonthsValidationSucc(DataQueryParams params, List<Object> row, ValidationRule rule) {
        String additionalRuleExpression = rule.getAdditionalRule();
        int weeks = Integer.valueOf(additionalRuleExpression.split("\r\n")[0].split(":")[1], 10);
        int threshold = Integer.valueOf(additionalRuleExpression.split("\r\n")[1].split(":")[1], 10);

        Date startDate = ((Period) params.getFilterPeriods().get(0)).getStartDate();
        Calendar c = Calendar.getInstance();
        c.setTime(startDate);
        c.add(Calendar.DATE, -(weeks * 7));
        startDate.setTime(c.getTime().getTime());


        Date endDate = ((Period) params.getFilterPeriods().get(0)).getEndDate();

        OrganisationUnit organisationUnit = organisationUnitService.getOrganisationUnit((String) row.get(1));

        Collection<OrganisationUnit> organisationUnits = organisationUnitService.getOrganisationUnitWithChildren( organisationUnit.getId() );

        for (ValidationRuleGroup group : rule.getGroups()) {

            for(OrganisationUnit org : organisationUnits) {

                Collection<OrganisationUnit> orgUnits = new ArrayList<OrganisationUnit> ();
                orgUnits.add(org);

                List<ValidationResult> validationResult = new ArrayList<>(validationRuleService.validate(
                        startDate,
                        endDate,
                        orgUnits,
                        null,
                        group,
                        false,
                        i18nManager.getI18nFormat()));

                if (validationResult.size() == weeks)
                {
                    Double diseaseNum = 0.0;
                    for (ValidationResult result : validationResult){
                        diseaseNum += result.getLeftsideValue();
                    }

                    if (diseaseNum >= threshold){
                        return true;
                    }
                }
            }

        }

        return false;
    }

    private boolean isMeningiteCaseIncreasedByTimesValidationSucc(DataQueryParams params, List<Object> row, ValidationRule rule) {
        String additionalRuleExpression = rule.getAdditionalRule();
        int times = Integer.valueOf(additionalRuleExpression.split("\r\n")[0].split(":")[1], 10);
        int weeks = Integer.valueOf(additionalRuleExpression.split("\r\n")[1].split(":")[1], 10);

        Date startDate = ((Period) params.getFilterPeriods().get(0)).getStartDate();
        Calendar c = Calendar.getInstance();
        c.setTime(startDate);
        c.add(Calendar.DATE, -(weeks * 7));
        startDate.setTime(c.getTime().getTime());


        Date endDate = ((Period) params.getFilterPeriods().get(0)).getEndDate();

        OrganisationUnit organisationUnit = organisationUnitService.getOrganisationUnit((String) row.get(1));

        Collection<OrganisationUnit> organisationUnits = organisationUnitService.getOrganisationUnitWithChildren( organisationUnit.getId() );

        for (ValidationRuleGroup group : rule.getGroups()) {

            for(OrganisationUnit org : organisationUnits) {

                Collection<OrganisationUnit> orgUnits = new ArrayList<OrganisationUnit> ();
                orgUnits.add(org);

                List<ValidationResult> validationResult = new ArrayList<>(validationRuleService.validate(
                        startDate,
                        endDate,
                        orgUnits,
                        null,
                        group,
                        false,
                        i18nManager.getI18nFormat()));

                if (validationResult.size() == weeks)
                {
                    boolean increasedFlag = false;
                    Double diseaseNum = 0.0;
                    for (ValidationResult result : validationResult){

                        if (result.getLeftsideValue() < times * diseaseNum){
                            break;
                        }

                        increasedFlag = true;
                        diseaseNum = result.getLeftsideValue();
                    }

                    if (increasedFlag){
                        return true;
                    }
                }
            }

        }

        return false;
    }


    @RequestMapping( value = RESOURCE_PATH + ".xml", method = RequestMethod.GET )
    public void getXml(
        @RequestParam Set<String> dimension,
        @RequestParam( required = false ) Set<String> filter,
        @RequestParam( required = false ) AggregationType aggregationType,
        @RequestParam( required = false ) String measureCriteria,
        @RequestParam( required = false ) boolean skipMeta,
        @RequestParam( required = false ) boolean skipData,
        @RequestParam( required = false ) boolean skipRounding,
        @RequestParam( required = false ) boolean completedOnly,
        @RequestParam( required = false ) boolean hierarchyMeta,
        @RequestParam( required = false ) boolean ignoreLimit,
        @RequestParam( required = false ) boolean hideEmptyRows,
        @RequestParam( required = false ) boolean showHierarchy,
        @RequestParam( required = false ) DisplayProperty displayProperty,
        @RequestParam( required = false ) IdentifiableProperty outputIdScheme,
        @RequestParam( required = false ) IdScheme inputIdScheme,
        @RequestParam( required = false ) String approvalLevel,
        @RequestParam( required = false ) Date relativePeriodDate,
        @RequestParam( required = false ) String userOrgUnit,
        @RequestParam( required = false ) String columns,
        @RequestParam( required = false ) String rows,
        Model model,
        HttpServletResponse response ) throws Exception
    {
        DataQueryParams params = dataQueryService.getFromUrl( dimension, filter, aggregationType, measureCriteria, skipMeta, skipData, skipRounding, completedOnly, hierarchyMeta,
            ignoreLimit, hideEmptyRows, showHierarchy, displayProperty, outputIdScheme, inputIdScheme, approvalLevel, relativePeriodDate, userOrgUnit, i18nManager.getI18nFormat() );

        contextUtils.configureResponse( response, ContextUtils.CONTENT_TYPE_XML, CacheStrategy.RESPECT_SYSTEM_SETTING );
        Grid grid = analyticsService.getAggregatedDataValues( params, getItemsFromParam( columns ), getItemsFromParam( rows ) );
        GridUtils.toXml( grid, response.getOutputStream() );
    }

    @RequestMapping( value = RESOURCE_PATH + ".html", method = RequestMethod.GET )
    public void getHtml(
        @RequestParam Set<String> dimension,
        @RequestParam( required = false ) Set<String> filter,
        @RequestParam( required = false ) AggregationType aggregationType,
        @RequestParam( required = false ) String measureCriteria,
        @RequestParam( required = false ) boolean skipMeta,
        @RequestParam( required = false ) boolean skipData,
        @RequestParam( required = false ) boolean skipRounding,
        @RequestParam( required = false ) boolean completedOnly,
        @RequestParam( required = false ) boolean hierarchyMeta,
        @RequestParam( required = false ) boolean ignoreLimit,
        @RequestParam( required = false ) boolean hideEmptyRows,
        @RequestParam( required = false ) boolean showHierarchy,
        @RequestParam( required = false ) DisplayProperty displayProperty,
        @RequestParam( required = false ) IdentifiableProperty outputIdScheme,
        @RequestParam( required = false ) IdScheme inputIdScheme,
        @RequestParam( required = false ) String approvalLevel,
        @RequestParam( required = false ) Date relativePeriodDate,
        @RequestParam( required = false ) String userOrgUnit,
        @RequestParam( required = false ) String columns,
        @RequestParam( required = false ) String rows,
        Model model,
        HttpServletResponse response ) throws Exception
    {
        DataQueryParams params = dataQueryService.getFromUrl( dimension, filter, aggregationType, measureCriteria, skipMeta, skipData, skipRounding, completedOnly, hierarchyMeta,
            ignoreLimit, hideEmptyRows, showHierarchy, displayProperty, outputIdScheme, inputIdScheme, approvalLevel, relativePeriodDate, userOrgUnit, i18nManager.getI18nFormat() );

        contextUtils.configureResponse( response, ContextUtils.CONTENT_TYPE_HTML, CacheStrategy.RESPECT_SYSTEM_SETTING );
        Grid grid = analyticsService.getAggregatedDataValues( params, getItemsFromParam( columns ), getItemsFromParam( rows ) );
        GridUtils.toHtml( grid, response.getWriter() );
    }

    @RequestMapping( value = RESOURCE_PATH + ".html+css", method = RequestMethod.GET )
    public void getHtmlCss(
        @RequestParam Set<String> dimension,
        @RequestParam( required = false ) Set<String> filter,
        @RequestParam( required = false ) AggregationType aggregationType,
        @RequestParam( required = false ) String measureCriteria,
        @RequestParam( required = false ) boolean skipMeta,
        @RequestParam( required = false ) boolean skipData,
        @RequestParam( required = false ) boolean skipRounding,
        @RequestParam( required = false ) boolean completedOnly,
        @RequestParam( required = false ) boolean hierarchyMeta,
        @RequestParam( required = false ) boolean ignoreLimit,
        @RequestParam( required = false ) boolean hideEmptyRows,
        @RequestParam( required = false ) boolean showHierarchy,
        @RequestParam( required = false ) DisplayProperty displayProperty,
        @RequestParam( required = false ) IdentifiableProperty outputIdScheme,
        @RequestParam( required = false ) IdScheme inputIdScheme,
        @RequestParam( required = false ) String approvalLevel,
        @RequestParam( required = false ) Date relativePeriodDate,
        @RequestParam( required = false ) String userOrgUnit,
        @RequestParam( required = false ) String columns,
        @RequestParam( required = false ) String rows,
        Model model,
        HttpServletResponse response ) throws Exception
    {
        DataQueryParams params = dataQueryService.getFromUrl( dimension, filter, aggregationType, measureCriteria, skipMeta, skipData, skipRounding, completedOnly, hierarchyMeta,
            ignoreLimit, hideEmptyRows, showHierarchy, displayProperty, outputIdScheme, inputIdScheme, approvalLevel, relativePeriodDate, userOrgUnit, i18nManager.getI18nFormat() );

        contextUtils.configureResponse( response, ContextUtils.CONTENT_TYPE_HTML, CacheStrategy.RESPECT_SYSTEM_SETTING );
        Grid grid = analyticsService.getAggregatedDataValues( params, getItemsFromParam( columns ), getItemsFromParam( rows ) );
        GridUtils.toHtmlCss( grid, response.getWriter() );
    }

    @RequestMapping( value = RESOURCE_PATH + ".csv", method = RequestMethod.GET )
    public void getCsv(
        @RequestParam Set<String> dimension,
        @RequestParam( required = false ) Set<String> filter,
        @RequestParam( required = false ) AggregationType aggregationType,
        @RequestParam( required = false ) String measureCriteria,
        @RequestParam( required = false ) boolean skipMeta,
        @RequestParam( required = false ) boolean skipData,
        @RequestParam( required = false ) boolean skipRounding,
        @RequestParam( required = false ) boolean completedOnly,
        @RequestParam( required = false ) boolean hierarchyMeta,
        @RequestParam( required = false ) boolean ignoreLimit,
        @RequestParam( required = false ) boolean hideEmptyRows,
        @RequestParam( required = false ) boolean showHierarchy,
        @RequestParam( required = false ) DisplayProperty displayProperty,
        @RequestParam( required = false ) IdentifiableProperty outputIdScheme,
        @RequestParam( required = false ) IdScheme inputIdScheme,
        @RequestParam( required = false ) String approvalLevel,
        @RequestParam( required = false ) Date relativePeriodDate,
        @RequestParam( required = false ) String userOrgUnit,
        @RequestParam( required = false ) String columns,
        @RequestParam( required = false ) String rows,
        Model model,
        HttpServletResponse response ) throws Exception
    {
        DataQueryParams params = dataQueryService.getFromUrl( dimension, filter, aggregationType, measureCriteria, skipMeta, skipData, skipRounding, completedOnly, hierarchyMeta,
            ignoreLimit, hideEmptyRows, showHierarchy, displayProperty, outputIdScheme, inputIdScheme, approvalLevel, relativePeriodDate, userOrgUnit, i18nManager.getI18nFormat() );

        contextUtils.configureResponse( response, ContextUtils.CONTENT_TYPE_CSV, CacheStrategy.RESPECT_SYSTEM_SETTING, "data.csv", true );
        Grid grid = analyticsService.getAggregatedDataValues( params, getItemsFromParam( columns ), getItemsFromParam( rows ) );
        GridUtils.toCsv( grid, response.getWriter() );
    }

    @RequestMapping( value = RESOURCE_PATH + ".xls", method = RequestMethod.GET )
    public void getXls(
        @RequestParam Set<String> dimension,
        @RequestParam( required = false ) Set<String> filter,
        @RequestParam( required = false ) AggregationType aggregationType,
        @RequestParam( required = false ) String measureCriteria,
        @RequestParam( required = false ) boolean skipMeta,
        @RequestParam( required = false ) boolean skipData,
        @RequestParam( required = false ) boolean skipRounding,
        @RequestParam( required = false ) boolean completedOnly,
        @RequestParam( required = false ) boolean hierarchyMeta,
        @RequestParam( required = false ) boolean ignoreLimit,
        @RequestParam( required = false ) boolean hideEmptyRows,
        @RequestParam( required = false ) boolean showHierarchy,
        @RequestParam( required = false ) DisplayProperty displayProperty,
        @RequestParam( required = false ) IdentifiableProperty outputIdScheme,
        @RequestParam( required = false ) IdScheme inputIdScheme,
        @RequestParam( required = false ) String approvalLevel,
        @RequestParam( required = false ) Date relativePeriodDate,
        @RequestParam( required = false ) String userOrgUnit,
        @RequestParam( required = false ) String columns,
        @RequestParam( required = false ) String rows,
        Model model,
        HttpServletResponse response ) throws Exception
    {
        DataQueryParams params = dataQueryService.getFromUrl( dimension, filter, aggregationType, measureCriteria, skipMeta, skipData, skipRounding, completedOnly, hierarchyMeta,
            ignoreLimit, hideEmptyRows, showHierarchy, displayProperty, outputIdScheme, inputIdScheme, approvalLevel, relativePeriodDate, userOrgUnit, i18nManager.getI18nFormat() );

        contextUtils.configureResponse( response, ContextUtils.CONTENT_TYPE_EXCEL, CacheStrategy.RESPECT_SYSTEM_SETTING, "data.xls", true );
        Grid grid = analyticsService.getAggregatedDataValues( params, getItemsFromParam( columns ), getItemsFromParam( rows ) );
        GridUtils.toXls( grid, response.getOutputStream() );
    }

    @RequestMapping( value = RESOURCE_PATH + ".jrxml", method = RequestMethod.GET )
    public void getJrxml(
        @RequestParam Set<String> dimension,
        @RequestParam( required = false ) Set<String> filter,
        @RequestParam( required = false ) AggregationType aggregationType,
        @RequestParam( required = false ) String measureCriteria,
        @RequestParam( required = false ) boolean skipMeta,
        @RequestParam( required = false ) boolean skipData,
        @RequestParam( required = false ) boolean skipRounding,
        @RequestParam( required = false ) boolean completedOnly,
        @RequestParam( required = false ) boolean hierarchyMeta,
        @RequestParam( required = false ) boolean ignoreLimit,
        @RequestParam( required = false ) boolean hideEmptyRows,
        @RequestParam( required = false ) boolean showHierarchy,
        @RequestParam( required = false ) DisplayProperty displayProperty,
        @RequestParam( required = false ) IdentifiableProperty outputIdScheme,
        @RequestParam( required = false ) IdScheme inputIdScheme,
        @RequestParam( required = false ) Integer approvalLevel,
        @RequestParam( required = false ) Date relativePeriodDate,
        @RequestParam( required = false ) String userOrgUnit,
        @RequestParam( required = false ) String columns,
        @RequestParam( required = false ) String rows,
        Model model,
        HttpServletResponse response ) throws Exception
    {
        DataQueryParams params = dataQueryService.getFromUrl( dimension, filter, null, null,
            true, false, false, false, false, false, false, false, null, null, null, null, null, null, i18nManager.getI18nFormat() );

        contextUtils.configureResponse( response, ContextUtils.CONTENT_TYPE_XML, CacheStrategy.RESPECT_SYSTEM_SETTING, "data.jrxml", false );
        Grid grid = analyticsService.getAggregatedDataValues( params );

        GridUtils.toJrxml( grid, null, response.getWriter() );
    }

    @RequestMapping( value = RESOURCE_PATH + "/debug/sql", method = RequestMethod.GET, produces = { "text/html", "text/plain" } )
    public @ResponseBody String getDebugSql(
        @RequestParam Set<String> dimension,
        @RequestParam( required = false ) Set<String> filter,
        @RequestParam( required = false ) AggregationType aggregationType,
        @RequestParam( required = false ) String measureCriteria,
        @RequestParam( required = false ) boolean skipMeta,
        @RequestParam( required = false ) boolean skipData,
        @RequestParam( required = false ) boolean skipRounding,
        @RequestParam( required = false ) boolean completedOnly,
        @RequestParam( required = false ) boolean hierarchyMeta,
        @RequestParam( required = false ) boolean ignoreLimit,
        @RequestParam( required = false ) boolean hideEmptyRows,
        @RequestParam( required = false ) boolean showHierarchy,
        @RequestParam( required = false ) DisplayProperty displayProperty,
        @RequestParam( required = false ) IdentifiableProperty outputIdScheme,
        @RequestParam( required = false ) IdScheme inputIdScheme,
        @RequestParam( required = false ) String approvalLevel,
        @RequestParam( required = false ) Date relativePeriodDate,
        @RequestParam( required = false ) String userOrgUnit,
        @RequestParam( required = false ) String columns,
        @RequestParam( required = false ) String rows,
        Model model,
        HttpServletResponse response ) throws Exception
    {
        DataQueryParams params = dataQueryService.getFromUrl( dimension, filter, aggregationType, measureCriteria, skipMeta, skipData, skipRounding, completedOnly, hierarchyMeta,
            ignoreLimit, hideEmptyRows, showHierarchy, displayProperty, outputIdScheme, inputIdScheme, approvalLevel, relativePeriodDate, userOrgUnit, i18nManager.getI18nFormat() );

        contextUtils.configureResponse( response, ContextUtils.CONTENT_TYPE_TEXT, CacheStrategy.NO_CACHE, "debug.sql", false );
        return AnalyticsUtils.getDebugDataSql( params );
    }
}
