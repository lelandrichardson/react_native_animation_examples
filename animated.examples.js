/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @providesModule AnimationExampleApp
 */
'use strict';

var React = require('react-native');
var {
    Animated,
    LayoutAnimation,
    PanResponder,
    StyleSheet,
    Text,
    View,
    } = React;

var AnimationExampleSet = require('AnimationExampleSet');

var CIRCLE_SIZE = 80;
var CIRCLE_MARGIN = 18;
var NUM_CIRCLES = 30;

class Circle extends React.Component {
    constructor(props: Object): void {
        super();
        this._onLongPress = this._onLongPress.bind(this);
        this._toggleIsActive = this._toggleIsActive.bind(this);
        this.state = {isActive: false};
        this.state.pan = new Animated.ValueXY(); // Vectors reduce boilerplate.  (step1: uncomment)
        this.state.pop = new Animated.Value(0);  // Initial value.               (step2a: uncomment)
    }

    _onLongPress(): void {
        var config = {tension: 40, friction: 3};
        this.state.pan.addListener((value) => {  // Async listener for state changes  (step1: uncomment)
            this.props.onMove && this.props.onMove(value);
        });
        Animated.spring(this.state.pop, {
            toValue: 1,                  //  Pop to larger size.                      (step2b: uncomment)
            ...config,                   //  Reuse config for convenient consistency  (step2b: uncomment)
        }).start();
        this.setState({panResponder: PanResponder.create({
            onPanResponderMove: Animated.event([
                null,                                         // native event - ignore      (step1: uncomment)
                {dx: this.state.pan.x, dy: this.state.pan.y}, // links pan to gestureState  (step1: uncomment)
            ]),
            onPanResponderRelease: (e, gestureState) => {
                LayoutAnimation.easeInEaseOut();  // animates layout update as one batch (step3: uncomment)
                Animated.spring(this.state.pop, {
                    toValue: 0,                     // Pop back to 0                       (step2c: uncomment)
                    ...config,
                }).start();
                this.setState({panResponder: undefined});
                this.props.onMove && this.props.onMove({
                    x: gestureState.dx + this.props.restLayout.x,
                    y: gestureState.dy + this.props.restLayout.y,
                });
                this.props.onDeactivate();
            },
        })}, () => {
            this.props.onActivate();
        });
    }

