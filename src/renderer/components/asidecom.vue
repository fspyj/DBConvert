<template>
    <div class="main">
        <div class="contain">
            <el-menu router default-active="activeindex" class="menu">
                <el-menu-item index="dbconvert">数据库转换</el-menu-item>
                <el-menu-item index="createdb">生成AppDB</el-menu-item>
                <el-menu-item index="downfile">下载文件</el-menu-item>
                <el-menu-item index="other">其它功能</el-menu-item>
            </el-menu>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                activeindex:'dbconvert'
            }
        }
    }
</script>
<style lang="scss" scoped>
    .main {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;


        .contain {

            height: 100px;


            .menu {
                background-color: transparent;
                text-color: #ff21d8;
                active-text-color:#ff21d8;
                .el-menu-item{
                   font-size: 17px;
                }
            }

        }
    }
</style>
