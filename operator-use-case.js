class Foo extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            panY: new Animated.Value(0),
            panX: new Animated.Value(12),
            removeProgress: new Animated.Value(0),
            removeIndex: null
        }
    }

    removeItem(index) {
        // we need to remove a pane from the list of panes.
        // when we do that, we want to animate it out

        this.setState({
            removeIndex: index
        });

        Animated.timing(this.state.removeProgress, {
            toValue: 1
        }).start(() => {
            // reset the progress, actually remove the pane from the list
            this.setState({
                removeIndex: null,
                panes: this.state.panes.remove(index)
            });
            this.state.removeProgress.setValue(0);
        })
    }

    render() {
        var { panes, panY, removeProgress, removeIndex } = this.state;
        return (
            <View
                {...this.responder.panHandlers}
                >
                {panes.map((e, i) => {
                    var x = panes.length - i - 1;
                    var hx = h * x;
                    var hxm = Math.max(hx-h, 0);

                    return <Pane style={{
                        transform: [{
                            // in this case we need to add the values of the `panY` value
                            // and the `removeProgress` value to make the removal of the pane
                            // feel smooth...
                            translateY: Animated.Add(panY,
                                i > removeIndex ? removeProgress.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -h]
                                }) : 0
                            ).interpolate({
                                inputRange: [0, hxm, hx+1, height+hx],
                                outputRange: [0, 0, 10, 30 + height],
                                easing: easing
                            })
                        }]
                    }} />
                })}
            </View>
        );
    }
}