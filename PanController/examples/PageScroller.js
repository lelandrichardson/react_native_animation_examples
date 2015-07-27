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

var PANES = Array(9).join("x").split("");
var easing = Easing.bezier(.56,.17,.57,.85, (1000 / 60 / 4000) / 4);


var CARDX = 240;
var CARDY = 400;
var START_TOP = 50;
var h = CARDY * 0.6;

var MIN = 240;
var MAX = 1900;

var Pane = React.createClass({
    render() {
        return (
            <Animated.Image
                style={[styles.pane, styles.paneImage, this.props.style]}
                source={IMAGES[this.props.i]} />
        );
    }
});

var PageScroller = React.createClass({

    getInitialState() {
        return {
            panY: new Animated.Value(MIN),
            panX: new Animated.Value(0),
            swipeIndex: null,
        };
    },
    direction: null,
    componentWillMount() {
        this.responder = PanResponder.create({
            //onStartShouldSetPanResponder: () => true,
            //onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                //this.state.panY.setOffset(this.state.panY.getAnimatedValue());
                //this.state.panY.setValue(0);
                this.state.panX.setValue(0);
                this.direction = null;
            },
            onPanResponderMove: (_, { dy, dx, y0 }) => {
                if (!this.direction) {
                    var dx2 = dx*dx;
                    var dy2 = dy*dy;
                    if (dx2 + dy2 > 10) {
                        this.direction = dx2 > dy2 ? 'x' : 'y';
                        if (this.direction === 'x') {
                            // set swipeIndex
                            this.setState({
                                swipeIndex: this.cardIndexFor(y0, this.state.panY._offset + dy)
                            });
                        }
                    }
                }
                if (this.direction === 'y') {
                    var y = this.state.panY._offset + dy;

                    if (y > MAX) {
                        y = MAX + (y - MAX) / 3;
                    }
                    if (y < MIN) {
                        y = MIN - (MIN - y) / 3;
                    }
                    y = y - this.state.panY._offset;
                    this.state.panY.setValue(y);
                } else {
                    this.state.panX.setValue(dx);
                }
            },
            onPanResponderRelease: (e, { vy, vx, dx, dy }) => {
                var { panY, panX } = this.state;
                panY.flattenOffset();

                if (this.direction === 'y') {

                    if (panY._value < MIN) {
                        Animated.spring(panY, {
                            toValue: MIN,
                            velocity: vy
                        }).start();
                    } else if (panY._value > MAX) {
                        Animated.spring(panY, {
                            toValue: MAX,
                            velocity: vy
                        }).start();
                    } else {
                        Animated.decay(this.state.panY, {
                            velocity: vy,
                            deceleration: 0.993
                        }).start(() => {
                            panY.removeListener(this._listener);
                        });

                        this._listener = panY.addListener(( { value } ) => {
                            if (value < MIN) {
                                panY.removeListener(this._listener);
                                Animated.spring(panY, {
                                    toValue: MIN,
                                    velocity: vy
                                }).start();
                            } else if (value > MAX) {
                                panY.removeListener(this._listener);
                                Animated.spring(panY, {
                                    toValue: MAX,
                                    velocity: vy
                                }).start();
                            }
                        });
                    }
                } else {
                    // swipe left/right done
                    var x = panX._value;
                    var i = this.state.swipeIndex;
                    if (x > 30) {
                        // to the right...
                        Animated.spring(panX, {
                            toValue: 400,
                            velocity: vx
                        }).start(() => {
                            //TODO: remove from deck
                            PANES.splice(i,1);
                            this.forceUpdate();
                        });
                    } else if (x < -30) {
                        Animated.spring(panX, {
                            toValue: -400,
                            velocity: vx
                        }).start(() => {
                            //TODO: remove from deck
                        });
                    } else {
                        Animated.spring(panX, { toValue: 0, velocity: vx }).start();
                    }
                }
                this.direction = null;
            },
        });
    },

    cardIndexFor(y0, panY) {
        var length = PANES.length;
        var result = null;
        for (var i = 0; i < length; i++) {
            var hx = h * (length - i - 1);
            var hxm = Math.max(hx-h, 0);
            // y0 is the position they started the touch on the screen
            // panY is the current animated value
            var translateY = Interpolation.create({
                inputRange: [0, hxm, hx+1, height+hx],
                outputRange: [0, 0, 10, 30 + height],
                easing: easing
            })(panY);

            var scale = Interpolation.create({
                inputRange: [0, hx+1, 0.8*height+hx, height+hx, height + hx + 1],
                outputRange: [1, 1, 1.4, 1.3, 1.3]
            })(panY);

            var cardTop = START_TOP + translateY - (scale - 1) / 2 * CARDY;

            if (cardTop < y0) {
                result = i;
            }
        }
        return result;
    },

    render: function () {
        var { panY, panX, swipeIndex } = this.state;
        return (
            <PanController
                style={styles.container}
                allowX={true}
                allowY={true}
                panX={panX}
                panY={panY}
                >
                {PANES.map((e, i) => {
                    var x = PANES.length - i - 1;
                    var hx = h * x;
                    var hxm = Math.max(hx-h, 0);

                    var translateX = i === swipeIndex && this.direction === 'x' ? panX : 0;

                    var translateY = panY.interpolate({
                        inputRange: [0, hxm, hx+1, height+hx],
                        outputRange: [0, 0, 10, 30 + height],
                        easing: easing
                    });

                    var scale = panY.interpolate({
                        inputRange: [0, hx+1, 0.8*height+hx, height+hx, height + hx + 1],
                        outputRange: [1, 1, 1.4, 1.3, 1.3]
                    });

                    return <Pane key={i} i={i} style={{
                        transform: [
                            {translateX},
                            {translateY},
                            {scale},
                        ],
                    }} />
                })}
            </PanController>
        );
    }
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2e2f31',
    },
    pane: {
        top: START_TOP,
        left: width / 2 - CARDX / 2,
        width: CARDX,
        height: CARDY,
        //borderColor: '#000',
        //borderWidth: 1,
        //backgroundColor: 'blue',
        position: 'absolute',
        //shadowColor: '#000',
        //shadowOpacity: 0.3,
        //shadowRadius: 2,
    },
    paneImage: {
        //borderColor: '#000',
        //borderWidth: 1,
        width: CARDX,
        height: CARDY,
        resizeMode: 'stretch'
    }
});

module.exports = PageScroller;
