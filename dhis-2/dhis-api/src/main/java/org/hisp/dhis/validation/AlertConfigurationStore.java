package org.hisp.dhis.validation;
import org.hisp.dhis.common.GenericIdentifiableObjectStore;


/**
 * Created by wbwang on 18/04/2017.
 */
public interface AlertConfigurationStore
        extends GenericIdentifiableObjectStore<AlertConfiguration> {
    String ID = AlertConfigurationStore.class.getName();

    int addAlertConfiguration(AlertConfiguration alertConfiguration);

}
