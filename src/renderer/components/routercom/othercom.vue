<template>
    <div class="main">
        <hr>
        <el-button @click="startdebug">开启调试</el-button>
        <br>
        <hr>
        <br>
        <el-button @click="btnSql">创建smartPenSql</el-button>
        <el-button @click="test">测试</el-button>
        <br>
        <hr>
        获取指定下载内容: 共有{{downTotal}}(<el-button type="text" @click="refresh" >刷新</el-button>)条下载记录 从<el-input type="number" v-model="fromnum"    style="width: 120px"></el-input>到<el-input v-model="tonum" type="number" style="width: 120px"></el-input>
        <el-button @click="createNew">生成</el-button>
        <br>
        <el-button @click="getSerializerNumber">获取指定盘符的序列号</el-button>
        <!--<el-input v-model="diskName" placeholder="请输入盘符:"></el-input>-->
        <!--<el-button @click="startAction">开始执行</el-button>-->
        <!--<br>-->
        <!--<el-button @click="addMedia">添加media目录</el-button>-->
        <!--<br>-->
        <!--<el-input v-model="countList" placeholder="分割几份:"></el-input>-->
        <!--<el-button @click="fenge">分割文件</el-button>-->
        <!--<br>-->
        <!--<el-button v-on:click="jiami">加密数据库</el-button>-->
        <!--<el-input v-model="sqlPath"></el-input>-->
        <!--<el-button @click="btnSql">创建Sql</el-button>-->
        <!-- <p>拖动 RUNOOB.COM 图片到矩形框中:</p>

         <div style=" display: table; justify-items: center;justify-content: center; width: 100%; background: green;vert-align: middle;vertical-align: middle ">
             <div   style="width: 20% ;height: 200px;border: 1px solid red;display: table-cell;vertical-align: middle" @:ondrop="drop(event)" @:ondragover="allowDrop(event)"
                 ></div>
             <div id="div1" style="width: 300px ;height: 200px;border: 1px solid red;display: table-cell;vertical-align: middle" @:ondrop="drop(event)"
                 @:ondragover="allowDrop(event)"></div>
             <div  style="width: 300px ;height: 100px;border: 1px solid red;display: table-cell;vertical-align: middle" @:ondrop="drop(event)"
                  @:ondragover="allowDrop(event)"></div>
         </div>

         <br>
         <img id="drag1" src="image.png" draggable="true" @:ondragstart="drag(event)" width="200" height="100">-->

        <!-- <div>
             <el-button @click="zanting">暂停</el-button>
             <video  id="video1" autoplay="autoplay" loop="loop"   >
                 &lt;!&ndash;<source src="test.mp4" type="video/mp4">&ndash;&gt;
                 您的页面不支持html5 video
             </video>
         </div>-->
        <!--<div>
            <el-button @click="createPic">绘图</el-button>
            <canvas id="mycanvas" style="background: red"></canvas>
        </div>-->
    </div>
