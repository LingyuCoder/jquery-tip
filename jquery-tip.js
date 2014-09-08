(function($) {
	'use strict';
	var defaultConfig = {
		content: '',
		align: {
			base: 'self',
			points: ['bc', 'tc'],
			fixed: false,
			offset: [0, 0]
		},
		trigger: 'hover',
		css: {
			tip: 'wd-ui-tip',
			arrow: 'wd-ui-tip-arrow'
		},
		arrow: false,
		duration: false
		/*
		{
			type: 'top',
			size: 10,
			color: '#fff',
			offset: 0
		}
		*/
	};

	var $tipTpl = $('<div class="wd-tip"></div>');
	var $body = $('body');
	var $arrowTpl = $('<span class="wd-tip-arrow"></span>');

	function renderArrow($tip, config) {
		$('.wd-tip-arrow', $tip).remove();
		if(!$.isPlainObject(config.arrow)) {
			return;
		}
		var arrow = config.arrow;
		var type = arrow.type;
		var size = arrow.size;
		var color = arrow.color;
		var offset = arrow.offset;
		var $arrow = $arrowTpl.clone();
		$arrow.addClass(config.css.arrow);
		
		var border = {
			top: '',
			left: '',
			right: '',
			bottom: ''
		};
		var align = {
			base: $tip
		};
		switch (type) {
			case 'top':
				border.bottom = size + 'px solid ' + color;
				border.left = border.right = size + 'px solid transparent';
				align.points = ['tc', 'bc'];
				align.offset = [offset, 0];
				break;
			case 'bottom':
				border.top = size + 'px solid ' + color;
				border.left = border.right = size + 'px solid transparent';
				align.points = ['bc', 'tc'];
				align.offset = [offset, 0];
				break;
			case 'left':
				border.right = size + 'px solid ' + color;
				border.top = border.bottom = size + 'px solid transparent';
				align.points = ['cl', 'cr'];
				align.offset = [0, offset];
				break;
			case 'right':
				border.left = size + 'px solid ' + color;
				border.top = border.bottom = size + 'px solid transparent';
				align.points = ['cr', 'cl'];
				align.offset = [0, offset];
				break;
		}
		$.each(border, function(key, value){
			$arrow.css('border-' + key, value);
		});
		$tip.append($arrow);
		$arrow.align(align);
	}

	function show($tip, config, target) {
		var align = $.extend(true, {}, config.align);
		align.base = align.base === 'self' ? $(target) : align.base; 
		$tip.fadeIn().align(align);
		$tip.__curTrigger = target;
		renderArrow($tip, config);
	}

	function hide($tip, config, target) {
		$tip.fadeOut();
	}

	$.fn.tip = function(config) {
		config = $.extend(true, {}, defaultConfig, config);
		var $tip = $tipTpl.clone();
		var self = $(this);
		$tip.html(config.content).hide().addClass(config.css.tip);
		$body.append($tip);
		if (config.trigger === 'hover') {
			self.hover(function(event) {
				show($tip, config, event.target);
			}, function(event) {
				hide($tip, config, event.target);
			});
		} else if (config.trigger === 'click') {
			self.click(function(event) {
				if ($tip.is(':visible') && $tip.__curTrigger === event.target) {
					hide($tip, config, event.target);
				} else {
					show($tip, config, event.target);
					if(typeof config.duration === 'number') {
						setTimeout(function() {
							hide($tip, config, event.target);
						}, config.duration);
					}
				}
			});
		} else if(config.trigger === 'always'){
			show($tip, config, self.get()[0]);
		}
		
	};
})(jQuery);