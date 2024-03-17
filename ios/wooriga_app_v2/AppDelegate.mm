#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

// fcm
#import <Firebase.h>

// naver login
#import <NaverThirdPartyLogin/NaverThirdPartyLoginConnection.h>
// kakao login
#import <RNKakaoLogins.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"wooriga_app_v2";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  // added: for fcm
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  // added: for naver login (open naver app)
  [[NaverThirdPartyLoginConnection getSharedInstance] setIsNaverAppOauthEnable:YES];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

  // added: for kakao login
  if ([RNKakaoLogins isKakaoTalkLoginUrl:url]) {
    return [RNKakaoLogins handleOpenUrl: url];
  }

  // addded: for naver login
  if ([url.scheme isEqualToString:@"wooriganaver"]) {
    return [[NaverThirdPartyLoginConnection getSharedInstance] application:application openURL:url options:options];
  }
  
  // return [super application:application openURL:url options:options] || [RCTLinkingManager application:application openURL:url options:options];
  return [super application:application openURL:url options:options];
}


@end
