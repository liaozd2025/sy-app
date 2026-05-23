//
//   BDLUtils.h
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

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSUInteger, BDLProductType) {
    BDLProductTypeSDKPull,
    BDLProductTypeSDKPush,
    BDLProductTypeAppVolclive,
};

@interface BDLUtils : NSObject

+ (CGSize)portraitScreenSize;
+ (CGSize)landscapeScreenSize;

+ (CVPixelBufferRef)pixelBufferFromCGImage:(CGImageRef)image;

+ (UIImage *)imageWithColor:(UIColor *)color;

+ (UIImage *)imageNamed:(NSString *)name;

#pragma mark - Container Safe Methods

+ (BOOL)isEmptyArray:(NSArray *)array;

+ (BOOL)isEmptyString:(NSString *)string;

+ (BOOL)isEmptyDictionary:(NSDictionary *)dict;

+ (BOOL)isEmptyNumber:(NSNumber *)num;

@end

FOUNDATION_EXTERN void bdl_dispatch_main_async(dispatch_block_t block);

#ifndef kBDLPortraitScreenSize
#define kBDLPortraitScreenSize [BDLUtils portraitScreenSize]
#endif

#ifndef kBDLPortraitScreenWidth
#define kBDLPortraitScreenWidth [BDLUtils portraitScreenSize].width
#endif

#ifndef kBDLPortraitScreenHeight
#define kBDLPortraitScreenHeight [BDLUtils portraitScreenSize].height
#endif

#ifndef kBDLLandscapeScreenSize
#define kBDLLandscapeScreenSize [BDLUtils landscapeScreenSize]
#endif

#ifndef kBDLLandscapeScreenWidth
#define kBDLLandscapeScreenWidth [BDLUtils landscapeScreenSize].width
#endif

#ifndef kBDLLandscapeScreenHeight
#define kBDLLandscapeScreenHeight [BDLUtils landscapeScreenSize].height
#endif

#define BDL_FLT_EPSILON  0.000001

#ifndef bdl_keywordify
    #if DEBUG
        #define bdl_keywordify autoreleasepool {}
    #else
        #define bdl_keywordify try {} @catch (...) {}
    #endif
#endif

#ifndef bdl_weakify
    #if __has_feature(objc_arc)
        #define bdl_weakify(object) bdl_keywordify __weak __typeof__(object) weak##_##object = object
    #else
        #define bdl_weakify(object) bdl_keywordify __block __typeof__(object) block##_##object = object
    #endif
#endif

#ifndef bdl_strongify
    #if __has_feature(objc_arc)
        #define bdl_strongify(object) bdl_keywordify __typeof__(object) object = weak##_##object
    #else
        #define bdl_strongify(object) bdl_keywordify __typeof__(object) object = block##_##object
    #endif
#endif

NS_ASSUME_NONNULL_END
