// 响应 ping 消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "ping") {
    sendResponse({ status: "ready" });
    return; // 确认内容脚本已加载
  }

  if (message.action === "showInfo" && message.data) {
    const info = message.data;

    // 创建并显示信息框
    const infoBox = document.createElement("div");
    infoBox.id = "website-info-box";
    infoBox.className = "snotice";
    infoBox.innerHTML = `
      <div><strong>Domain:</strong> ${info.domain}
	 <a href="https://whois.chinaz.com/${info.domain}" target="_blank">whois</a>
	  </div>
      <div><strong>IP:</strong> ${info.ip}</div>
      <div><strong>Region:</strong> ${info.region}</div>
      <div><strong>ISP:</strong> ${info.isp}</div>
      <div><strong>ORG:</strong> ${info.org}</div>
      <div><strong>AS:</strong> ${info.as}</div>
      <div><strong>From Cache:</strong> ${info.fromCache}</div>
      <div><strong>Request ID:</strong> ${info.requestId}</div>
      <div><strong>Status Line:</strong> ${info.statusLine}</div>
      <div><strong>Tab ID:</strong> ${info.tabId}</div>
    `;
    document.body.appendChild(infoBox);

    // 定义移除信息框的逻辑
    let timeoutId;

    const startTimer = () => {
      timeoutId = setTimeout(() => {
        infoBox.remove();
      }, 5000);
    };

    const clearTimer = () => {
      clearTimeout(timeoutId);
    };

    // 监听鼠标事件
    infoBox.addEventListener("mouseenter", clearTimer); // 鼠标移入时停止计时
    infoBox.addEventListener("mouseleave", startTimer); // 鼠标移出时开始计时

    // 初始化计时器
    startTimer();
  }
});
