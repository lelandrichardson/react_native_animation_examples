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
                    }]} />
                    <Animated.View style={[styles.middleGround, {
                        transform: [
                            {
                                translateY: stretch.interpolate({
                                    inputRange: [0, 0.2, 0.8, 2],
                                    outputRange: [0, 0, 30, 40]
                                })
                            }
                        ]
                    }]} />
                    <Animated.View style={[styles.foreGround, {
                        transform: [
                            {
                                translateY: stretch.interpolate({
                                    inputRange: [0, 0.2, 0.8, 2],
                                    outputRange: [0, 0, 50, 60]
                                })
                            }
                        ]
                    }]} />
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
        position: 'absolute',
        height: OFFSET_HEIGHT + 30,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#3e6175',
    },
    middleGround: {
        position: 'absolute',
        height: OFFSET_HEIGHT + 50,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#378e9a',
    },
    backGround: {
        position: 'absolute',
        height: OFFSET_HEIGHT + 70,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#86d7d7',
    },
});

module.exports = ForestView;