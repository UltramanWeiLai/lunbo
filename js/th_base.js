//轮播插件（新）
(function($){
	var imgSlide = {
		//入口，初始化
		init: function(node,args){
			var _this = this;
			return (function(){
				//初始化计数参数
				args.myCount = 0;
				//获取子元素（轮播单位）的个数
				args.childrenNumber = parseInt( $(node).children().length );			
				//获取子元素（轮播单位）的宽度,当子元素的宽度为零时，判断用户是否设置了width，如果没有则取父元素宽度
				args.childrenWidth =  parseInt( $(node).children().width() );
				if(args.childrenWidth == 0){
					if(args.width){
						args.childrenWidth = args.width;
					}else {
						args.childrenWidth = $(node).parent().width();
					};
				}
				//获取子元素（轮播单位）的高度，当子元素的高度为零时，判断用户是否设置了height，如果没有则提示用户设置高度
				args.childrenHeight = parseInt( $(node).children().height() );
//				if(args.childrenHeight == 0){
//					if(args.height){
//						args.childrenHeight = args.height;
//					}else {
//						console.log('请设定一下高度');
//					};
//				}
				//给父元素设置高度（即为轮播板块的高度）,当用户有设置的时候高度为用户设置的，当用户没有设置的时候即为轮播单位的高度
				if(args.height) $(node).parent().css('height', args.height);
				else $(node).parent().css('height', args.childrenHeight);
				//设置背景图片且设置一些默认样式
				_this.bgImgStyle(node,args);
				//转跳到方向
				_this.direction(node,args);	
			})();
		},
		//设置背景图片让其达到可以不缩放且居中的效果
		bgImgStyle: function(node,args){
			return (function(){
				//获取子元素（轮播单位）数组
				var children = $(node).children();
				//对子元素（轮播单位）数组进行循环，将其自定义属性中的data-img取出并给子元素（轮播单位）设置样式				
				children.each(function(i){
					//获取图片路径
					var childrenImg = $(this).attr('data-img');
										
					//设置样式
					$(this).css('width',args.childrenWidth);
					$(this).css('height',args.childrenHeight);
						//检测有没有data-img属性
						if(!childrenImg) return;
					$(this).css('background-image','url(' + childrenImg + ')');
					$(this).css('background-position','top center');
					$(this).css('background-repeat','no-repeat');
					
				});
			})();
		},
		//方向
		direction: function(node,args){
			var _this = this;
			return (function(){
				if(args.direction == 'transverse'){//左右滑动
					//设置轮播单位父元素的宽度
					args.maxWidth = args.childrenNumber * args.childrenWidth;
					$(node).css('width', args.maxWidth);	
					//为假，用户没有设置滑动数值
					if(!args.width){
						//将轮播单位的宽度赋予滑动数值
						args.width = args.childrenWidth;
					}
				}else if(args.direction == 'longitudinal'){//上下滑动
					//设置轮播单位父元素的宽度
					args.maxHeight = args.childrenNumber * args.childrenHeight;
					$(node).css('height', args.maxHeight);
					//为假，用户没有设置滑动数值
					if(!args.height){
						//将轮播单位的宽度赋予滑动数值
						args.height = args.childrenHeight;
					}
				}
				//进入事件绑定
				_this.addEvent(node,args);
			})();
		},
		//事件绑定
		addEvent: function(node,args){
			var _this = this;
			return (function(){
				//判断是否要自动生成滑动按钮
				if(args.slideButton){
					//进入轮播按钮生成事件（会自动判断是否要自动生成）
					_this.slideButton(node,args);
					//进行事件绑定
					$(document).on('click', args.slideButtonLeft, function(){ _this.leftTop(node,args); });
					$(document).on('click', args.slideButtonRight, function(){ _this.rightBottom(node,args); });
					//定时器绑定
					_this.timer = setInterval(function(){
						_this.rightBottom(node,args);
					},args.timer);
				}
			})();
		},
		//按钮
		slideButton: function(node,args){
			return (function(){				
				//通过循环来生成id
				for(var i = 1; i; i++){
					//判断当前循环的id是否存在
					if( !($('#slideButtonLeft' + i).length > 0) && !($('#slideButtonRight' + i).length > 0) ){
						//记录循环生成的id
						args.slideButtonLeft = '#slideButtonLeft' + i;
						args.slideButtonRight = '#slideButtonRight' + i;
						//生成对应id的按钮及元素
						var html = '<i id="slideButtonLeft' + i + '"></i><i id="slideButtonRight' + i + '"></i>';
						//将元素创建出来
						$(node).before(html);
						return ;
					}
				}
			})();
		},
		//计数（用来计算当前轮播位置以及轮播滑动的数值的）
		leftTop: function(node,args){
			var _this = this;
			return (function(){
				//计数增加
				args.myCount--;
				//进入计数判断
				_this.judge(node,args);
			})();
		},
		rightBottom: function(node,args){
			var _this = this;
			return (function(){
				//计数减少
				args.myCount++;
				//进入计数判断
				_this.judge(node,args);
			})();
		},
		//动效判断（判断当轮播到第一张最后一张的时候会进行连接跳跃）
		judge: function(node,args){
			var _this = this;
			return (function(){	
				//计数判断
				if(args.myCount >= args.childrenNumber){//当计数大于轮播单位个数时，直接归零从头开始轮播
					args.myCount = 0;					
				}else if(args.myCount < 0){//当计数小于零时，计数直接最大值，轮播至末尾
					args.myCount = args.childrenNumber - 1;					
				}//当之前的条件都不满足时，即代表计数大于零且小于轮播单位个数
				//停止定时器
				clearInterval( _this.timer );
				//进入动效
				_this.animation(node,args);				
			})();
		},
		//动效
		animation: function(node,args){
			var _this = this;
			return (function(){
				if(args.direction == 'transverse'){//左右
					$(node).animate({ left: -(args.myCount) * args.childrenWidth + 'px' });
				}else if(args.direction == 'longitudinal'){//上下
					$(node).animate({ top: -(args.myCount) * args.childrenHeight + 'px' });
				}
				//启动定时器
				_this.timer = setInterval(function(){
					_this.rightBottom(node,args);
				},args.timer);
			})();
		},
		//点
		dots: function(node,args){
			return (function(){
				var html = '';
				//通过循环来生成id
				for(var i = 1; i; i++){
					//判断当前循环生成的id是否存在
					if(!($('#slideDots' + i).length > 0) ){
						//记录生成的id
						args.slideDots = '#slideDots' + i;
						//生成html代码
						html += '<div><ol id="slideDots' + i + '">';
						for(var j = 0; j < args.childrenNumber; j++){
							if(i == 0) html += '<li class="selected" data-rank="' + i + '">&nbsp;</li>';
							else html += '<li data-rank="' + i + '">&nbsp;</li>';
						}
						html += '</ol></div>';
						//在父元素的后面添加节点
						$(node).parent().after(html);
						//添加点击事件
						$(documen).on('click',args.slideDots,function(){
							//更换选中效果
							$(this).addClass('selected').siblings().removeClass('selected');
							if(args.direction == 'transverse'){//左右
								$(node).animate({ left: -( parseInt( $(this).attr('data-rank') ) ) * args.childrenWidth + 'px' });
							}else if(args.direction == 'longitudinal'){//上下
								$(node).animate({ top: -( parseInt( $(this).attr('data-rank') ) ) * args.childrenHeight + 'px' });
							}
						});
					}
					return ;
				};
				
			})();
		}
	};
	//将函数绑定到
	$.fn.ImgSlide = function(options){
		//参数
		var args = $.extend({
			width: false,//宽度
			height: false,//高度
			direction: 'transverse',//方向 longitudinal（上下） transverse（左右）
			slideButton: true,//是否需要滑动按钮
			timer: 5000,//定时器，自动轮播时间
			dots: false//是否需要记号点	
		},options);
		//函数初始化
		imgSlide.init(this,args);
	};
})(jQuery);
