import * as systeminfomart from 'systeminformation';
import mkdirp from 'mkdirp'
import fs from 'fs'
import path from 'path'
const sqlite =require('sqlite3')

function CommManager() {
    this.getDiskList = getdisk;
    this.getToken = getToken;
    this.getProps = getProps;
    this.getdownUrl = getdownUrl;
    this.base64ToImage = base64ToImage;
    this.readDirSync = readDirSync;
    this.xiapp=xiapp;
}

async function base64ToImage(imagevalue, savepath, filename) {
    try {
        var base64data = imagevalue.replace(/^data:image\/\w+;base64,/, "")
        //var base64buffer = new Buffer(base64data, 'base64')
        var base64buffer = Buffer.from(base64data, 'base64');
        let res = await new Promise((func, res) => {
            mkdirp(savepath, (err) => {
                func(savepath)
            })
        })
        fs.writeFile(savepath + filename, base64buffer, (err) => {
            if (err) {
                console.log('图片转换失败')
            }
        })
    } catch (e) {

    }


}

async function getToken(http, name, pwd) {

    let res = await new Promise((func, res) => {
        http.post('/api2/auth-token/', {username: name, password: pwd}).then((res) => {
            //console.log(res.data['token'])
            func(res.data['token']);

        }).catch((err) => {
            func('error')
            console.log(err)
        })
    })
    return res;

}

async function getdownUrl(http, propid, token, p) {
    console.log("propid" + propid)
    console.log("token" + token)
    console.log("p" + p)
    let res = await new Promise((func, res) => {
        http.get('/api2/repos/' + propid + '/file/', {
            headers: {'Authorization': 'Token ' + token}
            , params: {p: p, reuse: 1}
        }).then((res) => {
            func(res.data)
        }).catch((err) => {
            func(err)
            console.log('获取下载路径失败:' + err)
        })
    })
    return res;
}


async function getProps(http, token) {

    let res = await new Promise((func, res) => {
        http.get('/api2/repos/', {headers: {"Authorization": 'Token ' + token}}).then((res) => {
            try {
                let props = {}
                for (let i = 0; i < res.data.length; i++) {
                    props[res.data[i].name] = res.data[i].id
                }
                func(props);
            }
            catch (e) {
                func('error');
            }

        })
    })
    return res;
}

/**
 *[getdisk 获取磁盘列表]
 *
 */
async function getdisk() {

    let res = await new Promise((func, res) => {
        systeminfomart.blockDevices((cb) => {
            let list = {}
            for (let i = 0; i < cb.length; i++) {
                list[i] = (cb[i].name)
            }
            func(list)
        })
    })
    return res
};
async function xiapp(copypath,filename) {
    let res = await new Promise((func, res) => {
        mkdirp(copypath, (err) => {
            func(copypath)
        })
    })
    fs.copyFileSync(path.join(__static,'p.db'), copypath+filename)
}
function readDirSync(root) {
    var pa = fs.readdirSync(root)

    pa.forEach((ele, index) => {
        var info = fs.statSync(root + '\\' + ele)
        if (info.isDirectory()) {
            //console.log(root+'\\'+ele)
            readDirSync(root + '\\' + ele)
        } else {
            var exten = path.extname(root + '\\' + ele)
            if (exten === '.mp4') {
                /*  mkdirp(root+'\\media',(err)=>{
                      if (err)
                      {
                          console.log(root+'\\media')
                      }
                  */

            fs.renameSync(root + '\\' + ele, root + '\\media\\' + ele, (err) => {
                if (err) {
                    console.log('复制失败' + root + '\\' + ele)
                }
            })
        }
    }
}

)

}

const commManagers = new CommManager();
export default commManagers;
