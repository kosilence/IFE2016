<h2>任务三十六：听指令的小方块（四）</h2>
<h3>任务目的</h3>
<ul>
	<li>练习JavaScript在DOM、字符串处理相关知识</li>
	<li>利用JavaScript实践寻路相关算法</li>
</ul>

<h3>任务描述</h3>
<ul>

	<li><a target="_blank" href="http://7xrp04.com1.z0.glb.clouddn.com/task_2_36_1.jpg">如图</a>，新增元素“墙”，墙是正方形不可进入、越过的区域</li>
	<li>新增修墙的指令，BUILD，执行指令时，会在当前方块面对的方向前修建一格墙壁，如果被指定修墙的地方超过边界墙或者已经有墙了，则取消修墙操作，并调用浏览器的console.log方法打印一个错误日志</li>
	<li>新增粉刷的指令，BRU color，color是一个字符串，保持和css中颜色编码一致。执行指令时，如果当前方块蓝色边面对方向有紧相邻的墙，则将这个墙颜色改为参数颜色，如果没有，则通过调用浏览器的console.log方法，打印一个错误日志</li>
	<li>尝试写一段代码，实现在空间内修建一个长长的五颜六色的墙或者有趣的图形</li>

	<li>新增一个按钮，可以在空间内随机生成一些墙</li>
	<li>增加一个指令：MOV TO x, y，会使得方块从当前位置移动到坐标为x，y的地方，移动过程中不能进入墙所在的地方，寻路算法请自行选择并实现，不做具体要求</li>

</ul>

<h3>任务注意事项</h3>
<ul>
	<li>实现功能的同时，请仔细学习JavaScript相关的知识</li>
	<li>请注意代码风格的整齐、优雅</li>
	<li>代码中含有必要的注释</li>
	<li>建议不使用任何第三方库、框架</li>
	<li>寻路算法可以参考已有代码，但不建议直接引用现成的算法文件，最起码自己敲一遍</li>
	<li>有余力的同学，可以实现多种寻路算法，并在MOV TO指令中增加算法的选择功能，比如MOV TO x,y BY xxx（算法标示）</li>
</ul>

<h3>任务协作建议</h3>
<ul>
	<li>如果是各自工作，可以按以下方式：
		<ul>
			<li>团队集中讨论，明确题目要求，保证队伍各自对题目要求认知一致</li>
			<li>各自完成任务实践</li>
			<li>交叉互相Review其他人的代码，建议每个人至少看一个同组队友的代码</li>
			<li>相互讨论，最后合成一份组内最佳代码进行提交</li>
		</ul>
	</li>
	<li>如果是分工工作（推荐），可以按以下模块切分
		<ul>
			<li>墙相关的功能</li>
			<li>碰撞检测</li>
			<li>新指令的解析</li>
			<li>各种寻路算法，可以每人实现一个</li>
		</ul>
	</li>
</ul>

<h3>在线学习参考资料</h3>
<ul>
	<li><a target="_blank" href="http://www.imooc.com/view/36">JavaScript入门篇</a></li>
	<li><a target="_blank" href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript">MDN JavaScript</a></li>
	<li><a target="_blank" href="http://qiao.github.io/PathFinding.js/visual/">各种寻路算法的可视化呈现</a></li>
</ul></div>
