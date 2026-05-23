//   
//   BDLWebView.m
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


#import "BDLWebView.h"
#import "BDLSettings.h"

#import <Masonry/Masonry.h>
#import <YYModel/YYModel.h>

@interface BDLWebViewWeakProxy: NSProxy

@property (nonatomic, weak) id object;

@end

@implementation BDLWebViewWeakProxy

+ (instancetype)weakProxy:(id)object {
    return [[BDLWebViewWeakProxy alloc] initWithObject:object];
}

- (instancetype)initWithObject:(id)object {
    self.object = object;
    return self;
}

- (NSMethodSignature *)methodSignatureForSelector:(SEL)selector {
    return [self.object methodSignatureForSelector:selector];
}

- (void)forwardInvocation:(NSInvocation *)invocation {
    [invocation invokeWithTarget:self.object];
}

@end

@interface BDLWebView () <WKNavigationDelegate, WKScriptMessageHandler, WKUIDelegate>

@end

@implementation BDLWebView

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        _isPaused = YES;
        WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
        config.allowsInlineMediaPlayback = YES;
        if (BDLSettings.sharedInstance.enableAutoPlay) {
            config.mediaTypesRequiringUserActionForPlayback = WKAudiovisualMediaTypeNone;
        }
        else {
            config.mediaTypesRequiringUserActionForPlayback = WKAudiovisualMediaTypeAll;
        }
        
        id<WKScriptMessageHandler> weakProxy = (id<WKScriptMessageHandler>)[[BDLWebViewWeakProxy alloc] initWithObject:self];
        WKUserContentController *contentController = [[WKUserContentController alloc] init];
        [contentController addScriptMessageHandler:weakProxy name:@"invokeNative"];
        config.userContentController = contentController;
        
        if (@available(iOS 13.0, *)) {
            WKWebpagePreferences *pref = [[WKWebpagePreferences alloc] init];
            pref.preferredContentMode = WKContentModeMobile;
            config.defaultWebpagePreferences = pref;
        }
        
        self.webView = [[WKWebView alloc] initWithFrame:CGRectZero configuration:config];
        if (@available(iOS 16.4, *)) {
            self.webView.inspectable = YES;
        }
        self.webView.scrollView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
        self.webView.navigationDelegate = self;
        self.webView.UIDelegate = self;
        [self addSubview:self.webView];
        [self.webView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.edges.equalTo(self);
        }];
    }
    return self;
}

- (nullable WKNavigation *)loadURLStr:(NSString *)urlStr {
    NSURL *url = [NSURL URLWithString:urlStr];
    if (!url) {
        return nil;
    }
    NSURLRequest *request = [[NSURLRequest alloc] initWithURL:url];
    if (!request) {
        return nil;
    }
    return [self.webView loadRequest:request];
}

- (void)callWebWithEventKey:(BDLNativeToWebEvent)eventKey
                  infoModel:(id)infoModel {
    BDLWebMessageModel *model = [[BDLWebMessageModel alloc] init];
    model.eventKey = eventKey;
    if (infoModel) {
        model.info = [infoModel yy_modelToJSONObject];
    }
    NSString *jsStr = [NSString stringWithFormat:@"window.VeCloudJsBridge.nativeCallBack(%@);", [model yy_modelToJSONString]];
    [self.webView evaluateJavaScript:jsStr completionHandler:nil];
}

- (void)enterMiniWindow {
    [self callWebWithEventKey:BDLNativeToWebEventEnterMiniWindow infoModel:nil];
}

- (void)exitMiniWindow {
    [self callWebWithEventKey:BDLNativeToWebEventExitMiniWindow infoModel:nil];
}

- (void)pause {
    [self callWebWithEventKey:BDLNativeToWebEventPause infoModel:nil];
}

- (void)play {
    [self callWebWithEventKey:BDLNativeToWebEventPlay infoModel:nil];
}

- (void)configWebView {
    BDLWebMsgConfigWebView *config = [[BDLWebMsgConfigWebView alloc] init];
    [self callWebWithEventKey:BDLNativeToWebEventConfig infoModel:config];
}

- (void)getWebData {
    [self callWebWithEventKey:BDLNativeToWebEventGetWebDataInfo infoModel:nil];
}

- (void)enterFullScreen {
    [self callWebWithEventKey:BDLNativeToWebEventEnterFullscreen infoModel:nil];
}

- (void)exitFullScreen {
    [self callWebWithEventKey:BDLNativeToWebEventExitFullscreen infoModel:nil];
}

- (void)webView:(WKWebView *)webView decidePolicyForNavigationResponse:(WKNavigationResponse *)navigationResponse decisionHandler:(WK_SWIFT_UI_ACTOR void (^)(WKNavigationResponsePolicy))decisionHandler {
    decisionHandler(WKNavigationResponsePolicyAllow);
}

- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(WK_SWIFT_UI_ACTOR void (^)(WKNavigationActionPolicy))decisionHandler {
    decisionHandler(WKNavigationActionPolicyAllow);
}

