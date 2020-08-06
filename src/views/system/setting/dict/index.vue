<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listForm.dictType"  placeholder="请选择类型标识" style="width: 200px;" class="filter-item">
          <el-option label="全选" value=""></el-option>
          <el-option v-for="item in dictTypeList" :key="item.roleType" :label="item" :value="item"></el-option>
      </el-select>

      <el-input v-model.trim="filterForm.description" placeholder="字典描述"  style="width: 200px;" class="filter-item" />
      <el-button @click="setSearchForm" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" >查询</el-button>
      <el-button @click="handleJumpAdd(false)" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-circle-plus-outline">添加</el-button>
    </div>
      <el-table :data="list" row-key="id" border fit highlight-current-row style="width: 100%"  >
        <el-table-column min-width="160px" align="left" label="类型">
          <template slot-scope="scope">
            <span>{{ scope.row.dictType}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="键值" min-width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.labelKey}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="150px" align="center" label="标签">
          <template slot-scope="scope">
            <span>{{ scope.row.labelValue}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="160px" align="center" label="描述">
          <template slot-scope="scope">
            <span>{{ scope.row.description}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="160px" align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime| parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="160px" align="center" label="更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime| parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="180" fixed="right">
          <template slot-scope="{row}">
            <el-button plain type="primary" size="small" @click="handleJumpAdd(true,row.id)">编辑</el-button>
            <el-button plain type="danger" size="small" @click="delDict(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    <el-pagination  v-if="total" :current-page.sync="pageParam.pageNo" style="margin-top:20px" layout="prev, pager, next" background :page-size="pageParam.pageSize" @current-change="handlePageChange"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>
import {postAxios, getAxios} from '@/utils/request'
export default {
  name: 'SystemSettingDict',
  filters: {
  },
  data() {
    return {
      listForm:{
      },
      filterForm:{},
      pageParam:{
        pageNo:1,
        pageSize:10,
      },
      total:0,
      list: [],
      listLoading: true,
      dictTypeList:[]
    }
  },
  created() {
    this.searchType();
  },
  activated(){
    this.getList();
  },
  methods: {

    // 跳转添加页面
    handleJumpAdd(flag,id){
      if(flag){
        this.$router.push({
          path:'./edit',
          query: {pageTitle:'修改字典',id}
        })
      }else{
        this.$router.push({
          path:'./edit',
          query: {pageTitle:'添加字典'}
        })
      }
    },

    //删除
    delDict(id){
      this.$confirm('此操作将永久删除此条字典数据, 是否继续?', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
          .then(() => {
              postAxios('/sys/dictionary/deleteDict',{
                params:{
                  id
                }
              }).then((res)=>{
                if(res.code === '0000' ){
                  this.getList();
                  this.searchType();
                  this.$message({
                    message:'删除成功',
                    type: 'success'
                  });
                }
              })
          })
          .catch(action => {

          });

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
      this.listLoading = true;
      const {filterForm,pageParam}=this;
      postAxios('/sys/dictionary/loadAllDict',{
        data:{
          ...filterForm,
          pageParam: {
              pageNo:pageParam.pageNo,
              pageSize:pageParam.pageSize
          }
        }
      }).then((res)=>{
        if(res.code === '0000' && res.data){
          this.list = res.data.list||[];
          this.total = res.data.total||0;
          this.listLoading = false;
        }
      })
    },

    //查询字典类别
    searchType(id){
      postAxios('/sys/dictionary/queryTypeList',{
        data:{
        }
      }).then((res)=>{
        if(res.code === '0000'){
          this.dictTypeList=res.data||[];
        }
      })
    }

  }
}
</script>

<style scoped>

</style>


