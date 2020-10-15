const axios = require("axios");
const { FileBox } = require("file-box")
const { log } = require('wechaty')
const config = require("../../config/config")
const { pareMiniProgramMsg, pareseXmlToJson } = require("../utils/utils")

module.exports = (msg, length) => {
	
	return new Promise(async (resolve, reject) => {
		// 接收小程序后发送小程序小程序appId和路径
		if (msg.payload.type === 9 && msg.payload.fromId === 'mishi19900806') {
			let text = msg.payload.text
			text = pareMiniProgramMsg(text)
			result = pareseXmlToJson(text)
			result = JSON.parse(result)
			var response = '小程序appId：'+result.msg.appmsg.weappinfo.appid._cdata
            response+= '\n\n小程序路径为：'+ (result.msg.appmsg.weappinfo.pagepath._cdata).replace('.html','')
			resolve(response);
		}
		// 回复网课答案
		else if (msg.text().indexOf('答案') > -1 && msg.payload.fromId === 'mishi19900806') {
			let requestUrl = "";
			requestUrl = config.tikuApi + encodeURI(msg.text())
			axios.get(requestUrl)
				.then(async (response) => {
					log.info('接口回调正常----', response)
					let result = "❓问题：" + response.data.question + " " + "💡答案：" + response.data.answer
					resolve(result);
				})
				.catch(function (err) {
					log.info('接口回调错误----', err)
					resolve("嗯~~~,这个问题人家还不会呢~")
				})
		} else {
			resolve('')
		}

		// else if (msg.text() === "图片") {
		// 	const photo = FileBox.fromFile("img/1.jpeg");
		// 	resolve(photo);
		// } 
		// else {
		// 	resolve("嗯~~~,这个问题人家还不会呢~");
		// }
	})
}