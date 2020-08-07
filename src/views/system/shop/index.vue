<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button @click="handleEditItem" class="filter-item"  type="danger" icon="el-icon-circle-plus-outline">添加</el-button>
    </div>
    <el-table :data="list" row-key="id" border fit highlight-current-row  >

      <!-- <el-table-column min-width="100px" align="left" label="店铺ID">
        <template slot-scope="{row}"><span>{{ row.id}}</span></template>
      </el-table-column> -->
      <el-table-column min-width="100px" align="left" label="店铺名称">
        <template slot-scope="{row}"><span>{{ row.shopName}}</span></template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="店铺状态">
        <template slot-scope="{row}">
          <span :style="{color: row.enableFlag==='1'? '#409EFF' : '#F56C6C'}">{{ row.enableFlag==='1'?'正常':'停用'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="{row}">
          <el-button plain type="danger" v-if="row.enableFlag=='1'" size="small" @click="changeStatus(row.id)">停用</el-button>
          <el-button plain type="success" v-else size="small" @click="changeStatus(row.id)">启用</el-button>
          <el-button type="primary" plain size="small" @click="handleEditItem(row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="actShopObject.id ? '修改店铺': '新增店铺'" :visible.sync="showDialog" width="500px">
      <el-form ref="form"  label-width="110px">
          <!-- <el-form-item label="店铺CODE"><el-input v-model="actShopObject.shopCode" :disabled="actShopObject.id"></el-input></el-form-item> -->
          <el-form-item label="店铺名称"><el-input v-model="actShopObject.shopName"></el-input></el-form-item>
      </el-form>
      <div style="margin-top:30px; text-align:center">
        <el-button type="primary" @click="postSaveItem">确定</el-button>
        <el-button @click="showDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {postAxios, getAxios} from '@/utils/request'
export default {
  name: 'SystemShop',
  filters: {
  },
  data() {
    return {
      ruleForm:{
        dictType:''
      },
      filterForm:{
        description:''
      },
      pageParam:{
        pageNo:1,
        pageSize:20,
      },
      list: [],
      showDialog: false,
      actShopObject:{
        id:'',
        shopName:'',
      }
    }
  },
  created() {

  },
  mounted(){
    this.getList();
  },
  methods: {
    // 获取名称
    mapTagOptionName(tag){
      const options = tag.options || []
      const optNames = options.map(item=>{
        return item.optionName
      })
      return optNames.join(',')
    },
    // 操作新增/修改店铺
    handleEditItem(item){
      if(item){
        this.actShopObject = {
          ...item
        }
      }else{
        this.actShopObject = {
          shopName:'',
        }
      }
      this.showDialog = true
    },
    // 发送请求新增/修改店铺
    postSaveItem(){
      const itemData = this.actShopObject
      const postUrl = itemData.id ? '/shop/updateShop' : '/shop/addShop'
      if(!itemData.shopName){
        this.$message.error('店铺名称不能为空')
        return false
      }
      postAxios(postUrl,{
        data: itemData
      }).then((res)=>{
        if(res.code === '0000'){
          this.$message({message:'保存成功',type:'success'})
          this.getList()
        }else{
          this.$message.error(res.message)
        }
      })
      this.showDialog = false
    },
    //禁用，启用
    changeStatus(id){
      postAxios('/shop/deleteShop',{
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
    // 查询列表
    getList() {
      const {filterForm,pageParam,ruleForm}=this;
      postAxios('/shop/queryShopPage',{
        data:{
            "pageNo": 1,
            "pageSize": 100
        }
      }).then((res)=>{
        if(res.code === '0000' && res.data){
          let resData=res.data||[];
          this.list = resData
        }
      })
    },


  }
}
</script>

<style scoped>

</style>


