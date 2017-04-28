package org.hisp.dhis.webapi.controller.validation;

import org.hisp.dhis.dxf2.common.TranslateParams;
import org.hisp.dhis.query.QueryParserException;

import org.hisp.dhis.validation.AlertWeekDay;
import org.hisp.dhis.validation.AlertConfiguration;
import org.hisp.dhis.validation.AlertConfigurationService;
import org.hisp.dhis.webapi.controller.AbstractCrudController;
import org.hisp.dhis.webapi.webdomain.WebMetadata;
import org.hisp.dhis.webapi.webdomain.WebOptions;
import org.hisp.dhis.query.Order;
import com.google.common.collect.Lists;
import org.hisp.dhis.webapi.mvc.annotation.ApiVersion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletResponse;

import java.util.List;

/**
 * Created by wbwang on 25/04/2017.
 */
@Controller
@RequestMapping(value = "/alertConfiguration")
@ApiVersion( { ApiVersion.Version.DEFAULT, ApiVersion.Version.ALL } )
public class AlertConfigurationController
        extends AbstractCrudController<AlertConfiguration> {

    @Autowired
    private AlertConfigurationService alertConfigurationService;

    @Override
    protected List<AlertConfiguration> getEntityList(WebMetadata metadata, WebOptions options, List<String> filters,
                                                     List<Order> orders, TranslateParams translateParams) throws QueryParserException {
        return Lists.newArrayList(alertConfigurationService.getAllAlertConfigurations());
    }

    @RequestMapping(value = "/setDefault", method = { RequestMethod.POST, RequestMethod.PUT })
    public void setDefault(HttpServletResponse response) {
        AlertConfiguration alertDaysConf = new AlertConfiguration(AlertWeekDay.MON, "9:00");
        alertConfigurationService.saveAlertConfiguration(alertDaysConf);

        response.setStatus( HttpServletResponse.SC_NO_CONTENT );
    }
}
