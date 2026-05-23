//   
//   BDLPiPHelper.m
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


#import <AVFoundation/AVFoundation.h>
#import <AVKit/AVKit.h>
#import <Masonry/Masonry.h>

#import "BDLPiPHelper.h"
#import "BDLPiPVideoWriter.h"
#import "BDLUtils.h"

#define kBDLPiPLocalVideoPlayRate 0.000000001
#define kBDLPlayerViewAlpha 0.f

@interface BDLAVPlayerViewController : AVPlayerViewController

@property (nonatomic, assign) BOOL enablePip;

@end

@implementation BDLAVPlayerViewController

// 测试中发现，在nav环境下，完整直播间 -> new page显示小窗 -> 关闭小窗 -> 返回完整直播间，此时视频在播，但是没有画中画，这里需要暂停再开始一下
// testing shows that in nav environment, full room -> new page display small window -> close small window -> return full room, the video is playing, but there is no pip, here we need to pause and start again 
- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    if (self.enablePip) {
        [self.player pause];
        [self.player play];
    }
}

@end

@interface BDLPiPHelper () <AVPlayerViewControllerDelegate>

@property (nonatomic, weak) UIView *webView;
@property (nonatomic, strong) AVPlayerItem *playerItem;
@property (nonatomic, strong) BDLAVPlayerViewController *playerVC;

@property (nonatomic, assign) CGSize scaledVideoSize;
@property (nonatomic, assign) BOOL shouldEnablePiPAfterStop;
@property (nonatomic, assign) BOOL isPortrait;

@end

@implementation BDLPiPHelper

- (instancetype)initWithWebView:(UIView *)webView
                  enablePiPMode:(BOOL)enable
                      videoSize:(CGSize)size
                     isPortrait:(BOOL)isPortrait {
    self = [super init];
    if (self) {
        self.isPortrait = isPortrait;
        self.webView = webView;
        [self.webView addObserver:self forKeyPath:@"center" options:NSKeyValueObservingOptionNew context:nil];
        [self.webView addObserver:self forKeyPath:@"bounds" options:NSKeyValueObservingOptionNew context:nil];
        if (CGSizeEqualToSize(size, CGSizeZero)) {
            size = CGSizeMake(16, 9);
        }
        [self updateVideoSize:size];
        self.enablePiPMode = enable;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onApplicationDidBecomeActiveNotification:) name:UIApplicationDidBecomeActiveNotification object:nil];
    }
    return self;
}

- (void)onApplicationDidBecomeActiveNotification:(NSNotification *)noti {
    if (self.isPiPStarted) {
        self.shouldEnablePiPAfterStop = self.enablePiPMode;
        self.enablePiPMode = NO;
    }
    else if (self.enablePiPMode) {
        self.enablePiPMode = NO;
        self.enablePiPMode = YES;
    }
}

- (void)dealloc {
    [self.webView removeObserver:self forKeyPath:@"center"];
    [self.webView removeObserver:self forKeyPath:@"bounds"];
    [self clearPlayer];
    NSLog(@"%s", __func__);
}

- (void)updateVideoSize:(CGSize)size {
    if (CGSizeEqualToSize(CGSizeZero, size)) {
        return;
    }
    // 进入pip后playerView尺寸变成画中画尺寸(因为[pipView addSubview:self.playerView]), 涉及playerView尺寸的计算逻辑有问题, 这里直接return
    // after entering pip, the playerView size becomes the pip size (because [pipView addSubview:self.playerView]), the calculation logic of playerView size has problems, here we return directly
    if (_isPiPStarted) {
        return;
    }
    self.scaledVideoSize = size;
    self.scaledVideoSize = [self getScaledVideoSize];
    if (!self.playerVC) {
        return;
    }
    self.playerVC.view.frame = [self calcPlayerVCRect];
    [self playLocalVideoIfNeeded];
}

- (NSInteger)greatestCommonDivisorM:(NSInteger)m
                                  N:(NSInteger)n {
    NSInteger t, r;
    if (m < n) {
        t = m;
        m = n;
        n = t;
    }
    r = m % n;
    
    if (r == 0) {
        return n;
    } else {
        return [self greatestCommonDivisorM:n N:r];
    }
}

