//   
//   BDLWebView.h
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
#import <WebKit/WebKit.h>

#import "BDLWebMessageModel.h"

NS_ASSUME_NONNULL_BEGIN

@class BDLWebView;

/**
 * @locale zh
 * @protocol BDLWebViewDelegate
 * @brief WebView 事件代理协议
 * @note 所有回调方法均在主线程执行
 */
/**
 * @locale en
 * @protocol BDLWebViewDelegate
 * @brief WebView event delegate protocol
 * @note All callback methods are executed on the main thread
 */
@protocol BDLWebViewDelegate <NSObject>

@optional
/**
 * @locale zh
 * @brief 网页导航完成回调
 * @param webView self
 * @param navigation 导航对象
 */
/**
 * @locale en
 * @brief Called when web navigation completes
 * @param webView self
 * @param navigation Navigation object
 */
- (void)webView:(BDLWebView *)webView didFinishNavigation:(null_unspecified WKNavigation *)navigation;
/**
 * @locale zh
 * @brief 网页导航失败回调
 * @param webView self
 * @param navigation 导航对象
 * @param error 错误信息
 */
/**
 * @locale en
 * @brief Called when web navigation fails
 * @param webView self
 * @param navigation Navigation object
 * @param error Error information
 */
- (void)webView:(BDLWebView *)webView didFailNavigation:(null_unspecified WKNavigation *)navigation withError:(nonnull NSError *)error;
/**
 * @locale zh
 * @brief 网页初始化完成回调
 * @param webView self
 * @param model 初始化完成消息模型
 */
/**
 * @locale en
 * @brief Called when webview initialization completes
 * @param webView self
 * @param model Initialization completion message model
 */
- (void)webView:(BDLWebView *)webView didInitFinished:(BDLWebMessageModel *)model;

/**
 * @locale zh
 * @brief 播放器创建成功通知
 * @param webView self
 * @param model 基础消息模型
 * @param createPlayerModel 播放器创建数据模型
 */
/**
 * @locale en
 * @brief Notifies successful player creation
 * @param webView self
 * @param model Base message model
 * @param createPlayerModel Player creation data model
 */
- (void)webView:(BDLWebView *)webView didCreatePlayer:(BDLWebMessageModel *)model createPlayerModel:(BDLWebMsgCreatePlayerModel *)createPlayerModel;
/**
 * @locale zh
 * @brief 播放器销毁通知
 * @param webView self
 * @param model 基础消息模型
 */
/**
 * @locale en
 * @brief Notifies player destruction
 * @param webView self
 * @param model Base message model
 */
- (void)webView:(BDLWebView *)webView didDestroyPlayer:(BDLWebMessageModel *)model;
/**
 * @locale zh
 * @brief 进入全屏模式回调
 * @param webView self
 * @param model 全屏事件消息模型
 */
/**
 * @locale en
 * @brief Called when entering fullscreen mode
 * @param webView self
 * @param model Fullscreen event message model
 */
- (void)webView:(BDLWebView *)webView didEnterFullScreen:(BDLWebMessageModel *)model;
/**
 * @locale zh
 * @brief 退出全屏模式回调
 * @param webView self
 * @param model 全屏事件消息模型
 */
/**
 * @locale en
 * @brief Called when exiting fullscreen mode
 * @param webView self
 * @param model Fullscreen event message model
 */
- (void)webView:(BDLWebView *)webView didExitFullScreen:(BDLWebMessageModel *)model;
/**
 * @locale zh
 * @brief 直播状态变更通知
 * @param webView self
 * @param model 基础消息模型
 * @param stateModel 直播状态变更数据模型
 */
/**
 * @locale en
 * @brief Notifies live status changes
 * @param webView self
 * @param model Base message model
 * @param stateModel Live status change data model
 */
- (void)webView:(BDLWebView *)webView stateChanged:(BDLWebMessageModel *)model stateModel:(BDLWebMsgStateChangeModel *)stateModel;
/**
 * @locale zh
 * @brief 播放器状态变更通知
 * @param webView self
 * @param model 基础消息模型
 * @param playerStateModel 播放器状态变更数据模型
 */
/**
 * @locale en
 * @brief Notifies player state changes
 * @param webView self
 * @param model Base message model
 * @param playerStateModel Player state change data model
 */
- (void)webView:(BDLWebView *)webView playerStateChanged:(BDLWebMessageModel *)model playerStateModel:(BDLWebMsgPlayerStateChangeModel *)playerStateModel;
/**
 * @locale zh
 * @brief 媒体资源加载完成通知
 * @param webView self
 * @param model 基础消息模型
 * @param mediaModel 媒体加载数据模型
 */
/**
 * @locale en
 * @brief Notifies media resource loading completion
 * @param webView self
 * @param model Base message model
 * @param mediaModel Media loading data model
 */
- (void)webView:(BDLWebView *)webView mediaLoadFinished:(BDLWebMessageModel *)model mediaModel:(BDLWebMsgMediaLoadFinishedModel *)mediaModel;
/**
 * @locale zh
 * @brief 关闭小窗通知
 * @param webView self
 * @param model 基础消息模型
 */
/**
 * @locale en
 * @brief Notifies closing small window
 * @param webView self
 * @param model Base message model
 */
- (void)webView:(BDLWebView *)webView closeMiniWindow:(BDLWebMessageModel *)model;
/**
 * @locale zh
 * @brief H5 页面要求退出直播并开启悬浮窗
 * @param webView self
 * @param model 基础消息模型
 */
