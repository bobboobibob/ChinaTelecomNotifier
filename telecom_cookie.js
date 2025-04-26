const cookieKey = "telecom_cookie";
const apiKey = "telecom_api";
const url = $request.url;
const headers = $request.headers;

// 捕获Cookie
if (headers && headers["Cookie"]) {
    $persistentStore.write(headers["Cookie"], cookieKey);
    $notification.post("中国电信", "Cookie获取成功", "已保存Cookie用于查询");
} else {
    $notification.post("中国电信", "Cookie获取失败", "未找到Cookie");
}

// 捕获API地址（匹配包含bill, query, balance, flow, biz等关键词的URL）
if (url.includes("app.10086.cn") && /bill|query|balance|flow|biz/i.test(url)) {
    $persistentStore.write(url, apiKey);
    $notification.post("中国电信", "API地址获取成功", `已保存API: ${url}`);
}

$done();
