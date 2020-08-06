<template>
  <div>
    <el-upload
      class="upload-demo fl"
      :show-file-list="false"
      action=""
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      :http-request="handleImportSuccess">
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-upload2" >{{title}}</el-button>
    </el-upload>
    <el-dialog append-to-body title="导入文件错误" :visible.sync="showDialog" width="800px">
      <el-alert type="error" :closable="false" effect="dark" :title="`当前导入文件错误总计 ${errorResult.length} 条，仅显示10条，请仔细修改完成后重新上传`"></el-alert>
      <el-table v-if="showErrors" :data="showErrors" row-key="id" max-height="500" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="错误行数" width="90px">
            <template slot-scope="{row}">
              {{row.errorRowIndex}}
            </template>
          </el-table-column>
          <el-table-column align="left" label="信息">
            <template slot-scope="{row}">
              {{row.errorMsg}}
            </template>
          </el-table-column>
      </el-table>
      <div style="margin-top:20px; text-align:right">
        <el-button @click="showDialog = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {postAxios, getAxios} from '@/utils/request'
export default {
  components:{
    
  },
  props:{
    type:{
      type: String,
      default:''
    },
    title:{
      type: String,
      default: '导入'
    },
    option:{
      type: Array,
      default: ()=>[]
    },
    value:{
      default: ''
    },
    postUrl:{
      type: String,
      default: '/sys/file/upload'
    },
    params:{
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      showDialog:false,
      errorResult: [],
      showErrors: []
    }
  },
  created() {

  },
  methods: {
    // 抽离显示错误信息功能
    showErrorMessage(res){
      const errorResult = res.data.rtnExcelImportFailed || []
      this.errorResult = errorResult
      const eLength = errorResult.length
      if (eLength > 10) {
        const showErrors = []
        for(let i = 0; i < 10; i++){
          showErrors.push(errorResult[i])
        }
        this.showErrors = showErrors
      }else{
        this.showErrors = [...errorResult]
      }
      this.showDialog = true
    },
    // 导入功能
    handleImportSuccess(e){
      const fileData = e.file
      const formData = new FormData()
      formData.append('file', fileData, fileData.name)
      postAxios('/excel/import',{
        skipValidate:true,
        params: {
          params:JSON.stringify(this.params),
          importType: this.type
        },
        data:formData
      }).then((res)=>{
        if(res.code === '0000'){
          const resData = res.data.rtnExcelImportSuccess
          this.$emit('success',resData)
        }else{
          // code为7000:excel格式错误
          if(res.code === '7000'){
            this.showErrorMessage(res)
          }else{
            this.$message.error(res.message)
          }
          this.$emit('error')
        }
        
      }).catch(()=>{
        this.$emit('error')
      })
    },
    
  },
  computed:{
  },
}
</script>

<style scoped>

</style>
