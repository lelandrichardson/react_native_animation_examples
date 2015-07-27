var React = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Animated,
    } = React;

var Card = React.createClass({
    render: function () {
        var { card } = this.props;
        return (
            <View style={[styles.container, this.props.style]}>
                <View>
                    <Text>{card.title}</Text>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 14,
    }
});

module.exports = Card;