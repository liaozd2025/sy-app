//
//   BDLFloatingWindow.m
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


#import <Masonry/Masonry.h>
#import <objc/runtime.h>

#import "BDLFloatingWindow.h"
#import "BDLResponder.h"
#import "UIWindow+BDLAdditions.h"
#import "BDLUtils.h"

#define BDL_NOTIFICATION_KEY_WINDOW_DID_ADD_SUBVIEW   @"BDL_NOTIFICATION_KEY_WINDOW_DID_ADD_SUBVIEW"

@interface UIView (BDLDidAddSubview)

@end

@implementation UIView (BDLDidAddSubview)

+ (void)load {
    Method m1 = class_getInstanceMethod([self class], @selector(didAddSubview:));
    Method m2 = class_getInstanceMethod([self class], @selector(BDLDidAddSubview_didAddSubview:));
    method_exchangeImplementations(m1, m2);
}

- (void)BDLDidAddSubview_didAddSubview:(UIView *)view {
    [self BDLDidAddSubview_didAddSubview:view];
    if ([self isMemberOfClass:UIWindow.class] && self == [UIWindow bdl_keyWindow]) {
        [[NSNotificationCenter defaultCenter] postNotificationName:BDL_NOTIFICATION_KEY_WINDOW_DID_ADD_SUBVIEW object:nil];
    }
}

@end

@interface BDLFloatingWindowViewController : UIViewController

@property (nonatomic, assign) UIInterfaceOrientation orientation;

@end

@implementation BDLFloatingWindowViewController

- (BOOL)shouldAutorotate {
    return YES;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
    if (@available(iOS 16.0, *)) {
        return UIInterfaceOrientationMaskAllButUpsideDown;
    }
    switch (self.orientation) {
        case UIInterfaceOrientationPortrait:
            return UIInterfaceOrientationMaskPortrait;
        case UIInterfaceOrientationLandscapeLeft:
            return UIInterfaceOrientationMaskLandscapeLeft;
        case UIInterfaceOrientationLandscapeRight:
            return UIInterfaceOrientationMaskLandscapeRight;
        case UIInterfaceOrientationPortraitUpsideDown:
            return UIInterfaceOrientationMaskPortraitUpsideDown;
        default:
            return UIInterfaceOrientationMaskPortrait;
    }
}

@end

@interface BDLFloatingWindow ()

@property (nonatomic, assign) UIInterfaceOrientation uiOrientation;
@property (nonatomic, strong) UIWindow *floatingWnd;
@property (nonatomic, strong, readwrite) UIView *floatingView;
@property (nonatomic, strong) UIPanGestureRecognizer* panGesture;
@property (nonatomic, strong) UIButton *closeButton;

@property (nonatomic, copy) BDLFloatingViewBlock floatingViewDidDisappear;
@property (nonatomic, copy) BDLFloatingViewBlock floatingViewWillClose;

@end

@implementation BDLFloatingWindow

- (instancetype)initWithUIOrientation:(UIInterfaceOrientation)orientation {
    self = [super init];
    if (self) {
        self.uiOrientation = orientation;
        self.allowBlock = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onKeyWindowAddSubview) name:@"BDL_NOTIFICATION_KEY_WINDOW_DID_ADD_SUBVIEW" object:nil];
    }
    return self;
}

- (void)onKeyWindowAddSubview {
    if (_floatingWnd) {
        [[UIWindow bdl_keyWindow] bringSubviewToFront:_floatingWnd];
    }
}

- (UIWindow *)floatingWnd {
    if (nil == _floatingWnd) {
        _floatingWnd = [[UIWindow alloc] initWithFrame:CGRectMake(0, 0, 1, 1)];
        BDLFloatingWindowViewController *vc = [[BDLFloatingWindowViewController alloc] init];
        vc.orientation = self.uiOrientation;
        _floatingWnd.rootViewController = vc;
        _floatingWnd.rootViewController.view.backgroundColor = UIColor.clearColor;
        _floatingWnd.rootViewController.view.userInteractionEnabled = NO;
        _floatingWnd.windowLevel = UIWindowLevelAlert - 1;
        _floatingWnd.backgroundColor = [UIColor clearColor];
        _floatingWnd.hidden = YES;
        UIWindow *keyWindow = [UIWindow bdl_keyWindow];
        [keyWindow addSubview:_floatingWnd];
        _floatingWnd.layer.zPosition = CGFLOAT_MAX; // 这里保证浮窗在最上面，在通知里面调整真实的层级结构
    }
    return _floatingWnd;
}