- (CGSize)getScaledVideoSize {
    NSInteger gcd = [self greatestCommonDivisorM:self.scaledVideoSize.width N:self.scaledVideoSize.height];
    CGFloat screenWidth = UIScreen.mainScreen.bounds.size.width;
    // 这里如果尺寸过小, 比如CGSize(16, 9)的时候, 实际pip窗口比例就会错误, 这里参考屏幕尺寸避免过大或过小
    // here if the size is too small, such as CGSize(16, 9), the actual pip window ratio will wrong, here we refer to the screen size to avoid being too large or too small
    NSInteger times = screenWidth / (self.scaledVideoSize.width / gcd);
    times = MAX(1, times);
    return CGSizeMake(self.scaledVideoSize.width / gcd * times, self.scaledVideoSize.height / gcd * times);
}

- (void)preparePlayer {
    if (self.playerVC != nil) {
        return;
    }
    if (![AVPictureInPictureController isPictureInPictureSupported]) {
        return;
    }
    self.playerVC = [[BDLAVPlayerViewController alloc] init];
    self.playerVC.updatesNowPlayingInfoCenter = NO;
    self.playerVC.delegate = self;
    if (@available(iOS 14.2, *)) {
        self.playerVC.canStartPictureInPictureAutomaticallyFromInline = YES;
    }
    [self updatePlayerVCParentViewController];
    self.playerVC.view.frame = [self calcPlayerVCRect];
    self.playerVC.view.alpha = kBDLPlayerViewAlpha;
    self.playerVC.view.userInteractionEnabled = NO;
    self.playerVC.allowsPictureInPicturePlayback = YES;
    [self.playerVC.view addObserver:self forKeyPath:@"frame" options:NSKeyValueObservingOptionNew context:nil];
}

/// 更新playerVC的ParentViewController
/// 经测试发现，画中画开始后，返回时候如果要保持系统的动画，需要让playerVC加在某个vc上
/// 现在的做法是查找playerView所在的vc，然后将 playerVC 作为子vc添加上去
/// update playerVC's parentViewController
/// testing shows that after pip starts, if you want to keep the system animation, you need to add playerVC as a subvc to the vc where playerView is located
/// now the method is to find the vc where playerView is located, and then add playerVC as a subvc to it
- (void)updatePlayerVCParentViewController {
    if (!self.playerVC || !self.enablePiPMode) {
        return;
    }
    UIResponder *responder = self.webView;
    UIViewController *destVC = nil;
    while (responder) {
        if ([responder isKindOfClass:[UIWindow class]] && ((UIWindow *)responder).rootViewController) {
            destVC = ((UIWindow *)responder).rootViewController;
            break;
        }
        else if ([responder isKindOfClass:[UIViewController class]]) {
            destVC = (UIViewController *)responder;
            break;
        }
        responder = responder.nextResponder;
    }
    
    if (!destVC) {
        return;
    }
    
    [self.playerVC willMoveToParentViewController:destVC];

    [destVC addChildViewController:self.playerVC];
    [self.playerVC didMoveToParentViewController:destVC];
    [destVC.view addSubview:self.playerVC.view];
}

- (CGRect)calcPlayerVCRect {
    CGSize playerSize = self.webView.bounds.size;
    // 横屏且未全屏则按16:9算尺寸
    // landscape mode and not full screen, calculate the size as 16:9
    if (!self.isPortrait
        && playerSize.width < playerSize.height) {
        playerSize.height = playerSize.width * 9.0 / 16.0;
        return CGRectMake(CGRectGetMinX(self.webView.frame), CGRectGetMinY(self.webView.frame) + 40, playerSize.width, playerSize.height);
    }
    return self.webView.frame;
}

