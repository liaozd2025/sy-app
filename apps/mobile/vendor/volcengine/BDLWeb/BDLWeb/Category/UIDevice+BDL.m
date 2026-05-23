//
//   UIDevice+BDL.m
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

#import "UIDevice+BDL.h"
#import "BDLResponder.h"
#import <objc/runtime.h>

@implementation UIDevice (BDL)

+ (void)BDL_switchNewOrientation:(UIInterfaceOrientation)interfaceOrientation {
    if (@available(iOS 16.0, *)) {
        UIInterfaceOrientationMask mask = UIInterfaceOrientationMaskAll;
        switch (interfaceOrientation) {
            case UIInterfaceOrientationUnknown:
                mask = UIInterfaceOrientationMaskAll;
                break;
            case UIInterfaceOrientationPortrait:
                mask = UIInterfaceOrientationMaskPortrait;
                break;
            case UIInterfaceOrientationPortraitUpsideDown:
                mask = UIInterfaceOrientationMaskPortraitUpsideDown;
                break;
            case UIInterfaceOrientationLandscapeLeft:
                mask = UIInterfaceOrientationMaskLandscapeLeft;
                break;
            case UIInterfaceOrientationLandscapeRight:
                mask = UIInterfaceOrientationMaskLandscapeRight;
                break;
            default:
                break;
        }
        [[BDLResponder topViewController] setNeedsUpdateOfSupportedInterfaceOrientations];
        UIWindowScene *scene = (UIWindowScene *)[[[UIApplication sharedApplication] connectedScenes] anyObject];
        if (scene) {
            UIWindowSceneGeometryPreferencesIOS *geometryPreferences = [[UIWindowSceneGeometryPreferencesIOS alloc] initWithInterfaceOrientations:mask];
            [scene requestGeometryUpdateWithPreferences:geometryPreferences errorHandler:nil];
            
        }
    }
    else {
        NSNumber *resetOrientationTarget = [NSNumber numberWithInt:UIInterfaceOrientationUnknown];
        [[UIDevice currentDevice] setValue:resetOrientationTarget forKey:@"orientation"];
        NSNumber *orientationTarget = [NSNumber numberWithInteger:interfaceOrientation];
        [[UIDevice currentDevice] setValue:orientationTarget forKey:@"orientation"];
    }
}

@end
