var React = require('react-native');
var {
    StyleSheet,
    Text,
    View,
    PropTypes,
    Animated,
    } = React;

var Svg = require('react-native-svg');
var { Path } = Svg;

var Tree = React.createClass({

    propTypes: {
        bodyColor: PropTypes.string,
        trunkColor: PropTypes.string,
        height: PropTypes.number,
        wiggle: PropTypes.any, // Animated prop
    },

    getDefaultProps() {
        return {
            bodyColor: '#207277',
            trunkColor: '#205e66',
            height: 225,
            wiggle: new Animated.Value(0),
        };
    },

    render() {
        var { trunkColor, bodyColor, height, wiggle } = this.props;

        //wiggle = wiggle.getAnimatedValue();

        var width = height * 120 / 225;

        var abs = Math.abs(wiggle);

        var rIn  = 100 + 400 * (1 / (abs + 0.1)) - abs * 340;
        var rOut = 360 + 400 * (1 / (abs + 0.1));
        var rTrunk = -200 + 500 * (1 / (abs + 0.1));

        var dx = wiggle * 6;

        var girth = 25; // half-width of tree body
        var x0 = 60; // left-offset of trunk center
        var y0 = 225; // y offset of trunk bottom
        var y1 = y0-75; // bottom of tree
        var y3 = y1-150; // top of tree
        var y2 = y0-145; // top of trunk

        if (wiggle < 0) {
            var tmp = rIn;
            rIn = rOut;
            rOut = tmp;
        }

        var treeBody = `
            M ${x0 - girth + dx} ${y1}
            A ${girth} ${girth + 4} 0 1 0 ${x0 + girth + dx} ${y1}
            A ${rIn*0.25} ${rIn} 0 0 ${wiggle>0 ? 1 : 0} ${x0 + dx + wiggle * 50} ${y3 + abs * 10}
            A ${rOut*0.25} ${rOut} 0 0 ${wiggle>0 ? 0 : 1} ${x0 - girth + dx} ${y1}
            Z
        `;
        var trunk = `
            M ${x0 - 3} ${y0}
            A ${rTrunk*0.25} ${rTrunk} 0 0 ${wiggle>0 ? 1 : 0} ${x0 + dx + wiggle * 20} ${y2}
            A ${rTrunk*0.25} ${rTrunk} 0 0 ${wiggle>0 ? 0 : 1} ${x0 + 3} ${y0}
            Z
        `;
        return (
            <Svg
                width={120}
                height={225}
                style={[{
                    width: width,
                    height: height
                }, this.props.style]}
                forceUpdate={treeBody}>
                <Path
                    fill={bodyColor}
                    stroke="none"
                    strokeWidth="3"
                    d={treeBody} />
                <Path
                    fill={trunkColor}
                    stroke="none"
                    strokeWidth="3"
                    d={trunk} />
            </Svg>
        );
    }
});

module.exports = Animated.createAnimatedComponent(Tree);