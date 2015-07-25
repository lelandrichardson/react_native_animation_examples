var React = require('react-native');
var {
    StyleSheet,
    Text,
    View,
    PropTypes,
    } = React;

var Svg = require('react-native-svg');
var { Path } = Svg;
var TimerMixin = require('react-timer-mixin');

var Tree = React.createClass({

    mixins: [TimerMixin],

    propTypes: {
        bodyColor: PropTypes.string,
        trunkColor: PropTypes.string,
        height: PropTypes.number,
    },

    getDefaultProps() {
        return {
            bodyColor: '#207277',
            trunkColor: '#205e66',
            height: 200,
        };
    },

    getInitialState() {
        return { wiggle: 0, up: true }
    },

    componentDidMount() {
        this.setInterval(this.updateWiggle, 16);
    },

    updateWiggle() {
        var { wiggle, up } = this.state;
        wiggle = wiggle + (up ? 1 : -1) * 0.1;

        this.setState({
            wiggle,
            up: Math.abs(wiggle) >= 0.9 ? !up : up
        });
    },

    render() {
        var { wiggle } = this.state;
        var { trunkColor, bodyColor, height } = this.props;

        var abs = Math.abs(wiggle);

        var rIn  = 100 + 400 * (1 / (abs + 0.1)) - abs * 340;
        var rOut = 360 + 400 * (1 / (abs + 0.1));
        var rTrunk = -200 + 500 * (1 / (abs + 0.1));

        var dx = wiggle * 6;

        if (wiggle < 0) {
            var tmp = rIn;
            rIn = rOut;
            rOut = tmp;
        }

        var treeBody = `
            M ${95 + dx} 250
            A 30 34 0 1 0 ${155+dx} 250
            A ${rIn*0.25} ${rIn} 0 0 ${wiggle>0 ? 1 : 0} ${125 + dx + wiggle * 50} ${100 + abs * 10}
            A ${rOut*0.25} ${rOut} 0 0 ${wiggle>0 ? 0 : 1} ${95+dx} 250
            Z
        `;
        var trunk = `
            M 122 325
            A ${rTrunk*0.25} ${rTrunk} 0 0 ${wiggle>0 ? 1 : 0} ${125 + dx + wiggle * 20} ${180}
            A ${rTrunk*0.25} ${rTrunk} 0 0 ${wiggle>0 ? 0 : 1} 128 325
            Z
        `;
        return (
            <Svg
                width={325}
                height={325}
                style={{
                    width: 325,
                    height: 325,
                    margin: 40,
                }}
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

module.exports = Tree;