var React = require('react-native');
var {
    StyleSheet,
    View,
    } = React;

var RefreshButton = React.createClass({
    render: function () {
        return (
            <View style={styles.button}>
            </View>
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
    }
});

module.exports = RefreshButton;