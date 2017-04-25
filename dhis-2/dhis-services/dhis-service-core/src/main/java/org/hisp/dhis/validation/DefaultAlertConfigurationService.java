package org.hisp.dhis.validation;

import org.hisp.dhis.validation.AlertConfiguration;
import org.hisp.dhis.validation.AlertConfigurationService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;


import java.util.List;

/**
 * Created by wbwang on 18/04/2017.
 */
@Transactional
public class DefaultAlertConfigurationService
        implements AlertConfigurationService {

    @Autowired
    private AlertConfigurationStore alertConfigurationStore;

    public AlertConfigurationStore getAlertConfigurationStore() {
        return alertConfigurationStore;
    }

    public void setAlertConfigurationStore(AlertConfigurationStore alertConfigurationStore) {
        this.alertConfigurationStore = alertConfigurationStore;
    }

    @Override
    public int saveAlertConfiguration(AlertConfiguration alertConfiguration) {
        return alertConfigurationStore.save(alertConfiguration);
    }

    @Override
    public void updateAlertConfiguration(AlertConfiguration alertConfiguration) {
        alertConfigurationStore.update(alertConfiguration);
    }

    @Override
    public void deleteAlertConfiguration(AlertConfiguration alertConfiguration) {
        alertConfigurationStore.delete(alertConfiguration);
    }

    public List<AlertConfiguration> getAllAlertConfigurations() {
        return alertConfigurationStore.getAllOrderedName();
    }
}