    render(): ReactElement {
        if (this.state.panResponder) {
            var handlers = this.state.panResponder.panHandlers;
            var dragStyle = {                 //  Used to position while dragging
                    position: 'absolute',           //  Hoist out of layout                    (step1: uncomment)
                    ...this.state.pan.getLayout(),  //  Convenience converter                  (step1: uncomment)
                };
        } else {
            handlers = {
                onStartShouldSetResponder: () => !this.state.isActive,
                onResponderGrant: () => {
                    this.state.pan.setValue({x: 0, y: 0});           // reset                (step1: uncomment)
                    this.state.pan.setOffset(this.props.restLayout); // offset from onLayout (step1: uncomment)
                    this.longTimer = setTimeout(this._onLongPress, 300);
                },
                onResponderRelease: () => {
                    if (!this.state.panResponder) {
                        clearTimeout(this.longTimer);
                        this._toggleIsActive();
                    }
                }
            };
        }
        var animatedStyle = {
            shadowOpacity: this.state.pop,    // no need for interpolation            (step2d: uncomment)
            transform: [
                {scale: this.state.pop.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.3]         // scale up from 1 to 1.3               (step2d: uncomment)
                })},
            ],
        };
        var openVal = this.props.openVal;
        if (this.props.dummy) {
            animatedStyle.opacity = 0;
        } else if (this.state.isActive) {
            var innerOpenStyle = [styles.open, {                                 // (step4: uncomment)
                left: openVal.interpolate({inputRange: [0, 1], outputRange: [this.props.restLayout.x, 0]}),
                top: openVal.interpolate({inputRange: [0, 1], outputRange: [this.props.restLayout.y, 0]}),
                width: openVal.interpolate({inputRange: [0, 1], outputRange: [CIRCLE_SIZE, this.props.containerLayout.width]}),
                height: openVal.interpolate({inputRange: [0, 1], outputRange: [CIRCLE_SIZE, this.props.containerLayout.height]}),
                margin: openVal.interpolate({inputRange: [0, 1], outputRange: [CIRCLE_MARGIN, 0]}),
                borderRadius: openVal.interpolate({inputRange: [-0.15, 0, 0.5, 1], outputRange: [0, CIRCLE_SIZE / 2, CIRCLE_SIZE * 1.3, 4]}),
            }];
        }
        return (
            <Animated.View
                onLayout={this.props.onLayout}
                style={[styles.dragView, dragStyle, animatedStyle, this.state.isActive ? styles.open : null]}
                {...handlers}>
                <Animated.View style={[styles.circle, innerOpenStyle]}>
                    <AnimationExampleSet
                        containerLayout={this.props.containerLayout}
                        id={this.props.id}
                        isActive={this.state.isActive}
                        openVal={this.props.openVal}
                        onDismiss={this._toggleIsActive}
                        />
                </Animated.View>
            </Animated.View>
        );
    }
    _toggleIsActive(velocity) {
        var config = {tension: 30, friction: 7};
        if (this.state.isActive) {
            Animated.spring(this.props.openVal, {toValue: 0, ...config}).start(() => { // (step4: uncomment)
                this.setState({isActive: false}, this.props.onDeactivate);
            });                                                                        // (step4: uncomment)
        } else {
            this.props.onActivate();
            this.setState({isActive: true, panResponder: undefined}, () => {
                // this.props.openVal.setValue(1);                                             // (step4: comment)
                Animated.spring(this.props.openVal, {toValue: 1, ...config}).start();    // (step4: uncomment)
            });
        }
    }
}

class AnimationExampleApp extends React.Component {
    constructor(props: any): void {
        super(props);
        var keys = [];
        for (var idx = 0; idx < NUM_CIRCLES; idx++) {
            keys.push('E' + idx);
        }
        this.state = {
            keys,
            restLayouts: [],
            openVal: new Animated.Value(0),
        };
        this._onMove = this._onMove.bind(this);
    }

    render(): ReactElement {
        var circles = this.state.keys.map((key, idx) => {
            if (key === this.state.activeKey) {
                return <Circle key={key + 'd'} dummy={true} />;
            } else {
                if (!this.state.restLayouts[idx]) {
                    var onLayout = function(index, e) {
                        var layout = e.nativeEvent.layout;
                        this.setState((state) => {
                            state.restLayouts[index] = layout;
                            return state;
                        });
                    }.bind(this, idx);
                }
                return (
                    <Circle
                        key={key}
                        id={key}
                        openVal={this.state.openVal}
                        onLayout={onLayout}
                        restLayout={this.state.restLayouts[idx]}
                        onActivate={this.setState.bind(this, {
              activeKey: key,
              activeInitialLayout: this.state.restLayouts[idx],
            })}
                        />
                );
            }
        });
        if (this.state.activeKey) {
            circles.push(
                <Animated.View key="dark" style={[styles.darkening, {opacity: this.state.openVal}]} />
            );
            circles.push(
                <Circle
                    openVal={this.state.openVal}
                    key={this.state.activeKey}
                    id={this.state.activeKey}
                    restLayout={this.state.activeInitialLayout}
                    containerLayout={this.state.layout}
                    onMove={this._onMove}
                    onDeactivate={() => { this.setState({activeKey: undefined}); }}
                    />
            );
        }
        return (
            <View style={{flex: 1}}>
                <View style={styles.header}>
                    <Text style={{fontSize: 23, fontWeight: 'bold'}}>Gratuitous Animations</Text>
                </View>
                <View style={styles.grid} onLayout={(e) => this.setState({layout: e.nativeEvent.layout})}>
                    {circles}
                </View>
            </View>
        );
    }

