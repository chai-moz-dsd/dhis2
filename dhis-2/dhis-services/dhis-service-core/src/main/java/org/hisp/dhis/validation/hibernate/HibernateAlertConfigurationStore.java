package org.hisp.dhis.validation.hibernate;

import org.hisp.dhis.validation.AlertConfiguration;
import org.hisp.dhis.validation.AlertConfigurationStore;
import org.hisp.dhis.common.hibernate.HibernateIdentifiableObjectStore;

import java.util.List;


/**
 * Created by wbwang on 17/04/2017.
 */
public class HibernateAlertConfigurationStore
        extends HibernateIdentifiableObjectStore<AlertConfiguration>
        implements AlertConfigurationStore {

    @Override
    public int addAlertConfiguration(AlertConfiguration alertConfiguration) {
        return super.save(alertConfiguration);
    }

    @Override
    public int save(AlertConfiguration alertConfiguration) {
        return super.save(alertConfiguration);
    }

    @Override
    public void update(AlertConfiguration alertConfiguration) {
        super.update(alertConfiguration);
    }

    @Override
    public List<AlertConfiguration> getAllOrderedName() {
        return getQuery( "from AlertConfiguration a where a.uid is not null" ).list();
    }
}