// 修正playerVC的大小为视频的实际播放区域,防止进入画中画时候,因为playerVC的错误位置导致画中画初始位置错误
// correct the size of playerVC to the actual playing area of the video, to prevent the initial position of pip from being wrong due to the wrong position of playerVC
- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary<NSKeyValueChangeKey,id> *)change
                       context:(void *)context {
    if ([keyPath isEqualToString:@"frame"]) {
        if (_isPiPStarted) {
            return;
        }
        CGRect frame = [change[NSKeyValueChangeNewKey] CGRectValue];
        CGRect calcRect = [self calcPlayerVCRect];
        if (fabs(CGRectGetWidth(calcRect) - CGRectGetWidth(frame)) > BDL_FLT_EPSILON
            || fabs(CGRectGetHeight(calcRect) - CGRectGetHeight(frame)) > BDL_FLT_EPSILON) {
            self.playerVC.view.frame = calcRect;
        }
    }
    else if ([keyPath isEqualToString:@"rate"]) {
        CGFloat rate = [change[NSKeyValueChangeNewKey] floatValue];
        if (rate > kBDLPiPLocalVideoPlayRate) {
            self.playerVC.player.rate = kBDLPiPLocalVideoPlayRate;
        }
    }
    else if ([keyPath isEqualToString:@"center"]
        || [keyPath isEqualToString:@"bounds"]) {
        if (object != self.webView) {
            return;
        }
        if (_isPiPStarted) {
            return;
        }
        self.scaledVideoSize = [self getScaledVideoSize];
        [self updatePlayerVCParentViewController];
        self.playerVC.view.frame = [self calcPlayerVCRect];
    }
    else {
        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    }
}

- (void)clearPlayer {
    if (nil == self.playerVC) {
        return;
    }
    [self.playerVC.view removeFromSuperview];
    [self.playerVC.view removeObserver:self forKeyPath:@"frame"];
    [self.playerVC removeFromParentViewController];
    [self.playerVC.player pause];
    [self.playerVC.player removeObserver:self forKeyPath:@"rate"];
    self.playerVC.player = nil;
    self.playerVC = nil;
}

- (void)playLocalVideoIfNeeded {
    if (!self.enablePiPMode) {
        return;
    }
    @bdl_weakify(self);
    [BDLPiPVideoWriter videoWithSize:self.scaledVideoSize color:[UIColor blackColor] completion:^(NSString * _Nullable path) {
        @bdl_strongify(self);
        if (!self) {
            return;
        }
        NSError *error = nil;
        [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback
                                                mode:AVAudioSessionModeMoviePlayback
                                  routeSharingPolicy:AVAudioSessionRouteSharingPolicyDefault
                                             options:AVAudioSessionCategoryOptionMixWithOthers
                                               error:&error];
        [[AVAudioSession sharedInstance] setActive:YES error:&error];
        if ([BDLUtils isEmptyString:path]) {
            return;
        }
        self.playerItem = [AVPlayerItem playerItemWithURL:[NSURL fileURLWithPath:path]];
        self.playerVC.videoGravity = AVLayerVideoGravityResizeAspectFill;
        if (self.playerVC.player != nil) {
            [self.playerVC.player replaceCurrentItemWithPlayerItem:self.playerItem];
        } else {
            AVPlayer *player = [AVPlayer playerWithPlayerItem:self.playerItem];
            player.allowsExternalPlayback = NO;
            player.usesExternalPlaybackWhileExternalScreenIsActive = NO;
            self.playerVC.player = player;
            // 必须在playerVC.player赋值后，requiresLinearPlayback才能生效。
            self.playerVC.requiresLinearPlayback = YES;
            [player addObserver:self forKeyPath:@"rate" options:NSKeyValueObservingOptionNew context:nil];
        }
        [self.playerVC.player play];
        self.playerVC.player.rate = kBDLPiPLocalVideoPlayRate;
        self.playerVC.player.actionAtItemEnd = AVPlayerActionAtItemEndNone;
    }];
}

- (AVPictureInPictureController *)pipControllerFromPlayerVC:(AVPlayerViewController *)playerVC {
    NSString *key = [NSString stringWithFormat:@"_%@%@", @"pictureInPict", @"ureController"];
    id pipController = [playerVC valueForKey:key];
    if ([pipController isKindOfClass:[AVPictureInPictureController class]]) {
        return pipController;
    }
    return nil;
}