</template>
<script>
    var token = ""
    const axios = require('axios')
    //const ffi=require('ffi')
    import {ipc } from 'electron'
    import {Message} from 'element-ui'
    import streamdownload from '../../streamDownFile/streamdownload.js'
    import comm from '../../commjs/comm.js'
    import fs from 'fs'
    import path from 'path'
    import format from 'string-format'

    const sqlite = require('sqlite3').verbose()
    export default {
        data: function () {
            return {
                diskName: '',
                countList: 2,
                sqlPath: '',
                fromnum:1,
                tonum:1,
                downTotal:0
            }
        },

        methods: {
            getSerializerNumber()
            {
                // let libpath=path.join(__static,'CrystalDiskInfoLib.dll')
                // let diskInfoLib=ffi.Library(libpath,{
                //     'GetHDSerial':['int',['string','string','int']]
                // })
                // var str="";
                // diskInfoLib.GetHDSerial('C:',str,20)
                // alert(str)
            },
            test(){
                alert(path.parse('fs').name)
            },
            refresh(){
                let str=  fs.readFileSync('downloadfile.txt','utf-8')
                this.downTotal=JSON.parse(str).length
            },
            createNew(){
                let t1=  Math.round(this.fromnum)
                let t2= Math.round(this.tonum)
                console.log(t1+":"+t2 )
                if (t1<0 || t2<=0 || t1>t2)
                {
                    console.log(this.fromnum >= this.tonum)
                    console.log(this.fromnum<0 )
                    console.log(this.tonum<=0)
                    console.log(this.fromnum+":"+this.tonum )
                    return;
                }
                // if ( this.fromnum >= this.tonum )
                // {
                //     console.log(this.fromnum+":"+this.tonum )
                //     return;
                // }
                if (t2>this.downTotal)
                {
                    console.log(2)
                    return;
                }
                let str=  fs.readFileSync('downloadfile.txt','utf-8')
                let json=JSON.parse(str)
                let savejson=[]


                for (let i=t1;i<t2;i++)
                {
                    savejson.push(json[i])
                }
                const {dialog} =require('electron').remote;
                let dia=dialog.showSaveDialog({defaultPath:'downloadfile1.txt'})
                if (dia!==undefined)
                {
                    console.log(JSON.stringify(savejson))
                    fs.writeFileSync(dia,JSON.stringify(savejson),'utf-8')
                    Message('生成成功')
                }

            },

            startdebug(){
                this.$electron.ipcRenderer.send('opendebug')
            },
            btnSql() {

                // alert(path.join(__static))
                // alert(path.join(__static,'index.txt'))
                // alert(fs.readFileSync(path.join(__static,'22\\gg.data'),'utf-8'))
                //fs.unlinkSync('App.DB')
                const {dialog} =require('electron').remote;
                var dia=dialog.showOpenDialog({properties:["multiSelections"]});
                if (dia === undefined)
                {
                    console.log('未选择')
                    return;
                }

                var filelist = dia
                console.log(filelist)
                fs.writeFileSync('test.txt', 'delete from yd_smartpen; \n', 'utf-8')
                for (let i = 0; i < filelist.length; i++) {

                    if (filelist[i] !== "") {
                        try {
                            let str = fs.readFileSync(filelist[i], 'utf-8');

                            let json_ = JSON.parse(str)

                            let smartp = json_.symbols;
                            let sql = "";
                            let count = 0;
                            for (let j = 0; j < smartp.length; j++) {
                                var stringformat = format("insert into yd_smartpen (action,param,owner,code,page,px,py,width,height) values ('{0}','{1}','{2}','{3}','{4}',{5},{6},{7},{8});\n"
                                    , smartp[j].action, smartp[j].param, smartp[j].owner, smartp[j].code, smartp[j].page, smartp[j].x, smartp[j].y, smartp[j].width, smartp[j].height)
                                sql += stringformat;
                                count ++;
                                if(count>100){
                                    fs.appendFileSync('test.txt',sql,'utf-8');
                                    sql="";
                                    count=0;
                                }
                            }
                            fs.appendFileSync('test.txt',sql,'utf-8');
                           let save=  dialog.showSaveDialog()
                            if (save!==undefined)
                            {
                                console.log(save)
                                fs.writeFileSync(save,fs.readFileSync("test.txt", 'utf-8'))
                                Message('导出成功')
                            }

                        } catch (e) {
                            console.log(e)
                        }
                    }
                }
                /*const db=new sqlite.Database('SWL1R05G1L2.db')
                db.all('select * from Slide',(err,res)=>{
                   console.log(res)
                    fs.writeFileSync('1.png',res[1].Image)
                })*/
            },
            jiami() {
                try {


                    var db = new sqlite.Database('SWL1R05G1L2.db', '2845626067216461366451959697457633496012');

                    db.all('select * from Slide', (err, res) => {
                        if (err) {
                            console.log(err)
                        }
                        console.log(res)
                    })

                } catch (e) {
                    console.log(e)
                }


            },
            allowDrop(ev) {
                console.log('allowdrop')
                ev.preventDefault();
            }

            , drag(ev) {
                console.log('drag')
                ev.dataTransfer.setData("Text", ev.target.id);
            }

            , drop(ev) {
                console.log('drop')
                ev.preventDefault();
                var data = ev.dataTransfer.getData("Text");
                ev.target.appendChild(document.getElementById(data));
            },
            fenge() {
                if (this.countList < 2) {
                    return
                }
                var str = fs.readFileSync('downloadfile.txt', 'utf-8')
                var list = JSON.parse(str)

                var count = Math.round(list.length / 3);
                for (let i = 0; i < this.countList; i++) {
                    var list1 = []
                    let fcount = count * (i + 1) > list.length ? list.length : count * (i + 1)
                    for (let j = count * i; j < fcount; j++) {
                        list1.push(list[j])
                    }
                    fs.writeFileSync('downloadfile' + (i + 1) + ".txt", JSON.stringify(list1))
                }
                console.log(count)
            },
            createPic() {
                let canvas = document.getElementById('mycanvas')
                let ctx = canvas.getContext("2d")
                var grd = ctx.createLinearGradient(0, 0, 200, 1)
                grd.addColorStop(0, 'red')
                grd.addColorStop(1, 'white')
                ctx.fillStyle = grd
                ctx.fillRect(0, 0, 150, 120)
                ctx.moveTo(152, 122)
                ctx.lineTo(200, 200)
                ctx.fillStyle = 'yellow'
                ctx.stroke()
                ctx.arc(300, 100, 100, 300, 100)


            },
            async startAction() {
                // var root = path.join(this.diskName + '\\YingDing\\CR\\S')
                // console.log(root)
                // comm.readDirSync(root);
                // alert('ok')
                let res = await new Promise((resolve, reject) => {
                    resolve('系统出错')
                    alert('00')
                })
                alert('ok')
            },
            zanting() {

                var md = document.getElementById('video1')
                //md.pause()
                md.innerHTML = '<source src="test.mp4" type="video/mp4">'
                md.muted = 'muted'
                md.controls = 'controls'
                md.play()
            },
            addMedia() {

                var str = fs.readFileSync('downerrfile.txt', 'utf-8')
                //console.log(str)
                var list = JSON.parse(str)
                //console.log(list)
                for (let i = 0; i < list.length; i++) {
                    if (list[i].Prop === '异或加密文件') {
                        list[i].savebasepath = list[i].savebasepath + 'media\\'
                    }
                }
                fs.writeFile('downerrfile.txt', JSON.stringify(list), (err) => {
                })
            }
        },

        created() {
           let str=  fs.readFileSync('downloadfile.txt','utf-8')
            this.downTotal=JSON.parse(str).length
        }
    }
</script>
<style lang="scss" scoped>
    .main {

        justify-content: center;
        align-items: center;
        justify-items: center;
        align-content: center;
        overflow: hidden;
        text-align: center;
    }
</style>
