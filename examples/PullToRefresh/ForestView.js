var React = require('react-native');
var {
    StyleSheet,
    View,
    Animated,
    PropTypes,
    } = React;

var ForestView = React.createClass({
    propTypes: {
        stretch: PropTypes.any, // Animated
    },
    render: function () {
        var { stretch } = this.props;
        return (
            <View style={styles.window}>
                <View style={styles.container}>
                    <Animated.View style={[styles.backGround, {
                        transform: [
                            {
                                translateY: stretch.interpolate({
                                    inputRange: [0, 0.2, 0.8, 2],
                                    outputRange: [0, 0, 10, 20]
                                })
                            }
                        ]
                    }]}>
                        <View style={styles.bgHills1} />
                        <View style={styles.bgHills2} />
                    </Animated.View>
                    <Animated.View style={[styles.middleGround, {
                        transform: [
                            {
                                translateY: stretch.interpolate({
                                    inputRange: [0, 0.2, 0.8, 2],
                                    outputRange: [0, 0, 30, 40]
                                })
                            }
                        ]
                    }]}>
                        <View style={styles.mgHills1} />
                        <View style={styles.mgHills2} />
                    </Animated.View>
                    <Animated.View style={[styles.foreGround, {
                        transform: [
                            {
                                translateY: stretch.interpolate({
                                    inputRange: [0, 0.2, 0.8, 2],
                                    outputRange: [0, 0, 50, 60]
                                })
                            }
                        ]
                    }]}>
                        <View style={styles.fgHills} />
                    </Animated.View>
                </View>
            </View>
        );
    }
});

var WINDOW_HEIGHT = 180;
var OVERALL_HEIGHT = 600;
var OFFSET_HEIGHT = 300;

var styles = StyleSheet.create({
    window: {
        height: 180,
        overflow: 'visible',
        position: 'absolute',
        top: 1,
        left: 0,
        right: 0,
    },
    container: {
        position: 'absolute',
        bottom: -OFFSET_HEIGHT,
        left: 0,
        right: 0,
        backgroundColor: '#7dcfcb',
        height: OVERALL_HEIGHT,
    },
    foreGround: {
        //opacity: 0,
        position: 'absolute',
        height: OFFSET_HEIGHT + 30,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#3e6175',
    },
    fgHills: {
        position: 'absolute',
        top: -8,
        left: 320,
        backgroundColor: '#3e6175',
        height: 30,
        width: 30,
        transformMatrix: [
              +10.0,           -1.0,            +0.0,          0.00,
              +14.0,           +1.0,            +0.0,          0.00,
              +0.0,           +0.0,            +1.0,             +0.0,
              +0.0,           +0.0,            +0.0,            1/1.00
        ]
    },
    middleGround: {
        position: 'absolute',
        height: OFFSET_HEIGHT + 30,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#378e9a',
    },
    mgHills1: {
        position: 'absolute',
        top: -3,
        left: 0,
        backgroundColor: '#378e9a',
        height: 30,
        width: 30,
        transformMatrix: [
            +12.0,          -1.8,            +0.0,          0.00,
            +5.0,           +1.0,            +0.0,          0.00,
            +0.0,           +0.0,            +1.0,             +0.0,
            +0.0,           +0.0,            +0.0,            1/1.00
        ]
    },
    mgHills2: {
        position: 'absolute',
        top: 25,
        left: 330,
        backgroundColor: '#378e9a',
        height: 30,
        width: 30,
        transformMatrix: [
            +4.0,           -2.0,            +0.0,          0.00,
            +4.0,           +3.0,            +0.0,          0.00,
            +0.0,           +0.0,            +1.0,             +0.0,
            +0.0,           +0.0,            +0.0,            1/1.00
        ]
    },
    backGround: {
        position: 'absolute',
        height: OFFSET_HEIGHT + 40,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#86d7d7',
    },
    bgHills1: {
        position: 'absolute',
        top: 20,
        left: -10,
        backgroundColor: '#86d7d7',
        height: 30,
        width: 30,
        transformMatrix: [
            +12.0,          -4.0,            +0.0,          0.00,
            +4.0,           +2.0,            +0.0,          0.00,
            +0.0,           +0.0,            +1.0,             +0.0,
            +0.0,           +0.0,            +0.0,            1/1.00
        ]
    },
    bgHills2: {
        position: 'absolute',
        top: 60,
        left: 180,
        backgroundColor: '#86d7d7',
        height: 30,
        width: 30,
        transformMatrix: [
            +14.0,           -5.0,            +0.0,          0.00,
            +4.0,           +3.0,            +0.0,          0.00,
            +0.0,           +0.0,            +1.0,             +0.0,
            +0.0,           +0.0,            +0.0,            1/1.00
        ]
    },
});

module.exports = ForestView;