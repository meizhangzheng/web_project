/**
 * 第三种：鸭式辫型接口
 * 实现的核心：一个类实现接口的主要目的是：把接口里的方法都实现（检测方法）
 * 优点：完全面向对象，  代码也实现统一了  也解耦了
 */

/**
 * 第一步：接口类 class Interface ==>实例化N多个接口
 * 接口类需要两个参数：1：接口名称(name  string)
 * 				 2：接收接口方法的名称的集合（数组 methods array）
 */

//命名空间
var MZZ = {}
MZZ.Interface = function(name,methods) {
	//判断接口的参数个数
	if(arguments.length!=2){
		throw new Error('this instance interface constructor argumens must be 2 length!');
	}
	this.name = name;
	//空数组对象，存放对应的方法名称
	this.methods = [];
	for(var i=0,j=methods.length;i<j;i++){
		if(typeof methods[i] !== 'string'){
			throw new Error('the interface method name is error!');
		}
		this.methods.push(methods[i]);
	}
}

/**
 * 第三步：检测接口里的方法
 * 如果检测通过，不做任何操作  如果不通过，浏览器抛异常
 * @param {Object} obj
 */
MZZ.Interface.ensureImplements = function(obj){
	//判断参数个数
	if(arguments.length<2) {
		throw new Error('Interface.ensureImplements method constructor arguments must be >=2 !');
	}
	//循环每个接口
	for(var i=1,argLen = arguments.length;i<argLen;i++) {
		var inter = arguments[i];
		if(inter.constructor !== MZZ.Interface){
			throw new Error('the arguments constructor not be a  Interface!');
		}
		//循环遍历每个接口里的每个方法是否已实现
		for(var j = 0,methodLen = inter.methods.length;j<methodLen;j++){
			var methodName = inter.methods[j];
			if(!obj[methodName] || typeof obj[methodName] !== 'function'){
				throw new Error('the method name "'+methodName +'" is not found!');
			}
		}
	}
	
}

/**
 * 继承
 * @param  {[type]} sub [description]
 * @param  {[type]} sup [description]
 * @return {[type]}     [description]
 */
MZZ.extend = function (sub,sup) {
	//利用一个空函数屏蔽父类的构造函数模板
	var F = new Function();
	F.prototype = sup.prototype;
	sub.prototype = new F();
	//还原子类的构造器
	sub.prototype.constructor = sub;
	//保存父类的原型对象， 1 方便解耦  2 方便获得父类的原型对象
	sub.superClass = sup.prototype;//自定义子类的静态属性 接收父类的原型对象
	//判断父类的构造器  
	if(sup.prototype.constructor === Object.prototype.constructor){
		sup.prototype.constructor = sup;//手动还原父类的构造器
	}
}

/**
 * 单体模式
 * 实现一个跨浏览器的事件处理程序
 */
MZZ.EventUtil = {
	addHandler:function(element,type,handler){
		if(element.addEventListener){ //FF
			element.addEventListener(type,handler,false);
		} else if(element.attachEvent){//IE
			element.attachEvent('on'+type,handler);
		}
	},
	removeHandler:function(element,type,handler){
		if(element.removeEventListener){//FF
			element.removeEventListener(type,handler,false);
		}else if (element.detachEvent) {//IE
			element.detachEvent('on'+type,handler);
		}
	}
}

/**
 * 扩展Array的原型对象
 * 模拟each方法
 * 能够遍历多维数组
 */
Array.prototype.each = function(fn){
	try{
		this.i ||(this.i=0);//如果不存在，则定义i=0并执行这条语句
		if(this.length>0 && fn.constructor===Function){
			while(this.i<this.length){
				var e = this[this.i];
				if(e.constructor === Array){
					e.each(fn);
				} else {
					fn.call(e,e);
				}
				this.i++;
			}
		}
		this.i = null;
	}catch(e){
		//TODO handle the exception
	}
	return this;
}