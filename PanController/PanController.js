var React = require('react-native');
var {
    StyleSheet,
    View,
    Animated,
    PropTypes,
    } = React;
/**
 * PanSurface API:
 * ============
 *
 * allowX (boolean) [false]
 * allowY (boolean) [true]
 * momentum (boolean|enum("x","y")) [true]
 * lockDirection (boolean) [true]
 * panX (AnimatedValue)
 * panY (AnimatedValue)
 * xBounds (number[2]) [0, measure(children).width]
 * yBounds (number[2]) [0, measure(children).height]
 * overshoot (enum("spring", "clamp", "extend")) ["spring"]
 * xMode (enum("scroll-with-momentum-based-decay", "spring-back-to-origin-on-release"))
 * ...PanResponderHandlers
 *
 * onDirectionChange
 * onOvershoot
 *
 *
 *
 * Additional Scenarios:
 * =====================
 *
 * - snap back to a specific point after touch release
 * - snap to pages with some interval (or array of points?)
 * - support a "mode" for each direction of the following:
 *      - "scroll": scroll with momentum based decay
 *      - "spring": spring back to origin on release
 *      - "pan": stop moving on release
 *
 */
var PanController = React.createClass({

    propTypes: {
        lockDirection: PropTypes.bool,
        allowX: PropTypes.bool,
        allowY: PropTypes.bool,
        momentumX: PropTypes.bool,
        momentumY: PropTypes.bool,
        overshootX: PropTypes.oneOf("spring", "clamp"),
        overshootY: PropTypes.oneOf("spring", "clamp"),
        xBounds: PropTypes.arrayOf(PropTypes.number),
        yBounds: PropTypes.arrayOf(PropTypes.number),
        panX: PropTypes.any, // animated
        panY: PropTypes.any, // animated
        onOvershoot: PropTypes.func,
        onDirectionChange: PropTypes.func,

        //...PanResponderPropTypes,
    },

    getDefaultProps() {
        return {
            allowX: false,
            allowY: true, //TODO: would it make more sense to make this false by default, but a better name?
            momentumX: true,
            momentumY: true,
            lockDirection: true,
            overshootX: "spring",
            overshootY: "spring",
            panX: new Animated.Value(0),
            panY: new Animated.Value(0),
            xBounds: [-Infinity, Infinity],
            yBounds: [-Infinity, Infinity],
            //yMode: "scroll",
            //xMode: "scroll",
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
        };
    },

    getInitialState() {
        //TODO:
        // it's possible we want to move some props over to state.
        // For example, xBounds/yBounds might need to be
        // calculated/updated automatically
        //
        // This could also be done with a higher-order component
        // that just massages props passed in...
        return {

        };
    },

    _responder: null,
    _listener: null,
    _direction: null,

    componentWillMount() {
        this._responder = PanResponder.create({
            onStartShouldSetPanResponder: this.props.onStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this.props.onMoveShouldSetPanResponder,
            onPanResponderGrant: () => {
                if (this.props.onPanResponderGrant) {
                    this.props.onPanResponderGrant(); //TODO: pass args
                }
                var { panX, panY } = this.props;

                this.handleResponderGrant(panX);
                this.handleResponderGrant(panY);

                this._direction = null;
            },
            onPanResponderMove: (_, { dx, dy, x0, y0 }) => {
                var {
                    panX,
                    panY,
                    xBounds,
                    yBounds,
                    overshootX,
                    overshootY,
                    allowX,
                    allowY,
                    lockDirection,
                    } = this.props;

                if (!this._direction) {
                    var dx2 = dx*dx;
                    var dy2 = dy*dy;
                    if (dx2 + dy2 > 10) { // TODO: make configurable
                        this._direction = dx2 > dy2 ? 'x' : 'y';
                        if (this.props.onDirectionChange) {
                            this.props.onDirectionChange({
                                direction: this._direction,
                                dx,
                                du,
                                x0,
                                y0
                            });
                        }
                    }
                }
                var dir = this._direction;

                //TODO: call prop handler

                if (allowX && (!lockDirection || dir === 'x')) {
                    var [xMin, xMax] = xBounds;

                    this.handleResponderMove(panX, dx, xMin, xMax, overshootX);
                }

                if (allowY && (!lockDirection || dir === 'y')) {
                    var [yMin, yMax] = yBounds;

                    this.handleResponderMove(panY, dy, yMin, yMax, overshootY);
                }
            },
            onPanResponderRelease: (_, { vx, vy, dx, dy }) => {
                //TODO: call prop handler
                var {
                    panX,
                    panY,
                    xBounds,
                    yBounds,
                    momentumX,
                    momentumY,
                    overshootX,
                    overshootY,
                    allowX,
                    allowY,
                    lockDirection,
                    xMode,
                    yMode,
                    } = this.props;

                var dir = this._direction;

                if (allowX && (!lockDirection || dir === 'x')) {
                    var [xMin, xMax] = xBounds;
                    this.handleResponderRelease(panX, xMin, xMax, vx, momentumX, overshootX, xMode);
                }

                if (allowY && (!lockDirection || dir === 'y')) {
                    var [yMin, yMax] = yBounds;
                    this.handleResponderRelease(panY, yMin, yMax, vy, momentumY, overshootY, yMode);
                }
            }
        });
    },

    handleResponderMove(anim, delta, min, max, overshoot) {
        var val = anim._offset + delta;

        if (val > max) {
            switch (overshoot) {
            case "spring":
                val = max + (val - max) / 3;
                break;
            case "clamp":
                val = max;
                break;
            }
        }
        if (val < yMin) {
            switch (overshoot) {
            case "spring":
                val = min - (min - val) / 3; // TODO: make configurable
                break;
            case "clamp":
                val = min;
                break;
            }
        }
        val = val - anim._offset;
        anim.setValue(val);
    },

    handleResponderRelease(anim, min, max, velocity, momentum, overshoot) {
        anim.flattenOffset();

        if (anim._value < min) {
            if (this.props.onOvershoot) {
                this.props.onOvershoot(); //TODO: what args should we pass to this
            }
            switch (overshoot) {
            case "spring":
                Animated.spring(anim, {
                    toValue: min,
                    velocity, // TODO: make configurable
                }).start();
                break;
            case "clamp":
                anim.setValue(min);
                break;
            }
        } else if (anim._value > max) {
            if (this.props.onOvershoot) {
                this.props.onOvershoot(); //TODO: what args should we pass to this
            }
            switch (overshoot) {
            case "spring":
                Animated.spring(anim, {
                    toValue: max,
                    velocity, // TODO: make configurable
                }).start();
                break;
            case "clamp":
                anim.setValue(min);
                break;
            }
        } else if (momentum) {

            //TODO: handle scroll snapping
            switch (mode) {
                case "snap":
                    this.handleSnappedScroll(anim, min, max, velocity, momentum, overshoot);
                    break;

                case "decay":
                    this.handleMomentumScroll(anim, min, max, velocity, momentum, overshoot);
                    break;
            }
        }
    },

    handleResponderGrant(anim) {
        anim.setOffset(anim._value);
        anim.setValue(0);
    },

    handleMomentumScroll(anim, min, max, velocity, momentum, overshoot) {
        Animated.decay(anim, {
            velocity,
            deceleration: 0.993, //TODO: make configurable
        }).start(() => {
            anim.removeListener(this._listener);
        });

        this._listener = anim.addListener(({ value }) => {
            if (value < min) {
                anim.removeListener(this._listener);
                if (this.props.onOvershoot) {
                    this.props.onOvershoot(); //TODO: what args should we pass to this
                }
                switch (overshoot) {
                    case "spring":
                        Animated.spring(anim, {
                            toValue: min,
                            velocity, // TODO: make configurable
                        }).start();
                        break;
                    case "clamp":
                        anim.setValue(min);
                        break;
                }
            } else if (value > max) {
                anim.removeListener(this._listener);
                if (this.props.onOvershoot) {
                    this.props.onOvershoot(); //TODO: what args should we pass to this
                }
                switch (overshoot) {
                    case "spring":
                        Animated.spring(anim, {
                            toValue: max,
                            velocity, // TODO: make configurable
                        }).start();
                        break;
                    case "clamp":
                        anim.setValue(min);
                        break;
                }
            }
        });
    },

    handleSnappedScroll(anim, velocity, min, max, spacing) {
        var endX = this.momentumCenter(anim._value, velocity, spacing);
        endX = Math.max(endX, min);
        endX = Math.min(endX, max);
        var bounds = [endX-spacing/2, endX+spacing/2];
        var endV = this.velocityAtBounds(x._value, velocity, bounds);

        this._listener = x.addListener(( { value } ) => {
            if (value > bounds[0] && value < bounds[1]) {
                Animated.spring(anim, {
                    toValue: endX,
                    velocity: endV,
                }).start();
            }
        });

        Animated.decay(anim, {
            velocity, //TODO: make configurable
        }).start(()=> {
            x.removeListener(this._listener);
        });
    },

    closestCenter(x, spacing) {
        var plus = (x % spacing) < spacing / 2 ? 0 : spacing;
        return Math.floor(x / spacing) * spacing + plus;
    },

    momentumCenter(x0, vx, spacing) {
        var t = 0;
        var deceleration = 0.997; // TODO: make configurable
        var x1 = x0;
        var x = x1;

        while (true) {
            t += 16;
            x = x0 + (vx / (1 - deceleration)) *
                (1 - Math.exp(-(1 - deceleration) * t));
            if (Math.abs(x-x1) < 0.1) {
                x1 = x;
                break;
            }
            x1 = x;
        }
        return this.closestCenter(x1, spacing);
    },

    velocityAtBounds(x0, vx, bounds) {
        var t = 0;
        var deceleration = 0.997; // TODO: make configurable
        var x1 = x0;
        var x = x1;
        var vf;
        while (true) {
            t += 16;
            x = x0 + (vx / (1 - deceleration)) *
                (1 - Math.exp(-(1 - deceleration) * t));
            vf = (x-x1) / 16;
            if (x > bounds[0] && x < bounds[1]) {
                break;
            }
            if (Math.abs(vf) < 0.1) {
                break;
            }
            x1 = x;
        }
        return vf;
    },

    componentDidMount() {
        //TODO: we may need to measure the children width/height here?
    },

    componentWillUnmount() {

    },

    componentDidUnmount() {

    },

    render: function () {
        return <View {...this.props} {...this._responder.panHandlers} />
    }
});

module.exports = PanController;