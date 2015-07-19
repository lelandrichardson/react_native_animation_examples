var React = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    } = React;

var Icon = require('./Icon');

var ListItem = React.createClass({

    render: function () {
        var { item } = this.props;
        return (
            <View style={styles.container}>
                <Icon
                    color={item.color}
                    flutter={1}
                    />
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                <View style={styles.info}>
                </View>
            </View>
        );
    }
});


var styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 17,
    },
    title: {
        color: '#434343',
        fontWeight: 'bold',
        fontSize: 16
    },
    time: {
        color: '#777',
        fontSize: 14
    },
    info: {
        width: 16,
        height: 16,
        backgroundColor: '#cbcbcf',
        borderRadius: 8,
        marginHorizontal: 20,
    }
});

module.exports = ListItem;
