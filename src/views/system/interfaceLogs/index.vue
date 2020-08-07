<template>
  <div class="app-container">
    <div class="filter-container">
        <el-form :inline="true" :model="listForm" ref="filterForm" label-width="100px" class="demo-ruleForm">
            <el-form-item prop="startDate">
                <el-date-picker v-model="listForm.startDate" type="date" value-format="timestamp" placeholder="开始日期"></el-date-picker>
            </el-form-item>
            <el-form-item prop="endDate">
                <el-date-picker v-model="listForm.endDate" :picker-options="pickerOptionsEnd" type="date" value-format="timestamp" placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item prop="result">
                <el-select v-model="listForm.result" placeholder="请选择发送状态" style="width: 200px;" class="filter-item">
                    <el-option v-for="item in statusList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="sendCode">
                <el-select v-model="listForm.sendCode" placeholder="请选择发送方" style="width: 200px;" class="filter-item">
                    <el-option v-for="item in receiveList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="receiveCode">
                <el-select v-model="listForm.receiveCode" placeholder="请选择接受方" style="width: 200px;" class="filter-item">
                    <el-option v-for="item in sendList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="setSearchForm"  class="filter-item" style="margin-left: 10px;" icon="el-icon-search">查询</el-button>
                <el-button @click="resetForm"  class="filter-item" style="margin-left: 10px;">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
      <el-table :data="list" row-key="id" border fit highlight-current-row style="width: 100%"  >
        <el-table-column align="left" label="发送方" min-width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.sendCode}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="150px" align="center" label="接收方">
          <template slot-scope="scope">
            <span>{{ scope.row.receiveCode}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="160px" align="center" label="接口地址">
          <template slot-scope="scope">
            <span>{{ scope.row.interUrl}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="160px" align="center" label="接口名称">
          <template slot-scope="scope">
            <span>{{ scope.row.interName}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="160px" align="center" label="开始时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime| parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="160px" align="center" label="发送结果">
          <template slot-scope="scope">
            <span>{{ scope.row.result=="0"?"成功":"失败"}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="160px" align="center" label="问题日志">
          <template slot-scope="scope">
            <span>{{ scope.row.failReason}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="140" fixed="right">
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
  name: 'SystemInterfaceLogs',
  filters: {
  },
  data() {
    return {
      listForm:{
        endDate:'',
        startDate:'',
        result:'',
        receiveCode:'',
        sendCode:''
      },
      filterForm:{},
      pageParam:{
        pageNo:1,
        pageSize:10,
      },
      statusList:[{code:'0',name:'成功'},{code:'1',name:'失败'}],
      total:0,
      list: [],
      receiveList:[],
      sendList:[],
      pickerOptionsEnd: {
        disabledDate: time => {
            let beginDateVal = this.listForm.startDate;
            if (beginDateVal) {
                return (
                        time.getTime() < new Date(beginDateVal).getTime()+24*3600*1000
                );
            } else {
                return time.getTime() < 0
            }
        }
      },
    }
  },
  created() {
    this.getReceiveList();
    this.getSendList();
  },
  mounted(){

  },
  activated(){
    this.getList();
  },
  methods: {
      //重置
      resetForm() {
        this.$refs.filterForm.resetFields();
      },
    //根据type查询接收方
    getReceiveList(){
        postAxios('/log/log/getSystemEnumByType?type=1',{
            data:{}
        }).then((res)=>{
            if(res.code=="0000"){
                this.receiveList=res.data||[];
            }
        })
    },
    //根据type查询发送方
    getSendList(){
        postAxios('/log/log/getSystemEnumByType?type=2',{
            data:{}
        }).then((res)=>{
            if(res.code=="0000"){
                this.sendList=res.data||[];
            }
        })
    },



    // 删除
    handleDel(id){
        this.$confirm('此操作将永久删除此条接口日志, 是否继续?', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
          .then(() => {
              postAxios('/log/log/deleteInterLogById?id='+id,{
                    data:{}
                }).then((res)=>{
                    if(res.code=="0000"){
                        this.getList();
                        this.$message({
                            message: "删除成功",
                            type: 'success'
                        });
                    }
                })
          })
          .catch(action => {

          });
    },

    //导出
    exportExcel(){

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
      postAxios('/log/log/loadAllInterLog',{
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
    }

  }
}
</script>

<style scoped>

</style>

