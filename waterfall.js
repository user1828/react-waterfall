/**
 * React Waterfall插件 瀑布流组件
 	@author --guoshaodong
	@props data（必选属性前面带＊，非必选项目请备注默认值）
		-column       : 2(默认),               // 瀑布流列数
		-space        : 0.2rem | 10 | 2%      // 间距
		-*renderItems : <div>{value}</div>... // 首屏渲染jsx元素 (不需要key)
	@methods
		- update: function(<div></div>...)    // 新增列表 (不需要key)
	@example
	<Waterfall column={2} space={2} renderItems={<div></div>...} />
	方案
	1、将传入的vNode列表渲染到隐藏的容器中
	2、计算每个单独项的高度，进行模拟排序，得到每列容器应渲染的vNode
	3、根据每列的vNode渲染列表
 */
var utils = require('./utils.js');
var Waterfall = React.createClass({
	getInitialState: function() {
		for(var i = 2;i < Math.max(this.props.column, 2);i++) {
			this.columns.push(0);
			this.columnsVNode.push([]);
		}
		return {
			space: this.props.space || 0
		};
	},
	columns: [0, 0],        // 记录每列的高度
	columnsVNode: [[], []], // 记录每列应渲染的vNode下标值
	realKey: 0,             // vNode的下标值
	componentWillMount: function() {
		this.lazySetColumnStyle = utils.debounce(this.setColumnStyle, 200, this, {leading: true, maxWaiting: 300});
	},
	componentDidMount: function() {
		this.setColumnStyle();
		this.update(this.props.renderItems);
		window.addEventListener('resize', this.lazySetColumnStyle);
	},
	componentWillUnmount: function() {
		window.removeEventListener('resize', this.lazySetColumnStyle);
	},
	// 获取最小列的下标
	getMinColIndex: function() {
		var columns = this.columns;
		return columns.indexOf(Math.min.apply(null, columns));
	},
	lazySetColumnStyle: $.noop,
	// 设置列的宽度和间距
	setColumnStyle: function() {
		var space = String(this.state.space) || '0';
		var spaceValue = parseFloat(space); // 列间距值
		var len = this.columns.length;
		var itemWidth = 0;                  // 每列元素的width
		var containerWidth = $('.waterfall').width();
		// 判断是否有 %
		if(space.indexOf('%') > -1) {
			itemWidth = ((100 - spaceValue * (len - 1)) / len).toFixed(2) + '%';
		} else {
			// 是否有 rem
			if(space.indexOf('rem') > -1) {
				var rpx = parseFloat(getComputedStyle(document.body).fontSize);
				spaceValue *= rpx;
			}else {
				space += 'px';
			}
			itemWidth = ((containerWidth - spaceValue * (len - 1)) / len).toFixed(2) + 'px';
		}
		// 对列表容器设置宽度是为了模拟真实宽度从而得到真实高度
		$('#waterfall-container').css('width', itemWidth);
		$('.waterfall-col').each(function(i, v) {
			$(v).css({
				width: itemWidth,
				marginLeft: i == 0 ? 0 : space
			})
		})
	},
	// 新增瀑布流列表
	update: function(vNode, cb) {
		if(!vNode) {
			throw new Error('Expect param React Element');
		}
		
		var _this = this;
		
		vNode = React.Children.map(vNode, function(child) {
			return React.cloneElement(child, {
				key: _this.realKey++
			});
		});
		
		var fragment = React.createElement(
			'div',
			{ id: 'waterfall-fragment' },
			vNode
		)
		ReactDOM.render(
			fragment,
			document.getElementById('waterfall-container'),
			insertToColumn
		);
		// 插入元素到列表
		function insertToColumn() {
			var childNodes = [].slice.call(document.getElementById('waterfall-fragment').children);
			var childHeight = 0;
			for(var i = 0;i < childNodes.length;i++) {
				var child = childNodes[i];
				var index = _this.getMinColIndex();
				childHeight = child.offsetHeight;
				_this.columns[index] += childHeight;
				_this.columnsVNode[index].push(vNode[i]);
			}

			ReactDOM.unmountComponentAtNode(document.getElementById('waterfall-container'));

			$.each(_this.columnsVNode, function(i, v) {
				var col = document.getElementsByClassName('waterfall-col')[i];
				var fragment = React.createElement('div', null, v);
				ReactDOM.render(fragment, col);
			})
			cb && cb.call(_this);
		}
	},
	// 清空瀑布流列表
	clear: function() {
		this.realKey = 0;
		this.columns = this.columns.map(function() {
			return 0;
		})
		$('.waterfall-col').empty();
	},
	render: function() {
		return (
			<div className="waterfall">
				<div id="waterfall-container" style={{transform: 'translateX(2000px)',position: 'absolute'}}></div>
				<div style={{display: 'flex'}}>
				{
					this.columns.map(function(col, index) {
					return <div
							className="waterfall-col"
							key={index}
						  ></div>
				})}
				</div>
				
			</div>
		);
	}
});

module.exports = Waterfall;
