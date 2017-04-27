package org.hisp.dhis.validationrule.action;

import com.opensymphony.xwork2.Action;


import org.hisp.dhis.validation.AlertWeekDay;
import org.hisp.dhis.validation.AlertConfiguration;
import org.hisp.dhis.validation.AlertConfigurationService;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


/**
 * Created by wbwang on 14/04/2017.
 */
public class GetAlertConfiguration implements Action {

    private AlertConfigurationService alertConfigurationService;

    public AlertConfigurationService getAlertConfigurationService() {
        return alertConfigurationService;
    }

    public void setAlertConfigurationService(AlertConfigurationService alertConfigurationService) {
        this.alertConfigurationService = alertConfigurationService;
    }

    private String days;

    public String getDays() {
        return days;
    }

    private String alertTime;

    public String getAlertTime() {
        return alertTime;
    }

    @Override
    public String execute()
            throws Exception {

        List<AlertConfiguration> alertConfigurations = alertConfigurationService.getAllAlertConfigurations();

        List<String> alertWeekDays = alertConfigurations.stream()
                .map(alertConf -> alertConf.getAlertWeekDay().toString())
                .collect(Collectors.toList());

        days = alertWeekDays.isEmpty() ? "" : String.join(", ", alertWeekDays);
        alertTime = alertConfigurations.isEmpty() ? "" : alertConfigurations.get(0).getAlertTime();

        return SUCCESS;
    }
}