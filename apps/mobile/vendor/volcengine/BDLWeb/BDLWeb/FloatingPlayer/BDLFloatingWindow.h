//
//   BDLFloatingWindow.h
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

NS_ASSUME_NONNULL_BEGIN

typedef void (^BDLFloatingViewBlock)(UIView *floatingView);

@interface BDLFloatingWindow : NSObject

@property (nonatomic, strong, readonly, nullable) UIView *floatingView;
@property (nonatomic, assign) BOOL allowPullOver;
@property (nonatomic, assign) BOOL allowClose;
@property (nonatomic, assign) BOOL allowBlock;

- (BOOL)isFloating;

- (instancetype)initWithUIOrientation:(UIInterfaceOrientation)orientation;

- (void)showWithView:(UIView *)view
          closeImage:(UIImage *)closeImage
      closeImageSize:(CGSize)closeImageSize
           initFrame:(CGRect)initFrame
          finalFrame:(CGRect)finalFrame
            duration:(NSTimeInterval)duration
          willAppear:(BDLFloatingViewBlock)willAppear
        didDisappear:(BDLFloatingViewBlock)didDisappear
           willClose:(BDLFloatingViewBlock)willClose;

- (CGRect)updateFloatingSize:(CGSize)size;
- (void)updateFloatingFrame:(CGRect)frame;

- (void)hide;
- (void)close;

@property (nonatomic, copy, nullable) void(^onCloseBlock)(BDLFloatingWindow *floatingWindow);

@end

NS_ASSUME_NONNULL_END
