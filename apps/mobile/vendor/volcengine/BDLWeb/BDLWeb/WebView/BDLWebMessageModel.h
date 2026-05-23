//   
//   BDLWebMessageModel.h
//   BDLive
// 
//   BDLive SDK License
//   
//   Copyright 2025 Beijing Volcano Engine Technology Ltd. All Rights Reserved.
//   
//   The BDLive SDK was developed by Beijing Volcanoengine Technology Ltd. (hereinafter “Volcano Engine”). Any copyright or patent right is owned by and proprietary material of the Volcano Engine. 
//   
//   BDLive SDK is available under the VolcLive product and licensed under the commercial license.  Customers can contact service@volcengine.com for commercial licensing options.  Here is also a link to subscription services agreement: https://www.volcengine.com/docs/6256/68938.
//   
//   Without Volcanoengine's prior written permission, any use of BDLive SDK, in particular any use for commercial purposes, is prohibited. This includes, without limitation, incorporation in a commercial product, use in a commercial service, or production of other artefacts for commercial purposes. 
//   
//   Without Volcanoengine's prior written permission, the BDLive SDK may not be reproduced, modified and/or made available in any form to any third party. 
//   


#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

// web -> native
typedef NS_ENUM(NSUInteger, BDLWebMsgEvent) {
    BDLWebMsgEventInitFinished = 10001,
    BDLWebMsgEventCreatePlayer = 11000,
    BDLWebMsgEventDestroyPlayer = 11001,
    BDLWebMsgEventEnterFullScreen = 11002,
    BDLWebMsgEventExitFullScreen = 11003,
    BDLWebMsgEventStateChange = 11004,
    BDLWebMsgEventPlayerStateChange = 11005,
    BDLWebMsgEventMediaLoadFinished = 11006,
    BDLWebMsgEventCloseMiniWindow = 11008,
    BDLWebMsgEventWebDataInfo = 110011,
    BDLWebMsgEventExitLiveEnableFloat = 110012,
    BDLWebMsgEventExitLiveDisableFloat = 110013,
};

// native -> web
typedef NS_ENUM(NSUInteger, BDLNativeToWebEvent) {
    BDLNativeToWebEventEnterMiniWindow = 21000,
    BDLNativeToWebEventExitMiniWindow = 21001,
    BDLNativeToWebEventPause = 21002,
    BDLNativeToWebEventStartPlay = 21003,
    BDLNativeToWebEventPlay = 21004,
    BDLNativeToWebEventConfig = 21005,
    BDLNativeToWebEventGetWebDataInfo = 21006,
    BDLNativeToWebEventEnterFullscreen = 21007,
    BDLNativeToWebEventExitFullscreen = 21008,
};

@interface BDLWebMessageModel : NSObject

@property (nonatomic, assign) NSUInteger eventKey;
@property (nonatomic, copy) NSDictionary *info;

@end

@interface BDLWebMsgCreatePlayerModel : NSObject

@property (nonatomic, assign) BOOL isPortrait;
@property (nonatomic, assign) BOOL isLive;

@end

/**
 * @locale zh
 * @type keytype
 * @brief 直播状态。
 */
/**
 * @locale en
 * @type keytype
 * @brief The live room status.
 */
typedef NS_ENUM(NSInteger, BDLActivityStatus) {
    /**
     * @locale zh
     * @brief 未知。
     */
    /**
     * @locale en
     * @brief Unknown.
     */
    BDLActivityStatusUnknown = 0,
    /**
     * @locale zh
     * @brief 直播中。
     */
    /**
     * @locale en
     * @brief Live.
     */
    BDLActivityStatusLive = 1,
    /**
     * @locale zh
     * @brief 预告。
     */
    /**
     * @locale en
     * @brief Preview.
     */
    BDLActivityStatusPreview = 2,
    /**
     * @locale zh
     * @brief 回放。
     */
    /**
     * @locale en
     * @brief Playback.
     */
    BDLActivityStatusReplay = 3,
    /**
     * @locale zh
     * @brief 已结束。
     */
    /**
     * @locale en
     * @brief Over.
     */
    BDLActivityStatusEnd = 4,
};

@interface BDLWebMsgStateChangeModel : NSObject

@property (nonatomic, assign) BDLActivityStatus status;

@end

@interface BDLWebMsgPlayerStateChangeModel : NSObject

@property (nonatomic, assign) BOOL created;
@property (nonatomic, assign) BOOL paused;

@end

@interface BDLWebMsgMediaLoadFinishedModel : NSObject

@property (nonatomic, assign) BOOL isPortrait;
@property (nonatomic, assign) CGFloat videoWidth;
@property (nonatomic, assign) CGFloat videoHeight;
@property (nonatomic, assign) CGSize videoSize;

@end

@interface BDLWebMsgConfigWebView : NSObject

/// 默认为YES
@property (nonatomic, assign) BOOL isInBDLEnv;
/// 默认为YES
@property (nonatomic, assign) BOOL keepPlayWhenPageHide;

@end

NS_ASSUME_NONNULL_END
