// 页面打开后，发送请求到 background.js 请求相关信息
chrome.extension.sendMessage({}/*发送信息的内容，这里为空Object，但不能没有*/, function (response) {
	//匿名函数处理background.js返回的数据，通过参数response传递
});

// 接受 background.js 传来的相关信息
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	console.log(request);
	displayInfo(request);
	sendResponse({})
});

//SHDON Notice 模块
function showNotice(c, t) {
	var ntdiv = document.createElement("div");
	ntts = new Date().getTime();
	ntdiv.className = "snotic"
	ntdiv.id = "snotic" + ntts;
	ntdiv.innerHTML = c;
	document.body.appendChild(ntdiv);
	var setTimeoutCode = "document.body.removeChild(document.getElementById('snotic"+ntts+"'))";
	setTimeout(setTimeoutCode, t);
}

//urlToDomain 模块 v0.2.1
function urlToDomain(url) {
	var reg = new RegExp("//.*?/", "i");
	var domain = url.match(reg)[0];
	domain = domain.replace(/[\/]/g, "");
	return domain;
}

//display responsed data
function displayInfo(r) {
	let wsInfo = r.wsInfo;
	let ipInfo = r.ipInfo;

	let t = `
		Domain: ${urlToDomain(wsInfo[5])}
		<a target=\"_blank\" href=\"http://whois.chinaz.com/${urlToDomain(wsInfo[5])}\">Whois</a>
		<br>IP: ${wsInfo[0]}
		<br>IP Area: ${ipInfo.country} ${ipInfo.regionName} ${ipInfo.city}
		<br>AS: ${ipInfo.as}
		<br>fromCache: ${wsInfo[1]}
		<br>requestId: ${wsInfo[2]}
		<br>statusLine: ${wsInfo[3]}
		<br>tabId: ${wsInfo[4]}`;

	showNotice(t, 5000);
}