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

var PanController = require('../PanController');

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
            translations: IMAGES.map((_, i) => x.interpolate({
                inputRange:  [ SPACING*i, SPACING*(i+1)],
                outputRange: [         0,       SPACING]
            }))
        };
    },

    componentWillMount() {
        this.responder = PanResponder.create({
            //onStartShouldSetPanResponder: () => true,
            //onMoveShouldSetPanResponder: () => true,
            //onPanResponderGrant: () => {
            //    this.state.x.setOffset(this.state.x._value);
            //    this.state.x.setValue(0);
            //},
            //onPanResponderMove: (_, { dx, x0 }) => {
            //    var x = this.state.x._offset + dx;
            //
            //    if (x > MAX) {
            //        x = MAX + (x - MAX) / 3;
            //    }
            //    if (x < MIN) {
            //        x = MIN - (MIN - x) / 3;
            //    }
            //    x = x - this.state.x._offset;
            //    this.state.x.setValue(x);
            //},
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

                    var endX = this.momentumCenter(x._value, vx);
                    endX = Math.max(endX, MIN);
                    endX = Math.min(endX, MAX);
                    var bounds = [endX-SPACING/2, endX+SPACING/2];
                    var endV = this.velocityAtBounds(x._value, vx, bounds);

                    this._listener = x.addListener(( { value } ) => {
                        if (value > bounds[0] && value < bounds[1]) {
                            Animated.spring(x, {
                                toValue: endX,
                                velocity: endV
                            }).start();
                        }
                    });

                    Animated.decay(x, {
                        velocity: vx
                    }).start(()=> {
                        x.removeListener(this._listener);
                    });
                }
            }
        });
    },

    closestCenter(x) {
        var plus = (x % SPACING) < SPACING / 2 ? 0 : SPACING;
        return Math.floor(x / SPACING) * SPACING + plus;
    },

    momentumCenter(x0, vx) {
        var t = 0;
        var deceleration = 0.997;
        var x1 = x0;
        var x = x1;

        while (true) {
            t += 16;
            x = x0 + (vx / (1 - deceleration)) *
                (1 - Math.exp(-(1 - deceleration) * t));
            if (Math.abs(x-x1) < 0.1) {
                x1 = x;
                break;
            }
            x1 = x;
        }
        return this.closestCenter(x1);
    },

    velocityAtBounds(x0, vx, bounds) {
        var t = 0;
        var deceleration = 0.997;
        var x1 = x0;
        var x = x1;
        var vf;
        while (true) {
            t += 16;
            x = x0 + (vx / (1 - deceleration)) *
                (1 - Math.exp(-(1 - deceleration) * t));
            vf = (x-x1) / 16;
            if (x > bounds[0] && x < bounds[1]) {
                break;
            }
            if (Math.abs(vf) < 0.1) {
                break;
            }
            x1 = x;
        }
        return vf;
    },

    render: function () {

        var { x, translations } = this.state;

        return (
            <PanController
                style={styles.container}
                allowX={true}
                allowY={false}
                overshootX="spring"
                xBounds={[MIN, MAX]}
                panX={x}
                >
                {IMAGES.map((img, i) => {

                    var dx = translations[i];

                    var translateX = dx;
                    var perspective = dx.interpolate({
                        inputRange: [-dCenter-1, -dCenter, 0, dCenter, dCenter+1],
                        outputRange: [400, 400, 100, 400, 400]
                    });
                    var translateY = dx.interpolate({
                        inputRange:  [-dCenter-1, -dCenter,   0, dCenter, dCenter+1],
                        outputRange: [         0,        0, -10,       0,         0]
                    });
                    var scale = dx.interpolate({
                        inputRange:  [-dCenter-1, -dCenter,   0, dCenter, dCenter+1],
                        outputRange: [         1,        1, 1.6,       1,         1]
                    });
                    var rotateY = dx.interpolate({
                        inputRange:  [-dCenter-1, -dCenter,      0,  dCenter, dCenter+1],
                        outputRange: [   '35deg',  '35deg', '0deg', '-35deg',  '-35deg']
                    });

                    return (
                        <Animated.Image
                            key={i}
                            style={[styles.image, {
                                transform: [
                                    {perspective},
                                    {translateX},
                                    {translateY},
                                    {scale},
                                    {rotateY},
                                ],
                            }]}
                            source={img} />
                    );
                })}
            </PanController>
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
