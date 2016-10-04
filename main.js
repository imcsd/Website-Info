chrome.extension.sendMessage({}/*发送信息的内容，这里为空Object，但不能没有*/, function (response) {
	//匿名函数处理background.js返回的数据，通过参数response传递
	console.log(response);	//调试查看返回的数据
	getIpInfo(response);	//回调 在页面中显示返回数据
});

//SHDON Notice 模块
function showNotice(c, t) {
	var ntdiv = document.createElement("div");
	ntdiv.id = "snotic";
	ntdiv.innerHTML = c;
	document.body.appendChild(ntdiv);
	setTimeout("document.body.removeChild(document.getElementById('snotic'))", t)
}

//display responsed data
function displayInfo(r) {
	var t = "IP: " + r.wsInfo[0] +"<br>IP Info: " + showIpInfo(ipInfoObj) + "<br>fromCache: " + r.wsInfo[1] + "<br>requestId: " + r.wsInfo[2] + "<br>statusLine: "+ r.wsInfo[3]  + "<br>tabId: " + r.wsInfo[4];
	showNotice(t, 5000);
}

function getIpInfo(r) {
	var ipInfo = new XMLHttpRequest;
	ipInfo.onreadystatechange = function() {
		if(ipInfo.readyState == 4 && ipInfo.status == 200){
			ipInfoObj = JSON.parse(ipInfo.responseText);
			displayInfo(r);
		}
	}
	ipInfo.open('GET','https://freeapi.ipip.net/'+r.wsInfo[0], true);
	ipInfo.send();
}

function showIpInfo(ipObj) {
	var ipStr = "";
	for(i=0; i<ipObj.length; i++) {
		ipStr += ipObj[i] + " ";
	}
	return ipStr;
}