    _onMove(position) {
        var newKeys = moveToClosest(this.state, position);
        if (newKeys !== this.state.keys) {
            LayoutAnimation.easeInEaseOut();  // animates layout update as one batch (step3: uncomment)
            this.setState({keys: newKeys});
        }
    }
}

type Point = {x: number, y: number};
function distance(p1: Point, p2: Point): number {
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    return dx * dx + dy * dy;
}

function moveToClosest({activeKey, keys, restLayouts}, position) {
    var activeIdx = -1;
    var closestIdx = activeIdx;
    var minDist = Infinity;
    var newKeys = [];
    keys.forEach((key, idx) => {
        var dist = distance(position, restLayouts[idx]);
        if (key === activeKey) {
            idx = activeIdx;
        } else {
            newKeys.push(key);
        }
        if (dist < minDist) {
            minDist = dist;
            closestIdx = idx;
        }
    });
    if (closestIdx === activeIdx) {
        return keys; // nothing changed
    } else {
        newKeys.splice(closestIdx, 0, activeKey);
        return newKeys;
    }
}

AnimationExampleApp.title = 'Animation Example I';
AnimationExampleApp.description = 'Rearrangeable Grid View - longPress and drag';

var styles = StyleSheet.create({
    header: {
        position: 'absolute',
        alignItems: 'center',
        top: 48,
        left: 0,
        right: 0,
    },
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        borderWidth: 1,
        borderColor: 'black',
        margin: CIRCLE_MARGIN,
        overflow: 'hidden',
    },
    grid: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 96,
        backgroundColor: 'transparent',
    },
    dragView: {
        shadowRadius: 10,
        shadowColor: 'rgba(0,0,0,0.7)',
        shadowOffset: {height: 8},
        alignSelf: 'flex-start',
        backgroundColor: 'transparent',
    },
    open: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: undefined,
        height: undefined,
        borderRadius: 0,
    },
    darkening: {
        backgroundColor: 'black',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: -96, // compensate for paddingTop in container...bug?
    },
});

module.exports = AnimationExampleApp;
/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @providesModule AnimationExampleBobbles
 */
'use strict';

var React = require('react-native');
var {
    Animated,
    Image,
    PanResponder,
    StyleSheet,
    View,
    } = React;

var NUM_BOBBLES = 5;
var RAD_EACH = Math.PI / 2 / (NUM_BOBBLES - 2);
var RADIUS = 160;
var BOBBLE_SPOTS = [...Array(NUM_BOBBLES)].map((_, i) => {  // static positions
    return i === 0 ? {x: 0, y: 0} : {                         // first bobble is the selector
        x: -Math.cos(RAD_EACH * (i - 1)) * RADIUS,
        y: -Math.sin(RAD_EACH * (i - 1)) * RADIUS,
    };
});