- (BOOL)isFloating {
    return ![self.floatingWnd isHidden];
}

- (void)showWithView:(UIView *)view
          closeImage:(UIImage *)closeImage
      closeImageSize:(CGSize)closeImageSize
           initFrame:(CGRect)initFrame
          finalFrame:(CGRect)finalFrame
            duration:(NSTimeInterval)duration
          willAppear:(BDLFloatingViewBlock)willAppear
        didDisappear:(BDLFloatingViewBlock)didDisappear
           willClose:(BDLFloatingViewBlock)willClose {
    if ([self isFloating]) {
        return;
    }
    self.floatingViewDidDisappear = didDisappear;
    self.floatingViewWillClose = willClose;
    self.floatingWnd.frame = initFrame;
    self.floatingWnd.clipsToBounds = YES;
    self.panGesture = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(onPanGesture:)];
    self.panGesture.minimumNumberOfTouches = 1;
    self.panGesture.maximumNumberOfTouches = 1;
    [view addGestureRecognizer:self.panGesture];
    CGRect floatingViewFrame;
    floatingViewFrame.origin = CGPointZero;
    floatingViewFrame.size = initFrame.size;
    view.frame = floatingViewFrame;
    self.floatingView = view;
    [self.floatingWnd addSubview:view];
    
    __block UIView *playerContentView = nil;
    [view.subviews enumerateObjectsUsingBlock:^(__kindof UIView * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        if ([obj isKindOfClass:NSClassFromString(@"TTPlayerView")]) {
            playerContentView = obj;
            if (stop != NULL) {
                *stop = YES;
            }
        }
    }];
    [view mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo(self.floatingWnd);
    }];
    [playerContentView mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo(view);
    }];
    
    if (self.allowClose) {
        self.closeButton = [[UIButton alloc] init];
        [self.closeButton setImage:closeImage forState:UIControlStateNormal];
        [self.closeButton setImageEdgeInsets:UIEdgeInsetsMake(4, 4, 4, 4)];
        [self.closeButton addTarget:self action:@selector(onCloseButton:) forControlEvents:UIControlEventTouchUpInside];
        [self.floatingWnd addSubview:self.closeButton];
        [self.closeButton mas_makeConstraints:^(MASConstraintMaker *make) {
            make.top.right.equalTo(self.floatingWnd);
            make.size.mas_equalTo(closeImageSize);
        }];
    }
    
    if (self.allowBlock && willAppear) {
        willAppear(view);
    }
    self.floatingWnd.layer.borderColor = view.layer.borderColor;
    self.floatingWnd.layer.borderWidth = view.layer.borderWidth;
    self.floatingWnd.layer.cornerRadius = view.layer.cornerRadius;
    self.floatingWnd.hidden = NO;
    
    floatingViewFrame.size = finalFrame.size;
    [UIView animateWithDuration:duration
                          delay:0
                        options:UIViewAnimationOptionCurveEaseOut
                     animations:^{
        self.floatingWnd.frame = finalFrame;
        self.floatingView.frame = floatingViewFrame;
    } completion:^(BOOL finished) {
    }];
}

- (void)updateFloatingFrame:(CGRect)frame {
    self.floatingWnd.frame = frame;
}

- (CGRect)updateFloatingSize:(CGSize)size {
    CGRect originFrame = self.floatingWnd.frame;
    // 优先右下对齐
    CGFloat x = CGRectGetMaxX(originFrame) - size.width;
    CGFloat y = CGRectGetMaxY(originFrame) - size.height;
    if (x < 15) {
        x = CGRectGetMinX(originFrame);
    }
    if (y < 58) {
        y = CGRectGetMinY(originFrame);
    }
    self.floatingWnd.frame = CGRectMake(x, y, size.width, size.height);
    return self.floatingWnd.frame;
}

