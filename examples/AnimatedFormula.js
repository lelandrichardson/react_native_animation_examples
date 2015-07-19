/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
    AppRegistry,
    StyleSheet,
    View,
    Animated,
    PanResponder
    } = React;
var Dimensions = require('Dimensions');
var Easing = require('Easing');
var Interpolation = require('Interpolation');
var { width, height } = Dimensions.get('window');

var AnimatedFormula = React.createClass({

    getInitialState() {
        var x = new Animated.Value(0);
        var y = new Animated.Value(0);
        return {
            x,
            y,
            distance: new Animated.Formula([x,y], (a,b) => Math.sqrt(a*a + b*b))
        };
    },

    componentWillMount() {
        this.responder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dx: this.state.x, dy: this.state.y }]),
            onPanResponderRelease: (_, { vx, vy }) => {
                var { x, y } = this.state;
                Animated.spring(x, {
                    toValue: 0,
                    velocity: vx
                }).start();
                Animated.spring(y, {
                    toValue: 0,
                    velocity: vy
                }).start();
            }
        });
    },

    render: function () {

        var { x, y, distance } = this.state;

        return (
            <View
                style={styles.container}
                {...this.responder.panHandlers}>
                <Animated.View
                    style={[styles.handle, {
                        transform: [
                            { translateX: x },
                            { translateY: y }
                        ],
                        opacity: distance.interpolate({
                            inputRange: [0, 300, 301],
                            outputRange: [1, 0.5, 0.5]
                        })
                    }]}
                    />
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
    handle: {
        position: 'absolute',
        top: (width - 200) / 2,
        left: (height - 200) / 2,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'blue',
    }
});

module.exports = AnimatedFormula;
