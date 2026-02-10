/**
 * TDLib TypeScript Type Definitions
 * Auto-generated from td_api.tl schema
 * DO NOT EDIT MANUALLY - This file is auto-generated
 */

// Base types
export interface TdlibError {
  "@type": "error";
  code: number;
  message: string;
}

export interface TdlibOk {
  "@type": "ok";
}

// AuthenticationCodeType variants
export type TdlibAuthenticationCodeType = TdlibauthenticationCodeTypeTelegramMessage | TdlibauthenticationCodeTypeSms | TdlibauthenticationCodeTypeSmsWord | TdlibauthenticationCodeTypeSmsPhrase | TdlibauthenticationCodeTypeCall | TdlibauthenticationCodeTypeFlashCall | TdlibauthenticationCodeTypeMissedCall | TdlibauthenticationCodeTypeFragment | TdlibauthenticationCodeTypeFirebaseAndroid | TdlibauthenticationCodeTypeFirebaseIos;

// EmailAddressAuthentication variants
export type TdlibEmailAddressAuthentication = TdlibemailAddressAuthenticationCode | TdlibemailAddressAuthenticationAppleId | TdlibemailAddressAuthenticationGoogleId;

// EmailAddressResetState variants
export type TdlibEmailAddressResetState = TdlibemailAddressResetStateAvailable | TdlibemailAddressResetStatePending;

// AuthorizationState variants
export type TdlibAuthorizationState = TdlibauthorizationStateWaitTdlibParameters | TdlibauthorizationStateWaitPhoneNumber | TdlibauthorizationStateWaitPremiumPurchase | TdlibauthorizationStateWaitEmailAddress | TdlibauthorizationStateWaitEmailCode | TdlibauthorizationStateWaitCode | TdlibauthorizationStateWaitOtherDeviceConfirmation | TdlibauthorizationStateWaitRegistration | TdlibauthorizationStateWaitPassword | TdlibauthorizationStateReady | TdlibauthorizationStateLoggingOut | TdlibauthorizationStateClosing | TdlibauthorizationStateClosed;

// FirebaseDeviceVerificationParameters variants
export type TdlibFirebaseDeviceVerificationParameters = TdlibfirebaseDeviceVerificationParametersSafetyNet | TdlibfirebaseDeviceVerificationParametersPlayIntegrity;

// InputFile variants
export type TdlibInputFile = TdlibinputFileId | TdlibinputFileRemote | TdlibinputFileLocal | TdlibinputFileGenerated;

// ThumbnailFormat variants
export type TdlibThumbnailFormat = TdlibthumbnailFormatJpeg | TdlibthumbnailFormatGif | TdlibthumbnailFormatMpeg4 | TdlibthumbnailFormatPng | TdlibthumbnailFormatTgs | TdlibthumbnailFormatWebm | TdlibthumbnailFormatWebp;

// MaskPoint variants
export type TdlibMaskPoint = TdlibmaskPointForehead | TdlibmaskPointEyes | TdlibmaskPointMouth | TdlibmaskPointChin;

// StickerFormat variants
export type TdlibStickerFormat = TdlibstickerFormatWebp | TdlibstickerFormatTgs | TdlibstickerFormatWebm;

// StickerType variants
export type TdlibStickerType = TdlibstickerTypeRegular | TdlibstickerTypeMask | TdlibstickerTypeCustomEmoji;

// StickerFullType variants
export type TdlibStickerFullType = TdlibstickerFullTypeRegular | TdlibstickerFullTypeMask | TdlibstickerFullTypeCustomEmoji;

// PollType variants
export type TdlibPollType = TdlibpollTypeRegular | TdlibpollTypeQuiz;

// ProfileTab variants
export type TdlibProfileTab = TdlibprofileTabPosts | TdlibprofileTabGifts | TdlibprofileTabMedia | TdlibprofileTabFiles | TdlibprofileTabLinks | TdlibprofileTabMusic | TdlibprofileTabVoice | TdlibprofileTabGifs;

// UserType variants
export type TdlibUserType = TdlibuserTypeRegular | TdlibuserTypeDeleted | TdlibuserTypeBot | TdlibuserTypeUnknown;

// BusinessAwayMessageSchedule variants
export type TdlibBusinessAwayMessageSchedule = TdlibbusinessAwayMessageScheduleAlways | TdlibbusinessAwayMessageScheduleOutsideOfOpeningHours | TdlibbusinessAwayMessageScheduleCustom;

// ChatPhotoStickerType variants
export type TdlibChatPhotoStickerType = TdlibchatPhotoStickerTypeRegularOrMask | TdlibchatPhotoStickerTypeCustomEmoji;

// InputChatPhoto variants
export type TdlibInputChatPhoto = TdlibinputChatPhotoPrevious | TdlibinputChatPhotoStatic | TdlibinputChatPhotoAnimation | TdlibinputChatPhotoSticker;

// GiftResalePrice variants
export type TdlibGiftResalePrice = TdlibgiftResalePriceStar | TdlibgiftResalePriceTon;

// GiftPurchaseOfferState variants
export type TdlibGiftPurchaseOfferState = TdlibgiftPurchaseOfferStatePending | TdlibgiftPurchaseOfferStateAccepted | TdlibgiftPurchaseOfferStateRejected;

// SuggestedPostPrice variants
export type TdlibSuggestedPostPrice = TdlibsuggestedPostPriceStar | TdlibsuggestedPostPriceTon;

// SuggestedPostState variants
export type TdlibSuggestedPostState = TdlibsuggestedPostStatePending | TdlibsuggestedPostStateApproved | TdlibsuggestedPostStateDeclined;

// SuggestedPostRefundReason variants
export type TdlibSuggestedPostRefundReason = TdlibsuggestedPostRefundReasonPostDeleted | TdlibsuggestedPostRefundReasonPaymentRefunded;

// StarSubscriptionType variants
export type TdlibStarSubscriptionType = TdlibstarSubscriptionTypeChannel | TdlibstarSubscriptionTypeBot;

// AffiliateType variants
export type TdlibAffiliateType = TdlibaffiliateTypeCurrentUser | TdlibaffiliateTypeBot | TdlibaffiliateTypeChannel;

// AffiliateProgramSortOrder variants
export type TdlibAffiliateProgramSortOrder = TdlibaffiliateProgramSortOrderProfitability | TdlibaffiliateProgramSortOrderCreationDate | TdlibaffiliateProgramSortOrderRevenue;

// CanSendGiftResult variants
export type TdlibCanSendGiftResult = TdlibcanSendGiftResultOk | TdlibcanSendGiftResultFail;

// UpgradedGiftOrigin variants
export type TdlibUpgradedGiftOrigin = TdlibupgradedGiftOriginUpgrade | TdlibupgradedGiftOriginTransfer | TdlibupgradedGiftOriginResale | TdlibupgradedGiftOriginBlockchain | TdlibupgradedGiftOriginPrepaidUpgrade | TdlibupgradedGiftOriginOffer;

// UpgradedGiftAttributeId variants
export type TdlibUpgradedGiftAttributeId = TdlibupgradedGiftAttributeIdModel | TdlibupgradedGiftAttributeIdSymbol | TdlibupgradedGiftAttributeIdBackdrop;

// GiftForResaleOrder variants
export type TdlibGiftForResaleOrder = TdlibgiftForResaleOrderPrice | TdlibgiftForResaleOrderPriceChangeDate | TdlibgiftForResaleOrderNumber;

// GiftResaleResult variants
export type TdlibGiftResaleResult = TdlibgiftResaleResultOk | TdlibgiftResaleResultPriceIncreased;

// SentGift variants
export type TdlibSentGift = TdlibsentGiftRegular | TdlibsentGiftUpgraded;

// AuctionState variants
export type TdlibAuctionState = TdlibauctionStateActive | TdlibauctionStateFinished;

// TransactionDirection variants
export type TdlibTransactionDirection = TdlibtransactionDirectionIncoming | TdlibtransactionDirectionOutgoing;

// StarTransactionType variants
export type TdlibStarTransactionType = TdlibstarTransactionTypePremiumBotDeposit | TdlibstarTransactionTypeAppStoreDeposit | TdlibstarTransactionTypeGooglePlayDeposit | TdlibstarTransactionTypeFragmentDeposit | TdlibstarTransactionTypeUserDeposit | TdlibstarTransactionTypeGiveawayDeposit | TdlibstarTransactionTypeFragmentWithdrawal | TdlibstarTransactionTypeTelegramAdsWithdrawal | TdlibstarTransactionTypeTelegramApiUsage | TdlibstarTransactionTypeBotPaidMediaPurchase | TdlibstarTransactionTypeBotPaidMediaSale | TdlibstarTransactionTypeChannelPaidMediaPurchase | TdlibstarTransactionTypeChannelPaidMediaSale | TdlibstarTransactionTypeBotInvoicePurchase | TdlibstarTransactionTypeBotInvoiceSale | TdlibstarTransactionTypeBotSubscriptionPurchase | TdlibstarTransactionTypeBotSubscriptionSale | TdlibstarTransactionTypeChannelSubscriptionPurchase | TdlibstarTransactionTypeChannelSubscriptionSale | TdlibstarTransactionTypeGiftAuctionBid | TdlibstarTransactionTypeGiftPurchase | TdlibstarTransactionTypeGiftPurchaseOffer | TdlibstarTransactionTypeGiftTransfer | TdlibstarTransactionTypeGiftOriginalDetailsDrop | TdlibstarTransactionTypeGiftSale | TdlibstarTransactionTypeGiftUpgrade | TdlibstarTransactionTypeGiftUpgradePurchase | TdlibstarTransactionTypeUpgradedGiftPurchase | TdlibstarTransactionTypeUpgradedGiftSale | TdlibstarTransactionTypeChannelPaidReactionSend | TdlibstarTransactionTypeChannelPaidReactionReceive | TdlibstarTransactionTypeAffiliateProgramCommission | TdlibstarTransactionTypePaidMessageSend | TdlibstarTransactionTypePaidMessageReceive | TdlibstarTransactionTypePaidGroupCallMessageSend | TdlibstarTransactionTypePaidGroupCallMessageReceive | TdlibstarTransactionTypePaidGroupCallReactionSend | TdlibstarTransactionTypePaidGroupCallReactionReceive | TdlibstarTransactionTypeSuggestedPostPaymentSend | TdlibstarTransactionTypeSuggestedPostPaymentReceive | TdlibstarTransactionTypePremiumPurchase | TdlibstarTransactionTypeBusinessBotTransferSend | TdlibstarTransactionTypeBusinessBotTransferReceive | TdlibstarTransactionTypePublicPostSearch | TdlibstarTransactionTypeUnsupported;

// TonTransactionType variants
export type TdlibTonTransactionType = TdlibtonTransactionTypeFragmentDeposit | TdlibtonTransactionTypeFragmentWithdrawal | TdlibtonTransactionTypeSuggestedPostPayment | TdlibtonTransactionTypeGiftPurchaseOffer | TdlibtonTransactionTypeUpgradedGiftPurchase | TdlibtonTransactionTypeUpgradedGiftSale | TdlibtonTransactionTypeUnsupported;

// ActiveStoryState variants
export type TdlibActiveStoryState = TdlibactiveStoryStateLive | TdlibactiveStoryStateUnread | TdlibactiveStoryStateRead;

// GiveawayParticipantStatus variants
export type TdlibGiveawayParticipantStatus = TdlibgiveawayParticipantStatusEligible | TdlibgiveawayParticipantStatusParticipating | TdlibgiveawayParticipantStatusAlreadyWasMember | TdlibgiveawayParticipantStatusAdministrator | TdlibgiveawayParticipantStatusDisallowedCountry;

// GiveawayInfo variants
export type TdlibGiveawayInfo = TdlibgiveawayInfoOngoing | TdlibgiveawayInfoCompleted;

// GiveawayPrize variants
export type TdlibGiveawayPrize = TdlibgiveawayPrizePremium | TdlibgiveawayPrizeStars;

// EmojiStatusType variants
export type TdlibEmojiStatusType = TdlibemojiStatusTypeCustomEmoji | TdlibemojiStatusTypeUpgradedGift;

// ChatMemberStatus variants
export type TdlibChatMemberStatus = TdlibchatMemberStatusCreator | TdlibchatMemberStatusAdministrator | TdlibchatMemberStatusMember | TdlibchatMemberStatusRestricted | TdlibchatMemberStatusLeft | TdlibchatMemberStatusBanned;

// ChatMembersFilter variants
export type TdlibChatMembersFilter = TdlibchatMembersFilterContacts | TdlibchatMembersFilterAdministrators | TdlibchatMembersFilterMembers | TdlibchatMembersFilterMention | TdlibchatMembersFilterRestricted | TdlibchatMembersFilterBanned | TdlibchatMembersFilterBots;

// SupergroupMembersFilter variants
export type TdlibSupergroupMembersFilter = TdlibsupergroupMembersFilterRecent | TdlibsupergroupMembersFilterContacts | TdlibsupergroupMembersFilterAdministrators | TdlibsupergroupMembersFilterSearch | TdlibsupergroupMembersFilterRestricted | TdlibsupergroupMembersFilterBanned | TdlibsupergroupMembersFilterMention | TdlibsupergroupMembersFilterBots;

// InviteLinkChatType variants
export type TdlibInviteLinkChatType = TdlibinviteLinkChatTypeBasicGroup | TdlibinviteLinkChatTypeSupergroup | TdlibinviteLinkChatTypeChannel;

// SecretChatState variants
export type TdlibSecretChatState = TdlibsecretChatStatePending | TdlibsecretChatStateReady | TdlibsecretChatStateClosed;

// MessageSender variants
export type TdlibMessageSender = TdlibmessageSenderUser | TdlibmessageSenderChat;

// MessageReadDate variants
export type TdlibMessageReadDate = TdlibmessageReadDateRead | TdlibmessageReadDateUnread | TdlibmessageReadDateTooOld | TdlibmessageReadDateUserPrivacyRestricted | TdlibmessageReadDateMyPrivacyRestricted;

// MessageOrigin variants
export type TdlibMessageOrigin = TdlibmessageOriginUser | TdlibmessageOriginHiddenUser | TdlibmessageOriginChat | TdlibmessageOriginChannel;

// ReactionType variants
export type TdlibReactionType = TdlibreactionTypeEmoji | TdlibreactionTypeCustomEmoji | TdlibreactionTypePaid;

// PaidReactionType variants
export type TdlibPaidReactionType = TdlibpaidReactionTypeRegular | TdlibpaidReactionTypeAnonymous | TdlibpaidReactionTypeChat;

// MessageTopic variants
export type TdlibMessageTopic = TdlibmessageTopicThread | TdlibmessageTopicForum | TdlibmessageTopicDirectMessages | TdlibmessageTopicSavedMessages;

// MessageEffectType variants
export type TdlibMessageEffectType = TdlibmessageEffectTypeEmojiReaction | TdlibmessageEffectTypePremiumSticker;

// MessageSendingState variants
export type TdlibMessageSendingState = TdlibmessageSendingStatePending | TdlibmessageSendingStateFailed;

// MessageReplyTo variants
export type TdlibMessageReplyTo = TdlibmessageReplyToMessage | TdlibmessageReplyToStory;

// InputMessageReplyTo variants
export type TdlibInputMessageReplyTo = TdlibinputMessageReplyToMessage | TdlibinputMessageReplyToExternalMessage | TdlibinputMessageReplyToStory;

// MessageSource variants
export type TdlibMessageSource = TdlibmessageSourceChatHistory | TdlibmessageSourceMessageThreadHistory | TdlibmessageSourceForumTopicHistory | TdlibmessageSourceDirectMessagesChatTopicHistory | TdlibmessageSourceHistoryPreview | TdlibmessageSourceChatList | TdlibmessageSourceSearch | TdlibmessageSourceChatEventLog | TdlibmessageSourceNotification | TdlibmessageSourceScreenshot | TdlibmessageSourceOther;

// ReportSponsoredResult variants
export type TdlibReportSponsoredResult = TdlibreportSponsoredResultOk | TdlibreportSponsoredResultFailed | TdlibreportSponsoredResultOptionRequired | TdlibreportSponsoredResultAdsHidden | TdlibreportSponsoredResultPremiumRequired;

// NotificationSettingsScope variants
export type TdlibNotificationSettingsScope = TdlibnotificationSettingsScopePrivateChats | TdlibnotificationSettingsScopeGroupChats | TdlibnotificationSettingsScopeChannelChats;

// ReactionNotificationSource variants
export type TdlibReactionNotificationSource = TdlibreactionNotificationSourceNone | TdlibreactionNotificationSourceContacts | TdlibreactionNotificationSourceAll;

// ChatType variants
export type TdlibChatType = TdlibchatTypePrivate | TdlibchatTypeBasicGroup | TdlibchatTypeSupergroup | TdlibchatTypeSecret;

// ChatList variants
export type TdlibChatList = TdlibchatListMain | TdlibchatListArchive | TdlibchatListFolder;

// ChatSource variants
export type TdlibChatSource = TdlibchatSourceMtprotoProxy | TdlibchatSourcePublicServiceAnnouncement;

// ChatAvailableReactions variants
export type TdlibChatAvailableReactions = TdlibchatAvailableReactionsAll | TdlibchatAvailableReactionsSome;

// PublicChatType variants
export type TdlibPublicChatType = TdlibpublicChatTypeHasUsername | TdlibpublicChatTypeIsLocationBased;

// ChatActionBar variants
export type TdlibChatActionBar = TdlibchatActionBarReportSpam | TdlibchatActionBarInviteMembers | TdlibchatActionBarReportAddBlock | TdlibchatActionBarAddContact | TdlibchatActionBarSharePhoneNumber | TdlibchatActionBarJoinRequest;

// KeyboardButtonType variants
export type TdlibKeyboardButtonType = TdlibkeyboardButtonTypeText | TdlibkeyboardButtonTypeRequestPhoneNumber | TdlibkeyboardButtonTypeRequestLocation | TdlibkeyboardButtonTypeRequestPoll | TdlibkeyboardButtonTypeRequestUsers | TdlibkeyboardButtonTypeRequestChat | TdlibkeyboardButtonTypeWebApp;

// InlineKeyboardButtonType variants
export type TdlibInlineKeyboardButtonType = TdlibinlineKeyboardButtonTypeUrl | TdlibinlineKeyboardButtonTypeLoginUrl | TdlibinlineKeyboardButtonTypeWebApp | TdlibinlineKeyboardButtonTypeCallback | TdlibinlineKeyboardButtonTypeCallbackWithPassword | TdlibinlineKeyboardButtonTypeCallbackGame | TdlibinlineKeyboardButtonTypeSwitchInline | TdlibinlineKeyboardButtonTypeBuy | TdlibinlineKeyboardButtonTypeUser | TdlibinlineKeyboardButtonTypeCopyText;

// ReplyMarkup variants
export type TdlibReplyMarkup = TdlibreplyMarkupRemoveKeyboard | TdlibreplyMarkupForceReply | TdlibreplyMarkupShowKeyboard | TdlibreplyMarkupInlineKeyboard;

// LoginUrlInfo variants
export type TdlibLoginUrlInfo = TdlibloginUrlInfoOpen | TdlibloginUrlInfoRequestConfirmation;

// WebAppOpenMode variants
export type TdlibWebAppOpenMode = TdlibwebAppOpenModeCompact | TdlibwebAppOpenModeFullSize | TdlibwebAppOpenModeFullScreen;

// SavedMessagesTopicType variants
export type TdlibSavedMessagesTopicType = TdlibsavedMessagesTopicTypeMyNotes | TdlibsavedMessagesTopicTypeAuthorHidden | TdlibsavedMessagesTopicTypeSavedFromChat;

// BuiltInTheme variants
export type TdlibBuiltInTheme = TdlibbuiltInThemeClassic | TdlibbuiltInThemeDay | TdlibbuiltInThemeNight | TdlibbuiltInThemeTinted | TdlibbuiltInThemeArctic;

// RichText variants
export type TdlibRichText = TdlibrichTextPlain | TdlibrichTextBold | TdlibrichTextItalic | TdlibrichTextUnderline | TdlibrichTextStrikethrough | TdlibrichTextFixed | TdlibrichTextUrl | TdlibrichTextEmailAddress | TdlibrichTextSubscript | TdlibrichTextSuperscript | TdlibrichTextMarked | TdlibrichTextPhoneNumber | TdlibrichTextIcon | TdlibrichTextReference | TdlibrichTextAnchor | TdlibrichTextAnchorLink | TdlibrichTexts;

// PageBlockHorizontalAlignment variants
export type TdlibPageBlockHorizontalAlignment = TdlibpageBlockHorizontalAlignmentLeft | TdlibpageBlockHorizontalAlignmentCenter | TdlibpageBlockHorizontalAlignmentRight;

// PageBlockVerticalAlignment variants
export type TdlibPageBlockVerticalAlignment = TdlibpageBlockVerticalAlignmentTop | TdlibpageBlockVerticalAlignmentMiddle | TdlibpageBlockVerticalAlignmentBottom;

// PageBlock variants
export type TdlibPageBlock = TdlibpageBlockTitle | TdlibpageBlockSubtitle | TdlibpageBlockAuthorDate | TdlibpageBlockHeader | TdlibpageBlockSubheader | TdlibpageBlockKicker | TdlibpageBlockParagraph | TdlibpageBlockPreformatted | TdlibpageBlockFooter | TdlibpageBlockDivider | TdlibpageBlockAnchor | TdlibpageBlockList | TdlibpageBlockBlockQuote | TdlibpageBlockPullQuote | TdlibpageBlockAnimation | TdlibpageBlockAudio | TdlibpageBlockPhoto | TdlibpageBlockVideo | TdlibpageBlockVoiceNote | TdlibpageBlockCover | TdlibpageBlockEmbedded | TdlibpageBlockEmbeddedPost | TdlibpageBlockCollage | TdlibpageBlockSlideshow | TdlibpageBlockChatLink | TdlibpageBlockTable | TdlibpageBlockDetails | TdlibpageBlockRelatedArticles | TdlibpageBlockMap;

// LinkPreviewAlbumMedia variants
export type TdlibLinkPreviewAlbumMedia = TdliblinkPreviewAlbumMediaPhoto | TdliblinkPreviewAlbumMediaVideo;

// LinkPreviewType variants
export type TdlibLinkPreviewType = TdliblinkPreviewTypeAlbum | TdliblinkPreviewTypeAnimation | TdliblinkPreviewTypeApp | TdliblinkPreviewTypeArticle | TdliblinkPreviewTypeAudio | TdliblinkPreviewTypeBackground | TdliblinkPreviewTypeChannelBoost | TdliblinkPreviewTypeChat | TdliblinkPreviewTypeDirectMessagesChat | TdliblinkPreviewTypeDocument | TdliblinkPreviewTypeEmbeddedAnimationPlayer | TdliblinkPreviewTypeEmbeddedAudioPlayer | TdliblinkPreviewTypeEmbeddedVideoPlayer | TdliblinkPreviewTypeExternalAudio | TdliblinkPreviewTypeExternalVideo | TdliblinkPreviewTypeGiftAuction | TdliblinkPreviewTypeGiftCollection | TdliblinkPreviewTypeGroupCall | TdliblinkPreviewTypeInvoice | TdliblinkPreviewTypeLiveStory | TdliblinkPreviewTypeMessage | TdliblinkPreviewTypePhoto | TdliblinkPreviewTypePremiumGiftCode | TdliblinkPreviewTypeShareableChatFolder | TdliblinkPreviewTypeSticker | TdliblinkPreviewTypeStickerSet | TdliblinkPreviewTypeStory | TdliblinkPreviewTypeStoryAlbum | TdliblinkPreviewTypeSupergroupBoost | TdliblinkPreviewTypeTheme | TdliblinkPreviewTypeUnsupported | TdliblinkPreviewTypeUpgradedGift | TdliblinkPreviewTypeUser | TdliblinkPreviewTypeVideo | TdliblinkPreviewTypeVideoChat | TdliblinkPreviewTypeVideoNote | TdliblinkPreviewTypeVoiceNote | TdliblinkPreviewTypeWebApp;

// CollectibleItemType variants
export type TdlibCollectibleItemType = TdlibcollectibleItemTypeUsername | TdlibcollectibleItemTypePhoneNumber;

// InputCredentials variants
export type TdlibInputCredentials = TdlibinputCredentialsSaved | TdlibinputCredentialsNew | TdlibinputCredentialsApplePay | TdlibinputCredentialsGooglePay;

// PaymentProvider variants
export type TdlibPaymentProvider = TdlibpaymentProviderSmartGlocal | TdlibpaymentProviderStripe | TdlibpaymentProviderOther;

// PaymentFormType variants
export type TdlibPaymentFormType = TdlibpaymentFormTypeRegular | TdlibpaymentFormTypeStars | TdlibpaymentFormTypeStarSubscription;

// PaymentReceiptType variants
export type TdlibPaymentReceiptType = TdlibpaymentReceiptTypeRegular | TdlibpaymentReceiptTypeStars;

// InputInvoice variants
export type TdlibInputInvoice = TdlibinputInvoiceMessage | TdlibinputInvoiceName | TdlibinputInvoiceTelegram;

// PaidMedia variants
export type TdlibPaidMedia = TdlibpaidMediaPreview | TdlibpaidMediaPhoto | TdlibpaidMediaVideo | TdlibpaidMediaUnsupported;

// PassportElementType variants
export type TdlibPassportElementType = TdlibpassportElementTypePersonalDetails | TdlibpassportElementTypePassport | TdlibpassportElementTypeDriverLicense | TdlibpassportElementTypeIdentityCard | TdlibpassportElementTypeInternalPassport | TdlibpassportElementTypeAddress | TdlibpassportElementTypeUtilityBill | TdlibpassportElementTypeBankStatement | TdlibpassportElementTypeRentalAgreement | TdlibpassportElementTypePassportRegistration | TdlibpassportElementTypeTemporaryRegistration | TdlibpassportElementTypePhoneNumber | TdlibpassportElementTypeEmailAddress;

// PassportElement variants
export type TdlibPassportElement = TdlibpassportElementPersonalDetails | TdlibpassportElementPassport | TdlibpassportElementDriverLicense | TdlibpassportElementIdentityCard | TdlibpassportElementInternalPassport | TdlibpassportElementAddress | TdlibpassportElementUtilityBill | TdlibpassportElementBankStatement | TdlibpassportElementRentalAgreement | TdlibpassportElementPassportRegistration | TdlibpassportElementTemporaryRegistration | TdlibpassportElementPhoneNumber | TdlibpassportElementEmailAddress;

// InputPassportElement variants
export type TdlibInputPassportElement = TdlibinputPassportElementPersonalDetails | TdlibinputPassportElementPassport | TdlibinputPassportElementDriverLicense | TdlibinputPassportElementIdentityCard | TdlibinputPassportElementInternalPassport | TdlibinputPassportElementAddress | TdlibinputPassportElementUtilityBill | TdlibinputPassportElementBankStatement | TdlibinputPassportElementRentalAgreement | TdlibinputPassportElementPassportRegistration | TdlibinputPassportElementTemporaryRegistration | TdlibinputPassportElementPhoneNumber | TdlibinputPassportElementEmailAddress;

// PassportElementErrorSource variants
export type TdlibPassportElementErrorSource = TdlibpassportElementErrorSourceUnspecified | TdlibpassportElementErrorSourceDataField | TdlibpassportElementErrorSourceFrontSide | TdlibpassportElementErrorSourceReverseSide | TdlibpassportElementErrorSourceSelfie | TdlibpassportElementErrorSourceTranslationFile | TdlibpassportElementErrorSourceTranslationFiles | TdlibpassportElementErrorSourceFile | TdlibpassportElementErrorSourceFiles;

// InputPassportElementErrorSource variants
export type TdlibInputPassportElementErrorSource = TdlibinputPassportElementErrorSourceUnspecified | TdlibinputPassportElementErrorSourceDataField | TdlibinputPassportElementErrorSourceFrontSide | TdlibinputPassportElementErrorSourceReverseSide | TdlibinputPassportElementErrorSourceSelfie | TdlibinputPassportElementErrorSourceTranslationFile | TdlibinputPassportElementErrorSourceTranslationFiles | TdlibinputPassportElementErrorSourceFile | TdlibinputPassportElementErrorSourceFiles;

// MessageContent variants
export type TdlibMessageContent = TdlibmessageText | TdlibmessageAnimation | TdlibmessageAudio | TdlibmessageDocument | TdlibmessagePaidMedia | TdlibmessagePhoto | TdlibmessageSticker | TdlibmessageVideo | TdlibmessageVideoNote | TdlibmessageVoiceNote | TdlibmessageExpiredPhoto | TdlibmessageExpiredVideo | TdlibmessageExpiredVideoNote | TdlibmessageExpiredVoiceNote | TdlibmessageLocation | TdlibmessageVenue | TdlibmessageContact | TdlibmessageAnimatedEmoji | TdlibmessageDice | TdlibmessageGame | TdlibmessagePoll | TdlibmessageStakeDice | TdlibmessageStory | TdlibmessageChecklist | TdlibmessageInvoice | TdlibmessageCall | TdlibmessageGroupCall | TdlibmessageVideoChatScheduled | TdlibmessageVideoChatStarted | TdlibmessageVideoChatEnded | TdlibmessageInviteVideoChatParticipants | TdlibmessageBasicGroupChatCreate | TdlibmessageSupergroupChatCreate | TdlibmessageChatChangeTitle | TdlibmessageChatChangePhoto | TdlibmessageChatDeletePhoto | TdlibmessageChatAddMembers | TdlibmessageChatJoinByLink | TdlibmessageChatJoinByRequest | TdlibmessageChatDeleteMember | TdlibmessageChatUpgradeTo | TdlibmessageChatUpgradeFrom | TdlibmessagePinMessage | TdlibmessageScreenshotTaken | TdlibmessageChatSetBackground | TdlibmessageChatSetTheme | TdlibmessageChatSetMessageAutoDeleteTime | TdlibmessageChatBoost | TdlibmessageForumTopicCreated | TdlibmessageForumTopicEdited | TdlibmessageForumTopicIsClosedToggled | TdlibmessageForumTopicIsHiddenToggled | TdlibmessageSuggestProfilePhoto | TdlibmessageSuggestBirthdate | TdlibmessageCustomServiceAction | TdlibmessageGameScore | TdlibmessagePaymentSuccessful | TdlibmessagePaymentSuccessfulBot | TdlibmessagePaymentRefunded | TdlibmessageGiftedPremium | TdlibmessagePremiumGiftCode | TdlibmessageGiveawayCreated | TdlibmessageGiveaway | TdlibmessageGiveawayCompleted | TdlibmessageGiveawayWinners | TdlibmessageGiftedStars | TdlibmessageGiftedTon | TdlibmessageGiveawayPrizeStars | TdlibmessageGift | TdlibmessageUpgradedGift | TdlibmessageRefundedUpgradedGift | TdlibmessageUpgradedGiftPurchaseOffer | TdlibmessageUpgradedGiftPurchaseOfferRejected | TdlibmessagePaidMessagesRefunded | TdlibmessagePaidMessagePriceChanged | TdlibmessageDirectMessagePriceChanged | TdlibmessageChecklistTasksDone | TdlibmessageChecklistTasksAdded | TdlibmessageSuggestedPostApprovalFailed | TdlibmessageSuggestedPostApproved | TdlibmessageSuggestedPostDeclined | TdlibmessageSuggestedPostPaid | TdlibmessageSuggestedPostRefunded | TdlibmessageContactRegistered | TdlibmessageUsersShared | TdlibmessageChatShared | TdlibmessageBotWriteAccessAllowed | TdlibmessageWebAppDataSent | TdlibmessageWebAppDataReceived | TdlibmessagePassportDataSent | TdlibmessagePassportDataReceived | TdlibmessageProximityAlertTriggered | TdlibmessageUnsupported;

// TextEntityType variants
export type TdlibTextEntityType = TdlibtextEntityTypeMention | TdlibtextEntityTypeHashtag | TdlibtextEntityTypeCashtag | TdlibtextEntityTypeBotCommand | TdlibtextEntityTypeUrl | TdlibtextEntityTypeEmailAddress | TdlibtextEntityTypePhoneNumber | TdlibtextEntityTypeBankCardNumber | TdlibtextEntityTypeBold | TdlibtextEntityTypeItalic | TdlibtextEntityTypeUnderline | TdlibtextEntityTypeStrikethrough | TdlibtextEntityTypeSpoiler | TdlibtextEntityTypeCode | TdlibtextEntityTypePre | TdlibtextEntityTypePreCode | TdlibtextEntityTypeBlockQuote | TdlibtextEntityTypeExpandableBlockQuote | TdlibtextEntityTypeTextUrl | TdlibtextEntityTypeMentionName | TdlibtextEntityTypeCustomEmoji | TdlibtextEntityTypeMediaTimestamp;

// InputPaidMediaType variants
export type TdlibInputPaidMediaType = TdlibinputPaidMediaTypePhoto | TdlibinputPaidMediaTypeVideo;

// MessageSchedulingState variants
export type TdlibMessageSchedulingState = TdlibmessageSchedulingStateSendAtDate | TdlibmessageSchedulingStateSendWhenOnline | TdlibmessageSchedulingStateSendWhenVideoProcessed;

// MessageSelfDestructType variants
export type TdlibMessageSelfDestructType = TdlibmessageSelfDestructTypeTimer | TdlibmessageSelfDestructTypeImmediately;

// InputMessageContent variants
export type TdlibInputMessageContent = TdlibinputMessageText | TdlibinputMessageAnimation | TdlibinputMessageAudio | TdlibinputMessageDocument | TdlibinputMessagePaidMedia | TdlibinputMessagePhoto | TdlibinputMessageSticker | TdlibinputMessageVideo | TdlibinputMessageVideoNote | TdlibinputMessageVoiceNote | TdlibinputMessageLocation | TdlibinputMessageVenue | TdlibinputMessageContact | TdlibinputMessageDice | TdlibinputMessageGame | TdlibinputMessageInvoice | TdlibinputMessagePoll | TdlibinputMessageStakeDice | TdlibinputMessageStory | TdlibinputMessageChecklist | TdlibinputMessageForwarded;

// SearchMessagesFilter variants
export type TdlibSearchMessagesFilter = TdlibsearchMessagesFilterEmpty | TdlibsearchMessagesFilterAnimation | TdlibsearchMessagesFilterAudio | TdlibsearchMessagesFilterDocument | TdlibsearchMessagesFilterPhoto | TdlibsearchMessagesFilterVideo | TdlibsearchMessagesFilterVoiceNote | TdlibsearchMessagesFilterPhotoAndVideo | TdlibsearchMessagesFilterUrl | TdlibsearchMessagesFilterChatPhoto | TdlibsearchMessagesFilterVideoNote | TdlibsearchMessagesFilterVoiceAndVideoNote | TdlibsearchMessagesFilterMention | TdlibsearchMessagesFilterUnreadMention | TdlibsearchMessagesFilterUnreadReaction | TdlibsearchMessagesFilterFailedToSend | TdlibsearchMessagesFilterPinned;

// SearchMessagesChatTypeFilter variants
export type TdlibSearchMessagesChatTypeFilter = TdlibsearchMessagesChatTypeFilterPrivate | TdlibsearchMessagesChatTypeFilterGroup | TdlibsearchMessagesChatTypeFilterChannel;

// ChatAction variants
export type TdlibChatAction = TdlibchatActionTyping | TdlibchatActionRecordingVideo | TdlibchatActionUploadingVideo | TdlibchatActionRecordingVoiceNote | TdlibchatActionUploadingVoiceNote | TdlibchatActionUploadingPhoto | TdlibchatActionUploadingDocument | TdlibchatActionChoosingSticker | TdlibchatActionChoosingLocation | TdlibchatActionChoosingContact | TdlibchatActionStartPlayingGame | TdlibchatActionRecordingVideoNote | TdlibchatActionUploadingVideoNote | TdlibchatActionWatchingAnimations | TdlibchatActionCancel;

// UserStatus variants
export type TdlibUserStatus = TdlibuserStatusEmpty | TdlibuserStatusOnline | TdlibuserStatusOffline | TdlibuserStatusRecently | TdlibuserStatusLastWeek | TdlibuserStatusLastMonth;

// EmojiCategorySource variants
export type TdlibEmojiCategorySource = TdlibemojiCategorySourceSearch | TdlibemojiCategorySourcePremium;

// EmojiCategoryType variants
export type TdlibEmojiCategoryType = TdlibemojiCategoryTypeDefault | TdlibemojiCategoryTypeRegularStickers | TdlibemojiCategoryTypeEmojiStatus | TdlibemojiCategoryTypeChatPhoto;

// StoryAreaType variants
export type TdlibStoryAreaType = TdlibstoryAreaTypeLocation | TdlibstoryAreaTypeVenue | TdlibstoryAreaTypeSuggestedReaction | TdlibstoryAreaTypeMessage | TdlibstoryAreaTypeLink | TdlibstoryAreaTypeWeather | TdlibstoryAreaTypeUpgradedGift;

// InputStoryAreaType variants
export type TdlibInputStoryAreaType = TdlibinputStoryAreaTypeLocation | TdlibinputStoryAreaTypeFoundVenue | TdlibinputStoryAreaTypePreviousVenue | TdlibinputStoryAreaTypeSuggestedReaction | TdlibinputStoryAreaTypeMessage | TdlibinputStoryAreaTypeLink | TdlibinputStoryAreaTypeWeather | TdlibinputStoryAreaTypeUpgradedGift;

// StoryContent variants
export type TdlibStoryContent = TdlibstoryContentPhoto | TdlibstoryContentVideo | TdlibstoryContentLive | TdlibstoryContentUnsupported;

// InputStoryContent variants
export type TdlibInputStoryContent = TdlibinputStoryContentPhoto | TdlibinputStoryContentVideo;

// StoryList variants
export type TdlibStoryList = TdlibstoryListMain | TdlibstoryListArchive;

// StoryOrigin variants
export type TdlibStoryOrigin = TdlibstoryOriginPublicStory | TdlibstoryOriginHiddenUser;

// StoryInteractionType variants
export type TdlibStoryInteractionType = TdlibstoryInteractionTypeView | TdlibstoryInteractionTypeForward | TdlibstoryInteractionTypeRepost;

// PublicForward variants
export type TdlibPublicForward = TdlibpublicForwardMessage | TdlibpublicForwardStory;

// ChatBoostSource variants
export type TdlibChatBoostSource = TdlibchatBoostSourceGiftCode | TdlibchatBoostSourceGiveaway | TdlibchatBoostSourcePremium;

// ResendCodeReason variants
export type TdlibResendCodeReason = TdlibresendCodeReasonUserRequest | TdlibresendCodeReasonVerificationFailed;

// CallDiscardReason variants
export type TdlibCallDiscardReason = TdlibcallDiscardReasonEmpty | TdlibcallDiscardReasonMissed | TdlibcallDiscardReasonDeclined | TdlibcallDiscardReasonDisconnected | TdlibcallDiscardReasonHungUp | TdlibcallDiscardReasonUpgradeToGroupCall;

// CallServerType variants
export type TdlibCallServerType = TdlibcallServerTypeTelegramReflector | TdlibcallServerTypeWebrtc;

// CallState variants
export type TdlibCallState = TdlibcallStatePending | TdlibcallStateExchangingKeys | TdlibcallStateReady | TdlibcallStateHangingUp | TdlibcallStateDiscarded | TdlibcallStateError;

// GroupCallVideoQuality variants
export type TdlibGroupCallVideoQuality = TdlibgroupCallVideoQualityThumbnail | TdlibgroupCallVideoQualityMedium | TdlibgroupCallVideoQualityFull;

// InviteGroupCallParticipantResult variants
export type TdlibInviteGroupCallParticipantResult = TdlibinviteGroupCallParticipantResultUserPrivacyRestricted | TdlibinviteGroupCallParticipantResultUserAlreadyParticipant | TdlibinviteGroupCallParticipantResultUserWasBanned | TdlibinviteGroupCallParticipantResultSuccess;

// GroupCallDataChannel variants
export type TdlibGroupCallDataChannel = TdlibgroupCallDataChannelMain | TdlibgroupCallDataChannelScreenSharing;

// InputGroupCall variants
export type TdlibInputGroupCall = TdlibinputGroupCallLink | TdlibinputGroupCallMessage;

// CallProblem variants
export type TdlibCallProblem = TdlibcallProblemEcho | TdlibcallProblemNoise | TdlibcallProblemInterruptions | TdlibcallProblemDistortedSpeech | TdlibcallProblemSilentLocal | TdlibcallProblemSilentRemote | TdlibcallProblemDropped | TdlibcallProblemDistortedVideo | TdlibcallProblemPixelatedVideo;

// FirebaseAuthenticationSettings variants
export type TdlibFirebaseAuthenticationSettings = TdlibfirebaseAuthenticationSettingsAndroid | TdlibfirebaseAuthenticationSettingsIos;

// ReactionUnavailabilityReason variants
export type TdlibReactionUnavailabilityReason = TdlibreactionUnavailabilityReasonAnonymousAdministrator | TdlibreactionUnavailabilityReasonGuest;

// DiceStickers variants
export type TdlibDiceStickers = TdlibdiceStickersRegular | TdlibdiceStickersSlotMachine;

// SpeechRecognitionResult variants
export type TdlibSpeechRecognitionResult = TdlibspeechRecognitionResultPending | TdlibspeechRecognitionResultText | TdlibspeechRecognitionResultError;

// BotWriteAccessAllowReason variants
export type TdlibBotWriteAccessAllowReason = TdlibbotWriteAccessAllowReasonConnectedWebsite | TdlibbotWriteAccessAllowReasonAddedToAttachmentMenu | TdlibbotWriteAccessAllowReasonLaunchedWebApp | TdlibbotWriteAccessAllowReasonAcceptedRequest;

// TargetChat variants
export type TdlibTargetChat = TdlibtargetChatCurrent | TdlibtargetChatChosen | TdlibtargetChatInternalLink;

// InputInlineQueryResult variants
export type TdlibInputInlineQueryResult = TdlibinputInlineQueryResultAnimation | TdlibinputInlineQueryResultArticle | TdlibinputInlineQueryResultAudio | TdlibinputInlineQueryResultContact | TdlibinputInlineQueryResultDocument | TdlibinputInlineQueryResultGame | TdlibinputInlineQueryResultLocation | TdlibinputInlineQueryResultPhoto | TdlibinputInlineQueryResultSticker | TdlibinputInlineQueryResultVenue | TdlibinputInlineQueryResultVideo | TdlibinputInlineQueryResultVoiceNote;

// InlineQueryResult variants
export type TdlibInlineQueryResult = TdlibinlineQueryResultArticle | TdlibinlineQueryResultContact | TdlibinlineQueryResultLocation | TdlibinlineQueryResultVenue | TdlibinlineQueryResultGame | TdlibinlineQueryResultAnimation | TdlibinlineQueryResultAudio | TdlibinlineQueryResultDocument | TdlibinlineQueryResultPhoto | TdlibinlineQueryResultSticker | TdlibinlineQueryResultVideo | TdlibinlineQueryResultVoiceNote;

// InlineQueryResultsButtonType variants
export type TdlibInlineQueryResultsButtonType = TdlibinlineQueryResultsButtonTypeStartBot | TdlibinlineQueryResultsButtonTypeWebApp;

// CallbackQueryPayload variants
export type TdlibCallbackQueryPayload = TdlibcallbackQueryPayloadData | TdlibcallbackQueryPayloadDataWithPassword | TdlibcallbackQueryPayloadGame;

// ChatEventAction variants
export type TdlibChatEventAction = TdlibchatEventMessageEdited | TdlibchatEventMessageDeleted | TdlibchatEventMessagePinned | TdlibchatEventMessageUnpinned | TdlibchatEventPollStopped | TdlibchatEventMemberJoined | TdlibchatEventMemberJoinedByInviteLink | TdlibchatEventMemberJoinedByRequest | TdlibchatEventMemberInvited | TdlibchatEventMemberLeft | TdlibchatEventMemberPromoted | TdlibchatEventMemberRestricted | TdlibchatEventMemberSubscriptionExtended | TdlibchatEventAvailableReactionsChanged | TdlibchatEventBackgroundChanged | TdlibchatEventDescriptionChanged | TdlibchatEventEmojiStatusChanged | TdlibchatEventLinkedChatChanged | TdlibchatEventLocationChanged | TdlibchatEventMessageAutoDeleteTimeChanged | TdlibchatEventPermissionsChanged | TdlibchatEventPhotoChanged | TdlibchatEventSlowModeDelayChanged | TdlibchatEventStickerSetChanged | TdlibchatEventCustomEmojiStickerSetChanged | TdlibchatEventTitleChanged | TdlibchatEventUsernameChanged | TdlibchatEventActiveUsernamesChanged | TdlibchatEventAccentColorChanged | TdlibchatEventProfileAccentColorChanged | TdlibchatEventHasProtectedContentToggled | TdlibchatEventInvitesToggled | TdlibchatEventIsAllHistoryAvailableToggled | TdlibchatEventHasAggressiveAntiSpamEnabledToggled | TdlibchatEventSignMessagesToggled | TdlibchatEventShowMessageSenderToggled | TdlibchatEventAutomaticTranslationToggled | TdlibchatEventInviteLinkEdited | TdlibchatEventInviteLinkRevoked | TdlibchatEventInviteLinkDeleted | TdlibchatEventVideoChatCreated | TdlibchatEventVideoChatEnded | TdlibchatEventVideoChatMuteNewParticipantsToggled | TdlibchatEventVideoChatParticipantIsMutedToggled | TdlibchatEventVideoChatParticipantVolumeLevelChanged | TdlibchatEventIsForumToggled | TdlibchatEventForumTopicCreated | TdlibchatEventForumTopicEdited | TdlibchatEventForumTopicToggleIsClosed | TdlibchatEventForumTopicToggleIsHidden | TdlibchatEventForumTopicDeleted | TdlibchatEventForumTopicPinned;

// LanguagePackStringValue variants
export type TdlibLanguagePackStringValue = TdliblanguagePackStringValueOrdinary | TdliblanguagePackStringValuePluralized | TdliblanguagePackStringValueDeleted;

// PremiumLimitType variants
export type TdlibPremiumLimitType = TdlibpremiumLimitTypeSupergroupCount | TdlibpremiumLimitTypePinnedChatCount | TdlibpremiumLimitTypeCreatedPublicChatCount | TdlibpremiumLimitTypeSavedAnimationCount | TdlibpremiumLimitTypeFavoriteStickerCount | TdlibpremiumLimitTypeChatFolderCount | TdlibpremiumLimitTypeChatFolderChosenChatCount | TdlibpremiumLimitTypePinnedArchivedChatCount | TdlibpremiumLimitTypePinnedSavedMessagesTopicCount | TdlibpremiumLimitTypeCaptionLength | TdlibpremiumLimitTypeBioLength | TdlibpremiumLimitTypeChatFolderInviteLinkCount | TdlibpremiumLimitTypeShareableChatFolderCount | TdlibpremiumLimitTypeActiveStoryCount | TdlibpremiumLimitTypeWeeklyPostedStoryCount | TdlibpremiumLimitTypeMonthlyPostedStoryCount | TdlibpremiumLimitTypeStoryCaptionLength | TdlibpremiumLimitTypeStorySuggestedReactionAreaCount | TdlibpremiumLimitTypeSimilarChatCount;

// PremiumFeature variants
export type TdlibPremiumFeature = TdlibpremiumFeatureIncreasedLimits | TdlibpremiumFeatureIncreasedUploadFileSize | TdlibpremiumFeatureImprovedDownloadSpeed | TdlibpremiumFeatureVoiceRecognition | TdlibpremiumFeatureDisabledAds | TdlibpremiumFeatureUniqueReactions | TdlibpremiumFeatureUniqueStickers | TdlibpremiumFeatureCustomEmoji | TdlibpremiumFeatureAdvancedChatManagement | TdlibpremiumFeatureProfileBadge | TdlibpremiumFeatureEmojiStatus | TdlibpremiumFeatureAnimatedProfilePhoto | TdlibpremiumFeatureForumTopicIcon | TdlibpremiumFeatureAppIcons | TdlibpremiumFeatureRealTimeChatTranslation | TdlibpremiumFeatureUpgradedStories | TdlibpremiumFeatureChatBoost | TdlibpremiumFeatureAccentColor | TdlibpremiumFeatureBackgroundForBoth | TdlibpremiumFeatureSavedMessagesTags | TdlibpremiumFeatureMessagePrivacy | TdlibpremiumFeatureLastSeenTimes | TdlibpremiumFeatureBusiness | TdlibpremiumFeatureMessageEffects | TdlibpremiumFeatureChecklists | TdlibpremiumFeaturePaidMessages;

// BusinessFeature variants
export type TdlibBusinessFeature = TdlibbusinessFeatureLocation | TdlibbusinessFeatureOpeningHours | TdlibbusinessFeatureQuickReplies | TdlibbusinessFeatureGreetingMessage | TdlibbusinessFeatureAwayMessage | TdlibbusinessFeatureAccountLinks | TdlibbusinessFeatureStartPage | TdlibbusinessFeatureBots | TdlibbusinessFeatureEmojiStatus | TdlibbusinessFeatureChatFolderTags | TdlibbusinessFeatureUpgradedStories;

// PremiumStoryFeature variants
export type TdlibPremiumStoryFeature = TdlibpremiumStoryFeaturePriorityOrder | TdlibpremiumStoryFeatureStealthMode | TdlibpremiumStoryFeaturePermanentViewsHistory | TdlibpremiumStoryFeatureCustomExpirationDuration | TdlibpremiumStoryFeatureSaveStories | TdlibpremiumStoryFeatureLinksAndFormatting | TdlibpremiumStoryFeatureVideoQuality;

// PremiumSource variants
export type TdlibPremiumSource = TdlibpremiumSourceLimitExceeded | TdlibpremiumSourceFeature | TdlibpremiumSourceBusinessFeature | TdlibpremiumSourceStoryFeature | TdlibpremiumSourceLink | TdlibpremiumSourceSettings;

// StorePaymentPurpose variants
export type TdlibStorePaymentPurpose = TdlibstorePaymentPurposePremiumSubscription | TdlibstorePaymentPurposePremiumGift | TdlibstorePaymentPurposePremiumGiftCodes | TdlibstorePaymentPurposePremiumGiveaway | TdlibstorePaymentPurposeStarGiveaway | TdlibstorePaymentPurposeStars | TdlibstorePaymentPurposeGiftedStars;

// StoreTransaction variants
export type TdlibStoreTransaction = TdlibstoreTransactionAppStore | TdlibstoreTransactionGooglePlay;

// TelegramPaymentPurpose variants
export type TdlibTelegramPaymentPurpose = TdlibtelegramPaymentPurposePremiumGift | TdlibtelegramPaymentPurposePremiumGiftCodes | TdlibtelegramPaymentPurposePremiumGiveaway | TdlibtelegramPaymentPurposeStars | TdlibtelegramPaymentPurposeGiftedStars | TdlibtelegramPaymentPurposeStarGiveaway | TdlibtelegramPaymentPurposeJoinChat;

// DeviceToken variants
export type TdlibDeviceToken = TdlibdeviceTokenFirebaseCloudMessaging | TdlibdeviceTokenApplePush | TdlibdeviceTokenApplePushVoIP | TdlibdeviceTokenWindowsPush | TdlibdeviceTokenMicrosoftPush | TdlibdeviceTokenMicrosoftPushVoIP | TdlibdeviceTokenWebPush | TdlibdeviceTokenSimplePush | TdlibdeviceTokenUbuntuPush | TdlibdeviceTokenBlackBerryPush | TdlibdeviceTokenTizenPush | TdlibdeviceTokenHuaweiPush;

// BackgroundFill variants
export type TdlibBackgroundFill = TdlibbackgroundFillSolid | TdlibbackgroundFillGradient | TdlibbackgroundFillFreeformGradient;

// BackgroundType variants
export type TdlibBackgroundType = TdlibbackgroundTypeWallpaper | TdlibbackgroundTypePattern | TdlibbackgroundTypeFill | TdlibbackgroundTypeChatTheme;

// InputBackground variants
export type TdlibInputBackground = TdlibinputBackgroundLocal | TdlibinputBackgroundRemote | TdlibinputBackgroundPrevious;

// ChatTheme variants
export type TdlibChatTheme = TdlibchatThemeEmoji | TdlibchatThemeGift;

// InputChatTheme variants
export type TdlibInputChatTheme = TdlibinputChatThemeEmoji | TdlibinputChatThemeGift;

// CanPostStoryResult variants
export type TdlibCanPostStoryResult = TdlibcanPostStoryResultOk | TdlibcanPostStoryResultPremiumNeeded | TdlibcanPostStoryResultBoostNeeded | TdlibcanPostStoryResultActiveStoryLimitExceeded | TdlibcanPostStoryResultWeeklyLimitExceeded | TdlibcanPostStoryResultMonthlyLimitExceeded | TdlibcanPostStoryResultLiveStoryIsActive;

// StartLiveStoryResult variants
export type TdlibStartLiveStoryResult = TdlibstartLiveStoryResultOk | TdlibstartLiveStoryResultFail;

// CanTransferOwnershipResult variants
export type TdlibCanTransferOwnershipResult = TdlibcanTransferOwnershipResultOk | TdlibcanTransferOwnershipResultPasswordNeeded | TdlibcanTransferOwnershipResultPasswordTooFresh | TdlibcanTransferOwnershipResultSessionTooFresh;

// CheckChatUsernameResult variants
export type TdlibCheckChatUsernameResult = TdlibcheckChatUsernameResultOk | TdlibcheckChatUsernameResultUsernameInvalid | TdlibcheckChatUsernameResultUsernameOccupied | TdlibcheckChatUsernameResultUsernamePurchasable | TdlibcheckChatUsernameResultPublicChatsTooMany | TdlibcheckChatUsernameResultPublicGroupsUnavailable;

// CheckStickerSetNameResult variants
export type TdlibCheckStickerSetNameResult = TdlibcheckStickerSetNameResultOk | TdlibcheckStickerSetNameResultNameInvalid | TdlibcheckStickerSetNameResultNameOccupied;

// ResetPasswordResult variants
export type TdlibResetPasswordResult = TdlibresetPasswordResultOk | TdlibresetPasswordResultPending | TdlibresetPasswordResultDeclined;

// MessageFileType variants
export type TdlibMessageFileType = TdlibmessageFileTypePrivate | TdlibmessageFileTypeGroup | TdlibmessageFileTypeUnknown;

// PushMessageContent variants
export type TdlibPushMessageContent = TdlibpushMessageContentHidden | TdlibpushMessageContentAnimation | TdlibpushMessageContentAudio | TdlibpushMessageContentContact | TdlibpushMessageContentContactRegistered | TdlibpushMessageContentDocument | TdlibpushMessageContentGame | TdlibpushMessageContentGameScore | TdlibpushMessageContentInvoice | TdlibpushMessageContentLocation | TdlibpushMessageContentPaidMedia | TdlibpushMessageContentPhoto | TdlibpushMessageContentPoll | TdlibpushMessageContentPremiumGiftCode | TdlibpushMessageContentGiveaway | TdlibpushMessageContentGift | TdlibpushMessageContentUpgradedGift | TdlibpushMessageContentScreenshotTaken | TdlibpushMessageContentSticker | TdlibpushMessageContentStory | TdlibpushMessageContentText | TdlibpushMessageContentChecklist | TdlibpushMessageContentVideo | TdlibpushMessageContentVideoNote | TdlibpushMessageContentVoiceNote | TdlibpushMessageContentBasicGroupChatCreate | TdlibpushMessageContentVideoChatStarted | TdlibpushMessageContentVideoChatEnded | TdlibpushMessageContentInviteVideoChatParticipants | TdlibpushMessageContentChatAddMembers | TdlibpushMessageContentChatChangePhoto | TdlibpushMessageContentChatChangeTitle | TdlibpushMessageContentChatSetBackground | TdlibpushMessageContentChatSetTheme | TdlibpushMessageContentChatDeleteMember | TdlibpushMessageContentChatJoinByLink | TdlibpushMessageContentChatJoinByRequest | TdlibpushMessageContentRecurringPayment | TdlibpushMessageContentSuggestProfilePhoto | TdlibpushMessageContentSuggestBirthdate | TdlibpushMessageContentProximityAlertTriggered | TdlibpushMessageContentChecklistTasksAdded | TdlibpushMessageContentChecklistTasksDone | TdlibpushMessageContentMessageForwards | TdlibpushMessageContentMediaAlbum;

// NotificationType variants
export type TdlibNotificationType = TdlibnotificationTypeNewMessage | TdlibnotificationTypeNewSecretChat | TdlibnotificationTypeNewCall | TdlibnotificationTypeNewPushMessage;

// NotificationGroupType variants
export type TdlibNotificationGroupType = TdlibnotificationGroupTypeMessages | TdlibnotificationGroupTypeMentions | TdlibnotificationGroupTypeSecretChat | TdlibnotificationGroupTypeCalls;

// OptionValue variants
export type TdlibOptionValue = TdliboptionValueBoolean | TdliboptionValueEmpty | TdliboptionValueInteger | TdliboptionValueString;

// JsonValue variants
export type TdlibJsonValue = TdlibjsonValueNull | TdlibjsonValueBoolean | TdlibjsonValueNumber | TdlibjsonValueString | TdlibjsonValueArray | TdlibjsonValueObject;

// StoryPrivacySettings variants
export type TdlibStoryPrivacySettings = TdlibstoryPrivacySettingsEveryone | TdlibstoryPrivacySettingsContacts | TdlibstoryPrivacySettingsCloseFriends | TdlibstoryPrivacySettingsSelectedUsers;

// UserPrivacySettingRule variants
export type TdlibUserPrivacySettingRule = TdlibuserPrivacySettingRuleAllowAll | TdlibuserPrivacySettingRuleAllowContacts | TdlibuserPrivacySettingRuleAllowBots | TdlibuserPrivacySettingRuleAllowPremiumUsers | TdlibuserPrivacySettingRuleAllowUsers | TdlibuserPrivacySettingRuleAllowChatMembers | TdlibuserPrivacySettingRuleRestrictAll | TdlibuserPrivacySettingRuleRestrictContacts | TdlibuserPrivacySettingRuleRestrictBots | TdlibuserPrivacySettingRuleRestrictUsers | TdlibuserPrivacySettingRuleRestrictChatMembers;

// UserPrivacySetting variants
export type TdlibUserPrivacySetting = TdlibuserPrivacySettingShowStatus | TdlibuserPrivacySettingShowProfilePhoto | TdlibuserPrivacySettingShowLinkInForwardedMessages | TdlibuserPrivacySettingShowPhoneNumber | TdlibuserPrivacySettingShowBio | TdlibuserPrivacySettingShowBirthdate | TdlibuserPrivacySettingShowProfileAudio | TdlibuserPrivacySettingAllowChatInvites | TdlibuserPrivacySettingAllowCalls | TdlibuserPrivacySettingAllowPeerToPeerCalls | TdlibuserPrivacySettingAllowFindingByPhoneNumber | TdlibuserPrivacySettingAllowPrivateVoiceAndVideoNoteMessages | TdlibuserPrivacySettingAutosaveGifts | TdlibuserPrivacySettingAllowUnpaidMessages;

// CanSendMessageToUserResult variants
export type TdlibCanSendMessageToUserResult = TdlibcanSendMessageToUserResultOk | TdlibcanSendMessageToUserResultUserHasPaidMessages | TdlibcanSendMessageToUserResultUserIsDeleted | TdlibcanSendMessageToUserResultUserRestrictsNewChats;

// SessionType variants
export type TdlibSessionType = TdlibsessionTypeAndroid | TdlibsessionTypeApple | TdlibsessionTypeBrave | TdlibsessionTypeChrome | TdlibsessionTypeEdge | TdlibsessionTypeFirefox | TdlibsessionTypeIpad | TdlibsessionTypeIphone | TdlibsessionTypeLinux | TdlibsessionTypeMac | TdlibsessionTypeOpera | TdlibsessionTypeSafari | TdlibsessionTypeUbuntu | TdlibsessionTypeUnknown | TdlibsessionTypeVivaldi | TdlibsessionTypeWindows | TdlibsessionTypeXbox;

// ReportReason variants
export type TdlibReportReason = TdlibreportReasonSpam | TdlibreportReasonViolence | TdlibreportReasonPornography | TdlibreportReasonChildAbuse | TdlibreportReasonCopyright | TdlibreportReasonUnrelatedLocation | TdlibreportReasonFake | TdlibreportReasonIllegalDrugs | TdlibreportReasonPersonalDetails | TdlibreportReasonCustom;

// ReportChatResult variants
export type TdlibReportChatResult = TdlibreportChatResultOk | TdlibreportChatResultOptionRequired | TdlibreportChatResultTextRequired | TdlibreportChatResultMessagesRequired;

// ReportStoryResult variants
export type TdlibReportStoryResult = TdlibreportStoryResultOk | TdlibreportStoryResultOptionRequired | TdlibreportStoryResultTextRequired;

// InternalLinkType variants
export type TdlibInternalLinkType = TdlibinternalLinkTypeActiveSessions | TdlibinternalLinkTypeAttachmentMenuBot | TdlibinternalLinkTypeAuthenticationCode | TdlibinternalLinkTypeBackground | TdlibinternalLinkTypeBotAddToChannel | TdlibinternalLinkTypeBotStart | TdlibinternalLinkTypeBotStartInGroup | TdlibinternalLinkTypeBusinessChat | TdlibinternalLinkTypeBuyStars | TdlibinternalLinkTypeChangePhoneNumber | TdlibinternalLinkTypeChatAffiliateProgram | TdlibinternalLinkTypeChatBoost | TdlibinternalLinkTypeChatFolderInvite | TdlibinternalLinkTypeChatFolderSettings | TdlibinternalLinkTypeChatInvite | TdlibinternalLinkTypeDefaultMessageAutoDeleteTimerSettings | TdlibinternalLinkTypeDirectMessagesChat | TdlibinternalLinkTypeEditProfileSettings | TdlibinternalLinkTypeGame | TdlibinternalLinkTypeGiftAuction | TdlibinternalLinkTypeGiftCollection | TdlibinternalLinkTypeGroupCall | TdlibinternalLinkTypeInstantView | TdlibinternalLinkTypeInvoice | TdlibinternalLinkTypeLanguagePack | TdlibinternalLinkTypeLanguageSettings | TdlibinternalLinkTypeLiveStory | TdlibinternalLinkTypeLoginEmailSettings | TdlibinternalLinkTypeMainWebApp | TdlibinternalLinkTypeMessage | TdlibinternalLinkTypeMessageDraft | TdlibinternalLinkTypeMyStars | TdlibinternalLinkTypeMyToncoins | TdlibinternalLinkTypePassportDataRequest | TdlibinternalLinkTypePasswordSettings | TdlibinternalLinkTypePhoneNumberConfirmation | TdlibinternalLinkTypePhoneNumberPrivacySettings | TdlibinternalLinkTypePremiumFeatures | TdlibinternalLinkTypePremiumGift | TdlibinternalLinkTypePremiumGiftCode | TdlibinternalLinkTypePrivacyAndSecuritySettings | TdlibinternalLinkTypeProxy | TdlibinternalLinkTypePublicChat | TdlibinternalLinkTypeQrCodeAuthentication | TdlibinternalLinkTypeRestorePurchases | TdlibinternalLinkTypeSettings | TdlibinternalLinkTypeStickerSet | TdlibinternalLinkTypeStory | TdlibinternalLinkTypeStoryAlbum | TdlibinternalLinkTypeTheme | TdlibinternalLinkTypeThemeSettings | TdlibinternalLinkTypeUnknownDeepLink | TdlibinternalLinkTypeUnsupportedProxy | TdlibinternalLinkTypeUpgradedGift | TdlibinternalLinkTypeUserPhoneNumber | TdlibinternalLinkTypeUserToken | TdlibinternalLinkTypeVideoChat | TdlibinternalLinkTypeWebApp;

// BlockList variants
export type TdlibBlockList = TdlibblockListMain | TdlibblockListStories;

// FileType variants
export type TdlibFileType = TdlibfileTypeNone | TdlibfileTypeAnimation | TdlibfileTypeAudio | TdlibfileTypeDocument | TdlibfileTypeNotificationSound | TdlibfileTypePhoto | TdlibfileTypePhotoStory | TdlibfileTypeProfilePhoto | TdlibfileTypeSecret | TdlibfileTypeSecretThumbnail | TdlibfileTypeSecure | TdlibfileTypeSelfDestructingPhoto | TdlibfileTypeSelfDestructingVideo | TdlibfileTypeSelfDestructingVideoNote | TdlibfileTypeSelfDestructingVoiceNote | TdlibfileTypeSticker | TdlibfileTypeThumbnail | TdlibfileTypeUnknown | TdlibfileTypeVideo | TdlibfileTypeVideoNote | TdlibfileTypeVideoStory | TdlibfileTypeVoiceNote | TdlibfileTypeWallpaper;

// NetworkType variants
export type TdlibNetworkType = TdlibnetworkTypeNone | TdlibnetworkTypeMobile | TdlibnetworkTypeMobileRoaming | TdlibnetworkTypeWiFi | TdlibnetworkTypeOther;

// NetworkStatisticsEntry variants
export type TdlibNetworkStatisticsEntry = TdlibnetworkStatisticsEntryFile | TdlibnetworkStatisticsEntryCall;

// AutosaveSettingsScope variants
export type TdlibAutosaveSettingsScope = TdlibautosaveSettingsScopePrivateChats | TdlibautosaveSettingsScopeGroupChats | TdlibautosaveSettingsScopeChannelChats | TdlibautosaveSettingsScopeChat;

// ConnectionState variants
export type TdlibConnectionState = TdlibconnectionStateWaitingForNetwork | TdlibconnectionStateConnectingToProxy | TdlibconnectionStateConnecting | TdlibconnectionStateUpdating | TdlibconnectionStateReady;

// TopChatCategory variants
export type TdlibTopChatCategory = TdlibtopChatCategoryUsers | TdlibtopChatCategoryBots | TdlibtopChatCategoryGroups | TdlibtopChatCategoryChannels | TdlibtopChatCategoryInlineBots | TdlibtopChatCategoryWebAppBots | TdlibtopChatCategoryCalls | TdlibtopChatCategoryForwardChats;

// TMeUrlType variants
export type TdlibTMeUrlType = TdlibtMeUrlTypeUser | TdlibtMeUrlTypeSupergroup | TdlibtMeUrlTypeChatInvite | TdlibtMeUrlTypeStickerSet;

// SuggestedAction variants
export type TdlibSuggestedAction = TdlibsuggestedActionEnableArchiveAndMuteNewChats | TdlibsuggestedActionCheckPassword | TdlibsuggestedActionCheckPhoneNumber | TdlibsuggestedActionViewChecksHint | TdlibsuggestedActionConvertToBroadcastGroup | TdlibsuggestedActionSetPassword | TdlibsuggestedActionUpgradePremium | TdlibsuggestedActionRestorePremium | TdlibsuggestedActionSubscribeToAnnualPremium | TdlibsuggestedActionGiftPremiumForChristmas | TdlibsuggestedActionSetBirthdate | TdlibsuggestedActionSetProfilePhoto | TdlibsuggestedActionExtendPremium | TdlibsuggestedActionExtendStarSubscriptions | TdlibsuggestedActionCustom | TdlibsuggestedActionSetLoginEmailAddress | TdlibsuggestedActionAddLoginPasskey;

// TextParseMode variants
export type TdlibTextParseMode = TdlibtextParseModeMarkdown | TdlibtextParseModeHTML;

// ProxyType variants
export type TdlibProxyType = TdlibproxyTypeSocks5 | TdlibproxyTypeHttp | TdlibproxyTypeMtproto;

// StatisticalGraph variants
export type TdlibStatisticalGraph = TdlibstatisticalGraphData | TdlibstatisticalGraphAsync | TdlibstatisticalGraphError;

// ChatStatisticsObjectType variants
export type TdlibChatStatisticsObjectType = TdlibchatStatisticsObjectTypeMessage | TdlibchatStatisticsObjectTypeStory;

// ChatStatistics variants
export type TdlibChatStatistics = TdlibchatStatisticsSupergroup | TdlibchatStatisticsChannel;

// RevenueWithdrawalState variants
export type TdlibRevenueWithdrawalState = TdlibrevenueWithdrawalStatePending | TdlibrevenueWithdrawalStateSucceeded | TdlibrevenueWithdrawalStateFailed;

// ChatRevenueTransactionType variants
export type TdlibChatRevenueTransactionType = TdlibchatRevenueTransactionTypeUnsupported | TdlibchatRevenueTransactionTypeSponsoredMessageEarnings | TdlibchatRevenueTransactionTypeSuggestedPostEarnings | TdlibchatRevenueTransactionTypeFragmentWithdrawal | TdlibchatRevenueTransactionTypeFragmentRefund;

// VectorPathCommand variants
export type TdlibVectorPathCommand = TdlibvectorPathCommandLine | TdlibvectorPathCommandCubicBezierCurve;

// BotCommandScope variants
export type TdlibBotCommandScope = TdlibbotCommandScopeDefault | TdlibbotCommandScopeAllPrivateChats | TdlibbotCommandScopeAllGroupChats | TdlibbotCommandScopeAllChatAdministrators | TdlibbotCommandScopeChat | TdlibbotCommandScopeChatAdministrators | TdlibbotCommandScopeChatMember;

// PhoneNumberCodeType variants
export type TdlibPhoneNumberCodeType = TdlibphoneNumberCodeTypeChange | TdlibphoneNumberCodeTypeVerify | TdlibphoneNumberCodeTypeConfirmOwnership;

// Update variants
export type TdlibUpdate = TdlibupdateAuthorizationState | TdlibupdateNewMessage | TdlibupdateMessageSendAcknowledged | TdlibupdateMessageSendSucceeded | TdlibupdateMessageSendFailed | TdlibupdateMessageContent | TdlibupdateMessageEdited | TdlibupdateMessageIsPinned | TdlibupdateMessageInteractionInfo | TdlibupdateMessageContentOpened | TdlibupdateMessageMentionRead | TdlibupdateMessageUnreadReactions | TdlibupdateMessageFactCheck | TdlibupdateMessageSuggestedPostInfo | TdlibupdateMessageLiveLocationViewed | TdlibupdateVideoPublished | TdlibupdateNewChat | TdlibupdateChatTitle | TdlibupdateChatPhoto | TdlibupdateChatAccentColors | TdlibupdateChatPermissions | TdlibupdateChatLastMessage | TdlibupdateChatPosition | TdlibupdateChatAddedToList | TdlibupdateChatRemovedFromList | TdlibupdateChatReadInbox | TdlibupdateChatReadOutbox | TdlibupdateChatActionBar | TdlibupdateChatBusinessBotManageBar | TdlibupdateChatAvailableReactions | TdlibupdateChatDraftMessage | TdlibupdateChatEmojiStatus | TdlibupdateChatMessageSender | TdlibupdateChatMessageAutoDeleteTime | TdlibupdateChatNotificationSettings | TdlibupdateChatPendingJoinRequests | TdlibupdateChatReplyMarkup | TdlibupdateChatBackground | TdlibupdateChatTheme | TdlibupdateChatUnreadMentionCount | TdlibupdateChatUnreadReactionCount | TdlibupdateChatVideoChat | TdlibupdateChatDefaultDisableNotification | TdlibupdateChatHasProtectedContent | TdlibupdateChatIsTranslatable | TdlibupdateChatIsMarkedAsUnread | TdlibupdateChatViewAsTopics | TdlibupdateChatBlockList | TdlibupdateChatHasScheduledMessages | TdlibupdateChatFolders | TdlibupdateChatOnlineMemberCount | TdlibupdateSavedMessagesTopic | TdlibupdateSavedMessagesTopicCount | TdlibupdateDirectMessagesChatTopic | TdlibupdateTopicMessageCount | TdlibupdateQuickReplyShortcut | TdlibupdateQuickReplyShortcutDeleted | TdlibupdateQuickReplyShortcuts | TdlibupdateQuickReplyShortcutMessages | TdlibupdateForumTopicInfo | TdlibupdateForumTopic | TdlibupdateScopeNotificationSettings | TdlibupdateReactionNotificationSettings | TdlibupdateNotification | TdlibupdateNotificationGroup | TdlibupdateActiveNotifications | TdlibupdateHavePendingNotifications | TdlibupdateDeleteMessages | TdlibupdateChatAction | TdlibupdatePendingTextMessage | TdlibupdateUserStatus | TdlibupdateUser | TdlibupdateBasicGroup | TdlibupdateSupergroup | TdlibupdateSecretChat | TdlibupdateUserFullInfo | TdlibupdateBasicGroupFullInfo | TdlibupdateSupergroupFullInfo | TdlibupdateServiceNotification | TdlibupdateFile | TdlibupdateFileGenerationStart | TdlibupdateFileGenerationStop | TdlibupdateFileDownloads | TdlibupdateFileAddedToDownloads | TdlibupdateFileDownload | TdlibupdateFileRemovedFromDownloads | TdlibupdateApplicationVerificationRequired | TdlibupdateApplicationRecaptchaVerificationRequired | TdlibupdateCall | TdlibupdateGroupCall | TdlibupdateGroupCallParticipant | TdlibupdateGroupCallParticipants | TdlibupdateGroupCallVerificationState | TdlibupdateNewGroupCallMessage | TdlibupdateNewGroupCallPaidReaction | TdlibupdateGroupCallMessageSendFailed | TdlibupdateGroupCallMessagesDeleted | TdlibupdateLiveStoryTopDonors | TdlibupdateNewCallSignalingData | TdlibupdateGiftAuctionState | TdlibupdateActiveGiftAuctions | TdlibupdateUserPrivacySettingRules | TdlibupdateUnreadMessageCount | TdlibupdateUnreadChatCount | TdlibupdateStory | TdlibupdateStoryDeleted | TdlibupdateStoryPostSucceeded | TdlibupdateStoryPostFailed | TdlibupdateChatActiveStories | TdlibupdateStoryListChatCount | TdlibupdateStoryStealthMode | TdlibupdateTrustedMiniAppBots | TdlibupdateOption | TdlibupdateStickerSet | TdlibupdateInstalledStickerSets | TdlibupdateTrendingStickerSets | TdlibupdateRecentStickers | TdlibupdateFavoriteStickers | TdlibupdateSavedAnimations | TdlibupdateSavedNotificationSounds | TdlibupdateDefaultBackground | TdlibupdateEmojiChatThemes | TdlibupdateAccentColors | TdlibupdateProfileAccentColors | TdlibupdateLanguagePackStrings | TdlibupdateConnectionState | TdlibupdateFreezeState | TdlibupdateAgeVerificationParameters | TdlibupdateTermsOfService | TdlibupdateUnconfirmedSession | TdlibupdateAttachmentMenuBots | TdlibupdateWebAppMessageSent | TdlibupdateActiveEmojiReactions | TdlibupdateAvailableMessageEffects | TdlibupdateDefaultReactionType | TdlibupdateDefaultPaidReactionType | TdlibupdateSavedMessagesTags | TdlibupdateActiveLiveLocationMessages | TdlibupdateOwnedStarCount | TdlibupdateOwnedTonCount | TdlibupdateChatRevenueAmount | TdlibupdateStarRevenueStatus | TdlibupdateTonRevenueStatus | TdlibupdateSpeechRecognitionTrial | TdlibupdateGroupCallMessageLevels | TdlibupdateDiceEmojis | TdlibupdateStakeDiceState | TdlibupdateAnimatedEmojiMessageClicked | TdlibupdateAnimationSearchParameters | TdlibupdateSuggestedActions | TdlibupdateSpeedLimitNotification | TdlibupdateContactCloseBirthdays | TdlibupdateAutosaveSettings | TdlibupdateBusinessConnection | TdlibupdateNewBusinessMessage | TdlibupdateBusinessMessageEdited | TdlibupdateBusinessMessagesDeleted | TdlibupdateNewInlineQuery | TdlibupdateNewChosenInlineResult | TdlibupdateNewCallbackQuery | TdlibupdateNewInlineCallbackQuery | TdlibupdateNewBusinessCallbackQuery | TdlibupdateNewShippingQuery | TdlibupdateNewPreCheckoutQuery | TdlibupdateNewCustomEvent | TdlibupdateNewCustomQuery | TdlibupdatePoll | TdlibupdatePollAnswer | TdlibupdateChatMember | TdlibupdateNewChatJoinRequest | TdlibupdateChatBoost | TdlibupdateMessageReaction | TdlibupdateMessageReactions | TdlibupdatePaidMediaPurchased;

// LogStream variants
export type TdlibLogStream = TdliblogStreamDefault | TdliblogStreamFile | TdliblogStreamEmpty | TdlibgetLogStream;

// Type definitions








export interface TdlibauthenticationCodeTypeTelegramMessage {
  "@type": "authenticationCodeTypeTelegramMessage";
  length: number;
}

export interface TdlibauthenticationCodeTypeSms {
  "@type": "authenticationCodeTypeSms";
  length: number;
}

export interface TdlibauthenticationCodeTypeSmsWord {
  "@type": "authenticationCodeTypeSmsWord";
  first_letter: string;
}

export interface TdlibauthenticationCodeTypeSmsPhrase {
  "@type": "authenticationCodeTypeSmsPhrase";
  first_word: string;
}

export interface TdlibauthenticationCodeTypeCall {
  "@type": "authenticationCodeTypeCall";
  length: number;
}

export interface TdlibauthenticationCodeTypeFlashCall {
  "@type": "authenticationCodeTypeFlashCall";
  pattern: string;
}

export interface TdlibauthenticationCodeTypeMissedCall {
  "@type": "authenticationCodeTypeMissedCall";
  phone_number_prefix: string;
  length: number;
}

export interface TdlibauthenticationCodeTypeFragment {
  "@type": "authenticationCodeTypeFragment";
  url: string;
  length: number;
}

export interface TdlibauthenticationCodeTypeFirebaseAndroid {
  "@type": "authenticationCodeTypeFirebaseAndroid";
  device_verification_parameters: FirebaseDeviceVerificationParameters;
  length: number;
}

export interface TdlibauthenticationCodeTypeFirebaseIos {
  "@type": "authenticationCodeTypeFirebaseIos";
  receipt: string;
  push_timeout: number;
  length: number;
}

export interface TdlibauthenticationCodeInfo {
  "@type": "authenticationCodeInfo";
  phone_number: string;
  type: AuthenticationCodeType;
  next_type: AuthenticationCodeType;
  timeout: number;
}

export interface TdlibemailAddressAuthenticationCodeInfo {
  "@type": "emailAddressAuthenticationCodeInfo";
  email_address_pattern: string;
  length: number;
}

export interface TdlibemailAddressAuthenticationCode {
  "@type": "emailAddressAuthenticationCode";
  code: string;
}

export interface TdlibemailAddressAuthenticationAppleId {
  "@type": "emailAddressAuthenticationAppleId";
  token: string;
}

export interface TdlibemailAddressAuthenticationGoogleId {
  "@type": "emailAddressAuthenticationGoogleId";
  token: string;
}

export interface TdlibemailAddressResetStateAvailable {
  "@type": "emailAddressResetStateAvailable";
  wait_period: number;
}

export interface TdlibemailAddressResetStatePending {
  "@type": "emailAddressResetStatePending";
  reset_in: number;
}

export interface TdlibtextEntity {
  "@type": "textEntity";
  offset: number;
  length: number;
  type: TextEntityType;
}

export interface TdlibtextEntities {
  "@type": "textEntities";
  entities: Array<TextEntity>;
}

export interface TdlibformattedText {
  "@type": "formattedText";
  text: string;
  entities: Array<TextEntity>;
}

export interface TdlibtermsOfService {
  "@type": "termsOfService";
  text: FormattedText;
  min_user_age: number;
  show_popup: boolean;
}

export interface Tdlibpasskey {
  "@type": "passkey";
  id: string;
  name: string;
  addition_date: number;
  last_usage_date: number;
  software_icon_custom_emoji_id: string;
}

export interface Tdlibpasskeys {
  "@type": "passkeys";
  passkeys: Array<Passkey>;
}



export interface TdlibauthorizationStateWaitPremiumPurchase {
  "@type": "authorizationStateWaitPremiumPurchase";
  store_product_id: string;
  support_email_address: string;
  support_email_subject: string;
}

export interface TdlibauthorizationStateWaitEmailAddress {
  "@type": "authorizationStateWaitEmailAddress";
  allow_apple_id: boolean;
  allow_google_id: boolean;
}

export interface TdlibauthorizationStateWaitEmailCode {
  "@type": "authorizationStateWaitEmailCode";
  allow_apple_id: boolean;
  allow_google_id: boolean;
  code_info: EmailAddressAuthenticationCodeInfo;
  email_address_reset_state: EmailAddressResetState;
}

export interface TdlibauthorizationStateWaitCode {
  "@type": "authorizationStateWaitCode";
  code_info: AuthenticationCodeInfo;
}

export interface TdlibauthorizationStateWaitOtherDeviceConfirmation {
  "@type": "authorizationStateWaitOtherDeviceConfirmation";
  link: string;
}

export interface TdlibauthorizationStateWaitRegistration {
  "@type": "authorizationStateWaitRegistration";
  terms_of_service: TermsOfService;
}

export interface TdlibauthorizationStateWaitPassword {
  "@type": "authorizationStateWaitPassword";
  password_hint: string;
  has_recovery_email_address: boolean;
  has_passport_data: boolean;
  recovery_email_address_pattern: string;
}





export interface TdlibfirebaseDeviceVerificationParametersSafetyNet {
  "@type": "firebaseDeviceVerificationParametersSafetyNet";
  nonce: string;
}

export interface TdlibfirebaseDeviceVerificationParametersPlayIntegrity {
  "@type": "firebaseDeviceVerificationParametersPlayIntegrity";
  nonce: string;
  cloud_project_number: string;
}

export interface TdlibpasswordState {
  "@type": "passwordState";
  has_password: boolean;
  password_hint: string;
  has_recovery_email_address: boolean;
  has_passport_data: boolean;
  recovery_email_address_code_info: EmailAddressAuthenticationCodeInfo;
  login_email_address_pattern: string;
  pending_reset_date: number;
}

export interface TdlibrecoveryEmailAddress {
  "@type": "recoveryEmailAddress";
  recovery_email_address: string;
}

export interface TdlibtemporaryPasswordState {
  "@type": "temporaryPasswordState";
  has_password: boolean;
  valid_for: number;
}

export interface TdliblocalFile {
  "@type": "localFile";
  path: string;
  can_be_downloaded: boolean;
  can_be_deleted: boolean;
  is_downloading_active: boolean;
  is_downloading_completed: boolean;
  download_offset: number;
  downloaded_prefix_size: number;
  downloaded_size: number;
}

export interface TdlibremoteFile {
  "@type": "remoteFile";
  id: string;
  unique_id: string;
  is_uploading_active: boolean;
  is_uploading_completed: boolean;
  uploaded_size: number;
}

export interface Tdlibfile {
  "@type": "file";
  id: number;
  size: number;
  expected_size: number;
  local: LocalFile;
  remote: RemoteFile;
}

export interface TdlibinputFileId {
  "@type": "inputFileId";
  id: number;
}

export interface TdlibinputFileRemote {
  "@type": "inputFileRemote";
  id: string;
}

export interface TdlibinputFileLocal {
  "@type": "inputFileLocal";
  path: string;
}

export interface TdlibinputFileGenerated {
  "@type": "inputFileGenerated";
  original_path: string;
  conversion: string;
  expected_size: number;
}

export interface TdlibphotoSize {
  "@type": "photoSize";
  type: string;
  photo: File;
  width: number;
  height: number;
  progressive_sizes: Array<number>;
}

export interface Tdlibminithumbnail {
  "@type": "minithumbnail";
  width: number;
  height: number;
  data: string;
}








export interface Tdlibthumbnail {
  "@type": "thumbnail";
  format: ThumbnailFormat;
  width: number;
  height: number;
  file: File;
}





export interface TdlibmaskPosition {
  "@type": "maskPosition";
  point: MaskPoint;
  x_shift: number;
  y_shift: number;
  scale: number;
}







export interface TdlibstickerFullTypeRegular {
  "@type": "stickerFullTypeRegular";
  premium_animation: File;
}

export interface TdlibstickerFullTypeMask {
  "@type": "stickerFullTypeMask";
  mask_position: MaskPosition;
}

export interface TdlibstickerFullTypeCustomEmoji {
  "@type": "stickerFullTypeCustomEmoji";
  custom_emoji_id: string;
  needs_repainting: boolean;
}

export interface TdlibclosedVectorPath {
  "@type": "closedVectorPath";
  commands: Array<VectorPathCommand>;
}

export interface Tdliboutline {
  "@type": "outline";
  paths: Array<ClosedVectorPath>;
}

export interface TdlibpollOption {
  "@type": "pollOption";
  text: FormattedText;
  voter_count: number;
  vote_percentage: number;
  is_chosen: boolean;
  is_being_chosen: boolean;
}

export interface TdlibpollTypeRegular {
  "@type": "pollTypeRegular";
  allow_multiple_answers: boolean;
}

export interface TdlibpollTypeQuiz {
  "@type": "pollTypeQuiz";
  correct_option_id: number;
  explanation: FormattedText;
}

export interface TdlibchecklistTask {
  "@type": "checklistTask";
  id: number;
  text: FormattedText;
  completed_by: MessageSender;
  completion_date: number;
}

export interface TdlibinputChecklistTask {
  "@type": "inputChecklistTask";
  id: number;
  text: FormattedText;
}

export interface Tdlibchecklist {
  "@type": "checklist";
  title: FormattedText;
  tasks: Array<ChecklistTask>;
  others_can_add_tasks: boolean;
  can_add_tasks: boolean;
  others_can_mark_tasks_as_done: boolean;
  can_mark_tasks_as_done: boolean;
}

export interface TdlibinputChecklist {
  "@type": "inputChecklist";
  title: FormattedText;
  tasks: Array<InputChecklistTask>;
  others_can_add_tasks: boolean;
  others_can_mark_tasks_as_done: boolean;
}

export interface Tdlibanimation {
  "@type": "animation";
  duration: number;
  width: number;
  height: number;
  file_name: string;
  mime_type: string;
  has_stickers: boolean;
  minithumbnail: Minithumbnail;
  thumbnail: Thumbnail;
  animation: File;
}

export interface Tdlibaudio {
  "@type": "audio";
  duration: number;
  title: string;
  performer: string;
  file_name: string;
  mime_type: string;
  album_cover_minithumbnail: Minithumbnail;
  album_cover_thumbnail: Thumbnail;
  external_album_covers: Array<Thumbnail>;
  audio: File;
}

export interface Tdlibaudios {
  "@type": "audios";
  total_count: number;
  audios: Array<Audio>;
}

export interface Tdlibdocument {
  "@type": "document";
  file_name: string;
  mime_type: string;
  minithumbnail: Minithumbnail;
  thumbnail: Thumbnail;
  document: File;
}

export interface Tdlibphoto {
  "@type": "photo";
  has_stickers: boolean;
  minithumbnail: Minithumbnail;
  sizes: Array<PhotoSize>;
}

export interface Tdlibsticker {
  "@type": "sticker";
  id: string;
  set_id: string;
  width: number;
  height: number;
  emoji: string;
  format: StickerFormat;
  full_type: StickerFullType;
  thumbnail: Thumbnail;
  sticker: File;
}

export interface Tdlibvideo {
  "@type": "video";
  duration: number;
  width: number;
  height: number;
  file_name: string;
  mime_type: string;
  has_stickers: boolean;
  supports_streaming: boolean;
  minithumbnail: Minithumbnail;
  thumbnail: Thumbnail;
  video: File;
}

export interface TdlibvideoNote {
  "@type": "videoNote";
  duration: number;
  waveform: string;
  length: number;
  minithumbnail: Minithumbnail;
  thumbnail: Thumbnail;
  speech_recognition_result: SpeechRecognitionResult;
  video: File;
}

export interface TdlibvoiceNote {
  "@type": "voiceNote";
  duration: number;
  waveform: string;
  mime_type: string;
  speech_recognition_result: SpeechRecognitionResult;
  voice: File;
}

export interface TdlibanimatedEmoji {
  "@type": "animatedEmoji";
  sticker: Sticker;
  sticker_width: number;
  sticker_height: number;
  fitzpatrick_type: number;
  sound: File;
}

export interface Tdlibcontact {
  "@type": "contact";
  phone_number: string;
  first_name: string;
  last_name: string;
  vcard: string;
  user_id: number;
}

export interface Tdliblocation {
  "@type": "location";
  latitude: number;
  longitude: number;
  horizontal_accuracy: number;
}

export interface Tdlibvenue {
  "@type": "venue";
  location: Location;
  title: string;
  address: string;
  provider: string;
  id: string;
  type: string;
}

export interface Tdlibgame {
  "@type": "game";
  id: string;
  short_name: string;
  title: string;
  text: FormattedText;
  description: string;
  photo: Photo;
  animation: Animation;
}

export interface TdlibstakeDiceState {
  "@type": "stakeDiceState";
  state_hash: string;
  stake_toncoin_amount: number;
  suggested_stake_toncoin_amounts: Array<number>;
  current_streak: number;
  prize_per_mille: Array<number>;
  streak_prize_per_mille: number;
}

export interface TdlibwebApp {
  "@type": "webApp";
  short_name: string;
  title: string;
  description: string;
  photo: Photo;
  animation: Animation;
}

export interface Tdlibpoll {
  "@type": "poll";
  id: string;
  question: FormattedText;
  options: Array<PollOption>;
  total_voter_count: number;
  recent_voter_ids: Array<MessageSender>;
  is_anonymous: boolean;
  type: PollType;
  open_period: number;
  close_date: number;
  is_closed: boolean;
}

export interface TdlibalternativeVideo {
  "@type": "alternativeVideo";
  id: string;
  width: number;
  height: number;
  codec: string;
  hls_file: File;
  video: File;
}

export interface TdlibvideoStoryboard {
  "@type": "videoStoryboard";
  storyboard_file: File;
  width: number;
  height: number;
  map_file: File;
}

export interface Tdlibbackground {
  "@type": "background";
  id: string;
  is_default: boolean;
  is_dark: boolean;
  name: string;
  document: Document;
  type: BackgroundType;
}

export interface Tdlibbackgrounds {
  "@type": "backgrounds";
  backgrounds: Array<Background>;
}

export interface TdlibchatBackground {
  "@type": "chatBackground";
  background: Background;
  dark_theme_dimming: number;
}

export interface TdlibprofilePhoto {
  "@type": "profilePhoto";
  id: string;
  small: File;
  big: File;
  minithumbnail: Minithumbnail;
  has_animation: boolean;
  is_personal: boolean;
}

export interface TdlibchatPhotoInfo {
  "@type": "chatPhotoInfo";
  small: File;
  big: File;
  minithumbnail: Minithumbnail;
  has_animation: boolean;
  is_personal: boolean;
}











export interface TdlibuserTypeBot {
  "@type": "userTypeBot";
  can_be_edited: boolean;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
  has_main_web_app: boolean;
  has_topics: boolean;
  is_inline: boolean;
  inline_query_placeholder: string;
  need_location: boolean;
  can_connect_to_business: boolean;
  can_be_added_to_attachment_menu: boolean;
  active_user_count: number;
}


export interface TdlibbotCommand {
  "@type": "botCommand";
  command: string;
  description: string;
}

export interface TdlibbotCommands {
  "@type": "botCommands";
  bot_user_id: number;
  commands: Array<BotCommand>;
}

export interface TdlibbotMenuButton {
  "@type": "botMenuButton";
  text: string;
  url: string;
}

export interface TdlibbotVerificationParameters {
  "@type": "botVerificationParameters";
  icon_custom_emoji_id: string;
  organization_name: string;
  default_custom_description: FormattedText;
  can_set_custom_description: boolean;
}

export interface TdlibbotVerification {
  "@type": "botVerification";
  bot_user_id: number;
  icon_custom_emoji_id: string;
  custom_description: FormattedText;
}

export interface TdlibverificationStatus {
  "@type": "verificationStatus";
  is_verified: boolean;
  is_scam: boolean;
  is_fake: boolean;
  bot_verification_icon_custom_emoji_id: string;
}

export interface TdlibchatLocation {
  "@type": "chatLocation";
  location: Location;
  address: string;
}

export interface Tdlibbirthdate {
  "@type": "birthdate";
  day: number;
  month: number;
  year: number;
}

export interface TdlibcloseBirthdayUser {
  "@type": "closeBirthdayUser";
  user_id: number;
  birthdate: Birthdate;
}



export interface TdlibbusinessAwayMessageScheduleCustom {
  "@type": "businessAwayMessageScheduleCustom";
  start_date: number;
  end_date: number;
}

export interface TdlibbusinessLocation {
  "@type": "businessLocation";
  location: Location;
  address: string;
}

export interface TdlibbusinessRecipients {
  "@type": "businessRecipients";
  chat_ids: Array<number>;
  excluded_chat_ids: Array<number>;
  select_existing_chats: boolean;
  select_new_chats: boolean;
  select_contacts: boolean;
  select_non_contacts: boolean;
  exclude_selected: boolean;
}

export interface TdlibbusinessAwayMessageSettings {
  "@type": "businessAwayMessageSettings";
  shortcut_id: number;
  recipients: BusinessRecipients;
  schedule: BusinessAwayMessageSchedule;
  offline_only: boolean;
}

export interface TdlibbusinessGreetingMessageSettings {
  "@type": "businessGreetingMessageSettings";
  shortcut_id: number;
  recipients: BusinessRecipients;
  inactivity_days: number;
}

export interface TdlibbusinessBotRights {
  "@type": "businessBotRights";
  can_reply: boolean;
  can_read_messages: boolean;
  can_delete_sent_messages: boolean;
  can_delete_all_messages: boolean;
  can_edit_name: boolean;
  can_edit_bio: boolean;
  can_edit_profile_photo: boolean;
  can_edit_username: boolean;
  can_view_gifts_and_stars: boolean;
  can_sell_gifts: boolean;
  can_change_gift_settings: boolean;
  can_transfer_and_upgrade_gifts: boolean;
  can_transfer_stars: boolean;
  can_manage_stories: boolean;
}

export interface TdlibbusinessConnectedBot {
  "@type": "businessConnectedBot";
  bot_user_id: number;
  recipients: BusinessRecipients;
  rights: BusinessBotRights;
}

export interface TdlibbusinessStartPage {
  "@type": "businessStartPage";
  title: string;
  message: string;
  sticker: Sticker;
}

export interface TdlibinputBusinessStartPage {
  "@type": "inputBusinessStartPage";
  title: string;
  message: string;
  sticker: InputFile;
}

export interface TdlibbusinessOpeningHoursInterval {
  "@type": "businessOpeningHoursInterval";
  start_minute: number;
  end_minute: number;
}

export interface TdlibbusinessOpeningHours {
  "@type": "businessOpeningHours";
  time_zone_id: string;
  opening_hours: Array<BusinessOpeningHoursInterval>;
}

export interface TdlibbusinessInfo {
  "@type": "businessInfo";
  location: BusinessLocation;
  opening_hours: BusinessOpeningHours;
  local_opening_hours: BusinessOpeningHours;
  next_open_in: number;
  next_close_in: number;
  greeting_message_settings: BusinessGreetingMessageSettings;
  away_message_settings: BusinessAwayMessageSettings;
  start_page: BusinessStartPage;
}

export interface TdlibbusinessChatLink {
  "@type": "businessChatLink";
  link: string;
  text: FormattedText;
  title: string;
  view_count: number;
}

export interface TdlibbusinessChatLinks {
  "@type": "businessChatLinks";
  links: Array<BusinessChatLink>;
}

export interface TdlibinputBusinessChatLink {
  "@type": "inputBusinessChatLink";
  text: FormattedText;
  title: string;
}

export interface TdlibbusinessChatLinkInfo {
  "@type": "businessChatLinkInfo";
  chat_id: number;
  text: FormattedText;
}

export interface TdlibchatPhotoStickerTypeRegularOrMask {
  "@type": "chatPhotoStickerTypeRegularOrMask";
  sticker_set_id: string;
  sticker_id: string;
}

export interface TdlibchatPhotoStickerTypeCustomEmoji {
  "@type": "chatPhotoStickerTypeCustomEmoji";
  custom_emoji_id: string;
}

export interface TdlibchatPhotoSticker {
  "@type": "chatPhotoSticker";
  type: ChatPhotoStickerType;
  background_fill: BackgroundFill;
}

export interface TdlibanimatedChatPhoto {
  "@type": "animatedChatPhoto";
  length: number;
  file: File;
  main_frame_timestamp: number;
}

export interface TdlibchatPhoto {
  "@type": "chatPhoto";
  id: string;
  added_date: number;
  minithumbnail: Minithumbnail;
  sizes: Array<PhotoSize>;
  animation: AnimatedChatPhoto;
  small_animation: AnimatedChatPhoto;
  sticker: ChatPhotoSticker;
}

export interface TdlibchatPhotos {
  "@type": "chatPhotos";
  total_count: number;
  photos: Array<ChatPhoto>;
}

export interface TdlibinputChatPhotoPrevious {
  "@type": "inputChatPhotoPrevious";
  chat_photo_id: string;
}

export interface TdlibinputChatPhotoStatic {
  "@type": "inputChatPhotoStatic";
  photo: InputFile;
}

export interface TdlibinputChatPhotoAnimation {
  "@type": "inputChatPhotoAnimation";
  animation: InputFile;
  main_frame_timestamp: number;
}

export interface TdlibinputChatPhotoSticker {
  "@type": "inputChatPhotoSticker";
  sticker: ChatPhotoSticker;
}

export interface TdlibchatPermissions {
  "@type": "chatPermissions";
  can_send_basic_messages: boolean;
  can_send_audios: boolean;
  can_send_documents: boolean;
  can_send_photos: boolean;
  can_send_videos: boolean;
  can_send_video_notes: boolean;
  can_send_voice_notes: boolean;
  can_send_polls: boolean;
  can_send_other_messages: boolean;
  can_add_link_previews: boolean;
  can_change_info: boolean;
  can_invite_users: boolean;
  can_pin_messages: boolean;
  can_create_topics: boolean;
}

export interface TdlibchatAdministratorRights {
  "@type": "chatAdministratorRights";
  can_manage_chat: boolean;
  can_change_info: boolean;
  can_post_messages: boolean;
  can_edit_messages: boolean;
  can_delete_messages: boolean;
  can_invite_users: boolean;
  can_restrict_members: boolean;
  can_pin_messages: boolean;
  can_manage_topics: boolean;
  can_promote_members: boolean;
  can_manage_video_chats: boolean;
  can_post_stories: boolean;
  can_edit_stories: boolean;
  can_delete_stories: boolean;
  can_manage_direct_messages: boolean;
  is_anonymous: boolean;
}

export interface TdlibgiftResalePriceStar {
  "@type": "giftResalePriceStar";
  star_count: number;
}

export interface TdlibgiftResalePriceTon {
  "@type": "giftResalePriceTon";
  toncoin_cent_count: number;
}




export interface TdlibsuggestedPostPriceStar {
  "@type": "suggestedPostPriceStar";
  star_count: number;
}

export interface TdlibsuggestedPostPriceTon {
  "@type": "suggestedPostPriceTon";
  toncoin_cent_count: number;
}




export interface TdlibsuggestedPostInfo {
  "@type": "suggestedPostInfo";
  price: SuggestedPostPrice;
  send_date: number;
  state: SuggestedPostState;
  can_be_approved: boolean;
  can_be_declined: boolean;
}

export interface TdlibinputSuggestedPostInfo {
  "@type": "inputSuggestedPostInfo";
  price: SuggestedPostPrice;
  send_date: number;
}



export interface TdlibstarAmount {
  "@type": "starAmount";
  star_count: number;
  nanostar_count: number;
}

export interface TdlibstarSubscriptionTypeChannel {
  "@type": "starSubscriptionTypeChannel";
  can_reuse: boolean;
  invite_link: string;
}

export interface TdlibstarSubscriptionTypeBot {
  "@type": "starSubscriptionTypeBot";
  is_canceled_by_bot: boolean;
  title: string;
  photo: Photo;
  invoice_link: string;
}

export interface TdlibstarSubscriptionPricing {
  "@type": "starSubscriptionPricing";
  period: number;
  star_count: number;
}

export interface TdlibstarSubscription {
  "@type": "starSubscription";
  id: string;
  chat_id: number;
  expiration_date: number;
  is_canceled: boolean;
  is_expiring: boolean;
  pricing: StarSubscriptionPricing;
  type: StarSubscriptionType;
}

export interface TdlibstarSubscriptions {
  "@type": "starSubscriptions";
  star_amount: StarAmount;
  subscriptions: Array<StarSubscription>;
  required_star_count: number;
  next_offset: string;
}


export interface TdlibaffiliateTypeBot {
  "@type": "affiliateTypeBot";
  user_id: number;
}

export interface TdlibaffiliateTypeChannel {
  "@type": "affiliateTypeChannel";
  chat_id: number;
}




export interface TdlibaffiliateProgramParameters {
  "@type": "affiliateProgramParameters";
  commission_per_mille: number;
  month_count: number;
}

export interface TdlibaffiliateProgramInfo {
  "@type": "affiliateProgramInfo";
  parameters: AffiliateProgramParameters;
  end_date: number;
  daily_revenue_per_user_amount: StarAmount;
}

export interface TdlibaffiliateInfo {
  "@type": "affiliateInfo";
  commission_per_mille: number;
  affiliate_chat_id: number;
  star_amount: StarAmount;
}

export interface TdlibfoundAffiliateProgram {
  "@type": "foundAffiliateProgram";
  bot_user_id: number;
  info: AffiliateProgramInfo;
}

export interface TdlibfoundAffiliatePrograms {
  "@type": "foundAffiliatePrograms";
  total_count: number;
  programs: Array<FoundAffiliateProgram>;
  next_offset: string;
}

export interface TdlibconnectedAffiliateProgram {
  "@type": "connectedAffiliateProgram";
  url: string;
  bot_user_id: number;
  parameters: AffiliateProgramParameters;
  connection_date: number;
  is_disconnected: boolean;
  user_count: string;
  revenue_star_count: number;
}

export interface TdlibconnectedAffiliatePrograms {
  "@type": "connectedAffiliatePrograms";
  total_count: number;
  programs: Array<ConnectedAffiliateProgram>;
  next_offset: string;
}

export interface TdlibproductInfo {
  "@type": "productInfo";
  title: string;
  description: FormattedText;
  photo: Photo;
}

export interface TdlibpremiumPaymentOption {
  "@type": "premiumPaymentOption";
  currency: string;
  amount: number;
  discount_percentage: number;
  month_count: number;
  store_product_id: string;
  payment_link: InternalLinkType;
}

export interface TdlibpremiumStatePaymentOption {
  "@type": "premiumStatePaymentOption";
  payment_option: PremiumPaymentOption;
  is_current: boolean;
  is_upgrade: boolean;
  last_transaction_id: string;
}

export interface TdlibpremiumGiftPaymentOption {
  "@type": "premiumGiftPaymentOption";
  currency: string;
  amount: number;
  star_count: number;
  discount_percentage: number;
  month_count: number;
  store_product_id: string;
  sticker: Sticker;
}

export interface TdlibpremiumGiftPaymentOptions {
  "@type": "premiumGiftPaymentOptions";
  options: Array<PremiumGiftPaymentOption>;
}

export interface TdlibpremiumGiveawayPaymentOption {
  "@type": "premiumGiveawayPaymentOption";
  currency: string;
  amount: number;
  winner_count: number;
  month_count: number;
  store_product_id: string;
  store_product_quantity: number;
}

export interface TdlibpremiumGiveawayPaymentOptions {
  "@type": "premiumGiveawayPaymentOptions";
  options: Array<PremiumGiveawayPaymentOption>;
}

export interface TdlibpremiumGiftCodeInfo {
  "@type": "premiumGiftCodeInfo";
  creator_id: MessageSender;
  creation_date: number;
  is_from_giveaway: boolean;
  giveaway_message_id: number;
  month_count: number;
  day_count: number;
  user_id: number;
  use_date: number;
}

export interface TdlibstarPaymentOption {
  "@type": "starPaymentOption";
  currency: string;
  amount: number;
  star_count: number;
  store_product_id: string;
  is_additional: boolean;
}

export interface TdlibstarPaymentOptions {
  "@type": "starPaymentOptions";
  options: Array<StarPaymentOption>;
}

export interface TdlibstarGiveawayWinnerOption {
  "@type": "starGiveawayWinnerOption";
  winner_count: number;
  won_star_count: number;
  is_default: boolean;
}

export interface TdlibstarGiveawayPaymentOption {
  "@type": "starGiveawayPaymentOption";
  currency: string;
  amount: number;
  star_count: number;
  store_product_id: string;
  yearly_boost_count: number;
  winner_options: Array<StarGiveawayWinnerOption>;
  is_default: boolean;
  is_additional: boolean;
}

export interface TdlibstarGiveawayPaymentOptions {
  "@type": "starGiveawayPaymentOptions";
  options: Array<StarGiveawayPaymentOption>;
}

export interface TdlibacceptedGiftTypes {
  "@type": "acceptedGiftTypes";
  unlimited_gifts: boolean;
  limited_gifts: boolean;
  upgraded_gifts: boolean;
  gifts_from_channels: boolean;
  premium_subscription: boolean;
}

export interface TdlibgiftSettings {
  "@type": "giftSettings";
  show_gift_button: boolean;
  accepted_gift_types: AcceptedGiftTypes;
}

export interface TdlibgiftAuction {
  "@type": "giftAuction";
  id: string;
  gifts_per_round: number;
  start_date: number;
}

export interface TdlibgiftBackground {
  "@type": "giftBackground";
  center_color: number;
  edge_color: number;
  text_color: number;
}

export interface TdlibgiftPurchaseLimits {
  "@type": "giftPurchaseLimits";
  total_count: number;
  remaining_count: number;
}

export interface TdlibgiftResaleParameters {
  "@type": "giftResaleParameters";
  star_count: number;
  toncoin_cent_count: number;
  toncoin_only: boolean;
}

export interface TdlibgiftCollection {
  "@type": "giftCollection";
  id: number;
  name: string;
  icon: Sticker;
  gift_count: number;
}

export interface TdlibgiftCollections {
  "@type": "giftCollections";
  collections: Array<GiftCollection>;
}


export interface TdlibcanSendGiftResultFail {
  "@type": "canSendGiftResultFail";
  reason: FormattedText;
}

export interface TdlibupgradedGiftOriginUpgrade {
  "@type": "upgradedGiftOriginUpgrade";
  gift_message_id: number;
}


export interface TdlibupgradedGiftOriginResale {
  "@type": "upgradedGiftOriginResale";
  price: GiftResalePrice;
}



export interface TdlibupgradedGiftOriginOffer {
  "@type": "upgradedGiftOriginOffer";
  price: GiftResalePrice;
}

export interface TdlibupgradedGiftModel {
  "@type": "upgradedGiftModel";
  name: string;
  sticker: Sticker;
  rarity_per_mille: number;
}

export interface TdlibupgradedGiftSymbol {
  "@type": "upgradedGiftSymbol";
  name: string;
  sticker: Sticker;
  rarity_per_mille: number;
}

export interface TdlibupgradedGiftBackdropColors {
  "@type": "upgradedGiftBackdropColors";
  center_color: number;
  edge_color: number;
  symbol_color: number;
  text_color: number;
}

export interface TdlibupgradedGiftBackdrop {
  "@type": "upgradedGiftBackdrop";
  id: number;
  name: string;
  colors: UpgradedGiftBackdropColors;
  rarity_per_mille: number;
}

export interface TdlibupgradedGiftOriginalDetails {
  "@type": "upgradedGiftOriginalDetails";
  sender_id: MessageSender;
  receiver_id: MessageSender;
  text: FormattedText;
  date: number;
}

export interface TdlibupgradedGiftColors {
  "@type": "upgradedGiftColors";
  id: string;
  model_custom_emoji_id: string;
  symbol_custom_emoji_id: string;
  light_theme_accent_color: number;
  light_theme_colors: Array<number>;
  dark_theme_accent_color: number;
  dark_theme_colors: Array<number>;
}

export interface Tdlibgift {
  "@type": "gift";
  id: string;
  publisher_chat_id: number;
  sticker: Sticker;
  star_count: number;
  default_sell_star_count: number;
  upgrade_star_count: number;
  upgrade_variant_count: number;
  has_colors: boolean;
  is_for_birthday: boolean;
  is_premium: boolean;
  auction_info: GiftAuction;
  next_send_date: number;
  user_limits: GiftPurchaseLimits;
  overall_limits: GiftPurchaseLimits;
  background: GiftBackground;
  first_send_date: number;
  last_send_date: number;
}

export interface TdlibupgradedGift {
  "@type": "upgradedGift";
  id: string;
  regular_gift_id: string;
  publisher_chat_id: number;
  title: string;
  name: string;
  number: number;
  total_upgraded_count: number;
  max_upgraded_count: number;
  is_premium: boolean;
  is_theme_available: boolean;
  used_theme_chat_id: number;
  host_id: MessageSender;
  owner_id: MessageSender;
  owner_address: string;
  owner_name: string;
  gift_address: string;
  model: UpgradedGiftModel;
  symbol: UpgradedGiftSymbol;
  backdrop: UpgradedGiftBackdrop;
  original_details: UpgradedGiftOriginalDetails;
  colors: UpgradedGiftColors;
  resale_parameters: GiftResaleParameters;
  can_send_purchase_offer: boolean;
  value_currency: string;
  value_amount: number;
  value_usd_amount: number;
}

export interface TdlibupgradedGiftValueInfo {
  "@type": "upgradedGiftValueInfo";
  currency: string;
  value: number;
  is_value_average: boolean;
  initial_sale_date: number;
  initial_sale_star_count: number;
  initial_sale_price: number;
  last_sale_date: number;
  last_sale_price: number;
  is_last_sale_on_fragment: boolean;
  minimum_price: number;
  average_sale_price: number;
  telegram_listed_gift_count: number;
  fragment_listed_gift_count: number;
  fragment_url: string;
}

export interface TdlibupgradeGiftResult {
  "@type": "upgradeGiftResult";
  gift: UpgradedGift;
  received_gift_id: string;
  is_saved: boolean;
  can_be_transferred: boolean;
  transfer_star_count: number;
  drop_original_details_star_count: number;
  next_transfer_date: number;
  next_resale_date: number;
  export_date: number;
}

export interface TdlibavailableGift {
  "@type": "availableGift";
  gift: Gift;
  resale_count: number;
  min_resale_star_count: number;
  title: string;
}

export interface TdlibavailableGifts {
  "@type": "availableGifts";
  gifts: Array<AvailableGift>;
}

export interface TdlibgiftUpgradePrice {
  "@type": "giftUpgradePrice";
  date: number;
  star_count: number;
}

export interface TdlibupgradedGiftAttributeIdModel {
  "@type": "upgradedGiftAttributeIdModel";
  sticker_id: string;
}

export interface TdlibupgradedGiftAttributeIdSymbol {
  "@type": "upgradedGiftAttributeIdSymbol";
  sticker_id: string;
}

export interface TdlibupgradedGiftAttributeIdBackdrop {
  "@type": "upgradedGiftAttributeIdBackdrop";
  backdrop_id: number;
}

export interface TdlibupgradedGiftModelCount {
  "@type": "upgradedGiftModelCount";
  model: UpgradedGiftModel;
  total_count: number;
}

export interface TdlibupgradedGiftSymbolCount {
  "@type": "upgradedGiftSymbolCount";
  symbol: UpgradedGiftSymbol;
  total_count: number;
}

export interface TdlibupgradedGiftBackdropCount {
  "@type": "upgradedGiftBackdropCount";
  backdrop: UpgradedGiftBackdrop;
  total_count: number;
}




export interface TdlibgiftForResale {
  "@type": "giftForResale";
  gift: UpgradedGift;
  received_gift_id: string;
}

export interface TdlibgiftsForResale {
  "@type": "giftsForResale";
  total_count: number;
  gifts: Array<GiftForResale>;
  models: Array<UpgradedGiftModelCount>;
  symbols: Array<UpgradedGiftSymbolCount>;
  backdrops: Array<UpgradedGiftBackdropCount>;
  next_offset: string;
}


export interface TdlibgiftResaleResultPriceIncreased {
  "@type": "giftResaleResultPriceIncreased";
  price: GiftResalePrice;
}

export interface TdlibsentGiftRegular {
  "@type": "sentGiftRegular";
  gift: Gift;
}

export interface TdlibsentGiftUpgraded {
  "@type": "sentGiftUpgraded";
  gift: UpgradedGift;
}

export interface TdlibreceivedGift {
  "@type": "receivedGift";
  received_gift_id: string;
  sender_id: MessageSender;
  text: FormattedText;
  unique_gift_number: number;
  is_private: boolean;
  is_saved: boolean;
  is_pinned: boolean;
  can_be_upgraded: boolean;
  can_be_transferred: boolean;
  was_refunded: boolean;
  date: number;
  gift: SentGift;
  collection_ids: Array<number>;
  sell_star_count: number;
  prepaid_upgrade_star_count: number;
  is_upgrade_separate: boolean;
  transfer_star_count: number;
  drop_original_details_star_count: number;
  next_transfer_date: number;
  next_resale_date: number;
  export_date: number;
  prepaid_upgrade_hash: string;
}

export interface TdlibreceivedGifts {
  "@type": "receivedGifts";
  total_count: number;
  gifts: Array<ReceivedGift>;
  are_notifications_enabled: boolean;
  next_offset: string;
}

export interface TdlibgiftUpgradePreview {
  "@type": "giftUpgradePreview";
  models: Array<UpgradedGiftModel>;
  symbols: Array<UpgradedGiftSymbol>;
  backdrops: Array<UpgradedGiftBackdrop>;
  prices: Array<GiftUpgradePrice>;
  next_prices: Array<GiftUpgradePrice>;
}

export interface TdlibgiftUpgradeVariants {
  "@type": "giftUpgradeVariants";
  models: Array<UpgradedGiftModel>;
  symbols: Array<UpgradedGiftSymbol>;
  backdrops: Array<UpgradedGiftBackdrop>;
}

export interface TdlibauctionBid {
  "@type": "auctionBid";
  star_count: number;
  bid_date: number;
  position: number;
}

export interface TdlibuserAuctionBid {
  "@type": "userAuctionBid";
  star_count: number;
  bid_date: number;
  next_bid_star_count: number;
  owner_id: MessageSender;
  was_returned: boolean;
}

export interface TdlibauctionRound {
  "@type": "auctionRound";
  number: number;
  duration: number;
  extend_time: number;
  top_winner_count: number;
}

export interface TdlibauctionStateActive {
  "@type": "auctionStateActive";
  start_date: number;
  end_date: number;
  min_bid: number;
  bid_levels: Array<AuctionBid>;
  top_bidder_user_ids: Array<number>;
  rounds: Array<AuctionRound>;
  current_round_end_date: number;
  current_round_number: number;
  total_round_count: number;
  distributed_item_count: number;
  left_item_count: number;
  acquired_item_count: number;
  user_bid: UserAuctionBid;
}

export interface TdlibauctionStateFinished {
  "@type": "auctionStateFinished";
  start_date: number;
  end_date: number;
  average_price: number;
  acquired_item_count: number;
  telegram_listed_item_count: number;
  fragment_listed_item_count: number;
  fragment_url: string;
}

export interface TdlibgiftAuctionState {
  "@type": "giftAuctionState";
  gift: Gift;
  state: AuctionState;
}

export interface TdlibgiftAuctionAcquiredGift {
  "@type": "giftAuctionAcquiredGift";
  receiver_id: MessageSender;
  date: number;
  star_count: number;
  auction_round_number: number;
  auction_round_position: number;
  unique_gift_number: number;
  text: FormattedText;
  is_private: boolean;
}

export interface TdlibgiftAuctionAcquiredGifts {
  "@type": "giftAuctionAcquiredGifts";
  gifts: Array<GiftAuctionAcquiredGift>;
}







export interface TdlibstarTransactionTypeUserDeposit {
  "@type": "starTransactionTypeUserDeposit";
  user_id: number;
  sticker: Sticker;
}

export interface TdlibstarTransactionTypeGiveawayDeposit {
  "@type": "starTransactionTypeGiveawayDeposit";
  chat_id: number;
  giveaway_message_id: number;
}

export interface TdlibstarTransactionTypeFragmentWithdrawal {
  "@type": "starTransactionTypeFragmentWithdrawal";
  withdrawal_state: RevenueWithdrawalState;
}


export interface TdlibstarTransactionTypeTelegramApiUsage {
  "@type": "starTransactionTypeTelegramApiUsage";
  request_count: number;
}

export interface TdlibstarTransactionTypeBotPaidMediaPurchase {
  "@type": "starTransactionTypeBotPaidMediaPurchase";
  user_id: number;
  media: Array<PaidMedia>;
}

export interface TdlibstarTransactionTypeBotPaidMediaSale {
  "@type": "starTransactionTypeBotPaidMediaSale";
  user_id: number;
  media: Array<PaidMedia>;
  payload: string;
  affiliate: AffiliateInfo;
}

export interface TdlibstarTransactionTypeChannelPaidMediaPurchase {
  "@type": "starTransactionTypeChannelPaidMediaPurchase";
  chat_id: number;
  message_id: number;
  media: Array<PaidMedia>;
}

export interface TdlibstarTransactionTypeChannelPaidMediaSale {
  "@type": "starTransactionTypeChannelPaidMediaSale";
  user_id: number;
  message_id: number;
  media: Array<PaidMedia>;
}

export interface TdlibstarTransactionTypeBotInvoicePurchase {
  "@type": "starTransactionTypeBotInvoicePurchase";
  user_id: number;
  product_info: ProductInfo;
}

export interface TdlibstarTransactionTypeBotInvoiceSale {
  "@type": "starTransactionTypeBotInvoiceSale";
  user_id: number;
  product_info: ProductInfo;
  invoice_payload: string;
  affiliate: AffiliateInfo;
}

export interface TdlibstarTransactionTypeBotSubscriptionPurchase {
  "@type": "starTransactionTypeBotSubscriptionPurchase";
  user_id: number;
  subscription_period: number;
  product_info: ProductInfo;
}

export interface TdlibstarTransactionTypeBotSubscriptionSale {
  "@type": "starTransactionTypeBotSubscriptionSale";
  user_id: number;
  subscription_period: number;
  product_info: ProductInfo;
  invoice_payload: string;
  affiliate: AffiliateInfo;
}

export interface TdlibstarTransactionTypeChannelSubscriptionPurchase {
  "@type": "starTransactionTypeChannelSubscriptionPurchase";
  chat_id: number;
  subscription_period: number;
}

export interface TdlibstarTransactionTypeChannelSubscriptionSale {
  "@type": "starTransactionTypeChannelSubscriptionSale";
  user_id: number;
  subscription_period: number;
}

export interface TdlibstarTransactionTypeGiftAuctionBid {
  "@type": "starTransactionTypeGiftAuctionBid";
  owner_id: MessageSender;
  gift: Gift;
}

export interface TdlibstarTransactionTypeGiftPurchase {
  "@type": "starTransactionTypeGiftPurchase";
  owner_id: MessageSender;
  gift: Gift;
}

export interface TdlibstarTransactionTypeGiftPurchaseOffer {
  "@type": "starTransactionTypeGiftPurchaseOffer";
  gift: UpgradedGift;
}

export interface TdlibstarTransactionTypeGiftTransfer {
  "@type": "starTransactionTypeGiftTransfer";
  owner_id: MessageSender;
  gift: UpgradedGift;
}

export interface TdlibstarTransactionTypeGiftOriginalDetailsDrop {
  "@type": "starTransactionTypeGiftOriginalDetailsDrop";
  owner_id: MessageSender;
  gift: UpgradedGift;
}

export interface TdlibstarTransactionTypeGiftSale {
  "@type": "starTransactionTypeGiftSale";
  user_id: number;
  gift: Gift;
}

export interface TdlibstarTransactionTypeGiftUpgrade {
  "@type": "starTransactionTypeGiftUpgrade";
  user_id: number;
  gift: UpgradedGift;
}

export interface TdlibstarTransactionTypeGiftUpgradePurchase {
  "@type": "starTransactionTypeGiftUpgradePurchase";
  owner_id: MessageSender;
  gift: Gift;
}

export interface TdlibstarTransactionTypeUpgradedGiftPurchase {
  "@type": "starTransactionTypeUpgradedGiftPurchase";
  user_id: number;
  gift: UpgradedGift;
}

export interface TdlibstarTransactionTypeUpgradedGiftSale {
  "@type": "starTransactionTypeUpgradedGiftSale";
  user_id: number;
  gift: UpgradedGift;
  commission_per_mille: number;
  commission_star_amount: StarAmount;
  via_offer: boolean;
}

export interface TdlibstarTransactionTypeChannelPaidReactionSend {
  "@type": "starTransactionTypeChannelPaidReactionSend";
  chat_id: number;
  message_id: number;
}

export interface TdlibstarTransactionTypeChannelPaidReactionReceive {
  "@type": "starTransactionTypeChannelPaidReactionReceive";
  user_id: number;
  message_id: number;
}

export interface TdlibstarTransactionTypeAffiliateProgramCommission {
  "@type": "starTransactionTypeAffiliateProgramCommission";
  chat_id: number;
  commission_per_mille: number;
}

export interface TdlibstarTransactionTypePaidMessageSend {
  "@type": "starTransactionTypePaidMessageSend";
  chat_id: number;
  message_count: number;
}

export interface TdlibstarTransactionTypePaidMessageReceive {
  "@type": "starTransactionTypePaidMessageReceive";
  sender_id: MessageSender;
  message_count: number;
  commission_per_mille: number;
  commission_star_amount: StarAmount;
}

export interface TdlibstarTransactionTypePaidGroupCallMessageSend {
  "@type": "starTransactionTypePaidGroupCallMessageSend";
  chat_id: number;
}

export interface TdlibstarTransactionTypePaidGroupCallMessageReceive {
  "@type": "starTransactionTypePaidGroupCallMessageReceive";
  sender_id: MessageSender;
  commission_per_mille: number;
  commission_star_amount: StarAmount;
}

export interface TdlibstarTransactionTypePaidGroupCallReactionSend {
  "@type": "starTransactionTypePaidGroupCallReactionSend";
  chat_id: number;
}

export interface TdlibstarTransactionTypePaidGroupCallReactionReceive {
  "@type": "starTransactionTypePaidGroupCallReactionReceive";
  sender_id: MessageSender;
  commission_per_mille: number;
  commission_star_amount: StarAmount;
}

export interface TdlibstarTransactionTypeSuggestedPostPaymentSend {
  "@type": "starTransactionTypeSuggestedPostPaymentSend";
  chat_id: number;
}

export interface TdlibstarTransactionTypeSuggestedPostPaymentReceive {
  "@type": "starTransactionTypeSuggestedPostPaymentReceive";
  user_id: number;
}

export interface TdlibstarTransactionTypePremiumPurchase {
  "@type": "starTransactionTypePremiumPurchase";
  user_id: number;
  month_count: number;
  sticker: Sticker;
}

export interface TdlibstarTransactionTypeBusinessBotTransferSend {
  "@type": "starTransactionTypeBusinessBotTransferSend";
  user_id: number;
}

export interface TdlibstarTransactionTypeBusinessBotTransferReceive {
  "@type": "starTransactionTypeBusinessBotTransferReceive";
  user_id: number;
}



export interface TdlibstarTransaction {
  "@type": "starTransaction";
  id: string;
  star_amount: StarAmount;
  is_refund: boolean;
  date: number;
  type: StarTransactionType;
}

export interface TdlibstarTransactions {
  "@type": "starTransactions";
  star_amount: StarAmount;
  transactions: Array<StarTransaction>;
  next_offset: string;
}

export interface TdlibtonTransactionTypeFragmentDeposit {
  "@type": "tonTransactionTypeFragmentDeposit";
  is_gift: boolean;
  sticker: Sticker;
}

export interface TdlibtonTransactionTypeFragmentWithdrawal {
  "@type": "tonTransactionTypeFragmentWithdrawal";
  withdrawal_state: RevenueWithdrawalState;
}

export interface TdlibtonTransactionTypeSuggestedPostPayment {
  "@type": "tonTransactionTypeSuggestedPostPayment";
  chat_id: number;
}

export interface TdlibtonTransactionTypeGiftPurchaseOffer {
  "@type": "tonTransactionTypeGiftPurchaseOffer";
  gift: UpgradedGift;
}

export interface TdlibtonTransactionTypeUpgradedGiftPurchase {
  "@type": "tonTransactionTypeUpgradedGiftPurchase";
  user_id: number;
  gift: UpgradedGift;
}

export interface TdlibtonTransactionTypeUpgradedGiftSale {
  "@type": "tonTransactionTypeUpgradedGiftSale";
  user_id: number;
  gift: UpgradedGift;
  commission_per_mille: number;
  commission_toncoin_amount: number;
  via_offer: boolean;
}


export interface TdlibtonTransaction {
  "@type": "tonTransaction";
  id: string;
  ton_amount: number;
  is_refund: boolean;
  date: number;
  type: TonTransactionType;
}

export interface TdlibtonTransactions {
  "@type": "tonTransactions";
  ton_amount: number;
  transactions: Array<TonTransaction>;
  next_offset: string;
}

export interface TdlibactiveStoryStateLive {
  "@type": "activeStoryStateLive";
  story_id: number;
}





export interface TdlibgiveawayParticipantStatusAlreadyWasMember {
  "@type": "giveawayParticipantStatusAlreadyWasMember";
  joined_chat_date: number;
}

export interface TdlibgiveawayParticipantStatusAdministrator {
  "@type": "giveawayParticipantStatusAdministrator";
  chat_id: number;
}

export interface TdlibgiveawayParticipantStatusDisallowedCountry {
  "@type": "giveawayParticipantStatusDisallowedCountry";
  user_country_code: string;
}

export interface TdlibgiveawayInfoOngoing {
  "@type": "giveawayInfoOngoing";
  creation_date: number;
  status: GiveawayParticipantStatus;
  is_ended: boolean;
}

export interface TdlibgiveawayInfoCompleted {
  "@type": "giveawayInfoCompleted";
  creation_date: number;
  actual_winners_selection_date: number;
  was_refunded: boolean;
  is_winner: boolean;
  winner_count: number;
  activation_count: number;
  gift_code: string;
  won_star_count: number;
}

export interface TdlibgiveawayPrizePremium {
  "@type": "giveawayPrizePremium";
  month_count: number;
}

export interface TdlibgiveawayPrizeStars {
  "@type": "giveawayPrizeStars";
  star_count: number;
}

export interface TdlibaccentColor {
  "@type": "accentColor";
  id: number;
  built_in_accent_color_id: number;
  light_theme_colors: Array<number>;
  dark_theme_colors: Array<number>;
  min_channel_chat_boost_level: number;
}

export interface TdlibprofileAccentColors {
  "@type": "profileAccentColors";
  palette_colors: Array<number>;
  background_colors: Array<number>;
  story_colors: Array<number>;
}

export interface TdlibprofileAccentColor {
  "@type": "profileAccentColor";
  id: number;
  light_theme_colors: ProfileAccentColors;
  dark_theme_colors: ProfileAccentColors;
  min_supergroup_chat_boost_level: number;
  min_channel_chat_boost_level: number;
}

export interface TdlibuserRating {
  "@type": "userRating";
  level: number;
  is_maximum_level_reached: boolean;
  rating: number;
  current_level_rating: number;
  next_level_rating: number;
}

export interface TdlibrestrictionInfo {
  "@type": "restrictionInfo";
  restriction_reason: string;
  has_sensitive_content: boolean;
}

export interface TdlibemojiStatusTypeCustomEmoji {
  "@type": "emojiStatusTypeCustomEmoji";
  custom_emoji_id: string;
}

export interface TdlibemojiStatusTypeUpgradedGift {
  "@type": "emojiStatusTypeUpgradedGift";
  upgraded_gift_id: string;
  gift_title: string;
  gift_name: string;
  model_custom_emoji_id: string;
  symbol_custom_emoji_id: string;
  backdrop_colors: UpgradedGiftBackdropColors;
}

export interface TdlibemojiStatus {
  "@type": "emojiStatus";
  type: EmojiStatusType;
  expiration_date: number;
}

export interface TdlibemojiStatuses {
  "@type": "emojiStatuses";
  emoji_statuses: Array<EmojiStatus>;
}

export interface TdlibemojiStatusCustomEmojis {
  "@type": "emojiStatusCustomEmojis";
  custom_emoji_ids: Array<string>;
}

export interface Tdlibusernames {
  "@type": "usernames";
  active_usernames: Array<string>;
  disabled_usernames: Array<string>;
  editable_username: string;
  collectible_usernames: Array<string>;
}

export interface Tdlibuser {
  "@type": "user";
  id: number;
  first_name: string;
  last_name: string;
  usernames: Usernames;
  phone_number: string;
  status: UserStatus;
  profile_photo: ProfilePhoto;
  accent_color_id: number;
  background_custom_emoji_id: string;
  upgraded_gift_colors: UpgradedGiftColors;
  profile_accent_color_id: number;
  profile_background_custom_emoji_id: string;
  emoji_status: EmojiStatus;
  is_contact: boolean;
  is_mutual_contact: boolean;
  is_close_friend: boolean;
  verification_status: VerificationStatus;
  is_premium: boolean;
  is_support: boolean;
  restriction_info: RestrictionInfo;
  active_story_state: ActiveStoryState;
  restricts_new_chats: boolean;
  paid_message_star_count: number;
  have_access: boolean;
  type: UserType;
  language_code: string;
  added_to_attachment_menu: boolean;
}

export interface TdlibbotInfo {
  "@type": "botInfo";
  short_description: string;
  description: string;
  photo: Photo;
  animation: Animation;
  menu_button: BotMenuButton;
  commands: Array<BotCommand>;
  privacy_policy_url: string;
  default_group_administrator_rights: ChatAdministratorRights;
  default_channel_administrator_rights: ChatAdministratorRights;
  affiliate_program: AffiliateProgramInfo;
  web_app_background_light_color: number;
  web_app_background_dark_color: number;
  web_app_header_light_color: number;
  web_app_header_dark_color: number;
  verification_parameters: BotVerificationParameters;
  can_get_revenue_statistics: boolean;
  can_manage_emoji_status: boolean;
  has_media_previews: boolean;
  edit_commands_link: InternalLinkType;
  edit_description_link: InternalLinkType;
  edit_description_media_link: InternalLinkType;
  edit_settings_link: InternalLinkType;
}

export interface TdlibuserFullInfo {
  "@type": "userFullInfo";
  personal_photo: ChatPhoto;
  photo: ChatPhoto;
  public_photo: ChatPhoto;
  block_list: BlockList;
  can_be_called: boolean;
  supports_video_calls: boolean;
  has_private_calls: boolean;
  has_private_forwards: boolean;
  has_restricted_voice_and_video_note_messages: boolean;
  has_posted_to_profile_stories: boolean;
  has_sponsored_messages_enabled: boolean;
  need_phone_number_privacy_exception: boolean;
  set_chat_background: boolean;
  bio: FormattedText;
  birthdate: Birthdate;
  personal_chat_id: number;
  gift_count: number;
  group_in_common_count: number;
  incoming_paid_message_star_count: number;
  outgoing_paid_message_star_count: number;
  gift_settings: GiftSettings;
  bot_verification: BotVerification;
  main_profile_tab: ProfileTab;
  first_profile_audio: Audio;
  rating: UserRating;
  pending_rating: UserRating;
  pending_rating_date: number;
  note: FormattedText;
  business_info: BusinessInfo;
  bot_info: BotInfo;
}

export interface Tdlibusers {
  "@type": "users";
  total_count: number;
  user_ids: Array<number>;
}

export interface TdlibfoundUsers {
  "@type": "foundUsers";
  user_ids: Array<number>;
  next_offset: string;
}

export interface TdlibchatAdministrator {
  "@type": "chatAdministrator";
  user_id: number;
  custom_title: string;
  is_owner: boolean;
}

export interface TdlibchatAdministrators {
  "@type": "chatAdministrators";
  administrators: Array<ChatAdministrator>;
}

export interface TdlibchatMemberStatusCreator {
  "@type": "chatMemberStatusCreator";
  custom_title: string;
  is_anonymous: boolean;
  is_member: boolean;
}

export interface TdlibchatMemberStatusAdministrator {
  "@type": "chatMemberStatusAdministrator";
  custom_title: string;
  can_be_edited: boolean;
  rights: ChatAdministratorRights;
}

export interface TdlibchatMemberStatusMember {
  "@type": "chatMemberStatusMember";
  member_until_date: number;
}

export interface TdlibchatMemberStatusRestricted {
  "@type": "chatMemberStatusRestricted";
  is_member: boolean;
  restricted_until_date: number;
  permissions: ChatPermissions;
}


export interface TdlibchatMemberStatusBanned {
  "@type": "chatMemberStatusBanned";
  banned_until_date: number;
}

export interface TdlibchatMember {
  "@type": "chatMember";
  member_id: MessageSender;
  inviter_user_id: number;
  joined_chat_date: number;
  status: ChatMemberStatus;
}

export interface TdlibchatMembers {
  "@type": "chatMembers";
  total_count: number;
  members: Array<ChatMember>;
}




export interface TdlibchatMembersFilterMention {
  "@type": "chatMembersFilterMention";
  topic_id: MessageTopic;
}





export interface TdlibsupergroupMembersFilterContacts {
  "@type": "supergroupMembersFilterContacts";
  query: string;
}


export interface TdlibsupergroupMembersFilterSearch {
  "@type": "supergroupMembersFilterSearch";
  query: string;
}

export interface TdlibsupergroupMembersFilterRestricted {
  "@type": "supergroupMembersFilterRestricted";
  query: string;
}

export interface TdlibsupergroupMembersFilterBanned {
  "@type": "supergroupMembersFilterBanned";
  query: string;
}

export interface TdlibsupergroupMembersFilterMention {
  "@type": "supergroupMembersFilterMention";
  query: string;
  topic_id: MessageTopic;
}


export interface TdlibchatInviteLink {
  "@type": "chatInviteLink";
  invite_link: string;
  name: string;
  creator_user_id: number;
  date: number;
  edit_date: number;
  expiration_date: number;
  subscription_pricing: StarSubscriptionPricing;
  member_limit: number;
  member_count: number;
  expired_member_count: number;
  pending_join_request_count: number;
  creates_join_request: boolean;
  is_primary: boolean;
  is_revoked: boolean;
}

export interface TdlibchatInviteLinks {
  "@type": "chatInviteLinks";
  total_count: number;
  invite_links: Array<ChatInviteLink>;
}

export interface TdlibchatInviteLinkCount {
  "@type": "chatInviteLinkCount";
  user_id: number;
  invite_link_count: number;
  revoked_invite_link_count: number;
}

export interface TdlibchatInviteLinkCounts {
  "@type": "chatInviteLinkCounts";
  invite_link_counts: Array<ChatInviteLinkCount>;
}

export interface TdlibchatInviteLinkMember {
  "@type": "chatInviteLinkMember";
  user_id: number;
  joined_chat_date: number;
  via_chat_folder_invite_link: boolean;
  approver_user_id: number;
}

export interface TdlibchatInviteLinkMembers {
  "@type": "chatInviteLinkMembers";
  total_count: number;
  members: Array<ChatInviteLinkMember>;
}




export interface TdlibchatInviteLinkSubscriptionInfo {
  "@type": "chatInviteLinkSubscriptionInfo";
  pricing: StarSubscriptionPricing;
  can_reuse: boolean;
  form_id: string;
}

export interface TdlibchatInviteLinkInfo {
  "@type": "chatInviteLinkInfo";
  chat_id: number;
  accessible_for: number;
  type: InviteLinkChatType;
  title: string;
  photo: ChatPhotoInfo;
  accent_color_id: number;
  description: string;
  member_count: number;
  member_user_ids: Array<number>;
  subscription_info: ChatInviteLinkSubscriptionInfo;
  creates_join_request: boolean;
  is_public: boolean;
  verification_status: VerificationStatus;
}

export interface TdlibchatJoinRequest {
  "@type": "chatJoinRequest";
  user_id: number;
  date: number;
  bio: string;
}

export interface TdlibchatJoinRequests {
  "@type": "chatJoinRequests";
  total_count: number;
  requests: Array<ChatJoinRequest>;
}

export interface TdlibchatJoinRequestsInfo {
  "@type": "chatJoinRequestsInfo";
  total_count: number;
  user_ids: Array<number>;
}

export interface TdlibbasicGroup {
  "@type": "basicGroup";
  id: number;
  member_count: number;
  status: ChatMemberStatus;
  is_active: boolean;
  upgraded_to_supergroup_id: number;
}

export interface TdlibbasicGroupFullInfo {
  "@type": "basicGroupFullInfo";
  photo: ChatPhoto;
  description: string;
  creator_user_id: number;
  members: Array<ChatMember>;
  can_hide_members: boolean;
  can_toggle_aggressive_anti_spam: boolean;
  invite_link: ChatInviteLink;
  bot_commands: Array<BotCommands>;
}

export interface Tdlibsupergroup {
  "@type": "supergroup";
  id: number;
  usernames: Usernames;
  date: number;
  status: ChatMemberStatus;
  member_count: number;
  boost_level: number;
  has_automatic_translation: boolean;
  has_linked_chat: boolean;
  has_location: boolean;
  sign_messages: boolean;
  show_message_sender: boolean;
  join_to_send_messages: boolean;
  join_by_request: boolean;
  is_slow_mode_enabled: boolean;
  is_channel: boolean;
  is_broadcast_group: boolean;
  is_forum: boolean;
  is_direct_messages_group: boolean;
  is_administered_direct_messages_group: boolean;
  verification_status: VerificationStatus;
  has_direct_messages_group: boolean;
  has_forum_tabs: boolean;
  restriction_info: RestrictionInfo;
  paid_message_star_count: number;
  active_story_state: ActiveStoryState;
}

export interface TdlibsupergroupFullInfo {
  "@type": "supergroupFullInfo";
  photo: ChatPhoto;
  description: string;
  member_count: number;
  administrator_count: number;
  restricted_count: number;
  banned_count: number;
  linked_chat_id: number;
  direct_messages_chat_id: number;
  slow_mode_delay: number;
  slow_mode_delay_expires_in: number;
  can_enable_paid_messages: boolean;
  can_enable_paid_reaction: boolean;
  can_get_members: boolean;
  has_hidden_members: boolean;
  can_hide_members: boolean;
  can_set_sticker_set: boolean;
  can_set_location: boolean;
  can_get_statistics: boolean;
  can_get_revenue_statistics: boolean;
  can_get_star_revenue_statistics: boolean;
  can_send_gift: boolean;
  can_toggle_aggressive_anti_spam: boolean;
  is_all_history_available: boolean;
  can_have_sponsored_messages: boolean;
  has_aggressive_anti_spam_enabled: boolean;
  has_paid_media_allowed: boolean;
  has_pinned_stories: boolean;
  gift_count: number;
  my_boost_count: number;
  unrestrict_boost_count: number;
  outgoing_paid_message_star_count: number;
  sticker_set_id: string;
  custom_emoji_sticker_set_id: string;
  location: ChatLocation;
  invite_link: ChatInviteLink;
  bot_commands: Array<BotCommands>;
  bot_verification: BotVerification;
  main_profile_tab: ProfileTab;
  upgraded_from_basic_group_id: number;
  upgraded_from_max_message_id: number;
}




export interface TdlibsecretChat {
  "@type": "secretChat";
  id: number;
  user_id: number;
  state: SecretChatState;
  is_outbound: boolean;
  key_hash: string;
  layer: number;
}

export interface TdlibpublicPostSearchLimits {
  "@type": "publicPostSearchLimits";
  daily_free_query_count: number;
  remaining_free_query_count: number;
  next_free_query_in: number;
  star_count: number;
  is_current_query_free: boolean;
}

export interface TdlibmessageSenderUser {
  "@type": "messageSenderUser";
  user_id: number;
}

export interface TdlibmessageSenderChat {
  "@type": "messageSenderChat";
  chat_id: number;
}

export interface TdlibmessageSenders {
  "@type": "messageSenders";
  total_count: number;
  senders: Array<MessageSender>;
}

export interface TdlibchatMessageSender {
  "@type": "chatMessageSender";
  sender: MessageSender;
  needs_premium: boolean;
}

export interface TdlibchatMessageSenders {
  "@type": "chatMessageSenders";
  senders: Array<ChatMessageSender>;
}

export interface TdlibmessageReadDateRead {
  "@type": "messageReadDateRead";
  read_date: number;
}





export interface TdlibmessageViewer {
  "@type": "messageViewer";
  user_id: number;
  view_date: number;
}

export interface TdlibmessageViewers {
  "@type": "messageViewers";
  viewers: Array<MessageViewer>;
}

export interface TdlibmessageOriginUser {
  "@type": "messageOriginUser";
  sender_user_id: number;
}

export interface TdlibmessageOriginHiddenUser {
  "@type": "messageOriginHiddenUser";
  sender_name: string;
}

export interface TdlibmessageOriginChat {
  "@type": "messageOriginChat";
  sender_chat_id: number;
  author_signature: string;
}

export interface TdlibmessageOriginChannel {
  "@type": "messageOriginChannel";
  chat_id: number;
  message_id: number;
  author_signature: string;
}

export interface TdlibforwardSource {
  "@type": "forwardSource";
  chat_id: number;
  message_id: number;
  sender_id: MessageSender;
  sender_name: string;
  date: number;
  is_outgoing: boolean;
}

export interface TdlibreactionTypeEmoji {
  "@type": "reactionTypeEmoji";
  emoji: string;
}

export interface TdlibreactionTypeCustomEmoji {
  "@type": "reactionTypeCustomEmoji";
  custom_emoji_id: string;
}




export interface TdlibpaidReactionTypeChat {
  "@type": "paidReactionTypeChat";
  chat_id: number;
}

export interface TdlibpaidReactor {
  "@type": "paidReactor";
  sender_id: MessageSender;
  star_count: number;
  is_top: boolean;
  is_me: boolean;
  is_anonymous: boolean;
}

export interface TdlibliveStoryDonors {
  "@type": "liveStoryDonors";
  total_star_count: number;
  top_donors: Array<PaidReactor>;
}

export interface TdlibmessageForwardInfo {
  "@type": "messageForwardInfo";
  origin: MessageOrigin;
  date: number;
  source: ForwardSource;
  public_service_announcement_type: string;
}

export interface TdlibmessageImportInfo {
  "@type": "messageImportInfo";
  sender_name: string;
  date: number;
}

export interface TdlibmessageReplyInfo {
  "@type": "messageReplyInfo";
  reply_count: number;
  recent_replier_ids: Array<MessageSender>;
  last_read_inbox_message_id: number;
  last_read_outbox_message_id: number;
  last_message_id: number;
}

export interface TdlibmessageReaction {
  "@type": "messageReaction";
  type: ReactionType;
  total_count: number;
  is_chosen: boolean;
  used_sender_id: MessageSender;
  recent_sender_ids: Array<MessageSender>;
}

export interface TdlibmessageReactions {
  "@type": "messageReactions";
  reactions: Array<MessageReaction>;
  are_tags: boolean;
  paid_reactors: Array<PaidReactor>;
  can_get_added_reactions: boolean;
}

export interface TdlibmessageInteractionInfo {
  "@type": "messageInteractionInfo";
  view_count: number;
  forward_count: number;
  reply_info: MessageReplyInfo;
  reactions: MessageReactions;
}

export interface TdlibunreadReaction {
  "@type": "unreadReaction";
  type: ReactionType;
  sender_id: MessageSender;
  is_big: boolean;
}

export interface TdlibmessageTopicThread {
  "@type": "messageTopicThread";
  message_thread_id: number;
}

export interface TdlibmessageTopicForum {
  "@type": "messageTopicForum";
  forum_topic_id: number;
}

export interface TdlibmessageTopicDirectMessages {
  "@type": "messageTopicDirectMessages";
  direct_messages_chat_topic_id: number;
}

export interface TdlibmessageTopicSavedMessages {
  "@type": "messageTopicSavedMessages";
  saved_messages_topic_id: number;
}

export interface TdlibmessageEffectTypeEmojiReaction {
  "@type": "messageEffectTypeEmojiReaction";
  select_animation: Sticker;
  effect_animation: Sticker;
}

export interface TdlibmessageEffectTypePremiumSticker {
  "@type": "messageEffectTypePremiumSticker";
  sticker: Sticker;
}

export interface TdlibmessageEffect {
  "@type": "messageEffect";
  id: string;
  static_icon: Sticker;
  emoji: string;
  is_premium: boolean;
  type: MessageEffectType;
}

export interface TdlibmessageSendingStatePending {
  "@type": "messageSendingStatePending";
  sending_id: number;
}

export interface TdlibmessageSendingStateFailed {
  "@type": "messageSendingStateFailed";
  error: Error;
  can_retry: boolean;
  need_another_sender: boolean;
  need_another_reply_quote: boolean;
  need_drop_reply: boolean;
  required_paid_message_star_count: number;
  retry_after: number;
}

export interface TdlibtextQuote {
  "@type": "textQuote";
  text: FormattedText;
  position: number;
  is_manual: boolean;
}

export interface TdlibinputTextQuote {
  "@type": "inputTextQuote";
  text: FormattedText;
  position: number;
}

export interface TdlibmessageReplyToMessage {
  "@type": "messageReplyToMessage";
  chat_id: number;
  message_id: number;
  quote: TextQuote;
  checklist_task_id: number;
  origin: MessageOrigin;
  origin_send_date: number;
  content: MessageContent;
}

export interface TdlibmessageReplyToStory {
  "@type": "messageReplyToStory";
  story_poster_chat_id: number;
  story_id: number;
}

export interface TdlibinputMessageReplyToMessage {
  "@type": "inputMessageReplyToMessage";
  message_id: number;
  quote: InputTextQuote;
  checklist_task_id: number;
}

export interface TdlibinputMessageReplyToExternalMessage {
  "@type": "inputMessageReplyToExternalMessage";
  chat_id: number;
  message_id: number;
  quote: InputTextQuote;
  checklist_task_id: number;
}

export interface TdlibinputMessageReplyToStory {
  "@type": "inputMessageReplyToStory";
  story_poster_chat_id: number;
  story_id: number;
}

export interface TdlibfactCheck {
  "@type": "factCheck";
  text: FormattedText;
  country_code: string;
}

export interface Tdlibmessage {
  "@type": "message";
  id: number;
  sender_id: MessageSender;
  chat_id: number;
  sending_state: MessageSendingState;
  scheduling_state: MessageSchedulingState;
  is_outgoing: boolean;
  is_pinned: boolean;
  is_from_offline: boolean;
  can_be_saved: boolean;
  has_timestamped_media: boolean;
  is_channel_post: boolean;
  is_paid_star_suggested_post: boolean;
  is_paid_ton_suggested_post: boolean;
  contains_unread_mention: boolean;
  date: number;
  edit_date: number;
  forward_info: MessageForwardInfo;
  import_info: MessageImportInfo;
  interaction_info: MessageInteractionInfo;
  unread_reactions: Array<UnreadReaction>;
  fact_check: FactCheck;
  suggested_post_info: SuggestedPostInfo;
  reply_to: MessageReplyTo;
  topic_id: MessageTopic;
  self_destruct_type: MessageSelfDestructType;
  self_destruct_in: number;
  auto_delete_in: number;
  via_bot_user_id: number;
  sender_business_bot_user_id: number;
  sender_boost_count: number;
  paid_message_star_count: number;
  author_signature: string;
  media_album_id: string;
  effect_id: string;
  restriction_info: RestrictionInfo;
  summary_language_code: string;
  content: MessageContent;
  reply_markup: ReplyMarkup;
}

export interface Tdlibmessages {
  "@type": "messages";
  total_count: number;
  messages: Array<Message>;
}

export interface TdlibfoundMessages {
  "@type": "foundMessages";
  total_count: number;
  messages: Array<Message>;
  next_offset: string;
}

export interface TdlibfoundChatMessages {
  "@type": "foundChatMessages";
  total_count: number;
  messages: Array<Message>;
  next_from_message_id: number;
}

export interface TdlibfoundPublicPosts {
  "@type": "foundPublicPosts";
  messages: Array<Message>;
  next_offset: string;
  search_limits: PublicPostSearchLimits;
  are_limits_exceeded: boolean;
}

export interface TdlibmessagePosition {
  "@type": "messagePosition";
  position: number;
  message_id: number;
  date: number;
}

export interface TdlibmessagePositions {
  "@type": "messagePositions";
  total_count: number;
  positions: Array<MessagePosition>;
}

export interface TdlibmessageCalendarDay {
  "@type": "messageCalendarDay";
  total_count: number;
  message: Message;
}

export interface TdlibmessageCalendar {
  "@type": "messageCalendar";
  total_count: number;
  days: Array<MessageCalendarDay>;
}

export interface TdlibbusinessMessage {
  "@type": "businessMessage";
  message: Message;
  reply_to_message: Message;
}

export interface TdlibbusinessMessages {
  "@type": "businessMessages";
  messages: Array<BusinessMessage>;
}












export interface TdlibadvertisementSponsor {
  "@type": "advertisementSponsor";
  url: string;
  photo: Photo;
  info: string;
}

export interface TdlibsponsoredMessage {
  "@type": "sponsoredMessage";
  message_id: number;
  is_recommended: boolean;
  can_be_reported: boolean;
  content: MessageContent;
  sponsor: AdvertisementSponsor;
  title: string;
  button_text: string;
  accent_color_id: number;
  background_custom_emoji_id: string;
  additional_info: string;
}

export interface TdlibsponsoredMessages {
  "@type": "sponsoredMessages";
  messages: Array<SponsoredMessage>;
  messages_between: number;
}

export interface TdlibsponsoredChat {
  "@type": "sponsoredChat";
  unique_id: number;
  chat_id: number;
  sponsor_info: string;
  additional_info: string;
}

export interface TdlibsponsoredChats {
  "@type": "sponsoredChats";
  chats: Array<SponsoredChat>;
}

export interface TdlibvideoMessageAdvertisement {
  "@type": "videoMessageAdvertisement";
  unique_id: number;
  text: string;
  min_display_duration: number;
  max_display_duration: number;
  can_be_reported: boolean;
  sponsor: AdvertisementSponsor;
  title: string;
  additional_info: string;
}

export interface TdlibvideoMessageAdvertisements {
  "@type": "videoMessageAdvertisements";
  advertisements: Array<VideoMessageAdvertisement>;
  start_delay: number;
  between_delay: number;
}

export interface TdlibreportOption {
  "@type": "reportOption";
  id: string;
  text: string;
}



export interface TdlibreportSponsoredResultOptionRequired {
  "@type": "reportSponsoredResultOptionRequired";
  title: string;
  options: Array<ReportOption>;
}



export interface TdlibfileDownload {
  "@type": "fileDownload";
  file_id: number;
  message: Message;
  add_date: number;
  complete_date: number;
  is_paused: boolean;
}

export interface TdlibdownloadedFileCounts {
  "@type": "downloadedFileCounts";
  active_count: number;
  paused_count: number;
  completed_count: number;
}

export interface TdlibfoundFileDownloads {
  "@type": "foundFileDownloads";
  total_counts: DownloadedFileCounts;
  files: Array<FileDownload>;
  next_offset: string;
}




export interface TdlibchatNotificationSettings {
  "@type": "chatNotificationSettings";
  use_default_mute_for: boolean;
  mute_for: number;
  use_default_sound: boolean;
  sound_id: string;
  use_default_show_preview: boolean;
  show_preview: boolean;
  use_default_mute_stories: boolean;
  mute_stories: boolean;
  use_default_story_sound: boolean;
  story_sound_id: string;
  use_default_show_story_poster: boolean;
  show_story_poster: boolean;
  use_default_disable_pinned_message_notifications: boolean;
  disable_pinned_message_notifications: boolean;
  use_default_disable_mention_notifications: boolean;
  disable_mention_notifications: boolean;
}

export interface TdlibscopeNotificationSettings {
  "@type": "scopeNotificationSettings";
  mute_for: number;
  sound_id: string;
  show_preview: boolean;
  use_default_mute_stories: boolean;
  mute_stories: boolean;
  story_sound_id: string;
  show_story_poster: boolean;
  disable_pinned_message_notifications: boolean;
  disable_mention_notifications: boolean;
}




export interface TdlibreactionNotificationSettings {
  "@type": "reactionNotificationSettings";
  message_reaction_source: ReactionNotificationSource;
  story_reaction_source: ReactionNotificationSource;
  sound_id: string;
  show_preview: boolean;
}

export interface TdlibdraftMessage {
  "@type": "draftMessage";
  reply_to: InputMessageReplyTo;
  date: number;
  input_message_text: InputMessageContent;
  effect_id: string;
  suggested_post_info: InputSuggestedPostInfo;
}

export interface TdlibchatTypePrivate {
  "@type": "chatTypePrivate";
  user_id: number;
}

export interface TdlibchatTypeBasicGroup {
  "@type": "chatTypeBasicGroup";
  basic_group_id: number;
}

export interface TdlibchatTypeSupergroup {
  "@type": "chatTypeSupergroup";
  supergroup_id: number;
  is_channel: boolean;
}

export interface TdlibchatTypeSecret {
  "@type": "chatTypeSecret";
  secret_chat_id: number;
  user_id: number;
}

export interface TdlibchatFolderIcon {
  "@type": "chatFolderIcon";
  name: string;
}

export interface TdlibchatFolderName {
  "@type": "chatFolderName";
  text: FormattedText;
  animate_custom_emoji: boolean;
}

export interface TdlibchatFolder {
  "@type": "chatFolder";
  name: ChatFolderName;
  icon: ChatFolderIcon;
  color_id: number;
  is_shareable: boolean;
  pinned_chat_ids: Array<number>;
  included_chat_ids: Array<number>;
  excluded_chat_ids: Array<number>;
  exclude_muted: boolean;
  exclude_read: boolean;
  exclude_archived: boolean;
  include_contacts: boolean;
  include_non_contacts: boolean;
  include_bots: boolean;
  include_groups: boolean;
  include_channels: boolean;
}

export interface TdlibchatFolderInfo {
  "@type": "chatFolderInfo";
  id: number;
  name: ChatFolderName;
  icon: ChatFolderIcon;
  color_id: number;
  is_shareable: boolean;
  has_my_invite_links: boolean;
}

export interface TdlibchatFolderInviteLink {
  "@type": "chatFolderInviteLink";
  invite_link: string;
  name: string;
  chat_ids: Array<number>;
}

export interface TdlibchatFolderInviteLinks {
  "@type": "chatFolderInviteLinks";
  invite_links: Array<ChatFolderInviteLink>;
}

export interface TdlibchatFolderInviteLinkInfo {
  "@type": "chatFolderInviteLinkInfo";
  chat_folder_info: ChatFolderInfo;
  missing_chat_ids: Array<number>;
  added_chat_ids: Array<number>;
}

export interface TdlibrecommendedChatFolder {
  "@type": "recommendedChatFolder";
  folder: ChatFolder;
  description: string;
}

export interface TdlibrecommendedChatFolders {
  "@type": "recommendedChatFolders";
  chat_folders: Array<RecommendedChatFolder>;
}

export interface TdlibarchiveChatListSettings {
  "@type": "archiveChatListSettings";
  archive_and_mute_new_chats_from_unknown_users: boolean;
  keep_unmuted_chats_archived: boolean;
  keep_chats_from_folders_archived: boolean;
}



export interface TdlibchatListFolder {
  "@type": "chatListFolder";
  chat_folder_id: number;
}

export interface TdlibchatLists {
  "@type": "chatLists";
  chat_lists: Array<ChatList>;
}


export interface TdlibchatSourcePublicServiceAnnouncement {
  "@type": "chatSourcePublicServiceAnnouncement";
  type: string;
  text: string;
}

export interface TdlibchatPosition {
  "@type": "chatPosition";
  list: ChatList;
  order: string;
  is_pinned: boolean;
  source: ChatSource;
}

export interface TdlibchatAvailableReactionsAll {
  "@type": "chatAvailableReactionsAll";
  max_reaction_count: number;
}

export interface TdlibchatAvailableReactionsSome {
  "@type": "chatAvailableReactionsSome";
  reactions: Array<ReactionType>;
  max_reaction_count: number;
}

export interface TdlibsavedMessagesTag {
  "@type": "savedMessagesTag";
  tag: ReactionType;
  label: string;
  count: number;
}

export interface TdlibsavedMessagesTags {
  "@type": "savedMessagesTags";
  tags: Array<SavedMessagesTag>;
}

export interface TdlibbusinessBotManageBar {
  "@type": "businessBotManageBar";
  bot_user_id: number;
  manage_url: string;
  is_bot_paused: boolean;
  can_bot_reply: boolean;
}

export interface TdlibvideoChat {
  "@type": "videoChat";
  group_call_id: number;
  has_participants: boolean;
  default_participant_id: MessageSender;
}

export interface Tdlibchat {
  "@type": "chat";
  id: number;
  type: ChatType;
  title: string;
  photo: ChatPhotoInfo;
  accent_color_id: number;
  background_custom_emoji_id: string;
  upgraded_gift_colors: UpgradedGiftColors;
  profile_accent_color_id: number;
  profile_background_custom_emoji_id: string;
  permissions: ChatPermissions;
  last_message: Message;
  positions: Array<ChatPosition>;
  chat_lists: Array<ChatList>;
  message_sender_id: MessageSender;
  block_list: BlockList;
  has_protected_content: boolean;
  is_translatable: boolean;
  is_marked_as_unread: boolean;
  view_as_topics: boolean;
  has_scheduled_messages: boolean;
  can_be_deleted_only_for_self: boolean;
  can_be_deleted_for_all_users: boolean;
  can_be_reported: boolean;
  default_disable_notification: boolean;
  unread_count: number;
  last_read_inbox_message_id: number;
  last_read_outbox_message_id: number;
  unread_mention_count: number;
  unread_reaction_count: number;
  notification_settings: ChatNotificationSettings;
  available_reactions: ChatAvailableReactions;
  message_auto_delete_time: number;
  emoji_status: EmojiStatus;
  background: ChatBackground;
  theme: ChatTheme;
  action_bar: ChatActionBar;
  business_bot_manage_bar: BusinessBotManageBar;
  video_chat: VideoChat;
  pending_join_requests: ChatJoinRequestsInfo;
  reply_markup_message_id: number;
  draft_message: DraftMessage;
  client_data: string;
}

export interface Tdlibchats {
  "@type": "chats";
  total_count: number;
  chat_ids: Array<number>;
}

export interface TdlibfailedToAddMember {
  "@type": "failedToAddMember";
  user_id: number;
  premium_would_allow_invite: boolean;
  premium_required_to_send_messages: boolean;
}

export interface TdlibfailedToAddMembers {
  "@type": "failedToAddMembers";
  failed_to_add_members: Array<FailedToAddMember>;
}

export interface TdlibcreatedBasicGroupChat {
  "@type": "createdBasicGroupChat";
  chat_id: number;
  failed_to_add_members: FailedToAddMembers;
}



export interface TdlibaccountInfo {
  "@type": "accountInfo";
  registration_month: number;
  registration_year: number;
  phone_number_country_code: string;
  last_name_change_date: number;
  last_photo_change_date: number;
}

export interface TdlibchatActionBarReportSpam {
  "@type": "chatActionBarReportSpam";
  can_unarchive: boolean;
}


export interface TdlibchatActionBarReportAddBlock {
  "@type": "chatActionBarReportAddBlock";
  can_unarchive: boolean;
  account_info: AccountInfo;
}



export interface TdlibchatActionBarJoinRequest {
  "@type": "chatActionBarJoinRequest";
  title: string;
  is_channel: boolean;
  request_date: number;
}




export interface TdlibkeyboardButtonTypeRequestPoll {
  "@type": "keyboardButtonTypeRequestPoll";
  force_regular: boolean;
  force_quiz: boolean;
}

export interface TdlibkeyboardButtonTypeRequestUsers {
  "@type": "keyboardButtonTypeRequestUsers";
  id: number;
  restrict_user_is_bot: boolean;
  user_is_bot: boolean;
  restrict_user_is_premium: boolean;
  user_is_premium: boolean;
  max_quantity: number;
  request_name: boolean;
  request_username: boolean;
  request_photo: boolean;
}

export interface TdlibkeyboardButtonTypeRequestChat {
  "@type": "keyboardButtonTypeRequestChat";
  id: number;
  chat_is_channel: boolean;
  restrict_chat_is_forum: boolean;
  chat_is_forum: boolean;
  restrict_chat_has_username: boolean;
  chat_has_username: boolean;
  chat_is_created: boolean;
  user_administrator_rights: ChatAdministratorRights;
  bot_administrator_rights: ChatAdministratorRights;
  bot_is_member: boolean;
  request_title: boolean;
  request_username: boolean;
  request_photo: boolean;
}

export interface TdlibkeyboardButtonTypeWebApp {
  "@type": "keyboardButtonTypeWebApp";
  url: string;
}

export interface TdlibkeyboardButton {
  "@type": "keyboardButton";
  text: string;
  type: KeyboardButtonType;
}

export interface TdlibinlineKeyboardButtonTypeUrl {
  "@type": "inlineKeyboardButtonTypeUrl";
  url: string;
}

export interface TdlibinlineKeyboardButtonTypeLoginUrl {
  "@type": "inlineKeyboardButtonTypeLoginUrl";
  url: string;
  id: number;
  forward_text: string;
}

export interface TdlibinlineKeyboardButtonTypeWebApp {
  "@type": "inlineKeyboardButtonTypeWebApp";
  url: string;
}

export interface TdlibinlineKeyboardButtonTypeCallback {
  "@type": "inlineKeyboardButtonTypeCallback";
  data: string;
}

export interface TdlibinlineKeyboardButtonTypeCallbackWithPassword {
  "@type": "inlineKeyboardButtonTypeCallbackWithPassword";
  data: string;
}


export interface TdlibinlineKeyboardButtonTypeSwitchInline {
  "@type": "inlineKeyboardButtonTypeSwitchInline";
  query: string;
  target_chat: TargetChat;
}


export interface TdlibinlineKeyboardButtonTypeUser {
  "@type": "inlineKeyboardButtonTypeUser";
  user_id: number;
}

export interface TdlibinlineKeyboardButtonTypeCopyText {
  "@type": "inlineKeyboardButtonTypeCopyText";
  text: string;
}

export interface TdlibinlineKeyboardButton {
  "@type": "inlineKeyboardButton";
  text: string;
  type: InlineKeyboardButtonType;
}

export interface TdlibreplyMarkupRemoveKeyboard {
  "@type": "replyMarkupRemoveKeyboard";
  is_personal: boolean;
}

export interface TdlibreplyMarkupForceReply {
  "@type": "replyMarkupForceReply";
  is_personal: boolean;
  input_field_placeholder: string;
}

export interface TdlibreplyMarkupShowKeyboard {
  "@type": "replyMarkupShowKeyboard";
  rows: Array<Array<KeyboardButton>>;
  is_persistent: boolean;
  resize_keyboard: boolean;
  one_time: boolean;
  is_personal: boolean;
  input_field_placeholder: string;
}

export interface TdlibreplyMarkupInlineKeyboard {
  "@type": "replyMarkupInlineKeyboard";
  rows: Array<Array<InlineKeyboardButton>>;
}

export interface TdlibloginUrlInfoOpen {
  "@type": "loginUrlInfoOpen";
  url: string;
  skip_confirmation: boolean;
}

export interface TdlibloginUrlInfoRequestConfirmation {
  "@type": "loginUrlInfoRequestConfirmation";
  url: string;
  domain: string;
  bot_user_id: number;
  request_write_access: boolean;
}

export interface TdlibthemeParameters {
  "@type": "themeParameters";
  background_color: number;
  secondary_background_color: number;
  header_background_color: number;
  bottom_bar_background_color: number;
  section_background_color: number;
  section_separator_color: number;
  text_color: number;
  accent_text_color: number;
  section_header_text_color: number;
  subtitle_text_color: number;
  destructive_text_color: number;
  hint_color: number;
  link_color: number;
  button_color: number;
  button_text_color: number;
}




export interface TdlibfoundWebApp {
  "@type": "foundWebApp";
  web_app: WebApp;
  request_write_access: boolean;
  skip_confirmation: boolean;
}

export interface TdlibwebAppInfo {
  "@type": "webAppInfo";
  launch_id: string;
  url: string;
}

export interface TdlibmainWebApp {
  "@type": "mainWebApp";
  url: string;
  mode: WebAppOpenMode;
}

export interface TdlibwebAppOpenParameters {
  "@type": "webAppOpenParameters";
  theme: ThemeParameters;
  application_name: string;
  mode: WebAppOpenMode;
}

export interface TdlibmessageThreadInfo {
  "@type": "messageThreadInfo";
  chat_id: number;
  message_thread_id: number;
  reply_info: MessageReplyInfo;
  unread_message_count: number;
  messages: Array<Message>;
  draft_message: DraftMessage;
}



export interface TdlibsavedMessagesTopicTypeSavedFromChat {
  "@type": "savedMessagesTopicTypeSavedFromChat";
  chat_id: number;
}

export interface TdlibsavedMessagesTopic {
  "@type": "savedMessagesTopic";
  id: number;
  type: SavedMessagesTopicType;
  is_pinned: boolean;
  order: string;
  last_message: Message;
  draft_message: DraftMessage;
}

export interface TdlibdirectMessagesChatTopic {
  "@type": "directMessagesChatTopic";
  chat_id: number;
  id: number;
  sender_id: MessageSender;
  order: string;
  can_send_unpaid_messages: boolean;
  is_marked_as_unread: boolean;
  unread_count: number;
  last_read_inbox_message_id: number;
  last_read_outbox_message_id: number;
  unread_reaction_count: number;
  last_message: Message;
  draft_message: DraftMessage;
}

export interface TdlibforumTopicIcon {
  "@type": "forumTopicIcon";
  color: number;
  custom_emoji_id: string;
}

export interface TdlibforumTopicInfo {
  "@type": "forumTopicInfo";
  chat_id: number;
  forum_topic_id: number;
  name: string;
  icon: ForumTopicIcon;
  creation_date: number;
  creator_id: MessageSender;
  is_general: boolean;
  is_outgoing: boolean;
  is_closed: boolean;
  is_hidden: boolean;
  is_name_implicit: boolean;
}

export interface TdlibforumTopic {
  "@type": "forumTopic";
  info: ForumTopicInfo;
  last_message: Message;
  order: string;
  is_pinned: boolean;
  unread_count: number;
  last_read_inbox_message_id: number;
  last_read_outbox_message_id: number;
  unread_mention_count: number;
  unread_reaction_count: number;
  notification_settings: ChatNotificationSettings;
  draft_message: DraftMessage;
}

export interface TdlibforumTopics {
  "@type": "forumTopics";
  total_count: number;
  topics: Array<ForumTopic>;
  next_offset_date: number;
  next_offset_message_id: number;
  next_offset_forum_topic_id: number;
}

export interface TdliblinkPreviewOptions {
  "@type": "linkPreviewOptions";
  is_disabled: boolean;
  url: string;
  force_small_media: boolean;
  force_large_media: boolean;
  show_above_text: boolean;
}

export interface TdlibsharedUser {
  "@type": "sharedUser";
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo: Photo;
}

export interface TdlibsharedChat {
  "@type": "sharedChat";
  chat_id: number;
  title: string;
  username: string;
  photo: Photo;
}






export interface TdlibthemeSettings {
  "@type": "themeSettings";
  base_theme: BuiltInTheme;
  accent_color: number;
  background: Background;
  outgoing_message_fill: BackgroundFill;
  animate_outgoing_message_fill: boolean;
  outgoing_message_accent_color: number;
}

export interface TdlibrichTextPlain {
  "@type": "richTextPlain";
  text: string;
}

export interface TdlibrichTextBold {
  "@type": "richTextBold";
  text: RichText;
}

export interface TdlibrichTextItalic {
  "@type": "richTextItalic";
  text: RichText;
}

export interface TdlibrichTextUnderline {
  "@type": "richTextUnderline";
  text: RichText;
}

export interface TdlibrichTextStrikethrough {
  "@type": "richTextStrikethrough";
  text: RichText;
}

export interface TdlibrichTextFixed {
  "@type": "richTextFixed";
  text: RichText;
}

export interface TdlibrichTextUrl {
  "@type": "richTextUrl";
  text: RichText;
  url: string;
  is_cached: boolean;
}

export interface TdlibrichTextEmailAddress {
  "@type": "richTextEmailAddress";
  text: RichText;
  email_address: string;
}

export interface TdlibrichTextSubscript {
  "@type": "richTextSubscript";
  text: RichText;
}

export interface TdlibrichTextSuperscript {
  "@type": "richTextSuperscript";
  text: RichText;
}

export interface TdlibrichTextMarked {
  "@type": "richTextMarked";
  text: RichText;
}

export interface TdlibrichTextPhoneNumber {
  "@type": "richTextPhoneNumber";
  text: RichText;
  phone_number: string;
}

export interface TdlibrichTextIcon {
  "@type": "richTextIcon";
  document: Document;
  width: number;
  height: number;
}

export interface TdlibrichTextReference {
  "@type": "richTextReference";
  text: RichText;
  anchor_name: string;
  url: string;
}

export interface TdlibrichTextAnchor {
  "@type": "richTextAnchor";
  name: string;
}

export interface TdlibrichTextAnchorLink {
  "@type": "richTextAnchorLink";
  text: RichText;
  anchor_name: string;
  url: string;
}

export interface TdlibrichTexts {
  "@type": "richTexts";
  texts: Array<RichText>;
}

export interface TdlibpageBlockCaption {
  "@type": "pageBlockCaption";
  text: RichText;
  credit: RichText;
}

export interface TdlibpageBlockListItem {
  "@type": "pageBlockListItem";
  label: string;
  page_blocks: Array<PageBlock>;
}







export interface TdlibpageBlockTableCell {
  "@type": "pageBlockTableCell";
  text: RichText;
  is_header: boolean;
  colspan: number;
  rowspan: number;
  align: PageBlockHorizontalAlignment;
  valign: PageBlockVerticalAlignment;
}

export interface TdlibpageBlockRelatedArticle {
  "@type": "pageBlockRelatedArticle";
  url: string;
  title: string;
  description: string;
  photo: Photo;
  author: string;
  publish_date: number;
}

export interface TdlibpageBlockTitle {
  "@type": "pageBlockTitle";
  title: RichText;
}

export interface TdlibpageBlockSubtitle {
  "@type": "pageBlockSubtitle";
  subtitle: RichText;
}

export interface TdlibpageBlockAuthorDate {
  "@type": "pageBlockAuthorDate";
  author: RichText;
  publish_date: number;
}

export interface TdlibpageBlockHeader {
  "@type": "pageBlockHeader";
  header: RichText;
}

export interface TdlibpageBlockSubheader {
  "@type": "pageBlockSubheader";
  subheader: RichText;
}

export interface TdlibpageBlockKicker {
  "@type": "pageBlockKicker";
  kicker: RichText;
}

export interface TdlibpageBlockParagraph {
  "@type": "pageBlockParagraph";
  text: RichText;
}

export interface TdlibpageBlockPreformatted {
  "@type": "pageBlockPreformatted";
  text: RichText;
  language: string;
}

export interface TdlibpageBlockFooter {
  "@type": "pageBlockFooter";
  footer: RichText;
}


export interface TdlibpageBlockAnchor {
  "@type": "pageBlockAnchor";
  name: string;
}

export interface TdlibpageBlockList {
  "@type": "pageBlockList";
  items: Array<PageBlockListItem>;
}

export interface TdlibpageBlockBlockQuote {
  "@type": "pageBlockBlockQuote";
  text: RichText;
  credit: RichText;
}

export interface TdlibpageBlockPullQuote {
  "@type": "pageBlockPullQuote";
  text: RichText;
  credit: RichText;
}

export interface TdlibpageBlockAnimation {
  "@type": "pageBlockAnimation";
  animation: Animation;
  caption: PageBlockCaption;
  need_autoplay: boolean;
}

export interface TdlibpageBlockAudio {
  "@type": "pageBlockAudio";
  audio: Audio;
  caption: PageBlockCaption;
}

export interface TdlibpageBlockPhoto {
  "@type": "pageBlockPhoto";
  photo: Photo;
  caption: PageBlockCaption;
  url: string;
}

export interface TdlibpageBlockVideo {
  "@type": "pageBlockVideo";
  video: Video;
  caption: PageBlockCaption;
  need_autoplay: boolean;
  is_looped: boolean;
}

export interface TdlibpageBlockVoiceNote {
  "@type": "pageBlockVoiceNote";
  voice_note: VoiceNote;
  caption: PageBlockCaption;
}

export interface TdlibpageBlockCover {
  "@type": "pageBlockCover";
  cover: PageBlock;
}

export interface TdlibpageBlockEmbedded {
  "@type": "pageBlockEmbedded";
  url: string;
  html: string;
  poster_photo: Photo;
  width: number;
  height: number;
  caption: PageBlockCaption;
  is_full_width: boolean;
  allow_scrolling: boolean;
}

export interface TdlibpageBlockEmbeddedPost {
  "@type": "pageBlockEmbeddedPost";
  url: string;
  author: string;
  author_photo: Photo;
  date: number;
  page_blocks: Array<PageBlock>;
  caption: PageBlockCaption;
}

export interface TdlibpageBlockCollage {
  "@type": "pageBlockCollage";
  page_blocks: Array<PageBlock>;
  caption: PageBlockCaption;
}

export interface TdlibpageBlockSlideshow {
  "@type": "pageBlockSlideshow";
  page_blocks: Array<PageBlock>;
  caption: PageBlockCaption;
}

export interface TdlibpageBlockChatLink {
  "@type": "pageBlockChatLink";
  title: string;
  photo: ChatPhotoInfo;
  accent_color_id: number;
  username: string;
}

export interface TdlibpageBlockTable {
  "@type": "pageBlockTable";
  caption: RichText;
  cells: Array<Array<PageBlockTableCell>>;
  is_bordered: boolean;
  is_striped: boolean;
}

export interface TdlibpageBlockDetails {
  "@type": "pageBlockDetails";
  header: RichText;
  page_blocks: Array<PageBlock>;
  is_open: boolean;
}

export interface TdlibpageBlockRelatedArticles {
  "@type": "pageBlockRelatedArticles";
  header: RichText;
  articles: Array<PageBlockRelatedArticle>;
}

export interface TdlibpageBlockMap {
  "@type": "pageBlockMap";
  location: Location;
  zoom: number;
  width: number;
  height: number;
  caption: PageBlockCaption;
}

export interface TdlibwebPageInstantView {
  "@type": "webPageInstantView";
  page_blocks: Array<PageBlock>;
  view_count: number;
  version: number;
  is_rtl: boolean;
  is_full: boolean;
  feedback_link: InternalLinkType;
}

export interface TdliblinkPreviewAlbumMediaPhoto {
  "@type": "linkPreviewAlbumMediaPhoto";
  photo: Photo;
}

export interface TdliblinkPreviewAlbumMediaVideo {
  "@type": "linkPreviewAlbumMediaVideo";
  video: Video;
}

export interface TdliblinkPreviewTypeAlbum {
  "@type": "linkPreviewTypeAlbum";
  media: Array<LinkPreviewAlbumMedia>;
  caption: string;
}

export interface TdliblinkPreviewTypeAnimation {
  "@type": "linkPreviewTypeAnimation";
  animation: Animation;
}

export interface TdliblinkPreviewTypeApp {
  "@type": "linkPreviewTypeApp";
  photo: Photo;
}

export interface TdliblinkPreviewTypeArticle {
  "@type": "linkPreviewTypeArticle";
  photo: Photo;
}

export interface TdliblinkPreviewTypeAudio {
  "@type": "linkPreviewTypeAudio";
  audio: Audio;
}

export interface TdliblinkPreviewTypeBackground {
  "@type": "linkPreviewTypeBackground";
  document: Document;
  background_type: BackgroundType;
}

export interface TdliblinkPreviewTypeChannelBoost {
  "@type": "linkPreviewTypeChannelBoost";
  photo: ChatPhoto;
}

export interface TdliblinkPreviewTypeChat {
  "@type": "linkPreviewTypeChat";
  type: InviteLinkChatType;
  photo: ChatPhoto;
  creates_join_request: boolean;
}

export interface TdliblinkPreviewTypeDirectMessagesChat {
  "@type": "linkPreviewTypeDirectMessagesChat";
  photo: ChatPhoto;
}

export interface TdliblinkPreviewTypeDocument {
  "@type": "linkPreviewTypeDocument";
  document: Document;
}

export interface TdliblinkPreviewTypeEmbeddedAnimationPlayer {
  "@type": "linkPreviewTypeEmbeddedAnimationPlayer";
  url: string;
  thumbnail: Photo;
  duration: number;
  width: number;
  height: number;
}

export interface TdliblinkPreviewTypeEmbeddedAudioPlayer {
  "@type": "linkPreviewTypeEmbeddedAudioPlayer";
  url: string;
  thumbnail: Photo;
  duration: number;
  width: number;
  height: number;
}

export interface TdliblinkPreviewTypeEmbeddedVideoPlayer {
  "@type": "linkPreviewTypeEmbeddedVideoPlayer";
  url: string;
  thumbnail: Photo;
  duration: number;
  width: number;
  height: number;
}

export interface TdliblinkPreviewTypeExternalAudio {
  "@type": "linkPreviewTypeExternalAudio";
  url: string;
  mime_type: string;
  duration: number;
}

export interface TdliblinkPreviewTypeExternalVideo {
  "@type": "linkPreviewTypeExternalVideo";
  url: string;
  mime_type: string;
  width: number;
  height: number;
  duration: number;
}

export interface TdliblinkPreviewTypeGiftAuction {
  "@type": "linkPreviewTypeGiftAuction";
  gift: Gift;
  auction_end_date: number;
}

export interface TdliblinkPreviewTypeGiftCollection {
  "@type": "linkPreviewTypeGiftCollection";
  icons: Array<Sticker>;
}



export interface TdliblinkPreviewTypeLiveStory {
  "@type": "linkPreviewTypeLiveStory";
  story_poster_chat_id: number;
  story_id: number;
}


export interface TdliblinkPreviewTypePhoto {
  "@type": "linkPreviewTypePhoto";
  photo: Photo;
}



export interface TdliblinkPreviewTypeSticker {
  "@type": "linkPreviewTypeSticker";
  sticker: Sticker;
}

export interface TdliblinkPreviewTypeStickerSet {
  "@type": "linkPreviewTypeStickerSet";
  stickers: Array<Sticker>;
}

export interface TdliblinkPreviewTypeStory {
  "@type": "linkPreviewTypeStory";
  story_poster_chat_id: number;
  story_id: number;
}

export interface TdliblinkPreviewTypeStoryAlbum {
  "@type": "linkPreviewTypeStoryAlbum";
  photo_icon: Photo;
  video_icon: Video;
}

export interface TdliblinkPreviewTypeSupergroupBoost {
  "@type": "linkPreviewTypeSupergroupBoost";
  photo: ChatPhoto;
}

export interface TdliblinkPreviewTypeTheme {
  "@type": "linkPreviewTypeTheme";
  documents: Array<Document>;
  settings: ThemeSettings;
}


export interface TdliblinkPreviewTypeUpgradedGift {
  "@type": "linkPreviewTypeUpgradedGift";
  gift: UpgradedGift;
}

export interface TdliblinkPreviewTypeUser {
  "@type": "linkPreviewTypeUser";
  photo: ChatPhoto;
  is_bot: boolean;
}

export interface TdliblinkPreviewTypeVideo {
  "@type": "linkPreviewTypeVideo";
  video: Video;
  cover: Photo;
  start_timestamp: number;
}

export interface TdliblinkPreviewTypeVideoChat {
  "@type": "linkPreviewTypeVideoChat";
  photo: ChatPhoto;
  is_live_stream: boolean;
  joins_as_speaker: boolean;
}

export interface TdliblinkPreviewTypeVideoNote {
  "@type": "linkPreviewTypeVideoNote";
  video_note: VideoNote;
}

export interface TdliblinkPreviewTypeVoiceNote {
  "@type": "linkPreviewTypeVoiceNote";
  voice_note: VoiceNote;
}

export interface TdliblinkPreviewTypeWebApp {
  "@type": "linkPreviewTypeWebApp";
  photo: Photo;
}

export interface TdliblinkPreview {
  "@type": "linkPreview";
  url: string;
  display_url: string;
  site_name: string;
  title: string;
  description: FormattedText;
  author: string;
  type: LinkPreviewType;
  has_large_media: boolean;
  show_large_media: boolean;
  show_media_above_description: boolean;
  skip_confirmation: boolean;
  show_above_text: boolean;
  instant_view_version: number;
}

export interface TdlibcountryInfo {
  "@type": "countryInfo";
  country_code: string;
  name: string;
  english_name: string;
  is_hidden: boolean;
  calling_codes: Array<string>;
}

export interface Tdlibcountries {
  "@type": "countries";
  countries: Array<CountryInfo>;
}

export interface TdlibphoneNumberInfo {
  "@type": "phoneNumberInfo";
  country: CountryInfo;
  country_calling_code: string;
  formatted_phone_number: string;
  is_anonymous: boolean;
}

export interface TdlibcollectibleItemTypeUsername {
  "@type": "collectibleItemTypeUsername";
  username: string;
}

export interface TdlibcollectibleItemTypePhoneNumber {
  "@type": "collectibleItemTypePhoneNumber";
  phone_number: string;
}

export interface TdlibcollectibleItemInfo {
  "@type": "collectibleItemInfo";
  purchase_date: number;
  currency: string;
  amount: number;
  cryptocurrency: string;
  cryptocurrency_amount: string;
  url: string;
}

export interface TdlibbankCardActionOpenUrl {
  "@type": "bankCardActionOpenUrl";
  text: string;
  url: string;
}

export interface TdlibbankCardInfo {
  "@type": "bankCardInfo";
  title: string;
  actions: Array<BankCardActionOpenUrl>;
}

export interface Tdlibaddress {
  "@type": "address";
  country_code: string;
  state: string;
  city: string;
  street_line1: string;
  street_line2: string;
  postal_code: string;
}

export interface TdliblocationAddress {
  "@type": "locationAddress";
  country_code: string;
  state: string;
  city: string;
  street: string;
}

export interface TdliblabeledPricePart {
  "@type": "labeledPricePart";
  label: string;
  amount: number;
}

export interface Tdlibinvoice {
  "@type": "invoice";
  currency: string;
  price_parts: Array<LabeledPricePart>;
  subscription_period: number;
  max_tip_amount: number;
  suggested_tip_amounts: Array<number>;
  recurring_payment_terms_of_service_url: string;
  terms_of_service_url: string;
  is_test: boolean;
  need_name: boolean;
  need_phone_number: boolean;
  need_email_address: boolean;
  need_shipping_address: boolean;
  send_phone_number_to_provider: boolean;
  send_email_address_to_provider: boolean;
  is_flexible: boolean;
}

export interface TdliborderInfo {
  "@type": "orderInfo";
  name: string;
  phone_number: string;
  email_address: string;
  shipping_address: Address;
}

export interface TdlibshippingOption {
  "@type": "shippingOption";
  id: string;
  title: string;
  price_parts: Array<LabeledPricePart>;
}

export interface TdlibsavedCredentials {
  "@type": "savedCredentials";
  id: string;
  title: string;
}

export interface TdlibinputCredentialsSaved {
  "@type": "inputCredentialsSaved";
  saved_credentials_id: string;
}

export interface TdlibinputCredentialsNew {
  "@type": "inputCredentialsNew";
  data: string;
  allow_save: boolean;
}

export interface TdlibinputCredentialsApplePay {
  "@type": "inputCredentialsApplePay";
  data: string;
}

export interface TdlibinputCredentialsGooglePay {
  "@type": "inputCredentialsGooglePay";
  data: string;
}

export interface TdlibpaymentProviderSmartGlocal {
  "@type": "paymentProviderSmartGlocal";
  public_token: string;
  tokenize_url: string;
}

export interface TdlibpaymentProviderStripe {
  "@type": "paymentProviderStripe";
  publishable_key: string;
  need_country: boolean;
  need_postal_code: boolean;
  need_cardholder_name: boolean;
}

export interface TdlibpaymentProviderOther {
  "@type": "paymentProviderOther";
  url: string;
}

export interface TdlibpaymentOption {
  "@type": "paymentOption";
  title: string;
  url: string;
}

export interface TdlibpaymentFormTypeRegular {
  "@type": "paymentFormTypeRegular";
  invoice: Invoice;
  payment_provider_user_id: number;
  payment_provider: PaymentProvider;
  additional_payment_options: Array<PaymentOption>;
  saved_order_info: OrderInfo;
  saved_credentials: Array<SavedCredentials>;
  can_save_credentials: boolean;
  need_password: boolean;
}

export interface TdlibpaymentFormTypeStars {
  "@type": "paymentFormTypeStars";
  star_count: number;
}

export interface TdlibpaymentFormTypeStarSubscription {
  "@type": "paymentFormTypeStarSubscription";
  pricing: StarSubscriptionPricing;
}

export interface TdlibpaymentForm {
  "@type": "paymentForm";
  id: string;
  type: PaymentFormType;
  seller_bot_user_id: number;
  product_info: ProductInfo;
}

export interface TdlibvalidatedOrderInfo {
  "@type": "validatedOrderInfo";
  order_info_id: string;
  shipping_options: Array<ShippingOption>;
}

export interface TdlibpaymentResult {
  "@type": "paymentResult";
  success: boolean;
  verification_url: string;
}

export interface TdlibpaymentReceiptTypeRegular {
  "@type": "paymentReceiptTypeRegular";
  payment_provider_user_id: number;
  invoice: Invoice;
  order_info: OrderInfo;
  shipping_option: ShippingOption;
  credentials_title: string;
  tip_amount: number;
}

export interface TdlibpaymentReceiptTypeStars {
  "@type": "paymentReceiptTypeStars";
  star_count: number;
  transaction_id: string;
}

export interface TdlibpaymentReceipt {
  "@type": "paymentReceipt";
  product_info: ProductInfo;
  date: number;
  seller_bot_user_id: number;
  type: PaymentReceiptType;
}

export interface TdlibinputInvoiceMessage {
  "@type": "inputInvoiceMessage";
  chat_id: number;
  message_id: number;
}

export interface TdlibinputInvoiceName {
  "@type": "inputInvoiceName";
  name: string;
}

export interface TdlibinputInvoiceTelegram {
  "@type": "inputInvoiceTelegram";
  purpose: TelegramPaymentPurpose;
}

export interface TdlibpaidMediaPreview {
  "@type": "paidMediaPreview";
  width: number;
  height: number;
  duration: number;
  minithumbnail: Minithumbnail;
}

export interface TdlibpaidMediaPhoto {
  "@type": "paidMediaPhoto";
  photo: Photo;
}

export interface TdlibpaidMediaVideo {
  "@type": "paidMediaVideo";
  video: Video;
  cover: Photo;
  start_timestamp: number;
}


export interface TdlibgiveawayParameters {
  "@type": "giveawayParameters";
  boosted_chat_id: number;
  additional_chat_ids: Array<number>;
  winners_selection_date: number;
  only_new_members: boolean;
  has_public_winners: boolean;
  country_codes: Array<string>;
  prize_description: string;
}

export interface TdlibdatedFile {
  "@type": "datedFile";
  file: File;
  date: number;
}














export interface Tdlibdate {
  "@type": "date";
  day: number;
  month: number;
  year: number;
}

export interface TdlibpersonalDetails {
  "@type": "personalDetails";
  first_name: string;
  middle_name: string;
  last_name: string;
  native_first_name: string;
  native_middle_name: string;
  native_last_name: string;
  birthdate: Date;
  gender: string;
  country_code: string;
  residence_country_code: string;
}

export interface TdlibidentityDocument {
  "@type": "identityDocument";
  number: string;
  expiration_date: Date;
  front_side: DatedFile;
  reverse_side: DatedFile;
  selfie: DatedFile;
  translation: Array<DatedFile>;
}

export interface TdlibinputIdentityDocument {
  "@type": "inputIdentityDocument";
  number: string;
  expiration_date: Date;
  front_side: InputFile;
  reverse_side: InputFile;
  selfie: InputFile;
  translation: Array<InputFile>;
}

export interface TdlibpersonalDocument {
  "@type": "personalDocument";
  files: Array<DatedFile>;
  translation: Array<DatedFile>;
}

export interface TdlibinputPersonalDocument {
  "@type": "inputPersonalDocument";
  files: Array<InputFile>;
  translation: Array<InputFile>;
}

export interface TdlibpassportElementPersonalDetails {
  "@type": "passportElementPersonalDetails";
  personal_details: PersonalDetails;
}

export interface TdlibpassportElementPassport {
  "@type": "passportElementPassport";
  passport: IdentityDocument;
}

export interface TdlibpassportElementDriverLicense {
  "@type": "passportElementDriverLicense";
  driver_license: IdentityDocument;
}

export interface TdlibpassportElementIdentityCard {
  "@type": "passportElementIdentityCard";
  identity_card: IdentityDocument;
}

export interface TdlibpassportElementInternalPassport {
  "@type": "passportElementInternalPassport";
  internal_passport: IdentityDocument;
}

export interface TdlibpassportElementAddress {
  "@type": "passportElementAddress";
  address: Address;
}

export interface TdlibpassportElementUtilityBill {
  "@type": "passportElementUtilityBill";
  utility_bill: PersonalDocument;
}

export interface TdlibpassportElementBankStatement {
  "@type": "passportElementBankStatement";
  bank_statement: PersonalDocument;
}

export interface TdlibpassportElementRentalAgreement {
  "@type": "passportElementRentalAgreement";
  rental_agreement: PersonalDocument;
}

export interface TdlibpassportElementPassportRegistration {
  "@type": "passportElementPassportRegistration";
  passport_registration: PersonalDocument;
}

export interface TdlibpassportElementTemporaryRegistration {
  "@type": "passportElementTemporaryRegistration";
  temporary_registration: PersonalDocument;
}

export interface TdlibpassportElementPhoneNumber {
  "@type": "passportElementPhoneNumber";
  phone_number: string;
}

export interface TdlibpassportElementEmailAddress {
  "@type": "passportElementEmailAddress";
  email_address: string;
}

export interface TdlibinputPassportElementPersonalDetails {
  "@type": "inputPassportElementPersonalDetails";
  personal_details: PersonalDetails;
}

export interface TdlibinputPassportElementPassport {
  "@type": "inputPassportElementPassport";
  passport: InputIdentityDocument;
}

export interface TdlibinputPassportElementDriverLicense {
  "@type": "inputPassportElementDriverLicense";
  driver_license: InputIdentityDocument;
}

export interface TdlibinputPassportElementIdentityCard {
  "@type": "inputPassportElementIdentityCard";
  identity_card: InputIdentityDocument;
}

export interface TdlibinputPassportElementInternalPassport {
  "@type": "inputPassportElementInternalPassport";
  internal_passport: InputIdentityDocument;
}

export interface TdlibinputPassportElementAddress {
  "@type": "inputPassportElementAddress";
  address: Address;
}

export interface TdlibinputPassportElementUtilityBill {
  "@type": "inputPassportElementUtilityBill";
  utility_bill: InputPersonalDocument;
}

export interface TdlibinputPassportElementBankStatement {
  "@type": "inputPassportElementBankStatement";
  bank_statement: InputPersonalDocument;
}

export interface TdlibinputPassportElementRentalAgreement {
  "@type": "inputPassportElementRentalAgreement";
  rental_agreement: InputPersonalDocument;
}

export interface TdlibinputPassportElementPassportRegistration {
  "@type": "inputPassportElementPassportRegistration";
  passport_registration: InputPersonalDocument;
}

export interface TdlibinputPassportElementTemporaryRegistration {
  "@type": "inputPassportElementTemporaryRegistration";
  temporary_registration: InputPersonalDocument;
}

export interface TdlibinputPassportElementPhoneNumber {
  "@type": "inputPassportElementPhoneNumber";
  phone_number: string;
}

export interface TdlibinputPassportElementEmailAddress {
  "@type": "inputPassportElementEmailAddress";
  email_address: string;
}

export interface TdlibpassportElements {
  "@type": "passportElements";
  elements: Array<PassportElement>;
}


export interface TdlibpassportElementErrorSourceDataField {
  "@type": "passportElementErrorSourceDataField";
  field_name: string;
}




export interface TdlibpassportElementErrorSourceTranslationFile {
  "@type": "passportElementErrorSourceTranslationFile";
  file_index: number;
}


export interface TdlibpassportElementErrorSourceFile {
  "@type": "passportElementErrorSourceFile";
  file_index: number;
}


export interface TdlibpassportElementError {
  "@type": "passportElementError";
  type: PassportElementType;
  message: string;
  source: PassportElementErrorSource;
}

export interface TdlibpassportSuitableElement {
  "@type": "passportSuitableElement";
  type: PassportElementType;
  is_selfie_required: boolean;
  is_translation_required: boolean;
  is_native_name_required: boolean;
}

export interface TdlibpassportRequiredElement {
  "@type": "passportRequiredElement";
  suitable_elements: Array<PassportSuitableElement>;
}

export interface TdlibpassportAuthorizationForm {
  "@type": "passportAuthorizationForm";
  id: number;
  required_elements: Array<PassportRequiredElement>;
  privacy_policy_url: string;
}

export interface TdlibpassportElementsWithErrors {
  "@type": "passportElementsWithErrors";
  elements: Array<PassportElement>;
  errors: Array<PassportElementError>;
}

export interface TdlibencryptedCredentials {
  "@type": "encryptedCredentials";
  data: string;
  hash: string;
  secret: string;
}

export interface TdlibencryptedPassportElement {
  "@type": "encryptedPassportElement";
  type: PassportElementType;
  data: string;
  front_side: DatedFile;
  reverse_side: DatedFile;
  selfie: DatedFile;
  translation: Array<DatedFile>;
  files: Array<DatedFile>;
  value: string;
  hash: string;
}

export interface TdlibinputPassportElementErrorSourceUnspecified {
  "@type": "inputPassportElementErrorSourceUnspecified";
  element_hash: string;
}

export interface TdlibinputPassportElementErrorSourceDataField {
  "@type": "inputPassportElementErrorSourceDataField";
  field_name: string;
  data_hash: string;
}

export interface TdlibinputPassportElementErrorSourceFrontSide {
  "@type": "inputPassportElementErrorSourceFrontSide";
  file_hash: string;
}

export interface TdlibinputPassportElementErrorSourceReverseSide {
  "@type": "inputPassportElementErrorSourceReverseSide";
  file_hash: string;
}

export interface TdlibinputPassportElementErrorSourceSelfie {
  "@type": "inputPassportElementErrorSourceSelfie";
  file_hash: string;
}

export interface TdlibinputPassportElementErrorSourceTranslationFile {
  "@type": "inputPassportElementErrorSourceTranslationFile";
  file_hash: string;
}

export interface TdlibinputPassportElementErrorSourceTranslationFiles {
  "@type": "inputPassportElementErrorSourceTranslationFiles";
  file_hashes: Array<string>;
}

export interface TdlibinputPassportElementErrorSourceFile {
  "@type": "inputPassportElementErrorSourceFile";
  file_hash: string;
}

export interface TdlibinputPassportElementErrorSourceFiles {
  "@type": "inputPassportElementErrorSourceFiles";
  file_hashes: Array<string>;
}

export interface TdlibinputPassportElementError {
  "@type": "inputPassportElementError";
  type: PassportElementType;
  message: string;
  source: InputPassportElementErrorSource;
}

export interface TdlibmessageText {
  "@type": "messageText";
  text: FormattedText;
  link_preview: LinkPreview;
  link_preview_options: LinkPreviewOptions;
}

export interface TdlibmessageAnimation {
  "@type": "messageAnimation";
  animation: Animation;
  caption: FormattedText;
  show_caption_above_media: boolean;
  has_spoiler: boolean;
  is_secret: boolean;
}

export interface TdlibmessageAudio {
  "@type": "messageAudio";
  audio: Audio;
  caption: FormattedText;
}

export interface TdlibmessageDocument {
  "@type": "messageDocument";
  document: Document;
  caption: FormattedText;
}

export interface TdlibmessagePaidMedia {
  "@type": "messagePaidMedia";
  star_count: number;
  media: Array<PaidMedia>;
  caption: FormattedText;
  show_caption_above_media: boolean;
}

export interface TdlibmessagePhoto {
  "@type": "messagePhoto";
  photo: Photo;
  caption: FormattedText;
  show_caption_above_media: boolean;
  has_spoiler: boolean;
  is_secret: boolean;
}

export interface TdlibmessageSticker {
  "@type": "messageSticker";
  sticker: Sticker;
  is_premium: boolean;
}

export interface TdlibmessageVideo {
  "@type": "messageVideo";
  video: Video;
  alternative_videos: Array<AlternativeVideo>;
  storyboards: Array<VideoStoryboard>;
  cover: Photo;
  start_timestamp: number;
  caption: FormattedText;
  show_caption_above_media: boolean;
  has_spoiler: boolean;
  is_secret: boolean;
}

export interface TdlibmessageVideoNote {
  "@type": "messageVideoNote";
  video_note: VideoNote;
  is_viewed: boolean;
  is_secret: boolean;
}

export interface TdlibmessageVoiceNote {
  "@type": "messageVoiceNote";
  voice_note: VoiceNote;
  caption: FormattedText;
  is_listened: boolean;
}





export interface TdlibmessageLocation {
  "@type": "messageLocation";
  location: Location;
  live_period: number;
  expires_in: number;
  heading: number;
  proximity_alert_radius: number;
}

export interface TdlibmessageVenue {
  "@type": "messageVenue";
  venue: Venue;
}

export interface TdlibmessageContact {
  "@type": "messageContact";
  contact: Contact;
}

export interface TdlibmessageAnimatedEmoji {
  "@type": "messageAnimatedEmoji";
  animated_emoji: AnimatedEmoji;
  emoji: string;
}

export interface TdlibmessageDice {
  "@type": "messageDice";
  initial_state: DiceStickers;
  final_state: DiceStickers;
  emoji: string;
  value: number;
  success_animation_frame_number: number;
}

export interface TdlibmessageGame {
  "@type": "messageGame";
  game: Game;
}

export interface TdlibmessagePoll {
  "@type": "messagePoll";
  poll: Poll;
}

export interface TdlibmessageStakeDice {
  "@type": "messageStakeDice";
  initial_state: DiceStickers;
  final_state: DiceStickers;
  value: number;
  stake_toncoin_amount: number;
  prize_toncoin_amount: number;
}

export interface TdlibmessageStory {
  "@type": "messageStory";
  story_poster_chat_id: number;
  story_id: number;
  via_mention: boolean;
}

export interface TdlibmessageChecklist {
  "@type": "messageChecklist";
  list: Checklist;
}

export interface TdlibmessageInvoice {
  "@type": "messageInvoice";
  product_info: ProductInfo;
  currency: string;
  total_amount: number;
  start_parameter: string;
  is_test: boolean;
  need_shipping_address: boolean;
  receipt_message_id: number;
  paid_media: PaidMedia;
  paid_media_caption: FormattedText;
}

export interface TdlibmessageCall {
  "@type": "messageCall";
  is_video: boolean;
  discard_reason: CallDiscardReason;
  duration: number;
}

export interface TdlibmessageGroupCall {
  "@type": "messageGroupCall";
  is_active: boolean;
  was_missed: boolean;
  is_video: boolean;
  duration: number;
  other_participant_ids: Array<MessageSender>;
}

export interface TdlibmessageVideoChatScheduled {
  "@type": "messageVideoChatScheduled";
  group_call_id: number;
  start_date: number;
}

export interface TdlibmessageVideoChatStarted {
  "@type": "messageVideoChatStarted";
  group_call_id: number;
}

export interface TdlibmessageVideoChatEnded {
  "@type": "messageVideoChatEnded";
  duration: number;
}

export interface TdlibmessageInviteVideoChatParticipants {
  "@type": "messageInviteVideoChatParticipants";
  group_call_id: number;
  user_ids: Array<number>;
}

export interface TdlibmessageBasicGroupChatCreate {
  "@type": "messageBasicGroupChatCreate";
  title: string;
  member_user_ids: Array<number>;
}

export interface TdlibmessageSupergroupChatCreate {
  "@type": "messageSupergroupChatCreate";
  title: string;
}

export interface TdlibmessageChatChangeTitle {
  "@type": "messageChatChangeTitle";
  title: string;
}

export interface TdlibmessageChatChangePhoto {
  "@type": "messageChatChangePhoto";
  photo: ChatPhoto;
}


export interface TdlibmessageChatAddMembers {
  "@type": "messageChatAddMembers";
  member_user_ids: Array<number>;
}



export interface TdlibmessageChatDeleteMember {
  "@type": "messageChatDeleteMember";
  user_id: number;
}

export interface TdlibmessageChatUpgradeTo {
  "@type": "messageChatUpgradeTo";
  supergroup_id: number;
}

export interface TdlibmessageChatUpgradeFrom {
  "@type": "messageChatUpgradeFrom";
  title: string;
  basic_group_id: number;
}

export interface TdlibmessagePinMessage {
  "@type": "messagePinMessage";
  message_id: number;
}


export interface TdlibmessageChatSetBackground {
  "@type": "messageChatSetBackground";
  old_background_message_id: number;
  background: ChatBackground;
  only_for_self: boolean;
}

export interface TdlibmessageChatSetTheme {
  "@type": "messageChatSetTheme";
  theme: ChatTheme;
}

export interface TdlibmessageChatSetMessageAutoDeleteTime {
  "@type": "messageChatSetMessageAutoDeleteTime";
  message_auto_delete_time: number;
  from_user_id: number;
}

export interface TdlibmessageChatBoost {
  "@type": "messageChatBoost";
  boost_count: number;
}

export interface TdlibmessageForumTopicCreated {
  "@type": "messageForumTopicCreated";
  name: string;
  is_name_implicit: boolean;
  icon: ForumTopicIcon;
}

export interface TdlibmessageForumTopicEdited {
  "@type": "messageForumTopicEdited";
  name: string;
  edit_icon_custom_emoji_id: boolean;
  icon_custom_emoji_id: string;
}

export interface TdlibmessageForumTopicIsClosedToggled {
  "@type": "messageForumTopicIsClosedToggled";
  is_closed: boolean;
}

export interface TdlibmessageForumTopicIsHiddenToggled {
  "@type": "messageForumTopicIsHiddenToggled";
  is_hidden: boolean;
}

export interface TdlibmessageSuggestProfilePhoto {
  "@type": "messageSuggestProfilePhoto";
  photo: ChatPhoto;
}

export interface TdlibmessageSuggestBirthdate {
  "@type": "messageSuggestBirthdate";
  birthdate: Birthdate;
}

export interface TdlibmessageCustomServiceAction {
  "@type": "messageCustomServiceAction";
  text: string;
}

export interface TdlibmessageGameScore {
  "@type": "messageGameScore";
  game_message_id: number;
  game_id: string;
  score: number;
}

export interface TdlibmessagePaymentSuccessful {
  "@type": "messagePaymentSuccessful";
  invoice_chat_id: number;
  invoice_message_id: number;
  currency: string;
  total_amount: number;
  subscription_until_date: number;
  is_recurring: boolean;
  is_first_recurring: boolean;
  invoice_name: string;
}

export interface TdlibmessagePaymentSuccessfulBot {
  "@type": "messagePaymentSuccessfulBot";
  currency: string;
  total_amount: number;
  subscription_until_date: number;
  is_recurring: boolean;
  is_first_recurring: boolean;
  invoice_payload: string;
  shipping_option_id: string;
  order_info: OrderInfo;
  telegram_payment_charge_id: string;
  provider_payment_charge_id: string;
}

export interface TdlibmessagePaymentRefunded {
  "@type": "messagePaymentRefunded";
  owner_id: MessageSender;
  currency: string;
  total_amount: number;
  invoice_payload: string;
  telegram_payment_charge_id: string;
  provider_payment_charge_id: string;
}

export interface TdlibmessageGiftedPremium {
  "@type": "messageGiftedPremium";
  gifter_user_id: number;
  receiver_user_id: number;
  text: FormattedText;
  currency: string;
  amount: number;
  cryptocurrency: string;
  cryptocurrency_amount: string;
  month_count: number;
  day_count: number;
  sticker: Sticker;
}

export interface TdlibmessagePremiumGiftCode {
  "@type": "messagePremiumGiftCode";
  creator_id: MessageSender;
  text: FormattedText;
  is_from_giveaway: boolean;
  is_unclaimed: boolean;
  currency: string;
  amount: number;
  cryptocurrency: string;
  cryptocurrency_amount: string;
  month_count: number;
  day_count: number;
  sticker: Sticker;
  code: string;
}

export interface TdlibmessageGiveawayCreated {
  "@type": "messageGiveawayCreated";
  star_count: number;
}

export interface TdlibmessageGiveaway {
  "@type": "messageGiveaway";
  parameters: GiveawayParameters;
  winner_count: number;
  prize: GiveawayPrize;
  sticker: Sticker;
}

export interface TdlibmessageGiveawayCompleted {
  "@type": "messageGiveawayCompleted";
  giveaway_message_id: number;
  winner_count: number;
  is_star_giveaway: boolean;
  unclaimed_prize_count: number;
}

export interface TdlibmessageGiveawayWinners {
  "@type": "messageGiveawayWinners";
  boosted_chat_id: number;
  giveaway_message_id: number;
  additional_chat_count: number;
  actual_winners_selection_date: number;
  only_new_members: boolean;
  was_refunded: boolean;
  prize: GiveawayPrize;
  prize_description: string;
  winner_count: number;
  winner_user_ids: Array<number>;
  unclaimed_prize_count: number;
}

export interface TdlibmessageGiftedStars {
  "@type": "messageGiftedStars";
  gifter_user_id: number;
  receiver_user_id: number;
  currency: string;
  amount: number;
  cryptocurrency: string;
  cryptocurrency_amount: string;
  star_count: number;
  transaction_id: string;
  sticker: Sticker;
}

export interface TdlibmessageGiftedTon {
  "@type": "messageGiftedTon";
  gifter_user_id: number;
  receiver_user_id: number;
  ton_amount: number;
  transaction_id: string;
  sticker: Sticker;
}

export interface TdlibmessageGiveawayPrizeStars {
  "@type": "messageGiveawayPrizeStars";
  star_count: number;
  transaction_id: string;
  boosted_chat_id: number;
  giveaway_message_id: number;
  is_unclaimed: boolean;
  sticker: Sticker;
}

export interface TdlibmessageGift {
  "@type": "messageGift";
  gift: Gift;
  sender_id: MessageSender;
  receiver_id: MessageSender;
  received_gift_id: string;
  text: FormattedText;
  unique_gift_number: number;
  sell_star_count: number;
  prepaid_upgrade_star_count: number;
  is_upgrade_separate: boolean;
  is_from_auction: boolean;
  is_private: boolean;
  is_saved: boolean;
  is_prepaid_upgrade: boolean;
  can_be_upgraded: boolean;
  was_converted: boolean;
  was_upgraded: boolean;
  was_refunded: boolean;
  upgraded_received_gift_id: string;
  prepaid_upgrade_hash: string;
}

export interface TdlibmessageUpgradedGift {
  "@type": "messageUpgradedGift";
  gift: UpgradedGift;
  sender_id: MessageSender;
  receiver_id: MessageSender;
  origin: UpgradedGiftOrigin;
  received_gift_id: string;
  is_saved: boolean;
  can_be_transferred: boolean;
  was_transferred: boolean;
  transfer_star_count: number;
  drop_original_details_star_count: number;
  next_transfer_date: number;
  next_resale_date: number;
  export_date: number;
}

export interface TdlibmessageRefundedUpgradedGift {
  "@type": "messageRefundedUpgradedGift";
  gift: Gift;
  sender_id: MessageSender;
  receiver_id: MessageSender;
  origin: UpgradedGiftOrigin;
}

export interface TdlibmessageUpgradedGiftPurchaseOffer {
  "@type": "messageUpgradedGiftPurchaseOffer";
  gift: UpgradedGift;
  state: GiftPurchaseOfferState;
  price: GiftResalePrice;
  expiration_date: number;
}

export interface TdlibmessageUpgradedGiftPurchaseOfferRejected {
  "@type": "messageUpgradedGiftPurchaseOfferRejected";
  gift: UpgradedGift;
  price: GiftResalePrice;
  offer_message_id: number;
  was_expired: boolean;
}

export interface TdlibmessagePaidMessagesRefunded {
  "@type": "messagePaidMessagesRefunded";
  message_count: number;
  star_count: number;
}

export interface TdlibmessagePaidMessagePriceChanged {
  "@type": "messagePaidMessagePriceChanged";
  paid_message_star_count: number;
}

export interface TdlibmessageDirectMessagePriceChanged {
  "@type": "messageDirectMessagePriceChanged";
  is_enabled: boolean;
  paid_message_star_count: number;
}

export interface TdlibmessageChecklistTasksDone {
  "@type": "messageChecklistTasksDone";
  checklist_message_id: number;
  marked_as_done_task_ids: Array<number>;
  marked_as_not_done_task_ids: Array<number>;
}

export interface TdlibmessageChecklistTasksAdded {
  "@type": "messageChecklistTasksAdded";
  checklist_message_id: number;
  tasks: Array<ChecklistTask>;
}

export interface TdlibmessageSuggestedPostApprovalFailed {
  "@type": "messageSuggestedPostApprovalFailed";
  suggested_post_message_id: number;
  price: SuggestedPostPrice;
}

export interface TdlibmessageSuggestedPostApproved {
  "@type": "messageSuggestedPostApproved";
  suggested_post_message_id: number;
  price: SuggestedPostPrice;
  send_date: number;
}

export interface TdlibmessageSuggestedPostDeclined {
  "@type": "messageSuggestedPostDeclined";
  suggested_post_message_id: number;
  comment: string;
}

export interface TdlibmessageSuggestedPostPaid {
  "@type": "messageSuggestedPostPaid";
  suggested_post_message_id: number;
  star_amount: StarAmount;
  ton_amount: number;
}

export interface TdlibmessageSuggestedPostRefunded {
  "@type": "messageSuggestedPostRefunded";
  suggested_post_message_id: number;
  reason: SuggestedPostRefundReason;
}


export interface TdlibmessageUsersShared {
  "@type": "messageUsersShared";
  users: Array<SharedUser>;
  button_id: number;
}

export interface TdlibmessageChatShared {
  "@type": "messageChatShared";
  chat: SharedChat;
  button_id: number;
}

export interface TdlibmessageBotWriteAccessAllowed {
  "@type": "messageBotWriteAccessAllowed";
  reason: BotWriteAccessAllowReason;
}

export interface TdlibmessageWebAppDataSent {
  "@type": "messageWebAppDataSent";
  button_text: string;
}

export interface TdlibmessageWebAppDataReceived {
  "@type": "messageWebAppDataReceived";
  button_text: string;
  data: string;
}

export interface TdlibmessagePassportDataSent {
  "@type": "messagePassportDataSent";
  types: Array<PassportElementType>;
}

export interface TdlibmessagePassportDataReceived {
  "@type": "messagePassportDataReceived";
  elements: Array<EncryptedPassportElement>;
  credentials: EncryptedCredentials;
}

export interface TdlibmessageProximityAlertTriggered {
  "@type": "messageProximityAlertTriggered";
  traveler_id: MessageSender;
  watcher_id: MessageSender;
  distance: number;
}

















export interface TdlibtextEntityTypePreCode {
  "@type": "textEntityTypePreCode";
  language: string;
}



export interface TdlibtextEntityTypeTextUrl {
  "@type": "textEntityTypeTextUrl";
  url: string;
}

export interface TdlibtextEntityTypeMentionName {
  "@type": "textEntityTypeMentionName";
  user_id: number;
}

export interface TdlibtextEntityTypeCustomEmoji {
  "@type": "textEntityTypeCustomEmoji";
  custom_emoji_id: string;
}

export interface TdlibtextEntityTypeMediaTimestamp {
  "@type": "textEntityTypeMediaTimestamp";
  media_timestamp: number;
}

export interface TdlibinputThumbnail {
  "@type": "inputThumbnail";
  thumbnail: InputFile;
  width: number;
  height: number;
}


export interface TdlibinputPaidMediaTypeVideo {
  "@type": "inputPaidMediaTypeVideo";
  cover: InputFile;
  start_timestamp: number;
  duration: number;
  supports_streaming: boolean;
}

export interface TdlibinputPaidMedia {
  "@type": "inputPaidMedia";
  type: InputPaidMediaType;
  media: InputFile;
  thumbnail: InputThumbnail;
  added_sticker_file_ids: Array<number>;
  width: number;
  height: number;
}

export interface TdlibmessageSchedulingStateSendAtDate {
  "@type": "messageSchedulingStateSendAtDate";
  send_date: number;
  repeat_period: number;
}


export interface TdlibmessageSchedulingStateSendWhenVideoProcessed {
  "@type": "messageSchedulingStateSendWhenVideoProcessed";
  send_date: number;
}

export interface TdlibmessageSelfDestructTypeTimer {
  "@type": "messageSelfDestructTypeTimer";
  self_destruct_time: number;
}


export interface TdlibmessageSendOptions {
  "@type": "messageSendOptions";
  suggested_post_info: InputSuggestedPostInfo;
  disable_notification: boolean;
  from_background: boolean;
  protect_content: boolean;
  allow_paid_broadcast: boolean;
  paid_message_star_count: number;
  update_order_of_installed_sticker_sets: boolean;
  scheduling_state: MessageSchedulingState;
  effect_id: string;
  sending_id: number;
  only_preview: boolean;
}

export interface TdlibmessageCopyOptions {
  "@type": "messageCopyOptions";
  send_copy: boolean;
  replace_caption: boolean;
  new_caption: FormattedText;
  new_show_caption_above_media: boolean;
}

export interface TdlibinputMessageText {
  "@type": "inputMessageText";
  text: FormattedText;
  link_preview_options: LinkPreviewOptions;
  clear_draft: boolean;
}

export interface TdlibinputMessageAnimation {
  "@type": "inputMessageAnimation";
  animation: InputFile;
  thumbnail: InputThumbnail;
  added_sticker_file_ids: Array<number>;
  duration: number;
  width: number;
  height: number;
  caption: FormattedText;
  show_caption_above_media: boolean;
  has_spoiler: boolean;
}

export interface TdlibinputMessageAudio {
  "@type": "inputMessageAudio";
  audio: InputFile;
  album_cover_thumbnail: InputThumbnail;
  duration: number;
  title: string;
  performer: string;
  caption: FormattedText;
}

export interface TdlibinputMessageDocument {
  "@type": "inputMessageDocument";
  document: InputFile;
  thumbnail: InputThumbnail;
  disable_content_type_detection: boolean;
  caption: FormattedText;
}

export interface TdlibinputMessagePaidMedia {
  "@type": "inputMessagePaidMedia";
  star_count: number;
  paid_media: Array<InputPaidMedia>;
  caption: FormattedText;
  show_caption_above_media: boolean;
  payload: string;
}

export interface TdlibinputMessagePhoto {
  "@type": "inputMessagePhoto";
  photo: InputFile;
  thumbnail: InputThumbnail;
  added_sticker_file_ids: Array<number>;
  width: number;
  height: number;
  caption: FormattedText;
  show_caption_above_media: boolean;
  self_destruct_type: MessageSelfDestructType;
  has_spoiler: boolean;
}

export interface TdlibinputMessageSticker {
  "@type": "inputMessageSticker";
  sticker: InputFile;
  thumbnail: InputThumbnail;
  width: number;
  height: number;
  emoji: string;
}

export interface TdlibinputMessageVideo {
  "@type": "inputMessageVideo";
  video: InputFile;
  thumbnail: InputThumbnail;
  cover: InputFile;
  start_timestamp: number;
  added_sticker_file_ids: Array<number>;
  duration: number;
  width: number;
  height: number;
  supports_streaming: boolean;
  caption: FormattedText;
  show_caption_above_media: boolean;
  self_destruct_type: MessageSelfDestructType;
  has_spoiler: boolean;
}

export interface TdlibinputMessageVideoNote {
  "@type": "inputMessageVideoNote";
  video_note: InputFile;
  thumbnail: InputThumbnail;
  duration: number;
  length: number;
  self_destruct_type: MessageSelfDestructType;
}

export interface TdlibinputMessageVoiceNote {
  "@type": "inputMessageVoiceNote";
  voice_note: InputFile;
  duration: number;
  waveform: string;
  caption: FormattedText;
  self_destruct_type: MessageSelfDestructType;
}

export interface TdlibinputMessageLocation {
  "@type": "inputMessageLocation";
  location: Location;
  live_period: number;
  heading: number;
  proximity_alert_radius: number;
}

export interface TdlibinputMessageVenue {
  "@type": "inputMessageVenue";
  venue: Venue;
}

export interface TdlibinputMessageContact {
  "@type": "inputMessageContact";
  contact: Contact;
}

export interface TdlibinputMessageDice {
  "@type": "inputMessageDice";
  emoji: string;
  clear_draft: boolean;
}

export interface TdlibinputMessageGame {
  "@type": "inputMessageGame";
  bot_user_id: number;
  game_short_name: string;
}

export interface TdlibinputMessageInvoice {
  "@type": "inputMessageInvoice";
  invoice: Invoice;
  title: string;
  description: string;
  photo_url: string;
  photo_size: number;
  photo_width: number;
  photo_height: number;
  payload: string;
  provider_token: string;
  provider_data: string;
  start_parameter: string;
  paid_media: InputPaidMedia;
  paid_media_caption: FormattedText;
}

export interface TdlibinputMessagePoll {
  "@type": "inputMessagePoll";
  question: FormattedText;
  options: Array<FormattedText>;
  is_anonymous: boolean;
  type: PollType;
  open_period: number;
  close_date: number;
  is_closed: boolean;
}

export interface TdlibinputMessageStakeDice {
  "@type": "inputMessageStakeDice";
  state_hash: string;
  stake_toncoin_amount: number;
  clear_draft: boolean;
}

export interface TdlibinputMessageStory {
  "@type": "inputMessageStory";
  story_poster_chat_id: number;
  story_id: number;
}

export interface TdlibinputMessageChecklist {
  "@type": "inputMessageChecklist";
  checklist: InputChecklist;
}

export interface TdlibinputMessageForwarded {
  "@type": "inputMessageForwarded";
  from_chat_id: number;
  message_id: number;
  in_game_share: boolean;
  replace_video_start_timestamp: boolean;
  new_video_start_timestamp: number;
  copy_options: MessageCopyOptions;
}

export interface TdlibmessageProperties {
  "@type": "messageProperties";
  can_add_offer: boolean;
  can_add_tasks: boolean;
  can_be_approved: boolean;
  can_be_copied: boolean;
  can_be_copied_to_secret_chat: boolean;
  can_be_declined: boolean;
  can_be_deleted_only_for_self: boolean;
  can_be_deleted_for_all_users: boolean;
  can_be_edited: boolean;
  can_be_forwarded: boolean;
  can_be_paid: boolean;
  can_be_pinned: boolean;
  can_be_replied: boolean;
  can_be_replied_in_another_chat: boolean;
  can_be_saved: boolean;
  can_be_shared_in_story: boolean;
  can_edit_media: boolean;
  can_edit_scheduling_state: boolean;
  can_edit_suggested_post_info: boolean;
  can_get_author: boolean;
  can_get_embedding_code: boolean;
  can_get_link: boolean;
  can_get_media_timestamp_links: boolean;
  can_get_message_thread: boolean;
  can_get_read_date: boolean;
  can_get_statistics: boolean;
  can_get_video_advertisements: boolean;
  can_get_viewers: boolean;
  can_mark_tasks_as_done: boolean;
  can_recognize_speech: boolean;
  can_report_chat: boolean;
  can_report_reactions: boolean;
  can_report_supergroup_spam: boolean;
  can_set_fact_check: boolean;
  need_show_statistics: boolean;
}























export interface TdlibchatActionUploadingVideo {
  "@type": "chatActionUploadingVideo";
  progress: number;
}


export interface TdlibchatActionUploadingVoiceNote {
  "@type": "chatActionUploadingVoiceNote";
  progress: number;
}

export interface TdlibchatActionUploadingPhoto {
  "@type": "chatActionUploadingPhoto";
  progress: number;
}

export interface TdlibchatActionUploadingDocument {
  "@type": "chatActionUploadingDocument";
  progress: number;
}






export interface TdlibchatActionUploadingVideoNote {
  "@type": "chatActionUploadingVideoNote";
  progress: number;
}

export interface TdlibchatActionWatchingAnimations {
  "@type": "chatActionWatchingAnimations";
  emoji: string;
}



export interface TdlibuserStatusOnline {
  "@type": "userStatusOnline";
  expires: number;
}

export interface TdlibuserStatusOffline {
  "@type": "userStatusOffline";
  was_online: number;
}

export interface TdlibuserStatusRecently {
  "@type": "userStatusRecently";
  by_my_privacy_settings: boolean;
}

export interface TdlibuserStatusLastWeek {
  "@type": "userStatusLastWeek";
  by_my_privacy_settings: boolean;
}

export interface TdlibuserStatusLastMonth {
  "@type": "userStatusLastMonth";
  by_my_privacy_settings: boolean;
}

export interface TdlibemojiKeyword {
  "@type": "emojiKeyword";
  emoji: string;
  keyword: string;
}

export interface TdlibemojiKeywords {
  "@type": "emojiKeywords";
  emoji_keywords: Array<EmojiKeyword>;
}

export interface Tdlibstickers {
  "@type": "stickers";
  stickers: Array<Sticker>;
}

export interface Tdlibemojis {
  "@type": "emojis";
  emojis: Array<string>;
}

export interface TdlibstickerSet {
  "@type": "stickerSet";
  id: string;
  title: string;
  name: string;
  thumbnail: Thumbnail;
  thumbnail_outline: Outline;
  is_owned: boolean;
  is_installed: boolean;
  is_archived: boolean;
  is_official: boolean;
  sticker_type: StickerType;
  needs_repainting: boolean;
  is_allowed_as_chat_emoji_status: boolean;
  is_viewed: boolean;
  stickers: Array<Sticker>;
  emojis: Array<Emojis>;
}

export interface TdlibstickerSetInfo {
  "@type": "stickerSetInfo";
  id: string;
  title: string;
  name: string;
  thumbnail: Thumbnail;
  thumbnail_outline: Outline;
  is_owned: boolean;
  is_installed: boolean;
  is_archived: boolean;
  is_official: boolean;
  sticker_type: StickerType;
  needs_repainting: boolean;
  is_allowed_as_chat_emoji_status: boolean;
  is_viewed: boolean;
  size: number;
  covers: Array<Sticker>;
}

export interface TdlibstickerSets {
  "@type": "stickerSets";
  total_count: number;
  sets: Array<StickerSetInfo>;
}

export interface TdlibtrendingStickerSets {
  "@type": "trendingStickerSets";
  total_count: number;
  sets: Array<StickerSetInfo>;
  is_premium: boolean;
}

export interface TdlibemojiCategorySourceSearch {
  "@type": "emojiCategorySourceSearch";
  emojis: Array<string>;
}


export interface TdlibemojiCategory {
  "@type": "emojiCategory";
  name: string;
  icon: Sticker;
  source: EmojiCategorySource;
  is_greeting: boolean;
}

export interface TdlibemojiCategories {
  "@type": "emojiCategories";
  categories: Array<EmojiCategory>;
}





export interface TdlibcurrentWeather {
  "@type": "currentWeather";
  temperature: number;
  emoji: string;
}

export interface TdlibstoryAreaPosition {
  "@type": "storyAreaPosition";
  x_percentage: number;
  y_percentage: number;
  width_percentage: number;
  height_percentage: number;
  rotation_angle: number;
  corner_radius_percentage: number;
}

export interface TdlibstoryAreaTypeLocation {
  "@type": "storyAreaTypeLocation";
  location: Location;
  address: LocationAddress;
}

export interface TdlibstoryAreaTypeVenue {
  "@type": "storyAreaTypeVenue";
  venue: Venue;
}

export interface TdlibstoryAreaTypeSuggestedReaction {
  "@type": "storyAreaTypeSuggestedReaction";
  reaction_type: ReactionType;
  total_count: number;
  is_dark: boolean;
  is_flipped: boolean;
}

export interface TdlibstoryAreaTypeMessage {
  "@type": "storyAreaTypeMessage";
  chat_id: number;
  message_id: number;
}

export interface TdlibstoryAreaTypeLink {
  "@type": "storyAreaTypeLink";
  url: string;
}

export interface TdlibstoryAreaTypeWeather {
  "@type": "storyAreaTypeWeather";
  temperature: number;
  emoji: string;
  background_color: number;
}

export interface TdlibstoryAreaTypeUpgradedGift {
  "@type": "storyAreaTypeUpgradedGift";
  gift_name: string;
}

export interface TdlibstoryArea {
  "@type": "storyArea";
  position: StoryAreaPosition;
  type: StoryAreaType;
}

export interface TdlibinputStoryAreaTypeLocation {
  "@type": "inputStoryAreaTypeLocation";
  location: Location;
  address: LocationAddress;
}

export interface TdlibinputStoryAreaTypeFoundVenue {
  "@type": "inputStoryAreaTypeFoundVenue";
  query_id: string;
  result_id: string;
}

export interface TdlibinputStoryAreaTypePreviousVenue {
  "@type": "inputStoryAreaTypePreviousVenue";
  venue_provider: string;
  venue_id: string;
}

export interface TdlibinputStoryAreaTypeSuggestedReaction {
  "@type": "inputStoryAreaTypeSuggestedReaction";
  reaction_type: ReactionType;
  is_dark: boolean;
  is_flipped: boolean;
}

export interface TdlibinputStoryAreaTypeMessage {
  "@type": "inputStoryAreaTypeMessage";
  chat_id: number;
  message_id: number;
}

export interface TdlibinputStoryAreaTypeLink {
  "@type": "inputStoryAreaTypeLink";
  url: string;
}

export interface TdlibinputStoryAreaTypeWeather {
  "@type": "inputStoryAreaTypeWeather";
  temperature: number;
  emoji: string;
  background_color: number;
}

export interface TdlibinputStoryAreaTypeUpgradedGift {
  "@type": "inputStoryAreaTypeUpgradedGift";
  gift_name: string;
}

export interface TdlibinputStoryArea {
  "@type": "inputStoryArea";
  position: StoryAreaPosition;
  type: InputStoryAreaType;
}

export interface TdlibinputStoryAreas {
  "@type": "inputStoryAreas";
  areas: Array<InputStoryArea>;
}

export interface TdlibstoryVideo {
  "@type": "storyVideo";
  duration: number;
  width: number;
  height: number;
  has_stickers: boolean;
  is_animation: boolean;
  minithumbnail: Minithumbnail;
  thumbnail: Thumbnail;
  preload_prefix_size: number;
  cover_frame_timestamp: number;
  video: File;
}

export interface TdlibstoryContentPhoto {
  "@type": "storyContentPhoto";
  photo: Photo;
}

export interface TdlibstoryContentVideo {
  "@type": "storyContentVideo";
  video: StoryVideo;
  alternative_video: StoryVideo;
}

export interface TdlibstoryContentLive {
  "@type": "storyContentLive";
  group_call_id: number;
  is_rtmp_stream: boolean;
}


export interface TdlibinputStoryContentPhoto {
  "@type": "inputStoryContentPhoto";
  photo: InputFile;
  added_sticker_file_ids: Array<number>;
}

export interface TdlibinputStoryContentVideo {
  "@type": "inputStoryContentVideo";
  video: InputFile;
  added_sticker_file_ids: Array<number>;
  duration: number;
  cover_frame_timestamp: number;
  is_animation: boolean;
}



export interface TdlibstoryOriginPublicStory {
  "@type": "storyOriginPublicStory";
  chat_id: number;
  story_id: number;
}

export interface TdlibstoryOriginHiddenUser {
  "@type": "storyOriginHiddenUser";
  poster_name: string;
}

export interface TdlibstoryRepostInfo {
  "@type": "storyRepostInfo";
  origin: StoryOrigin;
  is_content_modified: boolean;
}

export interface TdlibstoryInteractionInfo {
  "@type": "storyInteractionInfo";
  view_count: number;
  forward_count: number;
  reaction_count: number;
  recent_viewer_user_ids: Array<number>;
}

export interface Tdlibstory {
  "@type": "story";
  id: number;
  poster_chat_id: number;
  poster_id: MessageSender;
  date: number;
  is_being_posted: boolean;
  is_being_edited: boolean;
  is_edited: boolean;
  is_posted_to_chat_page: boolean;
  is_visible_only_for_self: boolean;
  can_be_added_to_album: boolean;
  can_be_deleted: boolean;
  can_be_edited: boolean;
  can_be_forwarded: boolean;
  can_be_replied: boolean;
  can_set_privacy_settings: boolean;
  can_toggle_is_posted_to_chat_page: boolean;
  can_get_statistics: boolean;
  can_get_interactions: boolean;
  has_expired_viewers: boolean;
  repost_info: StoryRepostInfo;
  interaction_info: StoryInteractionInfo;
  chosen_reaction_type: ReactionType;
  privacy_settings: StoryPrivacySettings;
  content: StoryContent;
  areas: Array<StoryArea>;
  caption: FormattedText;
  album_ids: Array<number>;
}

export interface Tdlibstories {
  "@type": "stories";
  total_count: number;
  stories: Array<Story>;
  pinned_story_ids: Array<number>;
}

export interface TdlibfoundStories {
  "@type": "foundStories";
  total_count: number;
  stories: Array<Story>;
  next_offset: string;
}

export interface TdlibstoryAlbum {
  "@type": "storyAlbum";
  id: number;
  name: string;
  photo_icon: Photo;
  video_icon: Video;
}

export interface TdlibstoryAlbums {
  "@type": "storyAlbums";
  albums: Array<StoryAlbum>;
}

export interface TdlibstoryFullId {
  "@type": "storyFullId";
  poster_chat_id: number;
  story_id: number;
}

export interface TdlibstoryInfo {
  "@type": "storyInfo";
  story_id: number;
  date: number;
  is_for_close_friends: boolean;
  is_live: boolean;
}

export interface TdlibchatActiveStories {
  "@type": "chatActiveStories";
  chat_id: number;
  list: StoryList;
  order: number;
  can_be_archived: boolean;
  max_read_story_id: number;
  stories: Array<StoryInfo>;
}

export interface TdlibstoryInteractionTypeView {
  "@type": "storyInteractionTypeView";
  chosen_reaction_type: ReactionType;
}

export interface TdlibstoryInteractionTypeForward {
  "@type": "storyInteractionTypeForward";
  message: Message;
}

export interface TdlibstoryInteractionTypeRepost {
  "@type": "storyInteractionTypeRepost";
  story: Story;
}

export interface TdlibstoryInteraction {
  "@type": "storyInteraction";
  actor_id: MessageSender;
  interaction_date: number;
  block_list: BlockList;
  type: StoryInteractionType;
}

export interface TdlibstoryInteractions {
  "@type": "storyInteractions";
  total_count: number;
  total_forward_count: number;
  total_reaction_count: number;
  interactions: Array<StoryInteraction>;
  next_offset: string;
}

export interface TdlibquickReplyMessage {
  "@type": "quickReplyMessage";
  id: number;
  sending_state: MessageSendingState;
  can_be_edited: boolean;
  reply_to_message_id: number;
  via_bot_user_id: number;
  media_album_id: string;
  content: MessageContent;
  reply_markup: ReplyMarkup;
}

export interface TdlibquickReplyMessages {
  "@type": "quickReplyMessages";
  messages: Array<QuickReplyMessage>;
}

export interface TdlibquickReplyShortcut {
  "@type": "quickReplyShortcut";
  id: number;
  name: string;
  first_message: QuickReplyMessage;
  message_count: number;
}

export interface TdlibpublicForwardMessage {
  "@type": "publicForwardMessage";
  message: Message;
}

export interface TdlibpublicForwardStory {
  "@type": "publicForwardStory";
  story: Story;
}

export interface TdlibpublicForwards {
  "@type": "publicForwards";
  total_count: number;
  forwards: Array<PublicForward>;
  next_offset: string;
}

export interface TdlibbotMediaPreview {
  "@type": "botMediaPreview";
  date: number;
  content: StoryContent;
}

export interface TdlibbotMediaPreviews {
  "@type": "botMediaPreviews";
  previews: Array<BotMediaPreview>;
}

export interface TdlibbotMediaPreviewInfo {
  "@type": "botMediaPreviewInfo";
  previews: Array<BotMediaPreview>;
  language_codes: Array<string>;
}

export interface TdlibchatBoostLevelFeatures {
  "@type": "chatBoostLevelFeatures";
  level: number;
  story_per_day_count: number;
  custom_emoji_reaction_count: number;
  title_color_count: number;
  profile_accent_color_count: number;
  can_set_profile_background_custom_emoji: boolean;
  accent_color_count: number;
  can_set_background_custom_emoji: boolean;
  can_set_emoji_status: boolean;
  chat_theme_background_count: number;
  can_set_custom_background: boolean;
  can_set_custom_emoji_sticker_set: boolean;
  can_enable_automatic_translation: boolean;
  can_recognize_speech: boolean;
  can_disable_sponsored_messages: boolean;
}

export interface TdlibchatBoostFeatures {
  "@type": "chatBoostFeatures";
  features: Array<ChatBoostLevelFeatures>;
  min_profile_background_custom_emoji_boost_level: number;
  min_background_custom_emoji_boost_level: number;
  min_emoji_status_boost_level: number;
  min_chat_theme_background_boost_level: number;
  min_custom_background_boost_level: number;
  min_custom_emoji_sticker_set_boost_level: number;
  min_automatic_translation_boost_level: number;
  min_speech_recognition_boost_level: number;
  min_sponsored_message_disable_boost_level: number;
}

export interface TdlibchatBoostSourceGiftCode {
  "@type": "chatBoostSourceGiftCode";
  user_id: number;
  gift_code: string;
}

export interface TdlibchatBoostSourceGiveaway {
  "@type": "chatBoostSourceGiveaway";
  user_id: number;
  gift_code: string;
  star_count: number;
  giveaway_message_id: number;
  is_unclaimed: boolean;
}

export interface TdlibchatBoostSourcePremium {
  "@type": "chatBoostSourcePremium";
  user_id: number;
}

export interface TdlibprepaidGiveaway {
  "@type": "prepaidGiveaway";
  id: string;
  winner_count: number;
  prize: GiveawayPrize;
  boost_count: number;
  payment_date: number;
}

export interface TdlibchatBoostStatus {
  "@type": "chatBoostStatus";
  boost_url: string;
  applied_slot_ids: Array<number>;
  level: number;
  gift_code_boost_count: number;
  boost_count: number;
  current_level_boost_count: number;
  next_level_boost_count: number;
  premium_member_count: number;
  premium_member_percentage: number;
  prepaid_giveaways: Array<PrepaidGiveaway>;
}

export interface TdlibchatBoost {
  "@type": "chatBoost";
  id: string;
  count: number;
  source: ChatBoostSource;
  start_date: number;
  expiration_date: number;
}

export interface TdlibfoundChatBoosts {
  "@type": "foundChatBoosts";
  total_count: number;
  boosts: Array<ChatBoost>;
  next_offset: string;
}

export interface TdlibchatBoostSlot {
  "@type": "chatBoostSlot";
  slot_id: number;
  currently_boosted_chat_id: number;
  start_date: number;
  expiration_date: number;
  cooldown_until_date: number;
}

export interface TdlibchatBoostSlots {
  "@type": "chatBoostSlots";
  slots: Array<ChatBoostSlot>;
}


export interface TdlibresendCodeReasonVerificationFailed {
  "@type": "resendCodeReasonVerificationFailed";
  error_message: string;
}






export interface TdlibcallDiscardReasonUpgradeToGroupCall {
  "@type": "callDiscardReasonUpgradeToGroupCall";
  invite_link: string;
}

export interface TdlibcallProtocol {
  "@type": "callProtocol";
  udp_p2p: boolean;
  udp_reflector: boolean;
  min_layer: number;
  max_layer: number;
  library_versions: Array<string>;
}

export interface TdlibcallServerTypeTelegramReflector {
  "@type": "callServerTypeTelegramReflector";
  peer_tag: string;
  is_tcp: boolean;
}

export interface TdlibcallServerTypeWebrtc {
  "@type": "callServerTypeWebrtc";
  username: string;
  password: string;
  supports_turn: boolean;
  supports_stun: boolean;
}

export interface TdlibcallServer {
  "@type": "callServer";
  id: string;
  ip_address: string;
  ipv6_address: string;
  port: number;
  type: CallServerType;
}

export interface TdlibcallId {
  "@type": "callId";
  id: number;
}

export interface TdlibgroupCallId {
  "@type": "groupCallId";
  id: number;
}

export interface TdlibcallStatePending {
  "@type": "callStatePending";
  is_created: boolean;
  is_received: boolean;
}


export interface TdlibcallStateReady {
  "@type": "callStateReady";
  protocol: CallProtocol;
  servers: Array<CallServer>;
  config: string;
  encryption_key: string;
  emojis: Array<string>;
  allow_p2p: boolean;
  is_group_call_supported: boolean;
  custom_parameters: string;
}


export interface TdlibcallStateDiscarded {
  "@type": "callStateDiscarded";
  reason: CallDiscardReason;
  need_rating: boolean;
  need_debug_information: boolean;
  need_log: boolean;
}

export interface TdlibcallStateError {
  "@type": "callStateError";
  error: Error;
}

export interface TdlibgroupCallJoinParameters {
  "@type": "groupCallJoinParameters";
  audio_source_id: number;
  payload: string;
  is_muted: boolean;
  is_my_video_enabled: boolean;
}




export interface TdlibgroupCallStream {
  "@type": "groupCallStream";
  channel_id: number;
  scale: number;
  time_offset: number;
}

export interface TdlibgroupCallStreams {
  "@type": "groupCallStreams";
  streams: Array<GroupCallStream>;
}

export interface TdlibrtmpUrl {
  "@type": "rtmpUrl";
  url: string;
  stream_key: string;
}

export interface TdlibgroupCallRecentSpeaker {
  "@type": "groupCallRecentSpeaker";
  participant_id: MessageSender;
  is_speaking: boolean;
}

export interface TdlibgroupCall {
  "@type": "groupCall";
  id: number;
  title: string;
  invite_link: string;
  paid_message_star_count: number;
  scheduled_start_date: number;
  enabled_start_notification: boolean;
  is_active: boolean;
  is_video_chat: boolean;
  is_live_story: boolean;
  is_rtmp_stream: boolean;
  is_joined: boolean;
  need_rejoin: boolean;
  is_owned: boolean;
  can_be_managed: boolean;
  participant_count: number;
  has_hidden_listeners: boolean;
  loaded_all_participants: boolean;
  message_sender_id: MessageSender;
  recent_speakers: Array<GroupCallRecentSpeaker>;
  is_my_video_enabled: boolean;
  is_my_video_paused: boolean;
  can_enable_video: boolean;
  mute_new_participants: boolean;
  can_toggle_mute_new_participants: boolean;
  can_send_messages: boolean;
  are_messages_allowed: boolean;
  can_toggle_are_messages_allowed: boolean;
  can_delete_messages: boolean;
  record_duration: number;
  is_video_recorded: boolean;
  duration: number;
}

export interface TdlibgroupCallVideoSourceGroup {
  "@type": "groupCallVideoSourceGroup";
  semantics: string;
  source_ids: Array<number>;
}

export interface TdlibgroupCallParticipantVideoInfo {
  "@type": "groupCallParticipantVideoInfo";
  source_groups: Array<GroupCallVideoSourceGroup>;
  endpoint_id: string;
  is_paused: boolean;
}

export interface TdlibgroupCallParticipant {
  "@type": "groupCallParticipant";
  participant_id: MessageSender;
  audio_source_id: number;
  screen_sharing_audio_source_id: number;
  video_info: GroupCallParticipantVideoInfo;
  screen_sharing_video_info: GroupCallParticipantVideoInfo;
  bio: string;
  is_current_user: boolean;
  is_speaking: boolean;
  is_hand_raised: boolean;
  can_be_muted_for_all_users: boolean;
  can_be_unmuted_for_all_users: boolean;
  can_be_muted_for_current_user: boolean;
  can_be_unmuted_for_current_user: boolean;
  is_muted_for_all_users: boolean;
  is_muted_for_current_user: boolean;
  can_unmute_self: boolean;
  volume_level: number;
  order: string;
}

export interface TdlibgroupCallParticipants {
  "@type": "groupCallParticipants";
  total_count: number;
  participant_ids: Array<MessageSender>;
}

export interface TdlibgroupCallInfo {
  "@type": "groupCallInfo";
  group_call_id: number;
  join_payload: string;
}

export interface TdlibgroupCallMessage {
  "@type": "groupCallMessage";
  message_id: number;
  sender_id: MessageSender;
  date: number;
  text: FormattedText;
  paid_message_star_count: number;
  is_from_owner: boolean;
  can_be_deleted: boolean;
}

export interface TdlibgroupCallMessageLevel {
  "@type": "groupCallMessageLevel";
  min_star_count: number;
  pin_duration: number;
  max_text_length: number;
  max_custom_emoji_count: number;
  first_color: number;
  second_color: number;
  background_color: number;
}




export interface TdlibinviteGroupCallParticipantResultSuccess {
  "@type": "inviteGroupCallParticipantResultSuccess";
  chat_id: number;
  message_id: number;
}



export interface TdlibinputGroupCallLink {
  "@type": "inputGroupCallLink";
  link: string;
}

export interface TdlibinputGroupCallMessage {
  "@type": "inputGroupCallMessage";
  chat_id: number;
  message_id: number;
}










export interface Tdlibcall {
  "@type": "call";
  id: number;
  user_id: number;
  is_outgoing: boolean;
  is_video: boolean;
  state: CallState;
}


export interface TdlibfirebaseAuthenticationSettingsIos {
  "@type": "firebaseAuthenticationSettingsIos";
  device_token: string;
  is_app_sandbox: boolean;
}

export interface TdlibphoneNumberAuthenticationSettings {
  "@type": "phoneNumberAuthenticationSettings";
  allow_flash_call: boolean;
  allow_missed_call: boolean;
  is_current_phone_number: boolean;
  has_unknown_phone_number: boolean;
  allow_sms_retriever_api: boolean;
  firebase_authentication_settings: FirebaseAuthenticationSettings;
  authentication_tokens: Array<string>;
}

export interface TdlibaddedReaction {
  "@type": "addedReaction";
  type: ReactionType;
  sender_id: MessageSender;
  is_outgoing: boolean;
  date: number;
}

export interface TdlibaddedReactions {
  "@type": "addedReactions";
  total_count: number;
  reactions: Array<AddedReaction>;
  next_offset: string;
}

export interface TdlibavailableReaction {
  "@type": "availableReaction";
  type: ReactionType;
  needs_premium: boolean;
}

export interface TdlibavailableReactions {
  "@type": "availableReactions";
  top_reactions: Array<AvailableReaction>;
  recent_reactions: Array<AvailableReaction>;
  popular_reactions: Array<AvailableReaction>;
  allow_custom_emoji: boolean;
  are_tags: boolean;
  unavailability_reason: ReactionUnavailabilityReason;
}

export interface TdlibemojiReaction {
  "@type": "emojiReaction";
  emoji: string;
  title: string;
  is_active: boolean;
  static_icon: Sticker;
  appear_animation: Sticker;
  select_animation: Sticker;
  activate_animation: Sticker;
  effect_animation: Sticker;
  around_animation: Sticker;
  center_animation: Sticker;
}



export interface Tdlibanimations {
  "@type": "animations";
  animations: Array<Animation>;
}

export interface TdlibdiceStickersRegular {
  "@type": "diceStickersRegular";
  sticker: Sticker;
}

export interface TdlibdiceStickersSlotMachine {
  "@type": "diceStickersSlotMachine";
  background: Sticker;
  lever: Sticker;
  left_reel: Sticker;
  center_reel: Sticker;
  right_reel: Sticker;
}

export interface TdlibimportedContact {
  "@type": "importedContact";
  phone_number: string;
  first_name: string;
  last_name: string;
  note: FormattedText;
}

export interface TdlibimportedContacts {
  "@type": "importedContacts";
  user_ids: Array<number>;
  importer_count: Array<number>;
}

export interface TdlibspeechRecognitionResultPending {
  "@type": "speechRecognitionResultPending";
  partial_text: string;
}

export interface TdlibspeechRecognitionResultText {
  "@type": "speechRecognitionResultText";
  text: string;
}

export interface TdlibspeechRecognitionResultError {
  "@type": "speechRecognitionResultError";
  error: Error;
}

export interface TdlibbusinessConnection {
  "@type": "businessConnection";
  id: string;
  user_id: number;
  user_chat_id: number;
  date: number;
  rights: BusinessBotRights;
  is_enabled: boolean;
}

export interface TdlibattachmentMenuBotColor {
  "@type": "attachmentMenuBotColor";
  light_color: number;
  dark_color: number;
}

export interface TdlibattachmentMenuBot {
  "@type": "attachmentMenuBot";
  bot_user_id: number;
  supports_self_chat: boolean;
  supports_user_chats: boolean;
  supports_bot_chats: boolean;
  supports_group_chats: boolean;
  supports_channel_chats: boolean;
  request_write_access: boolean;
  is_added: boolean;
  show_in_attachment_menu: boolean;
  show_in_side_menu: boolean;
  show_disclaimer_in_side_menu: boolean;
  name: string;
  name_color: AttachmentMenuBotColor;
  default_icon: File;
  ios_static_icon: File;
  ios_animated_icon: File;
  ios_side_menu_icon: File;
  android_icon: File;
  android_side_menu_icon: File;
  macos_icon: File;
  macos_side_menu_icon: File;
  icon_color: AttachmentMenuBotColor;
  web_app_placeholder: File;
}

export interface TdlibsentWebAppMessage {
  "@type": "sentWebAppMessage";
  inline_message_id: string;
}

export interface TdlibbotWriteAccessAllowReasonConnectedWebsite {
  "@type": "botWriteAccessAllowReasonConnectedWebsite";
  domain_name: string;
}


export interface TdlibbotWriteAccessAllowReasonLaunchedWebApp {
  "@type": "botWriteAccessAllowReasonLaunchedWebApp";
  web_app: WebApp;
}


export interface TdlibhttpUrl {
  "@type": "httpUrl";
  url: string;
}

export interface TdlibuserLink {
  "@type": "userLink";
  url: string;
  expires_in: number;
}

export interface TdlibtargetChatTypes {
  "@type": "targetChatTypes";
  allow_user_chats: boolean;
  allow_bot_chats: boolean;
  allow_group_chats: boolean;
  allow_channel_chats: boolean;
}


export interface TdlibtargetChatChosen {
  "@type": "targetChatChosen";
  types: TargetChatTypes;
}

export interface TdlibtargetChatInternalLink {
  "@type": "targetChatInternalLink";
  link: InternalLinkType;
}

export interface TdlibinputInlineQueryResultAnimation {
  "@type": "inputInlineQueryResultAnimation";
  id: string;
  title: string;
  thumbnail_url: string;
  thumbnail_mime_type: string;
  video_url: string;
  video_mime_type: string;
  video_duration: number;
  video_width: number;
  video_height: number;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibinputInlineQueryResultArticle {
  "@type": "inputInlineQueryResultArticle";
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibinputInlineQueryResultAudio {
  "@type": "inputInlineQueryResultAudio";
  id: string;
  title: string;
  performer: string;
  audio_url: string;
  audio_duration: number;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibinputInlineQueryResultContact {
  "@type": "inputInlineQueryResultContact";
  id: string;
  contact: Contact;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibinputInlineQueryResultDocument {
  "@type": "inputInlineQueryResultDocument";
  id: string;
  title: string;
  description: string;
  document_url: string;
  mime_type: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibinputInlineQueryResultGame {
  "@type": "inputInlineQueryResultGame";
  id: string;
  game_short_name: string;
  reply_markup: ReplyMarkup;
}

export interface TdlibinputInlineQueryResultLocation {
  "@type": "inputInlineQueryResultLocation";
  id: string;
  location: Location;
  live_period: number;
  title: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibinputInlineQueryResultPhoto {
  "@type": "inputInlineQueryResultPhoto";
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  photo_url: string;
  photo_width: number;
  photo_height: number;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibinputInlineQueryResultSticker {
  "@type": "inputInlineQueryResultSticker";
  id: string;
  thumbnail_url: string;
  sticker_url: string;
  sticker_width: number;
  sticker_height: number;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibinputInlineQueryResultVenue {
  "@type": "inputInlineQueryResultVenue";
  id: string;
  venue: Venue;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibinputInlineQueryResultVideo {
  "@type": "inputInlineQueryResultVideo";
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  mime_type: string;
  video_width: number;
  video_height: number;
  video_duration: number;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibinputInlineQueryResultVoiceNote {
  "@type": "inputInlineQueryResultVoiceNote";
  id: string;
  title: string;
  voice_note_url: string;
  voice_note_duration: number;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibinlineQueryResultArticle {
  "@type": "inlineQueryResultArticle";
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnail: Thumbnail;
}

export interface TdlibinlineQueryResultContact {
  "@type": "inlineQueryResultContact";
  id: string;
  contact: Contact;
  thumbnail: Thumbnail;
}

export interface TdlibinlineQueryResultLocation {
  "@type": "inlineQueryResultLocation";
  id: string;
  location: Location;
  title: string;
  thumbnail: Thumbnail;
}

export interface TdlibinlineQueryResultVenue {
  "@type": "inlineQueryResultVenue";
  id: string;
  venue: Venue;
  thumbnail: Thumbnail;
}

export interface TdlibinlineQueryResultGame {
  "@type": "inlineQueryResultGame";
  id: string;
  game: Game;
}

export interface TdlibinlineQueryResultAnimation {
  "@type": "inlineQueryResultAnimation";
  id: string;
  animation: Animation;
  title: string;
}

export interface TdlibinlineQueryResultAudio {
  "@type": "inlineQueryResultAudio";
  id: string;
  audio: Audio;
}

export interface TdlibinlineQueryResultDocument {
  "@type": "inlineQueryResultDocument";
  id: string;
  document: Document;
  title: string;
  description: string;
}

export interface TdlibinlineQueryResultPhoto {
  "@type": "inlineQueryResultPhoto";
  id: string;
  photo: Photo;
  title: string;
  description: string;
}

export interface TdlibinlineQueryResultSticker {
  "@type": "inlineQueryResultSticker";
  id: string;
  sticker: Sticker;
}

export interface TdlibinlineQueryResultVideo {
  "@type": "inlineQueryResultVideo";
  id: string;
  video: Video;
  title: string;
  description: string;
}

export interface TdlibinlineQueryResultVoiceNote {
  "@type": "inlineQueryResultVoiceNote";
  id: string;
  voice_note: VoiceNote;
  title: string;
}

export interface TdlibinlineQueryResultsButtonTypeStartBot {
  "@type": "inlineQueryResultsButtonTypeStartBot";
  parameter: string;
}

export interface TdlibinlineQueryResultsButtonTypeWebApp {
  "@type": "inlineQueryResultsButtonTypeWebApp";
  url: string;
}

export interface TdlibinlineQueryResultsButton {
  "@type": "inlineQueryResultsButton";
  text: string;
  type: InlineQueryResultsButtonType;
}

export interface TdlibinlineQueryResults {
  "@type": "inlineQueryResults";
  inline_query_id: string;
  button: InlineQueryResultsButton;
  results: Array<InlineQueryResult>;
  next_offset: string;
}

export interface TdlibpreparedInlineMessageId {
  "@type": "preparedInlineMessageId";
  id: string;
  expiration_date: number;
}

export interface TdlibpreparedInlineMessage {
  "@type": "preparedInlineMessage";
  inline_query_id: string;
  result: InlineQueryResult;
  chat_types: TargetChatTypes;
}

export interface TdlibcallbackQueryPayloadData {
  "@type": "callbackQueryPayloadData";
  data: string;
}

export interface TdlibcallbackQueryPayloadDataWithPassword {
  "@type": "callbackQueryPayloadDataWithPassword";
  password: string;
  data: string;
}

export interface TdlibcallbackQueryPayloadGame {
  "@type": "callbackQueryPayloadGame";
  game_short_name: string;
}

export interface TdlibcallbackQueryAnswer {
  "@type": "callbackQueryAnswer";
  text: string;
  show_alert: boolean;
  url: string;
}

export interface TdlibcustomRequestResult {
  "@type": "customRequestResult";
  result: string;
}

export interface TdlibgameHighScore {
  "@type": "gameHighScore";
  position: number;
  user_id: number;
  score: number;
}

export interface TdlibgameHighScores {
  "@type": "gameHighScores";
  scores: Array<GameHighScore>;
}

export interface TdlibchatEventMessageEdited {
  "@type": "chatEventMessageEdited";
  old_message: Message;
  new_message: Message;
}

export interface TdlibchatEventMessageDeleted {
  "@type": "chatEventMessageDeleted";
  message: Message;
  can_report_anti_spam_false_positive: boolean;
}

export interface TdlibchatEventMessagePinned {
  "@type": "chatEventMessagePinned";
  message: Message;
}

export interface TdlibchatEventMessageUnpinned {
  "@type": "chatEventMessageUnpinned";
  message: Message;
}

export interface TdlibchatEventPollStopped {
  "@type": "chatEventPollStopped";
  message: Message;
}


export interface TdlibchatEventMemberJoinedByInviteLink {
  "@type": "chatEventMemberJoinedByInviteLink";
  invite_link: ChatInviteLink;
  via_chat_folder_invite_link: boolean;
}

export interface TdlibchatEventMemberJoinedByRequest {
  "@type": "chatEventMemberJoinedByRequest";
  approver_user_id: number;
  invite_link: ChatInviteLink;
}

export interface TdlibchatEventMemberInvited {
  "@type": "chatEventMemberInvited";
  user_id: number;
  status: ChatMemberStatus;
}


export interface TdlibchatEventMemberPromoted {
  "@type": "chatEventMemberPromoted";
  user_id: number;
  old_status: ChatMemberStatus;
  new_status: ChatMemberStatus;
}

export interface TdlibchatEventMemberRestricted {
  "@type": "chatEventMemberRestricted";
  member_id: MessageSender;
  old_status: ChatMemberStatus;
  new_status: ChatMemberStatus;
}

export interface TdlibchatEventMemberSubscriptionExtended {
  "@type": "chatEventMemberSubscriptionExtended";
  user_id: number;
  old_status: ChatMemberStatus;
  new_status: ChatMemberStatus;
}

export interface TdlibchatEventAvailableReactionsChanged {
  "@type": "chatEventAvailableReactionsChanged";
  old_available_reactions: ChatAvailableReactions;
  new_available_reactions: ChatAvailableReactions;
}

export interface TdlibchatEventBackgroundChanged {
  "@type": "chatEventBackgroundChanged";
  old_background: ChatBackground;
  new_background: ChatBackground;
}

export interface TdlibchatEventDescriptionChanged {
  "@type": "chatEventDescriptionChanged";
  old_description: string;
  new_description: string;
}

export interface TdlibchatEventEmojiStatusChanged {
  "@type": "chatEventEmojiStatusChanged";
  old_emoji_status: EmojiStatus;
  new_emoji_status: EmojiStatus;
}

export interface TdlibchatEventLinkedChatChanged {
  "@type": "chatEventLinkedChatChanged";
  old_linked_chat_id: number;
  new_linked_chat_id: number;
}

export interface TdlibchatEventLocationChanged {
  "@type": "chatEventLocationChanged";
  old_location: ChatLocation;
  new_location: ChatLocation;
}

export interface TdlibchatEventMessageAutoDeleteTimeChanged {
  "@type": "chatEventMessageAutoDeleteTimeChanged";
  old_message_auto_delete_time: number;
  new_message_auto_delete_time: number;
}

export interface TdlibchatEventPermissionsChanged {
  "@type": "chatEventPermissionsChanged";
  old_permissions: ChatPermissions;
  new_permissions: ChatPermissions;
}

export interface TdlibchatEventPhotoChanged {
  "@type": "chatEventPhotoChanged";
  old_photo: ChatPhoto;
  new_photo: ChatPhoto;
}

export interface TdlibchatEventSlowModeDelayChanged {
  "@type": "chatEventSlowModeDelayChanged";
  old_slow_mode_delay: number;
  new_slow_mode_delay: number;
}

export interface TdlibchatEventStickerSetChanged {
  "@type": "chatEventStickerSetChanged";
  old_sticker_set_id: string;
  new_sticker_set_id: string;
}

export interface TdlibchatEventCustomEmojiStickerSetChanged {
  "@type": "chatEventCustomEmojiStickerSetChanged";
  old_sticker_set_id: string;
  new_sticker_set_id: string;
}

export interface TdlibchatEventTitleChanged {
  "@type": "chatEventTitleChanged";
  old_title: string;
  new_title: string;
}

export interface TdlibchatEventUsernameChanged {
  "@type": "chatEventUsernameChanged";
  old_username: string;
  new_username: string;
}

export interface TdlibchatEventActiveUsernamesChanged {
  "@type": "chatEventActiveUsernamesChanged";
  old_usernames: Array<string>;
  new_usernames: Array<string>;
}

export interface TdlibchatEventAccentColorChanged {
  "@type": "chatEventAccentColorChanged";
  old_accent_color_id: number;
  old_background_custom_emoji_id: string;
  new_accent_color_id: number;
  new_background_custom_emoji_id: string;
}

export interface TdlibchatEventProfileAccentColorChanged {
  "@type": "chatEventProfileAccentColorChanged";
  old_profile_accent_color_id: number;
  old_profile_background_custom_emoji_id: string;
  new_profile_accent_color_id: number;
  new_profile_background_custom_emoji_id: string;
}

export interface TdlibchatEventHasProtectedContentToggled {
  "@type": "chatEventHasProtectedContentToggled";
  has_protected_content: boolean;
}

export interface TdlibchatEventInvitesToggled {
  "@type": "chatEventInvitesToggled";
  can_invite_users: boolean;
}

export interface TdlibchatEventIsAllHistoryAvailableToggled {
  "@type": "chatEventIsAllHistoryAvailableToggled";
  is_all_history_available: boolean;
}

export interface TdlibchatEventHasAggressiveAntiSpamEnabledToggled {
  "@type": "chatEventHasAggressiveAntiSpamEnabledToggled";
  has_aggressive_anti_spam_enabled: boolean;
}

export interface TdlibchatEventSignMessagesToggled {
  "@type": "chatEventSignMessagesToggled";
  sign_messages: boolean;
}

export interface TdlibchatEventShowMessageSenderToggled {
  "@type": "chatEventShowMessageSenderToggled";
  show_message_sender: boolean;
}

export interface TdlibchatEventAutomaticTranslationToggled {
  "@type": "chatEventAutomaticTranslationToggled";
  has_automatic_translation: boolean;
}

export interface TdlibchatEventInviteLinkEdited {
  "@type": "chatEventInviteLinkEdited";
  old_invite_link: ChatInviteLink;
  new_invite_link: ChatInviteLink;
}

export interface TdlibchatEventInviteLinkRevoked {
  "@type": "chatEventInviteLinkRevoked";
  invite_link: ChatInviteLink;
}

export interface TdlibchatEventInviteLinkDeleted {
  "@type": "chatEventInviteLinkDeleted";
  invite_link: ChatInviteLink;
}

export interface TdlibchatEventVideoChatCreated {
  "@type": "chatEventVideoChatCreated";
  group_call_id: number;
}

export interface TdlibchatEventVideoChatEnded {
  "@type": "chatEventVideoChatEnded";
  group_call_id: number;
}

export interface TdlibchatEventVideoChatMuteNewParticipantsToggled {
  "@type": "chatEventVideoChatMuteNewParticipantsToggled";
  mute_new_participants: boolean;
}

export interface TdlibchatEventVideoChatParticipantIsMutedToggled {
  "@type": "chatEventVideoChatParticipantIsMutedToggled";
  participant_id: MessageSender;
  is_muted: boolean;
}

export interface TdlibchatEventVideoChatParticipantVolumeLevelChanged {
  "@type": "chatEventVideoChatParticipantVolumeLevelChanged";
  participant_id: MessageSender;
  volume_level: number;
}

export interface TdlibchatEventIsForumToggled {
  "@type": "chatEventIsForumToggled";
  is_forum: boolean;
}

export interface TdlibchatEventForumTopicCreated {
  "@type": "chatEventForumTopicCreated";
  topic_info: ForumTopicInfo;
}

export interface TdlibchatEventForumTopicEdited {
  "@type": "chatEventForumTopicEdited";
  old_topic_info: ForumTopicInfo;
  new_topic_info: ForumTopicInfo;
}

export interface TdlibchatEventForumTopicToggleIsClosed {
  "@type": "chatEventForumTopicToggleIsClosed";
  topic_info: ForumTopicInfo;
}

export interface TdlibchatEventForumTopicToggleIsHidden {
  "@type": "chatEventForumTopicToggleIsHidden";
  topic_info: ForumTopicInfo;
}

export interface TdlibchatEventForumTopicDeleted {
  "@type": "chatEventForumTopicDeleted";
  topic_info: ForumTopicInfo;
}

export interface TdlibchatEventForumTopicPinned {
  "@type": "chatEventForumTopicPinned";
  old_topic_info: ForumTopicInfo;
  new_topic_info: ForumTopicInfo;
}

export interface TdlibchatEvent {
  "@type": "chatEvent";
  id: string;
  date: number;
  member_id: MessageSender;
  action: ChatEventAction;
}

export interface TdlibchatEvents {
  "@type": "chatEvents";
  events: Array<ChatEvent>;
}

export interface TdlibchatEventLogFilters {
  "@type": "chatEventLogFilters";
  message_edits: boolean;
  message_deletions: boolean;
  message_pins: boolean;
  member_joins: boolean;
  member_leaves: boolean;
  member_invites: boolean;
  member_promotions: boolean;
  member_restrictions: boolean;
  info_changes: boolean;
  setting_changes: boolean;
  invite_link_changes: boolean;
  video_chat_changes: boolean;
  forum_changes: boolean;
  subscription_extensions: boolean;
}

export interface TdliblanguagePackStringValueOrdinary {
  "@type": "languagePackStringValueOrdinary";
  value: string;
}

export interface TdliblanguagePackStringValuePluralized {
  "@type": "languagePackStringValuePluralized";
  zero_value: string;
  one_value: string;
  two_value: string;
  few_value: string;
  many_value: string;
  other_value: string;
}


export interface TdliblanguagePackString {
  "@type": "languagePackString";
  key: string;
  value: LanguagePackStringValue;
}

export interface TdliblanguagePackStrings {
  "@type": "languagePackStrings";
  strings: Array<LanguagePackString>;
}

export interface TdliblanguagePackInfo {
  "@type": "languagePackInfo";
  id: string;
  base_language_pack_id: string;
  name: string;
  native_name: string;
  plural_code: string;
  is_official: boolean;
  is_rtl: boolean;
  is_beta: boolean;
  is_installed: boolean;
  total_string_count: number;
  translated_string_count: number;
  local_string_count: number;
  translation_url: string;
}

export interface TdliblocalizationTargetInfo {
  "@type": "localizationTargetInfo";
  language_packs: Array<LanguagePackInfo>;
}
































































export interface TdlibpremiumLimit {
  "@type": "premiumLimit";
  type: PremiumLimitType;
  default_value: number;
  premium_value: number;
}

export interface TdlibpremiumFeatures {
  "@type": "premiumFeatures";
  features: Array<PremiumFeature>;
  limits: Array<PremiumLimit>;
  payment_link: InternalLinkType;
}

export interface TdlibbusinessFeatures {
  "@type": "businessFeatures";
  features: Array<BusinessFeature>;
}

export interface TdlibpremiumSourceLimitExceeded {
  "@type": "premiumSourceLimitExceeded";
  limit_type: PremiumLimitType;
}

export interface TdlibpremiumSourceFeature {
  "@type": "premiumSourceFeature";
  feature: PremiumFeature;
}

export interface TdlibpremiumSourceBusinessFeature {
  "@type": "premiumSourceBusinessFeature";
  feature: BusinessFeature;
}

export interface TdlibpremiumSourceStoryFeature {
  "@type": "premiumSourceStoryFeature";
  feature: PremiumStoryFeature;
}

export interface TdlibpremiumSourceLink {
  "@type": "premiumSourceLink";
  referrer: string;
}


export interface TdlibpremiumFeaturePromotionAnimation {
  "@type": "premiumFeaturePromotionAnimation";
  feature: PremiumFeature;
  animation: Animation;
}

export interface TdlibbusinessFeaturePromotionAnimation {
  "@type": "businessFeaturePromotionAnimation";
  feature: BusinessFeature;
  animation: Animation;
}

export interface TdlibpremiumState {
  "@type": "premiumState";
  state: FormattedText;
  payment_options: Array<PremiumStatePaymentOption>;
  animations: Array<PremiumFeaturePromotionAnimation>;
  business_animations: Array<BusinessFeaturePromotionAnimation>;
}

export interface TdlibstorePaymentPurposePremiumSubscription {
  "@type": "storePaymentPurposePremiumSubscription";
  is_restore: boolean;
  is_upgrade: boolean;
}

export interface TdlibstorePaymentPurposePremiumGift {
  "@type": "storePaymentPurposePremiumGift";
  currency: string;
  amount: number;
  user_id: number;
  text: FormattedText;
}

export interface TdlibstorePaymentPurposePremiumGiftCodes {
  "@type": "storePaymentPurposePremiumGiftCodes";
  boosted_chat_id: number;
  currency: string;
  amount: number;
  user_ids: Array<number>;
  text: FormattedText;
}

export interface TdlibstorePaymentPurposePremiumGiveaway {
  "@type": "storePaymentPurposePremiumGiveaway";
  parameters: GiveawayParameters;
  currency: string;
  amount: number;
}

export interface TdlibstorePaymentPurposeStarGiveaway {
  "@type": "storePaymentPurposeStarGiveaway";
  parameters: GiveawayParameters;
  currency: string;
  amount: number;
  winner_count: number;
  star_count: number;
}

export interface TdlibstorePaymentPurposeStars {
  "@type": "storePaymentPurposeStars";
  currency: string;
  amount: number;
  star_count: number;
  chat_id: number;
}

export interface TdlibstorePaymentPurposeGiftedStars {
  "@type": "storePaymentPurposeGiftedStars";
  user_id: number;
  currency: string;
  amount: number;
  star_count: number;
}

export interface TdlibstoreTransactionAppStore {
  "@type": "storeTransactionAppStore";
  receipt: string;
}

export interface TdlibstoreTransactionGooglePlay {
  "@type": "storeTransactionGooglePlay";
  package_name: string;
  store_product_id: string;
  purchase_token: string;
}

export interface TdlibtelegramPaymentPurposePremiumGift {
  "@type": "telegramPaymentPurposePremiumGift";
  currency: string;
  amount: number;
  user_id: number;
  month_count: number;
  text: FormattedText;
}

export interface TdlibtelegramPaymentPurposePremiumGiftCodes {
  "@type": "telegramPaymentPurposePremiumGiftCodes";
  boosted_chat_id: number;
  currency: string;
  amount: number;
  user_ids: Array<number>;
  month_count: number;
  text: FormattedText;
}

export interface TdlibtelegramPaymentPurposePremiumGiveaway {
  "@type": "telegramPaymentPurposePremiumGiveaway";
  parameters: GiveawayParameters;
  currency: string;
  amount: number;
  winner_count: number;
  month_count: number;
}

export interface TdlibtelegramPaymentPurposeStars {
  "@type": "telegramPaymentPurposeStars";
  currency: string;
  amount: number;
  star_count: number;
  chat_id: number;
}

export interface TdlibtelegramPaymentPurposeGiftedStars {
  "@type": "telegramPaymentPurposeGiftedStars";
  user_id: number;
  currency: string;
  amount: number;
  star_count: number;
}

export interface TdlibtelegramPaymentPurposeStarGiveaway {
  "@type": "telegramPaymentPurposeStarGiveaway";
  parameters: GiveawayParameters;
  currency: string;
  amount: number;
  winner_count: number;
  star_count: number;
}

export interface TdlibtelegramPaymentPurposeJoinChat {
  "@type": "telegramPaymentPurposeJoinChat";
  invite_link: string;
}

export interface TdlibdeviceTokenFirebaseCloudMessaging {
  "@type": "deviceTokenFirebaseCloudMessaging";
  token: string;
  encrypt: boolean;
}

export interface TdlibdeviceTokenApplePush {
  "@type": "deviceTokenApplePush";
  device_token: string;
  is_app_sandbox: boolean;
}

export interface TdlibdeviceTokenApplePushVoIP {
  "@type": "deviceTokenApplePushVoIP";
  device_token: string;
  is_app_sandbox: boolean;
  encrypt: boolean;
}

export interface TdlibdeviceTokenWindowsPush {
  "@type": "deviceTokenWindowsPush";
  access_token: string;
}

export interface TdlibdeviceTokenMicrosoftPush {
  "@type": "deviceTokenMicrosoftPush";
  channel_uri: string;
}

export interface TdlibdeviceTokenMicrosoftPushVoIP {
  "@type": "deviceTokenMicrosoftPushVoIP";
  channel_uri: string;
}

export interface TdlibdeviceTokenWebPush {
  "@type": "deviceTokenWebPush";
  endpoint: string;
  p256dh_base64url: string;
  auth_base64url: string;
}

export interface TdlibdeviceTokenSimplePush {
  "@type": "deviceTokenSimplePush";
  endpoint: string;
}

export interface TdlibdeviceTokenUbuntuPush {
  "@type": "deviceTokenUbuntuPush";
  token: string;
}

export interface TdlibdeviceTokenBlackBerryPush {
  "@type": "deviceTokenBlackBerryPush";
  token: string;
}

export interface TdlibdeviceTokenTizenPush {
  "@type": "deviceTokenTizenPush";
  reg_id: string;
}

export interface TdlibdeviceTokenHuaweiPush {
  "@type": "deviceTokenHuaweiPush";
  token: string;
  encrypt: boolean;
}

export interface TdlibpushReceiverId {
  "@type": "pushReceiverId";
  id: string;
}

export interface TdlibbackgroundFillSolid {
  "@type": "backgroundFillSolid";
  color: number;
}

export interface TdlibbackgroundFillGradient {
  "@type": "backgroundFillGradient";
  top_color: number;
  bottom_color: number;
  rotation_angle: number;
}

export interface TdlibbackgroundFillFreeformGradient {
  "@type": "backgroundFillFreeformGradient";
  colors: Array<number>;
}

export interface TdlibbackgroundTypeWallpaper {
  "@type": "backgroundTypeWallpaper";
  is_blurred: boolean;
  is_moving: boolean;
}

export interface TdlibbackgroundTypePattern {
  "@type": "backgroundTypePattern";
  fill: BackgroundFill;
  intensity: number;
  is_inverted: boolean;
  is_moving: boolean;
}

export interface TdlibbackgroundTypeFill {
  "@type": "backgroundTypeFill";
  fill: BackgroundFill;
}

export interface TdlibbackgroundTypeChatTheme {
  "@type": "backgroundTypeChatTheme";
  theme_name: string;
}

export interface TdlibinputBackgroundLocal {
  "@type": "inputBackgroundLocal";
  background: InputFile;
}

export interface TdlibinputBackgroundRemote {
  "@type": "inputBackgroundRemote";
  background_id: string;
}

export interface TdlibinputBackgroundPrevious {
  "@type": "inputBackgroundPrevious";
  message_id: number;
}

export interface TdlibemojiChatTheme {
  "@type": "emojiChatTheme";
  name: string;
  light_settings: ThemeSettings;
  dark_settings: ThemeSettings;
}

export interface TdlibgiftChatTheme {
  "@type": "giftChatTheme";
  gift: UpgradedGift;
  light_settings: ThemeSettings;
  dark_settings: ThemeSettings;
}

export interface TdlibgiftChatThemes {
  "@type": "giftChatThemes";
  themes: Array<GiftChatTheme>;
  next_offset: string;
}

export interface TdlibchatThemeEmoji {
  "@type": "chatThemeEmoji";
  name: string;
}

export interface TdlibchatThemeGift {
  "@type": "chatThemeGift";
  gift_theme: GiftChatTheme;
}

export interface TdlibinputChatThemeEmoji {
  "@type": "inputChatThemeEmoji";
  name: string;
}

export interface TdlibinputChatThemeGift {
  "@type": "inputChatThemeGift";
  name: string;
}

export interface TdlibtimeZone {
  "@type": "timeZone";
  id: string;
  name: string;
  utc_time_offset: number;
}

export interface TdlibtimeZones {
  "@type": "timeZones";
  time_zones: Array<TimeZone>;
}

export interface Tdlibhashtags {
  "@type": "hashtags";
  hashtags: Array<string>;
}

export interface TdlibcanPostStoryResultOk {
  "@type": "canPostStoryResultOk";
  story_count: number;
}




export interface TdlibcanPostStoryResultWeeklyLimitExceeded {
  "@type": "canPostStoryResultWeeklyLimitExceeded";
  retry_after: number;
}

export interface TdlibcanPostStoryResultMonthlyLimitExceeded {
  "@type": "canPostStoryResultMonthlyLimitExceeded";
  retry_after: number;
}

export interface TdlibcanPostStoryResultLiveStoryIsActive {
  "@type": "canPostStoryResultLiveStoryIsActive";
  story_id: number;
}

export interface TdlibstartLiveStoryResultOk {
  "@type": "startLiveStoryResultOk";
  story: Story;
}

export interface TdlibstartLiveStoryResultFail {
  "@type": "startLiveStoryResultFail";
  error_type: CanPostStoryResult;
}



export interface TdlibcanTransferOwnershipResultPasswordTooFresh {
  "@type": "canTransferOwnershipResultPasswordTooFresh";
  retry_after: number;
}

export interface TdlibcanTransferOwnershipResultSessionTooFresh {
  "@type": "canTransferOwnershipResultSessionTooFresh";
  retry_after: number;
}











export interface TdlibresetPasswordResultPending {
  "@type": "resetPasswordResultPending";
  pending_reset_date: number;
}

export interface TdlibresetPasswordResultDeclined {
  "@type": "resetPasswordResultDeclined";
  retry_date: number;
}

export interface TdlibmessageFileTypePrivate {
  "@type": "messageFileTypePrivate";
  name: string;
}

export interface TdlibmessageFileTypeGroup {
  "@type": "messageFileTypeGroup";
  title: string;
}


export interface TdlibpushMessageContentHidden {
  "@type": "pushMessageContentHidden";
  is_pinned: boolean;
}

export interface TdlibpushMessageContentAnimation {
  "@type": "pushMessageContentAnimation";
  animation: Animation;
  caption: string;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentAudio {
  "@type": "pushMessageContentAudio";
  audio: Audio;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentContact {
  "@type": "pushMessageContentContact";
  name: string;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentContactRegistered {
  "@type": "pushMessageContentContactRegistered";
  as_premium_account: boolean;
}

export interface TdlibpushMessageContentDocument {
  "@type": "pushMessageContentDocument";
  document: Document;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentGame {
  "@type": "pushMessageContentGame";
  title: string;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentGameScore {
  "@type": "pushMessageContentGameScore";
  title: string;
  score: number;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentInvoice {
  "@type": "pushMessageContentInvoice";
  price: string;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentLocation {
  "@type": "pushMessageContentLocation";
  is_live: boolean;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentPaidMedia {
  "@type": "pushMessageContentPaidMedia";
  star_count: number;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentPhoto {
  "@type": "pushMessageContentPhoto";
  photo: Photo;
  caption: string;
  is_secret: boolean;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentPoll {
  "@type": "pushMessageContentPoll";
  question: string;
  is_regular: boolean;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentPremiumGiftCode {
  "@type": "pushMessageContentPremiumGiftCode";
  month_count: number;
}

export interface TdlibpushMessageContentGiveaway {
  "@type": "pushMessageContentGiveaway";
  winner_count: number;
  prize: GiveawayPrize;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentGift {
  "@type": "pushMessageContentGift";
  star_count: number;
  is_prepaid_upgrade: boolean;
}

export interface TdlibpushMessageContentUpgradedGift {
  "@type": "pushMessageContentUpgradedGift";
  is_upgrade: boolean;
  is_prepaid_upgrade: boolean;
}


export interface TdlibpushMessageContentSticker {
  "@type": "pushMessageContentSticker";
  sticker: Sticker;
  emoji: string;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentStory {
  "@type": "pushMessageContentStory";
  is_mention: boolean;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentText {
  "@type": "pushMessageContentText";
  text: string;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentChecklist {
  "@type": "pushMessageContentChecklist";
  title: string;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentVideo {
  "@type": "pushMessageContentVideo";
  video: Video;
  caption: string;
  is_secret: boolean;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentVideoNote {
  "@type": "pushMessageContentVideoNote";
  video_note: VideoNote;
  is_pinned: boolean;
}

export interface TdlibpushMessageContentVoiceNote {
  "@type": "pushMessageContentVoiceNote";
  voice_note: VoiceNote;
  is_pinned: boolean;
}




export interface TdlibpushMessageContentInviteVideoChatParticipants {
  "@type": "pushMessageContentInviteVideoChatParticipants";
  is_current_user: boolean;
}

export interface TdlibpushMessageContentChatAddMembers {
  "@type": "pushMessageContentChatAddMembers";
  member_name: string;
  is_current_user: boolean;
  is_returned: boolean;
}


export interface TdlibpushMessageContentChatChangeTitle {
  "@type": "pushMessageContentChatChangeTitle";
  title: string;
}

export interface TdlibpushMessageContentChatSetBackground {
  "@type": "pushMessageContentChatSetBackground";
  is_same: boolean;
}

export interface TdlibpushMessageContentChatSetTheme {
  "@type": "pushMessageContentChatSetTheme";
  name: string;
}

export interface TdlibpushMessageContentChatDeleteMember {
  "@type": "pushMessageContentChatDeleteMember";
  member_name: string;
  is_current_user: boolean;
  is_left: boolean;
}



export interface TdlibpushMessageContentRecurringPayment {
  "@type": "pushMessageContentRecurringPayment";
  amount: string;
}



export interface TdlibpushMessageContentProximityAlertTriggered {
  "@type": "pushMessageContentProximityAlertTriggered";
  distance: number;
}

export interface TdlibpushMessageContentChecklistTasksAdded {
  "@type": "pushMessageContentChecklistTasksAdded";
  task_count: number;
}

export interface TdlibpushMessageContentChecklistTasksDone {
  "@type": "pushMessageContentChecklistTasksDone";
  task_count: number;
}

export interface TdlibpushMessageContentMessageForwards {
  "@type": "pushMessageContentMessageForwards";
  total_count: number;
}

export interface TdlibpushMessageContentMediaAlbum {
  "@type": "pushMessageContentMediaAlbum";
  total_count: number;
  has_photos: boolean;
  has_videos: boolean;
  has_audios: boolean;
  has_documents: boolean;
}

export interface TdlibnotificationTypeNewMessage {
  "@type": "notificationTypeNewMessage";
  message: Message;
  show_preview: boolean;
}


export interface TdlibnotificationTypeNewCall {
  "@type": "notificationTypeNewCall";
  call_id: number;
}

export interface TdlibnotificationTypeNewPushMessage {
  "@type": "notificationTypeNewPushMessage";
  message_id: number;
  sender_id: MessageSender;
  sender_name: string;
  is_outgoing: boolean;
  content: PushMessageContent;
}





export interface TdlibnotificationSound {
  "@type": "notificationSound";
  id: string;
  duration: number;
  date: number;
  title: string;
  data: string;
  sound: File;
}

export interface TdlibnotificationSounds {
  "@type": "notificationSounds";
  notification_sounds: Array<NotificationSound>;
}

export interface Tdlibnotification {
  "@type": "notification";
  id: number;
  date: number;
  is_silent: boolean;
  type: NotificationType;
}

export interface TdlibnotificationGroup {
  "@type": "notificationGroup";
  id: number;
  type: NotificationGroupType;
  chat_id: number;
  total_count: number;
  notifications: Array<Notification>;
}

export interface TdliboptionValueBoolean {
  "@type": "optionValueBoolean";
  value: boolean;
}


export interface TdliboptionValueInteger {
  "@type": "optionValueInteger";
  value: string;
}

export interface TdliboptionValueString {
  "@type": "optionValueString";
  value: string;
}

export interface TdlibjsonObjectMember {
  "@type": "jsonObjectMember";
  key: string;
  value: JsonValue;
}


export interface TdlibjsonValueBoolean {
  "@type": "jsonValueBoolean";
  value: boolean;
}

export interface TdlibjsonValueNumber {
  "@type": "jsonValueNumber";
  value: number;
}

export interface TdlibjsonValueString {
  "@type": "jsonValueString";
  value: string;
}

export interface TdlibjsonValueArray {
  "@type": "jsonValueArray";
  values: Array<JsonValue>;
}

export interface TdlibjsonValueObject {
  "@type": "jsonValueObject";
  members: Array<JsonObjectMember>;
}

export interface TdlibstoryPrivacySettingsEveryone {
  "@type": "storyPrivacySettingsEveryone";
  except_user_ids: Array<number>;
}

export interface TdlibstoryPrivacySettingsContacts {
  "@type": "storyPrivacySettingsContacts";
  except_user_ids: Array<number>;
}


export interface TdlibstoryPrivacySettingsSelectedUsers {
  "@type": "storyPrivacySettingsSelectedUsers";
  user_ids: Array<number>;
}





export interface TdlibuserPrivacySettingRuleAllowUsers {
  "@type": "userPrivacySettingRuleAllowUsers";
  user_ids: Array<number>;
}

export interface TdlibuserPrivacySettingRuleAllowChatMembers {
  "@type": "userPrivacySettingRuleAllowChatMembers";
  chat_ids: Array<number>;
}




export interface TdlibuserPrivacySettingRuleRestrictUsers {
  "@type": "userPrivacySettingRuleRestrictUsers";
  user_ids: Array<number>;
}

export interface TdlibuserPrivacySettingRuleRestrictChatMembers {
  "@type": "userPrivacySettingRuleRestrictChatMembers";
  chat_ids: Array<number>;
}

export interface TdlibuserPrivacySettingRules {
  "@type": "userPrivacySettingRules";
  rules: Array<UserPrivacySettingRule>;
}















export interface TdlibreadDatePrivacySettings {
  "@type": "readDatePrivacySettings";
  show_read_date: boolean;
}

export interface TdlibnewChatPrivacySettings {
  "@type": "newChatPrivacySettings";
  allow_new_chats_from_unknown_users: boolean;
  incoming_paid_message_star_count: number;
}


export interface TdlibcanSendMessageToUserResultUserHasPaidMessages {
  "@type": "canSendMessageToUserResultUserHasPaidMessages";
  outgoing_paid_message_star_count: number;
}



export interface TdlibaccountTtl {
  "@type": "accountTtl";
  days: number;
}

export interface TdlibmessageAutoDeleteTime {
  "@type": "messageAutoDeleteTime";
  time: number;
}


















export interface Tdlibsession {
  "@type": "session";
  id: string;
  is_current: boolean;
  is_password_pending: boolean;
  is_unconfirmed: boolean;
  can_accept_secret_chats: boolean;
  can_accept_calls: boolean;
  type: SessionType;
  api_id: number;
  application_name: string;
  application_version: string;
  is_official_application: boolean;
  device_model: string;
  platform: string;
  system_version: string;
  log_in_date: number;
  last_active_date: number;
  ip_address: string;
  location: string;
}

export interface Tdlibsessions {
  "@type": "sessions";
  sessions: Array<Session>;
  inactive_session_ttl_days: number;
}

export interface TdlibunconfirmedSession {
  "@type": "unconfirmedSession";
  id: string;
  log_in_date: number;
  device_model: string;
  location: string;
}

export interface TdlibconnectedWebsite {
  "@type": "connectedWebsite";
  id: string;
  domain_name: string;
  bot_user_id: number;
  browser: string;
  platform: string;
  log_in_date: number;
  last_active_date: number;
  ip_address: string;
  location: string;
}

export interface TdlibconnectedWebsites {
  "@type": "connectedWebsites";
  websites: Array<ConnectedWebsite>;
}












export interface TdlibreportChatResultOptionRequired {
  "@type": "reportChatResultOptionRequired";
  title: string;
  options: Array<ReportOption>;
}

export interface TdlibreportChatResultTextRequired {
  "@type": "reportChatResultTextRequired";
  option_id: string;
  is_optional: boolean;
}



export interface TdlibreportStoryResultOptionRequired {
  "@type": "reportStoryResultOptionRequired";
  title: string;
  options: Array<ReportOption>;
}

export interface TdlibreportStoryResultTextRequired {
  "@type": "reportStoryResultTextRequired";
  option_id: string;
  is_optional: boolean;
}


export interface TdlibinternalLinkTypeAttachmentMenuBot {
  "@type": "internalLinkTypeAttachmentMenuBot";
  target_chat: TargetChat;
  bot_username: string;
  url: string;
}

export interface TdlibinternalLinkTypeAuthenticationCode {
  "@type": "internalLinkTypeAuthenticationCode";
  code: string;
}

export interface TdlibinternalLinkTypeBackground {
  "@type": "internalLinkTypeBackground";
  background_name: string;
}

export interface TdlibinternalLinkTypeBotAddToChannel {
  "@type": "internalLinkTypeBotAddToChannel";
  bot_username: string;
  administrator_rights: ChatAdministratorRights;
}

export interface TdlibinternalLinkTypeBotStart {
  "@type": "internalLinkTypeBotStart";
  bot_username: string;
  start_parameter: string;
  autostart: boolean;
}

export interface TdlibinternalLinkTypeBotStartInGroup {
  "@type": "internalLinkTypeBotStartInGroup";
  bot_username: string;
  start_parameter: string;
  administrator_rights: ChatAdministratorRights;
}

export interface TdlibinternalLinkTypeBusinessChat {
  "@type": "internalLinkTypeBusinessChat";
  link_name: string;
}

export interface TdlibinternalLinkTypeBuyStars {
  "@type": "internalLinkTypeBuyStars";
  star_count: number;
  purpose: string;
}


export interface TdlibinternalLinkTypeChatAffiliateProgram {
  "@type": "internalLinkTypeChatAffiliateProgram";
  username: string;
  referrer: string;
}

export interface TdlibinternalLinkTypeChatBoost {
  "@type": "internalLinkTypeChatBoost";
  url: string;
}

export interface TdlibinternalLinkTypeChatFolderInvite {
  "@type": "internalLinkTypeChatFolderInvite";
  invite_link: string;
}


export interface TdlibinternalLinkTypeChatInvite {
  "@type": "internalLinkTypeChatInvite";
  invite_link: string;
}


export interface TdlibinternalLinkTypeDirectMessagesChat {
  "@type": "internalLinkTypeDirectMessagesChat";
  channel_username: string;
}


export interface TdlibinternalLinkTypeGame {
  "@type": "internalLinkTypeGame";
  bot_username: string;
  game_short_name: string;
}

export interface TdlibinternalLinkTypeGiftAuction {
  "@type": "internalLinkTypeGiftAuction";
  auction_id: string;
}

export interface TdlibinternalLinkTypeGiftCollection {
  "@type": "internalLinkTypeGiftCollection";
  gift_owner_username: string;
  collection_id: number;
}

export interface TdlibinternalLinkTypeGroupCall {
  "@type": "internalLinkTypeGroupCall";
  invite_link: string;
}

export interface TdlibinternalLinkTypeInstantView {
  "@type": "internalLinkTypeInstantView";
  url: string;
  fallback_url: string;
}

export interface TdlibinternalLinkTypeInvoice {
  "@type": "internalLinkTypeInvoice";
  invoice_name: string;
}

export interface TdlibinternalLinkTypeLanguagePack {
  "@type": "internalLinkTypeLanguagePack";
  language_pack_id: string;
}


export interface TdlibinternalLinkTypeLiveStory {
  "@type": "internalLinkTypeLiveStory";
  story_poster_username: string;
}


export interface TdlibinternalLinkTypeMainWebApp {
  "@type": "internalLinkTypeMainWebApp";
  bot_username: string;
  start_parameter: string;
  mode: WebAppOpenMode;
}

export interface TdlibinternalLinkTypeMessage {
  "@type": "internalLinkTypeMessage";
  url: string;
}

export interface TdlibinternalLinkTypeMessageDraft {
  "@type": "internalLinkTypeMessageDraft";
  text: FormattedText;
  contains_link: boolean;
}



export interface TdlibinternalLinkTypePassportDataRequest {
  "@type": "internalLinkTypePassportDataRequest";
  bot_user_id: number;
  scope: string;
  public_key: string;
  nonce: string;
  callback_url: string;
}


export interface TdlibinternalLinkTypePhoneNumberConfirmation {
  "@type": "internalLinkTypePhoneNumberConfirmation";
  hash: string;
  phone_number: string;
}


export interface TdlibinternalLinkTypePremiumFeatures {
  "@type": "internalLinkTypePremiumFeatures";
  referrer: string;
}

export interface TdlibinternalLinkTypePremiumGift {
  "@type": "internalLinkTypePremiumGift";
  referrer: string;
}

export interface TdlibinternalLinkTypePremiumGiftCode {
  "@type": "internalLinkTypePremiumGiftCode";
  code: string;
}


export interface TdlibinternalLinkTypeProxy {
  "@type": "internalLinkTypeProxy";
  server: string;
  port: number;
  type: ProxyType;
}

export interface TdlibinternalLinkTypePublicChat {
  "@type": "internalLinkTypePublicChat";
  chat_username: string;
  draft_text: string;
  open_profile: boolean;
}




export interface TdlibinternalLinkTypeStickerSet {
  "@type": "internalLinkTypeStickerSet";
  sticker_set_name: string;
  expect_custom_emoji: boolean;
}

export interface TdlibinternalLinkTypeStory {
  "@type": "internalLinkTypeStory";
  story_poster_username: string;
  story_id: number;
}

export interface TdlibinternalLinkTypeStoryAlbum {
  "@type": "internalLinkTypeStoryAlbum";
  story_album_owner_username: string;
  story_album_id: number;
}

export interface TdlibinternalLinkTypeTheme {
  "@type": "internalLinkTypeTheme";
  theme_name: string;
}


export interface TdlibinternalLinkTypeUnknownDeepLink {
  "@type": "internalLinkTypeUnknownDeepLink";
  link: string;
}


export interface TdlibinternalLinkTypeUpgradedGift {
  "@type": "internalLinkTypeUpgradedGift";
  name: string;
}

export interface TdlibinternalLinkTypeUserPhoneNumber {
  "@type": "internalLinkTypeUserPhoneNumber";
  phone_number: string;
  draft_text: string;
  open_profile: boolean;
}

export interface TdlibinternalLinkTypeUserToken {
  "@type": "internalLinkTypeUserToken";
  token: string;
}

export interface TdlibinternalLinkTypeVideoChat {
  "@type": "internalLinkTypeVideoChat";
  chat_username: string;
  invite_hash: string;
  is_live_stream: boolean;
}

export interface TdlibinternalLinkTypeWebApp {
  "@type": "internalLinkTypeWebApp";
  bot_username: string;
  web_app_short_name: string;
  start_parameter: string;
  mode: WebAppOpenMode;
}

export interface TdlibmessageLink {
  "@type": "messageLink";
  link: string;
  is_public: boolean;
}

export interface TdlibmessageLinkInfo {
  "@type": "messageLinkInfo";
  is_public: boolean;
  chat_id: number;
  topic_id: MessageTopic;
  message: Message;
  media_timestamp: number;
  for_album: boolean;
}

export interface TdlibchatBoostLink {
  "@type": "chatBoostLink";
  link: string;
  is_public: boolean;
}

export interface TdlibchatBoostLinkInfo {
  "@type": "chatBoostLinkInfo";
  is_public: boolean;
  chat_id: number;
}


























export interface TdlibstorageStatisticsByFileType {
  "@type": "storageStatisticsByFileType";
  file_type: FileType;
  size: number;
  count: number;
}

export interface TdlibstorageStatisticsByChat {
  "@type": "storageStatisticsByChat";
  chat_id: number;
  size: number;
  count: number;
  by_file_type: Array<StorageStatisticsByFileType>;
}

export interface TdlibstorageStatistics {
  "@type": "storageStatistics";
  size: number;
  count: number;
  by_chat: Array<StorageStatisticsByChat>;
}

export interface TdlibstorageStatisticsFast {
  "@type": "storageStatisticsFast";
  files_size: number;
  file_count: number;
  database_size: number;
  language_pack_database_size: number;
  log_size: number;
}

export interface TdlibdatabaseStatistics {
  "@type": "databaseStatistics";
  statistics: string;
}






export interface TdlibnetworkStatisticsEntryFile {
  "@type": "networkStatisticsEntryFile";
  file_type: FileType;
  network_type: NetworkType;
  sent_bytes: number;
  received_bytes: number;
}

export interface TdlibnetworkStatisticsEntryCall {
  "@type": "networkStatisticsEntryCall";
  network_type: NetworkType;
  sent_bytes: number;
  received_bytes: number;
  duration: number;
}

export interface TdlibnetworkStatistics {
  "@type": "networkStatistics";
  since_date: number;
  entries: Array<NetworkStatisticsEntry>;
}

export interface TdlibautoDownloadSettings {
  "@type": "autoDownloadSettings";
  is_auto_download_enabled: boolean;
  max_photo_file_size: number;
  max_video_file_size: number;
  max_other_file_size: number;
  video_upload_bitrate: number;
  preload_large_videos: boolean;
  preload_next_audio: boolean;
  preload_stories: boolean;
  use_less_data_for_calls: boolean;
}

export interface TdlibautoDownloadSettingsPresets {
  "@type": "autoDownloadSettingsPresets";
  low: AutoDownloadSettings;
  medium: AutoDownloadSettings;
  high: AutoDownloadSettings;
}




export interface TdlibautosaveSettingsScopeChat {
  "@type": "autosaveSettingsScopeChat";
  chat_id: number;
}

export interface TdlibscopeAutosaveSettings {
  "@type": "scopeAutosaveSettings";
  autosave_photos: boolean;
  autosave_videos: boolean;
  max_video_file_size: number;
}

export interface TdlibautosaveSettingsException {
  "@type": "autosaveSettingsException";
  chat_id: number;
  settings: ScopeAutosaveSettings;
}

export interface TdlibautosaveSettings {
  "@type": "autosaveSettings";
  private_chat_settings: ScopeAutosaveSettings;
  group_settings: ScopeAutosaveSettings;
  channel_settings: ScopeAutosaveSettings;
  exceptions: Array<AutosaveSettingsException>;
}






export interface TdlibageVerificationParameters {
  "@type": "ageVerificationParameters";
  min_age: number;
  verification_bot_username: string;
  country: string;
}









export interface TdlibfoundPosition {
  "@type": "foundPosition";
  position: number;
}

export interface TdlibfoundPositions {
  "@type": "foundPositions";
  total_count: number;
  positions: Array<number>;
}

export interface TdlibtMeUrlTypeUser {
  "@type": "tMeUrlTypeUser";
  user_id: number;
}

export interface TdlibtMeUrlTypeSupergroup {
  "@type": "tMeUrlTypeSupergroup";
  supergroup_id: number;
}

export interface TdlibtMeUrlTypeChatInvite {
  "@type": "tMeUrlTypeChatInvite";
  info: ChatInviteLinkInfo;
}

export interface TdlibtMeUrlTypeStickerSet {
  "@type": "tMeUrlTypeStickerSet";
  sticker_set_id: string;
}

export interface TdlibtMeUrl {
  "@type": "tMeUrl";
  url: string;
  type: TMeUrlType;
}

export interface TdlibtMeUrls {
  "@type": "tMeUrls";
  urls: Array<TMeUrl>;
}





export interface TdlibsuggestedActionConvertToBroadcastGroup {
  "@type": "suggestedActionConvertToBroadcastGroup";
  supergroup_id: number;
}

export interface TdlibsuggestedActionSetPassword {
  "@type": "suggestedActionSetPassword";
  authorization_delay: number;
}







export interface TdlibsuggestedActionExtendPremium {
  "@type": "suggestedActionExtendPremium";
  manage_premium_subscription_url: string;
}


export interface TdlibsuggestedActionCustom {
  "@type": "suggestedActionCustom";
  name: string;
  title: FormattedText;
  description: FormattedText;
  url: string;
}

export interface TdlibsuggestedActionSetLoginEmailAddress {
  "@type": "suggestedActionSetLoginEmailAddress";
  can_be_hidden: boolean;
}


export interface Tdlibcount {
  "@type": "count";
  count: number;
}

export interface Tdlibtext {
  "@type": "text";
  text: string;
}

export interface Tdlibdata {
  "@type": "data";
  data: string;
}

export interface Tdlibseconds {
  "@type": "seconds";
  seconds: number;
}

export interface TdlibfileDownloadedPrefixSize {
  "@type": "fileDownloadedPrefixSize";
  size: number;
}

export interface TdlibstarCount {
  "@type": "starCount";
  star_count: number;
}

export interface TdlibdeepLinkInfo {
  "@type": "deepLinkInfo";
  text: FormattedText;
  need_update_application: boolean;
}

export interface TdlibtextParseModeMarkdown {
  "@type": "textParseModeMarkdown";
  version: number;
}


export interface TdlibproxyTypeSocks5 {
  "@type": "proxyTypeSocks5";
  username: string;
  password: string;
}

export interface TdlibproxyTypeHttp {
  "@type": "proxyTypeHttp";
  username: string;
  password: string;
  http_only: boolean;
}

export interface TdlibproxyTypeMtproto {
  "@type": "proxyTypeMtproto";
  secret: string;
}

export interface Tdlibproxy {
  "@type": "proxy";
  id: number;
  server: string;
  port: number;
  last_used_date: number;
  is_enabled: boolean;
  type: ProxyType;
}

export interface Tdlibproxies {
  "@type": "proxies";
  proxies: Array<Proxy>;
}

export interface TdlibinputSticker {
  "@type": "inputSticker";
  sticker: InputFile;
  format: StickerFormat;
  emojis: string;
  mask_position: MaskPosition;
  keywords: Array<string>;
}

export interface TdlibdateRange {
  "@type": "dateRange";
  start_date: number;
  end_date: number;
}

export interface TdlibstatisticalValue {
  "@type": "statisticalValue";
  value: number;
  previous_value: number;
  growth_rate_percentage: number;
}

export interface TdlibstatisticalGraphData {
  "@type": "statisticalGraphData";
  json_data: string;
  zoom_token: string;
}

export interface TdlibstatisticalGraphAsync {
  "@type": "statisticalGraphAsync";
  token: string;
}

export interface TdlibstatisticalGraphError {
  "@type": "statisticalGraphError";
  error_message: string;
}

export interface TdlibchatStatisticsObjectTypeMessage {
  "@type": "chatStatisticsObjectTypeMessage";
  message_id: number;
}

export interface TdlibchatStatisticsObjectTypeStory {
  "@type": "chatStatisticsObjectTypeStory";
  story_id: number;
}

export interface TdlibchatStatisticsInteractionInfo {
  "@type": "chatStatisticsInteractionInfo";
  object_type: ChatStatisticsObjectType;
  view_count: number;
  forward_count: number;
  reaction_count: number;
}

export interface TdlibchatStatisticsMessageSenderInfo {
  "@type": "chatStatisticsMessageSenderInfo";
  user_id: number;
  sent_message_count: number;
  average_character_count: number;
}

export interface TdlibchatStatisticsAdministratorActionsInfo {
  "@type": "chatStatisticsAdministratorActionsInfo";
  user_id: number;
  deleted_message_count: number;
  banned_user_count: number;
  restricted_user_count: number;
}

export interface TdlibchatStatisticsInviterInfo {
  "@type": "chatStatisticsInviterInfo";
  user_id: number;
  added_member_count: number;
}

export interface TdlibchatStatisticsSupergroup {
  "@type": "chatStatisticsSupergroup";
  period: DateRange;
  member_count: StatisticalValue;
  message_count: StatisticalValue;
  viewer_count: StatisticalValue;
  sender_count: StatisticalValue;
  member_count_graph: StatisticalGraph;
  join_graph: StatisticalGraph;
  join_by_source_graph: StatisticalGraph;
  language_graph: StatisticalGraph;
  message_content_graph: StatisticalGraph;
  action_graph: StatisticalGraph;
  day_graph: StatisticalGraph;
  week_graph: StatisticalGraph;
  top_senders: Array<ChatStatisticsMessageSenderInfo>;
  top_administrators: Array<ChatStatisticsAdministratorActionsInfo>;
  top_inviters: Array<ChatStatisticsInviterInfo>;
}

export interface TdlibchatStatisticsChannel {
  "@type": "chatStatisticsChannel";
  period: DateRange;
  member_count: StatisticalValue;
  mean_message_view_count: StatisticalValue;
  mean_message_share_count: StatisticalValue;
  mean_message_reaction_count: StatisticalValue;
  mean_story_view_count: StatisticalValue;
  mean_story_share_count: StatisticalValue;
  mean_story_reaction_count: StatisticalValue;
  enabled_notifications_percentage: number;
  member_count_graph: StatisticalGraph;
  join_graph: StatisticalGraph;
  mute_graph: StatisticalGraph;
  view_count_by_hour_graph: StatisticalGraph;
  view_count_by_source_graph: StatisticalGraph;
  join_by_source_graph: StatisticalGraph;
  language_graph: StatisticalGraph;
  message_interaction_graph: StatisticalGraph;
  message_reaction_graph: StatisticalGraph;
  story_interaction_graph: StatisticalGraph;
  story_reaction_graph: StatisticalGraph;
  instant_view_interaction_graph: StatisticalGraph;
  recent_interactions: Array<ChatStatisticsInteractionInfo>;
}

export interface TdlibchatRevenueAmount {
  "@type": "chatRevenueAmount";
  cryptocurrency: string;
  total_amount: string;
  balance_amount: string;
  available_amount: string;
  withdrawal_enabled: boolean;
}

export interface TdlibchatRevenueStatistics {
  "@type": "chatRevenueStatistics";
  revenue_by_hour_graph: StatisticalGraph;
  revenue_graph: StatisticalGraph;
  revenue_amount: ChatRevenueAmount;
  usd_rate: number;
}

export interface TdlibmessageStatistics {
  "@type": "messageStatistics";
  message_interaction_graph: StatisticalGraph;
  message_reaction_graph: StatisticalGraph;
}

export interface TdlibstoryStatistics {
  "@type": "storyStatistics";
  story_interaction_graph: StatisticalGraph;
  story_reaction_graph: StatisticalGraph;
}


export interface TdlibrevenueWithdrawalStateSucceeded {
  "@type": "revenueWithdrawalStateSucceeded";
  date: number;
  url: string;
}



export interface TdlibchatRevenueTransactionTypeSponsoredMessageEarnings {
  "@type": "chatRevenueTransactionTypeSponsoredMessageEarnings";
  start_date: number;
  end_date: number;
}

export interface TdlibchatRevenueTransactionTypeSuggestedPostEarnings {
  "@type": "chatRevenueTransactionTypeSuggestedPostEarnings";
  user_id: number;
}

export interface TdlibchatRevenueTransactionTypeFragmentWithdrawal {
  "@type": "chatRevenueTransactionTypeFragmentWithdrawal";
  withdrawal_date: number;
  state: RevenueWithdrawalState;
}

export interface TdlibchatRevenueTransactionTypeFragmentRefund {
  "@type": "chatRevenueTransactionTypeFragmentRefund";
  refund_date: number;
}

export interface TdlibchatRevenueTransaction {
  "@type": "chatRevenueTransaction";
  cryptocurrency: string;
  cryptocurrency_amount: string;
  type: ChatRevenueTransactionType;
}

export interface TdlibchatRevenueTransactions {
  "@type": "chatRevenueTransactions";
  ton_amount: number;
  transactions: Array<ChatRevenueTransaction>;
  next_offset: string;
}

export interface TdlibstarRevenueStatus {
  "@type": "starRevenueStatus";
  total_amount: StarAmount;
  current_amount: StarAmount;
  available_amount: StarAmount;
  withdrawal_enabled: boolean;
  next_withdrawal_in: number;
}

export interface TdlibstarRevenueStatistics {
  "@type": "starRevenueStatistics";
  revenue_by_day_graph: StatisticalGraph;
  status: StarRevenueStatus;
  usd_rate: number;
}

export interface TdlibtonRevenueStatus {
  "@type": "tonRevenueStatus";
  total_amount: string;
  balance_amount: string;
  available_amount: string;
  withdrawal_enabled: boolean;
}

export interface TdlibtonRevenueStatistics {
  "@type": "tonRevenueStatistics";
  revenue_by_day_graph: StatisticalGraph;
  status: TonRevenueStatus;
  usd_rate: number;
}

export interface Tdlibpoint {
  "@type": "point";
  x: number;
  y: number;
}

export interface TdlibvectorPathCommandLine {
  "@type": "vectorPathCommandLine";
  end_point: Point;
}

export interface TdlibvectorPathCommandCubicBezierCurve {
  "@type": "vectorPathCommandCubicBezierCurve";
  start_control_point: Point;
  end_control_point: Point;
  end_point: Point;
}





export interface TdlibbotCommandScopeChat {
  "@type": "botCommandScopeChat";
  chat_id: number;
}

export interface TdlibbotCommandScopeChatAdministrators {
  "@type": "botCommandScopeChatAdministrators";
  chat_id: number;
}

export interface TdlibbotCommandScopeChatMember {
  "@type": "botCommandScopeChatMember";
  chat_id: number;
  user_id: number;
}



export interface TdlibphoneNumberCodeTypeConfirmOwnership {
  "@type": "phoneNumberCodeTypeConfirmOwnership";
  hash: string;
}

export interface TdlibupdateAuthorizationState {
  "@type": "updateAuthorizationState";
  authorization_state: AuthorizationState;
}

export interface TdlibupdateNewMessage {
  "@type": "updateNewMessage";
  message: Message;
}

export interface TdlibupdateMessageSendAcknowledged {
  "@type": "updateMessageSendAcknowledged";
  chat_id: number;
  message_id: number;
}

export interface TdlibupdateMessageSendSucceeded {
  "@type": "updateMessageSendSucceeded";
  message: Message;
  old_message_id: number;
}

export interface TdlibupdateMessageSendFailed {
  "@type": "updateMessageSendFailed";
  message: Message;
  old_message_id: number;
  error: Error;
}

export interface TdlibupdateMessageContent {
  "@type": "updateMessageContent";
  chat_id: number;
  message_id: number;
  new_content: MessageContent;
}

export interface TdlibupdateMessageEdited {
  "@type": "updateMessageEdited";
  chat_id: number;
  message_id: number;
  edit_date: number;
  reply_markup: ReplyMarkup;
}

export interface TdlibupdateMessageIsPinned {
  "@type": "updateMessageIsPinned";
  chat_id: number;
  message_id: number;
  is_pinned: boolean;
}

export interface TdlibupdateMessageInteractionInfo {
  "@type": "updateMessageInteractionInfo";
  chat_id: number;
  message_id: number;
  interaction_info: MessageInteractionInfo;
}

export interface TdlibupdateMessageContentOpened {
  "@type": "updateMessageContentOpened";
  chat_id: number;
  message_id: number;
}

export interface TdlibupdateMessageMentionRead {
  "@type": "updateMessageMentionRead";
  chat_id: number;
  message_id: number;
  unread_mention_count: number;
}

export interface TdlibupdateMessageUnreadReactions {
  "@type": "updateMessageUnreadReactions";
  chat_id: number;
  message_id: number;
  unread_reactions: Array<UnreadReaction>;
  unread_reaction_count: number;
}

export interface TdlibupdateMessageFactCheck {
  "@type": "updateMessageFactCheck";
  chat_id: number;
  message_id: number;
  fact_check: FactCheck;
}

export interface TdlibupdateMessageSuggestedPostInfo {
  "@type": "updateMessageSuggestedPostInfo";
  chat_id: number;
  message_id: number;
  suggested_post_info: SuggestedPostInfo;
}

export interface TdlibupdateMessageLiveLocationViewed {
  "@type": "updateMessageLiveLocationViewed";
  chat_id: number;
  message_id: number;
}

export interface TdlibupdateVideoPublished {
  "@type": "updateVideoPublished";
  chat_id: number;
  message_id: number;
}

export interface TdlibupdateNewChat {
  "@type": "updateNewChat";
  chat: Chat;
}

export interface TdlibupdateChatTitle {
  "@type": "updateChatTitle";
  chat_id: number;
  title: string;
}

export interface TdlibupdateChatPhoto {
  "@type": "updateChatPhoto";
  chat_id: number;
  photo: ChatPhotoInfo;
}

export interface TdlibupdateChatAccentColors {
  "@type": "updateChatAccentColors";
  chat_id: number;
  accent_color_id: number;
  background_custom_emoji_id: string;
  upgraded_gift_colors: UpgradedGiftColors;
  profile_accent_color_id: number;
  profile_background_custom_emoji_id: string;
}

export interface TdlibupdateChatPermissions {
  "@type": "updateChatPermissions";
  chat_id: number;
  permissions: ChatPermissions;
}

export interface TdlibupdateChatLastMessage {
  "@type": "updateChatLastMessage";
  chat_id: number;
  last_message: Message;
  positions: Array<ChatPosition>;
}

export interface TdlibupdateChatPosition {
  "@type": "updateChatPosition";
  chat_id: number;
  position: ChatPosition;
}

export interface TdlibupdateChatAddedToList {
  "@type": "updateChatAddedToList";
  chat_id: number;
  chat_list: ChatList;
}

export interface TdlibupdateChatRemovedFromList {
  "@type": "updateChatRemovedFromList";
  chat_id: number;
  chat_list: ChatList;
}

export interface TdlibupdateChatReadInbox {
  "@type": "updateChatReadInbox";
  chat_id: number;
  last_read_inbox_message_id: number;
  unread_count: number;
}

export interface TdlibupdateChatReadOutbox {
  "@type": "updateChatReadOutbox";
  chat_id: number;
  last_read_outbox_message_id: number;
}

export interface TdlibupdateChatActionBar {
  "@type": "updateChatActionBar";
  chat_id: number;
  action_bar: ChatActionBar;
}

export interface TdlibupdateChatBusinessBotManageBar {
  "@type": "updateChatBusinessBotManageBar";
  chat_id: number;
  business_bot_manage_bar: BusinessBotManageBar;
}

export interface TdlibupdateChatAvailableReactions {
  "@type": "updateChatAvailableReactions";
  chat_id: number;
  available_reactions: ChatAvailableReactions;
}

export interface TdlibupdateChatDraftMessage {
  "@type": "updateChatDraftMessage";
  chat_id: number;
  draft_message: DraftMessage;
  positions: Array<ChatPosition>;
}

export interface TdlibupdateChatEmojiStatus {
  "@type": "updateChatEmojiStatus";
  chat_id: number;
  emoji_status: EmojiStatus;
}

export interface TdlibupdateChatMessageSender {
  "@type": "updateChatMessageSender";
  chat_id: number;
  message_sender_id: MessageSender;
}

export interface TdlibupdateChatMessageAutoDeleteTime {
  "@type": "updateChatMessageAutoDeleteTime";
  chat_id: number;
  message_auto_delete_time: number;
}

export interface TdlibupdateChatNotificationSettings {
  "@type": "updateChatNotificationSettings";
  chat_id: number;
  notification_settings: ChatNotificationSettings;
}

export interface TdlibupdateChatPendingJoinRequests {
  "@type": "updateChatPendingJoinRequests";
  chat_id: number;
  pending_join_requests: ChatJoinRequestsInfo;
}

export interface TdlibupdateChatReplyMarkup {
  "@type": "updateChatReplyMarkup";
  chat_id: number;
  reply_markup_message_id: number;
}

export interface TdlibupdateChatBackground {
  "@type": "updateChatBackground";
  chat_id: number;
  background: ChatBackground;
}

export interface TdlibupdateChatTheme {
  "@type": "updateChatTheme";
  chat_id: number;
  theme: ChatTheme;
}

export interface TdlibupdateChatUnreadMentionCount {
  "@type": "updateChatUnreadMentionCount";
  chat_id: number;
  unread_mention_count: number;
}

export interface TdlibupdateChatUnreadReactionCount {
  "@type": "updateChatUnreadReactionCount";
  chat_id: number;
  unread_reaction_count: number;
}

export interface TdlibupdateChatVideoChat {
  "@type": "updateChatVideoChat";
  chat_id: number;
  video_chat: VideoChat;
}

export interface TdlibupdateChatDefaultDisableNotification {
  "@type": "updateChatDefaultDisableNotification";
  chat_id: number;
  default_disable_notification: boolean;
}

export interface TdlibupdateChatHasProtectedContent {
  "@type": "updateChatHasProtectedContent";
  chat_id: number;
  has_protected_content: boolean;
}

export interface TdlibupdateChatIsTranslatable {
  "@type": "updateChatIsTranslatable";
  chat_id: number;
  is_translatable: boolean;
}

export interface TdlibupdateChatIsMarkedAsUnread {
  "@type": "updateChatIsMarkedAsUnread";
  chat_id: number;
  is_marked_as_unread: boolean;
}

export interface TdlibupdateChatViewAsTopics {
  "@type": "updateChatViewAsTopics";
  chat_id: number;
  view_as_topics: boolean;
}

export interface TdlibupdateChatBlockList {
  "@type": "updateChatBlockList";
  chat_id: number;
  block_list: BlockList;
}

export interface TdlibupdateChatHasScheduledMessages {
  "@type": "updateChatHasScheduledMessages";
  chat_id: number;
  has_scheduled_messages: boolean;
}

export interface TdlibupdateChatFolders {
  "@type": "updateChatFolders";
  chat_folders: Array<ChatFolderInfo>;
  main_chat_list_position: number;
  are_tags_enabled: boolean;
}

export interface TdlibupdateChatOnlineMemberCount {
  "@type": "updateChatOnlineMemberCount";
  chat_id: number;
  online_member_count: number;
}

export interface TdlibupdateSavedMessagesTopic {
  "@type": "updateSavedMessagesTopic";
  topic: SavedMessagesTopic;
}

export interface TdlibupdateSavedMessagesTopicCount {
  "@type": "updateSavedMessagesTopicCount";
  topic_count: number;
}

export interface TdlibupdateDirectMessagesChatTopic {
  "@type": "updateDirectMessagesChatTopic";
  topic: DirectMessagesChatTopic;
}

export interface TdlibupdateTopicMessageCount {
  "@type": "updateTopicMessageCount";
  chat_id: number;
  topic_id: MessageTopic;
  message_count: number;
}

export interface TdlibupdateQuickReplyShortcut {
  "@type": "updateQuickReplyShortcut";
  shortcut: QuickReplyShortcut;
}

export interface TdlibupdateQuickReplyShortcutDeleted {
  "@type": "updateQuickReplyShortcutDeleted";
  shortcut_id: number;
}

export interface TdlibupdateQuickReplyShortcuts {
  "@type": "updateQuickReplyShortcuts";
  shortcut_ids: Array<number>;
}

export interface TdlibupdateQuickReplyShortcutMessages {
  "@type": "updateQuickReplyShortcutMessages";
  shortcut_id: number;
  messages: Array<QuickReplyMessage>;
}

export interface TdlibupdateForumTopicInfo {
  "@type": "updateForumTopicInfo";
  info: ForumTopicInfo;
}

export interface TdlibupdateForumTopic {
  "@type": "updateForumTopic";
  chat_id: number;
  forum_topic_id: number;
  is_pinned: boolean;
  last_read_inbox_message_id: number;
  last_read_outbox_message_id: number;
  unread_mention_count: number;
  unread_reaction_count: number;
  notification_settings: ChatNotificationSettings;
  draft_message: DraftMessage;
}

export interface TdlibupdateScopeNotificationSettings {
  "@type": "updateScopeNotificationSettings";
  scope: NotificationSettingsScope;
  notification_settings: ScopeNotificationSettings;
}

export interface TdlibupdateReactionNotificationSettings {
  "@type": "updateReactionNotificationSettings";
  notification_settings: ReactionNotificationSettings;
}

export interface TdlibupdateNotification {
  "@type": "updateNotification";
  notification_group_id: number;
  notification: Notification;
}

export interface TdlibupdateNotificationGroup {
  "@type": "updateNotificationGroup";
  notification_group_id: number;
  type: NotificationGroupType;
  chat_id: number;
  notification_settings_chat_id: number;
  notification_sound_id: string;
  total_count: number;
  added_notifications: Array<Notification>;
  removed_notification_ids: Array<number>;
}

export interface TdlibupdateActiveNotifications {
  "@type": "updateActiveNotifications";
  groups: Array<NotificationGroup>;
}

export interface TdlibupdateHavePendingNotifications {
  "@type": "updateHavePendingNotifications";
  have_delayed_notifications: boolean;
  have_unreceived_notifications: boolean;
}

export interface TdlibupdateDeleteMessages {
  "@type": "updateDeleteMessages";
  chat_id: number;
  message_ids: Array<number>;
  is_permanent: boolean;
  from_cache: boolean;
}

export interface TdlibupdateChatAction {
  "@type": "updateChatAction";
  chat_id: number;
  topic_id: MessageTopic;
  sender_id: MessageSender;
  action: ChatAction;
}

export interface TdlibupdatePendingTextMessage {
  "@type": "updatePendingTextMessage";
  chat_id: number;
  forum_topic_id: number;
  draft_id: string;
  text: FormattedText;
}

export interface TdlibupdateUserStatus {
  "@type": "updateUserStatus";
  user_id: number;
  status: UserStatus;
}

export interface TdlibupdateUser {
  "@type": "updateUser";
  user: User;
}

export interface TdlibupdateBasicGroup {
  "@type": "updateBasicGroup";
  basic_group: BasicGroup;
}

export interface TdlibupdateSupergroup {
  "@type": "updateSupergroup";
  supergroup: Supergroup;
}

export interface TdlibupdateSecretChat {
  "@type": "updateSecretChat";
  secret_chat: SecretChat;
}

export interface TdlibupdateUserFullInfo {
  "@type": "updateUserFullInfo";
  user_id: number;
  user_full_info: UserFullInfo;
}

export interface TdlibupdateBasicGroupFullInfo {
  "@type": "updateBasicGroupFullInfo";
  basic_group_id: number;
  basic_group_full_info: BasicGroupFullInfo;
}

export interface TdlibupdateSupergroupFullInfo {
  "@type": "updateSupergroupFullInfo";
  supergroup_id: number;
  supergroup_full_info: SupergroupFullInfo;
}

export interface TdlibupdateServiceNotification {
  "@type": "updateServiceNotification";
  type: string;
  content: MessageContent;
}

export interface TdlibupdateFile {
  "@type": "updateFile";
  file: File;
}

export interface TdlibupdateFileGenerationStart {
  "@type": "updateFileGenerationStart";
  generation_id: string;
  original_path: string;
  destination_path: string;
  conversion: string;
}

export interface TdlibupdateFileGenerationStop {
  "@type": "updateFileGenerationStop";
  generation_id: string;
}

export interface TdlibupdateFileDownloads {
  "@type": "updateFileDownloads";
  total_size: number;
  total_count: number;
  downloaded_size: number;
}

export interface TdlibupdateFileAddedToDownloads {
  "@type": "updateFileAddedToDownloads";
  file_download: FileDownload;
  counts: DownloadedFileCounts;
}

export interface TdlibupdateFileDownload {
  "@type": "updateFileDownload";
  file_id: number;
  complete_date: number;
  is_paused: boolean;
  counts: DownloadedFileCounts;
}

export interface TdlibupdateFileRemovedFromDownloads {
  "@type": "updateFileRemovedFromDownloads";
  file_id: number;
  counts: DownloadedFileCounts;
}

export interface TdlibupdateApplicationVerificationRequired {
  "@type": "updateApplicationVerificationRequired";
  verification_id: number;
  nonce: string;
  cloud_project_number: string;
}

export interface TdlibupdateApplicationRecaptchaVerificationRequired {
  "@type": "updateApplicationRecaptchaVerificationRequired";
  verification_id: number;
  action: string;
  recaptcha_key_id: string;
}

export interface TdlibupdateCall {
  "@type": "updateCall";
  call: Call;
}

export interface TdlibupdateGroupCall {
  "@type": "updateGroupCall";
  group_call: GroupCall;
}

export interface TdlibupdateGroupCallParticipant {
  "@type": "updateGroupCallParticipant";
  group_call_id: number;
  participant: GroupCallParticipant;
}

export interface TdlibupdateGroupCallParticipants {
  "@type": "updateGroupCallParticipants";
  group_call_id: number;
  participant_user_ids: Array<string>;
}

export interface TdlibupdateGroupCallVerificationState {
  "@type": "updateGroupCallVerificationState";
  group_call_id: number;
  generation: number;
  emojis: Array<string>;
}

export interface TdlibupdateNewGroupCallMessage {
  "@type": "updateNewGroupCallMessage";
  group_call_id: number;
  message: GroupCallMessage;
}

export interface TdlibupdateNewGroupCallPaidReaction {
  "@type": "updateNewGroupCallPaidReaction";
  group_call_id: number;
  sender_id: MessageSender;
  star_count: number;
}

export interface TdlibupdateGroupCallMessageSendFailed {
  "@type": "updateGroupCallMessageSendFailed";
  group_call_id: number;
  message_id: number;
  error: Error;
}

export interface TdlibupdateGroupCallMessagesDeleted {
  "@type": "updateGroupCallMessagesDeleted";
  group_call_id: number;
  message_ids: Array<number>;
}

export interface TdlibupdateLiveStoryTopDonors {
  "@type": "updateLiveStoryTopDonors";
  group_call_id: number;
  donors: LiveStoryDonors;
}

export interface TdlibupdateNewCallSignalingData {
  "@type": "updateNewCallSignalingData";
  call_id: number;
  data: string;
}

export interface TdlibupdateGiftAuctionState {
  "@type": "updateGiftAuctionState";
  state: GiftAuctionState;
}

export interface TdlibupdateActiveGiftAuctions {
  "@type": "updateActiveGiftAuctions";
  states: Array<GiftAuctionState>;
}

export interface TdlibupdateUserPrivacySettingRules {
  "@type": "updateUserPrivacySettingRules";
  setting: UserPrivacySetting;
  rules: UserPrivacySettingRules;
}

export interface TdlibupdateUnreadMessageCount {
  "@type": "updateUnreadMessageCount";
  chat_list: ChatList;
  unread_count: number;
  unread_unmuted_count: number;
}

export interface TdlibupdateUnreadChatCount {
  "@type": "updateUnreadChatCount";
  chat_list: ChatList;
  total_count: number;
  unread_count: number;
  unread_unmuted_count: number;
  marked_as_unread_count: number;
  marked_as_unread_unmuted_count: number;
}

export interface TdlibupdateStory {
  "@type": "updateStory";
  story: Story;
}

export interface TdlibupdateStoryDeleted {
  "@type": "updateStoryDeleted";
  story_poster_chat_id: number;
  story_id: number;
}

export interface TdlibupdateStoryPostSucceeded {
  "@type": "updateStoryPostSucceeded";
  story: Story;
  old_story_id: number;
}

export interface TdlibupdateStoryPostFailed {
  "@type": "updateStoryPostFailed";
  story: Story;
  error: Error;
  error_type: CanPostStoryResult;
}

export interface TdlibupdateChatActiveStories {
  "@type": "updateChatActiveStories";
  active_stories: ChatActiveStories;
}

export interface TdlibupdateStoryListChatCount {
  "@type": "updateStoryListChatCount";
  story_list: StoryList;
  chat_count: number;
}

export interface TdlibupdateStoryStealthMode {
  "@type": "updateStoryStealthMode";
  active_until_date: number;
  cooldown_until_date: number;
}

export interface TdlibupdateTrustedMiniAppBots {
  "@type": "updateTrustedMiniAppBots";
  bot_user_ids: Array<number>;
}

export interface TdlibupdateOption {
  "@type": "updateOption";
  name: string;
  value: OptionValue;
}

export interface TdlibupdateStickerSet {
  "@type": "updateStickerSet";
  sticker_set: StickerSet;
}

export interface TdlibupdateInstalledStickerSets {
  "@type": "updateInstalledStickerSets";
  sticker_type: StickerType;
  sticker_set_ids: Array<string>;
}

export interface TdlibupdateTrendingStickerSets {
  "@type": "updateTrendingStickerSets";
  sticker_type: StickerType;
  sticker_sets: TrendingStickerSets;
}

export interface TdlibupdateRecentStickers {
  "@type": "updateRecentStickers";
  is_attached: boolean;
  sticker_ids: Array<number>;
}

export interface TdlibupdateFavoriteStickers {
  "@type": "updateFavoriteStickers";
  sticker_ids: Array<number>;
}

export interface TdlibupdateSavedAnimations {
  "@type": "updateSavedAnimations";
  animation_ids: Array<number>;
}

export interface TdlibupdateSavedNotificationSounds {
  "@type": "updateSavedNotificationSounds";
  notification_sound_ids: Array<string>;
}

export interface TdlibupdateDefaultBackground {
  "@type": "updateDefaultBackground";
  for_dark_theme: boolean;
  background: Background;
}

export interface TdlibupdateEmojiChatThemes {
  "@type": "updateEmojiChatThemes";
  chat_themes: Array<EmojiChatTheme>;
}

export interface TdlibupdateAccentColors {
  "@type": "updateAccentColors";
  colors: Array<AccentColor>;
  available_accent_color_ids: Array<number>;
}

export interface TdlibupdateProfileAccentColors {
  "@type": "updateProfileAccentColors";
  colors: Array<ProfileAccentColor>;
  available_accent_color_ids: Array<number>;
}

export interface TdlibupdateLanguagePackStrings {
  "@type": "updateLanguagePackStrings";
  localization_target: string;
  language_pack_id: string;
  strings: Array<LanguagePackString>;
}

export interface TdlibupdateConnectionState {
  "@type": "updateConnectionState";
  state: ConnectionState;
}

export interface TdlibupdateFreezeState {
  "@type": "updateFreezeState";
  is_frozen: boolean;
  freezing_date: number;
  deletion_date: number;
  appeal_link: string;
}

export interface TdlibupdateAgeVerificationParameters {
  "@type": "updateAgeVerificationParameters";
  parameters: AgeVerificationParameters;
}

export interface TdlibupdateTermsOfService {
  "@type": "updateTermsOfService";
  terms_of_service_id: string;
  terms_of_service: TermsOfService;
}

export interface TdlibupdateUnconfirmedSession {
  "@type": "updateUnconfirmedSession";
  session: UnconfirmedSession;
}

export interface TdlibupdateAttachmentMenuBots {
  "@type": "updateAttachmentMenuBots";
  bots: Array<AttachmentMenuBot>;
}

export interface TdlibupdateWebAppMessageSent {
  "@type": "updateWebAppMessageSent";
  web_app_launch_id: string;
}

export interface TdlibupdateActiveEmojiReactions {
  "@type": "updateActiveEmojiReactions";
  emojis: Array<string>;
}

export interface TdlibupdateAvailableMessageEffects {
  "@type": "updateAvailableMessageEffects";
  reaction_effect_ids: Array<string>;
  sticker_effect_ids: Array<string>;
}

export interface TdlibupdateDefaultReactionType {
  "@type": "updateDefaultReactionType";
  reaction_type: ReactionType;
}

export interface TdlibupdateDefaultPaidReactionType {
  "@type": "updateDefaultPaidReactionType";
  type: PaidReactionType;
}

export interface TdlibupdateSavedMessagesTags {
  "@type": "updateSavedMessagesTags";
  saved_messages_topic_id: number;
  tags: SavedMessagesTags;
}

export interface TdlibupdateActiveLiveLocationMessages {
  "@type": "updateActiveLiveLocationMessages";
  messages: Array<Message>;
}

export interface TdlibupdateOwnedStarCount {
  "@type": "updateOwnedStarCount";
  star_amount: StarAmount;
}

export interface TdlibupdateOwnedTonCount {
  "@type": "updateOwnedTonCount";
  ton_amount: number;
}

export interface TdlibupdateChatRevenueAmount {
  "@type": "updateChatRevenueAmount";
  chat_id: number;
  revenue_amount: ChatRevenueAmount;
}

export interface TdlibupdateStarRevenueStatus {
  "@type": "updateStarRevenueStatus";
  owner_id: MessageSender;
  status: StarRevenueStatus;
}

export interface TdlibupdateTonRevenueStatus {
  "@type": "updateTonRevenueStatus";
  status: TonRevenueStatus;
}

export interface TdlibupdateSpeechRecognitionTrial {
  "@type": "updateSpeechRecognitionTrial";
  max_media_duration: number;
  weekly_count: number;
  left_count: number;
  next_reset_date: number;
}

export interface TdlibupdateGroupCallMessageLevels {
  "@type": "updateGroupCallMessageLevels";
  levels: Array<GroupCallMessageLevel>;
}

export interface TdlibupdateDiceEmojis {
  "@type": "updateDiceEmojis";
  emojis: Array<string>;
}

export interface TdlibupdateStakeDiceState {
  "@type": "updateStakeDiceState";
  state: StakeDiceState;
}

export interface TdlibupdateAnimatedEmojiMessageClicked {
  "@type": "updateAnimatedEmojiMessageClicked";
  chat_id: number;
  message_id: number;
  sticker: Sticker;
}

export interface TdlibupdateAnimationSearchParameters {
  "@type": "updateAnimationSearchParameters";
  provider: string;
  emojis: Array<string>;
}

export interface TdlibupdateSuggestedActions {
  "@type": "updateSuggestedActions";
  added_actions: Array<SuggestedAction>;
  removed_actions: Array<SuggestedAction>;
}

export interface TdlibupdateSpeedLimitNotification {
  "@type": "updateSpeedLimitNotification";
  is_upload: boolean;
}

export interface TdlibupdateContactCloseBirthdays {
  "@type": "updateContactCloseBirthdays";
  close_birthday_users: Array<CloseBirthdayUser>;
}

export interface TdlibupdateAutosaveSettings {
  "@type": "updateAutosaveSettings";
  scope: AutosaveSettingsScope;
  settings: ScopeAutosaveSettings;
}

export interface TdlibupdateBusinessConnection {
  "@type": "updateBusinessConnection";
  connection: BusinessConnection;
}

export interface TdlibupdateNewBusinessMessage {
  "@type": "updateNewBusinessMessage";
  connection_id: string;
  message: BusinessMessage;
}

export interface TdlibupdateBusinessMessageEdited {
  "@type": "updateBusinessMessageEdited";
  connection_id: string;
  message: BusinessMessage;
}

export interface TdlibupdateBusinessMessagesDeleted {
  "@type": "updateBusinessMessagesDeleted";
  connection_id: string;
  chat_id: number;
  message_ids: Array<number>;
}

export interface TdlibupdateNewInlineQuery {
  "@type": "updateNewInlineQuery";
  id: string;
  sender_user_id: number;
  user_location: Location;
  chat_type: ChatType;
  query: string;
  offset: string;
}

export interface TdlibupdateNewChosenInlineResult {
  "@type": "updateNewChosenInlineResult";
  sender_user_id: number;
  user_location: Location;
  query: string;
  result_id: string;
  inline_message_id: string;
}

export interface TdlibupdateNewCallbackQuery {
  "@type": "updateNewCallbackQuery";
  id: string;
  sender_user_id: number;
  chat_id: number;
  message_id: number;
  chat_instance: string;
  payload: CallbackQueryPayload;
}

export interface TdlibupdateNewInlineCallbackQuery {
  "@type": "updateNewInlineCallbackQuery";
  id: string;
  sender_user_id: number;
  inline_message_id: string;
  chat_instance: string;
  payload: CallbackQueryPayload;
}

export interface TdlibupdateNewBusinessCallbackQuery {
  "@type": "updateNewBusinessCallbackQuery";
  id: string;
  sender_user_id: number;
  connection_id: string;
  message: BusinessMessage;
  chat_instance: string;
  payload: CallbackQueryPayload;
}

export interface TdlibupdateNewShippingQuery {
  "@type": "updateNewShippingQuery";
  id: string;
  sender_user_id: number;
  invoice_payload: string;
  shipping_address: Address;
}

export interface TdlibupdateNewPreCheckoutQuery {
  "@type": "updateNewPreCheckoutQuery";
  id: string;
  sender_user_id: number;
  currency: string;
  total_amount: number;
  invoice_payload: string;
  shipping_option_id: string;
  order_info: OrderInfo;
}

export interface TdlibupdateNewCustomEvent {
  "@type": "updateNewCustomEvent";
  event: string;
}

export interface TdlibupdateNewCustomQuery {
  "@type": "updateNewCustomQuery";
  id: string;
  data: string;
  timeout: number;
}

export interface TdlibupdatePoll {
  "@type": "updatePoll";
  poll: Poll;
}

export interface TdlibupdatePollAnswer {
  "@type": "updatePollAnswer";
  poll_id: string;
  voter_id: MessageSender;
  option_ids: Array<number>;
}

export interface TdlibupdateChatMember {
  "@type": "updateChatMember";
  chat_id: number;
  actor_user_id: number;
  date: number;
  invite_link: ChatInviteLink;
  via_join_request: boolean;
  via_chat_folder_invite_link: boolean;
  old_chat_member: ChatMember;
  new_chat_member: ChatMember;
}

export interface TdlibupdateNewChatJoinRequest {
  "@type": "updateNewChatJoinRequest";
  chat_id: number;
  request: ChatJoinRequest;
  user_chat_id: number;
  invite_link: ChatInviteLink;
}

export interface TdlibupdateChatBoost {
  "@type": "updateChatBoost";
  chat_id: number;
  boost: ChatBoost;
}

export interface TdlibupdateMessageReaction {
  "@type": "updateMessageReaction";
  chat_id: number;
  message_id: number;
  actor_id: MessageSender;
  date: number;
  old_reaction_types: Array<ReactionType>;
  new_reaction_types: Array<ReactionType>;
}

export interface TdlibupdateMessageReactions {
  "@type": "updateMessageReactions";
  chat_id: number;
  message_id: number;
  date: number;
  reactions: Array<MessageReaction>;
}

export interface TdlibupdatePaidMediaPurchased {
  "@type": "updatePaidMediaPurchased";
  user_id: number;
  payload: string;
}

export interface Tdlibupdates {
  "@type": "updates";
  updates: Array<Update>;
}


export interface TdliblogStreamFile {
  "@type": "logStreamFile";
  path: string;
  max_file_size: number;
  redirect_stderr: boolean;
}


export interface TdliblogVerbosityLevel {
  "@type": "logVerbosityLevel";
  verbosity_level: number;
}

export interface TdliblogTags {
  "@type": "logTags";
  tags: Array<string>;
}

export interface TdlibuserSupportInfo {
  "@type": "userSupportInfo";
  message: FormattedText;
  author: string;
  date: number;
}

export interface TdlibtestInt {
  "@type": "testInt";
  value: number;
}

export interface TdlibtestString {
  "@type": "testString";
  value: string;
}

export interface TdlibtestBytes {
  "@type": "testBytes";
  value: string;
}

export interface TdlibtestVectorInt {
  "@type": "testVectorInt";
  value: Array<number>;
}

export interface TdlibtestVectorIntObject {
  "@type": "testVectorIntObject";
  value: Array<TestInt>;
}

export interface TdlibtestVectorString {
  "@type": "testVectorString";
  value: Array<string>;
}

export interface TdlibtestVectorStringObject {
  "@type": "testVectorStringObject";
  value: Array<TestString>;
}



export interface TdlibconfirmQrCodeAuthentication {
  "@type": "confirmQrCodeAuthentication";
  link: string;
}



export interface TdlibsetPassword {
  "@type": "setPassword";
  old_password: string;
  new_password: string;
  new_hint: string;
  set_recovery_email_address: boolean;
  new_recovery_email_address: string;
}

export interface TdlibsetLoginEmailAddress {
  "@type": "setLoginEmailAddress";
  new_login_email_address: string;
}


export interface TdlibgetRecoveryEmailAddress {
  "@type": "getRecoveryEmailAddress";
  password: string;
}

export interface TdlibsetRecoveryEmailAddress {
  "@type": "setRecoveryEmailAddress";
  password: string;
  new_recovery_email_address: string;
}

export interface TdlibcheckRecoveryEmailAddressCode {
  "@type": "checkRecoveryEmailAddressCode";
  code: string;
}




export interface TdlibrecoverPassword {
  "@type": "recoverPassword";
  recovery_code: string;
  new_password: string;
  new_hint: string;
}


export interface TdlibcreateTemporaryPassword {
  "@type": "createTemporaryPassword";
  password: string;
  valid_for: number;
}



export interface TdlibgetUser {
  "@type": "getUser";
  user_id: number;
}

export interface TdlibgetUserFullInfo {
  "@type": "getUserFullInfo";
  user_id: number;
}

export interface TdlibgetBasicGroup {
  "@type": "getBasicGroup";
  basic_group_id: number;
}

export interface TdlibgetBasicGroupFullInfo {
  "@type": "getBasicGroupFullInfo";
  basic_group_id: number;
}

export interface TdlibgetSupergroup {
  "@type": "getSupergroup";
  supergroup_id: number;
}

export interface TdlibgetSupergroupFullInfo {
  "@type": "getSupergroupFullInfo";
  supergroup_id: number;
}

export interface TdlibgetSecretChat {
  "@type": "getSecretChat";
  secret_chat_id: number;
}

export interface TdlibgetChat {
  "@type": "getChat";
  chat_id: number;
}

export interface TdlibgetMessage {
  "@type": "getMessage";
  chat_id: number;
  message_id: number;
}

export interface TdlibgetMessageLocally {
  "@type": "getMessageLocally";
  chat_id: number;
  message_id: number;
}

export interface TdlibgetRepliedMessage {
  "@type": "getRepliedMessage";
  chat_id: number;
  message_id: number;
}

export interface TdlibgetChatPinnedMessage {
  "@type": "getChatPinnedMessage";
  chat_id: number;
}

export interface TdlibgetCallbackQueryMessage {
  "@type": "getCallbackQueryMessage";
  chat_id: number;
  message_id: number;
  callback_query_id: string;
}

export interface TdlibgetMessages {
  "@type": "getMessages";
  chat_id: number;
  message_ids: Array<number>;
}

export interface TdlibgetMessageProperties {
  "@type": "getMessageProperties";
  chat_id: number;
  message_id: number;
}

export interface TdlibgetMessageThread {
  "@type": "getMessageThread";
  chat_id: number;
  message_id: number;
}

export interface TdlibgetMessageReadDate {
  "@type": "getMessageReadDate";
  chat_id: number;
  message_id: number;
}

export interface TdlibgetMessageViewers {
  "@type": "getMessageViewers";
  chat_id: number;
  message_id: number;
}

export interface TdlibgetMessageAuthor {
  "@type": "getMessageAuthor";
  chat_id: number;
  message_id: number;
}

export interface TdlibgetFile {
  "@type": "getFile";
  file_id: number;
}

export interface TdlibgetRemoteFile {
  "@type": "getRemoteFile";
  remote_file_id: string;
  file_type: FileType;
}

export interface TdlibgetChats {
  "@type": "getChats";
  chat_list: ChatList;
  limit: number;
}

export interface TdlibsearchPublicChat {
  "@type": "searchPublicChat";
  username: string;
}

export interface TdlibsearchPublicChats {
  "@type": "searchPublicChats";
  query: string;
}

export interface TdlibsearchChats {
  "@type": "searchChats";
  query: string;
  limit: number;
}

export interface TdlibsearchChatsOnServer {
  "@type": "searchChatsOnServer";
  query: string;
  limit: number;
}


export interface TdlibgetChatSimilarChats {
  "@type": "getChatSimilarChats";
  chat_id: number;
}

export interface TdlibgetChatSimilarChatCount {
  "@type": "getChatSimilarChatCount";
  chat_id: number;
  return_local: boolean;
}

export interface TdlibgetBotSimilarBots {
  "@type": "getBotSimilarBots";
  bot_user_id: number;
}

export interface TdlibgetBotSimilarBotCount {
  "@type": "getBotSimilarBotCount";
  bot_user_id: number;
  return_local: boolean;
}

export interface TdlibgetTopChats {
  "@type": "getTopChats";
  category: TopChatCategory;
  limit: number;
}

export interface TdlibsearchRecentlyFoundChats {
  "@type": "searchRecentlyFoundChats";
  query: string;
  limit: number;
}

export interface TdlibgetRecentlyOpenedChats {
  "@type": "getRecentlyOpenedChats";
  limit: number;
}

export interface TdlibcheckChatUsername {
  "@type": "checkChatUsername";
  chat_id: number;
  username: string;
}

export interface TdlibgetCreatedPublicChats {
  "@type": "getCreatedPublicChats";
  type: PublicChatType;
}




export interface TdlibgetDirectMessagesChatTopic {
  "@type": "getDirectMessagesChatTopic";
  chat_id: number;
  topic_id: number;
}

export interface TdlibgetDirectMessagesChatTopicHistory {
  "@type": "getDirectMessagesChatTopicHistory";
  chat_id: number;
  topic_id: number;
  from_message_id: number;
  offset: number;
  limit: number;
}

export interface TdlibgetDirectMessagesChatTopicMessageByDate {
  "@type": "getDirectMessagesChatTopicMessageByDate";
  chat_id: number;
  topic_id: number;
  date: number;
}

export interface TdlibgetDirectMessagesChatTopicRevenue {
  "@type": "getDirectMessagesChatTopicRevenue";
  chat_id: number;
  topic_id: number;
}

export interface TdlibgetSavedMessagesTopicHistory {
  "@type": "getSavedMessagesTopicHistory";
  saved_messages_topic_id: number;
  from_message_id: number;
  offset: number;
  limit: number;
}

export interface TdlibgetSavedMessagesTopicMessageByDate {
  "@type": "getSavedMessagesTopicMessageByDate";
  saved_messages_topic_id: number;
  date: number;
}

export interface TdlibgetGroupsInCommon {
  "@type": "getGroupsInCommon";
  user_id: number;
  offset_chat_id: number;
  limit: number;
}

export interface TdlibgetChatHistory {
  "@type": "getChatHistory";
  chat_id: number;
  from_message_id: number;
  offset: number;
  limit: number;
  only_local: boolean;
}

export interface TdlibgetMessageThreadHistory {
  "@type": "getMessageThreadHistory";
  chat_id: number;
  message_id: number;
  from_message_id: number;
  offset: number;
  limit: number;
}

export interface TdlibsearchChatMessages {
  "@type": "searchChatMessages";
  chat_id: number;
  topic_id: MessageTopic;
  query: string;
  sender_id: MessageSender;
  from_message_id: number;
  offset: number;
  limit: number;
  filter: SearchMessagesFilter;
}

export interface TdlibsearchMessages {
  "@type": "searchMessages";
  chat_list: ChatList;
  query: string;
  offset: string;
  limit: number;
  filter: SearchMessagesFilter;
  chat_type_filter: SearchMessagesChatTypeFilter;
  min_date: number;
  max_date: number;
}

export interface TdlibsearchSecretMessages {
  "@type": "searchSecretMessages";
  chat_id: number;
  query: string;
  offset: string;
  limit: number;
  filter: SearchMessagesFilter;
}

export interface TdlibsearchSavedMessages {
  "@type": "searchSavedMessages";
  saved_messages_topic_id: number;
  tag: ReactionType;
  query: string;
  from_message_id: number;
  offset: number;
  limit: number;
}

export interface TdlibsearchCallMessages {
  "@type": "searchCallMessages";
  offset: string;
  limit: number;
  only_missed: boolean;
}

export interface TdlibsearchOutgoingDocumentMessages {
  "@type": "searchOutgoingDocumentMessages";
  query: string;
  limit: number;
}

export interface TdlibgetPublicPostSearchLimits {
  "@type": "getPublicPostSearchLimits";
  query: string;
}

export interface TdlibsearchPublicPosts {
  "@type": "searchPublicPosts";
  query: string;
  offset: string;
  limit: number;
  star_count: number;
}

export interface TdlibsearchPublicMessagesByTag {
  "@type": "searchPublicMessagesByTag";
  tag: string;
  offset: string;
  limit: number;
}

export interface TdlibsearchPublicStoriesByTag {
  "@type": "searchPublicStoriesByTag";
  story_poster_chat_id: number;
  tag: string;
  offset: string;
  limit: number;
}

export interface TdlibsearchPublicStoriesByLocation {
  "@type": "searchPublicStoriesByLocation";
  address: LocationAddress;
  offset: string;
  limit: number;
}

export interface TdlibsearchPublicStoriesByVenue {
  "@type": "searchPublicStoriesByVenue";
  venue_provider: string;
  venue_id: string;
  offset: string;
  limit: number;
}

export interface TdlibgetSearchedForTags {
  "@type": "getSearchedForTags";
  tag_prefix: string;
  limit: number;
}

export interface TdlibsearchChatRecentLocationMessages {
  "@type": "searchChatRecentLocationMessages";
  chat_id: number;
  limit: number;
}

export interface TdlibgetChatMessageByDate {
  "@type": "getChatMessageByDate";
  chat_id: number;
  date: number;
}

export interface TdlibgetChatSparseMessagePositions {
  "@type": "getChatSparseMessagePositions";
  chat_id: number;
  filter: SearchMessagesFilter;
  from_message_id: number;
  limit: number;
  saved_messages_topic_id: number;
}

export interface TdlibgetChatMessageCalendar {
  "@type": "getChatMessageCalendar";
  chat_id: number;
  topic_id: MessageTopic;
  filter: SearchMessagesFilter;
  from_message_id: number;
}

export interface TdlibgetChatMessageCount {
  "@type": "getChatMessageCount";
  chat_id: number;
  topic_id: MessageTopic;
  filter: SearchMessagesFilter;
  return_local: boolean;
}

export interface TdlibgetChatMessagePosition {
  "@type": "getChatMessagePosition";
  chat_id: number;
  topic_id: MessageTopic;
  filter: SearchMessagesFilter;
  message_id: number;
}

export interface TdlibgetChatScheduledMessages {
  "@type": "getChatScheduledMessages";
  chat_id: number;
}

export interface TdlibgetChatSponsoredMessages {
  "@type": "getChatSponsoredMessages";
  chat_id: number;
}

export interface TdlibreportChatSponsoredMessage {
  "@type": "reportChatSponsoredMessage";
  chat_id: number;
  message_id: number;
  option_id: string;
}

export interface TdlibgetSearchSponsoredChats {
  "@type": "getSearchSponsoredChats";
  query: string;
}

export interface TdlibreportSponsoredChat {
  "@type": "reportSponsoredChat";
  sponsored_chat_unique_id: number;
  option_id: string;
}

export interface TdlibgetVideoMessageAdvertisements {
  "@type": "getVideoMessageAdvertisements";
  chat_id: number;
  message_id: number;
}

export interface TdlibreportVideoMessageAdvertisement {
  "@type": "reportVideoMessageAdvertisement";
  advertisement_unique_id: number;
  option_id: string;
}

export interface TdlibgetMessageLink {
  "@type": "getMessageLink";
  chat_id: number;
  message_id: number;
  media_timestamp: number;
  for_album: boolean;
  in_message_thread: boolean;
}

export interface TdlibgetMessageEmbeddingCode {
  "@type": "getMessageEmbeddingCode";
  chat_id: number;
  message_id: number;
  for_album: boolean;
}

export interface TdlibgetMessageLinkInfo {
  "@type": "getMessageLinkInfo";
  url: string;
}

export interface TdlibtranslateText {
  "@type": "translateText";
  text: FormattedText;
  to_language_code: string;
}

export interface TdlibtranslateMessageText {
  "@type": "translateMessageText";
  chat_id: number;
  message_id: number;
  to_language_code: string;
}

export interface TdlibsummarizeMessage {
  "@type": "summarizeMessage";
  chat_id: number;
  message_id: number;
  translate_to_language_code: string;
}

export interface TdlibgetChatAvailableMessageSenders {
  "@type": "getChatAvailableMessageSenders";
  chat_id: number;
}

export interface TdlibsendMessage {
  "@type": "sendMessage";
  chat_id: number;
  topic_id: MessageTopic;
  reply_to: InputMessageReplyTo;
  options: MessageSendOptions;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibsendMessageAlbum {
  "@type": "sendMessageAlbum";
  chat_id: number;
  topic_id: MessageTopic;
  reply_to: InputMessageReplyTo;
  options: MessageSendOptions;
  input_message_contents: Array<InputMessageContent>;
}

export interface TdlibsendBotStartMessage {
  "@type": "sendBotStartMessage";
  bot_user_id: number;
  chat_id: number;
  parameter: string;
}

export interface TdlibsendInlineQueryResultMessage {
  "@type": "sendInlineQueryResultMessage";
  chat_id: number;
  topic_id: MessageTopic;
  reply_to: InputMessageReplyTo;
  options: MessageSendOptions;
  query_id: string;
  result_id: string;
  hide_via_bot: boolean;
}

export interface TdlibforwardMessages {
  "@type": "forwardMessages";
  chat_id: number;
  topic_id: MessageTopic;
  from_chat_id: number;
  message_ids: Array<number>;
  options: MessageSendOptions;
  send_copy: boolean;
  remove_caption: boolean;
}

export interface TdlibsendQuickReplyShortcutMessages {
  "@type": "sendQuickReplyShortcutMessages";
  chat_id: number;
  shortcut_id: number;
  sending_id: number;
}

export interface TdlibresendMessages {
  "@type": "resendMessages";
  chat_id: number;
  message_ids: Array<number>;
  quote: InputTextQuote;
  paid_message_star_count: number;
}

export interface TdlibaddLocalMessage {
  "@type": "addLocalMessage";
  chat_id: number;
  sender_id: MessageSender;
  reply_to: InputMessageReplyTo;
  disable_notification: boolean;
  input_message_content: InputMessageContent;
}

export interface TdlibeditMessageText {
  "@type": "editMessageText";
  chat_id: number;
  message_id: number;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibeditMessageLiveLocation {
  "@type": "editMessageLiveLocation";
  chat_id: number;
  message_id: number;
  reply_markup: ReplyMarkup;
  location: Location;
  live_period: number;
  heading: number;
  proximity_alert_radius: number;
}

export interface TdlibeditMessageChecklist {
  "@type": "editMessageChecklist";
  chat_id: number;
  message_id: number;
  reply_markup: ReplyMarkup;
  checklist: InputChecklist;
}

export interface TdlibeditMessageMedia {
  "@type": "editMessageMedia";
  chat_id: number;
  message_id: number;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibeditMessageCaption {
  "@type": "editMessageCaption";
  chat_id: number;
  message_id: number;
  reply_markup: ReplyMarkup;
  caption: FormattedText;
  show_caption_above_media: boolean;
}

export interface TdlibeditMessageReplyMarkup {
  "@type": "editMessageReplyMarkup";
  chat_id: number;
  message_id: number;
  reply_markup: ReplyMarkup;
}

export interface TdlibsendBusinessMessage {
  "@type": "sendBusinessMessage";
  business_connection_id: string;
  chat_id: number;
  reply_to: InputMessageReplyTo;
  disable_notification: boolean;
  protect_content: boolean;
  effect_id: string;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibsendBusinessMessageAlbum {
  "@type": "sendBusinessMessageAlbum";
  business_connection_id: string;
  chat_id: number;
  reply_to: InputMessageReplyTo;
  disable_notification: boolean;
  protect_content: boolean;
  effect_id: string;
  input_message_contents: Array<InputMessageContent>;
}

export interface TdlibeditBusinessMessageText {
  "@type": "editBusinessMessageText";
  business_connection_id: string;
  chat_id: number;
  message_id: number;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibeditBusinessMessageLiveLocation {
  "@type": "editBusinessMessageLiveLocation";
  business_connection_id: string;
  chat_id: number;
  message_id: number;
  reply_markup: ReplyMarkup;
  location: Location;
  live_period: number;
  heading: number;
  proximity_alert_radius: number;
}

export interface TdlibeditBusinessMessageChecklist {
  "@type": "editBusinessMessageChecklist";
  business_connection_id: string;
  chat_id: number;
  message_id: number;
  reply_markup: ReplyMarkup;
  checklist: InputChecklist;
}

export interface TdlibeditBusinessMessageMedia {
  "@type": "editBusinessMessageMedia";
  business_connection_id: string;
  chat_id: number;
  message_id: number;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibeditBusinessMessageCaption {
  "@type": "editBusinessMessageCaption";
  business_connection_id: string;
  chat_id: number;
  message_id: number;
  reply_markup: ReplyMarkup;
  caption: FormattedText;
  show_caption_above_media: boolean;
}

export interface TdlibeditBusinessMessageReplyMarkup {
  "@type": "editBusinessMessageReplyMarkup";
  business_connection_id: string;
  chat_id: number;
  message_id: number;
  reply_markup: ReplyMarkup;
}

export interface TdlibstopBusinessPoll {
  "@type": "stopBusinessPoll";
  business_connection_id: string;
  chat_id: number;
  message_id: number;
  reply_markup: ReplyMarkup;
}

export interface TdlibeditBusinessStory {
  "@type": "editBusinessStory";
  story_poster_chat_id: number;
  story_id: number;
  content: InputStoryContent;
  areas: InputStoryAreas;
  caption: FormattedText;
  privacy_settings: StoryPrivacySettings;
}

export interface TdlibgetBusinessAccountStarAmount {
  "@type": "getBusinessAccountStarAmount";
  business_connection_id: string;
}

export interface TdlibaddQuickReplyShortcutMessage {
  "@type": "addQuickReplyShortcutMessage";
  shortcut_name: string;
  reply_to_message_id: number;
  input_message_content: InputMessageContent;
}

export interface TdlibaddQuickReplyShortcutInlineQueryResultMessage {
  "@type": "addQuickReplyShortcutInlineQueryResultMessage";
  shortcut_name: string;
  reply_to_message_id: number;
  query_id: string;
  result_id: string;
  hide_via_bot: boolean;
}

export interface TdlibaddQuickReplyShortcutMessageAlbum {
  "@type": "addQuickReplyShortcutMessageAlbum";
  shortcut_name: string;
  reply_to_message_id: number;
  input_message_contents: Array<InputMessageContent>;
}

export interface TdlibreaddQuickReplyShortcutMessages {
  "@type": "readdQuickReplyShortcutMessages";
  shortcut_name: string;
  message_ids: Array<number>;
}


export interface TdlibcreateForumTopic {
  "@type": "createForumTopic";
  chat_id: number;
  name: string;
  is_name_implicit: boolean;
  icon: ForumTopicIcon;
}

export interface TdlibgetForumTopic {
  "@type": "getForumTopic";
  chat_id: number;
  forum_topic_id: number;
}

export interface TdlibgetForumTopicHistory {
  "@type": "getForumTopicHistory";
  chat_id: number;
  forum_topic_id: number;
  from_message_id: number;
  offset: number;
  limit: number;
}

export interface TdlibgetForumTopicLink {
  "@type": "getForumTopicLink";
  chat_id: number;
  forum_topic_id: number;
}

export interface TdlibgetForumTopics {
  "@type": "getForumTopics";
  chat_id: number;
  query: string;
  offset_date: number;
  offset_message_id: number;
  offset_forum_topic_id: number;
  limit: number;
}


export interface TdlibaddLoginPasskey {
  "@type": "addLoginPasskey";
  client_data: string;
  attestation_object: string;
}


export interface TdlibgetEmojiReaction {
  "@type": "getEmojiReaction";
  emoji: string;
}


export interface TdlibgetMessageAvailableReactions {
  "@type": "getMessageAvailableReactions";
  chat_id: number;
  message_id: number;
  row_size: number;
}

export interface TdlibgetChatAvailablePaidMessageReactionSenders {
  "@type": "getChatAvailablePaidMessageReactionSenders";
  chat_id: number;
}

export interface TdlibgetMessageAddedReactions {
  "@type": "getMessageAddedReactions";
  chat_id: number;
  message_id: number;
  reaction_type: ReactionType;
  offset: string;
  limit: number;
}

export interface TdlibgetSavedMessagesTags {
  "@type": "getSavedMessagesTags";
  saved_messages_topic_id: number;
}

export interface TdlibgetMessageEffect {
  "@type": "getMessageEffect";
  effect_id: string;
}

export interface TdlibsearchQuote {
  "@type": "searchQuote";
  text: FormattedText;
  quote: FormattedText;
  quote_position: number;
}

export interface TdlibgetTextEntities {
  "@type": "getTextEntities";
  text: string;
}

export interface TdlibparseTextEntities {
  "@type": "parseTextEntities";
  text: string;
  parse_mode: TextParseMode;
}

export interface TdlibparseMarkdown {
  "@type": "parseMarkdown";
  text: FormattedText;
}

export interface TdlibgetMarkdownText {
  "@type": "getMarkdownText";
  text: FormattedText;
}

export interface TdlibgetCountryFlagEmoji {
  "@type": "getCountryFlagEmoji";
  country_code: string;
}

export interface TdlibgetFileMimeType {
  "@type": "getFileMimeType";
  file_name: string;
}

export interface TdlibgetFileExtension {
  "@type": "getFileExtension";
  mime_type: string;
}

export interface TdlibcleanFileName {
  "@type": "cleanFileName";
  file_name: string;
}

export interface TdlibgetLanguagePackString {
  "@type": "getLanguagePackString";
  language_pack_database_path: string;
  localization_target: string;
  language_pack_id: string;
  key: string;
}

export interface TdlibgetJsonValue {
  "@type": "getJsonValue";
  json: string;
}

export interface TdlibgetJsonString {
  "@type": "getJsonString";
  json_value: JsonValue;
}

export interface TdlibgetThemeParametersJsonString {
  "@type": "getThemeParametersJsonString";
  theme: ThemeParameters;
}

export interface TdlibgetPollVoters {
  "@type": "getPollVoters";
  chat_id: number;
  message_id: number;
  option_id: number;
  offset: number;
  limit: number;
}

export interface TdlibgetBusinessConnection {
  "@type": "getBusinessConnection";
  connection_id: string;
}

export interface TdlibgetLoginUrlInfo {
  "@type": "getLoginUrlInfo";
  chat_id: number;
  message_id: number;
  button_id: number;
}

export interface TdlibgetLoginUrl {
  "@type": "getLoginUrl";
  chat_id: number;
  message_id: number;
  button_id: number;
  allow_write_access: boolean;
}

export interface TdlibgetInlineQueryResults {
  "@type": "getInlineQueryResults";
  bot_user_id: number;
  chat_id: number;
  user_location: Location;
  query: string;
  offset: string;
}

export interface TdlibsavePreparedInlineMessage {
  "@type": "savePreparedInlineMessage";
  user_id: number;
  result: InputInlineQueryResult;
  chat_types: TargetChatTypes;
}

export interface TdlibgetPreparedInlineMessage {
  "@type": "getPreparedInlineMessage";
  bot_user_id: number;
  prepared_message_id: string;
}

export interface TdlibgetGrossingWebAppBots {
  "@type": "getGrossingWebAppBots";
  offset: string;
  limit: number;
}

export interface TdlibsearchWebApp {
  "@type": "searchWebApp";
  bot_user_id: number;
  web_app_short_name: string;
}

export interface TdlibgetWebAppPlaceholder {
  "@type": "getWebAppPlaceholder";
  bot_user_id: number;
}

export interface TdlibgetWebAppLinkUrl {
  "@type": "getWebAppLinkUrl";
  chat_id: number;
  bot_user_id: number;
  web_app_short_name: string;
  start_parameter: string;
  allow_write_access: boolean;
  parameters: WebAppOpenParameters;
}

export interface TdlibgetMainWebApp {
  "@type": "getMainWebApp";
  chat_id: number;
  bot_user_id: number;
  start_parameter: string;
  parameters: WebAppOpenParameters;
}

export interface TdlibgetWebAppUrl {
  "@type": "getWebAppUrl";
  bot_user_id: number;
  url: string;
  parameters: WebAppOpenParameters;
}

export interface TdlibopenWebApp {
  "@type": "openWebApp";
  chat_id: number;
  bot_user_id: number;
  url: string;
  topic_id: MessageTopic;
  reply_to: InputMessageReplyTo;
  parameters: WebAppOpenParameters;
}

export interface TdlibanswerWebAppQuery {
  "@type": "answerWebAppQuery";
  web_app_query_id: string;
  result: InputInlineQueryResult;
}

export interface TdlibgetCallbackQueryAnswer {
  "@type": "getCallbackQueryAnswer";
  chat_id: number;
  message_id: number;
  payload: CallbackQueryPayload;
}

export interface TdlibsetGameScore {
  "@type": "setGameScore";
  chat_id: number;
  message_id: number;
  edit_message: boolean;
  user_id: number;
  score: number;
  force: boolean;
}

export interface TdlibgetGameHighScores {
  "@type": "getGameHighScores";
  chat_id: number;
  message_id: number;
  user_id: number;
}

export interface TdlibgetInlineGameHighScores {
  "@type": "getInlineGameHighScores";
  inline_message_id: string;
  user_id: number;
}

export interface TdlibclickAnimatedEmojiMessage {
  "@type": "clickAnimatedEmojiMessage";
  chat_id: number;
  message_id: number;
}

export interface TdlibgetInternalLink {
  "@type": "getInternalLink";
  type: InternalLinkType;
  is_http: boolean;
}

export interface TdlibgetInternalLinkType {
  "@type": "getInternalLinkType";
  link: string;
}

export interface TdlibgetExternalLinkInfo {
  "@type": "getExternalLinkInfo";
  link: string;
}

export interface TdlibgetExternalLink {
  "@type": "getExternalLink";
  link: string;
  allow_write_access: boolean;
}

export interface TdlibcreatePrivateChat {
  "@type": "createPrivateChat";
  user_id: number;
  force: boolean;
}

export interface TdlibcreateBasicGroupChat {
  "@type": "createBasicGroupChat";
  basic_group_id: number;
  force: boolean;
}

export interface TdlibcreateSupergroupChat {
  "@type": "createSupergroupChat";
  supergroup_id: number;
  force: boolean;
}

export interface TdlibcreateSecretChat {
  "@type": "createSecretChat";
  secret_chat_id: number;
}

export interface TdlibcreateNewBasicGroupChat {
  "@type": "createNewBasicGroupChat";
  user_ids: Array<number>;
  title: string;
  message_auto_delete_time: number;
}

export interface TdlibcreateNewSupergroupChat {
  "@type": "createNewSupergroupChat";
  title: string;
  is_forum: boolean;
  is_channel: boolean;
  description: string;
  location: ChatLocation;
  message_auto_delete_time: number;
  for_import: boolean;
}

export interface TdlibcreateNewSecretChat {
  "@type": "createNewSecretChat";
  user_id: number;
}

export interface TdlibupgradeBasicGroupChatToSupergroupChat {
  "@type": "upgradeBasicGroupChatToSupergroupChat";
  chat_id: number;
}

export interface TdlibgetChatListsToAddChat {
  "@type": "getChatListsToAddChat";
  chat_id: number;
}

export interface TdlibgetChatFolder {
  "@type": "getChatFolder";
  chat_folder_id: number;
}

export interface TdlibcreateChatFolder {
  "@type": "createChatFolder";
  folder: ChatFolder;
}

export interface TdlibeditChatFolder {
  "@type": "editChatFolder";
  chat_folder_id: number;
  folder: ChatFolder;
}

export interface TdlibgetChatFolderChatsToLeave {
  "@type": "getChatFolderChatsToLeave";
  chat_folder_id: number;
}

export interface TdlibgetChatFolderChatCount {
  "@type": "getChatFolderChatCount";
  folder: ChatFolder;
}


export interface TdlibgetChatFolderDefaultIconName {
  "@type": "getChatFolderDefaultIconName";
  folder: ChatFolder;
}

export interface TdlibgetChatsForChatFolderInviteLink {
  "@type": "getChatsForChatFolderInviteLink";
  chat_folder_id: number;
}

export interface TdlibcreateChatFolderInviteLink {
  "@type": "createChatFolderInviteLink";
  chat_folder_id: number;
  name: string;
  chat_ids: Array<number>;
}

export interface TdlibgetChatFolderInviteLinks {
  "@type": "getChatFolderInviteLinks";
  chat_folder_id: number;
}

export interface TdlibeditChatFolderInviteLink {
  "@type": "editChatFolderInviteLink";
  chat_folder_id: number;
  invite_link: string;
  name: string;
  chat_ids: Array<number>;
}

export interface TdlibcheckChatFolderInviteLink {
  "@type": "checkChatFolderInviteLink";
  invite_link: string;
}

export interface TdlibgetChatFolderNewChats {
  "@type": "getChatFolderNewChats";
  chat_folder_id: number;
}


export interface TdlibgetGiftChatThemes {
  "@type": "getGiftChatThemes";
  offset: string;
  limit: number;
}

export interface TdlibaddChatMember {
  "@type": "addChatMember";
  chat_id: number;
  user_id: number;
  forward_limit: number;
}

export interface TdlibaddChatMembers {
  "@type": "addChatMembers";
  chat_id: number;
  user_ids: Array<number>;
}


export interface TdlibgetChatMember {
  "@type": "getChatMember";
  chat_id: number;
  member_id: MessageSender;
}

export interface TdlibsearchChatMembers {
  "@type": "searchChatMembers";
  chat_id: number;
  query: string;
  limit: number;
  filter: ChatMembersFilter;
}

export interface TdlibgetChatAdministrators {
  "@type": "getChatAdministrators";
  chat_id: number;
}


export interface TdlibgetSavedNotificationSound {
  "@type": "getSavedNotificationSound";
  notification_sound_id: string;
}


export interface TdlibaddSavedNotificationSound {
  "@type": "addSavedNotificationSound";
  sound: InputFile;
}

export interface TdlibgetChatNotificationSettingsExceptions {
  "@type": "getChatNotificationSettingsExceptions";
  scope: NotificationSettingsScope;
  compare_sound: boolean;
}

export interface TdlibgetScopeNotificationSettings {
  "@type": "getScopeNotificationSettings";
  scope: NotificationSettingsScope;
}

export interface TdlibgetCurrentWeather {
  "@type": "getCurrentWeather";
  location: Location;
}

export interface TdlibgetStory {
  "@type": "getStory";
  story_poster_chat_id: number;
  story_id: number;
  only_local: boolean;
}


export interface TdlibcanPostStory {
  "@type": "canPostStory";
  chat_id: number;
}

export interface TdlibpostStory {
  "@type": "postStory";
  chat_id: number;
  content: InputStoryContent;
  areas: InputStoryAreas;
  caption: FormattedText;
  privacy_settings: StoryPrivacySettings;
  album_ids: Array<number>;
  active_period: number;
  from_story_full_id: StoryFullId;
  is_posted_to_chat_page: boolean;
  protect_content: boolean;
}

export interface TdlibstartLiveStory {
  "@type": "startLiveStory";
  chat_id: number;
  privacy_settings: StoryPrivacySettings;
  protect_content: boolean;
  is_rtmp_stream: boolean;
  enable_messages: boolean;
  paid_message_star_count: number;
}


export interface TdlibgetChatActiveStories {
  "@type": "getChatActiveStories";
  chat_id: number;
}

export interface TdlibgetChatPostedToChatPageStories {
  "@type": "getChatPostedToChatPageStories";
  chat_id: number;
  from_story_id: number;
  limit: number;
}

export interface TdlibgetChatArchivedStories {
  "@type": "getChatArchivedStories";
  chat_id: number;
  from_story_id: number;
  limit: number;
}

export interface TdlibgetStoryAvailableReactions {
  "@type": "getStoryAvailableReactions";
  row_size: number;
}

export interface TdlibgetStoryInteractions {
  "@type": "getStoryInteractions";
  story_id: number;
  query: string;
  only_contacts: boolean;
  prefer_forwards: boolean;
  prefer_with_reaction: boolean;
  offset: string;
  limit: number;
}

export interface TdlibgetChatStoryInteractions {
  "@type": "getChatStoryInteractions";
  story_poster_chat_id: number;
  story_id: number;
  reaction_type: ReactionType;
  prefer_forwards: boolean;
  offset: string;
  limit: number;
}

export interface TdlibreportStory {
  "@type": "reportStory";
  story_poster_chat_id: number;
  story_id: number;
  option_id: string;
  text: string;
}

export interface TdlibgetStoryPublicForwards {
  "@type": "getStoryPublicForwards";
  story_poster_chat_id: number;
  story_id: number;
  offset: string;
  limit: number;
}

export interface TdlibgetChatStoryAlbums {
  "@type": "getChatStoryAlbums";
  chat_id: number;
}

export interface TdlibgetStoryAlbumStories {
  "@type": "getStoryAlbumStories";
  chat_id: number;
  story_album_id: number;
  offset: number;
  limit: number;
}

export interface TdlibcreateStoryAlbum {
  "@type": "createStoryAlbum";
  story_poster_chat_id: number;
  name: string;
  story_ids: Array<number>;
}

export interface TdlibsetStoryAlbumName {
  "@type": "setStoryAlbumName";
  chat_id: number;
  story_album_id: number;
  name: string;
}

export interface TdlibaddStoryAlbumStories {
  "@type": "addStoryAlbumStories";
  chat_id: number;
  story_album_id: number;
  story_ids: Array<number>;
}

export interface TdlibremoveStoryAlbumStories {
  "@type": "removeStoryAlbumStories";
  chat_id: number;
  story_album_id: number;
  story_ids: Array<number>;
}

export interface TdlibreorderStoryAlbumStories {
  "@type": "reorderStoryAlbumStories";
  chat_id: number;
  story_album_id: number;
  story_ids: Array<number>;
}

export interface TdlibgetChatBoostLevelFeatures {
  "@type": "getChatBoostLevelFeatures";
  is_channel: boolean;
  level: number;
}

export interface TdlibgetChatBoostFeatures {
  "@type": "getChatBoostFeatures";
  is_channel: boolean;
}


export interface TdlibgetChatBoostStatus {
  "@type": "getChatBoostStatus";
  chat_id: number;
}

export interface TdlibboostChat {
  "@type": "boostChat";
  chat_id: number;
  slot_ids: Array<number>;
}

export interface TdlibgetChatBoostLink {
  "@type": "getChatBoostLink";
  chat_id: number;
}

export interface TdlibgetChatBoostLinkInfo {
  "@type": "getChatBoostLinkInfo";
  url: string;
}

export interface TdlibgetChatBoosts {
  "@type": "getChatBoosts";
  chat_id: number;
  only_gift_codes: boolean;
  offset: string;
  limit: number;
}

export interface TdlibgetUserChatBoosts {
  "@type": "getUserChatBoosts";
  chat_id: number;
  user_id: number;
}

export interface TdlibgetAttachmentMenuBot {
  "@type": "getAttachmentMenuBot";
  bot_user_id: number;
}








export interface TdlibdownloadFile {
  "@type": "downloadFile";
  file_id: number;
  priority: number;
  offset: number;
  limit: number;
  synchronous: boolean;
}

export interface TdlibgetFileDownloadedPrefixSize {
  "@type": "getFileDownloadedPrefixSize";
  file_id: number;
  offset: number;
}

export interface TdlibgetSuggestedFileName {
  "@type": "getSuggestedFileName";
  file_id: number;
  directory: string;
}

export interface TdlibpreliminaryUploadFile {
  "@type": "preliminaryUploadFile";
  file: InputFile;
  file_type: FileType;
  priority: number;
}

export interface TdlibreadFilePart {
  "@type": "readFilePart";
  file_id: number;
  offset: number;
  count: number;
}

export interface TdlibaddFileToDownloads {
  "@type": "addFileToDownloads";
  file_id: number;
  chat_id: number;
  message_id: number;
  priority: number;
}

export interface TdlibsearchFileDownloads {
  "@type": "searchFileDownloads";
  query: string;
  only_active: boolean;
  only_completed: boolean;
  offset: string;
  limit: number;
}

export interface TdlibgetMessageFileType {
  "@type": "getMessageFileType";
  message_file_head: string;
}

export interface TdlibgetMessageImportConfirmationText {
  "@type": "getMessageImportConfirmationText";
  chat_id: number;
}

export interface TdlibreplacePrimaryChatInviteLink {
  "@type": "replacePrimaryChatInviteLink";
  chat_id: number;
}

export interface TdlibcreateChatInviteLink {
  "@type": "createChatInviteLink";
  chat_id: number;
  name: string;
  expiration_date: number;
  member_limit: number;
  creates_join_request: boolean;
}

export interface TdlibcreateChatSubscriptionInviteLink {
  "@type": "createChatSubscriptionInviteLink";
  chat_id: number;
  name: string;
  subscription_pricing: StarSubscriptionPricing;
}

export interface TdlibeditChatInviteLink {
  "@type": "editChatInviteLink";
  chat_id: number;
  invite_link: string;
  name: string;
  expiration_date: number;
  member_limit: number;
  creates_join_request: boolean;
}

export interface TdlibeditChatSubscriptionInviteLink {
  "@type": "editChatSubscriptionInviteLink";
  chat_id: number;
  invite_link: string;
  name: string;
}

export interface TdlibgetChatInviteLink {
  "@type": "getChatInviteLink";
  chat_id: number;
  invite_link: string;
}

export interface TdlibgetChatInviteLinkCounts {
  "@type": "getChatInviteLinkCounts";
  chat_id: number;
}

export interface TdlibgetChatInviteLinks {
  "@type": "getChatInviteLinks";
  chat_id: number;
  creator_user_id: number;
  is_revoked: boolean;
  offset_date: number;
  offset_invite_link: string;
  limit: number;
}

export interface TdlibgetChatInviteLinkMembers {
  "@type": "getChatInviteLinkMembers";
  chat_id: number;
  invite_link: string;
  only_with_expired_subscription: boolean;
  offset_member: ChatInviteLinkMember;
  limit: number;
}

export interface TdlibrevokeChatInviteLink {
  "@type": "revokeChatInviteLink";
  chat_id: number;
  invite_link: string;
}

export interface TdlibcheckChatInviteLink {
  "@type": "checkChatInviteLink";
  invite_link: string;
}

export interface TdlibjoinChatByInviteLink {
  "@type": "joinChatByInviteLink";
  invite_link: string;
}

export interface TdlibgetChatJoinRequests {
  "@type": "getChatJoinRequests";
  chat_id: number;
  invite_link: string;
  query: string;
  offset_request: ChatJoinRequest;
  limit: number;
}

export interface TdlibaddOffer {
  "@type": "addOffer";
  chat_id: number;
  message_id: number;
  options: MessageSendOptions;
}

export interface TdlibcreateCall {
  "@type": "createCall";
  user_id: number;
  protocol: CallProtocol;
  is_video: boolean;
}

export interface TdlibgetVideoChatAvailableParticipants {
  "@type": "getVideoChatAvailableParticipants";
  chat_id: number;
}

export interface TdlibcreateVideoChat {
  "@type": "createVideoChat";
  chat_id: number;
  title: string;
  start_date: number;
  is_rtmp_stream: boolean;
}

export interface TdlibcreateGroupCall {
  "@type": "createGroupCall";
  join_parameters: GroupCallJoinParameters;
}

export interface TdlibgetVideoChatRtmpUrl {
  "@type": "getVideoChatRtmpUrl";
  chat_id: number;
}

export interface TdlibreplaceVideoChatRtmpUrl {
  "@type": "replaceVideoChatRtmpUrl";
  chat_id: number;
}

export interface TdlibgetLiveStoryRtmpUrl {
  "@type": "getLiveStoryRtmpUrl";
  chat_id: number;
}

export interface TdlibreplaceLiveStoryRtmpUrl {
  "@type": "replaceLiveStoryRtmpUrl";
  chat_id: number;
}

export interface TdlibgetGroupCall {
  "@type": "getGroupCall";
  group_call_id: number;
}

export interface TdlibjoinGroupCall {
  "@type": "joinGroupCall";
  input_group_call: InputGroupCall;
  join_parameters: GroupCallJoinParameters;
}

export interface TdlibjoinVideoChat {
  "@type": "joinVideoChat";
  group_call_id: number;
  participant_id: MessageSender;
  join_parameters: GroupCallJoinParameters;
  invite_hash: string;
}

export interface TdlibjoinLiveStory {
  "@type": "joinLiveStory";
  group_call_id: number;
  join_parameters: GroupCallJoinParameters;
}

export interface TdlibstartGroupCallScreenSharing {
  "@type": "startGroupCallScreenSharing";
  group_call_id: number;
  audio_source_id: number;
  payload: string;
}

export interface TdlibgetLiveStoryStreamer {
  "@type": "getLiveStoryStreamer";
  group_call_id: number;
}

export interface TdlibgetLiveStoryAvailableMessageSenders {
  "@type": "getLiveStoryAvailableMessageSenders";
  group_call_id: number;
}

export interface TdlibgetLiveStoryTopDonors {
  "@type": "getLiveStoryTopDonors";
  group_call_id: number;
}

export interface TdlibinviteGroupCallParticipant {
  "@type": "inviteGroupCallParticipant";
  group_call_id: number;
  user_id: number;
  is_video: boolean;
}

export interface TdlibgetVideoChatInviteLink {
  "@type": "getVideoChatInviteLink";
  group_call_id: number;
  can_self_unmute: boolean;
}

export interface TdlibsetGroupCallParticipantIsSpeaking {
  "@type": "setGroupCallParticipantIsSpeaking";
  group_call_id: number;
  audio_source: number;
  is_speaking: boolean;
}

export interface TdlibgetGroupCallParticipants {
  "@type": "getGroupCallParticipants";
  input_group_call: InputGroupCall;
  limit: number;
}

export interface TdlibgetGroupCallStreams {
  "@type": "getGroupCallStreams";
  group_call_id: number;
}

export interface TdlibgetGroupCallStreamSegment {
  "@type": "getGroupCallStreamSegment";
  group_call_id: number;
  time_offset: number;
  scale: number;
  channel_id: number;
  video_quality: GroupCallVideoQuality;
}

export interface TdlibencryptGroupCallData {
  "@type": "encryptGroupCallData";
  group_call_id: number;
  data_channel: GroupCallDataChannel;
  data: string;
  unencrypted_prefix_size: number;
}

export interface TdlibdecryptGroupCallData {
  "@type": "decryptGroupCallData";
  group_call_id: number;
  participant_id: MessageSender;
  data_channel: GroupCallDataChannel;
  data: string;
}

export interface TdlibgetBlockedMessageSenders {
  "@type": "getBlockedMessageSenders";
  block_list: BlockList;
  offset: number;
  limit: number;
}

export interface TdlibimportContacts {
  "@type": "importContacts";
  contacts: Array<ImportedContact>;
}


export interface TdlibsearchContacts {
  "@type": "searchContacts";
  query: string;
  limit: number;
}


export interface TdlibchangeImportedContacts {
  "@type": "changeImportedContacts";
  contacts: Array<ImportedContact>;
}


export interface TdlibsearchUserByPhoneNumber {
  "@type": "searchUserByPhoneNumber";
  phone_number: string;
  only_local: boolean;
}

export interface TdlibgetUserProfilePhotos {
  "@type": "getUserProfilePhotos";
  user_id: number;
  offset: number;
  limit: number;
}

export interface TdlibgetUserProfileAudios {
  "@type": "getUserProfileAudios";
  user_id: number;
  offset: number;
  limit: number;
}

export interface TdlibgetStickerOutline {
  "@type": "getStickerOutline";
  sticker_file_id: number;
  for_animated_emoji: boolean;
  for_clicked_animated_emoji_message: boolean;
}

export interface TdlibgetStickerOutlineSvgPath {
  "@type": "getStickerOutlineSvgPath";
  sticker_file_id: number;
  for_animated_emoji: boolean;
  for_clicked_animated_emoji_message: boolean;
}

export interface TdlibgetStickers {
  "@type": "getStickers";
  sticker_type: StickerType;
  query: string;
  limit: number;
  chat_id: number;
}

export interface TdlibgetAllStickerEmojis {
  "@type": "getAllStickerEmojis";
  sticker_type: StickerType;
  query: string;
  chat_id: number;
  return_only_main_emoji: boolean;
}

export interface TdlibsearchStickers {
  "@type": "searchStickers";
  sticker_type: StickerType;
  emojis: string;
  query: string;
  input_language_codes: Array<string>;
  offset: number;
  limit: number;
}


export interface TdlibgetPremiumStickers {
  "@type": "getPremiumStickers";
  limit: number;
}

export interface TdlibgetInstalledStickerSets {
  "@type": "getInstalledStickerSets";
  sticker_type: StickerType;
}

export interface TdlibgetArchivedStickerSets {
  "@type": "getArchivedStickerSets";
  sticker_type: StickerType;
  offset_sticker_set_id: string;
  limit: number;
}

export interface TdlibgetTrendingStickerSets {
  "@type": "getTrendingStickerSets";
  sticker_type: StickerType;
  offset: number;
  limit: number;
}

export interface TdlibgetAttachedStickerSets {
  "@type": "getAttachedStickerSets";
  file_id: number;
}

export interface TdlibgetStickerSet {
  "@type": "getStickerSet";
  set_id: string;
}

export interface TdlibgetStickerSetName {
  "@type": "getStickerSetName";
  set_id: string;
}

export interface TdlibsearchStickerSet {
  "@type": "searchStickerSet";
  name: string;
  ignore_cache: boolean;
}

export interface TdlibsearchInstalledStickerSets {
  "@type": "searchInstalledStickerSets";
  sticker_type: StickerType;
  query: string;
  limit: number;
}

export interface TdlibsearchStickerSets {
  "@type": "searchStickerSets";
  sticker_type: StickerType;
  query: string;
}

export interface TdlibgetRecentStickers {
  "@type": "getRecentStickers";
  is_attached: boolean;
}

export interface TdlibaddRecentSticker {
  "@type": "addRecentSticker";
  is_attached: boolean;
  sticker: InputFile;
}


export interface TdlibgetStickerEmojis {
  "@type": "getStickerEmojis";
  sticker: InputFile;
}

export interface TdlibsearchEmojis {
  "@type": "searchEmojis";
  text: string;
  input_language_codes: Array<string>;
}

export interface TdlibgetKeywordEmojis {
  "@type": "getKeywordEmojis";
  text: string;
  input_language_codes: Array<string>;
}

export interface TdlibgetEmojiCategories {
  "@type": "getEmojiCategories";
  type: EmojiCategoryType;
}

export interface TdlibgetAnimatedEmoji {
  "@type": "getAnimatedEmoji";
  emoji: string;
}

export interface TdlibgetEmojiSuggestionsUrl {
  "@type": "getEmojiSuggestionsUrl";
  language_code: string;
}

export interface TdlibgetCustomEmojiStickers {
  "@type": "getCustomEmojiStickers";
  custom_emoji_ids: Array<string>;
}







export interface TdlibsearchHashtags {
  "@type": "searchHashtags";
  prefix: string;
  limit: number;
}

export interface TdlibgetLinkPreview {
  "@type": "getLinkPreview";
  text: FormattedText;
  link_preview_options: LinkPreviewOptions;
}

export interface TdlibgetWebPageInstantView {
  "@type": "getWebPageInstantView";
  url: string;
  only_local: boolean;
}

export interface TdlibsendPhoneNumberCode {
  "@type": "sendPhoneNumberCode";
  phone_number: string;
  settings: PhoneNumberAuthenticationSettings;
  type: PhoneNumberCodeType;
}

export interface TdlibresendPhoneNumberCode {
  "@type": "resendPhoneNumberCode";
  reason: ResendCodeReason;
}



export interface TdlibcreateBusinessChatLink {
  "@type": "createBusinessChatLink";
  link_info: InputBusinessChatLink;
}

export interface TdlibeditBusinessChatLink {
  "@type": "editBusinessChatLink";
  link: string;
  link_info: InputBusinessChatLink;
}

export interface TdlibgetBusinessChatLinkInfo {
  "@type": "getBusinessChatLinkInfo";
  link_name: string;
}


export interface TdlibsearchUserByToken {
  "@type": "searchUserByToken";
  token: string;
}

export interface TdlibgetCommands {
  "@type": "getCommands";
  scope: BotCommandScope;
  language_code: string;
}

export interface TdlibgetMenuButton {
  "@type": "getMenuButton";
  user_id: number;
}

export interface TdlibsendWebAppCustomRequest {
  "@type": "sendWebAppCustomRequest";
  bot_user_id: number;
  method: string;
  parameters: string;
}

export interface TdlibgetBotMediaPreviews {
  "@type": "getBotMediaPreviews";
  bot_user_id: number;
}

export interface TdlibgetBotMediaPreviewInfo {
  "@type": "getBotMediaPreviewInfo";
  bot_user_id: number;
  language_code: string;
}

export interface TdlibaddBotMediaPreview {
  "@type": "addBotMediaPreview";
  bot_user_id: number;
  language_code: string;
  content: InputStoryContent;
}

export interface TdlibeditBotMediaPreview {
  "@type": "editBotMediaPreview";
  bot_user_id: number;
  language_code: string;
  file_id: number;
  content: InputStoryContent;
}

export interface TdlibgetBotName {
  "@type": "getBotName";
  bot_user_id: number;
  language_code: string;
}

export interface TdlibgetBotInfoDescription {
  "@type": "getBotInfoDescription";
  bot_user_id: number;
  language_code: string;
}

export interface TdlibgetBotInfoShortDescription {
  "@type": "getBotInfoShortDescription";
  bot_user_id: number;
  language_code: string;
}



export interface TdlibgetSupergroupMembers {
  "@type": "getSupergroupMembers";
  supergroup_id: number;
  filter: SupergroupMembersFilter;
  offset: number;
  limit: number;
}

export interface TdlibgetChatEventLog {
  "@type": "getChatEventLog";
  chat_id: number;
  query: string;
  from_event_id: string;
  limit: number;
  filters: ChatEventLogFilters;
  user_ids: Array<number>;
}


export interface TdlibgetPaymentForm {
  "@type": "getPaymentForm";
  input_invoice: InputInvoice;
  theme: ThemeParameters;
}

export interface TdlibvalidateOrderInfo {
  "@type": "validateOrderInfo";
  input_invoice: InputInvoice;
  order_info: OrderInfo;
  allow_save: boolean;
}

export interface TdlibsendPaymentForm {
  "@type": "sendPaymentForm";
  input_invoice: InputInvoice;
  payment_form_id: string;
  order_info_id: string;
  shipping_option_id: string;
  credentials: InputCredentials;
  tip_amount: number;
}

export interface TdlibgetPaymentReceipt {
  "@type": "getPaymentReceipt";
  chat_id: number;
  message_id: number;
}



export interface TdlibcanSendGift {
  "@type": "canSendGift";
  gift_id: string;
}

export interface TdlibgetGiftAuctionState {
  "@type": "getGiftAuctionState";
  auction_id: string;
}

export interface TdlibgetGiftAuctionAcquiredGifts {
  "@type": "getGiftAuctionAcquiredGifts";
  gift_id: string;
}

export interface TdlibgetGiftUpgradePreview {
  "@type": "getGiftUpgradePreview";
  gift_id: string;
}

export interface TdlibgetGiftUpgradeVariants {
  "@type": "getGiftUpgradeVariants";
  gift_id: string;
}

export interface TdlibupgradeGift {
  "@type": "upgradeGift";
  business_connection_id: string;
  received_gift_id: string;
  keep_original_details: boolean;
  star_count: number;
}

export interface TdlibsendResoldGift {
  "@type": "sendResoldGift";
  gift_name: string;
  owner_id: MessageSender;
  price: GiftResalePrice;
}

export interface TdlibgetReceivedGifts {
  "@type": "getReceivedGifts";
  business_connection_id: string;
  owner_id: MessageSender;
  collection_id: number;
  exclude_unsaved: boolean;
  exclude_saved: boolean;
  exclude_unlimited: boolean;
  exclude_upgradable: boolean;
  exclude_non_upgradable: boolean;
  exclude_upgraded: boolean;
  exclude_without_colors: boolean;
  exclude_hosted: boolean;
  sort_by_price: boolean;
  offset: string;
  limit: number;
}

export interface TdlibgetReceivedGift {
  "@type": "getReceivedGift";
  received_gift_id: string;
}

export interface TdlibgetUpgradedGift {
  "@type": "getUpgradedGift";
  name: string;
}

export interface TdlibgetUpgradedGiftValueInfo {
  "@type": "getUpgradedGiftValueInfo";
  name: string;
}

export interface TdlibgetUpgradedGiftWithdrawalUrl {
  "@type": "getUpgradedGiftWithdrawalUrl";
  received_gift_id: string;
  password: string;
}


export interface TdlibsearchGiftsForResale {
  "@type": "searchGiftsForResale";
  gift_id: string;
  order: GiftForResaleOrder;
  attributes: Array<UpgradedGiftAttributeId>;
  offset: string;
  limit: number;
}

export interface TdlibgetGiftCollections {
  "@type": "getGiftCollections";
  owner_id: MessageSender;
}

export interface TdlibcreateGiftCollection {
  "@type": "createGiftCollection";
  owner_id: MessageSender;
  name: string;
  received_gift_ids: Array<string>;
}

export interface TdlibsetGiftCollectionName {
  "@type": "setGiftCollectionName";
  owner_id: MessageSender;
  collection_id: number;
  name: string;
}

export interface TdlibaddGiftCollectionGifts {
  "@type": "addGiftCollectionGifts";
  owner_id: MessageSender;
  collection_id: number;
  received_gift_ids: Array<string>;
}

export interface TdlibremoveGiftCollectionGifts {
  "@type": "removeGiftCollectionGifts";
  owner_id: MessageSender;
  collection_id: number;
  received_gift_ids: Array<string>;
}

export interface TdlibreorderGiftCollectionGifts {
  "@type": "reorderGiftCollectionGifts";
  owner_id: MessageSender;
  collection_id: number;
  received_gift_ids: Array<string>;
}

export interface TdlibcreateInvoiceLink {
  "@type": "createInvoiceLink";
  business_connection_id: string;
  invoice: InputMessageContent;
}


export interface TdlibgetBackgroundUrl {
  "@type": "getBackgroundUrl";
  name: string;
  type: BackgroundType;
}

export interface TdlibsearchBackground {
  "@type": "searchBackground";
  name: string;
}

export interface TdlibsetDefaultBackground {
  "@type": "setDefaultBackground";
  background: InputBackground;
  type: BackgroundType;
  for_dark_theme: boolean;
}

export interface TdlibgetInstalledBackgrounds {
  "@type": "getInstalledBackgrounds";
  for_dark_theme: boolean;
}

export interface TdlibgetLocalizationTargetInfo {
  "@type": "getLocalizationTargetInfo";
  only_local: boolean;
}

export interface TdlibgetLanguagePackInfo {
  "@type": "getLanguagePackInfo";
  language_pack_id: string;
}

export interface TdlibgetLanguagePackStrings {
  "@type": "getLanguagePackStrings";
  language_pack_id: string;
  keys: Array<string>;
}

export interface TdlibregisterDevice {
  "@type": "registerDevice";
  device_token: DeviceToken;
  other_user_ids: Array<number>;
}

export interface TdlibgetPushReceiverId {
  "@type": "getPushReceiverId";
  payload: string;
}

export interface TdlibgetRecentlyVisitedTMeUrls {
  "@type": "getRecentlyVisitedTMeUrls";
  referrer: string;
}

export interface TdlibgetUserPrivacySettingRules {
  "@type": "getUserPrivacySettingRules";
  setting: UserPrivacySetting;
}



export interface TdlibgetPaidMessageRevenue {
  "@type": "getPaidMessageRevenue";
  user_id: number;
}

export interface TdlibcanSendMessageToUser {
  "@type": "canSendMessageToUser";
  user_id: number;
  only_local: boolean;
}

export interface TdlibgetOption {
  "@type": "getOption";
  name: string;
}



export interface TdlibreportChat {
  "@type": "reportChat";
  chat_id: number;
  option_id: string;
  message_ids: Array<number>;
  text: string;
}

export interface TdlibgetChatRevenueStatistics {
  "@type": "getChatRevenueStatistics";
  chat_id: number;
  is_dark: boolean;
}

export interface TdlibgetChatRevenueWithdrawalUrl {
  "@type": "getChatRevenueWithdrawalUrl";
  chat_id: number;
  password: string;
}

export interface TdlibgetChatRevenueTransactions {
  "@type": "getChatRevenueTransactions";
  chat_id: number;
  offset: string;
  limit: number;
}

export interface TdlibgetTonTransactions {
  "@type": "getTonTransactions";
  direction: TransactionDirection;
  offset: string;
  limit: number;
}

export interface TdlibgetStarRevenueStatistics {
  "@type": "getStarRevenueStatistics";
  owner_id: MessageSender;
  is_dark: boolean;
}

export interface TdlibgetStarWithdrawalUrl {
  "@type": "getStarWithdrawalUrl";
  owner_id: MessageSender;
  star_count: number;
  password: string;
}

export interface TdlibgetStarAdAccountUrl {
  "@type": "getStarAdAccountUrl";
  owner_id: MessageSender;
}

export interface TdlibgetTonRevenueStatistics {
  "@type": "getTonRevenueStatistics";
  is_dark: boolean;
}

export interface TdlibgetTonWithdrawalUrl {
  "@type": "getTonWithdrawalUrl";
  password: string;
}

export interface TdlibgetChatStatistics {
  "@type": "getChatStatistics";
  chat_id: number;
  is_dark: boolean;
}

export interface TdlibgetMessageStatistics {
  "@type": "getMessageStatistics";
  chat_id: number;
  message_id: number;
  is_dark: boolean;
}

export interface TdlibgetMessagePublicForwards {
  "@type": "getMessagePublicForwards";
  chat_id: number;
  message_id: number;
  offset: string;
  limit: number;
}

export interface TdlibgetStoryStatistics {
  "@type": "getStoryStatistics";
  chat_id: number;
  story_id: number;
  is_dark: boolean;
}

export interface TdlibgetStatisticalGraph {
  "@type": "getStatisticalGraph";
  chat_id: number;
  token: string;
  x: number;
}

export interface TdlibgetStorageStatistics {
  "@type": "getStorageStatistics";
  chat_limit: number;
}



export interface TdliboptimizeStorage {
  "@type": "optimizeStorage";
  size: number;
  ttl: number;
  count: number;
  immunity_delay: number;
  file_types: Array<FileType>;
  chat_ids: Array<number>;
  exclude_chat_ids: Array<number>;
  return_deleted_file_statistics: boolean;
  chat_limit: number;
}

export interface TdlibgetNetworkStatistics {
  "@type": "getNetworkStatistics";
  only_current: boolean;
}



export interface TdlibgetBankCardInfo {
  "@type": "getBankCardInfo";
  bank_card_number: string;
}

export interface TdlibgetPassportElement {
  "@type": "getPassportElement";
  type: PassportElementType;
  password: string;
}

export interface TdlibgetAllPassportElements {
  "@type": "getAllPassportElements";
  password: string;
}

export interface TdlibsetPassportElement {
  "@type": "setPassportElement";
  element: InputPassportElement;
  password: string;
}

export interface TdlibgetPreferredCountryLanguage {
  "@type": "getPreferredCountryLanguage";
  country_code: string;
}

export interface TdlibsendEmailAddressVerificationCode {
  "@type": "sendEmailAddressVerificationCode";
  email_address: string;
}


export interface TdlibgetPassportAuthorizationForm {
  "@type": "getPassportAuthorizationForm";
  bot_user_id: number;
  scope: string;
  public_key: string;
  nonce: string;
}

export interface TdlibgetPassportAuthorizationFormAvailableElements {
  "@type": "getPassportAuthorizationFormAvailableElements";
  authorization_form_id: number;
  password: string;
}

export interface TdlibuploadStickerFile {
  "@type": "uploadStickerFile";
  user_id: number;
  sticker_format: StickerFormat;
  sticker: InputFile;
}

export interface TdlibgetSuggestedStickerSetName {
  "@type": "getSuggestedStickerSetName";
  title: string;
}

export interface TdlibcheckStickerSetName {
  "@type": "checkStickerSetName";
  name: string;
}

export interface TdlibcreateNewStickerSet {
  "@type": "createNewStickerSet";
  user_id: number;
  title: string;
  name: string;
  sticker_type: StickerType;
  needs_repainting: boolean;
  stickers: Array<InputSticker>;
  source: string;
}

export interface TdlibgetOwnedStickerSets {
  "@type": "getOwnedStickerSets";
  offset_sticker_set_id: string;
  limit: number;
}

export interface TdlibgetMapThumbnailFile {
  "@type": "getMapThumbnailFile";
  location: Location;
  zoom: number;
  width: number;
  height: number;
  scale: number;
  chat_id: number;
}

export interface TdlibgetPremiumLimit {
  "@type": "getPremiumLimit";
  limit_type: PremiumLimitType;
}

export interface TdlibgetPremiumFeatures {
  "@type": "getPremiumFeatures";
  source: PremiumSource;
}


export interface TdlibgetPremiumInfoSticker {
  "@type": "getPremiumInfoSticker";
  month_count: number;
}



export interface TdlibgetPremiumGiveawayPaymentOptions {
  "@type": "getPremiumGiveawayPaymentOptions";
  boosted_chat_id: number;
}

export interface TdlibcheckPremiumGiftCode {
  "@type": "checkPremiumGiftCode";
  code: string;
}

export interface TdlibgetGiveawayInfo {
  "@type": "getGiveawayInfo";
  chat_id: number;
  message_id: number;
}


export interface TdlibgetStarGiftPaymentOptions {
  "@type": "getStarGiftPaymentOptions";
  user_id: number;
}


export interface TdlibgetStarTransactions {
  "@type": "getStarTransactions";
  owner_id: MessageSender;
  subscription_id: string;
  direction: TransactionDirection;
  offset: string;
  limit: number;
}

export interface TdlibgetStarSubscriptions {
  "@type": "getStarSubscriptions";
  only_expiring: boolean;
  offset: string;
}

export interface TdlibsearchChatAffiliateProgram {
  "@type": "searchChatAffiliateProgram";
  username: string;
  referrer: string;
}

export interface TdlibsearchAffiliatePrograms {
  "@type": "searchAffiliatePrograms";
  affiliate: AffiliateType;
  sort_order: AffiliateProgramSortOrder;
  offset: string;
  limit: number;
}

export interface TdlibconnectAffiliateProgram {
  "@type": "connectAffiliateProgram";
  affiliate: AffiliateType;
  bot_user_id: number;
}

export interface TdlibdisconnectAffiliateProgram {
  "@type": "disconnectAffiliateProgram";
  affiliate: AffiliateType;
  url: string;
}

export interface TdlibgetConnectedAffiliateProgram {
  "@type": "getConnectedAffiliateProgram";
  affiliate: AffiliateType;
  bot_user_id: number;
}

export interface TdlibgetConnectedAffiliatePrograms {
  "@type": "getConnectedAffiliatePrograms";
  affiliate: AffiliateType;
  offset: string;
  limit: number;
}

export interface TdlibgetBusinessFeatures {
  "@type": "getBusinessFeatures";
  source: BusinessFeature;
}

export interface TdlibsearchStringsByPrefix {
  "@type": "searchStringsByPrefix";
  strings: Array<string>;
  query: string;
  limit: number;
  return_none_for_empty_query: boolean;
}

export interface TdlibsendCustomRequest {
  "@type": "sendCustomRequest";
  method: string;
  parameters: string;
}



export interface TdlibgetPhoneNumberInfo {
  "@type": "getPhoneNumberInfo";
  phone_number_prefix: string;
}

export interface TdlibgetPhoneNumberInfoSync {
  "@type": "getPhoneNumberInfoSync";
  language_code: string;
  phone_number_prefix: string;
}

export interface TdlibgetCollectibleItemInfo {
  "@type": "getCollectibleItemInfo";
  type: CollectibleItemType;
}

export interface TdlibgetDeepLinkInfo {
  "@type": "getDeepLinkInfo";
  link: string;
}



export interface TdlibaddProxy {
  "@type": "addProxy";
  server: string;
  port: number;
  enable: boolean;
  type: ProxyType;
}

export interface TdlibeditProxy {
  "@type": "editProxy";
  proxy_id: number;
  server: string;
  port: number;
  enable: boolean;
  type: ProxyType;
}


export interface TdlibgetProxyLink {
  "@type": "getProxyLink";
  proxy_id: number;
}

export interface TdlibpingProxy {
  "@type": "pingProxy";
  proxy_id: number;
}




export interface TdlibgetLogTagVerbosityLevel {
  "@type": "getLogTagVerbosityLevel";
  tag: string;
}

export interface TdlibgetUserSupportInfo {
  "@type": "getUserSupportInfo";
  user_id: number;
}

export interface TdlibsetUserSupportInfo {
  "@type": "setUserSupportInfo";
  user_id: number;
  message: FormattedText;
}


export interface TdlibtestCallString {
  "@type": "testCallString";
  x: string;
}

export interface TdlibtestCallBytes {
  "@type": "testCallBytes";
  x: string;
}

export interface TdlibtestCallVectorInt {
  "@type": "testCallVectorInt";
  x: Array<number>;
}

export interface TdlibtestCallVectorIntObject {
  "@type": "testCallVectorIntObject";
  x: Array<TestInt>;
}

export interface TdlibtestCallVectorString {
  "@type": "testCallVectorString";
  x: Array<string>;
}

export interface TdlibtestCallVectorStringObject {
  "@type": "testCallVectorStringObject";
  x: Array<TestString>;
}

export interface TdlibtestSquareInt {
  "@type": "testSquareInt";
  x: number;
}


// Function request types
export interface TdliberrorRequest {
  "@type": "error";
  code: number;
  message: string;
}

export interface TdlibokRequest {
  "@type": "ok";
}

export interface TdlibsetTdlibParametersRequest {
  "@type": "setTdlibParameters";
  use_test_dc: boolean;
  database_directory: string;
  files_directory: string;
  database_encryption_key: string;
  use_file_database: boolean;
  use_chat_info_database: boolean;
  use_message_database: boolean;
  use_secret_chats: boolean;
  api_id: number;
  api_hash: string;
  system_language_code: string;
  device_model: string;
  system_version: string;
  application_version: string;
}

export interface TdlibsetAuthenticationPhoneNumberRequest {
  "@type": "setAuthenticationPhoneNumber";
  phone_number: string;
  settings: PhoneNumberAuthenticationSettings;
}

export interface TdlibcheckAuthenticationPremiumPurchaseRequest {
  "@type": "checkAuthenticationPremiumPurchase";
  currency: string;
  amount: number;
}

export interface TdlibsetAuthenticationPremiumPurchaseTransactionRequest {
  "@type": "setAuthenticationPremiumPurchaseTransaction";
  transaction: StoreTransaction;
  is_restore: boolean;
  currency: string;
  amount: number;
}

export interface TdlibsetAuthenticationEmailAddressRequest {
  "@type": "setAuthenticationEmailAddress";
  email_address: string;
}

export interface TdlibresendAuthenticationCodeRequest {
  "@type": "resendAuthenticationCode";
  reason: ResendCodeReason;
}

export interface TdlibcheckAuthenticationEmailCodeRequest {
  "@type": "checkAuthenticationEmailCode";
  code: EmailAddressAuthentication;
}

export interface TdlibcheckAuthenticationCodeRequest {
  "@type": "checkAuthenticationCode";
  code: string;
}

export interface TdlibrequestQrCodeAuthenticationRequest {
  "@type": "requestQrCodeAuthentication";
  other_user_ids: Array<number>;
}

export interface TdlibcheckAuthenticationPasskeyRequest {
  "@type": "checkAuthenticationPasskey";
  credential_id: string;
  client_data: string;
  authenticator_data: string;
  signature: string;
  user_handle: string;
}

export interface TdlibregisterUserRequest {
  "@type": "registerUser";
  first_name: string;
  last_name: string;
  disable_notification: boolean;
}

export interface TdlibresetAuthenticationEmailAddressRequest {
  "@type": "resetAuthenticationEmailAddress";
}

export interface TdlibcheckAuthenticationPasswordRequest {
  "@type": "checkAuthenticationPassword";
  password: string;
}

export interface TdlibrequestAuthenticationPasswordRecoveryRequest {
  "@type": "requestAuthenticationPasswordRecovery";
}

export interface TdlibcheckAuthenticationPasswordRecoveryCodeRequest {
  "@type": "checkAuthenticationPasswordRecoveryCode";
  recovery_code: string;
}

export interface TdlibrecoverAuthenticationPasswordRequest {
  "@type": "recoverAuthenticationPassword";
  recovery_code: string;
  new_password: string;
  new_hint: string;
}

export interface TdlibsendAuthenticationFirebaseSmsRequest {
  "@type": "sendAuthenticationFirebaseSms";
  token: string;
}

export interface TdlibreportAuthenticationCodeMissingRequest {
  "@type": "reportAuthenticationCodeMissing";
  mobile_network_code: string;
}

export interface TdlibcheckAuthenticationBotTokenRequest {
  "@type": "checkAuthenticationBotToken";
  token: string;
}

export interface TdliblogOutRequest {
  "@type": "logOut";
}

export interface TdlibcloseRequest {
  "@type": "close";
}

export interface TdlibdestroyRequest {
  "@type": "destroy";
}

export interface TdlibsetDatabaseEncryptionKeyRequest {
  "@type": "setDatabaseEncryptionKey";
  new_encryption_key: string;
}

export interface TdlibisLoginEmailAddressRequiredRequest {
  "@type": "isLoginEmailAddressRequired";
}

export interface TdlibcheckLoginEmailAddressCodeRequest {
  "@type": "checkLoginEmailAddressCode";
  code: EmailAddressAuthentication;
}

export interface TdlibcheckPasswordRecoveryCodeRequest {
  "@type": "checkPasswordRecoveryCode";
  recovery_code: string;
}

export interface TdlibcancelPasswordResetRequest {
  "@type": "cancelPasswordReset";
}

export interface TdlibloadChatsRequest {
  "@type": "loadChats";
  chat_list: ChatList;
  limit: number;
}

export interface TdlibopenChatSimilarChatRequest {
  "@type": "openChatSimilarChat";
  chat_id: number;
  opened_chat_id: number;
}

export interface TdlibopenBotSimilarBotRequest {
  "@type": "openBotSimilarBot";
  bot_user_id: number;
  opened_bot_user_id: number;
}

export interface TdlibremoveTopChatRequest {
  "@type": "removeTopChat";
  category: TopChatCategory;
  chat_id: number;
}

export interface TdlibaddRecentlyFoundChatRequest {
  "@type": "addRecentlyFoundChat";
  chat_id: number;
}

export interface TdlibremoveRecentlyFoundChatRequest {
  "@type": "removeRecentlyFoundChat";
  chat_id: number;
}

export interface TdlibclearRecentlyFoundChatsRequest {
  "@type": "clearRecentlyFoundChats";
}

export interface TdlibcheckCreatedPublicChatsLimitRequest {
  "@type": "checkCreatedPublicChatsLimit";
  type: PublicChatType;
}

export interface TdlibloadDirectMessagesChatTopicsRequest {
  "@type": "loadDirectMessagesChatTopics";
  chat_id: number;
  limit: number;
}

export interface TdlibdeleteDirectMessagesChatTopicHistoryRequest {
  "@type": "deleteDirectMessagesChatTopicHistory";
  chat_id: number;
  topic_id: number;
}

export interface TdlibdeleteDirectMessagesChatTopicMessagesByDateRequest {
  "@type": "deleteDirectMessagesChatTopicMessagesByDate";
  chat_id: number;
  topic_id: number;
  min_date: number;
  max_date: number;
}

export interface TdlibsetDirectMessagesChatTopicIsMarkedAsUnreadRequest {
  "@type": "setDirectMessagesChatTopicIsMarkedAsUnread";
  chat_id: number;
  topic_id: number;
  is_marked_as_unread: boolean;
}

export interface TdlibunpinAllDirectMessagesChatTopicMessagesRequest {
  "@type": "unpinAllDirectMessagesChatTopicMessages";
  chat_id: number;
  topic_id: number;
}

export interface TdlibreadAllDirectMessagesChatTopicReactionsRequest {
  "@type": "readAllDirectMessagesChatTopicReactions";
  chat_id: number;
  topic_id: number;
}

export interface TdlibtoggleDirectMessagesChatTopicCanSendUnpaidMessagesRequest {
  "@type": "toggleDirectMessagesChatTopicCanSendUnpaidMessages";
  chat_id: number;
  topic_id: number;
  can_send_unpaid_messages: boolean;
  refund_payments: boolean;
}

export interface TdlibloadSavedMessagesTopicsRequest {
  "@type": "loadSavedMessagesTopics";
  limit: number;
}

export interface TdlibdeleteSavedMessagesTopicHistoryRequest {
  "@type": "deleteSavedMessagesTopicHistory";
  saved_messages_topic_id: number;
}

export interface TdlibdeleteSavedMessagesTopicMessagesByDateRequest {
  "@type": "deleteSavedMessagesTopicMessagesByDate";
  saved_messages_topic_id: number;
  min_date: number;
  max_date: number;
}

export interface TdlibtoggleSavedMessagesTopicIsPinnedRequest {
  "@type": "toggleSavedMessagesTopicIsPinned";
  saved_messages_topic_id: number;
  is_pinned: boolean;
}

export interface TdlibsetPinnedSavedMessagesTopicsRequest {
  "@type": "setPinnedSavedMessagesTopics";
  saved_messages_topic_ids: Array<number>;
}

export interface TdlibdeleteChatHistoryRequest {
  "@type": "deleteChatHistory";
  chat_id: number;
  remove_from_chat_list: boolean;
  revoke: boolean;
}

export interface TdlibdeleteChatRequest {
  "@type": "deleteChat";
  chat_id: number;
}

export interface TdlibremoveSearchedForTagRequest {
  "@type": "removeSearchedForTag";
  tag: string;
}

export interface TdlibclearSearchedForTagsRequest {
  "@type": "clearSearchedForTags";
  clear_cashtags: boolean;
}

export interface TdlibdeleteAllCallMessagesRequest {
  "@type": "deleteAllCallMessages";
  revoke: boolean;
}

export interface TdlibclickChatSponsoredMessageRequest {
  "@type": "clickChatSponsoredMessage";
  chat_id: number;
  message_id: number;
  is_media_click: boolean;
  from_fullscreen: boolean;
}

export interface TdlibviewSponsoredChatRequest {
  "@type": "viewSponsoredChat";
  sponsored_chat_unique_id: number;
}

export interface TdlibopenSponsoredChatRequest {
  "@type": "openSponsoredChat";
  sponsored_chat_unique_id: number;
}

export interface TdlibviewVideoMessageAdvertisementRequest {
  "@type": "viewVideoMessageAdvertisement";
  advertisement_unique_id: number;
}

export interface TdlibclickVideoMessageAdvertisementRequest {
  "@type": "clickVideoMessageAdvertisement";
  advertisement_unique_id: number;
}

export interface TdlibremoveNotificationRequest {
  "@type": "removeNotification";
  notification_group_id: number;
  notification_id: number;
}

export interface TdlibremoveNotificationGroupRequest {
  "@type": "removeNotificationGroup";
  notification_group_id: number;
  max_notification_id: number;
}

export interface TdlibrecognizeSpeechRequest {
  "@type": "recognizeSpeech";
  chat_id: number;
  message_id: number;
}

export interface TdlibrateSpeechRecognitionRequest {
  "@type": "rateSpeechRecognition";
  chat_id: number;
  message_id: number;
  is_good: boolean;
}

export interface TdlibsetChatMessageSenderRequest {
  "@type": "setChatMessageSender";
  chat_id: number;
  message_sender_id: MessageSender;
}

export interface TdlibdeleteMessagesRequest {
  "@type": "deleteMessages";
  chat_id: number;
  message_ids: Array<number>;
  revoke: boolean;
}

export interface TdlibdeleteChatMessagesBySenderRequest {
  "@type": "deleteChatMessagesBySender";
  chat_id: number;
  sender_id: MessageSender;
}

export interface TdlibdeleteChatMessagesByDateRequest {
  "@type": "deleteChatMessagesByDate";
  chat_id: number;
  min_date: number;
  max_date: number;
  revoke: boolean;
}

export interface TdlibeditInlineMessageTextRequest {
  "@type": "editInlineMessageText";
  inline_message_id: string;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibeditInlineMessageLiveLocationRequest {
  "@type": "editInlineMessageLiveLocation";
  inline_message_id: string;
  reply_markup: ReplyMarkup;
  location: Location;
  live_period: number;
  heading: number;
  proximity_alert_radius: number;
}

export interface TdlibeditInlineMessageMediaRequest {
  "@type": "editInlineMessageMedia";
  inline_message_id: string;
  reply_markup: ReplyMarkup;
  input_message_content: InputMessageContent;
}

export interface TdlibeditInlineMessageCaptionRequest {
  "@type": "editInlineMessageCaption";
  inline_message_id: string;
  reply_markup: ReplyMarkup;
  caption: FormattedText;
  show_caption_above_media: boolean;
}

export interface TdlibeditInlineMessageReplyMarkupRequest {
  "@type": "editInlineMessageReplyMarkup";
  inline_message_id: string;
  reply_markup: ReplyMarkup;
}

export interface TdlibeditMessageSchedulingStateRequest {
  "@type": "editMessageSchedulingState";
  chat_id: number;
  message_id: number;
  scheduling_state: MessageSchedulingState;
}

export interface TdlibsetMessageFactCheckRequest {
  "@type": "setMessageFactCheck";
  chat_id: number;
  message_id: number;
  text: FormattedText;
}

export interface TdlibsetBusinessMessageIsPinnedRequest {
  "@type": "setBusinessMessageIsPinned";
  business_connection_id: string;
  chat_id: number;
  message_id: number;
  is_pinned: boolean;
}

export interface TdlibreadBusinessMessageRequest {
  "@type": "readBusinessMessage";
  business_connection_id: string;
  chat_id: number;
  message_id: number;
}

export interface TdlibdeleteBusinessMessagesRequest {
  "@type": "deleteBusinessMessages";
  business_connection_id: string;
  message_ids: Array<number>;
}

export interface TdlibdeleteBusinessStoryRequest {
  "@type": "deleteBusinessStory";
  business_connection_id: string;
  story_id: number;
}

export interface TdlibsetBusinessAccountNameRequest {
  "@type": "setBusinessAccountName";
  business_connection_id: string;
  first_name: string;
  last_name: string;
}

export interface TdlibsetBusinessAccountBioRequest {
  "@type": "setBusinessAccountBio";
  business_connection_id: string;
  bio: string;
}

export interface TdlibsetBusinessAccountProfilePhotoRequest {
  "@type": "setBusinessAccountProfilePhoto";
  business_connection_id: string;
  photo: InputChatPhoto;
  is_public: boolean;
}

export interface TdlibsetBusinessAccountUsernameRequest {
  "@type": "setBusinessAccountUsername";
  business_connection_id: string;
  username: string;
}

export interface TdlibsetBusinessAccountGiftSettingsRequest {
  "@type": "setBusinessAccountGiftSettings";
  business_connection_id: string;
  settings: GiftSettings;
}

export interface TdlibtransferBusinessAccountStarsRequest {
  "@type": "transferBusinessAccountStars";
  business_connection_id: string;
  star_count: number;
}

export interface TdlibcheckQuickReplyShortcutNameRequest {
  "@type": "checkQuickReplyShortcutName";
  name: string;
}

export interface TdlibloadQuickReplyShortcutsRequest {
  "@type": "loadQuickReplyShortcuts";
}

export interface TdlibsetQuickReplyShortcutNameRequest {
  "@type": "setQuickReplyShortcutName";
  shortcut_id: number;
  name: string;
}

export interface TdlibdeleteQuickReplyShortcutRequest {
  "@type": "deleteQuickReplyShortcut";
  shortcut_id: number;
}

export interface TdlibreorderQuickReplyShortcutsRequest {
  "@type": "reorderQuickReplyShortcuts";
  shortcut_ids: Array<number>;
}

export interface TdlibloadQuickReplyShortcutMessagesRequest {
  "@type": "loadQuickReplyShortcutMessages";
  shortcut_id: number;
}

export interface TdlibdeleteQuickReplyShortcutMessagesRequest {
  "@type": "deleteQuickReplyShortcutMessages";
  shortcut_id: number;
  message_ids: Array<number>;
}

export interface TdlibeditQuickReplyMessageRequest {
  "@type": "editQuickReplyMessage";
  shortcut_id: number;
  message_id: number;
  input_message_content: InputMessageContent;
}

export interface TdlibeditForumTopicRequest {
  "@type": "editForumTopic";
  chat_id: number;
  forum_topic_id: number;
  name: string;
  edit_icon_custom_emoji: boolean;
  icon_custom_emoji_id: string;
}

export interface TdlibsetForumTopicNotificationSettingsRequest {
  "@type": "setForumTopicNotificationSettings";
  chat_id: number;
  forum_topic_id: number;
  notification_settings: ChatNotificationSettings;
}

export interface TdlibtoggleForumTopicIsClosedRequest {
  "@type": "toggleForumTopicIsClosed";
  chat_id: number;
  forum_topic_id: number;
  is_closed: boolean;
}

export interface TdlibtoggleGeneralForumTopicIsHiddenRequest {
  "@type": "toggleGeneralForumTopicIsHidden";
  chat_id: number;
  is_hidden: boolean;
}

export interface TdlibtoggleForumTopicIsPinnedRequest {
  "@type": "toggleForumTopicIsPinned";
  chat_id: number;
  forum_topic_id: number;
  is_pinned: boolean;
}

export interface TdlibsetPinnedForumTopicsRequest {
  "@type": "setPinnedForumTopics";
  chat_id: number;
  forum_topic_ids: Array<number>;
}

export interface TdlibdeleteForumTopicRequest {
  "@type": "deleteForumTopic";
  chat_id: number;
  forum_topic_id: number;
}

export interface TdlibreadAllForumTopicMentionsRequest {
  "@type": "readAllForumTopicMentions";
  chat_id: number;
  forum_topic_id: number;
}

export interface TdlibreadAllForumTopicReactionsRequest {
  "@type": "readAllForumTopicReactions";
  chat_id: number;
  forum_topic_id: number;
}

export interface TdlibunpinAllForumTopicMessagesRequest {
  "@type": "unpinAllForumTopicMessages";
  chat_id: number;
  forum_topic_id: number;
}

export interface TdlibremoveLoginPasskeyRequest {
  "@type": "removeLoginPasskey";
  passkey_id: string;
}

export interface TdlibclearRecentReactionsRequest {
  "@type": "clearRecentReactions";
}

export interface TdlibaddMessageReactionRequest {
  "@type": "addMessageReaction";
  chat_id: number;
  message_id: number;
  reaction_type: ReactionType;
  is_big: boolean;
  update_recent_reactions: boolean;
}

export interface TdlibremoveMessageReactionRequest {
  "@type": "removeMessageReaction";
  chat_id: number;
  message_id: number;
  reaction_type: ReactionType;
}

export interface TdlibaddPendingPaidMessageReactionRequest {
  "@type": "addPendingPaidMessageReaction";
  chat_id: number;
  message_id: number;
  star_count: number;
  type: PaidReactionType;
}

export interface TdlibcommitPendingPaidMessageReactionsRequest {
  "@type": "commitPendingPaidMessageReactions";
  chat_id: number;
  message_id: number;
}

export interface TdlibremovePendingPaidMessageReactionsRequest {
  "@type": "removePendingPaidMessageReactions";
  chat_id: number;
  message_id: number;
}

export interface TdlibsetPaidMessageReactionTypeRequest {
  "@type": "setPaidMessageReactionType";
  chat_id: number;
  message_id: number;
  type: PaidReactionType;
}

export interface TdlibsetMessageReactionsRequest {
  "@type": "setMessageReactions";
  chat_id: number;
  message_id: number;
  reaction_types: Array<ReactionType>;
  is_big: boolean;
}

export interface TdlibsetDefaultReactionTypeRequest {
  "@type": "setDefaultReactionType";
  reaction_type: ReactionType;
}

export interface TdlibsetSavedMessagesTagLabelRequest {
  "@type": "setSavedMessagesTagLabel";
  tag: ReactionType;
  label: string;
}

export interface TdlibsetPollAnswerRequest {
  "@type": "setPollAnswer";
  chat_id: number;
  message_id: number;
  option_ids: Array<number>;
}

export interface TdlibstopPollRequest {
  "@type": "stopPoll";
  chat_id: number;
  message_id: number;
  reply_markup: ReplyMarkup;
}

export interface TdlibaddChecklistTasksRequest {
  "@type": "addChecklistTasks";
  chat_id: number;
  message_id: number;
  tasks: Array<InputChecklistTask>;
}

export interface TdlibmarkChecklistTasksAsDoneRequest {
  "@type": "markChecklistTasksAsDone";
  chat_id: number;
  message_id: number;
  marked_as_done_task_ids: Array<number>;
  marked_as_not_done_task_ids: Array<number>;
}

export interface TdlibhideSuggestedActionRequest {
  "@type": "hideSuggestedAction";
  action: SuggestedAction;
}

export interface TdlibhideContactCloseBirthdaysRequest {
  "@type": "hideContactCloseBirthdays";
}

export interface TdlibshareUsersWithBotRequest {
  "@type": "shareUsersWithBot";
  chat_id: number;
  message_id: number;
  button_id: number;
  shared_user_ids: Array<number>;
  only_check: boolean;
}

export interface TdlibshareChatWithBotRequest {
  "@type": "shareChatWithBot";
  chat_id: number;
  message_id: number;
  button_id: number;
  shared_chat_id: number;
  only_check: boolean;
}

export interface TdlibanswerInlineQueryRequest {
  "@type": "answerInlineQuery";
  inline_query_id: string;
  is_personal: boolean;
  button: InlineQueryResultsButton;
  results: Array<InputInlineQueryResult>;
  cache_time: number;
  next_offset: string;
}

export interface TdlibsendWebAppDataRequest {
  "@type": "sendWebAppData";
  bot_user_id: number;
  button_text: string;
  data: string;
}

export interface TdlibcloseWebAppRequest {
  "@type": "closeWebApp";
  web_app_launch_id: string;
}

export interface TdlibcheckWebAppFileDownloadRequest {
  "@type": "checkWebAppFileDownload";
  bot_user_id: number;
  file_name: string;
  url: string;
}

export interface TdlibanswerCallbackQueryRequest {
  "@type": "answerCallbackQuery";
  callback_query_id: string;
  text: string;
  show_alert: boolean;
  url: string;
  cache_time: number;
}

export interface TdlibanswerShippingQueryRequest {
  "@type": "answerShippingQuery";
  shipping_query_id: string;
  shipping_options: Array<ShippingOption>;
  error_message: string;
}

export interface TdlibanswerPreCheckoutQueryRequest {
  "@type": "answerPreCheckoutQuery";
  pre_checkout_query_id: string;
  error_message: string;
}

export interface TdlibsetInlineGameScoreRequest {
  "@type": "setInlineGameScore";
  inline_message_id: string;
  edit_message: boolean;
  user_id: number;
  score: number;
  force: boolean;
}

export interface TdlibdeleteChatReplyMarkupRequest {
  "@type": "deleteChatReplyMarkup";
  chat_id: number;
  message_id: number;
}

export interface TdlibsendChatActionRequest {
  "@type": "sendChatAction";
  chat_id: number;
  topic_id: MessageTopic;
  business_connection_id: string;
  action: ChatAction;
}

export interface TdlibsendTextMessageDraftRequest {
  "@type": "sendTextMessageDraft";
  chat_id: number;
  forum_topic_id: number;
  draft_id: string;
  text: FormattedText;
}

export interface TdlibopenChatRequest {
  "@type": "openChat";
  chat_id: number;
}

export interface TdlibcloseChatRequest {
  "@type": "closeChat";
  chat_id: number;
}

export interface TdlibviewMessagesRequest {
  "@type": "viewMessages";
  chat_id: number;
  message_ids: Array<number>;
  source: MessageSource;
  force_read: boolean;
}

export interface TdlibopenMessageContentRequest {
  "@type": "openMessageContent";
  chat_id: number;
  message_id: number;
}

export interface TdlibreadAllChatMentionsRequest {
  "@type": "readAllChatMentions";
  chat_id: number;
}

export interface TdlibreadAllChatReactionsRequest {
  "@type": "readAllChatReactions";
  chat_id: number;
}

export interface TdlibaddChatToListRequest {
  "@type": "addChatToList";
  chat_id: number;
  chat_list: ChatList;
}

export interface TdlibdeleteChatFolderRequest {
  "@type": "deleteChatFolder";
  chat_folder_id: number;
  leave_chat_ids: Array<number>;
}

export interface TdlibreorderChatFoldersRequest {
  "@type": "reorderChatFolders";
  chat_folder_ids: Array<number>;
  main_chat_list_position: number;
}

export interface TdlibtoggleChatFolderTagsRequest {
  "@type": "toggleChatFolderTags";
  are_tags_enabled: boolean;
}

export interface TdlibdeleteChatFolderInviteLinkRequest {
  "@type": "deleteChatFolderInviteLink";
  chat_folder_id: number;
  invite_link: string;
}

export interface TdlibaddChatFolderByInviteLinkRequest {
  "@type": "addChatFolderByInviteLink";
  invite_link: string;
  chat_ids: Array<number>;
}

export interface TdlibprocessChatFolderNewChatsRequest {
  "@type": "processChatFolderNewChats";
  chat_folder_id: number;
  added_chat_ids: Array<number>;
}

export interface TdlibsetArchiveChatListSettingsRequest {
  "@type": "setArchiveChatListSettings";
  settings: ArchiveChatListSettings;
}

export interface TdlibsetChatTitleRequest {
  "@type": "setChatTitle";
  chat_id: number;
  title: string;
}

export interface TdlibsetChatPhotoRequest {
  "@type": "setChatPhoto";
  chat_id: number;
  photo: InputChatPhoto;
}

export interface TdlibsetChatAccentColorRequest {
  "@type": "setChatAccentColor";
  chat_id: number;
  accent_color_id: number;
  background_custom_emoji_id: string;
}

export interface TdlibsetChatProfileAccentColorRequest {
  "@type": "setChatProfileAccentColor";
  chat_id: number;
  profile_accent_color_id: number;
  profile_background_custom_emoji_id: string;
}

export interface TdlibsetChatMessageAutoDeleteTimeRequest {
  "@type": "setChatMessageAutoDeleteTime";
  chat_id: number;
  message_auto_delete_time: number;
}

export interface TdlibsetChatEmojiStatusRequest {
  "@type": "setChatEmojiStatus";
  chat_id: number;
  emoji_status: EmojiStatus;
}

export interface TdlibsetChatPermissionsRequest {
  "@type": "setChatPermissions";
  chat_id: number;
  permissions: ChatPermissions;
}

export interface TdlibsetChatBackgroundRequest {
  "@type": "setChatBackground";
  chat_id: number;
  background: InputBackground;
  type: BackgroundType;
  dark_theme_dimming: number;
  only_for_self: boolean;
}

export interface TdlibdeleteChatBackgroundRequest {
  "@type": "deleteChatBackground";
  chat_id: number;
  restore_previous: boolean;
}

export interface TdlibsetChatThemeRequest {
  "@type": "setChatTheme";
  chat_id: number;
  theme: InputChatTheme;
}

export interface TdlibsetChatDraftMessageRequest {
  "@type": "setChatDraftMessage";
  chat_id: number;
  topic_id: MessageTopic;
  draft_message: DraftMessage;
}

export interface TdlibsetChatNotificationSettingsRequest {
  "@type": "setChatNotificationSettings";
  chat_id: number;
  notification_settings: ChatNotificationSettings;
}

export interface TdlibtoggleChatHasProtectedContentRequest {
  "@type": "toggleChatHasProtectedContent";
  chat_id: number;
  has_protected_content: boolean;
}

export interface TdlibtoggleChatViewAsTopicsRequest {
  "@type": "toggleChatViewAsTopics";
  chat_id: number;
  view_as_topics: boolean;
}

export interface TdlibtoggleChatIsTranslatableRequest {
  "@type": "toggleChatIsTranslatable";
  chat_id: number;
  is_translatable: boolean;
}

export interface TdlibtoggleChatIsMarkedAsUnreadRequest {
  "@type": "toggleChatIsMarkedAsUnread";
  chat_id: number;
  is_marked_as_unread: boolean;
}

export interface TdlibtoggleChatDefaultDisableNotificationRequest {
  "@type": "toggleChatDefaultDisableNotification";
  chat_id: number;
  default_disable_notification: boolean;
}

export interface TdlibsetChatAvailableReactionsRequest {
  "@type": "setChatAvailableReactions";
  chat_id: number;
  available_reactions: ChatAvailableReactions;
}

export interface TdlibsetChatClientDataRequest {
  "@type": "setChatClientData";
  chat_id: number;
  client_data: string;
}

export interface TdlibsetChatDescriptionRequest {
  "@type": "setChatDescription";
  chat_id: number;
  description: string;
}

export interface TdlibsetChatDiscussionGroupRequest {
  "@type": "setChatDiscussionGroup";
  chat_id: number;
  discussion_chat_id: number;
}

export interface TdlibsetChatDirectMessagesGroupRequest {
  "@type": "setChatDirectMessagesGroup";
  chat_id: number;
  is_enabled: boolean;
  paid_message_star_count: number;
}

export interface TdlibsetChatLocationRequest {
  "@type": "setChatLocation";
  chat_id: number;
  location: ChatLocation;
}

export interface TdlibsetChatSlowModeDelayRequest {
  "@type": "setChatSlowModeDelay";
  chat_id: number;
  slow_mode_delay: number;
}

export interface TdlibpinChatMessageRequest {
  "@type": "pinChatMessage";
  chat_id: number;
  message_id: number;
  disable_notification: boolean;
  only_for_self: boolean;
}

export interface TdlibunpinChatMessageRequest {
  "@type": "unpinChatMessage";
  chat_id: number;
  message_id: number;
}

export interface TdlibunpinAllChatMessagesRequest {
  "@type": "unpinAllChatMessages";
  chat_id: number;
}

export interface TdlibjoinChatRequest {
  "@type": "joinChat";
  chat_id: number;
}

export interface TdlibleaveChatRequest {
  "@type": "leaveChat";
  chat_id: number;
}

export interface TdlibsetChatMemberStatusRequest {
  "@type": "setChatMemberStatus";
  chat_id: number;
  member_id: MessageSender;
  status: ChatMemberStatus;
}

export interface TdlibbanChatMemberRequest {
  "@type": "banChatMember";
  chat_id: number;
  member_id: MessageSender;
  banned_until_date: number;
  revoke_messages: boolean;
}

export interface TdlibtransferChatOwnershipRequest {
  "@type": "transferChatOwnership";
  chat_id: number;
  user_id: number;
  password: string;
}

export interface TdlibclearAllDraftMessagesRequest {
  "@type": "clearAllDraftMessages";
  exclude_secret_chats: boolean;
}

export interface TdlibremoveSavedNotificationSoundRequest {
  "@type": "removeSavedNotificationSound";
  notification_sound_id: string;
}

export interface TdlibsetScopeNotificationSettingsRequest {
  "@type": "setScopeNotificationSettings";
  scope: NotificationSettingsScope;
  notification_settings: ScopeNotificationSettings;
}

export interface TdlibsetReactionNotificationSettingsRequest {
  "@type": "setReactionNotificationSettings";
  notification_settings: ReactionNotificationSettings;
}

export interface TdlibresetAllNotificationSettingsRequest {
  "@type": "resetAllNotificationSettings";
}

export interface TdlibtoggleChatIsPinnedRequest {
  "@type": "toggleChatIsPinned";
  chat_list: ChatList;
  chat_id: number;
  is_pinned: boolean;
}

export interface TdlibsetPinnedChatsRequest {
  "@type": "setPinnedChats";
  chat_list: ChatList;
  chat_ids: Array<number>;
}

export interface TdlibreadChatListRequest {
  "@type": "readChatList";
  chat_list: ChatList;
}

export interface TdlibeditStoryRequest {
  "@type": "editStory";
  story_poster_chat_id: number;
  story_id: number;
  content: InputStoryContent;
  areas: InputStoryAreas;
  caption: FormattedText;
}

export interface TdlibeditStoryCoverRequest {
  "@type": "editStoryCover";
  story_poster_chat_id: number;
  story_id: number;
  cover_frame_timestamp: number;
}

export interface TdlibsetStoryPrivacySettingsRequest {
  "@type": "setStoryPrivacySettings";
  story_id: number;
  privacy_settings: StoryPrivacySettings;
}

export interface TdlibtoggleStoryIsPostedToChatPageRequest {
  "@type": "toggleStoryIsPostedToChatPage";
  story_poster_chat_id: number;
  story_id: number;
  is_posted_to_chat_page: boolean;
}

export interface TdlibdeleteStoryRequest {
  "@type": "deleteStory";
  story_poster_chat_id: number;
  story_id: number;
}

export interface TdlibloadActiveStoriesRequest {
  "@type": "loadActiveStories";
  story_list: StoryList;
}

export interface TdlibsetChatActiveStoriesListRequest {
  "@type": "setChatActiveStoriesList";
  chat_id: number;
  story_list: StoryList;
}

export interface TdlibsetChatPinnedStoriesRequest {
  "@type": "setChatPinnedStories";
  chat_id: number;
  story_ids: Array<number>;
}

export interface TdlibopenStoryRequest {
  "@type": "openStory";
  story_poster_chat_id: number;
  story_id: number;
}

export interface TdlibcloseStoryRequest {
  "@type": "closeStory";
  story_poster_chat_id: number;
  story_id: number;
}

export interface TdlibsetStoryReactionRequest {
  "@type": "setStoryReaction";
  story_poster_chat_id: number;
  story_id: number;
  reaction_type: ReactionType;
  update_recent_reactions: boolean;
}

export interface TdlibactivateStoryStealthModeRequest {
  "@type": "activateStoryStealthMode";
}

export interface TdlibreorderStoryAlbumsRequest {
  "@type": "reorderStoryAlbums";
  chat_id: number;
  story_album_ids: Array<number>;
}

export interface TdlibdeleteStoryAlbumRequest {
  "@type": "deleteStoryAlbum";
  chat_id: number;
  story_album_id: number;
}

export interface TdlibtoggleBotIsAddedToAttachmentMenuRequest {
  "@type": "toggleBotIsAddedToAttachmentMenu";
  bot_user_id: number;
  is_added: boolean;
  allow_write_access: boolean;
}

export interface TdlibclearRecentEmojiStatusesRequest {
  "@type": "clearRecentEmojiStatuses";
}

export interface TdlibcancelDownloadFileRequest {
  "@type": "cancelDownloadFile";
  file_id: number;
  only_if_pending: boolean;
}

export interface TdlibcancelPreliminaryUploadFileRequest {
  "@type": "cancelPreliminaryUploadFile";
  file_id: number;
}

export interface TdlibwriteGeneratedFilePartRequest {
  "@type": "writeGeneratedFilePart";
  generation_id: string;
  offset: number;
  data: string;
}

export interface TdlibsetFileGenerationProgressRequest {
  "@type": "setFileGenerationProgress";
  generation_id: string;
  expected_size: number;
  local_prefix_size: number;
}

export interface TdlibfinishFileGenerationRequest {
  "@type": "finishFileGeneration";
  generation_id: string;
  error: Error;
}

export interface TdlibdeleteFileRequest {
  "@type": "deleteFile";
  file_id: number;
}

export interface TdlibtoggleDownloadIsPausedRequest {
  "@type": "toggleDownloadIsPaused";
  file_id: number;
  is_paused: boolean;
}

export interface TdlibtoggleAllDownloadsArePausedRequest {
  "@type": "toggleAllDownloadsArePaused";
  are_paused: boolean;
}

export interface TdlibremoveFileFromDownloadsRequest {
  "@type": "removeFileFromDownloads";
  file_id: number;
  delete_from_cache: boolean;
}

export interface TdlibremoveAllFilesFromDownloadsRequest {
  "@type": "removeAllFilesFromDownloads";
  only_active: boolean;
  only_completed: boolean;
  delete_from_cache: boolean;
}

export interface TdlibsetApplicationVerificationTokenRequest {
  "@type": "setApplicationVerificationToken";
  verification_id: number;
  token: string;
}

export interface TdlibimportMessagesRequest {
  "@type": "importMessages";
  chat_id: number;
  message_file: InputFile;
  attached_files: Array<InputFile>;
}

export interface TdlibdeleteRevokedChatInviteLinkRequest {
  "@type": "deleteRevokedChatInviteLink";
  chat_id: number;
  invite_link: string;
}

export interface TdlibdeleteAllRevokedChatInviteLinksRequest {
  "@type": "deleteAllRevokedChatInviteLinks";
  chat_id: number;
  creator_user_id: number;
}

export interface TdlibprocessChatJoinRequestRequest {
  "@type": "processChatJoinRequest";
  chat_id: number;
  user_id: number;
  approve: boolean;
}

export interface TdlibprocessChatJoinRequestsRequest {
  "@type": "processChatJoinRequests";
  chat_id: number;
  invite_link: string;
  approve: boolean;
}

export interface TdlibapproveSuggestedPostRequest {
  "@type": "approveSuggestedPost";
  chat_id: number;
  message_id: number;
  send_date: number;
}

export interface TdlibdeclineSuggestedPostRequest {
  "@type": "declineSuggestedPost";
  chat_id: number;
  message_id: number;
  comment: string;
}

export interface TdlibacceptCallRequest {
  "@type": "acceptCall";
  call_id: number;
  protocol: CallProtocol;
}

export interface TdlibsendCallSignalingDataRequest {
  "@type": "sendCallSignalingData";
  call_id: number;
  data: string;
}

export interface TdlibdiscardCallRequest {
  "@type": "discardCall";
  call_id: number;
  is_disconnected: boolean;
  invite_link: string;
  duration: number;
  is_video: boolean;
  connection_id: string;
}

export interface TdlibsendCallRatingRequest {
  "@type": "sendCallRating";
  call_id: number;
  rating: number;
  comment: string;
  problems: Array<CallProblem>;
}

export interface TdlibsendCallDebugInformationRequest {
  "@type": "sendCallDebugInformation";
  call_id: number;
  debug_information: string;
}

export interface TdlibsendCallLogRequest {
  "@type": "sendCallLog";
  call_id: number;
  log_file: InputFile;
}

export interface TdlibsetVideoChatDefaultParticipantRequest {
  "@type": "setVideoChatDefaultParticipant";
  chat_id: number;
  default_participant_id: MessageSender;
}

export interface TdlibstartScheduledVideoChatRequest {
  "@type": "startScheduledVideoChat";
  group_call_id: number;
}

export interface TdlibtoggleVideoChatEnabledStartNotificationRequest {
  "@type": "toggleVideoChatEnabledStartNotification";
  group_call_id: number;
  enabled_start_notification: boolean;
}

export interface TdlibtoggleGroupCallScreenSharingIsPausedRequest {
  "@type": "toggleGroupCallScreenSharingIsPaused";
  group_call_id: number;
  is_paused: boolean;
}

export interface TdlibendGroupCallScreenSharingRequest {
  "@type": "endGroupCallScreenSharing";
  group_call_id: number;
}

export interface TdlibsetVideoChatTitleRequest {
  "@type": "setVideoChatTitle";
  group_call_id: number;
  title: string;
}

export interface TdlibtoggleVideoChatMuteNewParticipantsRequest {
  "@type": "toggleVideoChatMuteNewParticipants";
  group_call_id: number;
  mute_new_participants: boolean;
}

export interface TdlibtoggleGroupCallAreMessagesAllowedRequest {
  "@type": "toggleGroupCallAreMessagesAllowed";
  group_call_id: number;
  are_messages_allowed: boolean;
}

export interface TdlibsetLiveStoryMessageSenderRequest {
  "@type": "setLiveStoryMessageSender";
  group_call_id: number;
  message_sender_id: MessageSender;
}

export interface TdlibsendGroupCallMessageRequest {
  "@type": "sendGroupCallMessage";
  group_call_id: number;
  text: FormattedText;
  paid_message_star_count: number;
}

export interface TdlibaddPendingLiveStoryReactionRequest {
  "@type": "addPendingLiveStoryReaction";
  group_call_id: number;
  star_count: number;
}

export interface TdlibcommitPendingLiveStoryReactionsRequest {
  "@type": "commitPendingLiveStoryReactions";
  group_call_id: number;
}

export interface TdlibremovePendingLiveStoryReactionsRequest {
  "@type": "removePendingLiveStoryReactions";
  group_call_id: number;
}

export interface TdlibdeleteGroupCallMessagesRequest {
  "@type": "deleteGroupCallMessages";
  group_call_id: number;
  message_ids: Array<number>;
  report_spam: boolean;
}

export interface TdlibdeleteGroupCallMessagesBySenderRequest {
  "@type": "deleteGroupCallMessagesBySender";
  group_call_id: number;
  sender_id: MessageSender;
  report_spam: boolean;
}

export interface TdlibdeclineGroupCallInvitationRequest {
  "@type": "declineGroupCallInvitation";
  chat_id: number;
  message_id: number;
}

export interface TdlibbanGroupCallParticipantsRequest {
  "@type": "banGroupCallParticipants";
  group_call_id: number;
  user_ids: Array<string>;
}

export interface TdlibinviteVideoChatParticipantsRequest {
  "@type": "inviteVideoChatParticipants";
  group_call_id: number;
  user_ids: Array<number>;
}

export interface TdlibrevokeGroupCallInviteLinkRequest {
  "@type": "revokeGroupCallInviteLink";
  group_call_id: number;
}

export interface TdlibstartGroupCallRecordingRequest {
  "@type": "startGroupCallRecording";
  group_call_id: number;
  title: string;
  record_video: boolean;
  use_portrait_orientation: boolean;
}

export interface TdlibendGroupCallRecordingRequest {
  "@type": "endGroupCallRecording";
  group_call_id: number;
}

export interface TdlibtoggleGroupCallIsMyVideoPausedRequest {
  "@type": "toggleGroupCallIsMyVideoPaused";
  group_call_id: number;
  is_my_video_paused: boolean;
}

export interface TdlibtoggleGroupCallIsMyVideoEnabledRequest {
  "@type": "toggleGroupCallIsMyVideoEnabled";
  group_call_id: number;
  is_my_video_enabled: boolean;
}

export interface TdlibsetGroupCallPaidMessageStarCountRequest {
  "@type": "setGroupCallPaidMessageStarCount";
  group_call_id: number;
  paid_message_star_count: number;
}

export interface TdlibtoggleGroupCallParticipantIsMutedRequest {
  "@type": "toggleGroupCallParticipantIsMuted";
  group_call_id: number;
  participant_id: MessageSender;
  is_muted: boolean;
}

export interface TdlibsetGroupCallParticipantVolumeLevelRequest {
  "@type": "setGroupCallParticipantVolumeLevel";
  group_call_id: number;
  participant_id: MessageSender;
  volume_level: number;
}

export interface TdlibtoggleGroupCallParticipantIsHandRaisedRequest {
  "@type": "toggleGroupCallParticipantIsHandRaised";
  group_call_id: number;
  participant_id: MessageSender;
  is_hand_raised: boolean;
}

export interface TdlibloadGroupCallParticipantsRequest {
  "@type": "loadGroupCallParticipants";
  group_call_id: number;
  limit: number;
}

export interface TdlibleaveGroupCallRequest {
  "@type": "leaveGroupCall";
  group_call_id: number;
}

export interface TdlibendGroupCallRequest {
  "@type": "endGroupCall";
  group_call_id: number;
}

export interface TdlibsetMessageSenderBlockListRequest {
  "@type": "setMessageSenderBlockList";
  sender_id: MessageSender;
  block_list: BlockList;
}

export interface TdlibblockMessageSenderFromRepliesRequest {
  "@type": "blockMessageSenderFromReplies";
  message_id: number;
  delete_message: boolean;
  delete_all_messages: boolean;
  report_spam: boolean;
}

export interface TdlibaddContactRequest {
  "@type": "addContact";
  user_id: number;
  contact: ImportedContact;
  share_phone_number: boolean;
}

export interface TdlibremoveContactsRequest {
  "@type": "removeContacts";
  user_ids: Array<number>;
}

export interface TdlibclearImportedContactsRequest {
  "@type": "clearImportedContacts";
}

export interface TdlibsetCloseFriendsRequest {
  "@type": "setCloseFriends";
  user_ids: Array<number>;
}

export interface TdlibsetUserPersonalProfilePhotoRequest {
  "@type": "setUserPersonalProfilePhoto";
  user_id: number;
  photo: InputChatPhoto;
}

export interface TdlibsetUserNoteRequest {
  "@type": "setUserNote";
  user_id: number;
  note: FormattedText;
}

export interface TdlibsuggestUserProfilePhotoRequest {
  "@type": "suggestUserProfilePhoto";
  user_id: number;
  photo: InputChatPhoto;
}

export interface TdlibsuggestUserBirthdateRequest {
  "@type": "suggestUserBirthdate";
  user_id: number;
  birthdate: Birthdate;
}

export interface TdlibtoggleBotCanManageEmojiStatusRequest {
  "@type": "toggleBotCanManageEmojiStatus";
  bot_user_id: number;
  can_manage_emoji_status: boolean;
}

export interface TdlibsetUserEmojiStatusRequest {
  "@type": "setUserEmojiStatus";
  user_id: number;
  emoji_status: EmojiStatus;
}

export interface TdlibsharePhoneNumberRequest {
  "@type": "sharePhoneNumber";
  user_id: number;
}

export interface TdlibisProfileAudioRequest {
  "@type": "isProfileAudio";
  file_id: number;
}

export interface TdlibaddProfileAudioRequest {
  "@type": "addProfileAudio";
  file_id: number;
}

export interface TdlibsetProfileAudioPositionRequest {
  "@type": "setProfileAudioPosition";
  file_id: number;
  after_file_id: number;
}

export interface TdlibremoveProfileAudioRequest {
  "@type": "removeProfileAudio";
  file_id: number;
}

export interface TdlibchangeStickerSetRequest {
  "@type": "changeStickerSet";
  set_id: string;
  is_installed: boolean;
  is_archived: boolean;
}

export interface TdlibviewTrendingStickerSetsRequest {
  "@type": "viewTrendingStickerSets";
  sticker_set_ids: Array<string>;
}

export interface TdlibreorderInstalledStickerSetsRequest {
  "@type": "reorderInstalledStickerSets";
  sticker_type: StickerType;
  sticker_set_ids: Array<string>;
}

export interface TdlibremoveRecentStickerRequest {
  "@type": "removeRecentSticker";
  is_attached: boolean;
  sticker: InputFile;
}

export interface TdlibclearRecentStickersRequest {
  "@type": "clearRecentStickers";
  is_attached: boolean;
}

export interface TdlibaddFavoriteStickerRequest {
  "@type": "addFavoriteSticker";
  sticker: InputFile;
}

export interface TdlibremoveFavoriteStickerRequest {
  "@type": "removeFavoriteSticker";
  sticker: InputFile;
}

export interface TdlibaddSavedAnimationRequest {
  "@type": "addSavedAnimation";
  animation: InputFile;
}

export interface TdlibremoveSavedAnimationRequest {
  "@type": "removeSavedAnimation";
  animation: InputFile;
}

export interface TdlibremoveRecentHashtagRequest {
  "@type": "removeRecentHashtag";
  hashtag: string;
}

export interface TdlibsetProfilePhotoRequest {
  "@type": "setProfilePhoto";
  photo: InputChatPhoto;
  is_public: boolean;
}

export interface TdlibdeleteProfilePhotoRequest {
  "@type": "deleteProfilePhoto";
  profile_photo_id: string;
}

export interface TdlibsetAccentColorRequest {
  "@type": "setAccentColor";
  accent_color_id: number;
  background_custom_emoji_id: string;
}

export interface TdlibsetUpgradedGiftColorsRequest {
  "@type": "setUpgradedGiftColors";
  upgraded_gift_colors_id: string;
}

export interface TdlibsetProfileAccentColorRequest {
  "@type": "setProfileAccentColor";
  profile_accent_color_id: number;
  profile_background_custom_emoji_id: string;
}

export interface TdlibsetNameRequest {
  "@type": "setName";
  first_name: string;
  last_name: string;
}

export interface TdlibsetBioRequest {
  "@type": "setBio";
  bio: string;
}

export interface TdlibsetUsernameRequest {
  "@type": "setUsername";
  username: string;
}

export interface TdlibtoggleUsernameIsActiveRequest {
  "@type": "toggleUsernameIsActive";
  username: string;
  is_active: boolean;
}

export interface TdlibreorderActiveUsernamesRequest {
  "@type": "reorderActiveUsernames";
  usernames: Array<string>;
}

export interface TdlibsetBirthdateRequest {
  "@type": "setBirthdate";
  birthdate: Birthdate;
}

export interface TdlibsetMainProfileTabRequest {
  "@type": "setMainProfileTab";
  main_profile_tab: ProfileTab;
}

export interface TdlibsetPersonalChatRequest {
  "@type": "setPersonalChat";
  chat_id: number;
}

export interface TdlibsetEmojiStatusRequest {
  "@type": "setEmojiStatus";
  emoji_status: EmojiStatus;
}

export interface TdlibtoggleHasSponsoredMessagesEnabledRequest {
  "@type": "toggleHasSponsoredMessagesEnabled";
  has_sponsored_messages_enabled: boolean;
}

export interface TdlibsetBusinessLocationRequest {
  "@type": "setBusinessLocation";
  location: BusinessLocation;
}

export interface TdlibsetBusinessOpeningHoursRequest {
  "@type": "setBusinessOpeningHours";
  opening_hours: BusinessOpeningHours;
}

export interface TdlibsetBusinessGreetingMessageSettingsRequest {
  "@type": "setBusinessGreetingMessageSettings";
  greeting_message_settings: BusinessGreetingMessageSettings;
}

export interface TdlibsetBusinessAwayMessageSettingsRequest {
  "@type": "setBusinessAwayMessageSettings";
  away_message_settings: BusinessAwayMessageSettings;
}

export interface TdlibsetBusinessStartPageRequest {
  "@type": "setBusinessStartPage";
  start_page: InputBusinessStartPage;
}

export interface TdlibsendPhoneNumberFirebaseSmsRequest {
  "@type": "sendPhoneNumberFirebaseSms";
  token: string;
}

export interface TdlibreportPhoneNumberCodeMissingRequest {
  "@type": "reportPhoneNumberCodeMissing";
  mobile_network_code: string;
}

export interface TdlibcheckPhoneNumberCodeRequest {
  "@type": "checkPhoneNumberCode";
  code: string;
}

export interface TdlibsetBusinessConnectedBotRequest {
  "@type": "setBusinessConnectedBot";
  bot: BusinessConnectedBot;
}

export interface TdlibdeleteBusinessConnectedBotRequest {
  "@type": "deleteBusinessConnectedBot";
  bot_user_id: number;
}

export interface TdlibtoggleBusinessConnectedBotChatIsPausedRequest {
  "@type": "toggleBusinessConnectedBotChatIsPaused";
  chat_id: number;
  is_paused: boolean;
}

export interface TdlibremoveBusinessConnectedBotFromChatRequest {
  "@type": "removeBusinessConnectedBotFromChat";
  chat_id: number;
}

export interface TdlibdeleteBusinessChatLinkRequest {
  "@type": "deleteBusinessChatLink";
  link: string;
}

export interface TdlibsetCommandsRequest {
  "@type": "setCommands";
  scope: BotCommandScope;
  language_code: string;
  commands: Array<BotCommand>;
}

export interface TdlibdeleteCommandsRequest {
  "@type": "deleteCommands";
  scope: BotCommandScope;
  language_code: string;
}

export interface TdlibsetMenuButtonRequest {
  "@type": "setMenuButton";
  user_id: number;
  menu_button: BotMenuButton;
}

export interface TdlibsetDefaultGroupAdministratorRightsRequest {
  "@type": "setDefaultGroupAdministratorRights";
  default_group_administrator_rights: ChatAdministratorRights;
}

export interface TdlibsetDefaultChannelAdministratorRightsRequest {
  "@type": "setDefaultChannelAdministratorRights";
  default_channel_administrator_rights: ChatAdministratorRights;
}

export interface TdlibcanBotSendMessagesRequest {
  "@type": "canBotSendMessages";
  bot_user_id: number;
}

export interface TdliballowBotToSendMessagesRequest {
  "@type": "allowBotToSendMessages";
  bot_user_id: number;
}

export interface TdlibreorderBotMediaPreviewsRequest {
  "@type": "reorderBotMediaPreviews";
  bot_user_id: number;
  language_code: string;
  file_ids: Array<number>;
}

export interface TdlibdeleteBotMediaPreviewsRequest {
  "@type": "deleteBotMediaPreviews";
  bot_user_id: number;
  language_code: string;
  file_ids: Array<number>;
}

export interface TdlibsetBotNameRequest {
  "@type": "setBotName";
  bot_user_id: number;
  language_code: string;
  name: string;
}

export interface TdlibsetBotProfilePhotoRequest {
  "@type": "setBotProfilePhoto";
  bot_user_id: number;
  photo: InputChatPhoto;
}

export interface TdlibtoggleBotUsernameIsActiveRequest {
  "@type": "toggleBotUsernameIsActive";
  bot_user_id: number;
  username: string;
  is_active: boolean;
}

export interface TdlibreorderBotActiveUsernamesRequest {
  "@type": "reorderBotActiveUsernames";
  bot_user_id: number;
  usernames: Array<string>;
}

export interface TdlibsetBotInfoDescriptionRequest {
  "@type": "setBotInfoDescription";
  bot_user_id: number;
  language_code: string;
  description: string;
}

export interface TdlibsetBotInfoShortDescriptionRequest {
  "@type": "setBotInfoShortDescription";
  bot_user_id: number;
  language_code: string;
  short_description: string;
}

export interface TdlibsetMessageSenderBotVerificationRequest {
  "@type": "setMessageSenderBotVerification";
  bot_user_id: number;
  verified_id: MessageSender;
  custom_description: string;
}

export interface TdlibremoveMessageSenderBotVerificationRequest {
  "@type": "removeMessageSenderBotVerification";
  bot_user_id: number;
  verified_id: MessageSender;
}

export interface TdlibterminateSessionRequest {
  "@type": "terminateSession";
  session_id: string;
}

export interface TdlibterminateAllOtherSessionsRequest {
  "@type": "terminateAllOtherSessions";
}

export interface TdlibconfirmSessionRequest {
  "@type": "confirmSession";
  session_id: string;
}

export interface TdlibtoggleSessionCanAcceptCallsRequest {
  "@type": "toggleSessionCanAcceptCalls";
  session_id: string;
  can_accept_calls: boolean;
}

export interface TdlibtoggleSessionCanAcceptSecretChatsRequest {
  "@type": "toggleSessionCanAcceptSecretChats";
  session_id: string;
  can_accept_secret_chats: boolean;
}

export interface TdlibsetInactiveSessionTtlRequest {
  "@type": "setInactiveSessionTtl";
  inactive_session_ttl_days: number;
}

export interface TdlibdisconnectWebsiteRequest {
  "@type": "disconnectWebsite";
  website_id: string;
}

export interface TdlibdisconnectAllWebsitesRequest {
  "@type": "disconnectAllWebsites";
}

export interface TdlibsetSupergroupUsernameRequest {
  "@type": "setSupergroupUsername";
  supergroup_id: number;
  username: string;
}

export interface TdlibtoggleSupergroupUsernameIsActiveRequest {
  "@type": "toggleSupergroupUsernameIsActive";
  supergroup_id: number;
  username: string;
  is_active: boolean;
}

export interface TdlibdisableAllSupergroupUsernamesRequest {
  "@type": "disableAllSupergroupUsernames";
  supergroup_id: number;
}

export interface TdlibreorderSupergroupActiveUsernamesRequest {
  "@type": "reorderSupergroupActiveUsernames";
  supergroup_id: number;
  usernames: Array<string>;
}

export interface TdlibsetSupergroupStickerSetRequest {
  "@type": "setSupergroupStickerSet";
  supergroup_id: number;
  sticker_set_id: string;
}

export interface TdlibsetSupergroupCustomEmojiStickerSetRequest {
  "@type": "setSupergroupCustomEmojiStickerSet";
  supergroup_id: number;
  custom_emoji_sticker_set_id: string;
}

export interface TdlibsetSupergroupUnrestrictBoostCountRequest {
  "@type": "setSupergroupUnrestrictBoostCount";
  supergroup_id: number;
  unrestrict_boost_count: number;
}

export interface TdlibsetSupergroupMainProfileTabRequest {
  "@type": "setSupergroupMainProfileTab";
  supergroup_id: number;
  main_profile_tab: ProfileTab;
}

export interface TdlibtoggleSupergroupSignMessagesRequest {
  "@type": "toggleSupergroupSignMessages";
  supergroup_id: number;
  sign_messages: boolean;
  show_message_sender: boolean;
}

export interface TdlibtoggleSupergroupJoinToSendMessagesRequest {
  "@type": "toggleSupergroupJoinToSendMessages";
  supergroup_id: number;
  join_to_send_messages: boolean;
}

export interface TdlibtoggleSupergroupJoinByRequestRequest {
  "@type": "toggleSupergroupJoinByRequest";
  supergroup_id: number;
  join_by_request: boolean;
}

export interface TdlibtoggleSupergroupIsAllHistoryAvailableRequest {
  "@type": "toggleSupergroupIsAllHistoryAvailable";
  supergroup_id: number;
  is_all_history_available: boolean;
}

export interface TdlibtoggleSupergroupCanHaveSponsoredMessagesRequest {
  "@type": "toggleSupergroupCanHaveSponsoredMessages";
  supergroup_id: number;
  can_have_sponsored_messages: boolean;
}

export interface TdlibtoggleSupergroupHasAutomaticTranslationRequest {
  "@type": "toggleSupergroupHasAutomaticTranslation";
  supergroup_id: number;
  has_automatic_translation: boolean;
}

export interface TdlibtoggleSupergroupHasHiddenMembersRequest {
  "@type": "toggleSupergroupHasHiddenMembers";
  supergroup_id: number;
  has_hidden_members: boolean;
}

export interface TdlibtoggleSupergroupHasAggressiveAntiSpamEnabledRequest {
  "@type": "toggleSupergroupHasAggressiveAntiSpamEnabled";
  supergroup_id: number;
  has_aggressive_anti_spam_enabled: boolean;
}

export interface TdlibtoggleSupergroupIsForumRequest {
  "@type": "toggleSupergroupIsForum";
  supergroup_id: number;
  is_forum: boolean;
  has_forum_tabs: boolean;
}

export interface TdlibtoggleSupergroupIsBroadcastGroupRequest {
  "@type": "toggleSupergroupIsBroadcastGroup";
  supergroup_id: number;
}

export interface TdlibreportSupergroupSpamRequest {
  "@type": "reportSupergroupSpam";
  supergroup_id: number;
  message_ids: Array<number>;
}

export interface TdlibreportSupergroupAntiSpamFalsePositiveRequest {
  "@type": "reportSupergroupAntiSpamFalsePositive";
  supergroup_id: number;
  message_id: number;
}

export interface TdlibcloseSecretChatRequest {
  "@type": "closeSecretChat";
  secret_chat_id: number;
}

export interface TdlibdeleteSavedOrderInfoRequest {
  "@type": "deleteSavedOrderInfo";
}

export interface TdlibdeleteSavedCredentialsRequest {
  "@type": "deleteSavedCredentials";
}

export interface TdlibsetGiftSettingsRequest {
  "@type": "setGiftSettings";
  settings: GiftSettings;
}

export interface TdlibsendGiftRequest {
  "@type": "sendGift";
  gift_id: string;
  owner_id: MessageSender;
  text: FormattedText;
  is_private: boolean;
  pay_for_upgrade: boolean;
}

export interface TdlibopenGiftAuctionRequest {
  "@type": "openGiftAuction";
  gift_id: string;
}

export interface TdlibcloseGiftAuctionRequest {
  "@type": "closeGiftAuction";
  gift_id: string;
}

export interface TdlibplaceGiftAuctionBidRequest {
  "@type": "placeGiftAuctionBid";
  gift_id: string;
  star_count: number;
  user_id: number;
  text: FormattedText;
  is_private: boolean;
}

export interface TdlibincreaseGiftAuctionBidRequest {
  "@type": "increaseGiftAuctionBid";
  gift_id: string;
  star_count: number;
}

export interface TdlibsellGiftRequest {
  "@type": "sellGift";
  business_connection_id: string;
  received_gift_id: string;
}

export interface TdlibtoggleGiftIsSavedRequest {
  "@type": "toggleGiftIsSaved";
  received_gift_id: string;
  is_saved: boolean;
}

export interface TdlibsetPinnedGiftsRequest {
  "@type": "setPinnedGifts";
  owner_id: MessageSender;
  received_gift_ids: Array<string>;
}

export interface TdlibtoggleChatGiftNotificationsRequest {
  "@type": "toggleChatGiftNotifications";
  chat_id: number;
  are_enabled: boolean;
}

export interface TdlibbuyGiftUpgradeRequest {
  "@type": "buyGiftUpgrade";
  owner_id: MessageSender;
  prepaid_upgrade_hash: string;
  star_count: number;
}

export interface TdlibtransferGiftRequest {
  "@type": "transferGift";
  business_connection_id: string;
  received_gift_id: string;
  new_owner_id: MessageSender;
  star_count: number;
}

export interface TdlibdropGiftOriginalDetailsRequest {
  "@type": "dropGiftOriginalDetails";
  received_gift_id: string;
  star_count: number;
}

export interface TdlibsendGiftPurchaseOfferRequest {
  "@type": "sendGiftPurchaseOffer";
  owner_id: MessageSender;
  gift_name: string;
  price: GiftResalePrice;
  duration: number;
  paid_message_star_count: number;
}

export interface TdlibprocessGiftPurchaseOfferRequest {
  "@type": "processGiftPurchaseOffer";
  message_id: number;
  accept: boolean;
}

export interface TdlibsetGiftResalePriceRequest {
  "@type": "setGiftResalePrice";
  received_gift_id: string;
  price: GiftResalePrice;
}

export interface TdlibreorderGiftCollectionsRequest {
  "@type": "reorderGiftCollections";
  owner_id: MessageSender;
  collection_ids: Array<number>;
}

export interface TdlibdeleteGiftCollectionRequest {
  "@type": "deleteGiftCollection";
  owner_id: MessageSender;
  collection_id: number;
}

export interface TdlibrefundStarPaymentRequest {
  "@type": "refundStarPayment";
  user_id: number;
  telegram_payment_charge_id: string;
}

export interface TdlibdeleteDefaultBackgroundRequest {
  "@type": "deleteDefaultBackground";
  for_dark_theme: boolean;
}

export interface TdlibremoveInstalledBackgroundRequest {
  "@type": "removeInstalledBackground";
  background_id: string;
}

export interface TdlibresetInstalledBackgroundsRequest {
  "@type": "resetInstalledBackgrounds";
}

export interface TdlibsynchronizeLanguagePackRequest {
  "@type": "synchronizeLanguagePack";
  language_pack_id: string;
}

export interface TdlibaddCustomServerLanguagePackRequest {
  "@type": "addCustomServerLanguagePack";
  language_pack_id: string;
}

export interface TdlibsetCustomLanguagePackRequest {
  "@type": "setCustomLanguagePack";
  info: LanguagePackInfo;
  strings: Array<LanguagePackString>;
}

export interface TdlibeditCustomLanguagePackInfoRequest {
  "@type": "editCustomLanguagePackInfo";
  info: LanguagePackInfo;
}

export interface TdlibsetCustomLanguagePackStringRequest {
  "@type": "setCustomLanguagePackString";
  language_pack_id: string;
  new_string: LanguagePackString;
}

export interface TdlibdeleteLanguagePackRequest {
  "@type": "deleteLanguagePack";
  language_pack_id: string;
}

export interface TdlibprocessPushNotificationRequest {
  "@type": "processPushNotification";
  payload: string;
}

export interface TdlibsetUserPrivacySettingRulesRequest {
  "@type": "setUserPrivacySettingRules";
  setting: UserPrivacySetting;
  rules: UserPrivacySettingRules;
}

export interface TdlibsetReadDatePrivacySettingsRequest {
  "@type": "setReadDatePrivacySettings";
  settings: ReadDatePrivacySettings;
}

export interface TdlibsetNewChatPrivacySettingsRequest {
  "@type": "setNewChatPrivacySettings";
  settings: NewChatPrivacySettings;
}

export interface TdliballowUnpaidMessagesFromUserRequest {
  "@type": "allowUnpaidMessagesFromUser";
  user_id: number;
  refund_payments: boolean;
}

export interface TdlibsetChatPaidMessageStarCountRequest {
  "@type": "setChatPaidMessageStarCount";
  chat_id: number;
  paid_message_star_count: number;
}

export interface TdlibsetOptionRequest {
  "@type": "setOption";
  name: string;
  value: OptionValue;
}

export interface TdlibsetAccountTtlRequest {
  "@type": "setAccountTtl";
  ttl: AccountTtl;
}

export interface TdlibdeleteAccountRequest {
  "@type": "deleteAccount";
  reason: string;
  password: string;
}

export interface TdlibsetDefaultMessageAutoDeleteTimeRequest {
  "@type": "setDefaultMessageAutoDeleteTime";
  message_auto_delete_time: MessageAutoDeleteTime;
}

export interface TdlibremoveChatActionBarRequest {
  "@type": "removeChatActionBar";
  chat_id: number;
}

export interface TdlibreportChatPhotoRequest {
  "@type": "reportChatPhoto";
  chat_id: number;
  file_id: number;
  reason: ReportReason;
  text: string;
}

export interface TdlibreportMessageReactionsRequest {
  "@type": "reportMessageReactions";
  chat_id: number;
  message_id: number;
  sender_id: MessageSender;
}

export interface TdlibsetNetworkTypeRequest {
  "@type": "setNetworkType";
  type: NetworkType;
}

export interface TdlibaddNetworkStatisticsRequest {
  "@type": "addNetworkStatistics";
  entry: NetworkStatisticsEntry;
}

export interface TdlibresetNetworkStatisticsRequest {
  "@type": "resetNetworkStatistics";
}

export interface TdlibsetAutoDownloadSettingsRequest {
  "@type": "setAutoDownloadSettings";
  settings: AutoDownloadSettings;
  type: NetworkType;
}

export interface TdlibsetAutosaveSettingsRequest {
  "@type": "setAutosaveSettings";
  scope: AutosaveSettingsScope;
  settings: ScopeAutosaveSettings;
}

export interface TdlibclearAutosaveSettingsExceptionsRequest {
  "@type": "clearAutosaveSettingsExceptions";
}

export interface TdlibdeletePassportElementRequest {
  "@type": "deletePassportElement";
  type: PassportElementType;
}

export interface TdlibsetPassportElementErrorsRequest {
  "@type": "setPassportElementErrors";
  user_id: number;
  errors: Array<InputPassportElementError>;
}

export interface TdlibcheckEmailAddressVerificationCodeRequest {
  "@type": "checkEmailAddressVerificationCode";
  code: string;
}

export interface TdlibsendPassportAuthorizationFormRequest {
  "@type": "sendPassportAuthorizationForm";
  authorization_form_id: number;
  types: Array<PassportElementType>;
}

export interface TdlibsetBotUpdatesStatusRequest {
  "@type": "setBotUpdatesStatus";
  pending_update_count: number;
  error_message: string;
}

export interface TdlibaddStickerToSetRequest {
  "@type": "addStickerToSet";
  user_id: number;
  name: string;
  sticker: InputSticker;
}

export interface TdlibreplaceStickerInSetRequest {
  "@type": "replaceStickerInSet";
  user_id: number;
  name: string;
  old_sticker: InputFile;
  new_sticker: InputSticker;
}

export interface TdlibsetStickerSetThumbnailRequest {
  "@type": "setStickerSetThumbnail";
  user_id: number;
  name: string;
  thumbnail: InputFile;
  format: StickerFormat;
}

export interface TdlibsetCustomEmojiStickerSetThumbnailRequest {
  "@type": "setCustomEmojiStickerSetThumbnail";
  name: string;
  custom_emoji_id: string;
}

export interface TdlibsetStickerSetTitleRequest {
  "@type": "setStickerSetTitle";
  name: string;
  title: string;
}

export interface TdlibdeleteStickerSetRequest {
  "@type": "deleteStickerSet";
  name: string;
}

export interface TdlibsetStickerPositionInSetRequest {
  "@type": "setStickerPositionInSet";
  sticker: InputFile;
  position: number;
}

export interface TdlibremoveStickerFromSetRequest {
  "@type": "removeStickerFromSet";
  sticker: InputFile;
}

export interface TdlibsetStickerEmojisRequest {
  "@type": "setStickerEmojis";
  sticker: InputFile;
  emojis: string;
}

export interface TdlibsetStickerKeywordsRequest {
  "@type": "setStickerKeywords";
  sticker: InputFile;
  keywords: Array<string>;
}

export interface TdlibsetStickerMaskPositionRequest {
  "@type": "setStickerMaskPosition";
  sticker: InputFile;
  mask_position: MaskPosition;
}

export interface TdlibviewPremiumFeatureRequest {
  "@type": "viewPremiumFeature";
  feature: PremiumFeature;
}

export interface TdlibclickPremiumSubscriptionButtonRequest {
  "@type": "clickPremiumSubscriptionButton";
}

export interface TdlibapplyPremiumGiftCodeRequest {
  "@type": "applyPremiumGiftCode";
  code: string;
}

export interface TdlibgiftPremiumWithStarsRequest {
  "@type": "giftPremiumWithStars";
  user_id: number;
  star_count: number;
  month_count: number;
  text: FormattedText;
}

export interface TdliblaunchPrepaidGiveawayRequest {
  "@type": "launchPrepaidGiveaway";
  giveaway_id: string;
  parameters: GiveawayParameters;
  winner_count: number;
  star_count: number;
}

export interface TdlibcanPurchaseFromStoreRequest {
  "@type": "canPurchaseFromStore";
  purpose: StorePaymentPurpose;
}

export interface TdlibassignStoreTransactionRequest {
  "@type": "assignStoreTransaction";
  transaction: StoreTransaction;
  purpose: StorePaymentPurpose;
}

export interface TdlibeditStarSubscriptionRequest {
  "@type": "editStarSubscription";
  subscription_id: string;
  is_canceled: boolean;
}

export interface TdlibeditUserStarSubscriptionRequest {
  "@type": "editUserStarSubscription";
  user_id: number;
  telegram_payment_charge_id: string;
  is_canceled: boolean;
}

export interface TdlibreuseStarSubscriptionRequest {
  "@type": "reuseStarSubscription";
  subscription_id: string;
}

export interface TdlibsetChatAffiliateProgramRequest {
  "@type": "setChatAffiliateProgram";
  chat_id: number;
  parameters: AffiliateProgramParameters;
}

export interface TdlibacceptTermsOfServiceRequest {
  "@type": "acceptTermsOfService";
  terms_of_service_id: string;
}

export interface TdlibanswerCustomQueryRequest {
  "@type": "answerCustomQuery";
  custom_query_id: string;
  data: string;
}

export interface TdlibsetAlarmRequest {
  "@type": "setAlarm";
  seconds: number;
}

export interface TdlibsaveApplicationLogEventRequest {
  "@type": "saveApplicationLogEvent";
  type: string;
  chat_id: number;
  data: JsonValue;
}

export interface TdlibenableProxyRequest {
  "@type": "enableProxy";
  proxy_id: number;
}

export interface TdlibdisableProxyRequest {
  "@type": "disableProxy";
}

export interface TdlibremoveProxyRequest {
  "@type": "removeProxy";
  proxy_id: number;
}

export interface TdlibsetLogStreamRequest {
  "@type": "setLogStream";
  log_stream: LogStream;
}

export interface TdlibsetLogVerbosityLevelRequest {
  "@type": "setLogVerbosityLevel";
  new_verbosity_level: number;
}

export interface TdlibsetLogTagVerbosityLevelRequest {
  "@type": "setLogTagVerbosityLevel";
  tag: string;
  new_verbosity_level: number;
}

export interface TdlibaddLogMessageRequest {
  "@type": "addLogMessage";
  verbosity_level: number;
  text: string;
}

export interface TdlibtestCallEmptyRequest {
  "@type": "testCallEmpty";
}

export interface TdlibtestNetworkRequest {
  "@type": "testNetwork";
}

export interface TdlibtestProxyRequest {
  "@type": "testProxy";
  server: string;
  port: number;
  type: ProxyType;
  dc_id: number;
  timeout: number;
}

export interface TdlibtestGetDifferenceRequest {
  "@type": "testGetDifference";
}

export interface TdlibtestReturnErrorRequest {
  "@type": "testReturnError";
  error: Error;
}

export type TdlibRequest =
  | TdliberrorRequest
  | TdlibokRequest
  | TdlibsetTdlibParametersRequest
  | TdlibsetAuthenticationPhoneNumberRequest
  | TdlibcheckAuthenticationPremiumPurchaseRequest
  | TdlibsetAuthenticationPremiumPurchaseTransactionRequest
  | TdlibsetAuthenticationEmailAddressRequest
  | TdlibresendAuthenticationCodeRequest
  | TdlibcheckAuthenticationEmailCodeRequest
  | TdlibcheckAuthenticationCodeRequest
  | TdlibrequestQrCodeAuthenticationRequest
  | TdlibcheckAuthenticationPasskeyRequest
  | TdlibregisterUserRequest
  | TdlibresetAuthenticationEmailAddressRequest
  | TdlibcheckAuthenticationPasswordRequest
  | TdlibrequestAuthenticationPasswordRecoveryRequest
  | TdlibcheckAuthenticationPasswordRecoveryCodeRequest
  | TdlibrecoverAuthenticationPasswordRequest
  | TdlibsendAuthenticationFirebaseSmsRequest
  | TdlibreportAuthenticationCodeMissingRequest
  | TdlibcheckAuthenticationBotTokenRequest
  | TdliblogOutRequest
  | TdlibcloseRequest
  | TdlibdestroyRequest
  | TdlibsetDatabaseEncryptionKeyRequest
  | TdlibisLoginEmailAddressRequiredRequest
  | TdlibcheckLoginEmailAddressCodeRequest
  | TdlibcheckPasswordRecoveryCodeRequest
  | TdlibcancelPasswordResetRequest
  | TdlibloadChatsRequest
  | TdlibopenChatSimilarChatRequest
  | TdlibopenBotSimilarBotRequest
  | TdlibremoveTopChatRequest
  | TdlibaddRecentlyFoundChatRequest
  | TdlibremoveRecentlyFoundChatRequest
  | TdlibclearRecentlyFoundChatsRequest
  | TdlibcheckCreatedPublicChatsLimitRequest
  | TdlibloadDirectMessagesChatTopicsRequest
  | TdlibdeleteDirectMessagesChatTopicHistoryRequest
  | TdlibdeleteDirectMessagesChatTopicMessagesByDateRequest
  | TdlibsetDirectMessagesChatTopicIsMarkedAsUnreadRequest
  | TdlibunpinAllDirectMessagesChatTopicMessagesRequest
  | TdlibreadAllDirectMessagesChatTopicReactionsRequest
  | TdlibtoggleDirectMessagesChatTopicCanSendUnpaidMessagesRequest
  | TdlibloadSavedMessagesTopicsRequest
  | TdlibdeleteSavedMessagesTopicHistoryRequest
  | TdlibdeleteSavedMessagesTopicMessagesByDateRequest
  | TdlibtoggleSavedMessagesTopicIsPinnedRequest
  | TdlibsetPinnedSavedMessagesTopicsRequest
  | TdlibdeleteChatHistoryRequest
  | TdlibdeleteChatRequest
  | TdlibremoveSearchedForTagRequest
  | TdlibclearSearchedForTagsRequest
  | TdlibdeleteAllCallMessagesRequest
  | TdlibclickChatSponsoredMessageRequest
  | TdlibviewSponsoredChatRequest
  | TdlibopenSponsoredChatRequest
  | TdlibviewVideoMessageAdvertisementRequest
  | TdlibclickVideoMessageAdvertisementRequest
  | TdlibremoveNotificationRequest
  | TdlibremoveNotificationGroupRequest
  | TdlibrecognizeSpeechRequest
  | TdlibrateSpeechRecognitionRequest
  | TdlibsetChatMessageSenderRequest
  | TdlibdeleteMessagesRequest
  | TdlibdeleteChatMessagesBySenderRequest
  | TdlibdeleteChatMessagesByDateRequest
  | TdlibeditInlineMessageTextRequest
  | TdlibeditInlineMessageLiveLocationRequest
  | TdlibeditInlineMessageMediaRequest
  | TdlibeditInlineMessageCaptionRequest
  | TdlibeditInlineMessageReplyMarkupRequest
  | TdlibeditMessageSchedulingStateRequest
  | TdlibsetMessageFactCheckRequest
  | TdlibsetBusinessMessageIsPinnedRequest
  | TdlibreadBusinessMessageRequest
  | TdlibdeleteBusinessMessagesRequest
  | TdlibdeleteBusinessStoryRequest
  | TdlibsetBusinessAccountNameRequest
  | TdlibsetBusinessAccountBioRequest
  | TdlibsetBusinessAccountProfilePhotoRequest
  | TdlibsetBusinessAccountUsernameRequest
  | TdlibsetBusinessAccountGiftSettingsRequest
  | TdlibtransferBusinessAccountStarsRequest
  | TdlibcheckQuickReplyShortcutNameRequest
  | TdlibloadQuickReplyShortcutsRequest
  | TdlibsetQuickReplyShortcutNameRequest
  | TdlibdeleteQuickReplyShortcutRequest
  | TdlibreorderQuickReplyShortcutsRequest
  | TdlibloadQuickReplyShortcutMessagesRequest
  | TdlibdeleteQuickReplyShortcutMessagesRequest
  | TdlibeditQuickReplyMessageRequest
  | TdlibeditForumTopicRequest
  | TdlibsetForumTopicNotificationSettingsRequest
  | TdlibtoggleForumTopicIsClosedRequest
  | TdlibtoggleGeneralForumTopicIsHiddenRequest
  | TdlibtoggleForumTopicIsPinnedRequest
  | TdlibsetPinnedForumTopicsRequest
  | TdlibdeleteForumTopicRequest
  | TdlibreadAllForumTopicMentionsRequest
  | TdlibreadAllForumTopicReactionsRequest
  | TdlibunpinAllForumTopicMessagesRequest
  | TdlibremoveLoginPasskeyRequest
  | TdlibclearRecentReactionsRequest
  | TdlibaddMessageReactionRequest
  | TdlibremoveMessageReactionRequest
  | TdlibaddPendingPaidMessageReactionRequest
  | TdlibcommitPendingPaidMessageReactionsRequest
  | TdlibremovePendingPaidMessageReactionsRequest
  | TdlibsetPaidMessageReactionTypeRequest
  | TdlibsetMessageReactionsRequest
  | TdlibsetDefaultReactionTypeRequest
  | TdlibsetSavedMessagesTagLabelRequest
  | TdlibsetPollAnswerRequest
  | TdlibstopPollRequest
  | TdlibaddChecklistTasksRequest
  | TdlibmarkChecklistTasksAsDoneRequest
  | TdlibhideSuggestedActionRequest
  | TdlibhideContactCloseBirthdaysRequest
  | TdlibshareUsersWithBotRequest
  | TdlibshareChatWithBotRequest
  | TdlibanswerInlineQueryRequest
  | TdlibsendWebAppDataRequest
  | TdlibcloseWebAppRequest
  | TdlibcheckWebAppFileDownloadRequest
  | TdlibanswerCallbackQueryRequest
  | TdlibanswerShippingQueryRequest
  | TdlibanswerPreCheckoutQueryRequest
  | TdlibsetInlineGameScoreRequest
  | TdlibdeleteChatReplyMarkupRequest
  | TdlibsendChatActionRequest
  | TdlibsendTextMessageDraftRequest
  | TdlibopenChatRequest
  | TdlibcloseChatRequest
  | TdlibviewMessagesRequest
  | TdlibopenMessageContentRequest
  | TdlibreadAllChatMentionsRequest
  | TdlibreadAllChatReactionsRequest
  | TdlibaddChatToListRequest
  | TdlibdeleteChatFolderRequest
  | TdlibreorderChatFoldersRequest
  | TdlibtoggleChatFolderTagsRequest
  | TdlibdeleteChatFolderInviteLinkRequest
  | TdlibaddChatFolderByInviteLinkRequest
  | TdlibprocessChatFolderNewChatsRequest
  | TdlibsetArchiveChatListSettingsRequest
  | TdlibsetChatTitleRequest
  | TdlibsetChatPhotoRequest
  | TdlibsetChatAccentColorRequest
  | TdlibsetChatProfileAccentColorRequest
  | TdlibsetChatMessageAutoDeleteTimeRequest
  | TdlibsetChatEmojiStatusRequest
  | TdlibsetChatPermissionsRequest
  | TdlibsetChatBackgroundRequest
  | TdlibdeleteChatBackgroundRequest
  | TdlibsetChatThemeRequest
  | TdlibsetChatDraftMessageRequest
  | TdlibsetChatNotificationSettingsRequest
  | TdlibtoggleChatHasProtectedContentRequest
  | TdlibtoggleChatViewAsTopicsRequest
  | TdlibtoggleChatIsTranslatableRequest
  | TdlibtoggleChatIsMarkedAsUnreadRequest
  | TdlibtoggleChatDefaultDisableNotificationRequest
  | TdlibsetChatAvailableReactionsRequest
  | TdlibsetChatClientDataRequest
  | TdlibsetChatDescriptionRequest
  | TdlibsetChatDiscussionGroupRequest
  | TdlibsetChatDirectMessagesGroupRequest
  | TdlibsetChatLocationRequest
  | TdlibsetChatSlowModeDelayRequest
  | TdlibpinChatMessageRequest
  | TdlibunpinChatMessageRequest
  | TdlibunpinAllChatMessagesRequest
  | TdlibjoinChatRequest
  | TdlibleaveChatRequest
  | TdlibsetChatMemberStatusRequest
  | TdlibbanChatMemberRequest
  | TdlibtransferChatOwnershipRequest
  | TdlibclearAllDraftMessagesRequest
  | TdlibremoveSavedNotificationSoundRequest
  | TdlibsetScopeNotificationSettingsRequest
  | TdlibsetReactionNotificationSettingsRequest
  | TdlibresetAllNotificationSettingsRequest
  | TdlibtoggleChatIsPinnedRequest
  | TdlibsetPinnedChatsRequest
  | TdlibreadChatListRequest
  | TdlibeditStoryRequest
  | TdlibeditStoryCoverRequest
  | TdlibsetStoryPrivacySettingsRequest
  | TdlibtoggleStoryIsPostedToChatPageRequest
  | TdlibdeleteStoryRequest
  | TdlibloadActiveStoriesRequest
  | TdlibsetChatActiveStoriesListRequest
  | TdlibsetChatPinnedStoriesRequest
  | TdlibopenStoryRequest
  | TdlibcloseStoryRequest
  | TdlibsetStoryReactionRequest
  | TdlibactivateStoryStealthModeRequest
  | TdlibreorderStoryAlbumsRequest
  | TdlibdeleteStoryAlbumRequest
  | TdlibtoggleBotIsAddedToAttachmentMenuRequest
  | TdlibclearRecentEmojiStatusesRequest
  | TdlibcancelDownloadFileRequest
  | TdlibcancelPreliminaryUploadFileRequest
  | TdlibwriteGeneratedFilePartRequest
  | TdlibsetFileGenerationProgressRequest
  | TdlibfinishFileGenerationRequest
  | TdlibdeleteFileRequest
  | TdlibtoggleDownloadIsPausedRequest
  | TdlibtoggleAllDownloadsArePausedRequest
  | TdlibremoveFileFromDownloadsRequest
  | TdlibremoveAllFilesFromDownloadsRequest
  | TdlibsetApplicationVerificationTokenRequest
  | TdlibimportMessagesRequest
  | TdlibdeleteRevokedChatInviteLinkRequest
  | TdlibdeleteAllRevokedChatInviteLinksRequest
  | TdlibprocessChatJoinRequestRequest
  | TdlibprocessChatJoinRequestsRequest
  | TdlibapproveSuggestedPostRequest
  | TdlibdeclineSuggestedPostRequest
  | TdlibacceptCallRequest
  | TdlibsendCallSignalingDataRequest
  | TdlibdiscardCallRequest
  | TdlibsendCallRatingRequest
  | TdlibsendCallDebugInformationRequest
  | TdlibsendCallLogRequest
  | TdlibsetVideoChatDefaultParticipantRequest
  | TdlibstartScheduledVideoChatRequest
  | TdlibtoggleVideoChatEnabledStartNotificationRequest
  | TdlibtoggleGroupCallScreenSharingIsPausedRequest
  | TdlibendGroupCallScreenSharingRequest
  | TdlibsetVideoChatTitleRequest
  | TdlibtoggleVideoChatMuteNewParticipantsRequest
  | TdlibtoggleGroupCallAreMessagesAllowedRequest
  | TdlibsetLiveStoryMessageSenderRequest
  | TdlibsendGroupCallMessageRequest
  | TdlibaddPendingLiveStoryReactionRequest
  | TdlibcommitPendingLiveStoryReactionsRequest
  | TdlibremovePendingLiveStoryReactionsRequest
  | TdlibdeleteGroupCallMessagesRequest
  | TdlibdeleteGroupCallMessagesBySenderRequest
  | TdlibdeclineGroupCallInvitationRequest
  | TdlibbanGroupCallParticipantsRequest
  | TdlibinviteVideoChatParticipantsRequest
  | TdlibrevokeGroupCallInviteLinkRequest
  | TdlibstartGroupCallRecordingRequest
  | TdlibendGroupCallRecordingRequest
  | TdlibtoggleGroupCallIsMyVideoPausedRequest
  | TdlibtoggleGroupCallIsMyVideoEnabledRequest
  | TdlibsetGroupCallPaidMessageStarCountRequest
  | TdlibtoggleGroupCallParticipantIsMutedRequest
  | TdlibsetGroupCallParticipantVolumeLevelRequest
  | TdlibtoggleGroupCallParticipantIsHandRaisedRequest
  | TdlibloadGroupCallParticipantsRequest
  | TdlibleaveGroupCallRequest
  | TdlibendGroupCallRequest
  | TdlibsetMessageSenderBlockListRequest
  | TdlibblockMessageSenderFromRepliesRequest
  | TdlibaddContactRequest
  | TdlibremoveContactsRequest
  | TdlibclearImportedContactsRequest
  | TdlibsetCloseFriendsRequest
  | TdlibsetUserPersonalProfilePhotoRequest
  | TdlibsetUserNoteRequest
  | TdlibsuggestUserProfilePhotoRequest
  | TdlibsuggestUserBirthdateRequest
  | TdlibtoggleBotCanManageEmojiStatusRequest
  | TdlibsetUserEmojiStatusRequest
  | TdlibsharePhoneNumberRequest
  | TdlibisProfileAudioRequest
  | TdlibaddProfileAudioRequest
  | TdlibsetProfileAudioPositionRequest
  | TdlibremoveProfileAudioRequest
  | TdlibchangeStickerSetRequest
  | TdlibviewTrendingStickerSetsRequest
  | TdlibreorderInstalledStickerSetsRequest
  | TdlibremoveRecentStickerRequest
  | TdlibclearRecentStickersRequest
  | TdlibaddFavoriteStickerRequest
  | TdlibremoveFavoriteStickerRequest
  | TdlibaddSavedAnimationRequest
  | TdlibremoveSavedAnimationRequest
  | TdlibremoveRecentHashtagRequest
  | TdlibsetProfilePhotoRequest
  | TdlibdeleteProfilePhotoRequest
  | TdlibsetAccentColorRequest
  | TdlibsetUpgradedGiftColorsRequest
  | TdlibsetProfileAccentColorRequest
  | TdlibsetNameRequest
  | TdlibsetBioRequest
  | TdlibsetUsernameRequest
  | TdlibtoggleUsernameIsActiveRequest
  | TdlibreorderActiveUsernamesRequest
  | TdlibsetBirthdateRequest
  | TdlibsetMainProfileTabRequest
  | TdlibsetPersonalChatRequest
  | TdlibsetEmojiStatusRequest
  | TdlibtoggleHasSponsoredMessagesEnabledRequest
  | TdlibsetBusinessLocationRequest
  | TdlibsetBusinessOpeningHoursRequest
  | TdlibsetBusinessGreetingMessageSettingsRequest
  | TdlibsetBusinessAwayMessageSettingsRequest
  | TdlibsetBusinessStartPageRequest
  | TdlibsendPhoneNumberFirebaseSmsRequest
  | TdlibreportPhoneNumberCodeMissingRequest
  | TdlibcheckPhoneNumberCodeRequest
  | TdlibsetBusinessConnectedBotRequest
  | TdlibdeleteBusinessConnectedBotRequest
  | TdlibtoggleBusinessConnectedBotChatIsPausedRequest
  | TdlibremoveBusinessConnectedBotFromChatRequest
  | TdlibdeleteBusinessChatLinkRequest
  | TdlibsetCommandsRequest
  | TdlibdeleteCommandsRequest
  | TdlibsetMenuButtonRequest
  | TdlibsetDefaultGroupAdministratorRightsRequest
  | TdlibsetDefaultChannelAdministratorRightsRequest
  | TdlibcanBotSendMessagesRequest
  | TdliballowBotToSendMessagesRequest
  | TdlibreorderBotMediaPreviewsRequest
  | TdlibdeleteBotMediaPreviewsRequest
  | TdlibsetBotNameRequest
  | TdlibsetBotProfilePhotoRequest
  | TdlibtoggleBotUsernameIsActiveRequest
  | TdlibreorderBotActiveUsernamesRequest
  | TdlibsetBotInfoDescriptionRequest
  | TdlibsetBotInfoShortDescriptionRequest
  | TdlibsetMessageSenderBotVerificationRequest
  | TdlibremoveMessageSenderBotVerificationRequest
  | TdlibterminateSessionRequest
  | TdlibterminateAllOtherSessionsRequest
  | TdlibconfirmSessionRequest
  | TdlibtoggleSessionCanAcceptCallsRequest
  | TdlibtoggleSessionCanAcceptSecretChatsRequest
  | TdlibsetInactiveSessionTtlRequest
  | TdlibdisconnectWebsiteRequest
  | TdlibdisconnectAllWebsitesRequest
  | TdlibsetSupergroupUsernameRequest
  | TdlibtoggleSupergroupUsernameIsActiveRequest
  | TdlibdisableAllSupergroupUsernamesRequest
  | TdlibreorderSupergroupActiveUsernamesRequest
  | TdlibsetSupergroupStickerSetRequest
  | TdlibsetSupergroupCustomEmojiStickerSetRequest
  | TdlibsetSupergroupUnrestrictBoostCountRequest
  | TdlibsetSupergroupMainProfileTabRequest
  | TdlibtoggleSupergroupSignMessagesRequest
  | TdlibtoggleSupergroupJoinToSendMessagesRequest
  | TdlibtoggleSupergroupJoinByRequestRequest
  | TdlibtoggleSupergroupIsAllHistoryAvailableRequest
  | TdlibtoggleSupergroupCanHaveSponsoredMessagesRequest
  | TdlibtoggleSupergroupHasAutomaticTranslationRequest
  | TdlibtoggleSupergroupHasHiddenMembersRequest
  | TdlibtoggleSupergroupHasAggressiveAntiSpamEnabledRequest
  | TdlibtoggleSupergroupIsForumRequest
  | TdlibtoggleSupergroupIsBroadcastGroupRequest
  | TdlibreportSupergroupSpamRequest
  | TdlibreportSupergroupAntiSpamFalsePositiveRequest
  | TdlibcloseSecretChatRequest
  | TdlibdeleteSavedOrderInfoRequest
  | TdlibdeleteSavedCredentialsRequest
  | TdlibsetGiftSettingsRequest
  | TdlibsendGiftRequest
  | TdlibopenGiftAuctionRequest
  | TdlibcloseGiftAuctionRequest
  | TdlibplaceGiftAuctionBidRequest
  | TdlibincreaseGiftAuctionBidRequest
  | TdlibsellGiftRequest
  | TdlibtoggleGiftIsSavedRequest
  | TdlibsetPinnedGiftsRequest
  | TdlibtoggleChatGiftNotificationsRequest
  | TdlibbuyGiftUpgradeRequest
  | TdlibtransferGiftRequest
  | TdlibdropGiftOriginalDetailsRequest
  | TdlibsendGiftPurchaseOfferRequest
  | TdlibprocessGiftPurchaseOfferRequest
  | TdlibsetGiftResalePriceRequest
  | TdlibreorderGiftCollectionsRequest
  | TdlibdeleteGiftCollectionRequest
  | TdlibrefundStarPaymentRequest
  | TdlibdeleteDefaultBackgroundRequest
  | TdlibremoveInstalledBackgroundRequest
  | TdlibresetInstalledBackgroundsRequest
  | TdlibsynchronizeLanguagePackRequest
  | TdlibaddCustomServerLanguagePackRequest
  | TdlibsetCustomLanguagePackRequest
  | TdlibeditCustomLanguagePackInfoRequest
  | TdlibsetCustomLanguagePackStringRequest
  | TdlibdeleteLanguagePackRequest
  | TdlibprocessPushNotificationRequest
  | TdlibsetUserPrivacySettingRulesRequest
  | TdlibsetReadDatePrivacySettingsRequest
  | TdlibsetNewChatPrivacySettingsRequest
  | TdliballowUnpaidMessagesFromUserRequest
  | TdlibsetChatPaidMessageStarCountRequest
  | TdlibsetOptionRequest
  | TdlibsetAccountTtlRequest
  | TdlibdeleteAccountRequest
  | TdlibsetDefaultMessageAutoDeleteTimeRequest
  | TdlibremoveChatActionBarRequest
  | TdlibreportChatPhotoRequest
  | TdlibreportMessageReactionsRequest
  | TdlibsetNetworkTypeRequest
  | TdlibaddNetworkStatisticsRequest
  | TdlibresetNetworkStatisticsRequest
  | TdlibsetAutoDownloadSettingsRequest
  | TdlibsetAutosaveSettingsRequest
  | TdlibclearAutosaveSettingsExceptionsRequest
  | TdlibdeletePassportElementRequest
  | TdlibsetPassportElementErrorsRequest
  | TdlibcheckEmailAddressVerificationCodeRequest
  | TdlibsendPassportAuthorizationFormRequest
  | TdlibsetBotUpdatesStatusRequest
  | TdlibaddStickerToSetRequest
  | TdlibreplaceStickerInSetRequest
  | TdlibsetStickerSetThumbnailRequest
  | TdlibsetCustomEmojiStickerSetThumbnailRequest
  | TdlibsetStickerSetTitleRequest
  | TdlibdeleteStickerSetRequest
  | TdlibsetStickerPositionInSetRequest
  | TdlibremoveStickerFromSetRequest
  | TdlibsetStickerEmojisRequest
  | TdlibsetStickerKeywordsRequest
  | TdlibsetStickerMaskPositionRequest
  | TdlibviewPremiumFeatureRequest
  | TdlibclickPremiumSubscriptionButtonRequest
  | TdlibapplyPremiumGiftCodeRequest
  | TdlibgiftPremiumWithStarsRequest
  | TdliblaunchPrepaidGiveawayRequest
  | TdlibcanPurchaseFromStoreRequest
  | TdlibassignStoreTransactionRequest
  | TdlibeditStarSubscriptionRequest
  | TdlibeditUserStarSubscriptionRequest
  | TdlibreuseStarSubscriptionRequest
  | TdlibsetChatAffiliateProgramRequest
  | TdlibacceptTermsOfServiceRequest
  | TdlibanswerCustomQueryRequest
  | TdlibsetAlarmRequest
  | TdlibsaveApplicationLogEventRequest
  | TdlibenableProxyRequest
  | TdlibdisableProxyRequest
  | TdlibremoveProxyRequest
  | TdlibsetLogStreamRequest
  | TdlibsetLogVerbosityLevelRequest
  | TdlibsetLogTagVerbosityLevelRequest
  | TdlibaddLogMessageRequest
  | TdlibtestCallEmptyRequest
  | TdlibtestNetworkRequest
  | TdlibtestProxyRequest
  | TdlibtestGetDifferenceRequest
  | TdlibtestReturnErrorRequest
;

export type TdlibResponse =
  | Tdlibdouble
  | Tdlibstring
  | Tdlibint32
  | Tdlibint53
  | Tdlibint64
  | Tdlibbytes
  | TdlibboolFalse
  | TdlibboolTrue
  | TdlibauthenticationCodeTypeTelegramMessage
  | TdlibauthenticationCodeTypeSms
  | TdlibauthenticationCodeTypeSmsWord
  | TdlibauthenticationCodeTypeSmsPhrase
  | TdlibauthenticationCodeTypeCall
  | TdlibauthenticationCodeTypeFlashCall
  | TdlibauthenticationCodeTypeMissedCall
  | TdlibauthenticationCodeTypeFragment
  | TdlibauthenticationCodeTypeFirebaseAndroid
  | TdlibauthenticationCodeTypeFirebaseIos
  | TdlibauthenticationCodeInfo
  | TdlibemailAddressAuthenticationCodeInfo
  | TdlibemailAddressAuthenticationCode
  | TdlibemailAddressAuthenticationAppleId
  | TdlibemailAddressAuthenticationGoogleId
  | TdlibemailAddressResetStateAvailable
  | TdlibemailAddressResetStatePending
  | TdlibtextEntity
  | TdlibtextEntities
  | TdlibformattedText
  | TdlibtermsOfService
  | Tdlibpasskey
  | Tdlibpasskeys
  | TdlibauthorizationStateWaitTdlibParameters
  | TdlibauthorizationStateWaitPhoneNumber
  | TdlibauthorizationStateWaitPremiumPurchase
  | TdlibauthorizationStateWaitEmailAddress
  | TdlibauthorizationStateWaitEmailCode
  | TdlibauthorizationStateWaitCode
  | TdlibauthorizationStateWaitOtherDeviceConfirmation
  | TdlibauthorizationStateWaitRegistration
  | TdlibauthorizationStateWaitPassword
  | TdlibauthorizationStateReady
  | TdlibauthorizationStateLoggingOut
  | TdlibauthorizationStateClosing
  | TdlibauthorizationStateClosed
  | TdlibfirebaseDeviceVerificationParametersSafetyNet
  | TdlibfirebaseDeviceVerificationParametersPlayIntegrity
  | TdlibpasswordState
  | TdlibrecoveryEmailAddress
  | TdlibtemporaryPasswordState
  | TdliblocalFile
  | TdlibremoteFile
  | Tdlibfile
  | TdlibinputFileId
  | TdlibinputFileRemote
  | TdlibinputFileLocal
  | TdlibinputFileGenerated
  | TdlibphotoSize
  | Tdlibminithumbnail
  | TdlibthumbnailFormatJpeg
  | TdlibthumbnailFormatGif
  | TdlibthumbnailFormatMpeg4
  | TdlibthumbnailFormatPng
  | TdlibthumbnailFormatTgs
  | TdlibthumbnailFormatWebm
  | TdlibthumbnailFormatWebp
  | Tdlibthumbnail
  | TdlibmaskPointForehead
  | TdlibmaskPointEyes
  | TdlibmaskPointMouth
  | TdlibmaskPointChin
  | TdlibmaskPosition
  | TdlibstickerFormatWebp
  | TdlibstickerFormatTgs
  | TdlibstickerFormatWebm
  | TdlibstickerTypeRegular
  | TdlibstickerTypeMask
  | TdlibstickerTypeCustomEmoji
  | TdlibstickerFullTypeRegular
  | TdlibstickerFullTypeMask
  | TdlibstickerFullTypeCustomEmoji
  | TdlibclosedVectorPath
  | Tdliboutline
  | TdlibpollOption
  | TdlibpollTypeRegular
  | TdlibpollTypeQuiz
  | TdlibchecklistTask
  | TdlibinputChecklistTask
  | Tdlibchecklist
  | TdlibinputChecklist
  | Tdlibanimation
  | Tdlibaudio
  | Tdlibaudios
  | Tdlibdocument
  | Tdlibphoto
  | Tdlibsticker
  | Tdlibvideo
  | TdlibvideoNote
  | TdlibvoiceNote
  | TdlibanimatedEmoji
  | Tdlibcontact
  | Tdliblocation
  | Tdlibvenue
  | Tdlibgame
  | TdlibstakeDiceState
  | TdlibwebApp
  | Tdlibpoll
  | TdlibalternativeVideo
  | TdlibvideoStoryboard
  | Tdlibbackground
  | Tdlibbackgrounds
  | TdlibchatBackground
  | TdlibprofilePhoto
  | TdlibchatPhotoInfo
  | TdlibprofileTabPosts
  | TdlibprofileTabGifts
  | TdlibprofileTabMedia
  | TdlibprofileTabFiles
  | TdlibprofileTabLinks
  | TdlibprofileTabMusic
  | TdlibprofileTabVoice
  | TdlibprofileTabGifs
  | TdlibuserTypeRegular
  | TdlibuserTypeDeleted
  | TdlibuserTypeBot
  | TdlibuserTypeUnknown
  | TdlibbotCommand
  | TdlibbotCommands
  | TdlibbotMenuButton
  | TdlibbotVerificationParameters
  | TdlibbotVerification
  | TdlibverificationStatus
  | TdlibchatLocation
  | Tdlibbirthdate
  | TdlibcloseBirthdayUser
  | TdlibbusinessAwayMessageScheduleAlways
  | TdlibbusinessAwayMessageScheduleOutsideOfOpeningHours
  | TdlibbusinessAwayMessageScheduleCustom
  | TdlibbusinessLocation
  | TdlibbusinessRecipients
  | TdlibbusinessAwayMessageSettings
  | TdlibbusinessGreetingMessageSettings
  | TdlibbusinessBotRights
  | TdlibbusinessConnectedBot
  | TdlibbusinessStartPage
  | TdlibinputBusinessStartPage
  | TdlibbusinessOpeningHoursInterval
  | TdlibbusinessOpeningHours
  | TdlibbusinessInfo
  | TdlibbusinessChatLink
  | TdlibbusinessChatLinks
  | TdlibinputBusinessChatLink
  | TdlibbusinessChatLinkInfo
  | TdlibchatPhotoStickerTypeRegularOrMask
  | TdlibchatPhotoStickerTypeCustomEmoji
  | TdlibchatPhotoSticker
  | TdlibanimatedChatPhoto
  | TdlibchatPhoto
  | TdlibchatPhotos
  | TdlibinputChatPhotoPrevious
  | TdlibinputChatPhotoStatic
  | TdlibinputChatPhotoAnimation
  | TdlibinputChatPhotoSticker
  | TdlibchatPermissions
  | TdlibchatAdministratorRights
  | TdlibgiftResalePriceStar
  | TdlibgiftResalePriceTon
  | TdlibgiftPurchaseOfferStatePending
  | TdlibgiftPurchaseOfferStateAccepted
  | TdlibgiftPurchaseOfferStateRejected
  | TdlibsuggestedPostPriceStar
  | TdlibsuggestedPostPriceTon
  | TdlibsuggestedPostStatePending
  | TdlibsuggestedPostStateApproved
  | TdlibsuggestedPostStateDeclined
  | TdlibsuggestedPostInfo
  | TdlibinputSuggestedPostInfo
  | TdlibsuggestedPostRefundReasonPostDeleted
  | TdlibsuggestedPostRefundReasonPaymentRefunded
  | TdlibstarAmount
  | TdlibstarSubscriptionTypeChannel
  | TdlibstarSubscriptionTypeBot
  | TdlibstarSubscriptionPricing
  | TdlibstarSubscription
  | TdlibstarSubscriptions
  | TdlibaffiliateTypeCurrentUser
  | TdlibaffiliateTypeBot
  | TdlibaffiliateTypeChannel
  | TdlibaffiliateProgramSortOrderProfitability
  | TdlibaffiliateProgramSortOrderCreationDate
  | TdlibaffiliateProgramSortOrderRevenue
  | TdlibaffiliateProgramParameters
  | TdlibaffiliateProgramInfo
  | TdlibaffiliateInfo
  | TdlibfoundAffiliateProgram
  | TdlibfoundAffiliatePrograms
  | TdlibconnectedAffiliateProgram
  | TdlibconnectedAffiliatePrograms
  | TdlibproductInfo
  | TdlibpremiumPaymentOption
  | TdlibpremiumStatePaymentOption
  | TdlibpremiumGiftPaymentOption
  | TdlibpremiumGiftPaymentOptions
  | TdlibpremiumGiveawayPaymentOption
  | TdlibpremiumGiveawayPaymentOptions
  | TdlibpremiumGiftCodeInfo
  | TdlibstarPaymentOption
  | TdlibstarPaymentOptions
  | TdlibstarGiveawayWinnerOption
  | TdlibstarGiveawayPaymentOption
  | TdlibstarGiveawayPaymentOptions
  | TdlibacceptedGiftTypes
  | TdlibgiftSettings
  | TdlibgiftAuction
  | TdlibgiftBackground
  | TdlibgiftPurchaseLimits
  | TdlibgiftResaleParameters
  | TdlibgiftCollection
  | TdlibgiftCollections
  | TdlibcanSendGiftResultOk
  | TdlibcanSendGiftResultFail
  | TdlibupgradedGiftOriginUpgrade
  | TdlibupgradedGiftOriginTransfer
  | TdlibupgradedGiftOriginResale
  | TdlibupgradedGiftOriginBlockchain
  | TdlibupgradedGiftOriginPrepaidUpgrade
  | TdlibupgradedGiftOriginOffer
  | TdlibupgradedGiftModel
  | TdlibupgradedGiftSymbol
  | TdlibupgradedGiftBackdropColors
  | TdlibupgradedGiftBackdrop
  | TdlibupgradedGiftOriginalDetails
  | TdlibupgradedGiftColors
  | Tdlibgift
  | TdlibupgradedGift
  | TdlibupgradedGiftValueInfo
  | TdlibupgradeGiftResult
  | TdlibavailableGift
  | TdlibavailableGifts
  | TdlibgiftUpgradePrice
  | TdlibupgradedGiftAttributeIdModel
  | TdlibupgradedGiftAttributeIdSymbol
  | TdlibupgradedGiftAttributeIdBackdrop
  | TdlibupgradedGiftModelCount
  | TdlibupgradedGiftSymbolCount
  | TdlibupgradedGiftBackdropCount
  | TdlibgiftForResaleOrderPrice
  | TdlibgiftForResaleOrderPriceChangeDate
  | TdlibgiftForResaleOrderNumber
  | TdlibgiftForResale
  | TdlibgiftsForResale
  | TdlibgiftResaleResultOk
  | TdlibgiftResaleResultPriceIncreased
  | TdlibsentGiftRegular
  | TdlibsentGiftUpgraded
  | TdlibreceivedGift
  | TdlibreceivedGifts
  | TdlibgiftUpgradePreview
  | TdlibgiftUpgradeVariants
  | TdlibauctionBid
  | TdlibuserAuctionBid
  | TdlibauctionRound
  | TdlibauctionStateActive
  | TdlibauctionStateFinished
  | TdlibgiftAuctionState
  | TdlibgiftAuctionAcquiredGift
  | TdlibgiftAuctionAcquiredGifts
  | TdlibtransactionDirectionIncoming
  | TdlibtransactionDirectionOutgoing
  | TdlibstarTransactionTypePremiumBotDeposit
  | TdlibstarTransactionTypeAppStoreDeposit
  | TdlibstarTransactionTypeGooglePlayDeposit
  | TdlibstarTransactionTypeFragmentDeposit
  | TdlibstarTransactionTypeUserDeposit
  | TdlibstarTransactionTypeGiveawayDeposit
  | TdlibstarTransactionTypeFragmentWithdrawal
  | TdlibstarTransactionTypeTelegramAdsWithdrawal
  | TdlibstarTransactionTypeTelegramApiUsage
  | TdlibstarTransactionTypeBotPaidMediaPurchase
  | TdlibstarTransactionTypeBotPaidMediaSale
  | TdlibstarTransactionTypeChannelPaidMediaPurchase
  | TdlibstarTransactionTypeChannelPaidMediaSale
  | TdlibstarTransactionTypeBotInvoicePurchase
  | TdlibstarTransactionTypeBotInvoiceSale
  | TdlibstarTransactionTypeBotSubscriptionPurchase
  | TdlibstarTransactionTypeBotSubscriptionSale
  | TdlibstarTransactionTypeChannelSubscriptionPurchase
  | TdlibstarTransactionTypeChannelSubscriptionSale
  | TdlibstarTransactionTypeGiftAuctionBid
  | TdlibstarTransactionTypeGiftPurchase
  | TdlibstarTransactionTypeGiftPurchaseOffer
  | TdlibstarTransactionTypeGiftTransfer
  | TdlibstarTransactionTypeGiftOriginalDetailsDrop
  | TdlibstarTransactionTypeGiftSale
  | TdlibstarTransactionTypeGiftUpgrade
  | TdlibstarTransactionTypeGiftUpgradePurchase
  | TdlibstarTransactionTypeUpgradedGiftPurchase
  | TdlibstarTransactionTypeUpgradedGiftSale
  | TdlibstarTransactionTypeChannelPaidReactionSend
  | TdlibstarTransactionTypeChannelPaidReactionReceive
  | TdlibstarTransactionTypeAffiliateProgramCommission
  | TdlibstarTransactionTypePaidMessageSend
  | TdlibstarTransactionTypePaidMessageReceive
  | TdlibstarTransactionTypePaidGroupCallMessageSend
  | TdlibstarTransactionTypePaidGroupCallMessageReceive
  | TdlibstarTransactionTypePaidGroupCallReactionSend
  | TdlibstarTransactionTypePaidGroupCallReactionReceive
  | TdlibstarTransactionTypeSuggestedPostPaymentSend
  | TdlibstarTransactionTypeSuggestedPostPaymentReceive
  | TdlibstarTransactionTypePremiumPurchase
  | TdlibstarTransactionTypeBusinessBotTransferSend
  | TdlibstarTransactionTypeBusinessBotTransferReceive
  | TdlibstarTransactionTypePublicPostSearch
  | TdlibstarTransactionTypeUnsupported
  | TdlibstarTransaction
  | TdlibstarTransactions
  | TdlibtonTransactionTypeFragmentDeposit
  | TdlibtonTransactionTypeFragmentWithdrawal
  | TdlibtonTransactionTypeSuggestedPostPayment
  | TdlibtonTransactionTypeGiftPurchaseOffer
  | TdlibtonTransactionTypeUpgradedGiftPurchase
  | TdlibtonTransactionTypeUpgradedGiftSale
  | TdlibtonTransactionTypeUnsupported
  | TdlibtonTransaction
  | TdlibtonTransactions
  | TdlibactiveStoryStateLive
  | TdlibactiveStoryStateUnread
  | TdlibactiveStoryStateRead
  | TdlibgiveawayParticipantStatusEligible
  | TdlibgiveawayParticipantStatusParticipating
  | TdlibgiveawayParticipantStatusAlreadyWasMember
  | TdlibgiveawayParticipantStatusAdministrator
  | TdlibgiveawayParticipantStatusDisallowedCountry
  | TdlibgiveawayInfoOngoing
  | TdlibgiveawayInfoCompleted
  | TdlibgiveawayPrizePremium
  | TdlibgiveawayPrizeStars
  | TdlibaccentColor
  | TdlibprofileAccentColors
  | TdlibprofileAccentColor
  | TdlibuserRating
  | TdlibrestrictionInfo
  | TdlibemojiStatusTypeCustomEmoji
  | TdlibemojiStatusTypeUpgradedGift
  | TdlibemojiStatus
  | TdlibemojiStatuses
  | TdlibemojiStatusCustomEmojis
  | Tdlibusernames
  | Tdlibuser
  | TdlibbotInfo
  | TdlibuserFullInfo
  | Tdlibusers
  | TdlibfoundUsers
  | TdlibchatAdministrator
  | TdlibchatAdministrators
  | TdlibchatMemberStatusCreator
  | TdlibchatMemberStatusAdministrator
  | TdlibchatMemberStatusMember
  | TdlibchatMemberStatusRestricted
  | TdlibchatMemberStatusLeft
  | TdlibchatMemberStatusBanned
  | TdlibchatMember
  | TdlibchatMembers
  | TdlibchatMembersFilterContacts
  | TdlibchatMembersFilterAdministrators
  | TdlibchatMembersFilterMembers
  | TdlibchatMembersFilterMention
  | TdlibchatMembersFilterRestricted
  | TdlibchatMembersFilterBanned
  | TdlibchatMembersFilterBots
  | TdlibsupergroupMembersFilterRecent
  | TdlibsupergroupMembersFilterContacts
  | TdlibsupergroupMembersFilterAdministrators
  | TdlibsupergroupMembersFilterSearch
  | TdlibsupergroupMembersFilterRestricted
  | TdlibsupergroupMembersFilterBanned
  | TdlibsupergroupMembersFilterMention
  | TdlibsupergroupMembersFilterBots
  | TdlibchatInviteLink
  | TdlibchatInviteLinks
  | TdlibchatInviteLinkCount
  | TdlibchatInviteLinkCounts
  | TdlibchatInviteLinkMember
  | TdlibchatInviteLinkMembers
  | TdlibinviteLinkChatTypeBasicGroup
  | TdlibinviteLinkChatTypeSupergroup
  | TdlibinviteLinkChatTypeChannel
  | TdlibchatInviteLinkSubscriptionInfo
  | TdlibchatInviteLinkInfo
  | TdlibchatJoinRequest
  | TdlibchatJoinRequests
  | TdlibchatJoinRequestsInfo
  | TdlibbasicGroup
  | TdlibbasicGroupFullInfo
  | Tdlibsupergroup
  | TdlibsupergroupFullInfo
  | TdlibsecretChatStatePending
  | TdlibsecretChatStateReady
  | TdlibsecretChatStateClosed
  | TdlibsecretChat
  | TdlibpublicPostSearchLimits
  | TdlibmessageSenderUser
  | TdlibmessageSenderChat
  | TdlibmessageSenders
  | TdlibchatMessageSender
  | TdlibchatMessageSenders
  | TdlibmessageReadDateRead
  | TdlibmessageReadDateUnread
  | TdlibmessageReadDateTooOld
  | TdlibmessageReadDateUserPrivacyRestricted
  | TdlibmessageReadDateMyPrivacyRestricted
  | TdlibmessageViewer
  | TdlibmessageViewers
  | TdlibmessageOriginUser
  | TdlibmessageOriginHiddenUser
  | TdlibmessageOriginChat
  | TdlibmessageOriginChannel
  | TdlibforwardSource
  | TdlibreactionTypeEmoji
  | TdlibreactionTypeCustomEmoji
  | TdlibreactionTypePaid
  | TdlibpaidReactionTypeRegular
  | TdlibpaidReactionTypeAnonymous
  | TdlibpaidReactionTypeChat
  | TdlibpaidReactor
  | TdlibliveStoryDonors
  | TdlibmessageForwardInfo
  | TdlibmessageImportInfo
  | TdlibmessageReplyInfo
  | TdlibmessageReaction
  | TdlibmessageReactions
  | TdlibmessageInteractionInfo
  | TdlibunreadReaction
  | TdlibmessageTopicThread
  | TdlibmessageTopicForum
  | TdlibmessageTopicDirectMessages
  | TdlibmessageTopicSavedMessages
  | TdlibmessageEffectTypeEmojiReaction
  | TdlibmessageEffectTypePremiumSticker
  | TdlibmessageEffect
  | TdlibmessageSendingStatePending
  | TdlibmessageSendingStateFailed
  | TdlibtextQuote
  | TdlibinputTextQuote
  | TdlibmessageReplyToMessage
  | TdlibmessageReplyToStory
  | TdlibinputMessageReplyToMessage
  | TdlibinputMessageReplyToExternalMessage
  | TdlibinputMessageReplyToStory
  | TdlibfactCheck
  | Tdlibmessage
  | Tdlibmessages
  | TdlibfoundMessages
  | TdlibfoundChatMessages
  | TdlibfoundPublicPosts
  | TdlibmessagePosition
  | TdlibmessagePositions
  | TdlibmessageCalendarDay
  | TdlibmessageCalendar
  | TdlibbusinessMessage
  | TdlibbusinessMessages
  | TdlibmessageSourceChatHistory
  | TdlibmessageSourceMessageThreadHistory
  | TdlibmessageSourceForumTopicHistory
  | TdlibmessageSourceDirectMessagesChatTopicHistory
  | TdlibmessageSourceHistoryPreview
  | TdlibmessageSourceChatList
  | TdlibmessageSourceSearch
  | TdlibmessageSourceChatEventLog
  | TdlibmessageSourceNotification
  | TdlibmessageSourceScreenshot
  | TdlibmessageSourceOther
  | TdlibadvertisementSponsor
  | TdlibsponsoredMessage
  | TdlibsponsoredMessages
  | TdlibsponsoredChat
  | TdlibsponsoredChats
  | TdlibvideoMessageAdvertisement
  | TdlibvideoMessageAdvertisements
  | TdlibreportOption
  | TdlibreportSponsoredResultOk
  | TdlibreportSponsoredResultFailed
  | TdlibreportSponsoredResultOptionRequired
  | TdlibreportSponsoredResultAdsHidden
  | TdlibreportSponsoredResultPremiumRequired
  | TdlibfileDownload
  | TdlibdownloadedFileCounts
  | TdlibfoundFileDownloads
  | TdlibnotificationSettingsScopePrivateChats
  | TdlibnotificationSettingsScopeGroupChats
  | TdlibnotificationSettingsScopeChannelChats
  | TdlibchatNotificationSettings
  | TdlibscopeNotificationSettings
  | TdlibreactionNotificationSourceNone
  | TdlibreactionNotificationSourceContacts
  | TdlibreactionNotificationSourceAll
  | TdlibreactionNotificationSettings
  | TdlibdraftMessage
  | TdlibchatTypePrivate
  | TdlibchatTypeBasicGroup
  | TdlibchatTypeSupergroup
  | TdlibchatTypeSecret
  | TdlibchatFolderIcon
  | TdlibchatFolderName
  | TdlibchatFolder
  | TdlibchatFolderInfo
  | TdlibchatFolderInviteLink
  | TdlibchatFolderInviteLinks
  | TdlibchatFolderInviteLinkInfo
  | TdlibrecommendedChatFolder
  | TdlibrecommendedChatFolders
  | TdlibarchiveChatListSettings
  | TdlibchatListMain
  | TdlibchatListArchive
  | TdlibchatListFolder
  | TdlibchatLists
  | TdlibchatSourceMtprotoProxy
  | TdlibchatSourcePublicServiceAnnouncement
  | TdlibchatPosition
  | TdlibchatAvailableReactionsAll
  | TdlibchatAvailableReactionsSome
  | TdlibsavedMessagesTag
  | TdlibsavedMessagesTags
  | TdlibbusinessBotManageBar
  | TdlibvideoChat
  | Tdlibchat
  | Tdlibchats
  | TdlibfailedToAddMember
  | TdlibfailedToAddMembers
  | TdlibcreatedBasicGroupChat
  | TdlibpublicChatTypeHasUsername
  | TdlibpublicChatTypeIsLocationBased
  | TdlibaccountInfo
  | TdlibchatActionBarReportSpam
  | TdlibchatActionBarInviteMembers
  | TdlibchatActionBarReportAddBlock
  | TdlibchatActionBarAddContact
  | TdlibchatActionBarSharePhoneNumber
  | TdlibchatActionBarJoinRequest
  | TdlibkeyboardButtonTypeText
  | TdlibkeyboardButtonTypeRequestPhoneNumber
  | TdlibkeyboardButtonTypeRequestLocation
  | TdlibkeyboardButtonTypeRequestPoll
  | TdlibkeyboardButtonTypeRequestUsers
  | TdlibkeyboardButtonTypeRequestChat
  | TdlibkeyboardButtonTypeWebApp
  | TdlibkeyboardButton
  | TdlibinlineKeyboardButtonTypeUrl
  | TdlibinlineKeyboardButtonTypeLoginUrl
  | TdlibinlineKeyboardButtonTypeWebApp
  | TdlibinlineKeyboardButtonTypeCallback
  | TdlibinlineKeyboardButtonTypeCallbackWithPassword
  | TdlibinlineKeyboardButtonTypeCallbackGame
  | TdlibinlineKeyboardButtonTypeSwitchInline
  | TdlibinlineKeyboardButtonTypeBuy
  | TdlibinlineKeyboardButtonTypeUser
  | TdlibinlineKeyboardButtonTypeCopyText
  | TdlibinlineKeyboardButton
  | TdlibreplyMarkupRemoveKeyboard
  | TdlibreplyMarkupForceReply
  | TdlibreplyMarkupShowKeyboard
  | TdlibreplyMarkupInlineKeyboard
  | TdlibloginUrlInfoOpen
  | TdlibloginUrlInfoRequestConfirmation
  | TdlibthemeParameters
  | TdlibwebAppOpenModeCompact
  | TdlibwebAppOpenModeFullSize
  | TdlibwebAppOpenModeFullScreen
  | TdlibfoundWebApp
  | TdlibwebAppInfo
  | TdlibmainWebApp
  | TdlibwebAppOpenParameters
  | TdlibmessageThreadInfo
  | TdlibsavedMessagesTopicTypeMyNotes
  | TdlibsavedMessagesTopicTypeAuthorHidden
  | TdlibsavedMessagesTopicTypeSavedFromChat
  | TdlibsavedMessagesTopic
  | TdlibdirectMessagesChatTopic
  | TdlibforumTopicIcon
  | TdlibforumTopicInfo
  | TdlibforumTopic
  | TdlibforumTopics
  | TdliblinkPreviewOptions
  | TdlibsharedUser
  | TdlibsharedChat
  | TdlibbuiltInThemeClassic
  | TdlibbuiltInThemeDay
  | TdlibbuiltInThemeNight
  | TdlibbuiltInThemeTinted
  | TdlibbuiltInThemeArctic
  | TdlibthemeSettings
  | TdlibrichTextPlain
  | TdlibrichTextBold
  | TdlibrichTextItalic
  | TdlibrichTextUnderline
  | TdlibrichTextStrikethrough
  | TdlibrichTextFixed
  | TdlibrichTextUrl
  | TdlibrichTextEmailAddress
  | TdlibrichTextSubscript
  | TdlibrichTextSuperscript
  | TdlibrichTextMarked
  | TdlibrichTextPhoneNumber
  | TdlibrichTextIcon
  | TdlibrichTextReference
  | TdlibrichTextAnchor
  | TdlibrichTextAnchorLink
  | TdlibrichTexts
  | TdlibpageBlockCaption
  | TdlibpageBlockListItem
  | TdlibpageBlockHorizontalAlignmentLeft
  | TdlibpageBlockHorizontalAlignmentCenter
  | TdlibpageBlockHorizontalAlignmentRight
  | TdlibpageBlockVerticalAlignmentTop
  | TdlibpageBlockVerticalAlignmentMiddle
  | TdlibpageBlockVerticalAlignmentBottom
  | TdlibpageBlockTableCell
  | TdlibpageBlockRelatedArticle
  | TdlibpageBlockTitle
  | TdlibpageBlockSubtitle
  | TdlibpageBlockAuthorDate
  | TdlibpageBlockHeader
  | TdlibpageBlockSubheader
  | TdlibpageBlockKicker
  | TdlibpageBlockParagraph
  | TdlibpageBlockPreformatted
  | TdlibpageBlockFooter
  | TdlibpageBlockDivider
  | TdlibpageBlockAnchor
  | TdlibpageBlockList
  | TdlibpageBlockBlockQuote
  | TdlibpageBlockPullQuote
  | TdlibpageBlockAnimation
  | TdlibpageBlockAudio
  | TdlibpageBlockPhoto
  | TdlibpageBlockVideo
  | TdlibpageBlockVoiceNote
  | TdlibpageBlockCover
  | TdlibpageBlockEmbedded
  | TdlibpageBlockEmbeddedPost
  | TdlibpageBlockCollage
  | TdlibpageBlockSlideshow
  | TdlibpageBlockChatLink
  | TdlibpageBlockTable
  | TdlibpageBlockDetails
  | TdlibpageBlockRelatedArticles
  | TdlibpageBlockMap
  | TdlibwebPageInstantView
  | TdliblinkPreviewAlbumMediaPhoto
  | TdliblinkPreviewAlbumMediaVideo
  | TdliblinkPreviewTypeAlbum
  | TdliblinkPreviewTypeAnimation
  | TdliblinkPreviewTypeApp
  | TdliblinkPreviewTypeArticle
  | TdliblinkPreviewTypeAudio
  | TdliblinkPreviewTypeBackground
  | TdliblinkPreviewTypeChannelBoost
  | TdliblinkPreviewTypeChat
  | TdliblinkPreviewTypeDirectMessagesChat
  | TdliblinkPreviewTypeDocument
  | TdliblinkPreviewTypeEmbeddedAnimationPlayer
  | TdliblinkPreviewTypeEmbeddedAudioPlayer
  | TdliblinkPreviewTypeEmbeddedVideoPlayer
  | TdliblinkPreviewTypeExternalAudio
  | TdliblinkPreviewTypeExternalVideo
  | TdliblinkPreviewTypeGiftAuction
  | TdliblinkPreviewTypeGiftCollection
  | TdliblinkPreviewTypeGroupCall
  | TdliblinkPreviewTypeInvoice
  | TdliblinkPreviewTypeLiveStory
  | TdliblinkPreviewTypeMessage
  | TdliblinkPreviewTypePhoto
  | TdliblinkPreviewTypePremiumGiftCode
  | TdliblinkPreviewTypeShareableChatFolder
  | TdliblinkPreviewTypeSticker
  | TdliblinkPreviewTypeStickerSet
  | TdliblinkPreviewTypeStory
  | TdliblinkPreviewTypeStoryAlbum
  | TdliblinkPreviewTypeSupergroupBoost
  | TdliblinkPreviewTypeTheme
  | TdliblinkPreviewTypeUnsupported
  | TdliblinkPreviewTypeUpgradedGift
  | TdliblinkPreviewTypeUser
  | TdliblinkPreviewTypeVideo
  | TdliblinkPreviewTypeVideoChat
  | TdliblinkPreviewTypeVideoNote
  | TdliblinkPreviewTypeVoiceNote
  | TdliblinkPreviewTypeWebApp
  | TdliblinkPreview
  | TdlibcountryInfo
  | Tdlibcountries
  | TdlibphoneNumberInfo
  | TdlibcollectibleItemTypeUsername
  | TdlibcollectibleItemTypePhoneNumber
  | TdlibcollectibleItemInfo
  | TdlibbankCardActionOpenUrl
  | TdlibbankCardInfo
  | Tdlibaddress
  | TdliblocationAddress
  | TdliblabeledPricePart
  | Tdlibinvoice
  | TdliborderInfo
  | TdlibshippingOption
  | TdlibsavedCredentials
  | TdlibinputCredentialsSaved
  | TdlibinputCredentialsNew
  | TdlibinputCredentialsApplePay
  | TdlibinputCredentialsGooglePay
  | TdlibpaymentProviderSmartGlocal
  | TdlibpaymentProviderStripe
  | TdlibpaymentProviderOther
  | TdlibpaymentOption
  | TdlibpaymentFormTypeRegular
  | TdlibpaymentFormTypeStars
  | TdlibpaymentFormTypeStarSubscription
  | TdlibpaymentForm
  | TdlibvalidatedOrderInfo
  | TdlibpaymentResult
  | TdlibpaymentReceiptTypeRegular
  | TdlibpaymentReceiptTypeStars
  | TdlibpaymentReceipt
  | TdlibinputInvoiceMessage
  | TdlibinputInvoiceName
  | TdlibinputInvoiceTelegram
  | TdlibpaidMediaPreview
  | TdlibpaidMediaPhoto
  | TdlibpaidMediaVideo
  | TdlibpaidMediaUnsupported
  | TdlibgiveawayParameters
  | TdlibdatedFile
  | TdlibpassportElementTypePersonalDetails
  | TdlibpassportElementTypePassport
  | TdlibpassportElementTypeDriverLicense
  | TdlibpassportElementTypeIdentityCard
  | TdlibpassportElementTypeInternalPassport
  | TdlibpassportElementTypeAddress
  | TdlibpassportElementTypeUtilityBill
  | TdlibpassportElementTypeBankStatement
  | TdlibpassportElementTypeRentalAgreement
  | TdlibpassportElementTypePassportRegistration
  | TdlibpassportElementTypeTemporaryRegistration
  | TdlibpassportElementTypePhoneNumber
  | TdlibpassportElementTypeEmailAddress
  | Tdlibdate
  | TdlibpersonalDetails
  | TdlibidentityDocument
  | TdlibinputIdentityDocument
  | TdlibpersonalDocument
  | TdlibinputPersonalDocument
  | TdlibpassportElementPersonalDetails
  | TdlibpassportElementPassport
  | TdlibpassportElementDriverLicense
  | TdlibpassportElementIdentityCard
  | TdlibpassportElementInternalPassport
  | TdlibpassportElementAddress
  | TdlibpassportElementUtilityBill
  | TdlibpassportElementBankStatement
  | TdlibpassportElementRentalAgreement
  | TdlibpassportElementPassportRegistration
  | TdlibpassportElementTemporaryRegistration
  | TdlibpassportElementPhoneNumber
  | TdlibpassportElementEmailAddress
  | TdlibinputPassportElementPersonalDetails
  | TdlibinputPassportElementPassport
  | TdlibinputPassportElementDriverLicense
  | TdlibinputPassportElementIdentityCard
  | TdlibinputPassportElementInternalPassport
  | TdlibinputPassportElementAddress
  | TdlibinputPassportElementUtilityBill
  | TdlibinputPassportElementBankStatement
  | TdlibinputPassportElementRentalAgreement
  | TdlibinputPassportElementPassportRegistration
  | TdlibinputPassportElementTemporaryRegistration
  | TdlibinputPassportElementPhoneNumber
  | TdlibinputPassportElementEmailAddress
  | TdlibpassportElements
  | TdlibpassportElementErrorSourceUnspecified
  | TdlibpassportElementErrorSourceDataField
  | TdlibpassportElementErrorSourceFrontSide
  | TdlibpassportElementErrorSourceReverseSide
  | TdlibpassportElementErrorSourceSelfie
  | TdlibpassportElementErrorSourceTranslationFile
  | TdlibpassportElementErrorSourceTranslationFiles
  | TdlibpassportElementErrorSourceFile
  | TdlibpassportElementErrorSourceFiles
  | TdlibpassportElementError
  | TdlibpassportSuitableElement
  | TdlibpassportRequiredElement
  | TdlibpassportAuthorizationForm
  | TdlibpassportElementsWithErrors
  | TdlibencryptedCredentials
  | TdlibencryptedPassportElement
  | TdlibinputPassportElementErrorSourceUnspecified
  | TdlibinputPassportElementErrorSourceDataField
  | TdlibinputPassportElementErrorSourceFrontSide
  | TdlibinputPassportElementErrorSourceReverseSide
  | TdlibinputPassportElementErrorSourceSelfie
  | TdlibinputPassportElementErrorSourceTranslationFile
  | TdlibinputPassportElementErrorSourceTranslationFiles
  | TdlibinputPassportElementErrorSourceFile
  | TdlibinputPassportElementErrorSourceFiles
  | TdlibinputPassportElementError
  | TdlibmessageText
  | TdlibmessageAnimation
  | TdlibmessageAudio
  | TdlibmessageDocument
  | TdlibmessagePaidMedia
  | TdlibmessagePhoto
  | TdlibmessageSticker
  | TdlibmessageVideo
  | TdlibmessageVideoNote
  | TdlibmessageVoiceNote
  | TdlibmessageExpiredPhoto
  | TdlibmessageExpiredVideo
  | TdlibmessageExpiredVideoNote
  | TdlibmessageExpiredVoiceNote
  | TdlibmessageLocation
  | TdlibmessageVenue
  | TdlibmessageContact
  | TdlibmessageAnimatedEmoji
  | TdlibmessageDice
  | TdlibmessageGame
  | TdlibmessagePoll
  | TdlibmessageStakeDice
  | TdlibmessageStory
  | TdlibmessageChecklist
  | TdlibmessageInvoice
  | TdlibmessageCall
  | TdlibmessageGroupCall
  | TdlibmessageVideoChatScheduled
  | TdlibmessageVideoChatStarted
  | TdlibmessageVideoChatEnded
  | TdlibmessageInviteVideoChatParticipants
  | TdlibmessageBasicGroupChatCreate
  | TdlibmessageSupergroupChatCreate
  | TdlibmessageChatChangeTitle
  | TdlibmessageChatChangePhoto
  | TdlibmessageChatDeletePhoto
  | TdlibmessageChatAddMembers
  | TdlibmessageChatJoinByLink
  | TdlibmessageChatJoinByRequest
  | TdlibmessageChatDeleteMember
  | TdlibmessageChatUpgradeTo
  | TdlibmessageChatUpgradeFrom
  | TdlibmessagePinMessage
  | TdlibmessageScreenshotTaken
  | TdlibmessageChatSetBackground
  | TdlibmessageChatSetTheme
  | TdlibmessageChatSetMessageAutoDeleteTime
  | TdlibmessageChatBoost
  | TdlibmessageForumTopicCreated
  | TdlibmessageForumTopicEdited
  | TdlibmessageForumTopicIsClosedToggled
  | TdlibmessageForumTopicIsHiddenToggled
  | TdlibmessageSuggestProfilePhoto
  | TdlibmessageSuggestBirthdate
  | TdlibmessageCustomServiceAction
  | TdlibmessageGameScore
  | TdlibmessagePaymentSuccessful
  | TdlibmessagePaymentSuccessfulBot
  | TdlibmessagePaymentRefunded
  | TdlibmessageGiftedPremium
  | TdlibmessagePremiumGiftCode
  | TdlibmessageGiveawayCreated
  | TdlibmessageGiveaway
  | TdlibmessageGiveawayCompleted
  | TdlibmessageGiveawayWinners
  | TdlibmessageGiftedStars
  | TdlibmessageGiftedTon
  | TdlibmessageGiveawayPrizeStars
  | TdlibmessageGift
  | TdlibmessageUpgradedGift
  | TdlibmessageRefundedUpgradedGift
  | TdlibmessageUpgradedGiftPurchaseOffer
  | TdlibmessageUpgradedGiftPurchaseOfferRejected
  | TdlibmessagePaidMessagesRefunded
  | TdlibmessagePaidMessagePriceChanged
  | TdlibmessageDirectMessagePriceChanged
  | TdlibmessageChecklistTasksDone
  | TdlibmessageChecklistTasksAdded
  | TdlibmessageSuggestedPostApprovalFailed
  | TdlibmessageSuggestedPostApproved
  | TdlibmessageSuggestedPostDeclined
  | TdlibmessageSuggestedPostPaid
  | TdlibmessageSuggestedPostRefunded
  | TdlibmessageContactRegistered
  | TdlibmessageUsersShared
  | TdlibmessageChatShared
  | TdlibmessageBotWriteAccessAllowed
  | TdlibmessageWebAppDataSent
  | TdlibmessageWebAppDataReceived
  | TdlibmessagePassportDataSent
  | TdlibmessagePassportDataReceived
  | TdlibmessageProximityAlertTriggered
  | TdlibmessageUnsupported
  | TdlibtextEntityTypeMention
  | TdlibtextEntityTypeHashtag
  | TdlibtextEntityTypeCashtag
  | TdlibtextEntityTypeBotCommand
  | TdlibtextEntityTypeUrl
  | TdlibtextEntityTypeEmailAddress
  | TdlibtextEntityTypePhoneNumber
  | TdlibtextEntityTypeBankCardNumber
  | TdlibtextEntityTypeBold
  | TdlibtextEntityTypeItalic
  | TdlibtextEntityTypeUnderline
  | TdlibtextEntityTypeStrikethrough
  | TdlibtextEntityTypeSpoiler
  | TdlibtextEntityTypeCode
  | TdlibtextEntityTypePre
  | TdlibtextEntityTypePreCode
  | TdlibtextEntityTypeBlockQuote
  | TdlibtextEntityTypeExpandableBlockQuote
  | TdlibtextEntityTypeTextUrl
  | TdlibtextEntityTypeMentionName
  | TdlibtextEntityTypeCustomEmoji
  | TdlibtextEntityTypeMediaTimestamp
  | TdlibinputThumbnail
  | TdlibinputPaidMediaTypePhoto
  | TdlibinputPaidMediaTypeVideo
  | TdlibinputPaidMedia
  | TdlibmessageSchedulingStateSendAtDate
  | TdlibmessageSchedulingStateSendWhenOnline
  | TdlibmessageSchedulingStateSendWhenVideoProcessed
  | TdlibmessageSelfDestructTypeTimer
  | TdlibmessageSelfDestructTypeImmediately
  | TdlibmessageSendOptions
  | TdlibmessageCopyOptions
  | TdlibinputMessageText
  | TdlibinputMessageAnimation
  | TdlibinputMessageAudio
  | TdlibinputMessageDocument
  | TdlibinputMessagePaidMedia
  | TdlibinputMessagePhoto
  | TdlibinputMessageSticker
  | TdlibinputMessageVideo
  | TdlibinputMessageVideoNote
  | TdlibinputMessageVoiceNote
  | TdlibinputMessageLocation
  | TdlibinputMessageVenue
  | TdlibinputMessageContact
  | TdlibinputMessageDice
  | TdlibinputMessageGame
  | TdlibinputMessageInvoice
  | TdlibinputMessagePoll
  | TdlibinputMessageStakeDice
  | TdlibinputMessageStory
  | TdlibinputMessageChecklist
  | TdlibinputMessageForwarded
  | TdlibmessageProperties
  | TdlibsearchMessagesFilterEmpty
  | TdlibsearchMessagesFilterAnimation
  | TdlibsearchMessagesFilterAudio
  | TdlibsearchMessagesFilterDocument
  | TdlibsearchMessagesFilterPhoto
  | TdlibsearchMessagesFilterVideo
  | TdlibsearchMessagesFilterVoiceNote
  | TdlibsearchMessagesFilterPhotoAndVideo
  | TdlibsearchMessagesFilterUrl
  | TdlibsearchMessagesFilterChatPhoto
  | TdlibsearchMessagesFilterVideoNote
  | TdlibsearchMessagesFilterVoiceAndVideoNote
  | TdlibsearchMessagesFilterMention
  | TdlibsearchMessagesFilterUnreadMention
  | TdlibsearchMessagesFilterUnreadReaction
  | TdlibsearchMessagesFilterFailedToSend
  | TdlibsearchMessagesFilterPinned
  | TdlibsearchMessagesChatTypeFilterPrivate
  | TdlibsearchMessagesChatTypeFilterGroup
  | TdlibsearchMessagesChatTypeFilterChannel
  | TdlibchatActionTyping
  | TdlibchatActionRecordingVideo
  | TdlibchatActionUploadingVideo
  | TdlibchatActionRecordingVoiceNote
  | TdlibchatActionUploadingVoiceNote
  | TdlibchatActionUploadingPhoto
  | TdlibchatActionUploadingDocument
  | TdlibchatActionChoosingSticker
  | TdlibchatActionChoosingLocation
  | TdlibchatActionChoosingContact
  | TdlibchatActionStartPlayingGame
  | TdlibchatActionRecordingVideoNote
  | TdlibchatActionUploadingVideoNote
  | TdlibchatActionWatchingAnimations
  | TdlibchatActionCancel
  | TdlibuserStatusEmpty
  | TdlibuserStatusOnline
  | TdlibuserStatusOffline
  | TdlibuserStatusRecently
  | TdlibuserStatusLastWeek
  | TdlibuserStatusLastMonth
  | TdlibemojiKeyword
  | TdlibemojiKeywords
  | Tdlibstickers
  | Tdlibemojis
  | TdlibstickerSet
  | TdlibstickerSetInfo
  | TdlibstickerSets
  | TdlibtrendingStickerSets
  | TdlibemojiCategorySourceSearch
  | TdlibemojiCategorySourcePremium
  | TdlibemojiCategory
  | TdlibemojiCategories
  | TdlibemojiCategoryTypeDefault
  | TdlibemojiCategoryTypeRegularStickers
  | TdlibemojiCategoryTypeEmojiStatus
  | TdlibemojiCategoryTypeChatPhoto
  | TdlibcurrentWeather
  | TdlibstoryAreaPosition
  | TdlibstoryAreaTypeLocation
  | TdlibstoryAreaTypeVenue
  | TdlibstoryAreaTypeSuggestedReaction
  | TdlibstoryAreaTypeMessage
  | TdlibstoryAreaTypeLink
  | TdlibstoryAreaTypeWeather
  | TdlibstoryAreaTypeUpgradedGift
  | TdlibstoryArea
  | TdlibinputStoryAreaTypeLocation
  | TdlibinputStoryAreaTypeFoundVenue
  | TdlibinputStoryAreaTypePreviousVenue
  | TdlibinputStoryAreaTypeSuggestedReaction
  | TdlibinputStoryAreaTypeMessage
  | TdlibinputStoryAreaTypeLink
  | TdlibinputStoryAreaTypeWeather
  | TdlibinputStoryAreaTypeUpgradedGift
  | TdlibinputStoryArea
  | TdlibinputStoryAreas
  | TdlibstoryVideo
  | TdlibstoryContentPhoto
  | TdlibstoryContentVideo
  | TdlibstoryContentLive
  | TdlibstoryContentUnsupported
  | TdlibinputStoryContentPhoto
  | TdlibinputStoryContentVideo
  | TdlibstoryListMain
  | TdlibstoryListArchive
  | TdlibstoryOriginPublicStory
  | TdlibstoryOriginHiddenUser
  | TdlibstoryRepostInfo
  | TdlibstoryInteractionInfo
  | Tdlibstory
  | Tdlibstories
  | TdlibfoundStories
  | TdlibstoryAlbum
  | TdlibstoryAlbums
  | TdlibstoryFullId
  | TdlibstoryInfo
  | TdlibchatActiveStories
  | TdlibstoryInteractionTypeView
  | TdlibstoryInteractionTypeForward
  | TdlibstoryInteractionTypeRepost
  | TdlibstoryInteraction
  | TdlibstoryInteractions
  | TdlibquickReplyMessage
  | TdlibquickReplyMessages
  | TdlibquickReplyShortcut
  | TdlibpublicForwardMessage
  | TdlibpublicForwardStory
  | TdlibpublicForwards
  | TdlibbotMediaPreview
  | TdlibbotMediaPreviews
  | TdlibbotMediaPreviewInfo
  | TdlibchatBoostLevelFeatures
  | TdlibchatBoostFeatures
  | TdlibchatBoostSourceGiftCode
  | TdlibchatBoostSourceGiveaway
  | TdlibchatBoostSourcePremium
  | TdlibprepaidGiveaway
  | TdlibchatBoostStatus
  | TdlibchatBoost
  | TdlibfoundChatBoosts
  | TdlibchatBoostSlot
  | TdlibchatBoostSlots
  | TdlibresendCodeReasonUserRequest
  | TdlibresendCodeReasonVerificationFailed
  | TdlibcallDiscardReasonEmpty
  | TdlibcallDiscardReasonMissed
  | TdlibcallDiscardReasonDeclined
  | TdlibcallDiscardReasonDisconnected
  | TdlibcallDiscardReasonHungUp
  | TdlibcallDiscardReasonUpgradeToGroupCall
  | TdlibcallProtocol
  | TdlibcallServerTypeTelegramReflector
  | TdlibcallServerTypeWebrtc
  | TdlibcallServer
  | TdlibcallId
  | TdlibgroupCallId
  | TdlibcallStatePending
  | TdlibcallStateExchangingKeys
  | TdlibcallStateReady
  | TdlibcallStateHangingUp
  | TdlibcallStateDiscarded
  | TdlibcallStateError
  | TdlibgroupCallJoinParameters
  | TdlibgroupCallVideoQualityThumbnail
  | TdlibgroupCallVideoQualityMedium
  | TdlibgroupCallVideoQualityFull
  | TdlibgroupCallStream
  | TdlibgroupCallStreams
  | TdlibrtmpUrl
  | TdlibgroupCallRecentSpeaker
  | TdlibgroupCall
  | TdlibgroupCallVideoSourceGroup
  | TdlibgroupCallParticipantVideoInfo
  | TdlibgroupCallParticipant
  | TdlibgroupCallParticipants
  | TdlibgroupCallInfo
  | TdlibgroupCallMessage
  | TdlibgroupCallMessageLevel
  | TdlibinviteGroupCallParticipantResultUserPrivacyRestricted
  | TdlibinviteGroupCallParticipantResultUserAlreadyParticipant
  | TdlibinviteGroupCallParticipantResultUserWasBanned
  | TdlibinviteGroupCallParticipantResultSuccess
  | TdlibgroupCallDataChannelMain
  | TdlibgroupCallDataChannelScreenSharing
  | TdlibinputGroupCallLink
  | TdlibinputGroupCallMessage
  | TdlibcallProblemEcho
  | TdlibcallProblemNoise
  | TdlibcallProblemInterruptions
  | TdlibcallProblemDistortedSpeech
  | TdlibcallProblemSilentLocal
  | TdlibcallProblemSilentRemote
  | TdlibcallProblemDropped
  | TdlibcallProblemDistortedVideo
  | TdlibcallProblemPixelatedVideo
  | Tdlibcall
  | TdlibfirebaseAuthenticationSettingsAndroid
  | TdlibfirebaseAuthenticationSettingsIos
  | TdlibphoneNumberAuthenticationSettings
  | TdlibaddedReaction
  | TdlibaddedReactions
  | TdlibavailableReaction
  | TdlibavailableReactions
  | TdlibemojiReaction
  | TdlibreactionUnavailabilityReasonAnonymousAdministrator
  | TdlibreactionUnavailabilityReasonGuest
  | Tdlibanimations
  | TdlibdiceStickersRegular
  | TdlibdiceStickersSlotMachine
  | TdlibimportedContact
  | TdlibimportedContacts
  | TdlibspeechRecognitionResultPending
  | TdlibspeechRecognitionResultText
  | TdlibspeechRecognitionResultError
  | TdlibbusinessConnection
  | TdlibattachmentMenuBotColor
  | TdlibattachmentMenuBot
  | TdlibsentWebAppMessage
  | TdlibbotWriteAccessAllowReasonConnectedWebsite
  | TdlibbotWriteAccessAllowReasonAddedToAttachmentMenu
  | TdlibbotWriteAccessAllowReasonLaunchedWebApp
  | TdlibbotWriteAccessAllowReasonAcceptedRequest
  | TdlibhttpUrl
  | TdlibuserLink
  | TdlibtargetChatTypes
  | TdlibtargetChatCurrent
  | TdlibtargetChatChosen
  | TdlibtargetChatInternalLink
  | TdlibinputInlineQueryResultAnimation
  | TdlibinputInlineQueryResultArticle
  | TdlibinputInlineQueryResultAudio
  | TdlibinputInlineQueryResultContact
  | TdlibinputInlineQueryResultDocument
  | TdlibinputInlineQueryResultGame
  | TdlibinputInlineQueryResultLocation
  | TdlibinputInlineQueryResultPhoto
  | TdlibinputInlineQueryResultSticker
  | TdlibinputInlineQueryResultVenue
  | TdlibinputInlineQueryResultVideo
  | TdlibinputInlineQueryResultVoiceNote
  | TdlibinlineQueryResultArticle
  | TdlibinlineQueryResultContact
  | TdlibinlineQueryResultLocation
  | TdlibinlineQueryResultVenue
  | TdlibinlineQueryResultGame
  | TdlibinlineQueryResultAnimation
  | TdlibinlineQueryResultAudio
  | TdlibinlineQueryResultDocument
  | TdlibinlineQueryResultPhoto
  | TdlibinlineQueryResultSticker
  | TdlibinlineQueryResultVideo
  | TdlibinlineQueryResultVoiceNote
  | TdlibinlineQueryResultsButtonTypeStartBot
  | TdlibinlineQueryResultsButtonTypeWebApp
  | TdlibinlineQueryResultsButton
  | TdlibinlineQueryResults
  | TdlibpreparedInlineMessageId
  | TdlibpreparedInlineMessage
  | TdlibcallbackQueryPayloadData
  | TdlibcallbackQueryPayloadDataWithPassword
  | TdlibcallbackQueryPayloadGame
  | TdlibcallbackQueryAnswer
  | TdlibcustomRequestResult
  | TdlibgameHighScore
  | TdlibgameHighScores
  | TdlibchatEventMessageEdited
  | TdlibchatEventMessageDeleted
  | TdlibchatEventMessagePinned
  | TdlibchatEventMessageUnpinned
  | TdlibchatEventPollStopped
  | TdlibchatEventMemberJoined
  | TdlibchatEventMemberJoinedByInviteLink
  | TdlibchatEventMemberJoinedByRequest
  | TdlibchatEventMemberInvited
  | TdlibchatEventMemberLeft
  | TdlibchatEventMemberPromoted
  | TdlibchatEventMemberRestricted
  | TdlibchatEventMemberSubscriptionExtended
  | TdlibchatEventAvailableReactionsChanged
  | TdlibchatEventBackgroundChanged
  | TdlibchatEventDescriptionChanged
  | TdlibchatEventEmojiStatusChanged
  | TdlibchatEventLinkedChatChanged
  | TdlibchatEventLocationChanged
  | TdlibchatEventMessageAutoDeleteTimeChanged
  | TdlibchatEventPermissionsChanged
  | TdlibchatEventPhotoChanged
  | TdlibchatEventSlowModeDelayChanged
  | TdlibchatEventStickerSetChanged
  | TdlibchatEventCustomEmojiStickerSetChanged
  | TdlibchatEventTitleChanged
  | TdlibchatEventUsernameChanged
  | TdlibchatEventActiveUsernamesChanged
  | TdlibchatEventAccentColorChanged
  | TdlibchatEventProfileAccentColorChanged
  | TdlibchatEventHasProtectedContentToggled
  | TdlibchatEventInvitesToggled
  | TdlibchatEventIsAllHistoryAvailableToggled
  | TdlibchatEventHasAggressiveAntiSpamEnabledToggled
  | TdlibchatEventSignMessagesToggled
  | TdlibchatEventShowMessageSenderToggled
  | TdlibchatEventAutomaticTranslationToggled
  | TdlibchatEventInviteLinkEdited
  | TdlibchatEventInviteLinkRevoked
  | TdlibchatEventInviteLinkDeleted
  | TdlibchatEventVideoChatCreated
  | TdlibchatEventVideoChatEnded
  | TdlibchatEventVideoChatMuteNewParticipantsToggled
  | TdlibchatEventVideoChatParticipantIsMutedToggled
  | TdlibchatEventVideoChatParticipantVolumeLevelChanged
  | TdlibchatEventIsForumToggled
  | TdlibchatEventForumTopicCreated
  | TdlibchatEventForumTopicEdited
  | TdlibchatEventForumTopicToggleIsClosed
  | TdlibchatEventForumTopicToggleIsHidden
  | TdlibchatEventForumTopicDeleted
  | TdlibchatEventForumTopicPinned
  | TdlibchatEvent
  | TdlibchatEvents
  | TdlibchatEventLogFilters
  | TdliblanguagePackStringValueOrdinary
  | TdliblanguagePackStringValuePluralized
  | TdliblanguagePackStringValueDeleted
  | TdliblanguagePackString
  | TdliblanguagePackStrings
  | TdliblanguagePackInfo
  | TdliblocalizationTargetInfo
  | TdlibpremiumLimitTypeSupergroupCount
  | TdlibpremiumLimitTypePinnedChatCount
  | TdlibpremiumLimitTypeCreatedPublicChatCount
  | TdlibpremiumLimitTypeSavedAnimationCount
  | TdlibpremiumLimitTypeFavoriteStickerCount
  | TdlibpremiumLimitTypeChatFolderCount
  | TdlibpremiumLimitTypeChatFolderChosenChatCount
  | TdlibpremiumLimitTypePinnedArchivedChatCount
  | TdlibpremiumLimitTypePinnedSavedMessagesTopicCount
  | TdlibpremiumLimitTypeCaptionLength
  | TdlibpremiumLimitTypeBioLength
  | TdlibpremiumLimitTypeChatFolderInviteLinkCount
  | TdlibpremiumLimitTypeShareableChatFolderCount
  | TdlibpremiumLimitTypeActiveStoryCount
  | TdlibpremiumLimitTypeWeeklyPostedStoryCount
  | TdlibpremiumLimitTypeMonthlyPostedStoryCount
  | TdlibpremiumLimitTypeStoryCaptionLength
  | TdlibpremiumLimitTypeStorySuggestedReactionAreaCount
  | TdlibpremiumLimitTypeSimilarChatCount
  | TdlibpremiumFeatureIncreasedLimits
  | TdlibpremiumFeatureIncreasedUploadFileSize
  | TdlibpremiumFeatureImprovedDownloadSpeed
  | TdlibpremiumFeatureVoiceRecognition
  | TdlibpremiumFeatureDisabledAds
  | TdlibpremiumFeatureUniqueReactions
  | TdlibpremiumFeatureUniqueStickers
  | TdlibpremiumFeatureCustomEmoji
  | TdlibpremiumFeatureAdvancedChatManagement
  | TdlibpremiumFeatureProfileBadge
  | TdlibpremiumFeatureEmojiStatus
  | TdlibpremiumFeatureAnimatedProfilePhoto
  | TdlibpremiumFeatureForumTopicIcon
  | TdlibpremiumFeatureAppIcons
  | TdlibpremiumFeatureRealTimeChatTranslation
  | TdlibpremiumFeatureUpgradedStories
  | TdlibpremiumFeatureChatBoost
  | TdlibpremiumFeatureAccentColor
  | TdlibpremiumFeatureBackgroundForBoth
  | TdlibpremiumFeatureSavedMessagesTags
  | TdlibpremiumFeatureMessagePrivacy
  | TdlibpremiumFeatureLastSeenTimes
  | TdlibpremiumFeatureBusiness
  | TdlibpremiumFeatureMessageEffects
  | TdlibpremiumFeatureChecklists
  | TdlibpremiumFeaturePaidMessages
  | TdlibbusinessFeatureLocation
  | TdlibbusinessFeatureOpeningHours
  | TdlibbusinessFeatureQuickReplies
  | TdlibbusinessFeatureGreetingMessage
  | TdlibbusinessFeatureAwayMessage
  | TdlibbusinessFeatureAccountLinks
  | TdlibbusinessFeatureStartPage
  | TdlibbusinessFeatureBots
  | TdlibbusinessFeatureEmojiStatus
  | TdlibbusinessFeatureChatFolderTags
  | TdlibbusinessFeatureUpgradedStories
  | TdlibpremiumStoryFeaturePriorityOrder
  | TdlibpremiumStoryFeatureStealthMode
  | TdlibpremiumStoryFeaturePermanentViewsHistory
  | TdlibpremiumStoryFeatureCustomExpirationDuration
  | TdlibpremiumStoryFeatureSaveStories
  | TdlibpremiumStoryFeatureLinksAndFormatting
  | TdlibpremiumStoryFeatureVideoQuality
  | TdlibpremiumLimit
  | TdlibpremiumFeatures
  | TdlibbusinessFeatures
  | TdlibpremiumSourceLimitExceeded
  | TdlibpremiumSourceFeature
  | TdlibpremiumSourceBusinessFeature
  | TdlibpremiumSourceStoryFeature
  | TdlibpremiumSourceLink
  | TdlibpremiumSourceSettings
  | TdlibpremiumFeaturePromotionAnimation
  | TdlibbusinessFeaturePromotionAnimation
  | TdlibpremiumState
  | TdlibstorePaymentPurposePremiumSubscription
  | TdlibstorePaymentPurposePremiumGift
  | TdlibstorePaymentPurposePremiumGiftCodes
  | TdlibstorePaymentPurposePremiumGiveaway
  | TdlibstorePaymentPurposeStarGiveaway
  | TdlibstorePaymentPurposeStars
  | TdlibstorePaymentPurposeGiftedStars
  | TdlibstoreTransactionAppStore
  | TdlibstoreTransactionGooglePlay
  | TdlibtelegramPaymentPurposePremiumGift
  | TdlibtelegramPaymentPurposePremiumGiftCodes
  | TdlibtelegramPaymentPurposePremiumGiveaway
  | TdlibtelegramPaymentPurposeStars
  | TdlibtelegramPaymentPurposeGiftedStars
  | TdlibtelegramPaymentPurposeStarGiveaway
  | TdlibtelegramPaymentPurposeJoinChat
  | TdlibdeviceTokenFirebaseCloudMessaging
  | TdlibdeviceTokenApplePush
  | TdlibdeviceTokenApplePushVoIP
  | TdlibdeviceTokenWindowsPush
  | TdlibdeviceTokenMicrosoftPush
  | TdlibdeviceTokenMicrosoftPushVoIP
  | TdlibdeviceTokenWebPush
  | TdlibdeviceTokenSimplePush
  | TdlibdeviceTokenUbuntuPush
  | TdlibdeviceTokenBlackBerryPush
  | TdlibdeviceTokenTizenPush
  | TdlibdeviceTokenHuaweiPush
  | TdlibpushReceiverId
  | TdlibbackgroundFillSolid
  | TdlibbackgroundFillGradient
  | TdlibbackgroundFillFreeformGradient
  | TdlibbackgroundTypeWallpaper
  | TdlibbackgroundTypePattern
  | TdlibbackgroundTypeFill
  | TdlibbackgroundTypeChatTheme
  | TdlibinputBackgroundLocal
  | TdlibinputBackgroundRemote
  | TdlibinputBackgroundPrevious
  | TdlibemojiChatTheme
  | TdlibgiftChatTheme
  | TdlibgiftChatThemes
  | TdlibchatThemeEmoji
  | TdlibchatThemeGift
  | TdlibinputChatThemeEmoji
  | TdlibinputChatThemeGift
  | TdlibtimeZone
  | TdlibtimeZones
  | Tdlibhashtags
  | TdlibcanPostStoryResultOk
  | TdlibcanPostStoryResultPremiumNeeded
  | TdlibcanPostStoryResultBoostNeeded
  | TdlibcanPostStoryResultActiveStoryLimitExceeded
  | TdlibcanPostStoryResultWeeklyLimitExceeded
  | TdlibcanPostStoryResultMonthlyLimitExceeded
  | TdlibcanPostStoryResultLiveStoryIsActive
  | TdlibstartLiveStoryResultOk
  | TdlibstartLiveStoryResultFail
  | TdlibcanTransferOwnershipResultOk
  | TdlibcanTransferOwnershipResultPasswordNeeded
  | TdlibcanTransferOwnershipResultPasswordTooFresh
  | TdlibcanTransferOwnershipResultSessionTooFresh
  | TdlibcheckChatUsernameResultOk
  | TdlibcheckChatUsernameResultUsernameInvalid
  | TdlibcheckChatUsernameResultUsernameOccupied
  | TdlibcheckChatUsernameResultUsernamePurchasable
  | TdlibcheckChatUsernameResultPublicChatsTooMany
  | TdlibcheckChatUsernameResultPublicGroupsUnavailable
  | TdlibcheckStickerSetNameResultOk
  | TdlibcheckStickerSetNameResultNameInvalid
  | TdlibcheckStickerSetNameResultNameOccupied
  | TdlibresetPasswordResultOk
  | TdlibresetPasswordResultPending
  | TdlibresetPasswordResultDeclined
  | TdlibmessageFileTypePrivate
  | TdlibmessageFileTypeGroup
  | TdlibmessageFileTypeUnknown
  | TdlibpushMessageContentHidden
  | TdlibpushMessageContentAnimation
  | TdlibpushMessageContentAudio
  | TdlibpushMessageContentContact
  | TdlibpushMessageContentContactRegistered
  | TdlibpushMessageContentDocument
  | TdlibpushMessageContentGame
  | TdlibpushMessageContentGameScore
  | TdlibpushMessageContentInvoice
  | TdlibpushMessageContentLocation
  | TdlibpushMessageContentPaidMedia
  | TdlibpushMessageContentPhoto
  | TdlibpushMessageContentPoll
  | TdlibpushMessageContentPremiumGiftCode
  | TdlibpushMessageContentGiveaway
  | TdlibpushMessageContentGift
  | TdlibpushMessageContentUpgradedGift
  | TdlibpushMessageContentScreenshotTaken
  | TdlibpushMessageContentSticker
  | TdlibpushMessageContentStory
  | TdlibpushMessageContentText
  | TdlibpushMessageContentChecklist
  | TdlibpushMessageContentVideo
  | TdlibpushMessageContentVideoNote
  | TdlibpushMessageContentVoiceNote
  | TdlibpushMessageContentBasicGroupChatCreate
  | TdlibpushMessageContentVideoChatStarted
  | TdlibpushMessageContentVideoChatEnded
  | TdlibpushMessageContentInviteVideoChatParticipants
  | TdlibpushMessageContentChatAddMembers
  | TdlibpushMessageContentChatChangePhoto
  | TdlibpushMessageContentChatChangeTitle
  | TdlibpushMessageContentChatSetBackground
  | TdlibpushMessageContentChatSetTheme
  | TdlibpushMessageContentChatDeleteMember
  | TdlibpushMessageContentChatJoinByLink
  | TdlibpushMessageContentChatJoinByRequest
  | TdlibpushMessageContentRecurringPayment
  | TdlibpushMessageContentSuggestProfilePhoto
  | TdlibpushMessageContentSuggestBirthdate
  | TdlibpushMessageContentProximityAlertTriggered
  | TdlibpushMessageContentChecklistTasksAdded
  | TdlibpushMessageContentChecklistTasksDone
  | TdlibpushMessageContentMessageForwards
  | TdlibpushMessageContentMediaAlbum
  | TdlibnotificationTypeNewMessage
  | TdlibnotificationTypeNewSecretChat
  | TdlibnotificationTypeNewCall
  | TdlibnotificationTypeNewPushMessage
  | TdlibnotificationGroupTypeMessages
  | TdlibnotificationGroupTypeMentions
  | TdlibnotificationGroupTypeSecretChat
  | TdlibnotificationGroupTypeCalls
  | TdlibnotificationSound
  | TdlibnotificationSounds
  | Tdlibnotification
  | TdlibnotificationGroup
  | TdliboptionValueBoolean
  | TdliboptionValueEmpty
  | TdliboptionValueInteger
  | TdliboptionValueString
  | TdlibjsonObjectMember
  | TdlibjsonValueNull
  | TdlibjsonValueBoolean
  | TdlibjsonValueNumber
  | TdlibjsonValueString
  | TdlibjsonValueArray
  | TdlibjsonValueObject
  | TdlibstoryPrivacySettingsEveryone
  | TdlibstoryPrivacySettingsContacts
  | TdlibstoryPrivacySettingsCloseFriends
  | TdlibstoryPrivacySettingsSelectedUsers
  | TdlibuserPrivacySettingRuleAllowAll
  | TdlibuserPrivacySettingRuleAllowContacts
  | TdlibuserPrivacySettingRuleAllowBots
  | TdlibuserPrivacySettingRuleAllowPremiumUsers
  | TdlibuserPrivacySettingRuleAllowUsers
  | TdlibuserPrivacySettingRuleAllowChatMembers
  | TdlibuserPrivacySettingRuleRestrictAll
  | TdlibuserPrivacySettingRuleRestrictContacts
  | TdlibuserPrivacySettingRuleRestrictBots
  | TdlibuserPrivacySettingRuleRestrictUsers
  | TdlibuserPrivacySettingRuleRestrictChatMembers
  | TdlibuserPrivacySettingRules
  | TdlibuserPrivacySettingShowStatus
  | TdlibuserPrivacySettingShowProfilePhoto
  | TdlibuserPrivacySettingShowLinkInForwardedMessages
  | TdlibuserPrivacySettingShowPhoneNumber
  | TdlibuserPrivacySettingShowBio
  | TdlibuserPrivacySettingShowBirthdate
  | TdlibuserPrivacySettingShowProfileAudio
  | TdlibuserPrivacySettingAllowChatInvites
  | TdlibuserPrivacySettingAllowCalls
  | TdlibuserPrivacySettingAllowPeerToPeerCalls
  | TdlibuserPrivacySettingAllowFindingByPhoneNumber
  | TdlibuserPrivacySettingAllowPrivateVoiceAndVideoNoteMessages
  | TdlibuserPrivacySettingAutosaveGifts
  | TdlibuserPrivacySettingAllowUnpaidMessages
  | TdlibreadDatePrivacySettings
  | TdlibnewChatPrivacySettings
  | TdlibcanSendMessageToUserResultOk
  | TdlibcanSendMessageToUserResultUserHasPaidMessages
  | TdlibcanSendMessageToUserResultUserIsDeleted
  | TdlibcanSendMessageToUserResultUserRestrictsNewChats
  | TdlibaccountTtl
  | TdlibmessageAutoDeleteTime
  | TdlibsessionTypeAndroid
  | TdlibsessionTypeApple
  | TdlibsessionTypeBrave
  | TdlibsessionTypeChrome
  | TdlibsessionTypeEdge
  | TdlibsessionTypeFirefox
  | TdlibsessionTypeIpad
  | TdlibsessionTypeIphone
  | TdlibsessionTypeLinux
  | TdlibsessionTypeMac
  | TdlibsessionTypeOpera
  | TdlibsessionTypeSafari
  | TdlibsessionTypeUbuntu
  | TdlibsessionTypeUnknown
  | TdlibsessionTypeVivaldi
  | TdlibsessionTypeWindows
  | TdlibsessionTypeXbox
  | Tdlibsession
  | Tdlibsessions
  | TdlibunconfirmedSession
  | TdlibconnectedWebsite
  | TdlibconnectedWebsites
  | TdlibreportReasonSpam
  | TdlibreportReasonViolence
  | TdlibreportReasonPornography
  | TdlibreportReasonChildAbuse
  | TdlibreportReasonCopyright
  | TdlibreportReasonUnrelatedLocation
  | TdlibreportReasonFake
  | TdlibreportReasonIllegalDrugs
  | TdlibreportReasonPersonalDetails
  | TdlibreportReasonCustom
  | TdlibreportChatResultOk
  | TdlibreportChatResultOptionRequired
  | TdlibreportChatResultTextRequired
  | TdlibreportChatResultMessagesRequired
  | TdlibreportStoryResultOk
  | TdlibreportStoryResultOptionRequired
  | TdlibreportStoryResultTextRequired
  | TdlibinternalLinkTypeActiveSessions
  | TdlibinternalLinkTypeAttachmentMenuBot
  | TdlibinternalLinkTypeAuthenticationCode
  | TdlibinternalLinkTypeBackground
  | TdlibinternalLinkTypeBotAddToChannel
  | TdlibinternalLinkTypeBotStart
  | TdlibinternalLinkTypeBotStartInGroup
  | TdlibinternalLinkTypeBusinessChat
  | TdlibinternalLinkTypeBuyStars
  | TdlibinternalLinkTypeChangePhoneNumber
  | TdlibinternalLinkTypeChatAffiliateProgram
  | TdlibinternalLinkTypeChatBoost
  | TdlibinternalLinkTypeChatFolderInvite
  | TdlibinternalLinkTypeChatFolderSettings
  | TdlibinternalLinkTypeChatInvite
  | TdlibinternalLinkTypeDefaultMessageAutoDeleteTimerSettings
  | TdlibinternalLinkTypeDirectMessagesChat
  | TdlibinternalLinkTypeEditProfileSettings
  | TdlibinternalLinkTypeGame
  | TdlibinternalLinkTypeGiftAuction
  | TdlibinternalLinkTypeGiftCollection
  | TdlibinternalLinkTypeGroupCall
  | TdlibinternalLinkTypeInstantView
  | TdlibinternalLinkTypeInvoice
  | TdlibinternalLinkTypeLanguagePack
  | TdlibinternalLinkTypeLanguageSettings
  | TdlibinternalLinkTypeLiveStory
  | TdlibinternalLinkTypeLoginEmailSettings
  | TdlibinternalLinkTypeMainWebApp
  | TdlibinternalLinkTypeMessage
  | TdlibinternalLinkTypeMessageDraft
  | TdlibinternalLinkTypeMyStars
  | TdlibinternalLinkTypeMyToncoins
  | TdlibinternalLinkTypePassportDataRequest
  | TdlibinternalLinkTypePasswordSettings
  | TdlibinternalLinkTypePhoneNumberConfirmation
  | TdlibinternalLinkTypePhoneNumberPrivacySettings
  | TdlibinternalLinkTypePremiumFeatures
  | TdlibinternalLinkTypePremiumGift
  | TdlibinternalLinkTypePremiumGiftCode
  | TdlibinternalLinkTypePrivacyAndSecuritySettings
  | TdlibinternalLinkTypeProxy
  | TdlibinternalLinkTypePublicChat
  | TdlibinternalLinkTypeQrCodeAuthentication
  | TdlibinternalLinkTypeRestorePurchases
  | TdlibinternalLinkTypeSettings
  | TdlibinternalLinkTypeStickerSet
  | TdlibinternalLinkTypeStory
  | TdlibinternalLinkTypeStoryAlbum
  | TdlibinternalLinkTypeTheme
  | TdlibinternalLinkTypeThemeSettings
  | TdlibinternalLinkTypeUnknownDeepLink
  | TdlibinternalLinkTypeUnsupportedProxy
  | TdlibinternalLinkTypeUpgradedGift
  | TdlibinternalLinkTypeUserPhoneNumber
  | TdlibinternalLinkTypeUserToken
  | TdlibinternalLinkTypeVideoChat
  | TdlibinternalLinkTypeWebApp
  | TdlibmessageLink
  | TdlibmessageLinkInfo
  | TdlibchatBoostLink
  | TdlibchatBoostLinkInfo
  | TdlibblockListMain
  | TdlibblockListStories
  | TdlibfileTypeNone
  | TdlibfileTypeAnimation
  | TdlibfileTypeAudio
  | TdlibfileTypeDocument
  | TdlibfileTypeNotificationSound
  | TdlibfileTypePhoto
  | TdlibfileTypePhotoStory
  | TdlibfileTypeProfilePhoto
  | TdlibfileTypeSecret
  | TdlibfileTypeSecretThumbnail
  | TdlibfileTypeSecure
  | TdlibfileTypeSelfDestructingPhoto
  | TdlibfileTypeSelfDestructingVideo
  | TdlibfileTypeSelfDestructingVideoNote
  | TdlibfileTypeSelfDestructingVoiceNote
  | TdlibfileTypeSticker
  | TdlibfileTypeThumbnail
  | TdlibfileTypeUnknown
  | TdlibfileTypeVideo
  | TdlibfileTypeVideoNote
  | TdlibfileTypeVideoStory
  | TdlibfileTypeVoiceNote
  | TdlibfileTypeWallpaper
  | TdlibstorageStatisticsByFileType
  | TdlibstorageStatisticsByChat
  | TdlibstorageStatistics
  | TdlibstorageStatisticsFast
  | TdlibdatabaseStatistics
  | TdlibnetworkTypeNone
  | TdlibnetworkTypeMobile
  | TdlibnetworkTypeMobileRoaming
  | TdlibnetworkTypeWiFi
  | TdlibnetworkTypeOther
  | TdlibnetworkStatisticsEntryFile
  | TdlibnetworkStatisticsEntryCall
  | TdlibnetworkStatistics
  | TdlibautoDownloadSettings
  | TdlibautoDownloadSettingsPresets
  | TdlibautosaveSettingsScopePrivateChats
  | TdlibautosaveSettingsScopeGroupChats
  | TdlibautosaveSettingsScopeChannelChats
  | TdlibautosaveSettingsScopeChat
  | TdlibscopeAutosaveSettings
  | TdlibautosaveSettingsException
  | TdlibautosaveSettings
  | TdlibconnectionStateWaitingForNetwork
  | TdlibconnectionStateConnectingToProxy
  | TdlibconnectionStateConnecting
  | TdlibconnectionStateUpdating
  | TdlibconnectionStateReady
  | TdlibageVerificationParameters
  | TdlibtopChatCategoryUsers
  | TdlibtopChatCategoryBots
  | TdlibtopChatCategoryGroups
  | TdlibtopChatCategoryChannels
  | TdlibtopChatCategoryInlineBots
  | TdlibtopChatCategoryWebAppBots
  | TdlibtopChatCategoryCalls
  | TdlibtopChatCategoryForwardChats
  | TdlibfoundPosition
  | TdlibfoundPositions
  | TdlibtMeUrlTypeUser
  | TdlibtMeUrlTypeSupergroup
  | TdlibtMeUrlTypeChatInvite
  | TdlibtMeUrlTypeStickerSet
  | TdlibtMeUrl
  | TdlibtMeUrls
  | TdlibsuggestedActionEnableArchiveAndMuteNewChats
  | TdlibsuggestedActionCheckPassword
  | TdlibsuggestedActionCheckPhoneNumber
  | TdlibsuggestedActionViewChecksHint
  | TdlibsuggestedActionConvertToBroadcastGroup
  | TdlibsuggestedActionSetPassword
  | TdlibsuggestedActionUpgradePremium
  | TdlibsuggestedActionRestorePremium
  | TdlibsuggestedActionSubscribeToAnnualPremium
  | TdlibsuggestedActionGiftPremiumForChristmas
  | TdlibsuggestedActionSetBirthdate
  | TdlibsuggestedActionSetProfilePhoto
  | TdlibsuggestedActionExtendPremium
  | TdlibsuggestedActionExtendStarSubscriptions
  | TdlibsuggestedActionCustom
  | TdlibsuggestedActionSetLoginEmailAddress
  | TdlibsuggestedActionAddLoginPasskey
  | Tdlibcount
  | Tdlibtext
  | Tdlibdata
  | Tdlibseconds
  | TdlibfileDownloadedPrefixSize
  | TdlibstarCount
  | TdlibdeepLinkInfo
  | TdlibtextParseModeMarkdown
  | TdlibtextParseModeHTML
  | TdlibproxyTypeSocks5
  | TdlibproxyTypeHttp
  | TdlibproxyTypeMtproto
  | Tdlibproxy
  | Tdlibproxies
  | TdlibinputSticker
  | TdlibdateRange
  | TdlibstatisticalValue
  | TdlibstatisticalGraphData
  | TdlibstatisticalGraphAsync
  | TdlibstatisticalGraphError
  | TdlibchatStatisticsObjectTypeMessage
  | TdlibchatStatisticsObjectTypeStory
  | TdlibchatStatisticsInteractionInfo
  | TdlibchatStatisticsMessageSenderInfo
  | TdlibchatStatisticsAdministratorActionsInfo
  | TdlibchatStatisticsInviterInfo
  | TdlibchatStatisticsSupergroup
  | TdlibchatStatisticsChannel
  | TdlibchatRevenueAmount
  | TdlibchatRevenueStatistics
  | TdlibmessageStatistics
  | TdlibstoryStatistics
  | TdlibrevenueWithdrawalStatePending
  | TdlibrevenueWithdrawalStateSucceeded
  | TdlibrevenueWithdrawalStateFailed
  | TdlibchatRevenueTransactionTypeUnsupported
  | TdlibchatRevenueTransactionTypeSponsoredMessageEarnings
  | TdlibchatRevenueTransactionTypeSuggestedPostEarnings
  | TdlibchatRevenueTransactionTypeFragmentWithdrawal
  | TdlibchatRevenueTransactionTypeFragmentRefund
  | TdlibchatRevenueTransaction
  | TdlibchatRevenueTransactions
  | TdlibstarRevenueStatus
  | TdlibstarRevenueStatistics
  | TdlibtonRevenueStatus
  | TdlibtonRevenueStatistics
  | Tdlibpoint
  | TdlibvectorPathCommandLine
  | TdlibvectorPathCommandCubicBezierCurve
  | TdlibbotCommandScopeDefault
  | TdlibbotCommandScopeAllPrivateChats
  | TdlibbotCommandScopeAllGroupChats
  | TdlibbotCommandScopeAllChatAdministrators
  | TdlibbotCommandScopeChat
  | TdlibbotCommandScopeChatAdministrators
  | TdlibbotCommandScopeChatMember
  | TdlibphoneNumberCodeTypeChange
  | TdlibphoneNumberCodeTypeVerify
  | TdlibphoneNumberCodeTypeConfirmOwnership
  | TdlibupdateAuthorizationState
  | TdlibupdateNewMessage
  | TdlibupdateMessageSendAcknowledged
  | TdlibupdateMessageSendSucceeded
  | TdlibupdateMessageSendFailed
  | TdlibupdateMessageContent
  | TdlibupdateMessageEdited
  | TdlibupdateMessageIsPinned
  | TdlibupdateMessageInteractionInfo
  | TdlibupdateMessageContentOpened
  | TdlibupdateMessageMentionRead
  | TdlibupdateMessageUnreadReactions
  | TdlibupdateMessageFactCheck
  | TdlibupdateMessageSuggestedPostInfo
  | TdlibupdateMessageLiveLocationViewed
  | TdlibupdateVideoPublished
  | TdlibupdateNewChat
  | TdlibupdateChatTitle
  | TdlibupdateChatPhoto
  | TdlibupdateChatAccentColors
  | TdlibupdateChatPermissions
  | TdlibupdateChatLastMessage
  | TdlibupdateChatPosition
  | TdlibupdateChatAddedToList
  | TdlibupdateChatRemovedFromList
  | TdlibupdateChatReadInbox
  | TdlibupdateChatReadOutbox
  | TdlibupdateChatActionBar
  | TdlibupdateChatBusinessBotManageBar
  | TdlibupdateChatAvailableReactions
  | TdlibupdateChatDraftMessage
  | TdlibupdateChatEmojiStatus
  | TdlibupdateChatMessageSender
  | TdlibupdateChatMessageAutoDeleteTime
  | TdlibupdateChatNotificationSettings
  | TdlibupdateChatPendingJoinRequests
  | TdlibupdateChatReplyMarkup
  | TdlibupdateChatBackground
  | TdlibupdateChatTheme
  | TdlibupdateChatUnreadMentionCount
  | TdlibupdateChatUnreadReactionCount
  | TdlibupdateChatVideoChat
  | TdlibupdateChatDefaultDisableNotification
  | TdlibupdateChatHasProtectedContent
  | TdlibupdateChatIsTranslatable
  | TdlibupdateChatIsMarkedAsUnread
  | TdlibupdateChatViewAsTopics
  | TdlibupdateChatBlockList
  | TdlibupdateChatHasScheduledMessages
  | TdlibupdateChatFolders
  | TdlibupdateChatOnlineMemberCount
  | TdlibupdateSavedMessagesTopic
  | TdlibupdateSavedMessagesTopicCount
  | TdlibupdateDirectMessagesChatTopic
  | TdlibupdateTopicMessageCount
  | TdlibupdateQuickReplyShortcut
  | TdlibupdateQuickReplyShortcutDeleted
  | TdlibupdateQuickReplyShortcuts
  | TdlibupdateQuickReplyShortcutMessages
  | TdlibupdateForumTopicInfo
  | TdlibupdateForumTopic
  | TdlibupdateScopeNotificationSettings
  | TdlibupdateReactionNotificationSettings
  | TdlibupdateNotification
  | TdlibupdateNotificationGroup
  | TdlibupdateActiveNotifications
  | TdlibupdateHavePendingNotifications
  | TdlibupdateDeleteMessages
  | TdlibupdateChatAction
  | TdlibupdatePendingTextMessage
  | TdlibupdateUserStatus
  | TdlibupdateUser
  | TdlibupdateBasicGroup
  | TdlibupdateSupergroup
  | TdlibupdateSecretChat
  | TdlibupdateUserFullInfo
  | TdlibupdateBasicGroupFullInfo
  | TdlibupdateSupergroupFullInfo
  | TdlibupdateServiceNotification
  | TdlibupdateFile
  | TdlibupdateFileGenerationStart
  | TdlibupdateFileGenerationStop
  | TdlibupdateFileDownloads
  | TdlibupdateFileAddedToDownloads
  | TdlibupdateFileDownload
  | TdlibupdateFileRemovedFromDownloads
  | TdlibupdateApplicationVerificationRequired
  | TdlibupdateApplicationRecaptchaVerificationRequired
  | TdlibupdateCall
  | TdlibupdateGroupCall
  | TdlibupdateGroupCallParticipant
  | TdlibupdateGroupCallParticipants
  | TdlibupdateGroupCallVerificationState
  | TdlibupdateNewGroupCallMessage
  | TdlibupdateNewGroupCallPaidReaction
  | TdlibupdateGroupCallMessageSendFailed
  | TdlibupdateGroupCallMessagesDeleted
  | TdlibupdateLiveStoryTopDonors
  | TdlibupdateNewCallSignalingData
  | TdlibupdateGiftAuctionState
  | TdlibupdateActiveGiftAuctions
  | TdlibupdateUserPrivacySettingRules
  | TdlibupdateUnreadMessageCount
  | TdlibupdateUnreadChatCount
  | TdlibupdateStory
  | TdlibupdateStoryDeleted
  | TdlibupdateStoryPostSucceeded
  | TdlibupdateStoryPostFailed
  | TdlibupdateChatActiveStories
  | TdlibupdateStoryListChatCount
  | TdlibupdateStoryStealthMode
  | TdlibupdateTrustedMiniAppBots
  | TdlibupdateOption
  | TdlibupdateStickerSet
  | TdlibupdateInstalledStickerSets
  | TdlibupdateTrendingStickerSets
  | TdlibupdateRecentStickers
  | TdlibupdateFavoriteStickers
  | TdlibupdateSavedAnimations
  | TdlibupdateSavedNotificationSounds
  | TdlibupdateDefaultBackground
  | TdlibupdateEmojiChatThemes
  | TdlibupdateAccentColors
  | TdlibupdateProfileAccentColors
  | TdlibupdateLanguagePackStrings
  | TdlibupdateConnectionState
  | TdlibupdateFreezeState
  | TdlibupdateAgeVerificationParameters
  | TdlibupdateTermsOfService
  | TdlibupdateUnconfirmedSession
  | TdlibupdateAttachmentMenuBots
  | TdlibupdateWebAppMessageSent
  | TdlibupdateActiveEmojiReactions
  | TdlibupdateAvailableMessageEffects
  | TdlibupdateDefaultReactionType
  | TdlibupdateDefaultPaidReactionType
  | TdlibupdateSavedMessagesTags
  | TdlibupdateActiveLiveLocationMessages
  | TdlibupdateOwnedStarCount
  | TdlibupdateOwnedTonCount
  | TdlibupdateChatRevenueAmount
  | TdlibupdateStarRevenueStatus
  | TdlibupdateTonRevenueStatus
  | TdlibupdateSpeechRecognitionTrial
  | TdlibupdateGroupCallMessageLevels
  | TdlibupdateDiceEmojis
  | TdlibupdateStakeDiceState
  | TdlibupdateAnimatedEmojiMessageClicked
  | TdlibupdateAnimationSearchParameters
  | TdlibupdateSuggestedActions
  | TdlibupdateSpeedLimitNotification
  | TdlibupdateContactCloseBirthdays
  | TdlibupdateAutosaveSettings
  | TdlibupdateBusinessConnection
  | TdlibupdateNewBusinessMessage
  | TdlibupdateBusinessMessageEdited
  | TdlibupdateBusinessMessagesDeleted
  | TdlibupdateNewInlineQuery
  | TdlibupdateNewChosenInlineResult
  | TdlibupdateNewCallbackQuery
  | TdlibupdateNewInlineCallbackQuery
  | TdlibupdateNewBusinessCallbackQuery
  | TdlibupdateNewShippingQuery
  | TdlibupdateNewPreCheckoutQuery
  | TdlibupdateNewCustomEvent
  | TdlibupdateNewCustomQuery
  | TdlibupdatePoll
  | TdlibupdatePollAnswer
  | TdlibupdateChatMember
  | TdlibupdateNewChatJoinRequest
  | TdlibupdateChatBoost
  | TdlibupdateMessageReaction
  | TdlibupdateMessageReactions
  | TdlibupdatePaidMediaPurchased
  | Tdlibupdates
  | TdliblogStreamDefault
  | TdliblogStreamFile
  | TdliblogStreamEmpty
  | TdliblogVerbosityLevel
  | TdliblogTags
  | TdlibuserSupportInfo
  | TdlibtestInt
  | TdlibtestString
  | TdlibtestBytes
  | TdlibtestVectorInt
  | TdlibtestVectorIntObject
  | TdlibtestVectorString
  | TdlibtestVectorStringObject
  | TdlibgetAuthorizationState
  | TdlibgetAuthenticationPasskeyParameters
  | TdlibconfirmQrCodeAuthentication
  | TdlibgetCurrentState
  | TdlibgetPasswordState
  | TdlibsetPassword
  | TdlibsetLoginEmailAddress
  | TdlibresendLoginEmailAddressCode
  | TdlibgetRecoveryEmailAddress
  | TdlibsetRecoveryEmailAddress
  | TdlibcheckRecoveryEmailAddressCode
  | TdlibresendRecoveryEmailAddressCode
  | TdlibcancelRecoveryEmailAddressVerification
  | TdlibrequestPasswordRecovery
  | TdlibrecoverPassword
  | TdlibresetPassword
  | TdlibcreateTemporaryPassword
  | TdlibgetTemporaryPasswordState
  | TdlibgetMe
  | TdlibgetUser
  | TdlibgetUserFullInfo
  | TdlibgetBasicGroup
  | TdlibgetBasicGroupFullInfo
  | TdlibgetSupergroup
  | TdlibgetSupergroupFullInfo
  | TdlibgetSecretChat
  | TdlibgetChat
  | TdlibgetMessage
  | TdlibgetMessageLocally
  | TdlibgetRepliedMessage
  | TdlibgetChatPinnedMessage
  | TdlibgetCallbackQueryMessage
  | TdlibgetMessages
  | TdlibgetMessageProperties
  | TdlibgetMessageThread
  | TdlibgetMessageReadDate
  | TdlibgetMessageViewers
  | TdlibgetMessageAuthor
  | TdlibgetFile
  | TdlibgetRemoteFile
  | TdlibgetChats
  | TdlibsearchPublicChat
  | TdlibsearchPublicChats
  | TdlibsearchChats
  | TdlibsearchChatsOnServer
  | TdlibgetRecommendedChats
  | TdlibgetChatSimilarChats
  | TdlibgetChatSimilarChatCount
  | TdlibgetBotSimilarBots
  | TdlibgetBotSimilarBotCount
  | TdlibgetTopChats
  | TdlibsearchRecentlyFoundChats
  | TdlibgetRecentlyOpenedChats
  | TdlibcheckChatUsername
  | TdlibgetCreatedPublicChats
  | TdlibgetSuitableDiscussionChats
  | TdlibgetInactiveSupergroupChats
  | TdlibgetSuitablePersonalChats
  | TdlibgetDirectMessagesChatTopic
  | TdlibgetDirectMessagesChatTopicHistory
  | TdlibgetDirectMessagesChatTopicMessageByDate
  | TdlibgetDirectMessagesChatTopicRevenue
  | TdlibgetSavedMessagesTopicHistory
  | TdlibgetSavedMessagesTopicMessageByDate
  | TdlibgetGroupsInCommon
  | TdlibgetChatHistory
  | TdlibgetMessageThreadHistory
  | TdlibsearchChatMessages
  | TdlibsearchMessages
  | TdlibsearchSecretMessages
  | TdlibsearchSavedMessages
  | TdlibsearchCallMessages
  | TdlibsearchOutgoingDocumentMessages
  | TdlibgetPublicPostSearchLimits
  | TdlibsearchPublicPosts
  | TdlibsearchPublicMessagesByTag
  | TdlibsearchPublicStoriesByTag
  | TdlibsearchPublicStoriesByLocation
  | TdlibsearchPublicStoriesByVenue
  | TdlibgetSearchedForTags
  | TdlibsearchChatRecentLocationMessages
  | TdlibgetChatMessageByDate
  | TdlibgetChatSparseMessagePositions
  | TdlibgetChatMessageCalendar
  | TdlibgetChatMessageCount
  | TdlibgetChatMessagePosition
  | TdlibgetChatScheduledMessages
  | TdlibgetChatSponsoredMessages
  | TdlibreportChatSponsoredMessage
  | TdlibgetSearchSponsoredChats
  | TdlibreportSponsoredChat
  | TdlibgetVideoMessageAdvertisements
  | TdlibreportVideoMessageAdvertisement
  | TdlibgetMessageLink
  | TdlibgetMessageEmbeddingCode
  | TdlibgetMessageLinkInfo
  | TdlibtranslateText
  | TdlibtranslateMessageText
  | TdlibsummarizeMessage
  | TdlibgetChatAvailableMessageSenders
  | TdlibsendMessage
  | TdlibsendMessageAlbum
  | TdlibsendBotStartMessage
  | TdlibsendInlineQueryResultMessage
  | TdlibforwardMessages
  | TdlibsendQuickReplyShortcutMessages
  | TdlibresendMessages
  | TdlibaddLocalMessage
  | TdlibeditMessageText
  | TdlibeditMessageLiveLocation
  | TdlibeditMessageChecklist
  | TdlibeditMessageMedia
  | TdlibeditMessageCaption
  | TdlibeditMessageReplyMarkup
  | TdlibsendBusinessMessage
  | TdlibsendBusinessMessageAlbum
  | TdlibeditBusinessMessageText
  | TdlibeditBusinessMessageLiveLocation
  | TdlibeditBusinessMessageChecklist
  | TdlibeditBusinessMessageMedia
  | TdlibeditBusinessMessageCaption
  | TdlibeditBusinessMessageReplyMarkup
  | TdlibstopBusinessPoll
  | TdlibeditBusinessStory
  | TdlibgetBusinessAccountStarAmount
  | TdlibaddQuickReplyShortcutMessage
  | TdlibaddQuickReplyShortcutInlineQueryResultMessage
  | TdlibaddQuickReplyShortcutMessageAlbum
  | TdlibreaddQuickReplyShortcutMessages
  | TdlibgetForumTopicDefaultIcons
  | TdlibcreateForumTopic
  | TdlibgetForumTopic
  | TdlibgetForumTopicHistory
  | TdlibgetForumTopicLink
  | TdlibgetForumTopics
  | TdlibgetPasskeyParameters
  | TdlibaddLoginPasskey
  | TdlibgetLoginPasskeys
  | TdlibgetEmojiReaction
  | TdlibgetCustomEmojiReactionAnimations
  | TdlibgetMessageAvailableReactions
  | TdlibgetChatAvailablePaidMessageReactionSenders
  | TdlibgetMessageAddedReactions
  | TdlibgetSavedMessagesTags
  | TdlibgetMessageEffect
  | TdlibsearchQuote
  | TdlibgetTextEntities
  | TdlibparseTextEntities
  | TdlibparseMarkdown
  | TdlibgetMarkdownText
  | TdlibgetCountryFlagEmoji
  | TdlibgetFileMimeType
  | TdlibgetFileExtension
  | TdlibcleanFileName
  | TdlibgetLanguagePackString
  | TdlibgetJsonValue
  | TdlibgetJsonString
  | TdlibgetThemeParametersJsonString
  | TdlibgetPollVoters
  | TdlibgetBusinessConnection
  | TdlibgetLoginUrlInfo
  | TdlibgetLoginUrl
  | TdlibgetInlineQueryResults
  | TdlibsavePreparedInlineMessage
  | TdlibgetPreparedInlineMessage
  | TdlibgetGrossingWebAppBots
  | TdlibsearchWebApp
  | TdlibgetWebAppPlaceholder
  | TdlibgetWebAppLinkUrl
  | TdlibgetMainWebApp
  | TdlibgetWebAppUrl
  | TdlibopenWebApp
  | TdlibanswerWebAppQuery
  | TdlibgetCallbackQueryAnswer
  | TdlibsetGameScore
  | TdlibgetGameHighScores
  | TdlibgetInlineGameHighScores
  | TdlibclickAnimatedEmojiMessage
  | TdlibgetInternalLink
  | TdlibgetInternalLinkType
  | TdlibgetExternalLinkInfo
  | TdlibgetExternalLink
  | TdlibcreatePrivateChat
  | TdlibcreateBasicGroupChat
  | TdlibcreateSupergroupChat
  | TdlibcreateSecretChat
  | TdlibcreateNewBasicGroupChat
  | TdlibcreateNewSupergroupChat
  | TdlibcreateNewSecretChat
  | TdlibupgradeBasicGroupChatToSupergroupChat
  | TdlibgetChatListsToAddChat
  | TdlibgetChatFolder
  | TdlibcreateChatFolder
  | TdlibeditChatFolder
  | TdlibgetChatFolderChatsToLeave
  | TdlibgetChatFolderChatCount
  | TdlibgetRecommendedChatFolders
  | TdlibgetChatFolderDefaultIconName
  | TdlibgetChatsForChatFolderInviteLink
  | TdlibcreateChatFolderInviteLink
  | TdlibgetChatFolderInviteLinks
  | TdlibeditChatFolderInviteLink
  | TdlibcheckChatFolderInviteLink
  | TdlibgetChatFolderNewChats
  | TdlibgetArchiveChatListSettings
  | TdlibgetGiftChatThemes
  | TdlibaddChatMember
  | TdlibaddChatMembers
  | TdlibcanTransferOwnership
  | TdlibgetChatMember
  | TdlibsearchChatMembers
  | TdlibgetChatAdministrators
  | TdlibgetStakeDiceState
  | TdlibgetSavedNotificationSound
  | TdlibgetSavedNotificationSounds
  | TdlibaddSavedNotificationSound
  | TdlibgetChatNotificationSettingsExceptions
  | TdlibgetScopeNotificationSettings
  | TdlibgetCurrentWeather
  | TdlibgetStory
  | TdlibgetChatsToPostStories
  | TdlibcanPostStory
  | TdlibpostStory
  | TdlibstartLiveStory
  | TdlibgetStoryNotificationSettingsExceptions
  | TdlibgetChatActiveStories
  | TdlibgetChatPostedToChatPageStories
  | TdlibgetChatArchivedStories
  | TdlibgetStoryAvailableReactions
  | TdlibgetStoryInteractions
  | TdlibgetChatStoryInteractions
  | TdlibreportStory
  | TdlibgetStoryPublicForwards
  | TdlibgetChatStoryAlbums
  | TdlibgetStoryAlbumStories
  | TdlibcreateStoryAlbum
  | TdlibsetStoryAlbumName
  | TdlibaddStoryAlbumStories
  | TdlibremoveStoryAlbumStories
  | TdlibreorderStoryAlbumStories
  | TdlibgetChatBoostLevelFeatures
  | TdlibgetChatBoostFeatures
  | TdlibgetAvailableChatBoostSlots
  | TdlibgetChatBoostStatus
  | TdlibboostChat
  | TdlibgetChatBoostLink
  | TdlibgetChatBoostLinkInfo
  | TdlibgetChatBoosts
  | TdlibgetUserChatBoosts
  | TdlibgetAttachmentMenuBot
  | TdlibgetThemedEmojiStatuses
  | TdlibgetRecentEmojiStatuses
  | TdlibgetUpgradedGiftEmojiStatuses
  | TdlibgetDefaultEmojiStatuses
  | TdlibgetThemedChatEmojiStatuses
  | TdlibgetDefaultChatEmojiStatuses
  | TdlibgetDisallowedChatEmojiStatuses
  | TdlibdownloadFile
  | TdlibgetFileDownloadedPrefixSize
  | TdlibgetSuggestedFileName
  | TdlibpreliminaryUploadFile
  | TdlibreadFilePart
  | TdlibaddFileToDownloads
  | TdlibsearchFileDownloads
  | TdlibgetMessageFileType
  | TdlibgetMessageImportConfirmationText
  | TdlibreplacePrimaryChatInviteLink
  | TdlibcreateChatInviteLink
  | TdlibcreateChatSubscriptionInviteLink
  | TdlibeditChatInviteLink
  | TdlibeditChatSubscriptionInviteLink
  | TdlibgetChatInviteLink
  | TdlibgetChatInviteLinkCounts
  | TdlibgetChatInviteLinks
  | TdlibgetChatInviteLinkMembers
  | TdlibrevokeChatInviteLink
  | TdlibcheckChatInviteLink
  | TdlibjoinChatByInviteLink
  | TdlibgetChatJoinRequests
  | TdlibaddOffer
  | TdlibcreateCall
  | TdlibgetVideoChatAvailableParticipants
  | TdlibcreateVideoChat
  | TdlibcreateGroupCall
  | TdlibgetVideoChatRtmpUrl
  | TdlibreplaceVideoChatRtmpUrl
  | TdlibgetLiveStoryRtmpUrl
  | TdlibreplaceLiveStoryRtmpUrl
  | TdlibgetGroupCall
  | TdlibjoinGroupCall
  | TdlibjoinVideoChat
  | TdlibjoinLiveStory
  | TdlibstartGroupCallScreenSharing
  | TdlibgetLiveStoryStreamer
  | TdlibgetLiveStoryAvailableMessageSenders
  | TdlibgetLiveStoryTopDonors
  | TdlibinviteGroupCallParticipant
  | TdlibgetVideoChatInviteLink
  | TdlibsetGroupCallParticipantIsSpeaking
  | TdlibgetGroupCallParticipants
  | TdlibgetGroupCallStreams
  | TdlibgetGroupCallStreamSegment
  | TdlibencryptGroupCallData
  | TdlibdecryptGroupCallData
  | TdlibgetBlockedMessageSenders
  | TdlibimportContacts
  | TdlibgetContacts
  | TdlibsearchContacts
  | TdlibgetImportedContactCount
  | TdlibchangeImportedContacts
  | TdlibgetCloseFriends
  | TdlibsearchUserByPhoneNumber
  | TdlibgetUserProfilePhotos
  | TdlibgetUserProfileAudios
  | TdlibgetStickerOutline
  | TdlibgetStickerOutlineSvgPath
  | TdlibgetStickers
  | TdlibgetAllStickerEmojis
  | TdlibsearchStickers
  | TdlibgetGreetingStickers
  | TdlibgetPremiumStickers
  | TdlibgetInstalledStickerSets
  | TdlibgetArchivedStickerSets
  | TdlibgetTrendingStickerSets
  | TdlibgetAttachedStickerSets
  | TdlibgetStickerSet
  | TdlibgetStickerSetName
  | TdlibsearchStickerSet
  | TdlibsearchInstalledStickerSets
  | TdlibsearchStickerSets
  | TdlibgetRecentStickers
  | TdlibaddRecentSticker
  | TdlibgetFavoriteStickers
  | TdlibgetStickerEmojis
  | TdlibsearchEmojis
  | TdlibgetKeywordEmojis
  | TdlibgetEmojiCategories
  | TdlibgetAnimatedEmoji
  | TdlibgetEmojiSuggestionsUrl
  | TdlibgetCustomEmojiStickers
  | TdlibgetDefaultChatPhotoCustomEmojiStickers
  | TdlibgetDefaultProfilePhotoCustomEmojiStickers
  | TdlibgetDefaultBackgroundCustomEmojiStickers
  | TdlibgetSavedAnimations
  | TdlibgetRecentInlineBots
  | TdlibgetOwnedBots
  | TdlibsearchHashtags
  | TdlibgetLinkPreview
  | TdlibgetWebPageInstantView
  | TdlibsendPhoneNumberCode
  | TdlibresendPhoneNumberCode
  | TdlibgetBusinessConnectedBot
  | TdlibgetBusinessChatLinks
  | TdlibcreateBusinessChatLink
  | TdlibeditBusinessChatLink
  | TdlibgetBusinessChatLinkInfo
  | TdlibgetUserLink
  | TdlibsearchUserByToken
  | TdlibgetCommands
  | TdlibgetMenuButton
  | TdlibsendWebAppCustomRequest
  | TdlibgetBotMediaPreviews
  | TdlibgetBotMediaPreviewInfo
  | TdlibaddBotMediaPreview
  | TdlibeditBotMediaPreview
  | TdlibgetBotName
  | TdlibgetBotInfoDescription
  | TdlibgetBotInfoShortDescription
  | TdlibgetActiveSessions
  | TdlibgetConnectedWebsites
  | TdlibgetSupergroupMembers
  | TdlibgetChatEventLog
  | TdlibgetTimeZones
  | TdlibgetPaymentForm
  | TdlibvalidateOrderInfo
  | TdlibsendPaymentForm
  | TdlibgetPaymentReceipt
  | TdlibgetSavedOrderInfo
  | TdlibgetAvailableGifts
  | TdlibcanSendGift
  | TdlibgetGiftAuctionState
  | TdlibgetGiftAuctionAcquiredGifts
  | TdlibgetGiftUpgradePreview
  | TdlibgetGiftUpgradeVariants
  | TdlibupgradeGift
  | TdlibsendResoldGift
  | TdlibgetReceivedGifts
  | TdlibgetReceivedGift
  | TdlibgetUpgradedGift
  | TdlibgetUpgradedGiftValueInfo
  | TdlibgetUpgradedGiftWithdrawalUrl
  | TdlibgetUpgradedGiftsPromotionalAnimation
  | TdlibsearchGiftsForResale
  | TdlibgetGiftCollections
  | TdlibcreateGiftCollection
  | TdlibsetGiftCollectionName
  | TdlibaddGiftCollectionGifts
  | TdlibremoveGiftCollectionGifts
  | TdlibreorderGiftCollectionGifts
  | TdlibcreateInvoiceLink
  | TdlibgetSupportUser
  | TdlibgetBackgroundUrl
  | TdlibsearchBackground
  | TdlibsetDefaultBackground
  | TdlibgetInstalledBackgrounds
  | TdlibgetLocalizationTargetInfo
  | TdlibgetLanguagePackInfo
  | TdlibgetLanguagePackStrings
  | TdlibregisterDevice
  | TdlibgetPushReceiverId
  | TdlibgetRecentlyVisitedTMeUrls
  | TdlibgetUserPrivacySettingRules
  | TdlibgetReadDatePrivacySettings
  | TdlibgetNewChatPrivacySettings
  | TdlibgetPaidMessageRevenue
  | TdlibcanSendMessageToUser
  | TdlibgetOption
  | TdlibgetAccountTtl
  | TdlibgetDefaultMessageAutoDeleteTime
  | TdlibreportChat
  | TdlibgetChatRevenueStatistics
  | TdlibgetChatRevenueWithdrawalUrl
  | TdlibgetChatRevenueTransactions
  | TdlibgetTonTransactions
  | TdlibgetStarRevenueStatistics
  | TdlibgetStarWithdrawalUrl
  | TdlibgetStarAdAccountUrl
  | TdlibgetTonRevenueStatistics
  | TdlibgetTonWithdrawalUrl
  | TdlibgetChatStatistics
  | TdlibgetMessageStatistics
  | TdlibgetMessagePublicForwards
  | TdlibgetStoryStatistics
  | TdlibgetStatisticalGraph
  | TdlibgetStorageStatistics
  | TdlibgetStorageStatisticsFast
  | TdlibgetDatabaseStatistics
  | TdliboptimizeStorage
  | TdlibgetNetworkStatistics
  | TdlibgetAutoDownloadSettingsPresets
  | TdlibgetAutosaveSettings
  | TdlibgetBankCardInfo
  | TdlibgetPassportElement
  | TdlibgetAllPassportElements
  | TdlibsetPassportElement
  | TdlibgetPreferredCountryLanguage
  | TdlibsendEmailAddressVerificationCode
  | TdlibresendEmailAddressVerificationCode
  | TdlibgetPassportAuthorizationForm
  | TdlibgetPassportAuthorizationFormAvailableElements
  | TdlibuploadStickerFile
  | TdlibgetSuggestedStickerSetName
  | TdlibcheckStickerSetName
  | TdlibcreateNewStickerSet
  | TdlibgetOwnedStickerSets
  | TdlibgetMapThumbnailFile
  | TdlibgetPremiumLimit
  | TdlibgetPremiumFeatures
  | TdlibgetPremiumStickerExamples
  | TdlibgetPremiumInfoSticker
  | TdlibgetPremiumState
  | TdlibgetPremiumGiftPaymentOptions
  | TdlibgetPremiumGiveawayPaymentOptions
  | TdlibcheckPremiumGiftCode
  | TdlibgetGiveawayInfo
  | TdlibgetStarPaymentOptions
  | TdlibgetStarGiftPaymentOptions
  | TdlibgetStarGiveawayPaymentOptions
  | TdlibgetStarTransactions
  | TdlibgetStarSubscriptions
  | TdlibsearchChatAffiliateProgram
  | TdlibsearchAffiliatePrograms
  | TdlibconnectAffiliateProgram
  | TdlibdisconnectAffiliateProgram
  | TdlibgetConnectedAffiliateProgram
  | TdlibgetConnectedAffiliatePrograms
  | TdlibgetBusinessFeatures
  | TdlibsearchStringsByPrefix
  | TdlibsendCustomRequest
  | TdlibgetCountries
  | TdlibgetCountryCode
  | TdlibgetPhoneNumberInfo
  | TdlibgetPhoneNumberInfoSync
  | TdlibgetCollectibleItemInfo
  | TdlibgetDeepLinkInfo
  | TdlibgetApplicationConfig
  | TdlibgetApplicationDownloadLink
  | TdlibaddProxy
  | TdlibeditProxy
  | TdlibgetProxies
  | TdlibgetProxyLink
  | TdlibpingProxy
  | TdlibgetLogStream
  | TdlibgetLogVerbosityLevel
  | TdlibgetLogTags
  | TdlibgetLogTagVerbosityLevel
  | TdlibgetUserSupportInfo
  | TdlibsetUserSupportInfo
  | TdlibgetSupportName
  | TdlibtestCallString
  | TdlibtestCallBytes
  | TdlibtestCallVectorInt
  | TdlibtestCallVectorIntObject
  | TdlibtestCallVectorString
  | TdlibtestCallVectorStringObject
  | TdlibtestSquareInt
  | TdlibtestUseUpdate
  | TdlibError
  | TdlibOk
;

export type TdlibUpdate =
  | TdlibupdateAuthorizationState
  | TdlibupdateNewMessage
  | TdlibupdateMessageSendAcknowledged
  | TdlibupdateMessageSendSucceeded
  | TdlibupdateMessageSendFailed
  | TdlibupdateMessageContent
  | TdlibupdateMessageEdited
  | TdlibupdateMessageIsPinned
  | TdlibupdateMessageInteractionInfo
  | TdlibupdateMessageContentOpened
  | TdlibupdateMessageMentionRead
  | TdlibupdateMessageUnreadReactions
  | TdlibupdateMessageFactCheck
  | TdlibupdateMessageSuggestedPostInfo
  | TdlibupdateMessageLiveLocationViewed
  | TdlibupdateVideoPublished
  | TdlibupdateNewChat
  | TdlibupdateChatTitle
  | TdlibupdateChatPhoto
  | TdlibupdateChatAccentColors
  | TdlibupdateChatPermissions
  | TdlibupdateChatLastMessage
  | TdlibupdateChatPosition
  | TdlibupdateChatAddedToList
  | TdlibupdateChatRemovedFromList
  | TdlibupdateChatReadInbox
  | TdlibupdateChatReadOutbox
  | TdlibupdateChatActionBar
  | TdlibupdateChatBusinessBotManageBar
  | TdlibupdateChatAvailableReactions
  | TdlibupdateChatDraftMessage
  | TdlibupdateChatEmojiStatus
  | TdlibupdateChatMessageSender
  | TdlibupdateChatMessageAutoDeleteTime
  | TdlibupdateChatNotificationSettings
  | TdlibupdateChatPendingJoinRequests
  | TdlibupdateChatReplyMarkup
  | TdlibupdateChatBackground
  | TdlibupdateChatTheme
  | TdlibupdateChatUnreadMentionCount
  | TdlibupdateChatUnreadReactionCount
  | TdlibupdateChatVideoChat
  | TdlibupdateChatDefaultDisableNotification
  | TdlibupdateChatHasProtectedContent
  | TdlibupdateChatIsTranslatable
  | TdlibupdateChatIsMarkedAsUnread
  | TdlibupdateChatViewAsTopics
  | TdlibupdateChatBlockList
  | TdlibupdateChatHasScheduledMessages
  | TdlibupdateChatFolders
  | TdlibupdateChatOnlineMemberCount
  | TdlibupdateSavedMessagesTopic
  | TdlibupdateSavedMessagesTopicCount
  | TdlibupdateDirectMessagesChatTopic
  | TdlibupdateTopicMessageCount
  | TdlibupdateQuickReplyShortcut
  | TdlibupdateQuickReplyShortcutDeleted
  | TdlibupdateQuickReplyShortcuts
  | TdlibupdateQuickReplyShortcutMessages
  | TdlibupdateForumTopicInfo
  | TdlibupdateForumTopic
  | TdlibupdateScopeNotificationSettings
  | TdlibupdateReactionNotificationSettings
  | TdlibupdateNotification
  | TdlibupdateNotificationGroup
  | TdlibupdateActiveNotifications
  | TdlibupdateHavePendingNotifications
  | TdlibupdateDeleteMessages
  | TdlibupdateChatAction
  | TdlibupdatePendingTextMessage
  | TdlibupdateUserStatus
  | TdlibupdateUser
  | TdlibupdateBasicGroup
  | TdlibupdateSupergroup
  | TdlibupdateSecretChat
  | TdlibupdateUserFullInfo
  | TdlibupdateBasicGroupFullInfo
  | TdlibupdateSupergroupFullInfo
  | TdlibupdateServiceNotification
  | TdlibupdateFile
  | TdlibupdateFileGenerationStart
  | TdlibupdateFileGenerationStop
  | TdlibupdateFileDownloads
  | TdlibupdateFileAddedToDownloads
  | TdlibupdateFileDownload
  | TdlibupdateFileRemovedFromDownloads
  | TdlibupdateApplicationVerificationRequired
  | TdlibupdateApplicationRecaptchaVerificationRequired
  | TdlibupdateCall
  | TdlibupdateGroupCall
  | TdlibupdateGroupCallParticipant
  | TdlibupdateGroupCallParticipants
  | TdlibupdateGroupCallVerificationState
  | TdlibupdateNewGroupCallMessage
  | TdlibupdateNewGroupCallPaidReaction
  | TdlibupdateGroupCallMessageSendFailed
  | TdlibupdateGroupCallMessagesDeleted
  | TdlibupdateLiveStoryTopDonors
  | TdlibupdateNewCallSignalingData
  | TdlibupdateGiftAuctionState
  | TdlibupdateActiveGiftAuctions
  | TdlibupdateUserPrivacySettingRules
  | TdlibupdateUnreadMessageCount
  | TdlibupdateUnreadChatCount
  | TdlibupdateStory
  | TdlibupdateStoryDeleted
  | TdlibupdateStoryPostSucceeded
  | TdlibupdateStoryPostFailed
  | TdlibupdateChatActiveStories
  | TdlibupdateStoryListChatCount
  | TdlibupdateStoryStealthMode
  | TdlibupdateTrustedMiniAppBots
  | TdlibupdateOption
  | TdlibupdateStickerSet
  | TdlibupdateInstalledStickerSets
  | TdlibupdateTrendingStickerSets
  | TdlibupdateRecentStickers
  | TdlibupdateFavoriteStickers
  | TdlibupdateSavedAnimations
  | TdlibupdateSavedNotificationSounds
  | TdlibupdateDefaultBackground
  | TdlibupdateEmojiChatThemes
  | TdlibupdateAccentColors
  | TdlibupdateProfileAccentColors
  | TdlibupdateLanguagePackStrings
  | TdlibupdateConnectionState
  | TdlibupdateFreezeState
  | TdlibupdateAgeVerificationParameters
  | TdlibupdateTermsOfService
  | TdlibupdateUnconfirmedSession
  | TdlibupdateAttachmentMenuBots
  | TdlibupdateWebAppMessageSent
  | TdlibupdateActiveEmojiReactions
  | TdlibupdateAvailableMessageEffects
  | TdlibupdateDefaultReactionType
  | TdlibupdateDefaultPaidReactionType
  | TdlibupdateSavedMessagesTags
  | TdlibupdateActiveLiveLocationMessages
  | TdlibupdateOwnedStarCount
  | TdlibupdateOwnedTonCount
  | TdlibupdateChatRevenueAmount
  | TdlibupdateStarRevenueStatus
  | TdlibupdateTonRevenueStatus
  | TdlibupdateSpeechRecognitionTrial
  | TdlibupdateGroupCallMessageLevels
  | TdlibupdateDiceEmojis
  | TdlibupdateStakeDiceState
  | TdlibupdateAnimatedEmojiMessageClicked
  | TdlibupdateAnimationSearchParameters
  | TdlibupdateSuggestedActions
  | TdlibupdateSpeedLimitNotification
  | TdlibupdateContactCloseBirthdays
  | TdlibupdateAutosaveSettings
  | TdlibupdateBusinessConnection
  | TdlibupdateNewBusinessMessage
  | TdlibupdateBusinessMessageEdited
  | TdlibupdateBusinessMessagesDeleted
  | TdlibupdateNewInlineQuery
  | TdlibupdateNewChosenInlineResult
  | TdlibupdateNewCallbackQuery
  | TdlibupdateNewInlineCallbackQuery
  | TdlibupdateNewBusinessCallbackQuery
  | TdlibupdateNewShippingQuery
  | TdlibupdateNewPreCheckoutQuery
  | TdlibupdateNewCustomEvent
  | TdlibupdateNewCustomQuery
  | TdlibupdatePoll
  | TdlibupdatePollAnswer
  | TdlibupdateChatMember
  | TdlibupdateNewChatJoinRequest
  | TdlibupdateChatBoost
  | TdlibupdateMessageReaction
  | TdlibupdateMessageReactions
  | TdlibupdatePaidMediaPurchased
  | Tdlibupdates
;
