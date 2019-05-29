<template>
    <div class="main1">
        <div class="contain1">
            <el-input id="e1" v-model="selectPath" type="file"></el-input>
            <el-button :disabled="!isAbles" @click="createdb">生成db</el-button>
        </div>
    </div>
</template>
<script>
import  fs from 'fs'
import {Message} from 'element-ui'
    export default {
        computed: {
            isAbles() {

                return this.isAble
            }
        },

        methods: {
            test() {
                this.isAble=true
            },
            createdb() {
                try {
                    if (document.getElementById("e1").files[0] == undefined) {
                        return
                    }
                    this.isAble = false
                    //fs.unlinkSync('App.DB')

                    let that=this
                    const fs = require('fs')
                    const sqlite = require('sqlite3').verbose()
                    var path = document.getElementById("e1").files[0]["path"]

                    fs.readFile(path, "utf-8", (err, data) => {
                        if (err) {
                            Message("读取失败")
                            return;
                        }
                        //console.log(data)
                        //alert('1')
                        var db = new sqlite.Database('AppDB.db')
                        //console.log(db)
                        db.exec(data, function (err) {
                            if (!err) {
                                Message('生成成功')
                                that.isAble = true
                                db.close()
                            } else {
                                alert(err)
                                that.isAble = true
                                db.close()
                            }
                        })


                    })


                } catch (e) {
                    this.isAble = true
                }

            }
        },
        data() {
            return {
                selectPath: '',
                isAble: true
            }
        }
    }
</script>
<style lang="scss" scoped>
    .main1 {
        height: 500px;
        display: flex;
        align-items: center;
        justify-content: center;

        .contain1 {
            display: flex;

            .el-button {
                font-size: 15 xp;
                margin-right: 20px;
            }

            .el-input {
                vertical-align: middle;
                text-align: center;
                horiz-align: right;
                margin-right: 20px;
                width: 300px;
            }
        }
    }
</style>
