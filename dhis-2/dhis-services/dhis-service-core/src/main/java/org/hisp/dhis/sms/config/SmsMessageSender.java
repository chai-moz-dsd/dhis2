package org.hisp.dhis.sms.config;

/*
 * Copyright (c) 2004-2016, University of Oslo
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * Neither the name of the HISP project nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import com.google.common.collect.Sets;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.dhis.message.MessageSender;
import org.hisp.dhis.program.message.DeliveryChannel;
import org.hisp.dhis.sms.outbound.GatewayResponse;
import org.hisp.dhis.system.util.SmsUtils;
import org.hisp.dhis.user.CurrentUserService;
import org.hisp.dhis.user.User;
import org.hisp.dhis.user.UserSettingKey;
import org.hisp.dhis.user.UserSettingService;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.io.Serializable;
import java.util.*;

/**
 * @author Nguyen Kim Lai
 */
public class SmsMessageSender
        implements MessageSender {
    private static final Log log = LogFactory.getLog(SmsMessageSender.class);
    private static final String REMOTE_SMS_GATEWAY_URL = "http://54.251.189.136/cgi-bin/SMS_gateway/mcel_sms_gateway.cgi";
    private static final String REMOTE_SMS_GATEWAY_UID = "mbesdash";
    private static final String REMOTE_SMS_GATEWAY_SCE = "PZD$T&+6x!%PL3@jrs3b2xNLqj@_Dxj6";
    private static final String REMOTE_SMS_GATEWAY_MESSAGE_TYPE = "MbesDashboard";

    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    @Autowired
    private GatewayAdministrationService gatewayAdminService;

    @Autowired
    private List<SmsGateway> smsGateways;

    @Autowired
    private CurrentUserService currentUserService;

    @Autowired
    private UserSettingService userSettingService;

    // -------------------------------------------------------------------------
    // Implementation methods
    // -------------------------------------------------------------------------

    @Override
    public String sendMessage(String subject, String text, String footer, User sender, Set<User> users,
                              boolean forceSend) {
        Set<User> toSendList = new HashSet<>();
        User currentUser = currentUserService.getCurrentUser();

        if (!forceSend) {
            for (User user : users) {
                if ( (currentUser.getSmsAlert() == true)
                        &&(currentUser == null
                        || !currentUser.equals(user))) {
                    if (isQualifiedReceiver(user)) {
                        toSendList.add(user);
                    }
                }
            }
        } else {
            toSendList.addAll(users);
        }

        Set<String> phoneNumbers = SmsUtils.getRecipientsPhoneNumber(toSendList);

        return sendMessage(subject, text, phoneNumbers);
    }

    @Override
    public String sendMessage(String subject, String text, String recipient) {
        Set<String> recipients = new HashSet<>();
        recipients.add(recipient);

        return sendMessage(subject, text, recipients);
    }

    @Override
    public String sendMessage(String subject, String text, Set<String> recipients) {
        SmsGatewayConfig defaultGateway = gatewayAdminService.getDefaultGateway();

        if (defaultGateway == null) {
            try {
                for (String recipient : recipients) {
                    log.info("***********************Send sms**********************");
                    log.info("Recipients = " + recipients.toString());
                    log.info("Content = " + text);
                    Map<String, String> params = new HashMap<>();
                    params.put("uid", REMOTE_SMS_GATEWAY_UID);
                    params.put("sec", REMOTE_SMS_GATEWAY_SCE);
                    params.put("destNumber", recipient);
                    params.put("message", text);
                    params.put("messageType", REMOTE_SMS_GATEWAY_MESSAGE_TYPE);
                    String result = invokeRemoteSMSGateway(REMOTE_SMS_GATEWAY_URL, params).getResponseBodyAsString();
                    log.info("result = " + result);
                }
                return "SMS is successfully sended!";
            } catch (IOException exception) {
                return ResponseHandler(GatewayResponse.NO_DEFAULT_GATEWAY).getResponseMessage();
            }
        }
        return sendMessage(subject, text, normalizePhoneNumber(recipients), gatewayAdminService.getDefaultGateway())
                .getResponseMessage();
    }

    private PostMethod invokeRemoteSMSGateway(String url, Map<String, String> params) throws IOException {
        HttpClient httpClient = new HttpClient();
        PostMethod postMethod = new PostMethod(url);
        for (Map.Entry<String, String> entry : params.entrySet()) {
            postMethod.addParameter(entry.getKey(), entry.getValue());
        }

        httpClient.executeMethod(postMethod);
        return postMethod;
    }

    @Override
    public boolean accept(Set<DeliveryChannel> channels) {
        return channels.contains(DeliveryChannel.SMS);
    }

    @Override
    public boolean isServiceReady() {
        Map<String, SmsGatewayConfig> gatewayMap = gatewayAdminService.getGatewayConfigurationMap();

        return !gatewayMap.isEmpty();
    }

    @Override
    public DeliveryChannel getDeliveryChannel() {
        return DeliveryChannel.SMS;
    }

    // -------------------------------------------------------------------------
    // Supportive methods
    // -------------------------------------------------------------------------

    private boolean isQualifiedReceiver(User user) {
        if (user.getFirstName() == null) {
            return true;
        } else {
            Serializable userSetting = userSettingService.getUserSetting(UserSettingKey.MESSAGE_SMS_NOTIFICATION,
                    user);

            return userSetting != null ? (Boolean) userSetting : false;
        }
    }

    private GatewayResponse sendMessage(String subject, String text, Set<String> recipients,
                                        SmsGatewayConfig gatewayConfig) {
        for (SmsGateway smsGateway : smsGateways) {
            if (smsGateway.accept(gatewayConfig)) {
                GatewayResponse gatewayResponse = smsGateway.send(subject, text, recipients, gatewayConfig);

                return ResponseHandler(gatewayResponse);
            }
        }

        return GatewayResponse.NO_GATWAY_CONFIGURATION;
    }

    private Set<String> normalizePhoneNumber(Set<String> to) {
        Set<String> sendTo = new HashSet<>();

        for (String phoneNumber : to) {
            if (phoneNumber.startsWith("00")) {
                phoneNumber = phoneNumber.substring(2, phoneNumber.length());
            }

            if (phoneNumber.startsWith("+")) {
                phoneNumber = phoneNumber.substring(1, phoneNumber.length());
            }

            sendTo.add(phoneNumber);
        }

        return sendTo;
    }

    private GatewayResponse ResponseHandler(GatewayResponse gatewayResponse) {
        Set<GatewayResponse> okCodes = Sets.newHashSet(GatewayResponse.RESULT_CODE_0, GatewayResponse.RESULT_CODE_200,
                GatewayResponse.RESULT_CODE_202);

        if (okCodes.contains(gatewayResponse)) {
            log.info("Message sent: ");

            return GatewayResponse.SENT;
        } else {
            log.info("Message failed: ");
            log.info("Failure cause: " + gatewayResponse.getResponseMessage());

            return gatewayResponse;
        }
    }
}