class AnimationExampleBobbles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.bobbles = BOBBLE_SPOTS.map((_, i) => {
            return new Animated.ValueXY();
        });
        this.state.selectedBobble = null;
        var bobblePanListener = (e, gestureState) => {     // async events => change selection
            var newSelected = computeNewSelected(gestureState);
            if (this.state.selectedBobble !== newSelected) {
                if (this.state.selectedBobble !== null) {
                    var restSpot = BOBBLE_SPOTS[this.state.selectedBobble];
                    Animated.spring(this.state.bobbles[this.state.selectedBobble], {
                        toValue: restSpot,       // return previously selected bobble to rest position
                    }).start();
                }
                if (newSelected !== null && newSelected !== 0) {
                    Animated.spring(this.state.bobbles[newSelected], {
                        toValue: this.state.bobbles[0],    // newly selected should track the selector
                    }).start();
                }
                this.state.selectedBobble = newSelected;
            }
        };
        var releaseBobble = () => {
            this.state.bobbles.forEach((bobble, i) => {
                Animated.spring(bobble, {
                    toValue: {x: 0, y: 0}           // all bobbles return to zero
                }).start();
            });
        };
        this.state.bobbleResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                BOBBLE_SPOTS.forEach((spot, idx) => {
                    Animated.spring(this.state.bobbles[idx], {
                        toValue: spot,                // spring each bobble to its spot
                        friction: 3,                  // less friction => bouncier
                    }).start();
                });
            },
            onPanResponderMove: Animated.event(
                [ null, {dx: this.state.bobbles[0].x, dy: this.state.bobbles[0].y} ],
                {listener: bobblePanListener}     // async state changes with arbitrary logic
            ),
            onPanResponderRelease: releaseBobble,
            onPanResponderTerminate: releaseBobble,
        });
    }

    render() {
        return (
            <View style={styles.bobbleContainer}>
                {this.state.bobbles.map((_, i) => {
                    var j = this.state.bobbles.length - i - 1; // reverse so lead on top
                    var handlers = j > 0 ? {} : this.state.bobbleResponder.panHandlers;
                    return (
                        <Animated.Image
                            {...handlers}
                            source={{uri: BOBBLE_IMGS[j]}}
                            style={[styles.circle, {
                backgroundColor: randColor(),                             // re-renders are obvious
                transform: this.state.bobbles[j].getTranslateTransform(), // simple conversion
              }]}
                            />
                    );
                })}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    circle: {
        position: 'absolute',
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 0.5,
    },
    bobbleContainer: {
        top: -68,
        paddingRight: 66,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
});

function computeNewSelected(
    gestureState: Object,
): ?number {
    var {dx, dy} = gestureState;
var minDist = Infinity;
var newSelected = null;
var pointRadius = Math.sqrt(dx * dx + dy * dy);
if (Math.abs(RADIUS - pointRadius) < 80) {
    BOBBLE_SPOTS.forEach((spot, idx) => {
        var delta = {x: spot.x - dx, y: spot.y - dy};
        var dist = delta.x * delta.x + delta.y * delta.y;
        if (dist < minDist) {
            minDist = dist;
            newSelected = idx;
        }
    });
}
return newSelected;
}

function randColor(): string {
    var colors = [0,1,2].map(() => Math.floor(Math.random() * 150 + 100));
    return 'rgb(' + colors.join(',') + ')';
}

var BOBBLE_IMGS = [
    'https://scontent-sea1-1.xx.fbcdn.net/hphotos-xpf1/t39.1997-6/10173489_272703316237267_1025826781_n.png',
    'https://scontent-sea1-1.xx.fbcdn.net/hphotos-xaf1/l/t39.1997-6/p240x240/851578_631487400212668_2087073502_n.png',
    'https://scontent-sea1-1.xx.fbcdn.net/hphotos-xaf1/t39.1997-6/p240x240/851583_654446917903722_178118452_n.png',
    'https://scontent-sea1-1.xx.fbcdn.net/hphotos-xaf1/t39.1997-6/p240x240/851565_641023175913294_875343096_n.png',
    'https://scontent-sea1-1.xx.fbcdn.net/hphotos-xaf1/t39.1997-6/851562_575284782557566_1188781517_n.png',
];

module.exports = AnimationExampleBobbles;
/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @providesModule AnimationExampleChained
 */
'use strict';

var React = require('react-native');
var {
    Animated,
    Image,
    PanResponder,
    StyleSheet,
    View,
    } = React;

class AnimationExampleChained extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stickers: [new Animated.ValueXY()],                    // 1 leader
        };
        var stickerConfig = {tension: 2, friction: 3};           // soft spring
        for (var i = 0; i < 4; i++) {                            // 4 followers
            var sticker = new Animated.ValueXY();
            Animated.spring(sticker, {
                ...stickerConfig,
                toValue: this.state.stickers[i],                     // Animated toValue's are tracked
            }).start();
            this.state.stickers.push(sticker);                     // push on the followers
        }
        var releaseChain = (e, gestureState) => {
            // TODO: use sequence after fixing parallel + tracking
            Animated.decay(this.state.stickers[0], {
                velocity: {x: gestureState.vx, y: gestureState.vy},
                deceleration: 0.997,
            }).start((finished) => {
                if (finished) {
                    this.state.stickers[0].setOffset({x: 0, y: 0});    // reset to original coordinates
                    Animated.spring(this.state.stickers[0], {
                        toValue: {x: 0, y: 0}                            // return to start
                    }).start();
                }
            });
        };
        this.state.chainResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                this.state.stickers[0].stopAnimation((value) => {
                    this.state.stickers[0].setOffset(value);           // start where sticker animated to
                    this.state.stickers[0].setValue({x: 0, y: 0});     // avoid flicker before next event
                });
            },
            onPanResponderMove: Animated.event(
                [null, {dx: this.state.stickers[0].x, dy: this.state.stickers[0].y}] // map gesture to leader
            ),
            onPanResponderRelease: releaseChain,
            onPanResponderTerminate: releaseChain,
        });
    }

    render() {
        return (
            <View style={styles.chained}>
                {this.state.stickers.map((_, i) => {
                    var j = this.state.stickers.length - i - 1; // reverse so leader is on top
                    var handlers = (j === 0) ? this.state.chainResponder.panHandlers : {};
                    return (
                        <Animated.Image
                            {...handlers}
                            source={{uri: CHAIN_IMGS[j]}}
                            style={[styles.sticker, {
                transform: this.state.stickers[j].getTranslateTransform(), // simple conversion
              }]}
                            />
                    );
                })}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    chained: {
        alignSelf: 'flex-end',
        top: -160,
        right: 126
    },
    sticker: {
        position: 'absolute',
        height: 120,
        width: 120,
        backgroundColor: 'transparent',
    },
});

