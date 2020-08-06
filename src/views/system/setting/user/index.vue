<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listForm.loginName" placeholder="用户账号" style="width: 200px;" class="filter-item" />
      <el-input v-model.trim="listForm.name" placeholder="用户姓名" style="width: 200px;" class="filter-item" />
      <el-input v-model.trim="listForm.mobile" placeholder="用户电话" style="width: 200px;" class="filter-item" />
      <el-button @click="setSearchForm" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" >查询</el-button>
      <el-button @click="handleJumpAdd(false)" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-circle-plus-outline">添加</el-button>
    </div>
      <el-table :data="list" row-key="id" border fit highlight-current-row style="width: 100%"  :row-class-name="({row})=>{ return row.enableFlag==='0' ? 'disabled-row' : ''}">
        <el-table-column width="150" align="left" label="用户账号">
          <template slot-scope="{row}"><span>{{ row.loginName}}</span></template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" label="用户姓名">
          <template slot-scope="{row}"><span>{{ row.name}}</span></template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" label="用户电话">
          <template slot-scope="{row}"><span>{{ row.mobile}}</span></template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" label="角色">
          <template slot-scope="{row}"><span>{{ row.roleName}}</span></template>
        </el-table-column>

        <el-table-column min-width="160px" align="center" label="所属店铺">
          <template slot-scope="{row}">
            <span>{{ row.shopId === 'ALL' ? 'ALL' : $getOptionName(allShop, row.shopId, '-') }}</span>
          </template>
        </el-table-column>

        <el-table-column width="120px" align="center" label="用户状态">
          <template slot-scope="{row}">
            <span :style="{color: row.enableFlag==='1'? '#409EFF' : '#F56C6C'}">{{ row.enableFlag==='1'?'正常':'停用'}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="{row}">
            <el-button plain type="danger" v-if="row.enableFlag=='1'" size="small" @click="changeStatus(row.id)">停用</el-button>
            <el-button plain type="success" v-else size="small" @click="changeStatus(row.id)">启用</el-button>
             <el-button plain type="primary" size="small" @click="handleJumpAdd(true,row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

    <el-pagination  v-if="total" :current-page.sync="pageParam.pageNo" style="margin-top:20px" background layout="prev, pager, next" :page-size="pageParam.pageSize" @current-change="handlePageChange"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>
import {postAxios, getAxios} from '@/utils/request'
export default {
  name: 'SystemSettingUser',
  filters: {
  },
  data() {
    return {
      listForm:{
        userType:'1'
      },
      filterForm:{},
      pageParam:{
        pageNo:1,
        pageSize:10,
      },
      total:0,
      list: [],
      allShop:[]
    }
  },
  created() {
    this.$store.dispatch('user/queryAllShop').then(res=>{
      this.allShop = res
    })
  },
  activated(){
    this.getList()
  },
  methods: {
    // 跳转添加页面
    handleJumpAdd(flag,id){
      if(flag){
        this.$router.push({
          path:'./edit',
          query: {pageTitle:'修改用户',id}
        })
      }else{
        this.$router.push({
        path:'./edit',
        query: {pageTitle:'添加用户'}
      })
      }
    },

    //停用、恢复
    changeStatus(id){
      postAxios('/sys/user/deleteUser',{
        params:{
          id
        }
      }).then((res)=>{
        if(res.code === '0000'){
          this.getList();
          this.$message({
            message:'修改成功',
            type: 'success'
          });
        }
      })
    },
    // 翻页
    handlePageChange(){
      this.getList()
    },
    // 查询列表
    setSearchForm(){
      this.filterForm={...this.listForm};
      this.pageParam.pageNo=1;
      this.getList();
    },
    // 查询列表
    getList() {
      const {filterForm,pageParam}=this;
      postAxios('/sys/user/loadAllUser',{
        data:{
          ...filterForm,
          userType:'1',
          pageNo:pageParam.pageNo,
          pageSize:pageParam.pageSize
        }
      }).then((res)=>{ 
        if(res.code === '0000' && res.data){
          this.list = res.data.list||[];
          this.total = res.data.total||0;
        }
      })
    },

  },
  deactivated(){

  }
}
</script>

<style >
.el-table .disabled-row {
    background: #ececec;
}
</style>

