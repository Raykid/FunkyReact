import * as tslib_1 from "tslib";
import React from 'react';
import { Text, View } from 'react-native';
import BaseScene from '../src/components/Scene/BaseScene';
import { MediatorClass } from '../src/mvc/Mediator';
import { createStyleSheet } from '../src/utils/NativeUtil';
var Landing = /** @class */ (function (_super) {
    tslib_1.__extends(Landing, _super);
    function Landing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Landing.prototype.render = function () {
        return React.createElement(View, { style: styles.root },
            React.createElement(Text, null, "Hello Funky React!"));
    };
    Landing = tslib_1.__decorate([
        MediatorClass("/landing")
    ], Landing);
    return Landing;
}(BaseScene));
export default Landing;
var styles = createStyleSheet({
    root: {
        width: "100%",
        height: "100%",
    },
});
//# sourceMappingURL=Landing.js.map