var CHAIN_IMGS = [
    'https://scontent-sea1-1.xx.fbcdn.net/hphotos-xpf1/t39.1997-6/p160x160/10574705_1529175770666007_724328156_n.png',
    'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-xfa1/t39.1997-6/p160x160/851575_392309884199657_1917957497_n.png',
    'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-xfa1/t39.1997-6/p160x160/851567_555288911225630_1628791128_n.png',
    'https://scontent-sea1-1.xx.fbcdn.net/hphotos-xfa1/t39.1997-6/p160x160/851583_531111513625557_903469595_n.png',
    'https://scontent-sea1-1.xx.fbcdn.net/hphotos-xpa1/t39.1997-6/p160x160/851577_510515972354399_2147096990_n.png',
];

module.exports = AnimationExampleChained;
/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @providesModule AnimationExampleScrolling
 */
'use strict';

var React = require('react-native');
var {
    Animated,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
    } = React;

class AnimationExampleScrolling extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollX: new Animated.Value(0),
        };
    }

    render() {
        var width = this.props.panelWidth;
        return (
            <View style={styles.container}>
                <ScrollView
                    scrollEventThrottle={16 /* get all events */ }
                    onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: this.state.scrollX}}}]  // nested event mapping
          )}
                    contentContainerStyle={{flex: 1, padding: 10}}
                    pagingEnabled={true}
                    horizontal={true}>
                    <View style={[styles.page, {width}]}>
                        <Image
                            style={{width: 240, height: 240}}
                            source={HAWK_PIC}
                            />
                        <Text style={styles.text}>
                            {'I\'ll find something to put here.'}
                        </Text>
                    </View>
                    <View style={[styles.page, {width}]}>
                        <Text style={styles.text}>{'And here.'}</Text>
                    </View>
                    <View style={[styles.page, {width}]}>
                        <Text>{'But not here.'}</Text>
                    </View>
                </ScrollView>
                <Animated.Image
                    pointerEvents="none"
                    style={[styles.bunny, {transform: [
            {translateX: this.state.scrollX.interpolate({
              inputRange: [0, width, 2 * width],
              outputRange: [0, 0, width / 3]}),          //  multi-part ranges
              extrapolate: 'clamp'},                     //  default is 'extend'
            {translateY: this.state.scrollX.interpolate({
              inputRange: [0, width, 2 * width],
              outputRange: [0, -200, -260]}),
              extrapolate: 'clamp'},
            {scale: this.state.scrollX.interpolate({
              inputRange: [0, width, 2 * width],
              outputRange: [0.5, 0.5, 2]}),
              extrapolate: 'clamp'},
          ]}]}
                    source={BUNNY_PIC}
                    />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1,
    },
    text: {
        padding: 4,
        paddingBottom: 10,
        fontWeight: 'bold',
        fontSize: 18,
        backgroundColor: 'transparent',
    },
    bunny: {
        backgroundColor: 'transparent',
        position: 'absolute',
        height: 160,
        width: 160,
    },
    page: {
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});

