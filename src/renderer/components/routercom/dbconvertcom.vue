<template>
    <div class="main1">
        <!--<div class="contain1">
            <hr>
            SeaFile配置
            <br>
            服务器地址:
            <el-input v-model="seahost" placeholder="服务器地址"></el-input>
            &lt;!&ndash;端口:&ndash;&gt;
            &lt;!&ndash;<el-input v-model="seaPort" placeholder="端口"></el-input>&ndash;&gt;
            <br>
            用户名:
            <el-input v-model="saefileusername" placeholder="用户名"></el-input>
            密码:
            <el-input v-model="saefilepasswrod" show-password placeholder="密码"></el-input>
            <hr>
            MySql配置
        </div>-->
        <div class="contain1">

            MySql配置
            <hr>
            数据库地址:
            <el-input v-model="host" placeholder="数据库地址"></el-input>
            数据库名称:
            <el-input v-model="database" placeholder="数据库名称"></el-input>
        </div>
        <div class="contain1">
            用户名:
            <el-input v-model="username" placeholder="用户名"></el-input>
            密码:
            <el-input v-model="pwd" show-password placeholder="密码"></el-input>
            <br>
            <el-button @click="testLine">测试连接</el-button>
            <hr>
        </div>
        <div class="contain1">
            <br>

            <el-checkbox-group v-model="checkDowns">
                <el-checkbox v-for="item in downs" :key="item" :label="item">{{item}}</el-checkbox>
            </el-checkbox-group>
            <br>
            <hr>
        </div>
        <div class="contain1">
            <!--AppDB-->
            <!--<br>-->
            <!--选择AppDB-->
            <!--&lt;!&ndash;<el-input v-model="selectPath"></el-input>&ndash;&gt;-->
            <!--<el-input id="e1" v-model="bindpath" type="file" @change="schange"></el-input>-->


            <el-dropdown style="width: 150px" split-button type="primary" @command="selectvalue">
                {{DiskName}}
                <el-dropdown-menu slot="dropdown">
                    <template v-for="item in disklist">
                        <el-dropdown-item v-bind:command="item" :key="item.id">{{item}}</el-dropdown-item>
                    </template>
                </el-dropdown-menu>
            </el-dropdown>
            <br>
            <hr>
        </div>
        <div class="contain1">
            <el-button @click="excutedb"  >{{activeName}}</el-button>

        </div>

        <!--<div>-->
        <!--<el-table :data="getdata">-->
        <!--<el-table-column prop="id" label="序列号" min-width="20%"></el-table-column>-->
        <!--<el-table-column prop="name" label="姓名" min-width="20%"></el-table-column>-->
        <!--<el-table-column prop="cover" label="电话" min-width="20%"></el-table-column>-->
        <!--<el-table-column align="right" min-width="40%">-->
        <!--<template slot="header" slot-scope="scope">-->
        <!--<el-input-->

        <!--size="mini"-->
        <!--style="width: 150px;"-->
        <!--placeholder="输入关键字搜索"/>-->
        <!--</template>-->
        <!--<template slot-scope="scope">-->
        <!--<el-button>编辑</el-button>-->
        <!--<el-button>删除</el-button>-->
        <!--</template>-->

        <!--</el-table-column>-->
        <!--</el-table>-->
        <!--</div>-->
    </div>
