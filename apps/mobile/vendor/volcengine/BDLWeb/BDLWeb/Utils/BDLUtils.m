//
//   BDLUtils.m
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


#import "BDLUtils.h"

#define PHONE_MAX_LENGTH    15

@implementation BDLUtils

+ (CGSize)portraitScreenSize {
    static CGSize size;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        size = [UIScreen mainScreen].bounds.size;
        if (size.height < size.width) {
            CGFloat tmp = size.height;
            size.height = size.width;
            size.width = tmp;
        }
    });
    return size;
}

+ (CGSize)landscapeScreenSize {
    static CGSize size;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        size = [UIScreen mainScreen].bounds.size;
        if (size.width < size.height) {
            CGFloat tmp = size.width;
            size.width = size.height;
            size.height = tmp;
        }
    });
    return size;
}

+ (CVPixelBufferRef)pixelBufferFromCGImage:(CGImageRef)image {
    if (NULL == image) {
        return NULL;
    }
    CGSize size = CGSizeMake(CGImageGetWidth(image), CGImageGetHeight(image));
    NSDictionary *options = [NSDictionary dictionaryWithObjectsAndKeys:
                             @(YES), kCVPixelBufferCGImageCompatibilityKey,
                             @(YES), kCVPixelBufferCGBitmapContextCompatibilityKey,
                             nil];
    CVPixelBufferRef buffer = NULL;
    CVReturn status = kCVReturnSuccess;
    status = CVPixelBufferCreate(kCFAllocatorDefault, size.width, size.height, kCVPixelFormatType_32ARGB, (__bridge CFDictionaryRef)options, &buffer);
    if (status != kCVReturnSuccess || NULL == buffer) {
        return NULL;
    }
    CVPixelBufferLockBaseAddress(buffer, 0);
    void *data = CVPixelBufferGetBaseAddress(buffer);
    if (data != NULL) {
        CGColorSpaceRef space = CGColorSpaceCreateDeviceRGB();
        size_t bytesPerRow = CVPixelBufferGetBytesPerRow(buffer);
        CGContextRef context = CGBitmapContextCreate(data, size.width, size.height, 8, bytesPerRow, space, kCGImageAlphaPremultipliedFirst);
        CGContextConcatCTM(context, CGAffineTransformIdentity);
        CGContextDrawImage(context, CGRectMake(0, 0, size.width, size.height), image);
        CGColorSpaceRelease(space);
        CGContextRelease(context);
    }
    CVPixelBufferUnlockBaseAddress(buffer, 0);
    return buffer;
}

// 获取资源bundle
+ (NSBundle *)bundleWithName:(NSString *)name {
    NSURL *url = [[NSBundle bundleForClass:self.class] URLForResource:name withExtension:@"bundle"];
    if (nil == url) {
        NSLog(@"Find BDLAssets.bundle failed");
        return nil;
    }
    return [NSBundle bundleWithURL:url];
}

+ (UIImage *)imageNamed:(NSString *)name {
    UIImage *image = [UIImage imageNamed:name inBundle:[BDLUtils bundleWithName:@"BDLWebImageResource"] compatibleWithTraitCollection:nil];
    return image;
}


#pragma mark - Container Safe Methods

+ (BOOL)isEmptyArray:(NSArray *)array {
    return (!array || ![array isKindOfClass:[NSArray class]] || array.count == 0);
}

+ (BOOL)isEmptyString:(NSString *)string {
    return (!string || ![string isKindOfClass:[NSString class]] || string.length == 0);
}

+ (BOOL)isEmptyDictionary:(NSDictionary *)dict {
    return (!dict || ![dict isKindOfClass:[NSDictionary class]] || dict.count == 0);
}

+ (BOOL)isEmptyNumber:(NSNumber *)num {
    return (!num || ![num isKindOfClass:[NSNumber class]]);
}

+ (UIImage *)imageWithColor:(UIColor *)color {
   CGRect rect = CGRectMake(0, 0, 1, 1);
   UIGraphicsBeginImageContext(rect.size);
   CGContextRef context = UIGraphicsGetCurrentContext();

   CGContextSetFillColorWithColor(context, [color CGColor]);
   CGContextFillRect(context, rect);

   UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
   UIGraphicsEndImageContext();
   return image;
}

@end

void bdl_dispatch_main_async(dispatch_block_t block) {
    if ([NSThread isMainThread]) {
        block();
    } else {
        dispatch_async(dispatch_get_main_queue(), block);
    }
}
