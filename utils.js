module.exports = {
    debounce: function(fn, delay, context, opt) {
		if(typeof fn !== 'function') throw new TypeError('expect param fn is function!');
		opt = opt || {};
		var timer = null;
		var leading = opt.leading || false;       // 函数开始时调用
		var maxWaiting = opt.maxWaiting || false; // 调用函数最大等待时间，防止迟迟不被调用
		var initialTime = +new Date();
        maxWaiting && (maxWaiting = Math.max(delay, maxWaiting));
		return function() {
			clearTimeout(timer);
			if(leading) {
				fn.apply(context, arguments);
				leading = false;
			}
			if(maxWaiting && new Date() - initialTime >= maxWaiting) {
				fn.apply(context, arguments);
				initialTime = +new Date();
			}
			timer = setTimeout(function() {
				fn.apply(context, arguments);
				maxWaiting && (initialTime = +new Date());
			},  Math.max(delay, 0));
		}
	}
}
