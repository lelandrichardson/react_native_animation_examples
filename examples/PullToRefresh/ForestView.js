var React = require('react-native');
var {
    StyleSheet,
    View,
    } = React;

var ForestView = React.createClass({
    render: function () {
        return (
            <View style={styles.container}>
                <View style={[styles.backGround]} />
                <View style={[styles.middleGround]} />
                <View style={[styles.foreGround]} />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#7dcfcb',
        height: 162
    },

    foreGround: {
        position: 'absolute',
        height: 30,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#3e6175',
    },
    middleGround: {
        position: 'absolute',
        height: 50,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#378e9a',
    },
    backGround: {
        position: 'absolute',
        height: 80,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#86d7d7',
    },
});

module.exports = ForestView;