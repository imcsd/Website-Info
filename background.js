chrome.webRequest.onCompleted.addListener(
  async (details) => {
    // 仅处理主文档请求（类型为 "main_frame"）
    if (details.type === "main_frame" && details.ip && details.tabId > -1) {
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
            ? `${ipData.regionName}, ${ipData.country}`
            : "Unknown",
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
