(function () {
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    // 刷新样式
    const flushStyle = function () {
        // 修改标题样式
        const h1 = document.querySelector('h1');
        h1.style.textAlign = "center";
        h1.style.fontSize = "3rem";
        // 修改表格样式
        const table = document.querySelector('table');
        table.style.borderCollapse = "collapse";
        table.style.margin = "0 auto";
        table.style.border = "1px solid #ccc";
        // 修改表头样式
        const thList = table.getElementsByTagName("th");
        for (var i = 0; i < thList.length; i++) {
            thList[i].style.backgroundColor = "#4CAF50";
            thList[i].style.color = "#fff";
            thList[i].style.fontWeight = "bold";
            thList[i].style.padding = "5px";
            thList[i].style.textAlign = "center";
            thList[i].style.border = "1px solid #ccc";
            thList[i].style.padding = "5px 20px";
            thList[i].style.fontSize = "1.3rem";
        }
        // 修改内容行样式
        const tdList = table.getElementsByTagName("td");
        for (var i = 0; i < tdList.length; i++) {
            tdList[i].style.padding = "5px";
            tdList[i].style.textAlign = "center";
            tdList[i].style.border = "1px solid #ccc";
            tdList[i].style.padding = "5px 20px";
            tdList[i].style.ho
        }
        // 获取所有的 <tr> 元素
        const trs = document.querySelectorAll("tr");
        // 遍历每个 <tr> 元素
        trs.forEach(tr => {
            // 添加鼠标悬停事件监听器
            tr.addEventListener("mouseover", () => {
                tr.style.backgroundColor = "#8df19e";
            });
            // 添加鼠标离开事件监听器
            tr.addEventListener("mouseout", () => {
                // 恢复默认的背景颜色
                tr.style.backgroundColor = "";
            });
        });
    };

    // 创建 DOM
    const initBar = function () {
        String.prototype.hashCode = function () {
            var hash = 0, i, chr;
            if (this.length === 0) return hash;
            for (i = 0; i < this.length; i++) {
                chr = this.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        };
        // 创建标题
        let h1 = document.createElement("h1");
        h1.innerHTML = "\u65b9\u821f\u670d\u52a1\u5668\u76f4\u8fde\u5730\u5740";
        document.body.appendChild(h1);
        // 创建表格
        let table = document.createElement("table");
        table.id = "serverTable";
        table.style.minWidth = "1500px";
        document.body.appendChild(table);
        // 创建表头
        let thead = document.createElement("thead");
        table.appendChild(thead);
        let tr = document.createElement("tr");
        thead.appendChild(tr);
        let thTitles = ["\u670d\u52a1\u5668\u540d\u79f0", "\u6c38\u4e45\u76f4\u8fde\u5730\u5740", "\u6e38\u620f\u7c7b\u578b", "\u670d\u52a1\u5668\u7248\u672c", "\u670d\u52a1\u5668\u72b6\u6001", "\u5728\u7ebf\u73a9\u5bb6", "\u6700\u540e\u66f4\u65b0\u65f6\u95f4", "\u5ef6\u8fdf"];
        for (var i = 0; i < thTitles.length; i++) {
            var th = document.createElement("th");
            th.innerHTML = thTitles[i];
            tr.appendChild(th);
        }
        // 创建表格内容
        let tbody = document.createElement("tbody");
        table.appendChild(tbody);
        // 刷新样式
        flushStyle();
    }

    // 更新数据
    const updateData = function () {
        $.ajax({
            url: '/api/ASI' + '?t=' + (new Date().getTime()),
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                const tbody = document.querySelector('tbody');
                tbody.innerHTML = ''; // 清空tbody
                for (let i = 0; i < data.length; i++) {
                    let server = data[i];
                    const serverHash = server.steamAddress.hashCode();
                    let tr = document.createElement("tr");
                    tr.id = serverHash;
                    tbody.appendChild(tr);
                    for (const key in server) {
                        let td = document.createElement("td");
                        switch (key) {
                            case 'serverStatus':
                                server[key] = server[key] === 'Online' ? '在线' : '离线';
                                break;
                            case 'steamAddress':
                                let dm = document.domain.match(/[0-9]{3}/)[0] + '0'.repeat(3) + '.' + ['z', 'y', 'x'].reverse().join('');
                                server[key] = server[key].replace('0.0.0.0', dm);
                                server[key] = "<a href='" + server[key] + "'>" + server[key] + "</a>";
                                break;
                            default:
                                break;
                        }
                        td.innerHTML = server[key];
                        tr.appendChild(td);
                    }
                }
                flushStyle();
            }
        })
    }
    window.onload = function () {
        initBar();
        updateData();
        setInterval(updateData, 5000);
    }
})();
