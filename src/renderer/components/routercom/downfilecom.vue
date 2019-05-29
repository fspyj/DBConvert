<template>
    <div class="maindiv">
        <hr>
        SeaFile配置
        <br>
        服务器地址:
        <el-input v-model="seahost" placeholder="服务器地址"></el-input>
        <!--端口:-->
        <!--<el-input v-model="seaPort" placeholder="端口"></el-input>-->
        <br>
        用户名:
        <el-input v-model="saefileusername" placeholder="用户名"></el-input>
        密码:
        <el-input v-model="saefilepasswrod" show-password placeholder="密码"></el-input>
        <hr>
        <el-dropdown style="width: 150px" split-button type="primary" @command="selectvalue">
            <template style="width: 100px">
                {{DiskName}}
            </template>

            <el-dropdown-menu slot="dropdown">
                <template v-for="item in disklist">
                    <el-dropdown-item style="width: 100px" v-bind:command="item" :key="item.id">{{item}}
                    </el-dropdown-item>
                </template>
            </el-dropdown-menu>
        </el-dropdown>
        <br>
        <br>
        <br>

        <el-button @click="downfile">开始下载</el-button>
        <div v-if="isAction">
            <br>
            <br>
            当前正在下载的文件:{{this.downFileName}}
            <br>
            正在下载{{this.downFileCount}}/{{this.totalFileCount}}
            <br>
            <br>
            <el-button @click="saveerror">保存下载错误文件</el-button>
        </div>
        <div v-else>
            <br>
            <br>

        </div>
    </div>
</template>
<script>
    import commManager from '../../commjs/comm.js'
    import downfilestream from '../../streamDownFile/streamdownload.js'
    import fs from 'fs'
    import {Message} from 'element-ui'
    import Vue from 'vue'
    import path from 'path'
    import axios from 'axios'

    export default {
        data() {
            return {
                seahost: 'http://tfyunpan.yingding.com',
                seaPort: '8081',
                saefileusername: 'fengsheng@yingding.org',
                saefilepasswrod: '2318Fs6375Fy',
                saefileToken: '',
                disklist: {},
                saeProps: {},
                DiskName: '请选择磁盘',
                isAction: false,
                downFileCount: 0,
                totalFileCount: 0,
                downFileName: '',
                downerrfile: []

            }
        },
        created() {
            commManager.getDiskList().then(res => {
                this.disklist = res
                console.log(this.disklist)
            })
        },
        methods: {
            saveerror() {
                if (this.downerrfile.length > 0) {
                    fs.writeFile('temperror.txt', JSON.stringify(this.downerrfile), (err) => {
                        let str = "";
                        if (!err) {
                            str = "写入成功";
                        } else {
                            str = "写入失败"
                        }
                        Message(str)
                    })
                }
            },
            selectvalue(command) {
                this.DiskName = command
                console.log(this.DiskName)
            },
            async downfile() {
                try {
                    if (this.isAction) {
                        Message({
                            message: '正在执行中...',
                            type: 'warning',
                            center: true
                        })
                        return;
                    }
                    if (this.DiskName.length !== 2) {
                        Message({
                            message: '请选择磁盘',
                            type: 'warning',
                            center: true
                        })
                        return
                    }

                    let str = await new Promise((func, res) => {
                        fs.readFile('./downloadfile.txt', 'utf-8', (err, res) => {
                            if (err) {
                                func('error')
                            }
                            func(res)
                        })
                    })
                    if (str === 'error') {
                        Message({
                            message: '请先进行数据库转换',
                            type: 'warning',
                            center: true
                        })
                        return
                    }

                    let downfilelist = JSON.parse(str)
                    this.totalFileCount = downfilelist.length

                    let http = axios.create({
                        withCredentials: true,
                        baseURL: this.seahost,
                        timeout: 15000
                    })
                    Vue.http = Vue.prototype.$http = http
                    ///获取token
                    let res = await new Promise((func, res) => {
                        commManager.getToken(this.$http, this.saefileusername, this.saefilepasswrod).then((res) => {
                            if (res === 'error') {
                                func('error')

                            } else {
                                this.saefileToken = res
                                //获取列表库
                                commManager.getProps(this.$http, this.saefileToken).then((res) => {
                                    if (res === 'error') {
                                        func('error')
                                    } else {
                                        this.saeProps = res
                                        console.log(this.saeProps)
                                        func(res)
                                    }

                                })
                            }

                        })
                    })
                    if (res === 'error') {
                        Message('请确认SeaFile账户是否正确或本机IP是否授权')
                        return;
                    }
                    this.isAction = true
                    // var http = axios.create({
                    //     withCredentials: true,
                    //     baseURL: this.seahost,
                    //     timeout: 15000
                    // })
                    // Vue.http = Vue.prototype.$http = http
                    // ///获取token
                    // await new Promise((func, res) => {
                    //     commManager.getToken(this.$http, this.saefileusername, this.saefilepasswrod).then((res) => {
                    //         this.saefileToken = res
                    //         //获取列表库
                    //         commManager.getProps(this.$http, this.saefileToken).then((res) => {
                    //             this.saeProps = res
                    //             console.log(this.saeProps)
                    //             func(res)
                    //         })
                    //     })
                    // })

                    let that = this;
                    that.downerrfile = []
                    if (this.downerrfile.length > 0) {
                        fs.writeFile('DownErrorFileList.txt', JSON.stringify(this.downerrfile), (err) => {
                        })
                    }
                    for (let i = 0; i < downfilelist.length; i++) {
                        let df = downfilelist[i]
                        this.downFileName = df.path
                        await new Promise((func, res) => {
                            commManager.getdownUrl(this.$http, this.saeProps[df.Prop], this.saefileToken, df.path).then(res => {
                                try {
                                    console.log('下载文件路径:' + res)
                                    downfilestream.downloadFile(res, this.DiskName + df.savebasepath, df.filename + path.extname(res), (arg, per) => {
                                        if (arg === 'finished') {
                                            func("")
                                        } else if (arg === 'error') {

                                            //that.downerrfile.push(df)
                                            func("")
                                            this.writeErrorDownFile(df)
                                        }
                                    })
                                } catch (e1) {
                                    //that.downerrfile.push(df)
                                    func(e1)
                                    this.writeErrorDownFile(df)
                                }
                            })
                        })
                        this.downFileCount++;
                    }
                    /* if (this.downerrfile.length>0)
                     {
                         fs.writeFile('downerrfile.txt',JSON.stringify(this.downerrfile),(err)=>{})
                     }*/
                    //alert('下载完成')
                    Message('下载完成')
                    this.downFileCount = 0;
                    this.totalFileCount = 0;
                    this.isAction = false
                } catch (e) {
                    this.isAction = false
                    Message(e)
                }
            },
            writeErrorDownFile(ps) {
                try {

                    if (fs.existsSync('DownErrorFileList.txt')) {
                        let str = fs.readFileSync('DownErrorFileList.txt', 'utf-8')
                        let json = JSON.parse(str)
                        json.push(ps)
                        fs.writeFileSync('DownErrorFileList.txt', JSON.stringify(json), 'utf-8')
                    } else {
                        let newJson = []
                        newJson.push(ps)
                        fs.writeFileSync('DownErrorFileList.txt', JSON.stringify(newJson), 'utf-8')
                    }

                } catch (e) {

                }
            }
        }
    }
</script>
<style lang="scss" scoped>

    .maindiv {

        justify-items: center;
        align-items: center;
        text-align: center;
        justify-content: center;

        width: 100%;

        .el-input {
            margin: 20px 20px;
            width: 200px;

        }

    }
</style>
