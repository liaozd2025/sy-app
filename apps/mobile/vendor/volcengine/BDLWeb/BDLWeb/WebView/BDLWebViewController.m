//   
//   BDLWebViewController.m
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


#import "BDLWebViewController.h"
#import "BDLPiPHelper.h"
#import "UIDevice+BDL.h"
#import "BDLSettings.h"
#import "BDLUtils.h"

#import <Masonry/Masonry.h>

@interface BDLWebViewController () <
BDLWebViewDelegate
, BDLPiPHelperDelegate
, BDLFloatingPlayerDelegate
>

@property (nonatomic, strong) BDLWebView *webView;
@property (nonatomic, strong) BDLPiPHelper *pipHelper;
@property (nonatomic, strong) BDLFloatingPlayer *floatingPlayer;

@property (nonatomic, assign) BOOL isPortrait;
@property (nonatomic, assign) BOOL isPopedByWeb;
@property (nonatomic, assign) BOOL isNeedFloatWhenPoped;

@end

@implementation BDLWebViewController

- (instancetype)init {
    self = [super init];
    if (self) {
        self.webView = [[BDLWebView alloc] init];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onApplicationDidEnterBackground) name:UIApplicationDidEnterBackgroundNotification object:nil];
    }
    return self;
}

- (void)dealloc {
    [[UIApplication sharedApplication] setIdleTimerDisabled:NO];
    [self stopInAppFloating];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.webView.delegate = self;
    [self addWebView];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    if (self.floatingPlayer.isFloating) {
        [self stopInAppFloating];
    }
}

- (void)viewDidDisappear:(BOOL)animated {
    if (BDLSettings.sharedInstance.enableInAppPiP
        && self.webView.videoSize.width > 0
        && self.webView.videoSize.height > 0
        && ((self.isPopedByWeb && self.isNeedFloatWhenPoped)
            || !self.isPopedByWeb)) {
        [self startInAppFloating:!self.isPopedByWeb];
        self.isPopedByWeb = NO;
    }
    else if (![self.navigationController.viewControllers containsObject:self]) {
        [self notifyLeaveLiveRoom];
    }
    self.isPopedByWeb = NO;
}

- (void)addWebView {
    [self.view addSubview:self.webView];
    [self updateViewFullscreen:!self.isPortrait];
}

- (nullable WKNavigation *)loadURLStr:(NSString *)urlStr {
    [self stopInAppFloating];
    return [self.webView loadURLStr:urlStr];
}

- (void)startInAppFloating:(BOOL)noticeWeb {
    if (self.webView.isPaused) {
        return;
    }
    if (noticeWeb) {
        [self.webView enterMiniWindow];
    }
    self.floatingPlayer = [[BDLFloatingPlayer alloc] initWithWebView:self.webView];
    self.floatingPlayer.delegate = self;
    [self.floatingPlayer showWithFrame:[self getFloatingFrame] closeButton:YES];
}

- (void)stopInAppFloating {
    if (_floatingPlayer) {
        [self.webView exitMiniWindow];
        [self addWebView];
        [_floatingPlayer close];
        _floatingPlayer = nil;
    }
}

- (CGRect)getFloatingFrame {
    CGSize size = self.webView.videoSize;
    if (self.webView.isPortraitVideo) {
        CGFloat height = size.height;
        size.height = 180;
        size.width = size.width / height * 180;
    }
    else {
        CGFloat width = size.width;
        size.width = 180;
        size.height = size.height / width * 180;
    }
    CGSize screenSize = [BDLUtils landscapeScreenSize];
    if (self.isPortrait) {
        screenSize = [BDLUtils portraitScreenSize];
    }
    return CGRectMake(screenSize.width - size.width - 20,
                      screenSize.height - size.height - 20,
                      size.width,
                      size.height);
}

- (void)setFloatingPlayerOrientation:(UIInterfaceOrientation)floatingPlayerOrientation {
    _floatingPlayerOrientation = floatingPlayerOrientation;
    [self.floatingPlayer setUIOrientation:floatingPlayerOrientation];
}

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator {
    [coordinator animateAlongsideTransition:nil completion:^(id<UIViewControllerTransitionCoordinatorContext>  _Nonnull context) {
        [self updateWebViewFullscreen];
    }];
}

