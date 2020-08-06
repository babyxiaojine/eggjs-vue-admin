<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="10">
        <el-col :span="4"><el-input v-model.trim="listForm.barcode" placeholder="商品69码" style="width: 100%;" class="filter-item" /></el-col>
        <el-col :span="4"><el-input v-model.trim="listForm.productName" placeholder="商品名称" style="width: 100%;" class="filter-item" /></el-col>
        <el-col :span="4"><gInput type="select" :readonly="false" placeholder="店铺" v-model="listForm.shopId" :option="userShopOption"></gInput></el-col>
        <el-col :span="4"><el-button @click="setSearchForm" class="filter-item" type="primary" icon="el-icon-search" >查询</el-button></el-col>
            
        <el-col :span="8">
          <importButton v-if="shopId !== 'ALL'" @success="importSuccess" class="imp-btn" style="display:inline-block; float:right" type="PRODUCT_INVENTORY" :params="{shopId}" title="导入商品"></importButton>
          <exportButton type="1" style="float:right;" :fileData="OSSURL+'/Templates/goods_template.xlsx'" title="示例导出" buttonType="default"></exportButton>
        </el-col>
      </el-row>
    </div>
      <el-table :data="list" row-key="id" border fit highlight-current-row style="width: 100%"  >
        <el-table-column align="left" label="店铺名称" width="150px">
          <template slot-scope="{row}"><span>{{ row.shopName }}</span></template>
        </el-table-column>

        <el-table-column align="left" label="商品69码" width="180px">
          <template slot-scope="{row}">
            <el-popover :open-delay="150" placement="right" width="auto" trigger="hover" @after-enter="showBarCode(row.id, row.barcode)">
              <div><svg :ref="`barCode${row.id}`"></svg></div>
              <el-link slot="reference" type="primary" :underline="false" icon="el-icon-camera">{{ row.barcode }}</el-link>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column min-width="150px" align="center" label="物料编码">
          <template slot-scope="{row}"><span>{{ row.sku }}</span></template>
        </el-table-column>

        <el-table-column min-width="160px" align="center" label="商品名称">
          <template slot-scope="{row}"><span>{{ row.productName}}</span></template>
        </el-table-column>

        <el-table-column width="160px" align="center" label="售价">
          <template slot-scope="{row}">
            <span v-if="!row.handleStatus">{{ row.price}}</span>
            <gMoney v-else v-model="row.newPrice"></gMoney>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="{row}">
            <template v-if="shopId !== 'ALL'">
              <el-button plain type="primary" v-if="!row.handleStatus" size="small" @click="row.handleStatus = true">编辑</el-button>
              <template v-else>
                <el-button plain type="success" size="small" @click="editProdPrice(row)">保存</el-button>
                <el-button plain type="danger"  size="small" @click="row.handleStatus = false">取消</el-button>
              </template>
            </template>
          </template>
        </el-table-column>
      </el-table>
      
    <el-pagination  v-if="total" :current-page.sync="pageParam.pageNo" style="margin-top:20px" background layout="prev, pager, next" :page-size="pageParam.pageSize" @current-change="handlePageChange"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>
import {importButton,exportButton, gMoney, gInput} from '@/components/Form/'
import {postAxios, getAxios} from '@/utils/request'
import { formatToMoney } from '@/utils'
import jsBarCode from 'jsbarcode'
export default {
  name: 'Product',
  components:{
      importButton,
      exportButton,
      gInput,
      gMoney
  },
  data() {
    return {
      OSSURL:  process.env.VUE_APP_OSS_URL,
      listForm:{
        userType:'1'
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
      userShopOption: [],
      shopId:''
    }
  },
  created() {
    this.userShopOption = [
      {id:'', name:'全部店铺'},
      ...this.$store.getters.queryShops
    ]
  },
  activated(){
    this.shopId = this.$store.getters.queryShopId
    this.getList()
  },
  methods: {
    // 生成条形码
    showBarCode(id,code){
      JsBarcode(this.$refs[`barCode${id}`],code, {
        text: code,
        format: "CODE39",
        lineColor: '#000000',
        displayValue: true,
        width: 1.2,
        height: 80,
        margin: 20,
      });
    },
    // 导入商品
    importSuccess(){
      this.$message.success('导入商品成功')
      this.getList()
    },
    //停用、恢复
    editProdPrice(item){
      postAxios('/product/updateProduct',{
        data:{
          id: item.id,
          price: parseFloat(item.newPrice)
        }
      }).then((res)=>{
        if(res.code === '0000'){
          item.price = item.newPrice
          item.handleStatus = false
          this.$message.success('修改成功');
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
      postAxios('/product/queryProductPage',{
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

  },
  deactivated(){

  }
}
</script>

<style scoped>

</style>

