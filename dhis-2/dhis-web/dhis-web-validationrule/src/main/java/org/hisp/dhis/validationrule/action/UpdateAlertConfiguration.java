package org.hisp.dhis.validationrule.action;

import com.opensymphony.xwork2.Action;
import org.apache.commons.lang3.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

import org.hisp.dhis.i18n.I18n;
import org.hisp.dhis.validation.AlertWeekDay;
import org.hisp.dhis.validation.AlertConfiguration;
import org.hisp.dhis.validation.AlertConfigurationService;
import org.hisp.dhis.validation.DefaultAlertConfigurationService;


/**
 * Created by wbwang on 14/04/2017.
 */
public class UpdateAlertConfiguration implements Action {

    // -------------------------------------------------------------------------
    // Input
    // -------------------------------------------------------------------------

    private I18n i18n;

    public void setI18n( I18n i18n )
    {
        this.i18n = i18n;
    }

    private String alertTime;

    public String getAlertTime() {
        return alertTime;
    }

    public void setAlertTime(String alertTime) {
        this.alertTime = alertTime;
    }

    private String days;

    public String getDays() {
        return days;
    }

    public void setDays(String days) {
        this.days = days;
    }

    private String updatedMessage;

    public String getUpdatedMessage() {
        return updatedMessage;
    }

    public void setUpdatedMessage(String updatedMessage) {
        this.updatedMessage = updatedMessage;
    }

    private AlertConfigurationService alertConfigurationService;

    public AlertConfigurationService getAlertConfigurationService() {
        return alertConfigurationService;
    }

    public void setAlertConfigurationService(AlertConfigurationService alertConfigurationService) {
        this.alertConfigurationService = alertConfigurationService;
    }

    // -------------------------------------------------------------------------
    // Output
    // -------------------------------------------------------------------------

    private String message;

    public String getMessage()
    {
        return message;
    }

    @Override
    public String execute()
            throws Exception {
        if (days.isEmpty() || (alertTime == null)) {
            updatedMessage = i18n.getString( "please_define_the_dates_for_alerts" );
            return ERROR;
        }

        // delete all
        alertConfigurationService.getAllAlertConfigurations()
                .forEach(conf -> alertConfigurationService.deleteAlertConfiguration(conf));

        // save new
        final String pickedTime = StringUtils.trimToNull(alertTime);
        Arrays.asList(StringUtils.trimToNull(days).split(","))
                .forEach(day -> alertConfigurationService.saveAlertConfiguration(new AlertConfiguration(AlertWeekDay.valueOf(day.toUpperCase()), pickedTime)));

        updatedMessage = i18n.getString( "alert_configuration_saved" );
        return SUCCESS;
    }
}