package org.hisp.dhis.validationrule.action;

import com.opensymphony.xwork2.Action;
import org.apache.commons.lang3.StringUtils;

import java.util.Collection;


/**
 * Created by wbwang on 14/04/2017.
 */
public class UpdateAlertConfiguration implements Action {

    // -------------------------------------------------------------------------
    // Input
    // -------------------------------------------------------------------------

    private String pickedTime;

    public String getPickedTime() {
        return pickedTime;
    }

    public void setPickedTime(String pickedTime) {
        this.pickedTime = pickedTime;
    }

    private Collection<Boolean> pickedDay;

    @Override
    public String execute()
    throws Exception {
        Collection<String> mulDays = StringUtils.trimToNull( days ).split(", ");
        if (!mulDays.isEmpty()) {
            pickedDay.addAll(mulDays);
        }

        String pickedTime = StringUtils.trimToNull( times );

        return SUCCESS;
    }
}