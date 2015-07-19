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
    {
        id: 4,
        icon: "list",
        color: "#6da2ff",
        title: "Meeting Minutes",
        time: "Mar 9, 2015"
    },
    {
        id: 5,
        icon: "folder",
        color: "#cbcbcf",
        title: "Favorite Photos",
        time: "Feb 3, 2015"
    },
    {
        id: 6,
        icon: "folder",
        color: "#cbcbcf",
        title: "Photos",
        time: "Jan 9, 2014"
    },
];

ITEMS = ITEMS.map(item => ({
    ...item,
    flutter: new Animated.Value(1),
    loading: new Animated.Value(1),
}));

var ITEM_TO_ADD = {
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

    onScroll(e) {
        this.state.scroll.setValue(e.nativeEvent.contentOffset.y);
    },

    componentWillMount() {

    },

    insertItem() {
        var newItem = {
            ...ITEM_TO_ADD,
            id: ITEMS.length + 1,
            flutter: new Animated.Value(0),
            loading: new Animated.Value(0),
        };
        ITEMS.unshift(newItem);
        Animated.spring(newItem.flutter, {
            toValue: 1,
            friction: 2,
            tension: 80,
        }).start();
        Animated.timing(newItem.loading, {
            toValue: 1,
            duration: 250
        }).start();
        this.forceUpdate();
    },

    render: function () {

        var { scroll } = this.state;

        var stretch = scroll.interpolate({
            inputRange: [-100, 0, 1],
            outputRange: [1, 0, 0]
        });

        return (
            <View style={styles.container}>
                <ForestView stretch={stretch} />
                <ScrollView
                    contentInset={{ top: -18 }}
                    style={{ backgroundColor: 'transparent', flex: 1 }}
                    contentContainerStyle={styles.content}
                    scrollEventThrottle={16 /* get all events */ }
                    onScroll={this.onScroll}
                    /* onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scroll }}}])}*/>
                    <View style={[styles.window]}/>
                    <View style={{ backgroundColor: '#fff'}}>
                        <View style={styles.listContainer}>
                            {ITEMS.map(item => (
                                <ListItem key={item.id} item={item} />
                            ))}
                        </View>
                        <RefreshButton onClick={this.insertItem} stretch={stretch}  />
                    </View>
                </ScrollView>
            </View>
        );
    }
});


var styles = StyleSheet.create({
    container: {
        backgroundColor: '#7dcfcb',
        flex: 1,
    },
    content: {
        flex: 1,
        //backgroundColor: '#fff',
    },
    window: {
        height: 180,
    },
    listContainer: {
        backgroundColor: '#fff',
        paddingTop: 44,
    }
});

module.exports = PullToRefresh;
