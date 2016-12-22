'use strict';
//JavaScript的函数在查找变量时从自身函数定义开始，从“内”向“外”查找。
//如果内部函数定义了与外部函数重名的变量，则内部函数的变量将“屏蔽”外部函数的变量。
function foo() {
	var x = 1;

	function bar() {
		var x = 'a';
		alert('x in bar() = ' + x);
	}
	alert('x in foo() = ' + x);
	bar();
}


//变量提升
function foo() {
	var x = "hello, " + y;
	//语句var x = 'Hello, ' + y;并不报错，原因是变量y在稍后申明了。
	// 但是alert显示Hello, undefined，说明变量y的值为undefined。
	// 这正是因为JavaScript引擎自动提升了变量y的声明，但不会提升变量y的赋值。
	alert(x);
	var y = 'bob';
}
// 最常见的做法是用一个var申明函数内部用到的所有变量：
function foo() {
	var
		x = 1,
		y = x + 1,
		z, i;
	for (var i = 0; i < 10; i++) {
		z = x + y + i
		alert(z);
	}
}


// 全局作用域
//  不在任何函数内定义的变量就具有全局作用域。
//  实际上，JavaScript默认有一个全局对象window，全局作用域的变量实际上被绑定到window的一个属性：
var course = 'Learn JavaScript';
alert(course);
alert(window.course); //直接访问全局变量course和访问window.course是完全一样的。

function foo() {
	alert('foo');
}
foo();
window.foo(); //顶层函数的定义也被视为一个全局变量，并绑定到window对象：

window.alert('调用window.alert()');
var old_alert = window.alert;
window.alert = function() {};
alert('无法用alert()');
window.alert = old_alert;
alert('又可以使用alert()');
// 这说明JavaScript实际上只有一个全局作用域。
// 任何变量（函数也视为变量），如果没有在当前函数作用域中找到，就会继续往上查找，
// 最后如果在全局作用域中也没有找到，则报ReferenceError错误。


// 名字空间
// 全局变量会绑定到window上，不同的JavaScript文件如果使用了相同的全局变量，
// 或者定义了相同名字的顶层函数，都会造成命名冲突，并且很难被发现。
// 减少冲突的一个方法是把自己的所有变量和函数全部绑定到一个全局变量中。例如：
var MYAPP = {};
MYAPP.name = 'myapp';
MYAPP.version = 1.0;

MYAPP.foo = function() {
	return 'foo';
}


// 局部作用域
// 由于JavaScript的变量作用域实际上是函数内部，我们在for循环等语句块中是无法定义具有局部作用域的变量的
function foo() {
	for (var i = 0; i < 10; i++) {
		console.log(i);
	}
	alert('i === ' + i);
}
// 为了解决块级作用域，ES6引入了新的关键字let，用let替代var可以申明一个块级作用域的变量
function foo() {
	for (let i = 0; i < 10; i++) {
		console.log(i);
	}
	alert('i === ' + i);
}


// 常量
// 由于var和let申明的是变量，如果要申明一个常量，在ES6之前是不行的，我们通常用全部大写的变量来表示“这是一个常量，不要修改它的值”：
// ES6标准引入了新的关键字const来定义常量，const与let都具有块级作用域：
'use strict';
const PI = 3.14;
PI = 3;
PI;


//方法
//在一个对象中绑定函数，称为这个对象的方法。
var jet = {
	name: 'jet',
	birth: 1988,
	age: function() {
		var y = new Date().getFullYear();
		return y - this.birth; //在一个方法内部，this是一个特殊变量，它始终指向当前对象，也就是xiaoming这个变量。所以，this.birth可以拿到xiaoming的birth属性。
	}
}

function getAge() {
	var y = new Date().getFullYear();
	return y - this.birth;
}

var xiaoming = {
	name: '小明',
	birth: 1990,
	age: getAge
};

