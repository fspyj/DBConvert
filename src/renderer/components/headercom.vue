<template>
    <div class="main" :style="{height: height}">
        <div class="left">

        </div>
        <div class="right">
            <el-button type="text" size="mini" @click="mini">
                <i class="btn el-icon-minus"></i>
            </el-button>
            <el-button type="text" size="mini" @click="close">
                <i class="btn el-icon-close"></i>
            </el-button>
        </div>
    </div>
</template>
<script>

    export default {
       props:{
           height:{
               type:String,
               default:"20px"
           }
       },
        methods:{
           mini(){
               this.$electron.ipcRenderer.send('mini')
           },
            close(){
                this.$confirm('是否继续退出系统','系统提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(() =>{
                    this.$electron.ipcRenderer.send('close');
                }).catch(()=>{});
                //this.$electron.ipcRenderer.send('close');
            }
        }
    }
</script>
<style lang="scss" scoped>
    .main {
        display: flex;
        margin: 0;
        padding: 0;

        overflow: hidden;
        align-items: center;
        justify-content: space-between;
        .left {

            display: flex;
            align-items: center;
            flex: 1;
        }

        .right {
            overflow: hidden;
            justify-content: flex-start;
            display: flex;
            .btn{
                font-size: 17px;
                color: #909399;
                -webkit-app-region:no-drag
            }
            .btn:hover{
                color: #31c27c;
            }
        }
    }
</style>
