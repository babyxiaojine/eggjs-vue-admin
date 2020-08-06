<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="10">
        <el-col :span="4"><el-input v-model.trim="listForm.activityName" placeholder="活动名称" style="width: 100%;" class="filter-item" /></el-col>
        <el-col :span="4"><gInput type="select" :readonly="false" placeholder="店铺" v-model="listForm.shopId" :option="userShopOption"></gInput></el-col>
        <el-col :span="4"><gInput type="select" :readonly="false" placeholder="订单状态" v-model="listForm.paymentStatus" :option="paymentStatusOption"></gInput></el-col>
        <el-col :span="4"><el-button @click="setSearchForm" class="filter-item" style="max-width:100%;box-sizing:border-box;" type="primary" icon="el-icon-search" >查询</el-button></el-col>
        <el-col :span="8">
          <exportButton type="2" style="float:right;" :postData="filterForm" fileData="ORDER_LINE_EXPORT" title="订单商品行导出" buttonType="danger"></exportButton>
          <exportButton type="2" style="float:right; margin-right:10px;" :postData="filterForm" fileData="ORDER_EXPORT" title="导出" buttonType="danger"></exportButton>
        </el-col>
      </el-row>
    </div>
      <el-table :data="list" row-key="id" border fit highlight-current-row style="width: 100%"  >
        <el-table-column align="left" label="活动名称" width="180px">
          <template slot-scope="{row}"><span>{{ row.activityName }}</span></template>
        </el-table-column>
        <el-table-column width="110px" align="left" label="店铺">
          <template slot-scope="{row}"><span>{{ row.shopName }}</span></template>
        </el-table-column>
        <el-table-column width="200px" align="left" label="订单编号">
          <template slot-scope="{row}"><span>{{ row.orderCode }}</span></template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="员工工号">
          <template slot-scope="{row}"><span>{{ row.userNo }}</span></template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="买家姓名">
          <template slot-scope="{row}"><span>{{ row.userName }}</span></template>
        </el-table-column>
        <el-table-column width="120px" align="center" label="买家电话">
          <template slot-scope="{row}"><span>{{ row.userMobile }}</span></template>
        </el-table-column>
        <el-table-column min-width="120px" align="center" label="物料编码">
          <template slot-scope="{row}"><span>{{ row.sku }}</span></template>
        </el-table-column>
        <el-table-column min-width="120px" align="center" label="商品名称">
          <template slot-scope="{row}"><span>{{ row.productName }}</span></template>
        </el-table-column>
        <el-table-column width="80px" align="center" label="购买数量">
          <template slot-scope="{row}"><span>{{ row.qty }}</span></template>
        </el-table-column>
        <el-table-column width="90px" align="center" label="商品单价">
          <template slot-scope="{row}"><span>{{ row.price }}</span></template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="商品订单金额">
          <template slot-scope="{row}"><span>{{ row.orderAmount }}</span></template>
        </el-table-column>
        <el-table-column width="80px" align="center" label="订单状态">
          <template slot-scope="{row}"><span :style="{color: row.paymentStatus===2 ? '#47b511' : ''}">{{ $getOptionName(paymentStatusOption, row.paymentStatus) }}</span></template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="提交时间">
          <template slot-scope="{row}"><span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span></template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="订单完成时间">
          <template slot-scope="{row}"><span>{{ row.payTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span></template>
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
  name: 'Order',
  components:{
      exportButton,
      gInput
  },
  data() {
    return {
      listForm:{
      },
      filterForm:{
        shopId:'',
      },
      pageParam:{
        pageNo:1,
        pageSize:10,
      },
      total:0,
      list: [],
      paymentStatusOption: [
        {id:'', name:'全部状态'},
        {id:1, name:'待支付'},
        {id:2, name:'已完成'},
        {id:3, name:'已取消'},
      ],
      userShopOption: []
    }
  },
  created() {
    this.userShopOption = [
      {id:'', name:'全部店铺'},
      ...this.$store.getters.queryShops
    ]
  },
  activated(){
    this.getList()
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
      postAxios('/order/queryOrderPage',{
        data:{
          ...filterForm,
          pageNo:pageParam.pageNo,
          pageSize:pageParam.pageSize
        }
      }).then((res)=>{
        if(res.code === '0000' && res.data){
          const resList = res.data.list||[];
          this.list = resList
          this.total = res.data.total||0;
        }
      })
    },

  },
  deactivated(){

  }
}
</script>

<style scoped>

</style>