- (void)updateWebViewFullscreen {
    if (self.isPortrait) {
        [self.webView exitFullScreen];
    }
    else {
        [self.webView enterFullScreen];
    }
}

- (void)updateViewFullscreen:(BOOL)isFullScreen {
    self.navigationController.navigationBar.hidden = isFullScreen;
    if (isFullScreen) {
        [self.webView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.edges.equalTo(self.view);
        }];
    } else {
        [self.webView mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.left.right.bottom.equalTo(self.view);
            make.top.equalTo(self.view.mas_safeAreaLayoutGuideTop);
        }];
    }
}

- (void)notifyLeaveLiveRoom {
    if ([self.delegate respondsToSelector:@selector(webViewControllerWillLeaveLiveRoom:)]) {
        [self.delegate webViewControllerWillLeaveLiveRoom:self];
    }
}

- (void)updateInterfaceOrientations {
    if (@available(iOS 16.0, *)) {
        [self setNeedsUpdateOfSupportedInterfaceOrientations];
        [self.navigationController setNeedsUpdateOfSupportedInterfaceOrientations];
    }
}

- (void)updateEnablePipMode {
    self.pipHelper.enablePiPMode = !self.webView.isPaused && self.webView.isPlayerCreated;
}

- (BOOL)isPortrait {
    CGSize size = self.view.frame.size;
    return size.width < size.height;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
    if (!self.webView.isPlayerCreated) {
        return UIInterfaceOrientationMaskPortrait;
    }
    BDLSettings *settings = BDLSettings.sharedInstance;
    if (settings.fullscreenBtnType == BDLSettingsFullscreenBtnTypeForceRotate
        || (settings.fullscreenBtnType == BDLSettingsFullscreenBtnTypeRotate
            && !self.webView.isPortraitVideo)) {
        return UIInterfaceOrientationMaskAllButUpsideDown;
    }
    return UIInterfaceOrientationMaskPortrait;
}

- (void)onApplicationDidEnterBackground {
    if (!self.pipHelper.enablePiPMode) {
        [self.webView pause];
    }
}

// MARK: - BDLWebViewDelegate

- (void)webView:(nonnull BDLWebView *)webView didEnterFullScreen:(nonnull BDLWebMessageModel *)model {
    BDLSettings *settings = BDLSettings.sharedInstance;
    if (self.isPortrait
        && (settings.fullscreenBtnType == BDLSettingsFullscreenBtnTypeForceRotate
            || (settings.fullscreenBtnType == BDLSettingsFullscreenBtnTypeRotate
                && !self.webView.isPortraitVideo))) {
        [UIDevice BDL_switchNewOrientation:UIInterfaceOrientationLandscapeRight];
    }
    [self updateViewFullscreen:YES];
}

- (void)webView:(nonnull BDLWebView *)webView didExitFullScreen:(nonnull BDLWebMessageModel *)model {
    if (!self.isPortrait) {
        [UIDevice BDL_switchNewOrientation:UIInterfaceOrientationPortrait];
    }
    [self updateViewFullscreen:NO];
}

- (void)webView:(BDLWebView *)webView closeMiniWindow:(BDLWebMessageModel *)model {
    [self stopInAppFloating];
    self.pipHelper.enablePiPMode = NO;
    [self addWebView];
}

- (void)webView:(nonnull BDLWebView *)webView didFailNavigation:(null_unspecified WKNavigation *)navigation withError:(nonnull NSError *)error { 
    
}

- (void)webView:(nonnull BDLWebView *)webView didFinishNavigation:(null_unspecified WKNavigation *)navigation { 
    self.title = webView.webView.title;
}

- (void)webView:(nonnull BDLWebView *)webView didInitFinished:(nonnull BDLWebMessageModel *)model {
    
}

