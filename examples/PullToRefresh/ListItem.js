var React = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Animated,
    } = React;

var Icon = require('./Icon');

var ListItem = React.createClass({

    render: function () {
        var { item } = this.props;
        var { loading, inserting, flutter } = item;

        return (
            <Animated.View style={[styles.container, {
                height: inserting.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 74]
                }),
                paddingVertical: inserting.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 17]
                })
            }]}>
                <Icon
                    color={item.color}
                    name={item.icon}
                    flutter={flutter}
                    />
                <Animated.View style={[{ flexDirection: 'row', flex: 1}, {
                    transform: [
                        {
                            rotateY: loading.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['90deg', '0deg']
                            }),
                        }
                    ],
                    transformOrigin: { x: -143 }
                }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.time}>{item.time}</Text>
                    </View>
                    <View style={styles.info} />
                </Animated.View>
            </Animated.View>
        );
    }
});


var styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        //paddingVertical: 17,
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