var HAWK_PIC = {uri: 'https://scontent-sea1-1.xx.fbcdn.net/hphotos-xfa1/t39.1997-6/10734304_1562225620659674_837511701_n.png'};
var BUNNY_PIC = {uri: 'https://scontent-sea1-1.xx.fbcdn.net/hphotos-xaf1/t39.1997-6/851564_531111380292237_1898871086_n.png'};

module.exports = AnimationExampleScrolling;
/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @providesModule AnimationExampleSet
 */
'use strict';

var React = require('react-native');
var {
    Animated,
    PanResponder,
    StyleSheet,
    Text,
    View,
    } = React;

var AnimationExampleBobbles = require('AnimationExampleBobbles');
var AnimationExampleChained = require('AnimationExampleChained');
var AnimationExampleScrolling = require('AnimationExampleScrolling');
var AnimationExampleTilt = require('AnimationExampleTilt');

class AnimationExampleSet extends React.Component {
    constructor(props) {
        super(props);
        function randColor() {
            var colors = [0,1,2].map(() => Math.floor(Math.random() * 150 + 100));
            return 'rgb(' + colors.join(',') + ')';
        }
        this.state = {
            closeColor: randColor(),
            openColor: randColor(),
        };
    }
    render() {
        var backgroundColor = this.props.openVal ?
            this.props.openVal.interpolate({
                inputRange: [0, 1],
                outputRange: [
                    this.state.closeColor,  // interpolates color strings
                    this.state.openColor
                ],
            }) :
            this.state.closeColor;
        var panelWidth = this.props.containerLayout && this.props.containerLayout.width || 320;
        return (
            <View style={styles.container}>
                <Animated.View
                    style={[styles.header, { backgroundColor }]}
                    {...this.state.dismissResponder.panHandlers}>
                    <Text style={[styles.text, styles.headerText]}>
                        {this.props.id}
                    </Text>
                </Animated.View>
                {this.props.isActive &&
                <View style={styles.stream}>
                    <View style={styles.card}>
                        <Text style={styles.text}>
                            July 2nd
                        </Text>
                        <AnimationExampleTilt isActive={this.props.isActive} />
                        <AnimationExampleBobbles />
                    </View>
                    <AnimationExampleScrolling panelWidth={panelWidth}/>
                    <AnimationExampleChained />
                </View>
                }
            </View>
        );
    }

    componentWillMount() {
        this.state.dismissY = new Animated.Value(0);
        this.state.dismissResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => this.props.isActive,
            onPanResponderGrant: () => {
                Animated.spring(this.props.openVal, {          // Animated value passed in.
                    toValue: this.state.dismissY.interpolate({   // Track dismiss gesture
                        inputRange: [0, 300],                      // and interpolate pixel distance
                        outputRange: [1, 0],                       // to a fraction.
                    })
                }).start();
            },
            onPanResponderMove: Animated.event(
                [null, {dy: this.state.dismissY}]              // track pan gesture
            ),
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dy > 100) {
                    this.props.onDismiss(gestureState.vy);  // delegates dismiss action to parent
                } else {
                    Animated.spring(this.props.openVal, {
                        toValue: 1,                           // animate back open if released early
                    }).start();
                }
            },
        });
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingTop: 18,
        height: 90,
    },
    stream: {
        flex: 1,
        backgroundColor: 'rgb(230, 230, 230)',
    },
    card: {
        margin: 8,
        padding: 8,
        borderRadius: 6,
        backgroundColor: 'white',
        shadowRadius: 2,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset: {height: 0.5},
    },
    text: {
        padding: 4,
        paddingBottom: 10,
        fontWeight: 'bold',
        fontSize: 18,
        backgroundColor: 'transparent',
    },
    headerText: {
        fontSize: 25,
        color: 'white',
        shadowRadius: 3,
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowOffset: {height: 1},
    },
});

