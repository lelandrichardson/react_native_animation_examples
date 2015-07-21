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
var LoadingAirplane = require('./LoadingAirplane');


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
    inserting: new Animated.Value(1),
}));

var ITEM_TO_ADD = {
    icon: "calendar-o",
    color: "#fdc56d",
    title: "Magic Cube Show",
    time: "Mar 15, 2015"
};

var PullToRefresh = React.createClass({

    getInitialState() {
        var scroll = new Animated.Value(0);
        return {
            scroll,
            loading: new Animated.Value(0)
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
            inserting: new Animated.Value(0),
        };
        ITEMS.unshift(newItem);
        Animated.sequence([
            Animated.timing(newItem.inserting, {
                toValue: 1,
                duration: 200
            }),
            Animated.parallel([
                Animated.spring(newItem.flutter, {
                    toValue: 1,
                    friction: 1.2,
                    tension: 70,
                }),
                Animated.timing(newItem.loading, {
                    toValue: 1,
                    duration: 250,
                    //delay: 30,
                })
            ])
        ]).start();
        this.forceUpdate();
    },

    loadMore() {
        this.state.loading.setValue(0);
        Animated.timing(this.state.loading, {
            toValue: 1,
            duration: 2800,
            easing: Easing.linear
        }).start();
    },

    render: function () {

        var { scroll, loading } = this.state;

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
                        <RefreshButton onPress={this.insertItem} stretch={stretch}  />
                    </View>
                </ScrollView>
                <LoadingAirplane loading={loading} />
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