- (WKWebView *)webView:(WKWebView *)webView createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration forNavigationAction:(WKNavigationAction *)navigationAction windowFeatures:(WKWindowFeatures *)windowFeatures {
    if ([self.delegate respondsToSelector:@selector(webView:onURLRequestClicked:)]) {
        [self.delegate webView:self onURLRequestClicked:navigationAction.request];
    }
    return nil;
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
    NSLog(@"%s", __func__);
    if ([self.delegate respondsToSelector:@selector(webView:didFinishNavigation:)]) {
        [self.delegate webView:self didFinishNavigation:navigation];
    }
}

- (void)webView:(WKWebView *)webView didFailNavigation:(WKNavigation *)navigation withError:(NSError *)error {
    NSLog(@"%s", __func__);
    if ([self.delegate respondsToSelector:@selector(webView:didFailNavigation:withError:)]) {
        [self.delegate webView:self didFailNavigation:navigation withError:error];
    }
}

- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation withError:(NSError *)error {
    NSLog(@"%s", __func__);
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    NSLog(@"%s web to native msg body %@", __func__, message.body);
    BDLWebMessageModel *model = [BDLWebMessageModel yy_modelWithJSON:message.body];
    NSLog(@"%s web to native msg %@", __func__, model);
    switch (model.eventKey) {
        case BDLWebMsgEventInitFinished:
            [self configWebView];
            if ([self.delegate respondsToSelector:@selector(webView:didInitFinished:)]) {
                [self.delegate webView:self didInitFinished:model];
            }
            break;
        case BDLWebMsgEventCreatePlayer: {
            BDLWebMsgCreatePlayerModel *infoModel = [BDLWebMsgCreatePlayerModel yy_modelWithJSON:model.info];
            self.isPortraitMode = infoModel.isPortrait;
            [self getWebData];
            if ([self.delegate respondsToSelector:@selector(webView:didCreatePlayer:createPlayerModel:)]) {
                [self.delegate webView:self didCreatePlayer:model createPlayerModel:infoModel];
            }
            break;
        }
        case BDLWebMsgEventDestroyPlayer:
            self.isPlayerCreated = NO;
            if ([self.delegate respondsToSelector:@selector(webView:didDestroyPlayer:)]) {
                [self.delegate webView:self didDestroyPlayer:model];
            }
            break;
        case BDLWebMsgEventEnterFullScreen:
            if ([self.delegate respondsToSelector:@selector(webView:didEnterFullScreen:)]) {
                [self.delegate webView:self didEnterFullScreen:model];
            }
            break;
        case BDLWebMsgEventExitFullScreen:
            if ([self.delegate respondsToSelector:@selector(webView:didExitFullScreen:)]) {
                [self.delegate webView:self didExitFullScreen:model];
            }
            break;
        case BDLWebMsgEventStateChange: {
            BDLWebMsgStateChangeModel *infoModel = [BDLWebMsgStateChangeModel yy_modelWithJSON:model.info];
            self.status = infoModel.status;
            [self getWebData];
            if ([self.delegate respondsToSelector:@selector(webView:stateChanged:stateModel:)]) {
                [self.delegate webView:self stateChanged:model stateModel:infoModel];
            }
            break;
        }
        case BDLWebMsgEventPlayerStateChange: {
            BDLWebMsgPlayerStateChangeModel *infoModel = [BDLWebMsgPlayerStateChangeModel yy_modelWithJSON:model.info];
            self.isPlayerCreated = infoModel.created;
            self.isPaused = infoModel.paused;
            if ([self.delegate respondsToSelector:@selector(webView:playerStateChanged:playerStateModel:)]) {
                [self.delegate webView:self playerStateChanged:model playerStateModel:infoModel];
            }
            break;
        }
        case BDLWebMsgEventMediaLoadFinished: {
            BDLWebMsgMediaLoadFinishedModel *infoModel = [BDLWebMsgMediaLoadFinishedModel yy_modelWithJSON:model.info];
            self.isPortraitVideo = infoModel.isPortrait;
            self.videoSize = infoModel.videoSize;
            if ([self.delegate respondsToSelector:@selector(webView:mediaLoadFinished:mediaModel:)]) {
                [self.delegate webView:self mediaLoadFinished:model mediaModel:infoModel];
            }
            break;
        }
        case BDLWebMsgEventCloseMiniWindow:
            if ([self.delegate respondsToSelector:@selector(webView:closeMiniWindow:)]) {
                [self.delegate webView:self closeMiniWindow:model];
            }
            break;
        case BDLWebMsgEventWebDataInfo:
            NSLog(@"debug %s", __func__);
            break;
        case BDLWebMsgEventExitLiveEnableFloat:
            if ([self.delegate respondsToSelector:@selector(webView:exitLiveAndEnableFloat:)]) {
                [self.delegate webView:self exitLiveAndEnableFloat:model];
            }
            break;
        case BDLWebMsgEventExitLiveDisableFloat:
            if ([self.delegate respondsToSelector:@selector(webView:exitLiveAndDisableFloat:)]) {
                [self.delegate webView:self exitLiveAndDisableFloat:model];
            }
            break;
        default:
            break;
    }
}

@end
