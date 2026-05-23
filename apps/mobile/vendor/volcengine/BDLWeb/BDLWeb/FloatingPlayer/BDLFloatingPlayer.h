//
//   BDLFloatingPlayer.h
//   BDLive
//   
//   Copyright 2024 Beijing Volcano Engine Technology Ltd. All Rights Reserved.
//   
//   The BDLive SDK was developed by Beijing Volcanoengine Technology Ltd. (hereinafter “Volcano Engine”). 
//   Any copyright or patent right is owned by and proprietary material of the Volcano Engine. 
//   
//   BDLive SDK is available under the VolcLive product and licensed under the commercial license. 
//   Customers can contact service@volcengine.com for commercial licensing options. 
//   Here is also a link to subscription services agreement: https://www.volcengine.com/docs/6256/68938.
//   
//   Without Volcanoengine's prior written permission, any use of BDLive SDK, in particular any use for commercial purposes, is prohibited. 
//   This includes, without limitation, incorporation in a commercial product, use in a commercial service, or production of other artefacts for commercial purposes. 
//   
//   Without Volcanoengine's prior written permission, the BDLive SDK may not be reproduced, modified and/or made available in any form to any third party. 
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class BDLFloatingPlayer;
/**
 * @locale zh
 * @type callback
 * @brief 浮窗播放器（InApp 画中画）的代理方法。
 */
/**
 * @locale en
 * @type callback
 * @brief The delegate methods for the floating player (namely the in-app PiP).
 */
@protocol BDLFloatingPlayerDelegate <NSObject>

@optional
/**
 * @locale zh
 * @brief 在即将显示播放器时，SDK 调用该方法。
 * @param floatingPlayer 浮窗播放器。详见 [BDLFloatingPlayer](1185540#BDLFloatingPlayer)。
 */
/**
 * @locale en
 * @brief The SDK calls this method when the player is about to appear.
 * @param floatingPlayer The floating player. For more information, see [BDLFloatingPlayer](docs-bdlliveengine#BDLFloatingPlayer).
 */
- (void)floatingPlayerWillAppear:(BDLFloatingPlayer *)floatingPlayer;
/**
 * @locale zh
 * @brief 在播放器消失时，SDK 调用该方法。
 * @param floatingPlayer 浮窗播放器。详见 [BDLFloatingPlayer](1185540#BDLFloatingPlayer)。
 */
/**
 * @locale en
 * @brief The SDK calls this method when the player disappears.
 * @param floatingPlayer The floating player. For more information, see [BDLFloatingPlayer](docs-bdlliveengine#BDLFloatingPlayer).
 */
- (void)floatingPlayerDidDisappear:(BDLFloatingPlayer *)floatingPlayer;
/**
 * @locale zh
 * @brief 在观众单击播放器时，SDK 调用该方法。
 * @param floatingPlayer 浮窗播放器。详见 [BDLFloatingPlayer](1185540#BDLFloatingPlayer)。
 */
/**
 * @locale en
 * @brief The SDK calls this method when viewers tap the player.
 * @param floatingPlayer The floating player. For more information, see [BDLFloatingPlayer](docs-bdlliveengine#BDLFloatingPlayer).
 */
- (void)floatingPlayerDidSingleTap:(BDLFloatingPlayer *)floatingPlayer;
/**
 * @locale zh
 * @brief 在播放器即将关闭时，SDK 调用该方法。
 * @param floatingPlayer 浮窗播放器。详见 [BDLFloatingPlayer](1185540#BDLFloatingPlayer)。
 */
/**
 * @locale en
 * @brief The SDK calls this method when the player is about to close.
 * @param floatingPlayer The floating player. For more information, see [BDLFloatingPlayer](docs-bdlliveengine#BDLFloatingPlayer).
 */
- (void)floatingPlayerWillClose:(BDLFloatingPlayer *)floatingPlayer;
/**
 * @locale zh
 * @brief 在点击关闭浮窗播放器时，SDK 调用该方法。
 * @param floatingPlayer 浮窗播放器。详见 [BDLFloatingPlayer](1185540#BDLFloatingPlayer)。
 * @return 是否执行默认点击逻辑，即关闭浮窗播放器。
 *         - `YES`：执行。
 *         - `NO`：不执行。
 */
