
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