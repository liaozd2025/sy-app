/* eslint-disable max-lines-per-function */
const fs = require('node:fs');
const path = require('node:path');

const {
  createRunOncePlugin,
  withDangerousMod,
  withInfoPlist,
  withPodfile,
  withXcodeProject,
} = require('@expo/config-plugins');

const pkg = require('../package.json');

const POD_LINE = '  pod \'BDLWeb\', :path => \'./BDLWeb\'';
const MODULE_HEADER_PATH = 'app/YXBDLLiveModule.h';
const MODULE_SOURCE_PATH = 'app/YXBDLLiveModule.m';

function withVolcengineBDLWeb(config) {
  config = withInfoPlist(config, updateInfoPlist);
  config = withPodfile(config, updatePodfile);
  config = withXcodeProject(config, updateXcodeProject);
  config = withDangerousMod(config, ['ios', syncNativeFiles]);

  return config;
}

function updateInfoPlist(config) {
  const backgroundModes = new Set(config.modResults.UIBackgroundModes ?? []);
  backgroundModes.add('audio');

  config.modResults.UIBackgroundModes = [...backgroundModes];
  config.modResults.UISupportedInterfaceOrientations = [
    'UIInterfaceOrientationPortrait',
    'UIInterfaceOrientationLandscapeLeft',
    'UIInterfaceOrientationLandscapeRight',
  ];

  return config;
}

function updatePodfile(config) {
  config.modResults.contents = addBDLWebPod(config.modResults.contents);
  return config;
}

function addBDLWebPod(contents) {
  if (contents.includes('pod \'BDLWeb\'')) {
    return contents;
  }

  const expoModulesAnchor = '  use_expo_modules!\n';
  if (contents.includes(expoModulesAnchor)) {
    return contents.replace(expoModulesAnchor, `${expoModulesAnchor}\n${POD_LINE}\n`);
  }

  return contents.replace(/target ['"]app['"] do\n/, match => `${match}${POD_LINE}\n`);
}

function updateXcodeProject(config) {
  const project = config.modResults;
  const appGroupUuid = findAppGroupUuid(project);
  const targetUuid = project.getFirstTarget().uuid;

  if (!project.hasFile(MODULE_HEADER_PATH)) {
    project.addHeaderFile(MODULE_HEADER_PATH, {}, appGroupUuid);
  }

  if (!project.hasFile(MODULE_SOURCE_PATH)) {
    project.addSourceFile(MODULE_SOURCE_PATH, { target: targetUuid }, appGroupUuid);
  }

  return config;
}

function findAppGroupUuid(project) {
  const groups = project.hash.project.objects.PBXGroup ?? {};
  const entry = Object.entries(groups).find(([, group]) => (
    group?.isa === 'PBXGroup'
    && group.name === 'app'
    && group.children?.some(child => child.comment === 'Info.plist')
  ));

  if (!entry) {
    throw new Error('Unable to find the iOS app group in the Xcode project.');
  }

  return entry[0];
}

function syncNativeFiles(config) {
  const projectRoot = config.modRequest.projectRoot;
  const iosRoot = config.modRequest.platformProjectRoot;

  copyBDLWeb(projectRoot, iosRoot);
  writeModuleFiles(iosRoot);

  return config;
}

function copyBDLWeb(projectRoot, iosRoot) {
  const source = path.join(projectRoot, 'vendor/volcengine/BDLWeb');
  const destination = path.join(iosRoot, 'BDLWeb');

  if (!fs.existsSync(source)) {
    throw new Error(`Missing Volcengine BDLWeb source at ${source}`);
  }

  fs.rmSync(destination, { force: true, recursive: true });
  fs.cpSync(source, destination, { recursive: true });
  removeDSStore(destination);
}

function removeDSStore(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      removeDSStore(fullPath);
      continue;
    }

    if (entry.name === '.DS_Store') {
      fs.rmSync(fullPath, { force: true });
    }
  }
}