- (void)hide {
    if (![self isFloating]) {
        return;
    }
    self.floatingWnd.hidden = YES;
    if (self.closeButton != nil) {
        [self.closeButton removeFromSuperview];
        self.closeButton = nil;
    }
    if (self.panGesture != nil) {
        [self.floatingView removeGestureRecognizer:self.panGesture];
        self.panGesture = nil;
    }
    if (self.floatingView != nil) {
        [self.floatingView removeFromSuperview];
        if (self.allowBlock && self.floatingViewDidDisappear) {
            self.floatingViewDidDisappear(self.floatingView);
        }
        self.floatingView = nil;
    }
    // 这里直接调用 [self.floatingWnd removeFromSuperview] 无效，通过如下方式保证 self.floatingWnd从Window 上移除并销毁
    // 这里 floatingWnd 暂时还不能换成UIView，因为画中画的小窗还要加到上面
    // here calling [self.floatingWnd removeFromSuperview] is invalid, and the following method is used to ensure that self.floatingWnd is removed from the Window and destroyed
    // here floatingWnd temporarily cannot be changed to UIView because the small window in the pip also needs to be added to it
    self.floatingWnd.windowLevel = UIWindowLevelNormal;
    [self.floatingWnd.rootViewController removeFromParentViewController];
    self.floatingWnd.rootViewController = nil;
    [self.floatingWnd removeFromSuperview];
    self.floatingWnd.hidden = YES;
    NSArray *subviews = self.floatingWnd.subviews;
    for (UIView *subview in subviews) {
        [subview removeFromSuperview];
    }
    self.floatingWnd = nil;
    self.floatingViewDidDisappear = nil;
}

- (void)close {
    if (self.allowBlock && self.floatingViewWillClose) {
        self.floatingViewWillClose(self.floatingView);
    }
    [self hide];
}

- (void)onPanGesture:(UIPanGestureRecognizer *)sender {
    CGPoint offset = [sender translationInView:sender.view];
    [sender setTranslation:CGPointZero inView:sender.view];
    CGFloat newX = self.floatingWnd.center.x + offset.x;
    CGFloat newY = self.floatingWnd.center.y + offset.y;
    CGSize wndSize = self.floatingWnd.frame.size;
    CGSize mainSize = CGSizeZero;
    if (UIInterfaceOrientationIsLandscape(self.uiOrientation)) {
        mainSize = kBDLLandscapeScreenSize;
    } else {
        mainSize = kBDLPortraitScreenSize;
    }
    if (newX >= wndSize.width / 2 && newX <= (mainSize.width - wndSize.width / 2)) {
        self.floatingWnd.center = CGPointMake(newX, self.floatingWnd.center.y);
    }
    if (newY >= wndSize.height / 2 && newY <= (mainSize.height - wndSize.height / 2)) {
        self.floatingWnd.center = CGPointMake(self.floatingWnd.center.x, newY);
    }
    if (UIGestureRecognizerStateEnded == sender.state) {
        if (self.allowPullOver) {
            [self pullOver];
        }
    }
}

- (CGPoint)centerByPullOver {
    CGPoint center = self.floatingWnd.center;
    CGSize wndSize = self.floatingWnd.bounds.size;
    CGSize mainSize = CGSizeZero;
    if (UIInterfaceOrientationIsLandscape(self.uiOrientation)) {
        mainSize = kBDLLandscapeScreenSize;
    } else {
        mainSize = kBDLPortraitScreenSize;
    }
    if (center.x < mainSize.width / 2) {
        center.x = wndSize.width / 2;
    } else {
        center.x = mainSize.width - wndSize.width / 2;
    }
    if (center.y < wndSize.height / 2) {
        center.y = wndSize.height / 2;
    } else if (center.y > (mainSize.height - wndSize.height / 2)) {
        center.y = mainSize.height - wndSize.height / 2;
    }
    return center;
}

- (void)pullOver {
    CGPoint center = [self centerByPullOver];
    if (!CGPointEqualToPoint(center, self.floatingWnd.center)) {
        [UIView animateWithDuration:0.5f animations:^{
            self.floatingWnd.center = center;
        } completion:nil];
    }
}

- (void)onCloseButton:(UIButton *)sender {
    if (self.onCloseBlock) {
        self.onCloseBlock(self);
        return;
    }
    [self close];
}

@end