xiaoming.age(); // 26, 正常结果
getAge(); // NaN
// 单独调用函数getAge()怎么返回了NaN？请注意，我们已经进入到了JavaScript的一个大坑里。
// JavaScript的函数内部如果调用了this，那么这个this到底指向谁？
// 答案是，视情况而定！
// 如果以对象的方法形式调用，比如xiaoming.age()，该函数的this指向被调用的对象，也就是xiaoming，这是符合我们预期的。
// 如果单独调用函数，比如getAge()，此时，该函数的this指向全局对象，也就是window。
// 坑爹啊！
var obj = xiaoming;

function getAge() {
	var y = new Date().getFullYear();
	return y - obj.birth;
}

var xiaoming = {
	name: '小明',
	birth: 1990,
	age: getAge
};
xiaoming.age(); // 26, 正常结果
getAge(); // 26

// 更坑爹的是，如果这么写：
var fn = xiaoming.age; // 先拿到xiaoming的age函数
fn(); // NaN
// 也是不行的！要保证this指向正确，必须用obj.xxx()的形式调用！
// 由于这是一个巨大的设计错误，要想纠正可没那么简单。ECMA决定，在strict模式下让函数的this指向undefined，因此，在strict模式下，你会得到一个错误：
'use strict';
var xiaoming = {
	name: '小明',
	birth: 1990,
	age: function() {
		var y = new Date().getFullYear();
		return y - this.birth;
	}
};
var fn = xiaoming.age;
fn(); // Uncaught TypeError: Cannot read property 'birth' of undefined
// 这个决定只是让错误及时暴露出来，并没有解决this应该指向的正确位置。
'use strict'
var xiaoming = {
	name: 'xiaoming',
	birth: 1992,
	age: function() {
		function getAgeFromBirth() {
			var y = new Date().getFullYear();
			return y - this.birth;
		}
		return getAgeFromBirth();
	}
}
xiaoming.age(); // Uncaught TypeError: Cannot read property 'birth' of undefined
// 结果又报错了！原因是this指针只在age方法的函数内指向xiaoming，在函数内部定义的函数，this又指向undefined了！（在非strict模式下，它重新指向全局对象window！）
// 修复的办法也不是没有，我们用一个that变量首先捕获this：
'use strict';

var xiaoming = {
	name: '小明',
	birth: 1990,
	age: function() {
		var that = this; // 在方法内部一开始就捕获this
		function getAgeFromBirth() {
			var y = new Date().getFullYear();
			return y - that.birth; // 用that而不是this
		}
		return getAgeFromBirth();
	}
};

xiaoming.age(); // 25
// 用var that = this;，你就可以放心地在方法内部定义其他函数，而不是把所有语句都堆到一个方法中。


// apply
// 虽然在一个独立的函数调用中，根据是否是strict模式，this指向undefined或window，不过，我们还是可以控制this的指向的！
// 要指定函数的this指向哪个对象，可以用函数本身的apply方法，它接收两个参数，第一个参数就是需要绑定的this变量，第二个参数是Array，表示函数本身的参数。
// 用apply修复getAge()调用：
function getAge() {
	var y = new Date().getFullYear();
	return y - this.birth;
}

var xiaoming = {
	name: '小明',
	birth: 1990,
	age: getAge
};
xiaoming.age();
getAge.apply(xiaoming, []);

// 另一个与apply()类似的方法是call()，唯一区别是：
// apply()把参数打包成Array再传入；
// call()把参数按顺序传入。
// 比如调用Math.max(3, 5, 4)，分别用apply()和call()实现如下：
Math.max.apply(null, [3, 5, 4]); // 5
Math.max.call(null, 3, 5, 4); // 5
// 对普通函数调用，我们通常把this绑定为null。


// 装饰器
// 利用apply()，我们还可以动态改变函数的行为。
// JavaScript的所有对象都是动态的，即使内置的函数，我们也可以重新指向新的函数。
// 现在假定我们想统计一下代码一共调用了多少次parseInt()，可以把所有的调用都找出来，然后手动加上count += 1，不过这样做太傻了。
// 最佳方案是用我们自己的函数替换掉默认的parseInt()：
function parseInt(a, b) {
	return 1;
}
var count = 0;
var oldParseInt = parseInt;
window.parseInt = function() {
	count += 1;
	return oldParseInt.apply(null, arguments);
}
parseInt("10");

