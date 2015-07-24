var React = require('react-native');
var {
    StyleSheet,
    View,
    Animated,
    } = React;
var { Icon } = require('react-native-icons');

var { width, height } = require('Dimensions').get('window');
var Easing = require('Easing');

var frames = (anim, outputRange, easing) => anim.interpolate({
    inputRange: KEYFRAMES,
    outputRange,
    easing
});

var WIDTH = width;
var HEIGHT = 180;
var easing = Easing.bezier(.42,.74,.57,.85, (1000 / 60 / 4000) / 4);
var easingX = Easing.bezier(.78,.68,.57,.85, (1000 / 60 / 4000) / 4);

var KEYFRAMES = [
    0.00, // <SwipeRight>
    0.20, // </SwipeRight><OffScreen>
    0.40, // </OffScreen><SwipeLeft>
    0.70, // </SwipeLeft><OffScreen>
    0.85, // </OffScreen><SlideIn>
    1.00, // </SlideIn>
];

var LoadingAirplane = React.createClass({
    render: function () {
        var { loading } = this.props;

        var translateY = frames(loading, [
            HEIGHT * -0.00, // <SwipeRight>
            HEIGHT * -0.90, // </SwipeRight><OffScreen>
            HEIGHT * -0.60, // </OffScreen><SwipeLeft>
            HEIGHT * -0.20, // </SwipeLeft><OffScreen>
            HEIGHT * -0.00, // </OffScreen><SlideIn>
            HEIGHT * -0.00, // </SlideIn>
        ], easing);

        var translateX = frames(loading, [
            WIDTH * 0.10, // <SwipeRight>
            WIDTH * 1.10, // </SwipeRight><OffScreen>
            WIDTH * 1.10, // </OffScreen><SwipeLeft>
                    -100, // </SwipeLeft><OffScreen>
                    -100, // </OffScreen><SlideIn>
            WIDTH * 0.10, // </SlideIn>
        ], easing);

        var scale = frames(loading, [
            1.00, // <SwipeRight>
            0.30, // </SwipeRight><OffScreen>
            0.50, // </OffScreen><SwipeLeft>
            0.80, // </SwipeLeft><OffScreen>
            1.00, // </OffScreen><SlideIn>
            1.00, // </SlideIn>
        ], easing);

        var rotateZ = frames(loading, [
            '-45deg', // <SwipeRight>
            '0deg', // </SwipeRight><OffScreen>
            '170deg', // </OffScreen><SwipeLeft>
            '180deg', // </SwipeLeft><OffScreen>
              '0deg', // </OffScreen><SlideIn>
              '0deg', // </SlideIn>
        ]);

        return (
            <Animated.View
                style={[
                    styles.container, {
                        transform: [
                            { translateY },
                            { translateX },
                            { scale },
                            { rotateZ }
                        ]
                    }
                ]}
            >
                <Icon
                    name="ion|ios-paperplane"
                    size={50}
                    color="#ffffff"
                    style={styles.icon}
                    />
            </Animated.View>
        );
    }
});
var ICON_SIZE = 40;
var SIZE = 30;

var styles = StyleSheet.create({
    container: {
        width: ICON_SIZE,
        height: ICON_SIZE,
        position: 'absolute',
        backgroundColor: 'transparent',
        top: 180,
        left: 6,
        marginTop: -ICON_SIZE / 2,
        marginLeft: -ICON_SIZE / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: ICON_SIZE,
        height: ICON_SIZE,
        backgroundColor: 'transparent',
        transform: [
            { rotateZ: '40deg'}
        ]
    }
});

module.exports = LoadingAirplane;