function writeModuleFiles(iosRoot) {
  const appRoot = path.join(iosRoot, 'app');
  fs.mkdirSync(appRoot, { recursive: true });
  fs.writeFileSync(path.join(appRoot, 'YXBDLLiveModule.h'), getModuleHeader());
  fs.writeFileSync(path.join(appRoot, 'YXBDLLiveModule.m'), getModuleImplementation());
}

function getModuleHeader() {
  return `#import <React/RCTBridgeModule.h>

@interface YXBDLLiveModule : NSObject <RCTBridgeModule>

@end
`;
}

function getModuleImplementation() {
  return `#import "YXBDLLiveModule.h"

#import <BDLWeb/BDLSettings.h>
#import <BDLWeb/BDLWebViewController.h>
#import <React/RCTUtils.h>
#import <WebKit/WebKit.h>

@interface YXBDLExternalWebViewController : UIViewController

- (instancetype)initWithRequest:(NSURLRequest *)request;

@end

@implementation YXBDLExternalWebViewController {
  NSURLRequest *_request;
  WKWebView *_webView;
}

- (instancetype)initWithRequest:(NSURLRequest *)request
{
  self = [super init];
  if (self) {
    _request = request;
  }
  return self;
}

- (void)viewDidLoad
{
  [super viewDidLoad];

  self.view.backgroundColor = UIColor.whiteColor;

  WKWebViewConfiguration *configuration = [[WKWebViewConfiguration alloc] init];
  if (@available(iOS 13.0, *)) {
    WKWebpagePreferences *preferences = [[WKWebpagePreferences alloc] init];
    preferences.preferredContentMode = WKContentModeMobile;
    configuration.defaultWebpagePreferences = preferences;
  }

  _webView = [[WKWebView alloc] initWithFrame:CGRectZero configuration:configuration];
  _webView.translatesAutoresizingMaskIntoConstraints = NO;
  _webView.scrollView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
  [self.view addSubview:_webView];

  UILayoutGuide *safeArea = self.view.safeAreaLayoutGuide;
  [NSLayoutConstraint activateConstraints:@[
    [_webView.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor],
    [_webView.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor],
    [_webView.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor],
    [_webView.topAnchor constraintEqualToAnchor:safeArea.topAnchor],
  ]];

  [_webView loadRequest:_request];
}

@end

@interface YXBDLLiveHostViewController : UIViewController

@end

@implementation YXBDLLiveHostViewController

- (void)viewDidLoad
{
  [super viewDidLoad];
  self.view.backgroundColor = UIColor.whiteColor;
}

@end

@interface YXBDLLiveModule () <BDLWebViewControllerDelegate, UINavigationControllerDelegate>

@property (nonatomic, copy) NSString *currentURL;
@property (nonatomic, strong) YXBDLLiveHostViewController *hostViewController;
@property (nonatomic, strong) UINavigationController *liveNavigationController;
@property (nonatomic, strong) BDLWebViewController *webViewController;

@end

@implementation YXBDLLiveModule

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXPORT_METHOD(openLiveRoom:(NSString *)url
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSURL *parsedURL = [NSURL URLWithString:url ?: @""];
    if (!parsedURL || parsedURL.scheme.length == 0 || parsedURL.host.length == 0) {
      reject(@"invalid_live_url", @"直播地址无效", nil);
      return;
    }

    [self configureBDLSettings];
    [self ensureWebViewController];

    if (![url isEqualToString:self.currentURL]) {
      [self.webViewController loadURLStr:url];
      self.currentURL = [url copy];
    }

    [self presentLiveRoomWithCompletion:^{
      resolve(@YES);
    }];
  });
}

- (void)configureBDLSettings
{
  BDLSettings.sharedInstance.pipType = BDLSettingPiPTypeInAppAndSystemPiP;
  BDLSettings.sharedInstance.enableAutoPlay = YES;
  BDLSettings.sharedInstance.fullscreenBtnType = BDLSettingsFullscreenBtnTypeRotate;
}

- (void)ensureWebViewController
{
  if (self.webViewController) {
    return;
  }

  self.webViewController = [[BDLWebViewController alloc] init];
  self.webViewController.modalPresentationStyle = UIModalPresentationFullScreen;
  self.webViewController.delegate = self;
}

- (void)presentLiveRoomWithCompletion:(void (^)(void))completion
{
  if (self.liveNavigationController.presentingViewController) {
    [self showWebViewControllerInCurrentNavigation];
    if (completion) {
      completion();
    }
    return;
  }

  UIViewController *presentingController = RCTPresentedViewController();
  if (!presentingController) {
    if (completion) {
      completion();
    }
    return;
  }

  self.hostViewController = [[YXBDLLiveHostViewController alloc] init];
  self.liveNavigationController = [[UINavigationController alloc] initWithRootViewController:self.hostViewController];
  self.liveNavigationController.delegate = self;
  self.liveNavigationController.modalPresentationStyle = UIModalPresentationFullScreen;
  [self.liveNavigationController pushViewController:self.webViewController animated:NO];

  [presentingController presentViewController:self.liveNavigationController animated:YES completion:completion];
}

- (void)showWebViewControllerInCurrentNavigation
{
  NSArray<UIViewController *> *viewControllers = self.liveNavigationController.viewControllers;
  if ([viewControllers containsObject:self.webViewController]) {
    [self.liveNavigationController popToViewController:self.webViewController animated:YES];
    return;
  }

  [self.liveNavigationController pushViewController:self.webViewController animated:YES];
}

- (void)dismissLiveNavigationKeepingWebView:(BOOL)keepWebView
{
  UINavigationController *navigationController = self.liveNavigationController;
  self.liveNavigationController.delegate = nil;
  self.liveNavigationController = nil;
  self.hostViewController = nil;

  if (!keepWebView) {
    self.webViewController.delegate = nil;
    self.webViewController = nil;
    self.currentURL = nil;
  }

  if (navigationController.presentingViewController) {
    [navigationController dismissViewControllerAnimated:YES completion:nil];
  }
}

#pragma mark - BDLWebViewControllerDelegate

- (void)webViewController:(BDLWebViewController *)controller floatingPlayerDidClickClose:(BDLFloatingPlayer *)floatingPlayer
{
  [self dismissLiveNavigationKeepingWebView:NO];
}

- (void)webViewController:(BDLWebViewController *)controller floatingPlayerDidSingleTap:(BDLFloatingPlayer *)floatingPlayer
{
  [self presentLiveRoomWithCompletion:nil];
}

- (void)webViewController:(BDLWebViewController *)controller onURLRequestClicked:(NSURLRequest *)urlRequest
{
  YXBDLExternalWebViewController *viewController = [[YXBDLExternalWebViewController alloc] initWithRequest:urlRequest];
  if (self.liveNavigationController.presentingViewController) {
    [self.liveNavigationController pushViewController:viewController animated:YES];
    return;
  }

  UIViewController *presentingController = RCTPresentedViewController();
  if (!presentingController) {
    return;
  }

  UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:viewController];
  navigationController.modalPresentationStyle = UIModalPresentationFullScreen;
  [presentingController presentViewController:navigationController animated:YES completion:nil];
}

- (void)webViewControllerWillLeaveLiveRoom:(BDLWebViewController *)controller
{
  [self dismissLiveNavigationKeepingWebView:NO];
}

#pragma mark - UINavigationControllerDelegate

- (void)navigationController:(UINavigationController *)navigationController
       didShowViewController:(UIViewController *)viewController
                    animated:(BOOL)animated
{
  if (viewController == self.hostViewController
      && self.webViewController
      && ![navigationController.viewControllers containsObject:self.webViewController]) {
    [self dismissLiveNavigationKeepingWebView:YES];
  }
}

@end
`;
}

module.exports = createRunOncePlugin(
  withVolcengineBDLWeb,
  'with-volcengine-bdl-web',
  pkg.version,
);