parseInt('11');
count; // 2


// 高阶函数
// JavaScript的函数其实都指向某个变量。既然变量可以指向函数，函数的参数能接收变量，
// 那么一个函数就可以接收另一个函数作为参数，这种函数就称之为高阶函数。
function add(x, y, f) {
	return f(x) + f(y);
}
add(-5, 6, Math.abs); // 11


// map/reduce

// map
function pow(x) {
	return x * x;
}
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
arr.map(pow); //[1, 4, 9, 16, 25, 36, 49, 64, 81]
arr.map(String); //["1", "2", "3", "4", "5", "6", "7", "8", "9"]


// reduce
// Array的reduce()把一个函数作用在这个Array的[x1, x2, x3...]上，这个函数必须接收两个参数，
// reduce()把结果继续和序列的下一个元素做累积计算，其效果就是：[x1, x2, x3, x4].reduce(f) = f(f(f(x1, x2), x3), x4)
var arr = [1, 2, 3, 4];
arr.reduce(function(x, y) {
	return x + y;
}); // 10
arr.reduce(function(x, y) {
	return x * y;
}); // 24

// 要把[1, 3, 5, 7, 9]变换成整数13579，reduce()也能派上用场：
var arr = [1, 3, 5, 7, 9];
arr.reduce(function(x, y) {
	return x * 10 + y;
}); //13579

var s = '13579';
var arr = s.split('');
arr.reduce(function(x, y) {
	return x * 1 * 10 + y * 1;
});

function string2int(s) {
	if (s.length > 1) {
		var arr = s.split('');
		return arr.reduce(function(x, y) {
			return x * 1 * 10 + y * 1;
		});
	} else {
		return s * 1;
	}

}
// 请把用户输入的不规范的英文名字，变为首字母大写，其他小写的规范名字。
// 输入：['adam', 'LISA', 'barT']，输出：['Adam', 'Lisa', 'Bart']。
function normalize(arr) {
	return arr.map(function(x) {
		return x.toUpperCase();
	}).map(function(x) {
		if (x.length > 0) {
			return x[0] + x.substring(1).toLowerCase();
		} else {
			return x;
		}

	});
}
normalize(['a', 'LISA', 'barT']);


// filter
// filter也是一个常用的操作，它用于把Array的某些元素过滤掉，然后返回剩下的元素。
// 和map()类似，Array的filter()也接收一个函数。和map()不同的是，filter()把传入的函数依次作用于每个元素，
// 然后根据返回值是true还是false决定保留还是丢弃该元素。

// 删掉偶数，只保留奇数
var arr = [1, 2, 3, 4, 5];
var r = arr.filter(function(x) {
	return x % 2 != 0;
});
r;

// 把一个Array中的空字符串删掉
var arr = ['a', ' ', 'c', 'b'];
var r = arr.filter(function(s) {
	return s && s.trim();
});
r;


// 回调函数
// filter()接收的回调函数，其实可以有多个参数。通常我们仅使用第一个参数，表示Array的某个元素。
// 回调函数还可以接收另外两个参数，表示元素的位置和数组本身：
var arr = ['A', 'B', 'C'];
var r = arr.filter(function(element, index, self) {
	console.log(element); // 依次打印'A', 'B', 'C'
	console.log(index); // 依次打印0, 1, 2
	console.log(self); // self就是变量arr
	return true;
});
r;

// 利用filter，可以巧妙地去除Array的重复元素：
var
	r,
	arr = ['apple', 'banana', 'pear', 'orange', 'apple', 'banana'];
r = arr.filter(function(element, index, self) {
	return self.indexOf(element) === index; //去除重复元素依靠的是indexOf总是返回第一个元素的位置，后续的重复元素位置与indexOf返回的位置不相等，因此被filter滤掉了。
});
r;

//用filter()筛选出素数
'use strict';

