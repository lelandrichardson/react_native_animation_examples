var React = require('react-native');
var {
    StyleSheet,
    View,
    Animated,
    PropTypes,
    } = React;
var { Icon } = require('react-native-icons');

var ListItemIcon = React.createClass({
    propTypes: {
        color: PropTypes.string,
        name: PropTypes.string.isRequired,
        flutter: PropTypes.any, // Animated | Number
    },
    render: function () {
        var { name, color, flutter } = this.props;
        return (
            <Animated.View
                style={[
                    styles.container,
                    {
                        backgroundColor: color,
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
                <Icon
                    name={`fontawesome|${name}`}
                    size={ICON_SIZE}
                    color="#fff"
                    style={styles.icon}
                    />
            </Animated.View>
        );
    }
});

var SIZE = 40;
var ICON_SIZE = 20;

var styles = StyleSheet.create({
    container: {
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        marginHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
        //TODO: shadow
    },
    icon: {
        width: ICON_SIZE,
        height: ICON_SIZE,
        backgroundColor: 'transparent',
    }
});

module.exports = ListItemIcon;