"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
var node_schedule_1 = require("node-schedule");
var sha1_1 = __importDefault(require("crypto-js/sha1"));
var app = express_1.default();
var port = 80;
var alltime = 0;
var successTime = 0;
var startTime = 0;
var log = "";
var lng = 23.123123124124;
var lat = 113.12312314124;
var secret = "cf7933e4e062234e1cc8975606b99b12";
var appid = "wx53a8476aefd48973";
var touser = "obvtN034LQxiKjMJMUldiSE6vPAU";
var template_id = "SRI6PvGesqX15s3Z9z2jtN7Vvp8UDsq-mPKjyCiDfhI";
function getRdLng() {
    var floatInv = Math.random() / 10000000000;
    return lng + floatInv;
}
function getRdLat() {
    var floatInv = Math.random() / 10000000000;
    return lat + floatInv;
}
function sign() {
    alltime++;
    var dataObj;
    return axios_1.default({
        method: "POST",
        url: "https://reportedh5.17wanxiao.com/sass/api/epmpics",
        data: dataObj,
    });
}
function getDuration(second) {
    var days = Math.floor(second / 86400);
    var hours = Math.floor((second % 86400) / 3600);
    var minutes = Math.floor(((second % 86400) % 3600) / 60);
    var seconds = Math.floor(((second % 86400) % 3600) % 60);
    var duration = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
    return duration;
}
app.get("/", function (req, res) {
    return res.send("<h4>自动打卡 Server</h4>" +
        "<p>运行时间：" +
        getDuration(Date.now() - startTime) +
        "</p><p>成功次数:" +
        successTime +
        "</p><p>总打卡次数：" +
        alltime +
        "</p>日志：<p>" +
        log +
        "</p>");
});
app.get("/wx", function (req, res) {
    var signature = req.query["signature"];
    var echostr = req.query["echostr"];
    var timestamp = req.query["timestamp"];
    var nonce = req.query["nonce"];
    var token = "lovelywhite1234";
    if (signature && echostr && timestamp && timestamp && nonce) {
        var list = [token, timestamp, nonce];
        var shastring = sha1_1.default(list.sort().join("")).toString();
        if (signature === shastring) {
            res.send(echostr + "");
        }
        else {
            res.send("error");
        }
    }
    else {
        res.send("error");
    }
});
app.post("/wx", function (req, res) { });
function sendMessageToWechat(msg) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var res1, accesstoken, date, res2;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, axios_1.default.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" +
                        appid +
                        "&secret=" +
                        secret)];
                case 1:
                    res1 = _e.sent();
                    if (!(res1.status == 200)) return [3 /*break*/, 5];
                    accesstoken = res1.data.access_token;
                    if (!accesstoken) return [3 /*break*/, 3];
                    date = new Date(Date.now());
                    return [4 /*yield*/, axios_1.default.post("https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" +
                            accesstoken, {
                            touser: touser,
                            template_id: template_id,
                            topcolor: "#FF0000",
                            data: {
                                time: {
                                    value: date.toLocaleDateString() +
                                        "  " +
                                        date.toLocaleTimeString("zh-CN", { hour12: false }),
                                    color: "#173177",
                                },
                                result: {
                                    value: msg,
                                    color: "#173177",
                                },
                                successTime: {
                                    value: successTime,
                                    color: "#173177",
                                },
                                runTime: {
                                    value: getDuration(Date.now() - startTime),
                                    color: "#173177",
                                },
                            },
                        })];
                case 2:
                    res2 = _e.sent();
                    if (res2.status == 200) {
                        if (0 === res2.data.errcode) {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        else {
                            return [2 /*return*/, Promise.reject("错误：" + ((_a = res2.data) === null || _a === void 0 ? void 0 : _a.errcode) + " " + ((_b = res2.data) === null || _b === void 0 ? void 0 : _b.errmsg))];
                        }
                    }
                    else {
                        return [2 /*return*/, Promise.reject("错误：" + res2.status + " " + res2.statusText)];
                    }
                    return [3 /*break*/, 4];
                case 3: return [2 /*return*/, Promise.reject("错误：" + ((_c = res1.data) === null || _c === void 0 ? void 0 : _c.errcode) + " " + ((_d = res1.data) === null || _d === void 0 ? void 0 : _d.errmsg))];
                case 4: return [3 /*break*/, 6];
                case 5: return [2 /*return*/, Promise.reject("错误：" + res1.status + " " + res1.statusText)];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function errorRetry() {
    var _this = this;
    //错误重试
    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, sign()];
                case 1:
                    result = _c.sent();
                    if (result.status == 200) {
                        console.log(result.data);
                        if (((_a = result.data) === null || _a === void 0 ? void 0 : _a.code) === "10000") {
                            successTime++;
                            sendMessageToWechat("签到成功！")
                                .then()
                                .catch(function (e) {
                                log += e;
                            });
                        }
                        else {
                            sendMessageToWechat("错误：" + ((_b = result.data) === null || _b === void 0 ? void 0 : _b.msg))
                                .then()
                                .catch(function (e) {
                                log += e;
                            });
                        }
                    }
                    else {
                        sendMessageToWechat("错误：" +
                            result.status +
                            " " +
                            result.statusText +
                            "  已准备10分钟后重试！")
                            .then()
                            .catch(function (e) {
                            log += e;
                        });
                    }
                    return [2 /*return*/];
            }
        });
    }); }, 10 * 60 * 1000);
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var data, job;
        var _this = this;
        return __generator(this, function (_a) {
            startTime = Date.now();
            data = sendMessageToWechat("开始服务！")
                .then()
                .catch(function (e) {
                log += e;
            });
            job = node_schedule_1.scheduleJob("0 10 0 * * *", function () { return __awaiter(_this, void 0, void 0, function () {
                var result, e_1;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, sign()];
                        case 1:
                            result = _c.sent();
                            if (result.status == 200) {
                                if (((_a = result.data) === null || _a === void 0 ? void 0 : _a.code) === "10000") {
                                    successTime++;
                                    sendMessageToWechat("签到成功！")
                                        .then()
                                        .catch(function (e) {
                                        log += e;
                                    });
                                }
                                else {
                                    sendMessageToWechat("错误：" + ((_b = result.data) === null || _b === void 0 ? void 0 : _b.msg) + "  已准备10分钟后重试！")
                                        .then()
                                        .catch(function (e) {
                                        log += e;
                                    });
                                    errorRetry();
                                }
                            }
                            else {
                                sendMessageToWechat("错误：" +
                                    result.status +
                                    " " +
                                    result.statusText +
                                    "  已准备10分钟后重试！")
                                    .then()
                                    .catch(function (e) {
                                    log += e;
                                });
                                errorRetry();
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _c.sent();
                            console.log(e_1);
                            sendMessageToWechat("错误：" + e_1 + "  已准备10分钟后重试！")
                                .then()
                                .catch(function (e) {
                                log += e;
                            });
                            errorRetry();
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
main();
app.listen(port, function () { return console.log("server is started on " + port + "!"); });
