/**
 * React Waterfallexample插件
 	@author --guoshaodong

 */

var Waterfall = require('plugin/waterfall');

var Waterfallexample = React.createClass({
	getInitialState: function() {
		return { };
	},
	randomCount: function(min, max) {
		return Math.floor(Math.random() * ( max - min ) + min);
	},
	randomHeight: function() {
		return this.randomCount(100, 200);
	},
	randomColor: function() {
		var c = this.randomCount;
		var randColor = [c(0,255), c(0,255), c(0,255)].join(',');
		return 'rgb('+randColor+')';
	},
	handleClick: function(value, e) {
		console.log(value, e);
	},
	renderItems: function(count) {
		var arr = [];
		count = count || 100;
		for(var i = 0;i < count;i++) {
			arr.push( i );
		}
		var _this = this;
		return arr.map(function(value) {
			return (<div 
					onClick={_this.handleClick.bind(null, value)}
					style={{
						backgroundColor:_this.randomColor(), 
						color: 'white',
						height:_this.randomHeight()}}
						key={value}
				   	>
						<div>{value}</div>
				   </div>)
		})
	},
	render: function() {
		return (
			<div id="cmr-waterfall-example">
				<Waterfall 
					ref='waterfall'
					space={'.5rem'}
					column={3}
					renderItems={this.renderItems()}
				></Waterfall>
			</div>
		);
	}
});

module.exports = Waterfallexample;