function get_primes(arr) {
	return arr.filter(function(x) {
		if (x === 2) {
			return true
		};
		if (x > 2) {
			if (x % 2 === 0) {
				return false
			};
			for (let i = 3; i <= Math.sqrt(x); i += 2) {
				if (x % i === 0) {
					return false;
				}
			}
			return true;
		}
		return false;
	});
	// return arr.filter(val => !/^.?$|^(..+?)\1+$/.test(Array(val + 1).join('1')));//看不懂
}

// 测试:
var
	x,
	r,
	arr = [];
for (x = 1; x < 100; x++) {
	arr.push(x);
}
r = get_primes(arr);
if (r.toString() === [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97].toString()) {
	alert('测试通过!');
} else {
	alert('测试失败: ' + r.toString());
}


// sort
// 排序算法
// 排序也是在程序中经常用到的算法。无论使用冒泡排序还是快速排序，排序的核心是比较两个元素的大小。如果是数字，我们可以直接比较，
// 但如果是字符串或者两个对象呢？直接比较数学上的大小是没有意义的，因此，比较的过程必须通过函数抽象出来。通常规定，对于两个元素x和y，
// 如果认为x < y，则返回-1，如果认为x == y，则返回0，如果认为x > y，则返回1，这样，排序算法就不用关心具体的比较过程，
// 而是根据比较结果直接排序。
// JavaScript的Array的sort()方法就是用于排序的，但是排序结果可能让你大吃一惊：
// 看上去正常的结果:
['google', 'apple', 'facebook', 'microsoft'].sort(); //["apple", "facebook", "google", "microsoft"]
// apple排在了后面:
["apple", "Facebook", "google", "Microsoft"].sort(); //["Facebook", "Microsoft", "apple", "google"]
// 无法理解的结果:
[10, 1, 2, 20].sort(); //[1, 10, 2, 20]
// 这是因为Array的sort()方法默认把所有元素先转换为String再排序，结果'10'排在了'2'的前面，因为字符'1'比字符'2'的ASCII码小。
// 如果不知道sort()方法的默认排序规则，直接对数字排序，绝对栽进坑里！
// 幸运的是，sort()方法也是一个高阶函数，它还可以接收一个比较函数来实现自定义的排序。
// 要按数字大小排序，我们可以这么写：
var arr = [10, 20, 1, 2];
arr.sort(function(x, y) {
	if (x < y) {
		return -1;
	}
	if (x > y) {
		return 1;
	}
	return 0;
}); //[1, 2, 10, 20]

// 默认情况下，对字符串排序，是按照ASCII的大小比较的，现在，我们提出排序应该忽略大小写，按照字母序排序。要实现这个算法，不必对现有代码大加改动，只要我们能定义出忽略大小写的比较算法就可以：
var arr = ['Google', 'apple', 'Microsoft'];
arr.sort(function(s1, s2) {
	x1 = s1.toUpperCase();
	x2 = s2.toUpperCase();
	if (x1 < x2) {
		return -1;
	}
	if (x1 > x2) {
		return 1;
	}
	return 0;
}); // ['apple', 'Google', 'Microsoft']
// 忽略大小写来比较两个字符串，实际上就是先把字符串都变成大写（或者都变成小写），再比较。
// 从上述例子可以看出，高阶函数的抽象能力是非常强大的，而且，核心代码可以保持得非常简洁。
// 最后友情提示，sort()方法会直接对Array进行修改，它返回的结果仍是当前Array：
var a1 = ['a', 'b', 'd', 'c'];
var a2 = a1.sort();
a1; //["a", "b", "c", "d"]
a2; //["a", "b", "c", "d"]
a1 === a2; //true


