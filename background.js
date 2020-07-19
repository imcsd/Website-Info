//SHDON Website Info DEV
//V 0.6.0
//Developed by Cstome CHan (www.icsd.ml)

var currentIPList = {};	//定义为Object
// 监听所有已完成的 Web 请求
chrome.webRequest.onCompleted.addListener(function (info) {
	//chrome.webRequest用于监听所有网络请求，需要在manifest.json中申请，.onCompleted.addListener指在请求完成时监听，监听到的数据通过info回调给匿名函数处理;
	// background.js 的console通过插件管理页的inspect查看
	//console.log(currentIPList);	//调试查看 currentIPList 格式
	//console.log(info);			//调试查看 info 格式
	currentIPList[info.url] = [info.ip, info.fromCache, info.requestId, info.statusLine, info.tabId];
	//将监听到的所有网络请求以"url":["ip地址","是否来自缓存","本次请求ID","例：HTTP/1.1 204","标签ID"] 保存到该Object;
	return;
}, {urls: [], types: []}/*不可省的未知含义参数*/);

// 接受标签页发送的信息查询请求
chrome.extension.onMessage.addListener( function (request, sender, sendResponse) {
	//监听页面中注入的main.js中的chrome.extension.sendMessage发送的消息
	//console.log(sender);

	sendResponse({}) // 回信：空

	var currentURL = sender.tab.url;	//定义为发送信息的页面（标签）的url
	if (currentIPList[currentURL] !== undefined) {
		//在currentIPList中查找是否有与标签url相同的记录
		currentIPList[currentURL].push(sender.tab.url);

		let wsInfo = currentIPList[currentURL];
		// 查询IP信息后发送结果给标签页
		getIpInfo(wsInfo[0]).then(ipInfo => {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(wsInfo[4], {
					//有则返回Object
					wsInfo,
					ipInfo
				}, function(response) {
				});
			  });
		})
		currentIPList = {} //当匹配到URL对应的信息后，清空保存的网络请求信息
	}
});


function getIpInfo(ip) {
	let ipInfo = new XMLHttpRequest;
	return new Promise((resolve, reject) => {
		ipInfo.onreadystatechange = function() {
			if(ipInfo.readyState == 4 && ipInfo.status == 200){
				let ipInfoObj = JSON.parse(ipInfo.responseText);
				resolve (ipInfoObj)
			}
		}
		// ipInfo.open('GET',`https://api.nettool.app/ip/?ip=${ip}`, true);
		ipInfo.open('GET',`http://ip-api.com/json/${ip}?lang=zh-CN`, true);
		ipInfo.send();
	})
}