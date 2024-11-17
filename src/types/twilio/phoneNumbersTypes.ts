export interface PhoneNumber {
  sid: string;
  accountSid: string;
  phoneNumber: string;
  friendlyName: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
    fax: boolean;
  };
  dateCreated: string;
  dateUpdated: string;
  voiceUrl: string | null;
  voiceMethod: string;
  voiceFallbackUrl: string | null;
  voiceFallbackMethod: string;
  statusCallback: string;
  statusCallbackMethod: string;
  voiceCallerIdLookup: boolean;
  voiceApplicationSid: string | null;
  smsUrl: string;
  smsMethod: string;
  smsFallbackUrl: string;
  smsFallbackMethod: string;
  smsApplicationSid: string;
  addressRequirements: string;
  addressSid: string | null;
  emergencyStatus: string;
  emergencyAddressStatus: string;
  trunkSid: string | null;
  apiVersion: string;
  status: string;
}
