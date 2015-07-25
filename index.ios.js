/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var { AppRegistry } = React;

var PageScroller = require('./examples/PageScroller');
var CoverFlow = require('./examples/CoverFlow');
var AnimatedFormula = require('./examples/AnimatedFormula');
var PullToRefresh = require('./examples/PullToRefresh');
var Tree = require('./examples/PullToRefresh/Tree');

var react_native_animation_examples = React.createClass({
    render: function () {
        //return <PageScroller />
        //return <CoverFlow />
        //return <AnimatedFormula />
        return <PullToRefresh />
        //return <Tree/>
    }
});

AppRegistry.registerComponent('react_native_animation_examples', () => react_native_animation_examples);