// 闭包
// 函数作为返回值
// 高阶函数除了可以接受函数作为参数外，还可以把函数作为结果值返回。
// 我们来实现一个对Array的求和。通常情况下，求和的函数是这样定义的：
function sum(arr) {
	return arr.reduce(function (x, y) {
		return x + y;
	});
}
sum([1, 2, 3, 4]);//10
// 但是，如果不需要立刻求和，而是在后面的代码中，根据需要再计算怎么办？可以不返回求和的结果，而是返回求和的函数！
function lazy_sum(arr) {
	var sum = function(){
		return arr.reduce(function(x, y) {
			return x + y;
		});
	}
	return sum;
}
var f = lazy_sum([1, 2, 3, 4]);
f(); // 10
// 在这个例子中，我们在函数lazy_sum中又定义了函数sum，并且，内部函数sum可以引用外部函数lazy_sum的参数和局部变量，
// 当lazy_sum返回函数sum时，相关参数和变量都保存在返回的函数中，这种称为“闭包（Closure）”的程序结构拥有极大的威力。
// 请再注意一点，当我们调用lazy_sum()时，每次调用都会返回一个新的函数，即使传入相同的参数：
var f1 = lazy_sum([1, 2, 3, 4, 5]);
var f2 = lazy_sum([1, 2, 3, 4, 5]);
f1 === f2; // false
// f1()和f2()的调用结果互不影响。


// 闭包
// 注意到返回的函数在其定义内部引用了局部变量arr，所以，当一个函数返回了一个函数后，其内部的局部变量还被新函数引用，
// 所以，闭包用起来简单，实现起来可不容易。
// 另一个需要注意的问题是，返回的函数并没有立刻执行，而是直到调用了f()才执行。我们来看一个例子：
function count() {
	var arr = [];
	for(var i = 1; i <= 3; i ++) {
		arr.push(function() {
			return i * i;
		});
	}
	console.log(arr);
	return arr;
}

var results = count();
var f1 = results[0];
var f2 = results[1];
var f3 = results[2];
// 在上面的例子中，每次循环，都创建了一个新的函数，然后，把创建的3个函数都添加到一个Array中返回了。
// 你可能认为调用f1()，f2()和f3()结果应该是1，4，9，但实际结果是：
f1(); // 16
f2(); // 16
f3(); // 16
// 全部都是16！原因就在于返回的函数引用了变量i，但它并非立刻执行。等到3个函数都返回时，它们所引用的变量i已经变成了4，因此最终结果为16。

// 返回闭包时牢记的一点就是：返回函数不要引用任何循环变量，或者后续会发生变化的变量。

// 如果一定要引用循环变量怎么办？方法是再创建一个函数，用该函数的参数绑定循环变量当前的值，无论该循环变量后续如何更改，已绑定到函数参数的值不变：
function count() {
	var arr = [];
	for (var i = 1; i <= 3; i++) {
		arr.push(function(n) {
			return function() {
				return n * n;
			}
		}(i)); //注意这里用了一个“创建一个匿名函数并立刻执行”的语法：
		// 理论上讲，创建一个匿名函数并立刻执行可以这么写：
		// function (x) { return x * x } (3);
		// 但是由于JavaScript语法解析的问题，会报SyntaxError错误，因此需要用括号把整个函数定义括起来：
		// (function (x) { return x * x }) (3);
	}
	return arr;
}
var results = count();
var f1 = results[0];
var f2 = results[1];
var f3 = results[2];

f1(); // 1
f2(); // 4
f3(); // 9

// 闭包有非常强大的功能。举个栗子：
// 在面向对象的程序设计语言里，比如Java和C++，要在对象内部封装一个私有变量，可以用private修饰一个成员变量。
// 在没有class机制，只有函数的语言里，借助闭包，同样可以封装一个私有变量。我们用JavaScript创建一个计数器：
'use strict';
function create_counter(initial){
	var x = initial || 0;
	return {
		inc: function() {
			x += 1;
			return x;
		}
	}
}
var c1 = create_counter();
c1.inc(); // 1
c1.inc(); // 2
c1.inc(); // 3

