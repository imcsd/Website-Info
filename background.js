//SHDON Website Info DEV
//V 0.2.2.1
//Developed by Cstome CHan (www.icsd.ml)

var currentIPList = {};	//定义为Object
chrome.webRequest.onCompleted.addListener(function (info) {
	//chrome.webRequest用于监听所有网络请求，需要在manifest.json中申请，.onCompleted.addListener指在请求完成时监听，监听到的数据通过info回调给匿名函数处理；
	console.log(currentIPList);	//调试查看 currentIPList 格式
	console.log(info);			//调试查看 info 格式
	currentIPList[info.url] = [info.ip, info.fromCache, info.requestId, info.statusLine, info.tabId];
	//将监听到的所有网络请求以"url":["ip地址","是否来自缓存","本次请求ID","例：HTTP/1.1 204","标签ID"];
	return;
}, {urls: [], types: []}/*不可省的未知含义参数*/);

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	//监听页面中注入的main.js中的chrome.extension.sendMessage发送的消息
	var currentURL = sender.tab.url;	//定义为发送信息的页面（标签）的url
	if (currentIPList[currentURL] !== undefined) {
		//在currentIPList中查找是否有与标签url相同的记录
		sendResponse({
			//有则返回Object
			wsInfo: currentIPList[currentURL]
		});
	}
	else {
		sendResponse({
			wsInfo: null
			//没有则返回空
		});
	}
});