document.addEventListener("DOMContentLoaded", async () => {
  const loadingDiv = document.getElementById("loading");
  const infoDiv = document.getElementById("info");
  const errorDiv = document.getElementById("error");
  const copySuccessDiv = document.getElementById("copy-success");

  try {
    // 获取本地 IP 信息
    const response = await fetch("http://ip-api.com/json/?lang=zh-CN");
    const data = await response.json();

    if (data.status === "success") {
      loadingDiv.style.display = "none";
      infoDiv.innerHTML = `
        <p>
          <strong>IP 地址:</strong> ${data.query}
          <button class="copy-button" data-ip="${data.query}">复制</button>
        </p>
        <p><strong>省市区:</strong> ${data.regionName}, ${data.city}</p>
        <p><strong>ISP:</strong> ${data.isp}</p>
        <p><strong>组织:</strong> ${data.org}</p>
        <p><strong>自治系统:</strong> ${data.as}</p>
      `;

      // 绑定复制按钮事件
      const copyButton = document.querySelector(".copy-button");
      copyButton.addEventListener("click", () => {
        const ip = copyButton.getAttribute("data-ip");
        navigator.clipboard
          .writeText(ip)
          .then(() => {
            copySuccessDiv.style.display = "block";
            setTimeout(() => {
              copySuccessDiv.style.display = "none";
            }, 2000);
          })
          .catch((err) => {
            console.error("复制失败：", err);
          });
      });
    } else {
      loadingDiv.style.display = "none";
      errorDiv.textContent = "获取 IP 信息失败。";
    }
  } catch (error) {
    loadingDiv.style.display = "none";
    errorDiv.textContent = "请求失败，请检查网络连接或稍后重试。";
    console.error("Error fetching IP info:", error);
  }
});
