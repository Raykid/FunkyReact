import React from 'react';
import { AppRegistry } from 'react-native';
import { reactBundle } from '../src/bundles/native/ReactBundleNative';
import App from '../src/mvc/App';
import { name as appName } from './app.json';
import Landing from './Landing';
AppRegistry.registerComponent(appName, function () { return main; });
function main(props) {
    // 返回结果
    return React.createElement(App, { bundle: reactBundle, first: Landing });
}
//# sourceMappingURL=index.js.map