module.exports = AnimationExampleSet;
/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @providesModule AnimationExampleTilt
 */
'use strict';

var React = require('react-native');
var {
    Animated,
    Image,
    PanResponder,
    StyleSheet,
    View,
    } = React;

class AnimationExampleTilt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            panX: new Animated.Value(0),
            opacity: new Animated.Value(1),
            burns: new Animated.Value(1.15),
        };
        this.state.tiltPanResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                Animated.timing(this.state.opacity, {
                    toValue: this.state.panX.interpolate({
                        inputRange: [-300, 0, 300],            // pan is in pixels
                        outputRange: [0, 1, 0],                // goes to zero at both edges
                    }),
                    duration: 0,                             // direct tracking
                }).start();
            },
            onPanResponderMove: Animated.event(
                [null, {dx: this.state.panX}]              // panX is linked to the gesture
            ),
            onPanResponderRelease: (e, gestureState) => {
                var toValue = 0;
                if (gestureState.dx > 100) {
                    toValue = 500;
                } else if (gestureState.dx < -100) {
                    toValue = -500;
                }
                Animated.spring(this.state.panX, {
                    toValue,                         // animate back to center or off screen
                    velocity: gestureState.vx,       // maintain gesture velocity
                    tension: 10,
                    friction: 3,
                }).start();
                this.state.panX.removeAllListeners();
                var id = this.state.panX.addListener(({value}) => { // listen until offscreen
                    if (Math.abs(value) > 400) {
                        this.state.panX.removeListener(id);             // offscreen, so stop listening
                        Animated.timing(this.state.opacity, {
                            toValue: 1,   // Fade back in.  This unlinks it from tracking this.state.panX
                        }).start();
                        this.state.panX.setValue(0);                    // Note: stops the spring animation
                        toValue !== 0 && this._startBurnsZoom();
                    }
                });
            },
        });
    }

    _startBurnsZoom() {
        this.state.burns.setValue(1);     // reset to beginning
        Animated.decay(this.state.burns, {
            velocity: 1,                    // sublte zoom
            deceleration: 0.9999,           // slow decay
        }).start();
    }

    componentWillMount() {
        this._startBurnsZoom();
    }

    render() {
        return (
            <Animated.View
                {...this.state.tiltPanResponder.panHandlers}
                style={[styles.tilt, {
          opacity: this.state.opacity,
          transform: [
            {rotate: this.state.panX.interpolate({
              inputRange: [-320, 320],
              outputRange: ['-15deg', '15deg']})},  // interpolate string "shapes"
            {translateX: this.state.panX},
          ],
        }]}>
                <Animated.Image
                    pointerEvents="none"
                    style={{
            flex: 1,
            transform: [
              {translateX: this.state.panX.interpolate({
                inputRange: [-3, 3],     // small range is extended by default
                outputRange: [2, -2]})   // parallax
              },
              {scale: this.state.burns.interpolate({
                inputRange: [1, 3000],
                outputRange: [1, 1.25]}) // simple multiplier
              },
            ],
          }}
                    source={NATURE_IMAGE}
                    />
            </Animated.View>
        );
    }
}

var styles = StyleSheet.create({
    tilt: {
        overflow: 'hidden',
        height: 200,
        marginBottom: 4,
        backgroundColor: 'rgb(130, 130, 255)',
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        borderRadius: 20,
    },
});

var NATURE_IMAGE = {uri: 'http://www.deshow.net/d/file/travel/2009-04/scenic-beauty-of-nature-photography-2-504-4.jpg'};

module.exports = AnimationExampleTilt;