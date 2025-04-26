const cookie = $persistentStore.read("telecom_cookie");
const queryUrl = $persistentStore.read("telecom_api");
const balanceSwitch = $argument.balance_switch === "true";
const flowSwitch = $argument.flow_switch === "true";

if (!cookie) {
    $notification.post("中国电信", "错误", "未找到Cookie，请先登录电信App");
    $done();
}

if (!queryUrl) {
    $notification.post("中国电信", "错误", "未找到API地址，请在电信App中触发账单查询");
    $done();
}

const headers = {
    "Cookie": cookie,
    "User-Agent": "ChinaTelecomApp/10.0.0",
    "Content-Type": "application/json",
    "Accept": "application/json"
};

$httpClient.get({
    url: queryUrl,
    headers: headers
}, (error, response, data) => {
    if (error || response.status !== 200) {
        $notification.post("中国电信", "查询失败", "网络错误或Cookie/API失效");
        $done();
    }

    try {
        const result = JSON.parse(data);
        let message = "";
        
        // 假设API返回结构类似 { data: { balance: "123.45", flow: "1024" } }
        if (balanceSwitch && result.data && result.data.balance) {
            message += `剩余话费: ${result.data.balance}元\n`;
        }
        if (flowSwitch && result.data && result.data.flow) {
            message += `剩余流量: ${result.data.flow}MB`;
        }
        
        if (message) {
            $notification.post("中国电信", "查询成功", message);
        } else {
            $notification.post("中国电信", "无信息", "请开启话费或流量提醒，或检查API返回数据");
        }
    } catch (e) {
        $notification.post("中国电信", "解析失败", "数据格式错误，请检查API响应");
    }
    $done();
});
