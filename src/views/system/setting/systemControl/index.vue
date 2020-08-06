<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listForm.title" placeholder="菜单名称" style="width: 200px;" class="filter-item" />
      <el-input v-model.trim="listForm.createBy" placeholder="用户名称" style="width: 200px;" class="filter-item" />
      <el-input v-model.trim="listForm.requestUrl" placeholder="输入RequestUrl" style="width: 200px;" class="filter-item" />
      <div style="width: 220px;display:inline-block;"  class="filter-item" >
          <el-date-picker v-model="listForm.startDate" type="date" value-format="timestamp" placeholder="开始日期">
          </el-date-picker>
      </div>
      <div style="width: 220px;display:inline-block;"  class="filter-item" >
          <el-date-picker v-model="listForm.endDate" :picker-options="pickerOptionsEnd" type="date" value-format="timestamp" placeholder="结束日期">
          </el-date-picker>
      </div>
      <el-button @click="setSearchForm" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search">查询</el-button>
    </div>
      <el-table :data="list" row-key="id" border fit highlight-current-row style="width: 100%"  >
        <el-table-column align="left" label="操作菜单" min-width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.title}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="150px" align="center" label="操作用户">
          <template slot-scope="scope">
            <span>{{ scope.row.createBy}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="160px" align="center" label="操作者IP">
          <template slot-scope="scope">
            <span>{{ scope.row.remoteAddr}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="160px" align="center" label="更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime| parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="160px" align="center" label="RequestURL">
          <template slot-scope="scope">
            <span>{{ scope.row.requestUrl}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="120px" align="center" label="提交方式">
          <template slot-scope="scope">
            <span>{{ scope.row.method}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="140" fixed="right" >
          <template slot-scope="{row}">
            <el-button plain type="danger" size="small" @click="handleDel(row.id)">删除</el-button>
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
  name: 'SystemSettingSystemControl',
  filters: {
  },
  data() {
    return {
      listForm:{
        title:'',
        requestUrl:'',
        createBy:'',
        endDate:'',
        startDate:''
      },
      filterForm:{},
      pageParam:{
        pageNo:1,
        pageSize:10,
      },
      total:0,
      list: [],
      pickerOptionsEnd: {
          disabledDate: time => {
              let beginDateVal = this.listForm.startDate;
              if (beginDateVal) {
                  return (
                          time.getTime() < new Date(beginDateVal).getTime()+24*3600*1000
                  );
              } else {
                  return time.getTime() <0
              }
          }
      },
    }
  },
  created() {

  },
  activated(){
    this.getList()
  },
  methods: {

    // 删除
    handleDel(id){
      this.$confirm('此操作将永久此条日志记录, 是否继续?', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
          .then(() => {
              postAxios('/log/log/deleteUser?id='+id,{
                  data:{}
              }).then((res)=>{
                  if(res.code=="0000"){
                      this.getList();
                      this.$message({
                          message: res.message,
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
      const {startDate,endDate}=this.filterForm;
      if(startDate&&endDate ){
          if(startDate>endDate){
              this.$message({message: '结束时间需大于开始时间', type: 'error'})
              return false
          }
      }
      this.pageParam.pageNo=1;
      this.getList();
    },
    // 查询列表
    getList() {
      const {filterForm,pageParam}=this;
      postAxios('/log/log/loadAllSysLog',{
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
        }
      })
    },

  }
}
</script>

<style scoped>

</style>

