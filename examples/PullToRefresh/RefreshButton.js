var React = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Animated,
    PropTypes,
    TouchableOpacity,
    } = React;
var { Icon } = require('react-native-icons');

var RefreshButton = React.createClass({
    propTypes: {
        stretch: PropTypes.any, // Animated
        onPress: PropTypes.func,
    },
    render: function () {
        var { stretch, onPress,isLoading } = this.props;
        return (
            <TouchableOpacity onPress={onPress}>
                <Animated.View style={[styles.button, {
                    transform: [
                        {
                            rotateZ: stretch.interpolate({
                                inputRange: [0, 1, 2],
                                outputRange: ['0deg','-45deg', '-45deg']
                            })
                        }
                    ]
                }]}>
                    {!isLoading && <Icon
                        name="ion|ios-paperplane"
                        size={50}
                        color="#ffffff"
                        style={styles.icon}
                        />}
                </Animated.View>
            </TouchableOpacity>
        );
    }
});

var SIZE = 58;
var ICON_SIZE = 40;

var styles = StyleSheet.create({
    button: {
        position: 'absolute',
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        marginTop: - SIZE / 2,
        top: 0,
        marginLeft: 16,
        backgroundColor: '#5db2df',
        overflow: 'visible',
        shadowRadius: 3,
        shadowOpacity: 0.8,
        shadowColor: '#333',
        shadowOffset: { x: 0, y: 0 },
        justifyContent: 'center',
        alignItems: 'center'
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

module.exports = RefreshButton;