/**
 * @locale en
 * @brief H5 page requires exiting live and opening floating window
 * @param webView self
 * @param model Base message model
 */
- (void)webView:(BDLWebView *)webView exitLiveAndEnableFloat:(BDLWebMessageModel *)model;
/**
 * @locale zh
 * @brief H5 页面要求退出直播且关闭悬浮窗
 * @param webView self
 * @param model 基础消息模型
 */
/**
 * @locale en
 * @brief H5 page requires exiting live and closing floating window
 * @param webView self
 * @param model Base message model
 */
- (void)webView:(BDLWebView *)webView exitLiveAndDisableFloat:(BDLWebMessageModel *)model;
/**
 * @locale zh
 * @brief H5 用户点击商品卡片或其他跳转链接时回调
 * @param webView self
 * @param urlRequest 跳转链接
 */
/**
 * @locale en
 * @brief Called when user clicks on product card or other jump links
 * @param webView self
 * @param urlRequest Jump link
 */
- (void)webView:(BDLWebView *)webView onURLRequestClicked:(NSURLRequest *)urlRequest;

@end

/**
 * @locale zh
 * @class BDLWebView
 * @brief 基于 WKWebView 封装的直播 Web 容器
 * @note 支持与 H5 页面进行双向通信，处理播放器控制、全屏切换等核心功能
 */
/**
 * @locale en
 * @class BDLWebView
 * @brief Live streaming web container based on WKWebView
 * @note Supports bidirectional communication with H5 pages, handles core features like player control and fullscreen switching
 */
@interface BDLWebView : UIView

/**
 * @locale zh
 * @brief WKWebView 实例
 */
/**
 * @locale en 
 * @brief WKWebView instance
 */
@property (nonatomic, strong) WKWebView *webView;

/**
 * @locale zh
 * @brief 代理对象，接收 WebView 事件回调
 */
/**
 * @locale en
 * @brief Delegate object for receiving webview events
 */
@property (nonatomic, weak) id<BDLWebViewDelegate> delegate;

/**
 * @locale zh
 * @brief 当前活动状态，详见BDLActivityStatus
 */
/**
 * @locale en
 * @brief Current activity status see BDLActivityStatus
 */
@property (nonatomic, assign) BDLActivityStatus status;
/**
 * @locale zh
 * @brief 是否竖屏展示模式
 * @note 该属性仅影响UI布局，不触发设备方向变化
 */
/**
 * @locale en
 * @brief Whether in portrait display mode
 * @note This property only affects UI layout, does not change device orientation
 */
@property (nonatomic, assign) BOOL isPortraitMode;

/**
 * @locale zh
 * @brief 视频是否为竖版
 */
/**
 * @locale en 
 * @brief Whether video is vertical
 */
@property (nonatomic, assign) BOOL isPortraitVideo;
/**
 * @locale zh
 * @brief 视频渲染尺寸（单位：像素）
 */
/**
 * @locale en
 * @brief Video rendering size (in pixels)
 */
@property (nonatomic, assign) CGSize videoSize;

/**
 * @locale zh
 * @brief 播放器是否已创建
 * @note 该状态通过H5事件驱动更新
 */
/**
 * @locale en
 * @brief Whether player has been created
 * @note This status is updated via H5 events
 */
@property (nonatomic, assign) BOOL isPlayerCreated;

/**
 * @locale zh
 * @brief 播放器是否处于暂停状态
 */
/**
 * @locale en
 * @brief Whether player is paused
 */
@property (nonatomic, assign) BOOL isPaused;

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
/**
 * @locale zh
 * @brief 进入小窗模式
 * @note 通知 H5 页面进入小窗界面
 */
/**
 * @locale en
 * @brief Enter mini-window mode
 * @note Notifies H5 page to enter mini-window mode
 */
- (void)enterMiniWindow;
/**
 * @locale zh
 * @brief 退出小窗模式
 * @note 通知 H5 页面退出小窗界面
 */
/**
 * @locale en
 * @brief Exit mini-window mode
 * @note Notifies H5 page to exit mini-window mode
 */
- (void)exitMiniWindow;
/**
 * @locale zh
 * @brief 暂停播放
 * @note 通知 H5 暂停播放
 */
/**
 * @locale en
 * @brief Pause playback
 * @note Notifies H5 to pause playback
 */
- (void)pause;
/**
 * @locale zh
 * @brief 开始播放
 * @note 通知 H5 开始播放
 */
/**
 * @locale en
 * @brief Start playback
 * @note Notifies H5 to start playback
 */
- (void)play;
/**
 * @locale zh
 * @brief 进入全屏模式
 * @note 通知 H5 页面进入全屏界面，但不会进行设备方向的切换
 */
/**
 * @locale en
 * @brief Enter fullscreen mode
 * @note Notifies H5 page to enter fullscreen mode interface, but does not switch device orientation
 */
- (void)enterFullScreen;

/**
 * @locale zh
 * @brief 退出全屏模式
 * @note 通知 H5 页面退出全屏界面，但不会进行设备方向的切换
 */
/**
 * @locale en
 * @brief Exit fullscreen mode
 * @note Notifies H5 page to exit fullscreen mode interface, but does not switch device orientation
 */
- (void)exitFullScreen;

@end

NS_ASSUME_NONNULL_END
