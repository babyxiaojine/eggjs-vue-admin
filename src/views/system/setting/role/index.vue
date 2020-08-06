<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listForm.name" placeholder="角色名称" style="width: 200px;" class="filter-item" />
      <el-input v-model.trim="listForm.ename" placeholder="英文名称" style="width: 200px;" class="filter-item" />
      <el-button @click="setSearchForm" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" >查询</el-button>
      <el-button @click="handleJumpAdd" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-circle-plus-outline">添加</el-button>
    </div>
    <el-table :data="list" row-key="id" border fit highlight-current-row style="width: 100%"  >
      <el-table-column align="left" label="角色名称" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" align="center" label="角色英文名">
        <template slot-scope="scope">
          <span>{{ scope.row.ename }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="160px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="160px" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="角色类型">
        <template slot-scope="scope">
          <span>{{ scope.row.roleType }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="260" fixed="right" >
        <template slot-scope="{row}">
          <el-button plain type="primary" size="small" @click="$router.push({name:'SystemSettingRoleApportion',query:{id:row.id}})">分配</el-button>
          <el-button plain type="warning" size="small" @click="jumpToEdit(row)">编辑</el-button>
          <el-button plain type="danger" size="small" @click="handleDeleteItem(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {postAxios, getAxios} from '@/utils/request'

export default {
  name: 'SystemSettingRole',
  filters: {
  },
  data() {
    return {
      listForm:{},
      filterForm:{},
      list: [],
      listLoading: true,
    }
  },
  activated() {
    this.getList()
  },
  methods: {
    // 编辑操作
    jumpToEdit(data){
      this.$router.push({
        name:'SystemSettingRoleEdit',
        query: {isEdit: true},
        params: data
      })
    },

    // 跳转添加页面
    handleJumpAdd(){
      this.$router.push({
        path:'./edit',
        query: {pageTitle:'添加角色'}
      })
    },
    // 删除操作
    handleDeleteItem(data){
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.postDeleteItem(data);
      }).catch(() => {

      });
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
    // 设置筛选条件
    setSearchForm() {
      this.filterForm = {...this.listForm}
      this.getList();
    },
    // 查询列表
    async getList() {
      this.listLoading = true
      const data = await postAxios('/sys/role/loadAllRole',{
        data: this.filterForm
      }).then((res)=>{
        if(res.code === '0000' && res.data){
          this.list = res.data.list||[];
          this.listLoading = false
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
