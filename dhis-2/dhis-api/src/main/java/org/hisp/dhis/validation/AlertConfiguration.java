package org.hisp.dhis.validation;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import org.hisp.dhis.common.BaseIdentifiableObject;
import org.hisp.dhis.common.DxfNamespaces;
import org.hisp.dhis.common.IdentifiableObject;
import org.hisp.dhis.common.view.DetailedView;
import org.hisp.dhis.common.view.ExportView;
import org.hisp.dhis.schema.annotation.PropertyRange;
import org.hisp.dhis.common.MergeMode;


/**
 * Created by wbwang on 18/04/2017.
 */
@JacksonXmlRootElement( localName = "validationRule", namespace = DxfNamespaces.DXF_2_0 )
public class AlertConfiguration extends BaseIdentifiableObject {

    private String alertTime;

    private AlertWeekDay alertWeekDay;

    public AlertConfiguration() {

    }

    public AlertConfiguration(AlertWeekDay alertWeekDay, String alertTime) {
        this.alertWeekDay = alertWeekDay;
        this.alertTime = alertTime;
    }


    // -------------------------------------------------------------------------
    // Set and get methods
    // -------------------------------------------------------------------------

    @JsonProperty
    @JsonView( { DetailedView.class, ExportView.class } )
    @JacksonXmlProperty( namespace = DxfNamespaces.DXF_2_0 )
    @PropertyRange( min = 2 )
    public String getAlertTime()
    {
        return alertTime;
    }

    public void setAlertTime( String alertTime )
    {
        this.alertTime = alertTime;
    }


    @JsonProperty
    @JsonView( { DetailedView.class, ExportView.class } )
    @JacksonXmlProperty( namespace = DxfNamespaces.DXF_2_0 )
    public AlertWeekDay getAlertWeekDay()
    {
        return alertWeekDay;
    }

    public void setAlertWeekDay( AlertWeekDay alertWeekDay )
    {
        this.alertWeekDay = alertWeekDay;
    }


    @Override
    public void mergeWith(IdentifiableObject other, MergeMode mergeMode) {
        super.mergeWith(other, mergeMode);

        if (other.getClass().isInstance(this)) {
            AlertConfiguration alertConfiguration = (AlertConfiguration) other;

            if (mergeMode.isReplace()) {
                alertWeekDay = alertConfiguration.getAlertWeekDay();
                alertTime = alertConfiguration.getAlertTime();
            }
            else if (mergeMode.isMerge()) {
                alertWeekDay = alertConfiguration.getAlertWeekDay() == null ? alertWeekDay : alertConfiguration.getAlertWeekDay();
                alertTime = alertConfiguration.getAlertTime() == null ? alertTime : alertConfiguration.getAlertTime();
            }
        }
    }
}