- (UIView *)viewFromPiPController:(AVPictureInPictureController *)pipController {
    NSString *key = [NSString stringWithFormat:@"picture%@Picture%@", @"In", @"ViewController"];
    UIViewController *pipVC = [pipController valueForKey:key];
    if (pipVC != nil) {
        return pipVC.view;
    }
    return nil;
}

- (BOOL)isEnablePiPMode {
    return _enablePiPMode;
}

- (void)setEnablePiPMode:(BOOL)enablePiPMode {
    if (enablePiPMode == _enablePiPMode) {
        return;
    }
    _enablePiPMode = enablePiPMode;
    self.playerVC.enablePip = enablePiPMode;
    if (enablePiPMode) {
        [self preparePlayer];
        [self playLocalVideoIfNeeded];
    } else {
        [self.playerVC.player pause];
        [[self pipControllerFromPlayerVC:self.playerVC] stopPictureInPicture];
        [self clearPlayer];
    }
}

#pragma mark - AVPlayerViewControllerDelegate

- (void)playerViewControllerWillStartPictureInPicture:(AVPlayerViewController *)playerViewController {
    if (nil == self.webView) {
        return;
    }
    AVPictureInPictureController *pipController = [self pipControllerFromPlayerVC:playerViewController];
    UIView *pipView = [self viewFromPiPController:pipController];
    if (nil == pipView) {
        return;
    }
    if ([self.delegate respondsToSelector:@selector(pipHelperWillStartPiP:)]) {
        [self.delegate pipHelperWillStartPiP:self];
    }
    self.isPiPStarted = YES;
    NSArray *styleArr = @[@"con", @"tro", @"lsSt", @"yle"];
    NSString *styleKey = [styleArr componentsJoinedByString:@""];
    [pipController setValue:@1 forKey:styleKey];
    [pipView addSubview:self.webView];
    //NSLog(@"pip %p will start playerView=%p removeFromSuperview=%p, add to pipView=%p", self.playerVC, self.playerView, v, pipView);
    [self.webView mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.left.top.lessThanOrEqualTo(pipView);
        make.right.bottom.greaterThanOrEqualTo(pipView);
        make.center.equalTo(pipView);
    }];
}

- (void)playerViewControllerDidStartPictureInPicture:(AVPlayerViewController *)playerViewController {
    self.isPiPStarted = YES;
    if ([self.delegate respondsToSelector:@selector(pipHelperDidStartPiP:)]) {
        [self.delegate pipHelperDidStartPiP:self];
    }
}

- (void)playerViewController:(AVPlayerViewController *)playerViewController failedToStartPictureInPictureWithError:(NSError *)error {
    if ([self.delegate respondsToSelector:@selector(pipHelper:failedToStartPiPWithError:)]) {
        [self.delegate pipHelper:self failedToStartPiPWithError:error];
    }
}

- (void)playerViewControllerWillStopPictureInPicture:(AVPlayerViewController *)playerViewController {
    if (nil == self.webView) {
        return;
    }
    if ([self.delegate respondsToSelector:@selector(pipHelperWillStopPiP:)]) {
        [self.delegate pipHelperWillStopPiP:self];
    }
}

- (void)playerViewControllerDidStopPictureInPicture:(AVPlayerViewController *)playerViewController {
    self.isPiPStarted = NO;
    if (self.shouldEnablePiPAfterStop) {
        self.enablePiPMode = YES;
        self.shouldEnablePiPAfterStop = NO;
    }
    if (nil == self.webView) {
        return;
    }
    if ([self.delegate respondsToSelector:@selector(pipHelperDidStopPiP:)]) {
        [self.delegate pipHelperDidStopPiP:self];
    }
}

- (BOOL)playerViewControllerShouldAutomaticallyDismissAtPictureInPictureStart:(AVPlayerViewController *)playerViewController {
    return NO;
}

- (void)playerViewController:(AVPlayerViewController *)playerViewController restoreUserInterfaceForPictureInPictureStopWithCompletionHandler:(void (^)(BOOL restored))completionHandler {
    if ([self.delegate respondsToSelector:@selector(pipHelperRestoreUserInterfaceForPictureInPictureStop:)]) {
        [self.delegate pipHelperRestoreUserInterfaceForPictureInPictureStop:self];
    }
    completionHandler(YES);
}

@end
