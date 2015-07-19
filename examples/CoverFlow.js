/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    PanResponder
    } = React;
var Dimensions = require('Dimensions');
var Easing = require('Easing');
var Interpolation = require('Interpolation');
var { width, height } = Dimensions.get('window');
var MatrixMath = require('MatrixMath');

var THREE = require('three');

var IMAGES = [
    require('image!0-cnn1'),
    require('image!1-facebook1'),
    require('image!2-facebook2'),
    require('image!3-flipboard1'),
    require('image!4-flipboard2'),
    require('image!5-messenger1'),
    require('image!6-nyt1'),
    require('image!7-pages1'),
    require('image!8-vine1')
];
// http://codepen.io/anon/pen/ZGjvwo?editors=011
// http://www.eleqtriq.com/2010/05/css-3d-matrix-transformations/

function matrix3d() {
    return Array.prototype.slice.call(arguments,0);
}

function toRadians(degree) {
    return degree * (Math.PI/180);
}
function toDegrees(radians) {
    return radians * (180/Math.PI);
}
function compose(args) {
    var result = new THREE.Matrix4();
    for (var i = 0; i < args.length; i ++) {
        result = result.multiply(args[i]);
    }
    return result;
}
function M() {
    return new THREE.Matrix4();
}
function V(x,y,z) {
    return new THREE.Vector3(x,y,z)
}
function Q() {
    return new THREE.Quaternion();
}

var T = compose([
    //M().makeTranslation(0,0,100),
    //M().makeRotationY(toRadians(45)),
    //M().makeTranslation(-100, 0, 0),
    //M().makeOrthographic(-10, 10, 4, -4,-1,1),
    //M().makeRotationY(toRadians(45)),
    //M().makeRotationFromQuaternion(Q().setFromRotationMatrix(M().makeRotationZ(toRadians(45)))),
    //M().makePerspective(45, 1, 0.1, 100),
    //M().makeScale(1,2,0),
    //M().scale(V(1, 1, 0)),
    M()
]);


var t = [].slice.call(T.elements,0);

/*
matrix3d(
        scaleX,           +0.0,            +0.0,          rotateY,
          +0.0,         scaleY,            +0.0,          rotateX,
          +0.0,           +0.0,            +1.0,             +0.0,
    translateX,     translateY,            +0.0,          1/scale
);

*/



var MAXROTATE = 0.0035;
var dCenter = 120;
var SPACING = 200;

var MIN = 0;
var MAX = (IMAGES.length-1) * SPACING;

var CoverFlow = React.createClass({

    getInitialState() {
        var x = new Animated.Value(0);
        return {
            x,
            translations: IMAGES.map((_,i) => x.interpolate({
                inputRange:  [ SPACING*i, SPACING*(i+1)],
                outputRange: [         0,       SPACING]
            }))
        };
    },

    componentWillMount() {
        this.responder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                this.state.x.setOffset(this.state.x._value);
                this.state.x.setValue(0);
            },
            onPanResponderMove: (_, { dx, x0 }) => {
                var x = this.state.x._offset + dx;

                if (x > MAX) {
                    x = MAX + (x - MAX) / 3;
                }
                if (x < MIN) {
                    x = MIN - (MIN - x) / 3;
                }
                x = x - this.state.x._offset;
                this.state.x.setValue(x);
            },
            onPanResponderRelease: (_, { vx, dx }) => {
                var { x } = this.state;
                x.flattenOffset();

                if (x._value < MIN) {
                    Animated.spring(x, {
                        toValue: MIN,
                        velocity: vx
                    }).start();
                } else if (x._value > MAX) {
                    Animated.spring(x, {
                        toValue: MAX,
                        velocity: vx
                    }).start();
                } else {
                    Animated.spring(x, {
                        toValue: this.closestCenter(x._value)
                    }).start(() => {
                        x.removeListener(this._listener);
                    });

                    this._listener = x.addListener(( { value } ) => {
                        if (value < MIN) {
                            x.removeListener(this._listener);
                            Animated.spring(x, {
                                toValue: MIN,
                                velocity: vx
                            }).start();
                        } else if (value > MAX) {
                            x.removeListener(this._listener);
                            Animated.spring(x, {
                                toValue: MAX,
                                velocity: vx
                            }).start();
                        }
                    });
                }
            }
        });
    },

    closestCenter(x) {
        var plus = (x % SPACING) < SPACING / 2 ? 0 : SPACING;
        return Math.floor(x / SPACING) * SPACING + plus;
    },

    render: function () {

        var { x, translations } = this.state;

        return (
            <View
                style={styles.container}
                {...this.responder.panHandlers}
                >
                {IMAGES.map((img, i) => {

                    var dx = translations[i];

                    //var scale = dx.interpolate({
                    //    inputRange:  [-dCenter-1, -dCenter,   0, dCenter, dCenter+1],
                    //    outputRange: [       1.2,      1.2, 0.8,     1.2,       1.2]
                    //});
                    //
                    //var dy = dx.interpolate({
                    //    inputRange:  [-dCenter-1, -dCenter,   0, dCenter, dCenter+1],
                    //    outputRange: [         0,        0, -30,       0,         0]
                    //});
                    //
                    //var rotate = dx.interpolate({
                    //    inputRange: [-dCenter-1, -dCenter, 0, dCenter, dCenter+1],
                    //    outputRange: [MAXROTATE, MAXROTATE, 0, -MAXROTATE, -MAXROTATE]
                    //});
                    //
                    //var transformMatrix = [
                    //    +0.01, +0.0, +0.0, rotate,
                    //    +0.0, +1.0, +0.0,   +0.0,
                    //    +0.0, +0.0, +1.0,   +0.0,
                    //      dx,   dy, +0.0,  scale
                    //];

                    var translateX = {
                        translateX: dx
                    };
                    var perspective = {
                        perspective: dx.interpolate({
                            inputRange: [-dCenter-1, -dCenter, 0, dCenter, dCenter+1],
                            outputRange: [400, 400, 100, 400, 400]
                        })
                    };
                    var translateY = {
                        translateY: dx.interpolate({
                            inputRange:  [-dCenter-1, -dCenter,   0, dCenter, dCenter+1],
                            outputRange: [         0,        0, -10,       0,         0]
                        })
                    };
                    var scale = {
                        scale: dx.interpolate({
                            inputRange:  [-dCenter-1, -dCenter,   0, dCenter, dCenter+1],
                            outputRange: [         1,        1, 1.6,       1,         1]
                        })
                    };
                    var rotateY = {
                        rotateY: dx.interpolate({
                            inputRange:  [-dCenter-1, -dCenter,      0,  dCenter, dCenter+1],
                            outputRange: [   '35deg',  '35deg', '0deg', '-35deg',  '-35deg']
                        })
                    };

                    return (
                        <Animated.Image
                            key={i}
                            style={[styles.image, {
                                transform: [ perspective, translateX, translateY, scale, rotateY ]
                            }]}
                            source={img} />
                    );
                })}

            </View>
        );
    }
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#2e2f31',
        padding: 30
    },
    image: {
        position: 'absolute',
        top: (width - 200) / 2,
        left: (height - 200) / 2,
        width: 200,
        height: 200,
        resizeMode: 'cover'
    }
});

module.exports = CoverFlow;
