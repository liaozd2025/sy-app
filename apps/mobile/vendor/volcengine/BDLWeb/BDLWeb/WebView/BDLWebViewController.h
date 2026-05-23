//   
//   BDLWebViewController.h
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


#import <UIKit/UIKit.h>

#import "BDLWebView.h"
#import "BDLFloatingPlayer.h"

NS_ASSUME_NONNULL_BEGIN

@class BDLWebViewController;

/**
 * @locale zh
 * @protocol BDLWebViewControllerDelegate
 * @brief Web视图控制器事件代理协议
 */
/**
 * @locale en
 * @protocol BDLWebViewControllerDelegate
 * @brief Web view controller event delegate protocol
 */
@protocol BDLWebViewControllerDelegate <NSObject>

/**
 * @locale zh
 * @brief 悬浮播放器关闭按钮点击事件
 * @param controller self
 * @param floatingPlayer 触发事件的悬浮播放器实例
 */
/**
 * @locale en
 * @brief Floating player close button click event
 * @param controller self
 * @param floatingPlayer Floating player instance triggering the event
 */
- (void)webViewController:(BDLWebViewController *)controller floatingPlayerDidClickClose:(BDLFloatingPlayer *)floatingPlayer;
/**
 * @locale zh
 * @brief 悬浮播放器单击事件
 * @param controller self
 * @param floatingPlayer 触发事件的悬浮播放器实例
 */
/**
 * @locale en
 * @brief Floating player single tap event
 * @param controller self
 * @param floatingPlayer Floating player instance triggering the event
 */
- (void)webViewController:(BDLWebViewController *)controller floatingPlayerDidSingleTap:(BDLFloatingPlayer *)floatingPlayer;
/**
 * @locale zh
 * @brief H5 用户点击商品卡片或其他跳转链接时回调
 * @param controller self
 * @param urlRequest 跳转链接
 */
/**
 * @locale en
 * @brief Called when user clicks on product card or other jump links
 * @param controller self
 * @param urlRequest Jump link
 */
- (void)webViewController:(BDLWebViewController *)controller onURLRequestClicked:(NSURLRequest *)urlRequest;
/**
 * @locale zh
 * @brief 即将退出直播间
 * @param controller self
 */
/**
 * @locale en
 * @brief About to leave the live room
 * @param controller self
 */
- (void)webViewControllerWillLeaveLiveRoom:(BDLWebViewController *)controller;

@end

/**
 * @locale zh
 * @class BDLWebViewController
 * @brief 直播 Web 视图控制器
 * @discussion 管理 WebView 生命周期，处理悬浮播放器交互
 */
/**
 * @locale en
 * @class BDLWebViewController
 * @brief Live streaming web view controller
 * @discussion Manages webview lifecycle and handles floating player interactions
 */
@interface BDLWebViewController : UIViewController

/**
 * @locale zh
 * @brief 事件代理对象
 */
/**
 * @locale en
 * @brief Event delegate object
 */
@property (nonatomic, weak) id<BDLWebViewControllerDelegate> delegate;
/**
 * @locale zh
 * @brief 浮窗播放器的方向。
 */
/**
 * @locale en
 * @brief The orientation of the floating player.
 */
@property (nonatomic, assign) UIInterfaceOrientation floatingPlayerOrientation;

/**
 * @locale zh
 * @brief 加载直播间的 URL
 * @param urlStr 需要加载的 URL 字符串
 * @return 对应的 navigation 对象，如果 URL 无效则返回 nil
 */
/**
 * @locale en
 * @brief Load the live room URL
 * @param urlStr URL string to load
 * @return Corresponding navigation object, returns nil if URL is invalid
 */
- (nullable WKNavigation *)loadURLStr:(NSString *)urlStr;

@end

NS_ASSUME_NONNULL_END