var c2 = create_counter(10);
c2.inc(); // 11
c2.inc(); // 12
c2.inc(); // 13
// 在返回的对象中，实现了一个闭包，该闭包携带了局部变量x，并且，从外部代码根本无法访问到变量x。换句话说，闭包就是携带状态的函数，并且它的状态可以完全对外隐藏起来。
// 闭包还可以把多参数的函数变成单参数的函数。例如，要计算xy可以用Math.pow(x, y)函数，不过考虑到经常计算x2或x3，我们可以利用闭包创建新的函数pow2和pow3：
function make_pow(x) {
	return function(y) {
		return Math.pow(y, x);
	}
}
var pow2 = make_pow(2);
var pow3 = make_pow(3);

pow2(5); //25
pow3(5); //125

'use strict';

// 定义数字0:
var zero = function (f) {
    return function (x) {
        return x;
    }
};

// 定义数字1:
var one = function(f) {
	return function(x) {
		return f(x);
	}
};

// 定义加法:
function add(n, m) {
	return function(f) {
		return function(x) {
			return m(f)(n(f)(x));
		}
	}
}
// 计算数字2 = 1 + 1:
var two = add(one, one);

// 计算数字3 = 1 + 2:
var three = add(one, two);

// 计算数字5 = 2 + 3:
var five = add(two, three);

// 你说它是3就是3，你说它是5就是5，你怎么证明？

// 呵呵，看这里:

// 给3传一个函数,会打印3次:
(three(function() {
	console.log('print 3 times');
}))();

// 给5传一个函数,会打印5次:
(five(function() {
	console.log('print 5 times');
}))();

var one = function(f) {
	return function(x) {
		return f(x);
	}
}
one; //function(f) {
return function(x) {
	return f(x);
}
}
one(); //function(x) {
return f(x);
}
one(function() {
		console.log('print');
	})
	(x) {
		return f(x);
	}


// Arrow Function（箭头函数）
// 为什么叫Arrow Function？因为它的定义用的就是一个箭头：
x => x * x；
// 上面的箭头函数相当于：
function (x) {
    return x * x;
}
// 箭头函数相当于匿名函数，并且简化了函数定义。箭头函数有两种格式，一种像上面的，只包含一个表达式，连{ ... }和return都省略掉了。
// 还有一种可以包含多条语句，这时候就不能省略{ ... }和return：
x => {
	if(x > 0) {
		return x * x;
	} else {
		return - x * x;
	}
}
// 如果参数不是一个，就需要用括号()括起来：
(x, y) => x * x + y * y
// 无参数:
() => 3.14;
// 可变参数:
(x, y, ...rest) => {
	var 
		i,
		sum = x + y;
		for (var i = 0; i < rest.length; i++) {
			sum += rest[i];
		}
		return sum;
}
// 如果要返回一个对象，就要注意，如果是单表达式
x => ({ foo: x })


// this
// 箭头函数看上去是匿名函数的一种简写，但实际上，箭头函数和匿名函数有个明显的区别：箭头函数内部的this是词法作用域，由上下文确定。
var obj = {
	birth: 1988,
	getAge: function() {
		var b = this.birth;
		var fn = () => new Date().getFullYear() - this.birth;
		return fn();
	}
}

obj.getAge();

var obj = {
	birth: 1988,
	getAge: function(year) {
		var b = this.birth;
		var fn = (y) => y - this.birth;
		return fn.call({birth:2000}, year);//由于this在箭头函数中已经按照词法作用域绑定了，所以，用call()或者apply()调用箭头函数时，无法对this进行绑定，即传入的第一个参数被忽略：
	}
}
obj.getAge(2016);


