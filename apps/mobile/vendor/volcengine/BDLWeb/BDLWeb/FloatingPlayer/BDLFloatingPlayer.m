//
//   BDLFloatingPlayer.m
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

#import <Masonry/Masonry.h>

#import "BDLUtils.h"
#import "BDLFloatingPlayer.h"
#import "BDLFloatingWindow.h"
#import "UIWindow+BDLAdditions.h"

@interface BDLFloatingPlayer ()

@property (nonatomic, assign) UIInterfaceOrientation uiOrientation;
@property (nonatomic, strong) BDLFloatingWindow *floatingWindow;
@property (nonatomic, strong) UIView *webView;
@property (nonatomic, strong) UIView *containerView;
@property (nonatomic, strong) UITapGestureRecognizer *tapGesture;
@property (nonatomic, assign) BOOL haveCloseButton;
@property (nonatomic, assign) CGRect floatingFrame;

@end

@implementation BDLFloatingPlayer

- (instancetype)initWithWebView:(UIView *)webView {
    self = [super init];
    if (self) {
        if (@available(iOS 13, *)) {
            self.uiOrientation = [UIWindow bdl_fullscreenWindow].windowScene.interfaceOrientation;
        } else {
            self.uiOrientation = UIApplication.sharedApplication.statusBarOrientation;
        }
        self.haveCloseButton = YES;
        self.floatingFrame = CGRectZero;
        self.floatingWindow = [self getNewFloatingWindow:self.uiOrientation];
        self.tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(onSingleTap:)];
        self.containerView = [[UIView alloc] init];
        [self.containerView addGestureRecognizer:self.tapGesture];
        [self updateWebView:webView];
    }
    return self;
}

- (void)updateWebView:(UIView *)webView {
    self.webView = webView;
    self.webView.userInteractionEnabled = NO;
    [self.containerView addSubview:self.webView];
    [self.webView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo(self.containerView);
    }];
}

- (BDLFloatingWindow *)getNewFloatingWindow:(UIInterfaceOrientation)uiOrientation {
    BDLFloatingWindow *floatingWindow = [[BDLFloatingWindow alloc] initWithUIOrientation:uiOrientation];
    @bdl_weakify(self);
    floatingWindow.onCloseBlock = ^(BDLFloatingWindow * _Nonnull floatingWindow) {
        @bdl_strongify(self);
        BOOL execDefault = YES;
        if ([self.delegate respondsToSelector:@selector(floatingPlayerDidClickClose:)]) {
            execDefault = [self.delegate floatingPlayerDidClickClose:self];
        }
        if (execDefault) {
            [self.floatingWindow close];
        }
    };
    return floatingWindow;
}

- (void)setUIOrientation:(UIInterfaceOrientation)orientation {
    if (self.uiOrientation == orientation) {
        return;
    }
    BOOL portraitLandscapeChanged = UIInterfaceOrientationIsPortrait(self.uiOrientation) != UIInterfaceOrientationIsPortrait(orientation);
    self.uiOrientation = orientation;
    if (!self.isFloating) {
        return;
    }
    if (self.floatingWindow) {
        BOOL haveCloseButton = self.haveCloseButton;
        if (portraitLandscapeChanged) {
            CGFloat maxX = CGRectGetMaxX(self.floatingFrame);
            CGFloat maxY = CGRectGetMaxY(self.floatingFrame);
            CGFloat width = CGRectGetWidth(self.floatingFrame);
            CGFloat height = CGRectGetHeight(self.floatingFrame);
            self.floatingFrame = CGRectMake(maxY - width, maxX - height, width, height);
        }
        // 旧的 floatingWindow 不用回调 didDisappear 与 willClose
        // old floatingWindow does not need to callback didDisappear and willClose
        self.floatingWindow.allowBlock = NO;
        [self close];
        
        // NOTE:因为该方法有可能在方向变化之前调用，所以这里异步执行
        // NOTE:Because this method may be called before the direction change, it is executed asynchronously here
        @bdl_weakify(self);
        dispatch_async(dispatch_get_main_queue(), ^{
            @bdl_strongify(self);
            if (!self) {
                return;
            }
            self.floatingWindow = [self getNewFloatingWindow:orientation];
            // 新的 floatingWindow 不用回调 willAppear
            // new floatingWindow does not need to callback willAppear
            self.floatingWindow.allowBlock = NO;
            [self showWithFrame:self.floatingFrame closeButton:haveCloseButton];
            // 新的 floatingWindow 需要回调 didDisappear 与 willClose
            // new floatingWindow needs to callback didDisappear and willClose
            self.floatingWindow.allowBlock = YES;
        });
    }
}

- (BOOL)showWithFrame:(CGRect)frame closeButton:(BOOL)haveCloseButton {
    if ([self.floatingWindow isFloating]) {
        return NO;
    }
    
    self.haveCloseButton = haveCloseButton;
    self.floatingFrame = frame;
        
    @bdl_weakify(self);
    self.floatingWindow.allowClose = self.haveCloseButton;
    UIImage *closeImage = [BDLUtils imageNamed:@"close"];
    [self.floatingWindow showWithView:self.containerView
                           closeImage:closeImage
                       closeImageSize:CGSizeMake(30, 30)
                            initFrame:[self getInitFrame]
                           finalFrame:self.floatingFrame
                             duration:0.3
                           willAppear:^(UIView * _Nonnull floatingView) {
        @bdl_strongify(self);
        if ([self.delegate respondsToSelector:@selector(floatingPlayerWillAppear:)]) {
            [self.delegate floatingPlayerWillAppear:self];
        }
    } didDisappear:^(UIView * _Nonnull floatingView) {
        @bdl_strongify(self);
        if ([self.delegate respondsToSelector:@selector(floatingPlayerDidDisappear:)]) {
            [self.delegate floatingPlayerDidDisappear:self];
        }
    } willClose:^(UIView * _Nonnull floatingView) {
        @bdl_strongify(self);
        if ([self.delegate respondsToSelector:@selector(floatingPlayerWillClose:)]) {
            [self.delegate floatingPlayerWillClose:self];
        }
    }];
    return YES;
}

- (void)hide {
    if (![self.floatingWindow isFloating]) {
        return;
    }
    self.haveCloseButton = YES;
    self.webView.userInteractionEnabled = YES;
    [self.floatingWindow hide];
}

- (void)close {
    if (![self.floatingWindow isFloating]) {
        return;
    }
    self.haveCloseButton = YES;
    self.webView.userInteractionEnabled = YES;
    [self.floatingWindow close];
}

- (BOOL)isFloating {
    return [self.floatingWindow isFloating];
}

- (CGRect)getInitFrame {
    CGSize size;
    if (UIInterfaceOrientationIsLandscape(self.uiOrientation)) {
        size = kBDLLandscapeScreenSize;
    } else {
        size = kBDLPortraitScreenSize;
    }
    return CGRectMake(0, 0, size.width, size.height);
}

- (void)onSingleTap:(UITapGestureRecognizer *)gesture {
    if ([self.delegate respondsToSelector:@selector(floatingPlayerDidSingleTap:)]) {
        [self.delegate floatingPlayerDidSingleTap:self];
    }
}

@end
