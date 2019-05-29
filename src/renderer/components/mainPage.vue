<template>
    <div class="maindiv">

        <el-container class="contain">
            <el-container class="maincontatiner">
                <el-aside class="aside">
                    <asidecom></asidecom>
                </el-aside>
                <el-container>
                    <el-header class="header">
                        <headercom height="50px"></headercom>
                    </el-header>
                    <el-main class="mainmain">
                        <keep-alive>
                            <router-view></router-view>
                        </keep-alive>

                    </el-main>
                </el-container>

            </el-container>
            <el-footer class="footer" >

            </el-footer>
        </el-container>

    </div>
</template>
<script>
    import headercom from './headercom'
    import asidecom from './asidecom.vue'

    export default {
        components: {
            headercom, asidecom
        },
        methods: {
            testsql: function () {

                const sqlite = require('sqlite3').verbose()
                console.log(sqlite)
                const mysql = require('mysql')
                console.log(mysql)
                /* var db = new sqlite.Database('test.db');
                 db.exec("create table UserInfo(UserId nvarchar(100) NOT NULL,Name nvarchar(100),phone nvarchar(100),Address nvarchar(500) ,Time date)", function (err) {
                     if (!err) {
                         console.log('创建成功')
                     }

                     db.close();
                 })*/
                /*  const  fs=require('fs')
                  console.log(sqlite)
                  fs.open('test.db','w',function (err,fd) {

                  })*/
            }
        }
    }
</script>
<style lang="scss"  >
    .maindiv {
        .contain {
            height: 100vh;

            .maincontatiner {

                position: relative;

                .aside {
                    width: 150px;
                    background: linear-gradient(to bottom, #efefef, #efefef);
                    display: flex;
                    flex-direction: column;
                }



                .header {
                    height: 100px;
                    background: #fafafa;
                    -webkit-app-region: drag;
                }
            }
        }


    }

    .footer {
        height: 50px;
        background: #fafafa;

    }
    .mainmain {
        overflow: hidden;
        display: flex;
        margin: 0;
        padding: 0;
        flex: 1;
        flex-shrink: 0;
    }
</style>