// generator
// generator（生成器）是ES6标准引入的新的数据类型。一个generator看上去像一个函数，但可以返回多次
// generator跟函数很像，定义如下：
function* foo(x) {
	yield x + 1;
	yield x + 2;
	return x + 3;
}
// generator和函数不同的是，generator由function*定义（注意多出的*号），并且，除了return语句，还可以用yield返回多次。
// 我们以一个著名的斐波那契数列为例，它由0，1开头：
// 0 1 1 2 3 5 8 13 21 34 ...
function fib(max) {
	var 
		t, 
		a = 0,
		b = 1,
		arr = [0, 1];
	while(arr.length < max) {
		t = a + b;
		a = b;
		b = t;
		arr.push(t);
	}
	return arr;
}
fib(10); //[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
// 函数只能返回一次，所以必须返回一个Array。但是，如果换成generator，就可以一次返回一个数，不断返回多次。用generator改写如下：
function* fib(max){
	var 
		t,
		a = 0,
		b = 1,
		n = 1;
	while(n < max) {
		yield a;
		t = a + b;
		a = b;
		b = t;
		n ++;
	}
	return a;
}
fib(5);
// fib {[[GeneratorStatus]]: "suspended"}
// fib
// __proto__: Generator
// [[GeneratorStatus]]: "suspended"
// [[GeneratorFunction]]: (max)
// [[GeneratorReceiver]]: Window
// [[GeneratorLocation]]: VM37920:1

// 直接调用一个generator和调用函数不一样，fib(5)仅仅是创建了一个generator对象，还没有去执行它。
// 调用generator对象有两个方法，一是不断地调用generator对象的next()方法：
var f = fib(5);
f.next(); // {value: 0, done: false}
f.next(); // {value: 1, done: false}
f.next(); // {value: 1, done: false}
f.next(); // {value: 2, done: false}
f.next(); // {value: 3, done: true}
var f = fib(5);
f.next().value //0
f.next().value //1
f.next().value //1
f.next().value //2
f.next().value //3
// next()方法会执行generator的代码，然后，每次遇到yield x;就返回一个对象{value: x, done: true/false}，
// 然后“暂停”。返回的value就是yield的返回值，done表示这个generator是否已经执行结束了。如果done为true，则value就是return的返回值。
while(f.next().done){
	console.log('a');
	f.next();
}
// 第二个方法是直接用for ... of循环迭代generator对象，这种方式不需要我们自己判断done：
for(var x of fib(10)) {
	console.log(x);
}

// generator和普通函数相比，有什么用？
// 因为generator可以在执行过程中多次返回，所以它看上去就像一个可以记住执行状态的函数，利用这一点，写一个generator就可以实现需要用面向对象才能实现的功能。例如，用一个对象来保存状态，得这么写：
var fib = {
    a: 0,
    b: 1,
    n: 0,
    max: 5,
    next: function () {
        var
            r = this.a,
            t = this.a + this.b;
        this.a = this.b;
        this.b = t;
        if (this.n < this.max) {
            this.n ++;
            return r;
        } else {
            return undefined;
        }
    }
};
// 用对象的属性来保存状态，相当繁琐。
// generator还有另一个巨大的好处，就是把异步回调代码变成“同步”代码。这个好处要等到后面学了AJAX以后才能体会到。
// 没有generator之前的黑暗时代，用AJAX时需要这么写代码：
ajax('http://url-1', data1, function (err, result) {
    if (err) {
        return handle(err);
    }
    ajax('http://url-2', data2, function (err, result) {
        if (err) {
            return handle(err);
        }
        ajax('http://url-3', data3, function (err, result) {
            if (err) {
                return handle(err);
            }
            return success(result);
        });
    });
});
// 回调越多，代码越难看。
// 有了generator的美好时代，用AJAX时可以这么写：
try {
    r1 = yield ajax('http://url-1', data1);
    r2 = yield ajax('http://url-2', data2);
    r3 = yield ajax('http://url-3', data3);
    success(r3);
}
catch (err) {
    handle(err);
}
// 看上去是同步的代码，实际执行是异步的。

// 练习
// 要生成一个自增的ID，可以编写一个next_id()函数：
var current_id = 0;
function next_id() {
    current_id ++;
    return current_id;
}
// 由于函数无法保存状态，故需要一个全局变量current_id来保存数字。
// 不用闭包，试用generator改写：
'use strict';
function* next_id(){
	var i = 1;
	while(true){
		yield i++;
	}
}
var 
	x,
	pass = true,
	g = next_id();
for( x = 1; x < 100; x ++) {
	if(g.next().value != x) {
		pass = false;
		alert('test fail');
		break;
	}
}
if (pass) {
	alert('test success!');
}























































