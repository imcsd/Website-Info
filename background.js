// 检查是否是局域网 IP
function isPrivateIP(ip) {
  const privateRanges = [
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // 10.0.0.0 - 10.255.255.255
    /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/, // 172.16.0.0 - 172.31.255.255
    /^192\.168\.\d{1,3}\.\d{1,3}$/, // 192.168.0.0 - 192.168.255.255
    /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // Loopback 127.0.0.0 - 127.255.255.255
    /^::1$/, // IPv6 Loopback
    /^fc00:/, // IPv6 Unique Local Address
    /^fe80:/, // IPv6 Link-Local
  ];
  return privateRanges.some((range) => range.test(ip));
}

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    // 仅处理主文档请求（类型为 "main_frame"）
    if (details.type === "main_frame" && details.ip && details.tabId > -1) {
      const ip = details.ip || "Unknown";
      const url = new URL(details.url);
      let data = {
        domain: url.hostname,
        ip: ip,
        region: "Private Network", // 默认显示局域网标识
        fromCache: details.fromCache,
        requestId: details.requestId,
        statusLine: details.statusLine,
        tabId: details.tabId,
      };

      if (!isPrivateIP(ip)) {
        // 非局域网 IP 请求 IP 归属地信息
        try {
          const response = await fetch(
            `http://ip-api.com/json/${details.ip}?lang=zh-CN`
          );
          if (response.ok) {
            const ipData = await response.json();
            data.region = ipData
              ? `${ipData.country}, ${ipData.regionName}, ${ipData.city}`
              : "Unknown";
            data.isp = ipData.isp ? ipData.isp : "Unknown";
            data.org = ipData.org ? ipData.org : "Unknown";
            data.as = ipData.as ? ipData.as : "Unknown";
          }
        } catch (error) {
          console.error("Error fetching IP data:", error);
        }
      }

      // 向 content.js 发送数据
      chrome.tabs.sendMessage(details.tabId, { action: "ping" }, (response) => {
        if (chrome.runtime.lastError || !response) {
          console.warn(`Tab ${details.tabId} is not available for messaging.`);
          return;
        }
        chrome.tabs.sendMessage(details.tabId, { action: "showInfo", data });
      });
    }
  },
  { urls: ["<all_urls>"] }
);
