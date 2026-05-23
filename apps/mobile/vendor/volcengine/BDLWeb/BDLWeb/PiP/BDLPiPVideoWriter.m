//   
//   BDLPiPVideoWriter.m
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


#import <AVKit/AVKit.h>

#import "BDLPiPVideoWriter.h"
#import "UIImage+BDLAdditions.h"
#import "BDLUtils.h"

@implementation BDLPiPVideoWriter

+ (void)videoWithSize:(CGSize)size color:(UIColor *)color completion:(void (^)(NSString * _Nullable path))completion {
    if (size.width <= 0 || size.height <= 0) {
        if (completion) {
            completion(nil);
        }
        return;
    }
    NSString *name = [NSString stringWithFormat:@"bdl_pip_video_%@_%@.mov", @(size.width), @(size.height)];
    NSString *dir = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) firstObject];
    NSString *path = [dir stringByAppendingPathComponent:name];
    if ([[NSFileManager defaultManager] fileExistsAtPath:path]) {
        if (completion) {
            completion(path);
        }
        return;
    }
    [self writeVideoWithSize:size color:color atPath:path completion:^(BOOL success) {
        if (success) {
            if (completion) {
                completion(path);
            }
        } else {
            if (completion) {
                completion(nil);
            }
        }
    }];
}

+ (void)writeVideoWithSize:(CGSize)size color:(UIColor *)color atPath:(NSString *)path completion:(void(^)(BOOL success))completion {
    NSError *error = nil;
    unlink([path UTF8String]);
    NSURL *url = [NSURL fileURLWithPath:path];
    AVAssetWriter *writer = [[AVAssetWriter alloc] initWithURL:url fileType:AVFileTypeQuickTimeMovie error:&error];
    if (error != nil) {
        completion(NO);
    }
    AVAssetWriterInput *input = [AVAssetWriterInput assetWriterInputWithMediaType:AVMediaTypeVideo
                                                                   outputSettings:@{
        AVVideoCodecKey : AVVideoCodecH264,
        AVVideoWidthKey : @(size.width),
        AVVideoHeightKey : @(size.height),
    }];
    NSDictionary *attributes = [NSDictionary dictionaryWithObjectsAndKeys:@(kCVPixelFormatType_32ARGB), kCVPixelBufferPixelFormatTypeKey, nil];
    AVAssetWriterInputPixelBufferAdaptor *adaptor = nil;
    adaptor = [AVAssetWriterInputPixelBufferAdaptor assetWriterInputPixelBufferAdaptorWithAssetWriterInput:input sourcePixelBufferAttributes:attributes];
    if (![writer canAddInput:input]) {
        completion(NO);
    }
    [writer addInput:input];
    [writer startWriting];
    [writer startSessionAtSourceTime:kCMTimeZero];
    
    __block BOOL writeDone = NO;
    dispatch_queue_t queue = dispatch_queue_create("com.bytedance.bdl.WriterInputQueue", DISPATCH_QUEUE_SERIAL);
    [input requestMediaDataWhenReadyOnQueue:queue usingBlock:^{
        while ([input isReadyForMoreMediaData]) {
            if (writeDone) {
                [input markAsFinished];
                [writer finishWritingWithCompletionHandler:^{
                    bdl_dispatch_main_async(^{
                        completion(YES);
                    });
                }];
                break;
            }
            UIImage *image = [UIImage bdl_imageWithColor:color size:size];
            CVPixelBufferRef buffer = [BDLUtils pixelBufferFromCGImage:[image CGImage]];
            if (buffer != NULL) {
                if ([adaptor appendPixelBuffer:buffer withPresentationTime:CMTimeMake(1000000, 1)]) {
                    writeDone = YES;
                }
                CFRelease(buffer);
            }
        }
    }];
}

@end
