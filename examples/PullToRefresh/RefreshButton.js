var React = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Animated,
    PropTypes,
    TouchableOpacity,
    } = React;

var RefreshButton = React.createClass({
    propTypes: {
        stretch: PropTypes.any, // Animated
        onClick: PropTypes.func,
    },
    render: function () {
        var { stretch, onClick } = this.props;
        return (
            <TouchableOpacity onPress={onClick}>
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
                    <Text style={styles.icon}>W</Text>
                </Animated.View>
            </TouchableOpacity>
        );
    }
});

var SIZE = 58;

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
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    }
});

module.exports = RefreshButton;