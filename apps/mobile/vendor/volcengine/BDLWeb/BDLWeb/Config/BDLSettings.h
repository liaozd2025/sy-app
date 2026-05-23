//   
//   BDLSettings.h
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

/**
 * @locale zh
 * @type keytype
 * @brief 画中画模式
 */
/**
 * @locale en
 * @type keytype
 * @brief Picture in Picture mode
 */
typedef NS_ENUM(NSUInteger, BDLSettingPiPType) {
    /**
     * @locale zh
     * @type keytype
     * @brief 不开启画中画
     */
    /**
     * @locale en
     * @type keytype
     * @brief Do not enable Picture in Picture
     */
    BDLSettingPiPTypeNone,
    /**
     * @locale zh
     * @type keytype
     * @brief 仅开启app内画中画
     */
    /**
     * @locale en
     * @type keytype
     * @brief Only enable Picture in Picture in the app
     */
    BDLSettingPiPTypeInAppPiP,
    /**
     * @locale zh
     * @type keytype
     * @brief 开启app内和系统画中画
     */
    /**
     * @locale en
     * @type keytype
     * @brief Enable Picture in Picture in the app and the system
     */
    BDLSettingPiPTypeInAppAndSystemPiP,
};

/**
 * @locale zh
 * @type keytype
 * @brief 全屏按钮操作
 */
/**
 * @locale en
 * @type keytype
 * @brief Full screen button operation
 */
typedef NS_ENUM(NSUInteger, BDLSettingsFullscreenBtnType) {
    /**
     * @locale zh
     * @type keytype
     * @brief 切为全屏模式，但不旋转屏幕
     */
    /**
     * @locale en
     * @type keytype
     * @brief Switch to full screen mode, but do not rotate the screen
     */
    BDLSettingsFullscreenBtnTypeDoNotRotate,
    /**
     * @locale zh
     * @type keytype
     * @brief 根据视频宽高自动旋转屏幕
     */
    /**
     * @locale en
     * @type keytype
     * @brief Automatically rotate the screen according to the width and height of the video
     */
    BDLSettingsFullscreenBtnTypeRotate,
    /**
     * @locale zh
     * @type keytype
     * @brief 强制旋转屏幕
     */
    /**
     * @locale en
     * @type keytype
     * @brief Force rotate the screen
     */
    BDLSettingsFullscreenBtnTypeForceRotate,
};

@interface BDLSettings : NSObject

/**
 * @locale zh
 * @type keytype
 * @brief 画中画模式
 */
/**
 * @locale en
 * @type keytype
 * @brief Picture in Picture mode
 */
@property (nonatomic, assign) BDLSettingPiPType pipType;
/**
 * @locale zh
 * @type keytype
 * @brief 是否开启app内画中画
 */
/**
 * @locale en
 * @type keytype
 * @brief Whether to enable Picture in Picture in the app
 */
@property (nonatomic, assign) BOOL enableInAppPiP;
/**
 * @locale zh
 * @type keytype
 * @brief 是否开启系统画中画
 */
/**
 * @locale en
 * @type keytype
 * @brief Whether to enable Picture in Picture in the system
 */
@property (nonatomic, assign) BOOL enableSystemPiP;
/**
 * @locale zh
 * @type keytype
 * @brief 是否开启自动播放
 */
/**
 * @locale en
 * @type keytype
 * @brief Whether to enable automatic playback
 */
@property (nonatomic, assign) BOOL enableAutoPlay;
/**
 * @locale zh
 * @type keytype
 * @brief 全屏按钮操作
 */
/**
 * @locale en
 * @type keytype
 * @brief Full screen button operation
 */
@property (nonatomic, assign) BDLSettingsFullscreenBtnType fullscreenBtnType;

/**
 * @locale zh
 * @type api
 * @brief 单例
 */
/**
 * @locale en
 * @type api
 * @brief Singleton
 */
+ (instancetype)sharedInstance;

@end

NS_ASSUME_NONNULL_END
