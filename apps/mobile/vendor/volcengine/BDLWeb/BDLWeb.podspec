#
# Be sure to run `pod lib lint BDLWeb.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see https://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'BDLWeb'
  s.version          = '1.0.0'
  s.summary          = 'BDLWeb'
  s.homepage         = 'https://www.volcengine.com/product/live-saas'
  s.author           = { 'volcengine' => 'service@volcengine.com' }
  s.source           = { :git => 'URL_ADDRESS', :tag => s.version.to_s }

  s.ios.deployment_target = '11.0'

  s.source_files = 'BDLWeb/**/*.{h,m}'
  s.public_header_files = 'BDLWeb/**/*.h'

  s.dependency 'YYModel'
  s.dependency 'Masonry'
  s.resource_bundles = {
    'BDLWebImageResource' => ['Resources/BDLWeb.xcassets'],
  }
end
