/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    Animated,
    ScrollView
    } = React;
var Dimensions = require('Dimensions');
var Easing = require('Easing');
var Interpolation = require('Interpolation');
var { width, height } = Dimensions.get('window');
var ListItem = require('./ListItem');
var ForestView = require('./ForestView');
var RefreshButton = require('./RefreshButton');


var ITEMS = [
    {
        id: 1,
        icon: "list",
        color: "#6da2ff",
        title: "Meeting Minutes",
        time: "Mar 9, 2015"
    },
    {
        id: 2,
        icon: "folder",
        color: "#cbcbcf",
        title: "Favorite Photos",
        time: "Feb 3, 2015"
    },
    {
        id: 3,
        icon: "folder",
        color: "#cbcbcf",
        title: "Photos",
        time: "Jan 9, 2014"
    },
];

var ITEM_TO_ADD = {
    id: 4,
    icon: "window",
    color: "#fdc56d",
    title: "Magic Cube Show",
    time: "Mar 15, 2015"
};

var PullToRefresh = React.createClass({

    getInitialState() {
        var scroll = new Animated.Value(0);
        return {
            scroll
        };
    },

    componentWillMount() {

    },

    render: function () {

        var { scroll } = this.state;

        return (
            <ScrollView
                contentInset={{ top: 0 }}
                style={styles.container}
                contentContainerStyle={styles.content}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scroll }}}])}>
                <ForestView />
                <View>
                    <View style={styles.listContainer}>
                        {ITEMS.map(item => (
                            <ListItem key={item.id} item={item} />
                        ))}
                    </View>
                    <RefreshButton />
                </View>
            </ScrollView>
        );
    }
});


var styles = StyleSheet.create({
    container: {
        backgroundColor: '#7dcfcb',
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContainer: {
        backgroundColor: '#fff',
        paddingTop: 44,
    }
});

module.exports = PullToRefresh;
