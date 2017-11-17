# graphapi-demo
Post to facebook using Graph API

## Create Facebook App
[Facebook for Developers](https://developers.facebook.com/)

1. Add New App
2. Add Product
  -> Facebook Login
    -> Web
3. Settings
  Set Site URL and App Domain to be http://localhost:5000, or whatever you use for development. This project's default server.js are using localhost:5000
4. Set App id to views/fb_sdk.js
5. App Review
  Don't make your app public before you want it searchable for everyone

## Graph API Explorer
[Graph API Explorer - Facebook for Developers](https://developers.facebook.com/tools/explorer)

Select your app and press Get Token -> Get User Access Token
You need
* manage_pages
* publish_pages