/**
 * @locale en
 * @brief The SDK calls this method when viewers tap to close the floating player.
 * @param floatingPlayer The floating player. For more information, see [BDLFloatingPlayer](docs-bdlliveengine#BDLFloatingPlayer).
 * @return Whether to execute the default tap logic, which is to close the floating player.
 *         - `YES`: Execute.
 *         - `NO`: Do not execute.
 */
- (BOOL)floatingPlayerDidClickClose:(BDLFloatingPlayer *)floatingPlayer;

@end

/**
 * @locale zh
 * @type api
 * @brief 浮窗播放器。
 */
/**
 * @locale en
 * @brief The floating player.
 */
@interface BDLFloatingPlayer : NSObject

/**
 * @locale zh
 * @brief 代理方法。详见 [BDLFloatingPlayerDelegate](1185541#BDLFloatingPlayerDelegate)。
 */
/**
 * @locale en
 * @brief The delegate method. For more information, see [BDLFloatingPlayerDelegate](viewer-SDK-for-ios-callbacks#BDLFloatingPlayerDelegate).
 */
@property (nonatomic, weak) id<BDLFloatingPlayerDelegate> delegate;

/**
 * @locale zh
 * @brief 初始化浮窗播放器。
 * @param webView 显示 H5 页面的 WebView。
 */
/**
 * @locale en
 * @brief Initializes the floating player.
 * @param webView The WebView that displays the H5 page.
 */
- (instancetype)initWithWebView:(UIView *)webView;
/**
 * @locale zh
 * @brief 更新 WebView
 * @param webView 显示 H5 页面的 WebView。
 */
/**
 * @locale en
 * @brief Updates the WebView.
 * @param webView The WebView that displays the H5 page.
 */
- (void)updateWebView:(UIView *)webView;
/**
 * @locale zh
 * @brief 设置播放器方向。
 * @param orientation 播放器方向。
 * @list 播放器
 */
/**
 * @locale en
 * @brief Sets the player orientation.
 * @param orientation The player orientation.
 */
- (void)setUIOrientation:(UIInterfaceOrientation)orientation;
/**
 * @locale zh
 * @brief 在指定位置显示播放器。
 * @param haveCloseButton 是否需要关闭按钮。<br>
 *        - `YES`：需要。
 *        - `NO`：不需要。
 * @param frame 显示位置。
 * @list 播放器
 * @return - `YES`：显示成功。
 *         - `NO`：正在显示浮窗播放器。
 */
/**
 * @locale en
 * @brief Displays the player at the specified position.
 * @param frame The display position.
 * @param haveCloseButton Whether the close button is needed.<br>
 *        - `YES`: Needed.
 *        - `NO`: Not needed.
 * @return - `YES`: Displayed successfully.
 *         - `NO`: The floating player is being displayed.
 */
- (BOOL)showWithFrame:(CGRect)frame closeButton:(BOOL)haveCloseButton;
/**
 * @locale zh
 * @brief 隐藏播放器。
 * @list 播放器
 */
/**
 * @locale en
 * @brief Hides the player.
 */
- (void)hide;
/**
 * @locale zh
 * @brief 关闭播放器。效果同 [hide](#BDLFloatingPlayer-hide)，但比 `hide` 多了 [floatingPlayerWillClose](1185541#BDLFloatingPlayerDelegate-floatingplayerwillclose) 回调。
 * @list 播放器
 */
/**
 * @locale en
 * @brief Closes the player. This has the same effect as [hide](#BDLFloatingPlayer-hide), but additionally triggers the [floatingPlayerWillClose](viewer-SDK-for-ios-callbacks#BDLFloatingPlayerDelegate-floatingplayerwillclose) callback.
 */
- (void)close;
/**
 * @locale zh
 * @brief 播放器是否处于悬浮状态。
 * @list 播放器
 * @return - `YES`：播放器处于悬浮状态。
 *         - `NO`：播放器不处于悬浮状态。
 */
/**
 * @locale en
 * @brief Whether the player is in the floating mode.
 * @return - `YES`: In the floating mode.
 *         - `NO`: Not in the floating mode.
 */
- (BOOL)isFloating;

@end

NS_ASSUME_NONNULL_END
