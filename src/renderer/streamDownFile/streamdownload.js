import * as path from 'path'
import * as fs from 'fs'
import mkdirp from 'mkdirp'
const request = require('request');

//---------下载类--------------//
function StreamDownLoad() {
    //声明下载过程函数
    this.downloadCallback = null;
    this.downloadFile = downloadfile;
}

//--------------下载进度--------------//
StreamDownLoad.prototype.showProgress = function (received, total) {
    const percentage = (received * 100) / total
    //用回调显示到界面上
    this.downloadCallback('progress', percentage)

}

//--------下载过程-------------//
/**
 * [downloadFile description]
 *@param url
 *@param {string} baseSavePath [文件基础路径]
 *@param {string} filename [文件名称]
 * @param callback
 */
async function downloadfile(url, baseSavePath, filename, callback) {

    console.log('url:' + url)
    console.log('baseSavePath:' + baseSavePath)
    console.log('filename:' + filename)
    this.downloadCallback = callback;//注册回调函数
    let res=await new Promise((func,res)=>{
        mkdirp(baseSavePath, (err) => {
            func(baseSavePath)
        })
    })
    let that=this;
    let res1=await new Promise((func,res)=>{
        try {
            let receivedBytes = 0;
            let totalBytes = 0;
            const req = request({url: url}, function (err, res, body) {
                if (err) {
                    console.log("下载错误（0）:" + url + err);
                    that.downloadCallback('error', err)
                    func(err)
                }
            })
            const out = fs.createWriteStream("" + baseSavePath + filename);
            req.pipe(out)
            req.on('response', (data) => {
                totalBytes = parseInt(data.headers["content-length"], 10);
            })
            req.on('data', (chunk) => {
                receivedBytes += chunk.length;
                that.showProgress(receivedBytes, totalBytes)
            })
            req.on('end', () => {
                console.log('下载成功(0))' + url)
                that.downloadCallback('finished', 100)
                func(res);
            })
            req.on('error', (err) => {
                console.log("下载错误(1):" + url + err);
                that.downloadCallback('error', err)
                //out.end()
                func(res);
            })
        }
        catch (e) {
            func(e)
        }
    })
};
const streamdownload = new StreamDownLoad()
export default streamdownload;



