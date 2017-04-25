package org.hisp.dhis.validationrule.action;

import com.opensymphony.xwork2.Action;
import org.apache.commons.lang3.StringUtils;

import java.util.*;

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

    private AlertConfigurationService alertConfigurationService;

    public AlertConfigurationService getAlertConfigurationService() {
        return alertConfigurationService;
    }

    public void setAlertConfigurationService(AlertConfigurationService alertConfigurationService) {
        this.alertConfigurationService = alertConfigurationService;
    }

    @Override
    public String execute()
            throws Exception {

        final String pickedTime = StringUtils.trimToNull(alertTime);

        String[] weekDays = StringUtils.trimToNull(days).split(",");
        Collection<String> mulDays = Arrays.asList(weekDays);

        final List<AlertConfiguration> alertConfigurations = alertConfigurationService.getAllAlertConfigurations();

        // delete all
        alertConfigurations.stream()
                .forEach(conf -> {
                    alertConfigurationService.deleteAlertConfiguration(conf);
                });

        // save new
        mulDays.stream()
                .forEach(day -> {
                    AlertConfiguration alertDaysConf = new AlertConfiguration(AlertWeekDay.valueOf(day.toUpperCase()), pickedTime);
                    alertConfigurationService.saveAlertConfiguration(alertDaysConf);
                });


        return SUCCESS;
    }
}