- (void)webView:(BDLWebView *)webView didCreatePlayer:(BDLWebMessageModel *)model createPlayerModel:(nonnull BDLWebMsgCreatePlayerModel *)createPlayerModel {
}

- (void)webView:(BDLWebView *)webView mediaLoadFinished:(BDLWebMessageModel *)model mediaModel:(BDLWebMsgMediaLoadFinishedModel *)mediaModel {
    [self updateInterfaceOrientations];
    if (!BDLSettings.sharedInstance.enableSystemPiP) {
        return;
    }
    if (self.pipHelper) {
        [self.pipHelper updateVideoSize:self.webView.videoSize];
    }
    else {
        self.pipHelper = [[BDLPiPHelper alloc] initWithWebView:self.webView
                                                 enablePiPMode:BDLSettings.sharedInstance.enableSystemPiP && !self.webView.isPaused
                                                     videoSize:self.webView.videoSize
                                                    isPortrait:self.webView.isPortraitMode];
        self.pipHelper.delegate = self;
    }
}

- (void)webView:(BDLWebView *)webView playerStateChanged:(BDLWebMessageModel *)model playerStateModel:(BDLWebMsgPlayerStateChangeModel *)playerStateModel {
    [self updateEnablePipMode];
}

- (void)webView:(BDLWebView *)webView didDestroyPlayer:(BDLWebMessageModel *)model {
}

- (void)webView:(BDLWebView *)webView exitLiveAndEnableFloat:(BDLWebMessageModel *)model {
    if (self.navigationController.visibleViewController == self) {
        [self.navigationController popViewControllerAnimated:YES];
        self.isPopedByWeb = YES;
        self.isNeedFloatWhenPoped = YES;
    }
}

- (void)webView:(BDLWebView *)webView exitLiveAndDisableFloat:(BDLWebMessageModel *)model {
    if (self.navigationController.visibleViewController == self) {
        [self.navigationController popViewControllerAnimated:YES];
        self.isPopedByWeb = YES;
        self.isNeedFloatWhenPoped = NO;
    }
}

- (void)webView:(BDLWebView *)webView onURLRequestClicked:(NSURLRequest *)urlRequest {
    if ([self.delegate respondsToSelector:@selector(webViewController:onURLRequestClicked:)]) {
        [self.delegate webViewController:self onURLRequestClicked:urlRequest];
    }
}

// MARK: - BDLPiPHelperDelegate

- (void)pipHelperWillStartPiP:(BDLPiPHelper *)pipHelper {
    [self.webView enterMiniWindow];
}

- (void)pipHelper:(BDLPiPHelper *)pipHelper failedToStartPiPWithError:(NSError *)error {
    if (self.floatingPlayer) {
        [self.floatingPlayer updateWebView:self.webView];
        return;
    }
    [self.webView exitMiniWindow];
    [self addWebView];
}

- (void)pipHelperDidStopPiP:(BDLPiPHelper *)pipHelper {
    if (self.floatingPlayer) {
        [self.floatingPlayer updateWebView:self.webView];
        return;
    }
    [self.webView exitMiniWindow];
    [self addWebView];
    [self updateEnablePipMode];
}

- (void)pipHelperRestoreUserInterfaceForPictureInPictureStop:(BDLPiPHelper *)pipHelper {
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.4 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self addWebView];
    });
}

// MARK: - BDLFloatingPlayerDelegate

- (BOOL)floatingPlayerDidClickClose:(BDLFloatingPlayer *)floatingPlayer {
    if ([self.delegate respondsToSelector:@selector(webViewController:floatingPlayerDidClickClose:)]) {
        [self.delegate webViewController:self floatingPlayerDidClickClose:floatingPlayer];
    }
    [self notifyLeaveLiveRoom];
    return YES;
}

- (void)floatingPlayerDidSingleTap:(BDLFloatingPlayer *)floatingPlayer {
    if ([self.delegate respondsToSelector:@selector(webViewController:floatingPlayerDidSingleTap:)]) {
        [self.delegate webViewController:self floatingPlayerDidSingleTap:floatingPlayer];
    }
    [self stopInAppFloating];
}

@end
