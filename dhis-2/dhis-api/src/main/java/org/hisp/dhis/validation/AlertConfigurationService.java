package org.hisp.dhis.validation;

import java.util.List;

/**
 * Created by wbwang on 18/04/2017.
 */
public interface AlertConfigurationService {
    String ID = AlertConfigurationService.class.getName();

    int saveAlertConfiguration(AlertConfiguration alertConfiguration);

    void updateAlertConfiguration(AlertConfiguration alertConfiguration);

    void deleteAlertConfiguration(AlertConfiguration alertConfiguration);

    List<AlertConfiguration> getAllAlertConfigurations();
}