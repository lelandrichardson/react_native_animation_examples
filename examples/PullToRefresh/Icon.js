var React = require('react-native');
var {
    StyleSheet,
    View,
    Animated,
    PropTypes,
    } = React;

var Icon = React.createClass({
    propTypes: {
        color: PropTypes.string,
        flutter: PropTypes.any, // Animated | Number
    },
    render: function () {
        var { flutter } = this.props;
        return (
            <Animated.View
                style={[
                    styles.container,
                    {
                        backgroundColor: this.props.color,
                        transform: [{
                                rotateX: flutter.interpolate({
                                    inputRange: [0, 0.8, 1, 1.2],
                                    outputRange: ['90deg', '15deg', '0deg', '-15deg']
                                })
                            }, {
                                rotateY: flutter.interpolate({
                                    inputRange: [0, 0.8, 1, 1.2],
                                    outputRange: ['0deg', '5deg', '0deg', '-5deg']
                                })
                            }
                        ]
                    }
                ]}>
            </Animated.View>
        );
    }
});

var SIZE = 40;

var styles = StyleSheet.create({
    container: {
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        marginHorizontal: 25,
        //TODO: shadow
    }
});

module.exports = Icon;