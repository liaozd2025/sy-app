//   
//   BDLPiPHelper.h
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

@class BDLPiPHelper;

/**
 * @locale zh
 * @type keytype
 * @brief 画中画辅助器的代理方法。
 */
/**
 * @locale en
 * @type keytype
 * @brief The delegate methods for the BDLPiPHelper.
 */
@protocol BDLPiPHelperDelegate <NSObject>

@optional
/**
 * @locale zh
 * @brief 即将开始画中画。
 * @param pipHelper self
 */
/**
 * @locale en
 * @brief The BDLPiPHelper is about to start PiP.
 * @param pipHelper self
 */
- (void)pipHelperWillStartPiP:(BDLPiPHelper *)pipHelper;
/**
 * @locale zh
 * @brief 画中画已经开始。
 * @param pipHelper self
 */
/**
 * @locale en
 * @brief The BDLPiPHelper has started PiP.
 * @param pipHelper self
 */
- (void)pipHelperDidStartPiP:(BDLPiPHelper *)pipHelper;
/**
 * @locale zh
 * @brief 启动画中画失败。
 * @param pipHelper self
 * @param error 错误信息
 */
/**
 * @locale en
 * @brief Failed to start PiP.
 * @param pipHelper self
 * @param error Error information
 */
- (void)pipHelper:(BDLPiPHelper *)pipHelper failedToStartPiPWithError:(NSError *)error;
/**
 * @locale zh
 * @brief 即将停止画中画。
 * @param pipHelper self
 */
/**
 * @locale en
 * @brief The BDLPiPHelper is about to stop PiP.
 * @param pipHelper self
 */
- (void)pipHelperWillStopPiP:(BDLPiPHelper *)pipHelper;
/**
 * @locale zh
 * @brief 画中画已经停止。
 * @param pipHelper self
 */
/**
 * @locale en
 * @brief The BDLPiPHelper has stopped PiP.
 * @param pipHelper self
 */
- (void)pipHelperDidStopPiP:(BDLPiPHelper *)pipHelper;
/**
 * @locale zh
 * @brief 画中画停止，此时需要恢复用户界面
 * @param pipHelper 当前PiP助手实例
 */
/**
 * @locale en
 * @brief PiP stopped, and the user interface needs to be restored
 * @param pipHelper The current PiP helper instance
 */
- (void)pipHelperRestoreUserInterfaceForPictureInPictureStop:(BDLPiPHelper *)pipHelper;

@end

/**
 * @locale zh
 * @type keytype
 * @brief 画中画辅助器。
 */
/**
 * @locale en
 * @type keytype
 * @brief The BDLPiPHelper.
 */
@interface BDLPiPHelper : NSObject

/**
 * @locale zh
 * @brief 初始化方法。
 * @param webView 要画中画的webView
 * @param enable 是否开启画中画
 * @param size 视频大小
 * @param isPortrait 是否是竖屏模式的直播间
 */
/**
 * @locale en
 * @brief Initialization method.
 * @param webView The webView to be PiPed.
 * @param enable Whether to enable PiP.
 * @param size Video size.
 * @param isPortrait Whether the live room is in portrait mode.
 */
- (instancetype)initWithWebView:(UIView *)webView
                  enablePiPMode:(BOOL)enable
                      videoSize:(CGSize)size
                     isPortrait:(BOOL)isPortrait;

/**
 * @locale zh
 * @brief 代理对象。
 */
/**
 * @locale en
 * @brief The delegate object.
 */
@property (nonatomic, weak) id<BDLPiPHelperDelegate> delegate;
/**
 * @locale zh
 * @brief 是否开启画中画。
 */
/**
 * @locale en
 * @brief Whether to enable PiP.
 */
@property (nonatomic, assign) BOOL enablePiPMode;
/**
 * @locale zh
 * @brief 是否已经开始了PiP。
 */
/**
 * @locale en
 * @brief Whether PiP has started.
 */
@property (nonatomic, assign) BOOL isPiPStarted;

/**
 * @locale zh
 * @brief 更新视频大小。
 * @param size 视频大小
 */
/**
 * @locale en
 * @brief Update video size.
 * @param size Video size.
 */
- (void)updateVideoSize:(CGSize)size;

@end

NS_ASSUME_NONNULL_END
