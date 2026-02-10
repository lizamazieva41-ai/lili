/**
 * TDLib Request Types
 * Re-exported from tdlib-api.types.ts
 */

export type {
  TdlibRequest,
} from './tdlib-api.types';

// Re-export all request interfaces
export type {
  TdlibsetTdlibParametersRequest,
  TdlibsetAuthenticationPhoneNumberRequest,
  TdlibcheckAuthenticationCodeRequest,
  TdlibcheckAuthenticationPasswordRequest,
  TdlibresendAuthenticationCodeRequest,
  TdlibsendMessageRequest,
  TdlibgetMeRequest,
  TdlibgetChatsRequest,
  TdlibsearchContactsRequest,
  TdlibaddProxyRequest,
} from './tdlib-api.types';