</template>
<script>
    const downOptions = ['CoverImage', 'ElectronPage', 'Mideo', 'UnitCover', 'SmallP'];
    const defaultProp = '异或加密文件' //'COMMON_REPOSITORY'
    const defalutimage = 'IMAGE' //'/IMAGE/'
    const mysql = require('mysql')
    const sqlite = require('sqlite3').verbose();
    const uuid = require('node-uuid')
    const path = require('path')
    import axios from 'axios'
    import Vue from 'vue'
    import {Message} from 'element-ui'

    const fs = require('fs')
    import commManager from '../../commjs/comm.js'
    import streamdownload from '../../streamDownFile/streamdownload.js'
    import {request} from 'http';

    function PrefixInteger(num, n) {
        return (Array(n).join(0) + num).slice(-n);
    }

    export default {
        watch: {
            bindpath: {
                deep: true,
                handler: function (newvalue, oldvalue) {

                    this.selectPath = document.getElementById("e1").files[0]["path"]
                }
            }
        },
        computed:{
          disable(){
              return this.isAction
          }
        },
        created() {
            commManager.getDiskList().then(res => {
                this.disklist = res
                console.log(this.disklist)
            })
        },
        data() {
            return {
                getdata: null,
                pwd: 'fengsheng@123',
                host: '20.0.0.33',
                username: 'fengsheng',
                database: 'tools_new',
                seahost: '',
                seaPort: '8081',
                saefileusername: '',
                saefilepasswrod: '',
                saefileToken: '',
                saeProps: {},
                htmlinner: '',
                selectPath: 'AppDB.db',
                bindpath: '',
                disklist: {},
                DiskName: '请选择磁盘',
                IsAction: false,
                downFileList: [],//下载失败集合
                AllFileList: [],//需要下载的列表
                downs: downOptions,
                checkDowns: downOptions,
                activeName:'执行'
            }
        },
        methods: {
            testLine() {
                try {
                    let mysqlconn = mysql.createConnection({
                        host: this.host,
                        user: this.username,
                        password: this.pwd,
                        database: this.database
                    })
                    mysqlconn.connect((err, state) => {
                        if (!err) {
                            Message("连接成功");
                        } else {
                            Message("连接失败");
                        }
                    })

                } catch (e) {
                    Message('连接失败');
                }


            },
            selectvalue(command) {
                this.DiskName = command
                console.log(this.DiskName)
            },
            schange(value) {

            },
            /**
             * 执行操作
             * @returns {Promise<void>}
             */
            async excutedb() {
                try {

                    if (this.IsAction) {
                        Message({
                            message: '正在执行中...',
                            type: 'warning',
                            center: true
                        })
                        return
                    }
                    // if (document.getElementById("e1").files[0] === undefined) {
                    //     Message({
                    //         message: '请先生成AppDB',
                    //         type: 'warning',
                    //         center: true
                    //     })
                    //
                    //     return
                    // }
                    if (!fs.existsSync('AppDB.db')) {
                        Message({
                            message: '请先生成AppDB',
                            type: 'warning',
                            center: true
                        })

                        return
                    }
                    if (this.DiskName.length !== 2) {
                        Message({
                            message: '请选择磁盘',
                            type: 'warning',
                            center: true
                        })
                        return
                    }

                    // var http = axios.create({
                    //     withCredentials: true,
                    //     baseURL: this.seahost,
                    //     timeout: 15000
                    // })
                    // Vue.http = Vue.prototype.$http = http
                    // ///获取token
                    // let res = await new Promise((func, res) => {
                    //     commManager.getToken(this.$http, this.saefileusername, this.saefilepasswrod).then((res) => {
                    //         if (res === 'error') {
                    //             func('error')
                    //
                    //         } else {
                    //             this.saefileToken = res
                    //             //获取列表库
                    //             commManager.getProps(this.$http, this.saefileToken).then((res) => {
                    //                 if (res === 'error') {
                    //                     func('error')
                    //                 } else {
                    //                     this.saeProps = res
                    //                     console.log(this.saeProps)
                    //                     func(res)
                    //                 }
                    //
                    //             })
                    //         }
                    //
                    //     })
                    // })
                    // if (res === 'error') {
                    //     Message('')
                    //     return;
                    // }

                    //this.selectPath = document.getElementById("e1").files[0]["path"]
                    this.IsAction = true;
                    this.activeName='执行中'
                    //连接mysql
                    this.downFileList = []
                    var mysqlconn = mysql.createConnection({
                        host: this.host,
                        user: this.username,
                        password: this.pwd,
                        database: this.database
                    })
                    await new Promise((func, res) => {
                        mysqlconn.connect((err, state) => {
                            if (err) {
                                func(err)
                            } else {
                                func('')
                            }
                        });
                    })
                    //连接 sqlite3
                    var sqliteconn = new sqlite.Database(this.selectPath)
                    //sqliteconn.serialize()
                    //添加字典表
                    {
                        //class
                        let grade = await new Promise((func, res) => {
                            mysqlconn.query('select * from yd_grade', function (err, res) {
                                func(res)
                                //console.log("grade" + res)
                            })
                        });
                        //console.log(grade)
                        for (let i = 0; i < grade.length; i++) {
                            await new Promise((func, res) => {
                                sqliteconn.run('insert into Class (ClassID,ClassName) Values (?,?)', [grade[i].id, grade[i].name], function (err) {
                                    if (err) {
                                        func(err)
                                        console.log(err)
                                    } else {
                                        func('')
                                    }
                                })
                            })
                        }

                        //subject
                        let subject = await new Promise((func, res) => {
                            mysqlconn.query('select * from yd_subject where phase=2', function (err, res) {
                                func(res)
                            })
                        });
                        for (let i = 0; i < subject.length; i++) {
                            await new Promise((func, res) => {
                                sqliteconn.run('insert into Subject (SubjectID,SubjectName) Values (?,?)', [subject[i].code, subject[i].name], function (err) {
                                    if (err) {
                                        func(err)
                                        console.log(err)
                                    } else {
                                        func('')
                                    }
                                })
                            })

                        }
                        //teacher
                        let teacher = await new Promise((func, res) => {
                            mysqlconn.query('select * from yd_teacher', function (err, res) {
                                func(res)
                            })
                        });
                        for (let i = 0; i < teacher.length; i++) {
                            await new Promise((func, res) => {
                                sqliteconn.run('insert into Teacher (TeacherID,TeacherName) Values (?,?)', [teacher[i].export_key, teacher[i].name], function (err, res) {
                                    if (err) {
                                        func(err)
                                        console.log(err)
                                    } else {
                                        func('')
                                    }
                                })
                            })
                        }

                        //lessons
                        let lessons = await new Promise((func, res) => {
                            mysqlconn.query("select id,name,serial from yd_junior_course", function (err, res) {
                                func(res)
                            })
                        });
                        for (var i = 0; i < lessons.length; i++) {
                            await new Promise((func, res) => {
                                sqliteconn.run('insert into Lessons (LessonId,LessonName,OrderNo) Values(?,?,?)', [lessons[i].id, lessons[i].name, lessons.serial], (err) => {
                                    if (err) {
                                        func(err)
                                        console.log(err)
                                    } else {
                                        func('')
                                    }
                                })
                            })
                        }

                        //smart_pen
                        let smartpen = await new Promise((func, res) => {
                            mysqlconn.query(' select * from yd_smartpen  ', function (err, res) {
                                func(res);
                            })
                        })
                        for (var i = 0; i < smartpen.length; i++) {
                            var sp = smartpen[i]
                            await new Promise((func, res) => {
                                sqliteconn.run('insert into SmartPen (Action,Param,Owner,Code,Page,Px,Py,Width,Height) values (?,?,?,?,?,?,?,?,?)', [sp.action, sp.param, sp.owner, sp.code, sp.page, sp.px, sp.py, sp.width, sp.height], (err) => {
                                    if (err) {
                                        func(err)
                                        console.log(err)
                                    } else {
                                        func('')
                                    }
                                });
                            })
                        }

                    }

                    //查询textbook
                    let result = await new Promise((ress, rejj) => {
                        mysqlconn.query('select sub.subject_id,subj.code as subcode,book.id, book.export_key,book.name, book.code, book.cover,book.page_end , book.page_start,book.description, book.serial from yd_junior_textbook book ,yd_junior_textbook_subject sub ,yd_subject subj where book.id=sub.textbook_id and subj.id=sub.subject_id  \n' +
                            '                            and book.display_flag=1 and subj.display_flag=1  ;', function (err, res1) {
                            //and book.id in (60,75,76,77,49,55,56,59,46,47,78,65)
                            ress(res1);
                        })
                    })
                    for (let i = 0; i < result.length; i++) {
                        let guidtopic = uuid.v4();
                        let topicid = result[i].id;
                        let subjectid = result[i].subcode;
                        let topicexportkey = result[i].export_key
                        let codeid = result[i].code;
                        let basepath = '\\YingDing\\CR\\S\\BookPic\\' + topicexportkey + '\\'
                        await new Promise((func, res) => {
                            sqliteconn.run('delete from topic where SubjectID=? and TopicID=?', [subjectid, topicexportkey], (err) => {
                                if (err) {
                                    func(err)
                                    console.log(err)
                                } else {
                                    func('')
                                }
                            });
                        })
                        let extname=result[i].cover===null?'':path.extname(result[i].cover);
                        let filename=topicid;
                        await new Promise((func, res) => {

                            sqliteconn.run('INSERT INTO Topic (SubjectID, TopicID, TopicName, CoverImage, CodeId, StartPage, EndPage, IsTopic, Describe, OrderNo) VALUES (?,?,?,?,?,?,?,?,?,?)',
                                [subjectid, topicexportkey, result[i].name, '\\' + topicexportkey + '\\' + filename + extname, codeid, result[i].page_start, result[i].page_end, 1,
                                    result[i].description, result[i].serial], (err) => {
                                    if (err) {
                                        func(err)
                                        console.log(err)
                                    } else {
                                        func('')
                                    }
                                });
                        })
                        if (this.checkDowns.includes("CoverImage")) {
                            this.AllFileList.push({
                                Prop: defalutimage,
                                path: result[i].cover,
                                savebasepath: basepath,
                                filename: filename,
                                tablename: 'yd_junior_textbook',
                                file: 'cover'
                            })
                        }
                        var startpage = result[i].page_start;
                        var endpage = result[i].page_end;
                        //topicpage
                        let textbppk_electronicPage = await new Promise((func, res) => {
                            mysqlconn.query('SELECT ele_page.id ,ele_page.speech_id,ele_page.textbook_id,ele_page.file,ele_page.code,ele_page.page\n' +
                                'FROM\n' +
                                'yd_junior_textbook_electronic_page AS ele_page\n' +
                                'INNER JOIN yd_junior_textbook AS book ON ele_page.textbook_id = book.id and book.id=? and ele_page.display_flag=1 and book.display_flag=1 ', [topicid], (err, res) => {
                                func(res)
                            })
                        })

                        for (let j = 0; j < textbppk_electronicPage.length; j++) {
                            let speechid = textbppk_electronicPage[j].speech_id;
                            let charptidres = await new Promise((func, res) => {
                                mysqlconn.query('select chapter_id from yd_junior_speech where id=? and display_flag=1 ', [speechid], function (err, res) {
                                    func(res)
                                })
                            });

                            if (charptidres.length === 0) {
                                continue;
                            }

                            var chapter_id = charptidres[0].chapter_id;
                            let charptdata = await new Promise((func, res) => {
                                mysqlconn.query('select * from yd_junior_chapter where id=? and display_flag=1 ', [chapter_id], function (err, res) {
                                    func(res)
                                })
                            });

                            let grade_id = charptdata[0].grade_id;
                            let chapterexportkey = charptdata[0].export_key
                            //var courseid = charptdata[0].course_id;
                            let volumeid = "S" + subjectid + topicexportkey + chapterexportkey;

                            //TopicPages
                            //var file = textbppk_electronicPage[j].file;
                            let guid = uuid.v4();
                            let basepath = '\\YingDing\\CR\\S\\BookPic\\' + topicexportkey + '\\'
                            let extname=textbppk_electronicPage[j].file===null?"":path.extname(textbppk_electronicPage[j].file);
                            let filename=textbppk_electronicPage[j].file===null?'':path.parse(textbppk_electronicPage[j].file).name;
                            await new Promise((func, res) => {

                                //console.log(textbppk_electronicPage[j].file)
                                sqliteconn.run('INSERT INTO "main"."TopicPages" (Id, PageNo, Image, ClassId, VolumeID,CodeId, CodePage, SpeechId, SubjectId) VALUES (?,?,?,?,?,?,?,?,?);',
                                    [textbppk_electronicPage[j].id, textbppk_electronicPage[j].page, '\\' + topicexportkey + '\\' + filename + extname, grade_id, volumeid, codeid, textbppk_electronicPage[j].code, speechid, subjectid], (err) => {
                                        if (err) {
                                            func(err)
                                            console.log(err)
                                        } else {
                                            func('')
                                        }
                                    });
                            })
                            if (this.checkDowns.includes('ElectronPage')) {
                                this.AllFileList.push({
                                    Prop: defalutimage,
                                    path: textbppk_electronicPage[j].file,
                                    savebasepath: basepath,
                                    filename: filename,
                                    tablename: 'yd_junior_textbook_electronic_page',
                                    file: 'file'
                                })
                            }


                        }

                        //LessonRelation
                        let lessonRelation = await new Promise((func, res) => {
                            mysqlconn.query('select id from yd_junior_course where id in ( select DISTINCT( course_id) from yd_junior_chapter where textbook_id=?)', [topicid], function (err, res) {
                                func(res)
                            })
                        });
                        for (let j = 0; j < lessonRelation.length; j++) {
                            let LessonId = lessonRelation[j].id;
                            await new Promise((func, res) => {
                                sqliteconn.run('insert into LessonRelation (LessonId,TopicId,SubjectId) values (?,?,?)', [LessonId, topicexportkey, subjectid], (err) => {
                                    if (err) {
                                        func(err)
                                        console.log(err)
                                    } else {
                                        func('')
                                    }
                                })
                            })
                        }
                        //Volume
                        let charpter = await new Promise((func, res) => {
                            mysqlconn.query('select id,name, course_id,grade_id,serial,export_key from yd_junior_chapter  where textbook_id=? and display_flag=1 ', [topicid], function (err, res) {
                                func(res)
                            })
                        });

                        for (let j = 0; j < charpter.length; j++) {
                            let volumeid = "S" + subjectid + topicexportkey + charpter[j].export_key;
                            await new Promise((func, res) => {
                                sqliteconn.run('insert into Volume (VolumeID,SubjectID,TopicID,UnitID,VolumeName,ClassID,LessonId,OrderNo) values(?,?,?,?,?,?,?,?)', [
                                    volumeid, subjectid, topicexportkey, charpter[j].export_key, charpter[j].name, charpter[j].grade_id, charpter[j].course_id, charpter[j].serial], (err) => {
                                    if (err) {
                                        func(err)
                                        console.log(err)
                                    } else {
                                        func('')
                                    }
                                })
                            })
                        }

                        //Unit
                        let unit = await new Promise((func, res) => {
                            mysqlconn.query('SELECT\n' +
                                'speech.chapter_id,\n' +
                                'book.`name` as bookname,\n' +
                                'video.speech_id,\n' +
                                'video.id,\n' +
                                'video.duration,\n' +
                                'video.`name`,\n' +
                                'video.key_str,\n' +
                                'video.eor_key_path,\n' +
                                'video.serial,\n' +
                                'video.cover,\n' +
                                'charpt.course_id,\n' +
                                'charpt.`name` as chartname,\n' +
                                'charpt.grade_id,\n' +
                                'charpt.export_key AS cid,\n' +
                                'teacher.teacher_id,\n' +
                                'yd_teacher.export_key AS tid\n' +
                                'FROM\n' +
                                'yd_junior_video AS video\n' +
                                'INNER JOIN yd_junior_speech AS speech ON video.speech_id = speech.id\n' +
                                'INNER JOIN yd_junior_chapter AS charpt ON speech.chapter_id = charpt.id\n' +
                                'INNER JOIN yd_junior_chapter_teacher AS teacher ON teacher.junior_chapter_id = charpt.id\n' +
                                'INNER JOIN yd_teacher ON teacher.teacher_id = yd_teacher.id\n' +
                                'INNER JOIN yd_junior_textbook AS book ON charpt.textbook_id = book.id\n' +
                                'WHERE\n' +
                                'video.speech_id = speech.id AND\n' +
                                'video.display_flag = 1 AND\n' +
                                'charpt.textbook_id =? \n' +
                                'ORDER BY\n' +
                                'speech.chapter_id ASC,\n' +
                                'video.speech_id ASC,\n' +
                                'video.serial ASC\n', [topicid], function (err, res) {
                                func(res)
                            })
                        });

                        //console.log(unit)
                        //console.log(topicid+":"+ unit.length)
                        for (var j = 0; j < unit.length; j++) {
                            var chptname = unit[j].chartname
                            var bookname = unit[j].bookname;
                            var courseid = "S" + subjectid + topicexportkey + unit[j].cid + unit[j].tid + unit[j].serial;
                            let basepath = '\\YingDing\\CR\\S\\' + subjectid + '\\' + topicexportkey + '\\' + unit[j].cid + unit[j].tid + unit[j].serial + "\\";
                            if (this.checkDowns.includes('SmallP')) {
                                let xpres = await new Promise((func, res) => {
                                    commManager.xiapp(this.DiskName + basepath, courseid + '.db')
                                    func("");
                                })
                            }
                            await new Promise((func, res) => {
                                sqliteconn.run('insert into Unit (CourseID,SubjectID,TopicID,UnitID,TeacherID,OrderID,DisplayName,Snapshot,SnapshotL,ClassID,CanRead,keystr) values (?,?,?,?,?,?,?,?,?,?,?,? )', [
                                    courseid, subjectid, topicexportkey, unit[j].cid, unit[j].tid, unit[j].serial, unit[j].name, "null", "null", unit[j].grade_id, 1, unit[j].key_str], (err) => {
                                    if (err) {
                                        console.log("学科:" + subjectid + " 教材ID:" + topicid + " 教材名称:" + bookname + "  章节名称:" + chptname)
                                    }
                                    func('');
                                })

                            })
                            await new Promise((func, res) => {
                                sqliteconn.run('insert into coursetype (courseid,movielength,typeid) values (?,?,?)', [courseid, unit[j].duration, 1], (err) => {
                                    if (err) {
                                        func(err)
                                        console.log(err)
                                    } else {
                                        func('')
                                    }
                                })
                            })
                            let eorketypath = unit[j].eor_key_path.replace('/异或加密文件', '')
                            if (this.checkDowns.includes('Mideo')) {
                                this.AllFileList.push({
                                    Prop: defaultProp,
                                    path: eorketypath,
                                    savebasepath: basepath + 'media\\',
                                    filename: courseid,
                                    tablename: 'yd_junior_video',
                                    file: 'eor_key_path'
                                })
                            }
                            if (this.checkDowns.includes('UnitCover')) {
                                await new Promise((func, res) => {
                                    commManager.base64ToImage(unit[j].cover, this.DiskName + basepath, courseid + '.jpg')
                                    func('')
                                })
                            }
                            //小P
                            if (this.checkDowns.includes('SmallP')) {

                                let material = await new Promise((func, res) => {
                                    mysqlconn.query('select * from yd_junior_video_material where video_id=? and display_flag=1', [unit[j].id], (err, res) => {
                                        func(res)
                                    })
                                })

                                if (material.length > 0) {

                                    //var downerrfile = []
                                    //fs.copyFileSync('p.db',this.DiskName+basepath+courseid + '.db')
                                    const xpdb = new sqlite.Database(this.DiskName + basepath + courseid + '.db')
                                    //alert('ok')
                                    for (let m = 0; m < material.length; m++) {
                                        let xpuid = uuid.v4()
                                        let json = JSON.parse(material[m].json_format)
                                        this.AllFileList.push({
                                            Prop: defalutimage,
                                            path: json.image,
                                            savebasepath: basepath,
                                            filename: material[m].id+'_'+material[m].video_id,
                                            tablename: 'yd_junior_video_material',
                                            file: 'json_format'
                                        })
                                        await new Promise((func, res) => {
                                            xpdb.run('insert into Slide (ID,Time,Image,ImageL) values(?,?,?,?)', [material[m].id, json.endTime, material[m].id+'_'+material[m].video_id + path.extname(json.image), xpuid + path.extname(json.image)], (err) => {
                                                if (err) {
                                                    func(err)
                                                    console.log('test'+err)
                                                } else {
                                                    func('')
                                                }
                                            })
                                        })
                                    }
                                    xpdb.close()
                                }
                            }
                            //书签笔记
                            let bookmart = await new Promise((func, res) => {
                                mysqlconn.query('select * from yd_junior_video_bookmark where video_id=?  and display_flag=1 ', [unit[j].id], (err, res) => {
                                    func(res)
                                })
                            })
                            for (let m = 0; m < bookmart.length; m++) {
                                await new Promise((func, res) => {
                                    sqliteconn.run('insert into UnitChapter (CourseID,Time,SectionName,Knowledge,RefKnowledge,EndTime) values (?,?,?,?,?,?)', [courseid, bookmart[m].start_time, bookmart[m].name, '', '', bookmart[m].end_time], (err) => {
                                        if (err) {
                                            console.log(err)
                                        }
                                        func('')
                                    })
                                })
                            }
                        }
                        //speech
                        let speech = await new Promise((func, res) => {
                            mysqlconn.query('SELECT\n' +
                                'charpter.export_key,\n' +
                                'speech.id,\n' +
                                'speech.`name`,\n' +
                                'speech.serial,\n' +
                                'speech.chapter_id\n' +
                                'FROM\n' +
                                'yd_junior_speech AS speech\n' +
                                'INNER JOIN yd_junior_chapter AS charpter ON speech.chapter_id = charpter.id\n' +
                                'where charpter.textbook_id=? and speech.display_flag=1 and charpter.display_flag=1 ', [topicid], (err, res) => {
                                func(res)
                            });
                        });

                        for (var j = 0; j < speech.length; j++) {
                            var volumeid = "S" + subjectid + topicexportkey + PrefixInteger(speech[j].export_key, 3);
                            await new Promise((func, res) => {
                                sqliteconn.run('insert into Speech (SpeechId,SpeechName,VolumeID,SubjectId) values (?,?,?,?)', [
                                    speech[j].id, speech[j].name, volumeid, subjectid
                                ], (err) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    func('')
                                })
                            })
                        }
                    }
                    //dbVersion
                    let date = new Date();
                    let code = date.getFullYear() + PrefixInteger(date.getMonth() + 1, 2) + PrefixInteger(date.getDate(), 2) + PrefixInteger(date.getHours(), 2) + PrefixInteger(date.getMinutes(), 2);
                    await new Promise((func, res) => {
                        sqliteconn.run('insert into DbVersion (DbCode,DbContent) values (?,?)', [code, code], (err) => {
                            if (err) {
                                console.log(err)
                            }
                            func('')
                        })
                    })
                    fs.writeFile('downloadfile.txt', JSON.stringify(this.AllFileList), (err) => {
                    })
                    sqliteconn.close()
                    this.IsAction = false;
                    this.activeName='执行'
                } catch (e) {
                    console.log(e)
                    this.IsAction = false;
                    this.activeName='执行'
                    alert(e)
                }
            },
            ReadFileCallBack(arg, percentage) {
                if (arg === 'finished') {
                    console.log('下载成功')
                } else if (arg === 'error') {
                    console.log('下载失败')
                }
            },
            getToken(name, pwd) {
                let token = ''
                this.$http.post('/api2/auth-token/', {username: name, password: pwd}).then((res) => {
                    token = res.data['token']

                }).catch((err) => {
                })
                return token
            },
            getProps(token) {
                let props = {}
                this.$http.get('/api2/repos/', {headers: {"Authorization": 'Token ' + token}}).then((res) => {
                    for (let i = 0; i < res.data.length; i++) {
                        props[res.data[i].name] = res.data[i].id
                    }

                })
                return props;
            }
        }
    }
</script>
<style lang="scss" scoped>
    .main1 {
        height: 500px;
        justify-content: center;
        align-items: center;
        align-content: center;

        .contain1 {

            width: 100%;
            text-align: center;

            justify-items: center;
            align-items: center;

            .el-button {
                font-size: 15 xp;
                margin-right: 20px;
            }

            .el-input {
                margin: 20px 20px;
                width: 200px;

            }

            .el-table {
                width: 100%;

            }
        }
    }


</style>
