/**
 * 怎么运行？
 * 首先安装node 服务，然后 在这个文件目录下执行 npm install 安装完依赖以后
 * 就可以执行 npm start 开启服务啦～
 */

import express from "express";
import axios from "axios";
import { scheduleJob } from "node-schedule";
import SHA1 from "crypto-js/sha1";
const app = express();
const port = 80; //你想要运行的端口
let alltime = 0; //不要改
let successTime = 0; //不要改
let startTime = 0; //不要改
let log = ""; //不要改

//下面是要改的东西

let dataObj: any = null; //把打卡上传的数据放在这，把 lng和lat的值用上面两个函数【getRdLng() getRdLat()】分别替换一下

let lng = 23.123123124124; //你的坐标经度
let lat = 113.12312314124; //你的坐标纬度
/**
 *     下面是微信公众号的配置参数内容
 *     //下面这个链接里面配置
 *     http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login&token=1115658615&lang=zh_CN
 */
const secret = "cf7933e4e062234e1cc8975606b99b12"; //密钥
const appid = "wx53a8476aefd48973"; //appid
const touser = "obvtN034LQxiKjMJMUldiSE6vPAU"; //要发送的用户

/**
 * 模版：
 * 	{{time.DATA}} 消息：{{result.DATA}} 已成功打卡次数：{{successTime.DATA}} 系统已持续运行：{{runTime.DATA}}
 */
const template_id = "SRI6PvGesqX15s3Z9z2jtN7Vvp8UDsq-mPKjyCiDfhI"; //模版id
const access_token = "lovelywhite1234"; //访问token

//上面是要改的东西

//随机获取经度
function getRdLng() {
  let floatInv = Math.random() / 10000000000;
  return lng + floatInv;
}
//随机获取维度
function getRdLat() {
  let floatInv = Math.random() / 10000000000;
  return lat + floatInv;
}

//签到
function sign() {
  let _d: any = dataObj;
  alltime++;
  return axios({
    method: "POST",
    url: "https://reportedh5.17wanxiao.com/sass/api/epmpics",
    data: _d,
  });
}
//格式化timestamp
function getDuration(second: number) {
  var days = Math.floor(second / 86400);
  var hours = Math.floor((second % 86400) / 3600);
  var minutes = Math.floor(((second % 86400) % 3600) / 60);
  var seconds = Math.floor(((second % 86400) % 3600) % 60);
  var duration = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
  return duration;
}
//创建web服务映射（主页）
app.get("/", (req, res) =>
  res.send(
    "<h4>自动打卡 Server</h4>" +
      "<p>运行时间：" +
      getDuration(Date.now() - startTime) +
      "</p><p>成功次数:" +
      successTime +
      "</p><p>总打卡次数：" +
      alltime +
      "</p>日志：<p>" +
      log +
      "</p>"
  )
);

//配置微信公众号后台
app.get("/wx", (req, res) => {
  let signature = req.query["signature"];
  let echostr = req.query["echostr"];
  let timestamp = req.query["timestamp"];
  let nonce = req.query["nonce"];

  if (signature && echostr && timestamp && timestamp && nonce) {
    let list = [access_token, timestamp, nonce];
    let shastring = SHA1(list.sort().join("")).toString();
    if (signature === shastring) {
      res.send(echostr + "");
    } else {
      res.send("error");
    }
  } else {
    res.send("error");
  }
});
app.post("/wx", (req, res) => {});

//发送微信通知函数
async function sendMessageToWechat(msg: string) {
  let res1 = await axios.get(
    "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" +
      appid +
      "&secret=" +
      secret
  );
  if (res1.status == 200) {
    let accesstoken = res1.data.access_token;
    if (accesstoken) {
      let date = new Date(Date.now());
      let res2 = await axios.post(
        "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" +
          accesstoken,
        {
          touser: touser,
          template_id: template_id,
          topcolor: "#FF0000",
          data: {
            time: {
              value:
                date.toLocaleDateString() +
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
        }
      );
      if (res2.status == 200) {
        if (0 === res2.data.errcode) {
          return Promise.resolve();
        } else {
          return Promise.reject(
            "错误：" + res2.data?.errcode + " " + res2.data?.errmsg
          );
        }
      } else {
        return Promise.reject("错误：" + res2.status + " " + res2.statusText);
      }
    } else {
      return Promise.reject(
        "错误：" + res1.data?.errcode + " " + res1.data?.errmsg
      );
    }
  } else {
    return Promise.reject("错误：" + res1.status + " " + res1.statusText);
  }
}

function errorRetry() {
  //错误重试
  setTimeout(async () => {
    let result = await sign();
    if (result.status == 200) {
      console.log(result.data);
      if (result.data?.code === "10000") {
        successTime++;
        sendMessageToWechat("签到成功！")
          .then()
          .catch((e) => {
            log += e;
          });
      } else {
        sendMessageToWechat("错误：" + result.data?.msg)
          .then()
          .catch((e) => {
            log += e;
          });
      }
    } else {
      sendMessageToWechat(
        "错误：" +
          result.status +
          " " +
          result.statusText +
          "  已准备10分钟后重试！"
      )
        .then()
        .catch((e) => {
          log += e;
        });
    }
  }, 10 * 60 * 1000);
}

async function main() {
  startTime = Date.now();
  let data = sendMessageToWechat("开始服务！")
    .then()
    .catch((e) => {
      log += e;
    });
  let job = scheduleJob("0 10 0 * * *", async () => {
    try {
      //签到
      let result = await sign();
      if (result.status == 200) {
        if (result.data?.code === "10000") {
          successTime++;
          sendMessageToWechat("签到成功！")
            .then()
            .catch((e) => {
              log += e;
            });
        } else {
          sendMessageToWechat(
            "错误：" + result.data?.msg + "  已准备10分钟后重试！"
          )
            .then()
            .catch((e) => {
              log += e;
            });
          errorRetry();
        }
      } else {
        sendMessageToWechat(
          "错误：" +
            result.status +
            " " +
            result.statusText +
            "  已准备10分钟后重试！"
        )
          .then()
          .catch((e) => {
            log += e;
          });
        errorRetry();
      }
    } catch (e) {
      console.log(e);
      sendMessageToWechat("错误：" + e + "  已准备10分钟后重试！")
        .then()
        .catch((e) => {
          log += e;
        });
      errorRetry();
    }
  });
}
main();

app.listen(port, () => console.log(`server is started on ${port}!`));
