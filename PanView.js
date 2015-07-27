
var Ferrisel = React.createClass({
    getInitialState() {
        return {
            panX: new Animated.Value(0),
            panY: new Animated.Value(0)
        };
    },
    render() {
        var { pages } = this.props;
        var { panX, panY } = this.state;
        return (
            <PanView
                allowScrollX
                allowScrollY
                lockDirection
                panX={panX}
                panY={panY}
                boundary={[]}
                >
                {pages.map((page, i) => (
                    <Animated.Image
                        source={page.source}
                        style={{
                            transform: [{
                                translateX: panX
                            }, {
                                translateY: panY.interpolate({
                                    inputRange: [...],
                                    outputRange: [...],
                                    easing: ...
                                })
                            }, {
                                scale: panY.interpolate({
                                    inputRange: [...],
                                    outputRange: [...]
                                })
                            }]
                        }}
                    />
                ))}
            </PanView>
        )
    }
})

/**
 * PanSurface API:
 * ============
 *
 * allowX (boolean) [false]
 * allowY (boolean) [true]
 * momentum (boolean|enum("x","y")) [true]
 * lockScrollDirection (boolean) [true]
 * panX (AnimatedValue)
 * panY (AnimatedValue)
 * vx (AnimatedValue)
 * vy (AnimatedValue)
 * xBounds (number[2]) [0, measure(children).width]
 * yBounds (number[2]) [0, measure(children).height]
 * overshoot (enum("spring", "clamp", "extend")) ["spring"]
 * xMode (enum("scroll-with-momentum-based-decay", "spring-back-to-origin-on-release"))
 * ...PanResponderHandlers
 *
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
var Ferrisel = React.createClass({
    render() {
        return (
            <PanView

                >
                {this.props.pages.map(page => (
                    <Animated.Image
                        style={{
                        transform: [translateX, {
                            translateY: panY.interpolate({
                                inputRange: [0, hxm, hx+1, height+hx],
                                outputRange: [0, 0, 10, height],
                                easing: easing
                            })
                        }, {
                            scale: panY.interpolate({
                                inputRange: [0, hx+1, 0.8*height+hx, height+hx, height + hx + 1],
                                outputRange: [1, 1, 1.4, 1.3, 1.3]
                            })
                        }]
                    }}
                        />
                ))}
            </PanView>
        )
    }
})