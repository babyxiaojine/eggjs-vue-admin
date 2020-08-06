<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="10">
        <el-col :span="4"><gInput type="select" :readonly="false" placeholder="选择店铺" v-model="listForm.shopId" :option="userShopOption" @input="getActivityList"></gInput></el-col>
        <el-col :span="4"><gInput type="select" :extendProps="{filterable:true}" :readonly="false" placeholder="选择活动" v-model="listForm.activityId" :option="activityOption"></gInput></el-col>
        <el-col :span="4"><el-button @click="setSearchForm" class="filter-item" style="max-width:100%;box-sizing:border-box;" type="primary" icon="el-icon-search" >查询</el-button></el-col>
        <el-col :span="12">
          <exportButton type="2" style="float:right; margin-right:10px;" :disabled="list.length===0" :postData="filterForm" fileData="RECEIVE_SALE_EXPORT" title="导出" buttonType="danger"></exportButton>
        </el-col>
      </el-row>
    </div>
      <el-table :data="list" row-key="id" border fit highlight-current-row style="width: 100%"  >
        <el-table-column width="150px" align="center" label="店铺">
          <template slot-scope="{row}"><span>{{ row.shopName }}</span></template>
        </el-table-column>
        <el-table-column align="left" label="活动名称" width="180px">
          <template slot-scope="{row}"><span>{{ row.activityName }}</span></template>
        </el-table-column>
        <el-table-column min-width="120px" align="center" label="物料编码">
          <template slot-scope="{row}"><span>{{ row.sku }}</span></template>
        </el-table-column>
        <el-table-column min-width="120px" align="center" label="商品名称">
          <template slot-scope="{row}"><span>{{ row.productName }}</span></template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="申请数量">
          <template slot-scope="{row}"><span>{{ row.applyQty }}</span></template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="实际销售量">
          <template slot-scope="{row}"><span>{{ row.saleQty }}</span></template>
        </el-table-column>
        <el-table-column width="120px" align="center" label="领用售卖差异">
          <template slot-scope="{row}"><span :style="{color: row.differentQty<0 ? '#F56C6C' : '#409EFF'}">{{ row.differentQty }}</span></template>
        </el-table-column>
      </el-table>

    <el-pagination  v-if="total" :current-page.sync="pageParam.pageNo" style="margin-top:20px" background layout="prev, pager, next" :page-size="pageParam.pageSize" @current-change="handlePageChange"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>
import {exportButton,gInput} from '@/components/Form/'
import {postAxios, getAxios} from '@/utils/request'
export default {
  name: 'SaleDifference',
  components:{
      exportButton,
      gInput
  },
  data() {
    return {
      listForm:{
        shopId: '',
        activityId: ''
      },
      filterForm:{
        shopId: '',
        activityId: ''
      },
      pageParam:{
        pageNo:1,
        pageSize:10,
      },
      total:0,
      list: [],
      userShopOption:[],
      activityOption:[]
    }
  },
  created() {
    this.userShopOption = [
      ...this.$store.getters.queryShops
    ]
  },
  activated(){
    // this.getList()
  },
  methods: {
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
      if(!filterForm.shopId){
        this.$message.error('请选择店铺')
        return false
      }
      if(!filterForm.activityId){
        this.$message.error('请选择活动')
        return false
      }
      postAxios('/receiveSale/queryReceiveSale',{
        data:{
          ...filterForm,
          pageNo:pageParam.pageNo,
          pageSize:pageParam.pageSize
        }
      }).then((res)=>{
        if(res.code === '0000' && res.data){
          const resList = res.data.list||[];
          resList.map(item=>{
            item.newPrice = item.price
            item.handleStatus = false
          })
          this.list = resList
          this.total = res.data.total||0;
        }
      })
    },

    // 查询活动列表
    getActivityList(shopId) {
      this.activityOption = []
      this.listForm.activityId = ''
      postAxios('/activity/queryActivityPage', {
          data: {
              shopId,
              pageNo: 1,
              pageSize: 1000
          }
      }).then((res) => {
          if (res.code === '0000' && res.data) {
            const resData = res.data.list || []
            const resList = resData.filter(item=>item.activityStatus===2)
            resList.map(item=>{
              item.name = item.activityName
            })
            this.activityOption = resList
          }
      })
    }
  },
  deactivated(){

  }
}
</script>

<style scoped>

</style>

