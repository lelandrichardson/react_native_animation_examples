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
    ScrollView,
    PanResponder,
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
    {
        id: 7,
        icon: "list",
        color: "#6da2ff",
        title: "Meeting Minutes",
        time: "Mar 9, 2015"
    },
    {
        id: 8,
        icon: "folder",
        color: "#cbcbcf",
        title: "Favorite Photos",
        time: "Feb 3, 2015"
    },
    {
        id: 9,
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

var MIN = -220;
var MAX = 0;

var PullToRefresh = React.createClass({

    getInitialState() {
        return {
            scroll: new Animated.Value(0),
            loading: new Animated.Value(0),
            isLoading: false,
        };
    },
    responder: null,

    componentWillMount() {
        this.responder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                this.state.scroll.setOffset(this.state.scroll._value);
                this.state.scroll.setValue(0);
            },
            onPanResponderMove: (_, { dy, y0 }) => {
                var scroll = this.state.scroll._offset + dy;

                if (scroll > MAX) {
                    scroll = MAX + (scroll - MAX) / 4;
                }
                if (scroll < MIN) {
                    scroll = MIN - (MIN - scroll) / 4;
                }
                scroll = scroll - this.state.scroll._offset;
                this.state.scroll.setValue(scroll);
            },
            onPanResponderRelease: (_, { vy, dy }) => {
                var { scroll } = this.state;
                scroll.flattenOffset();

                if (scroll._value < MIN) {
                    Animated.spring(scroll, {
                        toValue: MIN,
                        velocity: vy
                    }).start();
                } else if (scroll._value > MAX) {
                    Animated.spring(scroll, {
                        toValue: MAX,
                        velocity: vy,
                        friction: 3,
                        tension: 60,
                    }).start();
                    this._listener = scroll.addListener(({ value }) => {
                        if (value > 0) {
                            scroll.removeListener(this._listener);
                            this.loadMore();
                        }
                    });
                } else {
                    Animated.decay(scroll, {
                        velocity: vy,
                    }).start(() => {
                        scroll.removeListener(this._listener);
                    });

                    this._listener = scroll.addListener(( { value } ) => {
                        if (value < MIN) {
                            scroll.removeListener(this._listener);
                            Animated.spring(scroll, {
                                toValue: MIN,
                                velocity: vy
                            }).start();
                        } else if (value > MAX) {
                            scroll.removeListener(this._listener);
                            Animated.spring(scroll, {
                                toValue: MAX,
                                velocity: vy
                            }).start();
                        }
                    });
                }
            }
        });
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
                duration: 150
            }),
            Animated.parallel([
                Animated.spring(newItem.flutter, {
                    toValue: 1,
                    friction: 1.2,
                    tension: 70,
                }),
                Animated.timing(newItem.loading, {
                    toValue: 1,
                    duration: 200,
                    //delay: 30,
                })
            ])
        ]).start();
        this.forceUpdate();
    },

    loadMore() {
        this.setState({ isLoading: true });
        this.state.loading.setValue(0);
        Animated.timing(this.state.loading, {
            toValue: 1,
            duration: 2800,
            easing: Easing.linear
        }).start(() => {
            this.setState({ isLoading: false });
            this.insertItem()
        });
    },

    render: function () {

        var { scroll, loading, isLoading } = this.state;

        var stretch = scroll.interpolate({
            inputRange: [-1, 0, 100],
            outputRange: [0, 0, 1]
        });
        var wiggle = scroll.interpolate({
            inputRange: [-101, -40, 0, 40, 101],
            outputRange: [-1, -1, 0, 1, 1]
        });

        return (
            <View style={styles.container}>
                <ForestView stretch={stretch} wiggle={wiggle} />
                <Animated.View
                    contentInset={{ top: -18 }}
                    style={[{ backgroundColor: 'transparent', flex: 1 },{
                        transform: [
                            {
                                translateY: scroll
                            }
                        ]
                    }]}
                    /*contentContainerStyle={styles.content}*/
                    {...this.responder.panHandlers}>
                    <View style={[styles.window]}/>
                    <View style={{ backgroundColor: '#fff'}}>
                        <View style={styles.listContainer}>
                            {ITEMS.map(item => (
                                <ListItem key={item.id} item={item} />
                            ))}
                        </View>
                        <RefreshButton
                            onPress={this.loadMore}
                            stretch={stretch}
                            isLoading={isLoading} />
                    </View>
                </Animated.View>
                {isLoading && <LoadingAirplane loading={loading} />}
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
