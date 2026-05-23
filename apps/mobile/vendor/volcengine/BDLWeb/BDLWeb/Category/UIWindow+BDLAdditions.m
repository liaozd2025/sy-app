//   
//   UIWindow+BDLAdditions.m
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

#import "UIWindow+BDLAdditions.h"

@implementation UIWindow (BDLAdditions)

+ (nullable UIWindow *)bdl_keyWindow {
    if (@available(iOS 13.0, *)) {
        // Find active key window from UIScene
        UIWindow *keyWindow = nil;
        NSInteger activeWindowSceneCount = 0;
        NSSet *connectedScenes = [UIApplication sharedApplication].connectedScenes;
        for (UIScene *scene in connectedScenes) {
            if (scene.activationState == UISceneActivationStateForegroundActive && [scene isKindOfClass:[UIWindowScene class]]) {
                activeWindowSceneCount++;
                UIWindowScene *windowScene = (UIWindowScene *)scene;
                if (!keyWindow) {
                    keyWindow = [self bdl_keyWindowFromWindowScene:windowScene];
                }
            }
        }
        
        // If there're multiple active window scenes, get the key window from the currently focused window scene to keep the behavior consistent with [UIApplication sharedApplication].keyWindow
        if (activeWindowSceneCount > 1) {
            // Although [UIApplication sharedApplication].keyWindow is deprecated for iOS 13+, it can help to find the focused one when multiple scenes in the foreground
            keyWindow = [self bdl_keyWindowFromWindowScene:[UIApplication sharedApplication].keyWindow.windowScene];
        }
        
        // Sometimes there will be no active scene in foreground, loop through the application windows for the key window
        if (!keyWindow) {
            for (UIWindow *window in [UIApplication sharedApplication].windows) {
                if (window.isKeyWindow) {
                    keyWindow = window;
                    break;
                }
            }
        }
        
        // Check to see if the app key window is true and add protection
        if (!keyWindow && [UIApplication sharedApplication].keyWindow.isKeyWindow) {
            keyWindow = [UIApplication sharedApplication].keyWindow;
        }
        
        // Still nil ? Add protection to always fallback to the application delegate's window.
        // There's a chance when delegate doesn't respond to window, so add protection here
        if (!keyWindow && [[UIApplication sharedApplication].delegate respondsToSelector:@selector(window)]) {
            keyWindow = [UIApplication sharedApplication].delegate.window;
        }
        
        return keyWindow;
    } else {
        // Fall back to application's key window below iOS 13
        return [UIApplication sharedApplication].keyWindow;
    }
}

+ (UIWindow *)bdl_keyWindowFromWindowScene:(id)windowScene {
    if (@available(iOS 13.0, *)) {
        if ([windowScene isKindOfClass:[UIWindowScene class]]) {
            for (UIWindow *window in ((UIWindowScene *)windowScene).windows) {
                if (window.isKeyWindow) {
                    return window;
                }
            }
        }
    }
    return nil;
}

#pragma mark - Fullscreen Window

+ (nullable UIWindow *)bdl_fullscreenWindow {
    if (@available(iOS 13.0, *)) {
        // Find fullscreen window from UIScene
        UIWindow *fullscreenWindow = nil;
        NSInteger activeWindowSceneCount = 0;
        NSSet *connectedScenes = [UIApplication sharedApplication].connectedScenes;
        for (UIScene *scene in connectedScenes) {
            if (scene.activationState == UISceneActivationStateForegroundActive && [scene isKindOfClass:[UIWindowScene class]]) {
                activeWindowSceneCount++;
                UIWindowScene *windowScene = (UIWindowScene *)scene;
                if (!fullscreenWindow) {
                    fullscreenWindow = [self bdl_fullscreenWindowFromWindowScene:windowScene];
                }
            }
        }
        
        // If there're multiple active window scenes, get the fullscreen window from the currently focused window scene to keep the behavior consistent with [UIApplication sharedApplication].keyWindow
        if (activeWindowSceneCount > 1) {
            // Although [UIApplication sharedApplication].keyWindow is deprecated for iOS 13+, it can help to find the focused one when multiple scenes in the foreground
            fullscreenWindow = [self bdl_fullscreenWindowFromWindowScene:[UIApplication sharedApplication].keyWindow.windowScene];
        }
        
        // Sometimes there will be no active scene in foreground, loop through the application windows for the fullscreen window
        if (!fullscreenWindow) {
            fullscreenWindow = [self bdl_fullscreenWindowInWindows:[UIApplication sharedApplication].windows];
        }
        
        return fullscreenWindow;
    } else {
        // Fall back to application's key window below iOS 13
        return [UIApplication sharedApplication].keyWindow;
    }
}

+ (UIWindow *)bdl_fullscreenWindowFromWindowScene:(id)windowScene {
    if (@available(iOS 13.0, *)) {
        if ([windowScene isKindOfClass:[UIWindowScene class]]) {
            return [self bdl_fullscreenWindowInWindows:((UIWindowScene *)windowScene).windows];
        }
    }
    return nil;
}

/// 返回全屏UIWindow, 其中优先返回keyWindow, 若无keyWindow, 则返回第一个全屏的window
+ (nullable UIWindow *)bdl_fullscreenWindowInWindows:(NSArray<UIWindow *> *)windows {
    CGSize screenSize = UIScreen.mainScreen.bounds.size;
    NSMutableArray<UIWindow *> *fullscreenWindows = [NSMutableArray array];
    for (UIWindow *window in windows) {
        if (CGSizeEqualToSize(screenSize, window.bounds.size)) {
            [fullscreenWindows addObject:window];
        }
    }
    for (UIWindow *window in fullscreenWindows) {
        // 优先返回所有全屏大小的window中的keyWindow
        if (window.isKeyWindow) {
            return window;
        }
    }
    // 全屏大小的window里面没有keyWindow, 返回第一个 (这里也可能是nil)
    return windows.firstObject;

}

@end
