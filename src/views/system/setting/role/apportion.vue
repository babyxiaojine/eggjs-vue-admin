<template>
  <div class="app-container">
    <el-table :data="list" row-key="id" border fit highlight-current-row style="max-width:600px;"  >
      <el-table-column min-width="150px" align="left" label="登陆名">
        <template slot-scope="scope">
          <span>{{ scope.row.userNo }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="160px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name}}</span>
        </template>
      </el-table-column>

    
      <el-table-column min-width="200px" align="center" label="电话号码">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="操作" width="120">
        <template slot-scope="{row}">
          <el-button type="danger"  size="small" @click="handleDeleteItem(row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="mt20 "><el-button @click="$appBack()">返回</el-button></div>
    
  </div>
</template>

<script>
import {postAxios, getAxios} from '@/utils/request'

export default {
  name: 'SystemSettingRoleApportion',
  filters: {
  },
  data() {
    return {
      list: [],
      id:'',
    }
  },
  activated() {
    this.id=this.$route.query.id;
    this.getList()
  },
  methods: {
    
    // 删除操作
    handleDeleteItem(data){
    //   this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.postDeleteItem(data);
    //   }).catch(() => {
                  
    //   });
    },
    // 请求删除
    postDeleteItem(data){
      postAxios('/sys/role/deleteRole',{
        params:{
          id:data.id
        }
      }).then((res)=>{
        if(res.code === '0000'){
          this.$message({message:'删除成功',type:'success'})
          this.getList()
        }
      })
    },

    // 查询列表
    getList() {
        let id=this.id;
      getAxios('/sys/role/getUser?roleId='+id,{}).then((res)=>{
          if(res.code === '0000'){
            this.list=res.data||[];
        }
      })
    },
  },
  deactivated() {
    this.list=[];
  },
}
</script>

<style scoped>

</style>
