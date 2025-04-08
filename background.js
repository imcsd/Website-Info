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
      // 检查是否是局域网 IP
      if (isPrivateIP(details.ip)) {
        console.log(`Skipping private IP: ${details.ip}`);
        return; // 不请求 IP 信息
      }

      try {
        const response = await fetch(
          `http://ip-api.com/json/${details.ip}?lang=zh-CN`
        );
        const ipData = await response.json();

        // 构造数据对象
        const url = new URL(details.url); // 获取 URL 对象
        const data = {
          domain: url.hostname, // 提取域名
          ip: details.ip,
          region: ipData
            ? `${ipData.country}, ${ipData.regionName}, ${ipData.city}`
            : "Unknown",
          isp: ipData ? ipData.isp : "Unknown",
          org: ipData ? ipData.org : "Unknown",
          as: ipData ? ipData.as : "Unknown",
          fromCache: details.fromCache,
          requestId: details.requestId,
          statusLine: details.statusLine,
          tabId: details.tabId,
        };

        // 检查目标标签页是否可以接收消息
        chrome.tabs.sendMessage(
          details.tabId,
          { action: "ping" },
          (response) => {
            if (chrome.runtime.lastError || !response) {
              console.warn(
                `Tab ${details.tabId} is not available for messaging.`
              );
              return; // 无法发送消息，跳过
            }

            // 发送真正的数据
            chrome.tabs.sendMessage(details.tabId, {
              action: "showInfo",
              data,
            });
          }
        );
      } catch (error) {
        console.error("Error fetching IP data:", error);
      }
    }
  },
  { urls: ["<all_urls>"] }
);
