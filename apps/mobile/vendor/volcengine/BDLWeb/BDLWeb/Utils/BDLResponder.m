//
//   BDLResponder.m
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


#import "BDLResponder.h"
#import "UIWindow+BDLAdditions.h"

@implementation BDLResponder

+ (UIViewController *)topViewController {
    return [self topViewControllerForController:[UIWindow bdl_keyWindow].rootViewController];
}

+ (BOOL)isTopViewController:(UIViewController *)viewController {
    return [self topViewController] == viewController;
}

+ (UIView *)topView {
    return [self topViewController].view;
}

+ (UIViewController *)topViewControllerForView:(UIView *)view {
    UIResponder *responder = view;
    while (responder && ![responder isKindOfClass:[UIViewController class]]) {
        responder = [responder nextResponder];
    }
    if (!responder) {
        responder = [UIWindow bdl_keyWindow].rootViewController;
    }
    return [self topViewControllerForController:(UIViewController *)responder];
}

+ (UIViewController *)topViewControllerForController:(UIViewController *)viewController {
    while (1) {
        if ([viewController isKindOfClass:[UITabBarController class]]) {
            viewController = ((UITabBarController *)viewController).selectedViewController;
        } else if ([viewController isKindOfClass:[UINavigationController class]]) {
            viewController = ((UINavigationController *)viewController).visibleViewController;
        } else if (viewController.presentedViewController) {
            viewController = viewController.presentedViewController;
        } else {
            break;
        }
    }
    return viewController;
}

+ (UIViewController *)topViewControllerForResponder:(UIResponder *)responder {
    if ([responder isKindOfClass:[UIView class]]) {
        return [self topViewControllerForView:(UIView *)responder];
    } else if ([responder isKindOfClass:[UIViewController class]]) {
        return [self topViewControllerForController:(UIViewController *)responder];
    } else {
        return [self topViewController];
    }
}

+ (UIResponder *)findFirstResponder:(UIView *)view {
    if ([view isFirstResponder]) {
        return view;
    }
    for (UIView *subview in view.subviews) {
        UIResponder *responder = [self findFirstResponder:subview];
        if (responder) {
            return responder;
        }
    }
    return nil;
}

@end
