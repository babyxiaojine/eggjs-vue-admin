<template>
  <el-button @click="download" :disabled="disabled" class="filter-item" :type="buttonType" icon="el-icon-download" >{{title}}</el-button>
</template>

<script>
import {openServiceUrl, postAxios, getAxios} from '@/utils/request'
import {downloadFile, exportDownload} from '@/utils/index'
export default {
  components:{

  },
  props:{
    /**
     * type
     * @'0' 字典中静态文件通过字典获取得到url
     * @'1' 静态url
     * @'2':动态文件，点击生成返回文件流
    */
    type:{
      type: String,
      default:'0'
    },
    title:{
      type: String,
      default: '导出'
    },
    fileData:{
      type: String,
      default: ''
    },
    fileName:{
      type: String,
      default: ''
    },
    postData:{
      type: Object,
      default: ()=>{}
    },
    postUrl:{
      type: String,
      default: ''
    },
    buttonType:{
      type: String,
      default: 'default'
    },
    disabled:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {
    // type：0，查询字典中的静态文件
    queryStaticDocument(){
      postAxios('/sys/dictionary/loadAllDict',{
        data:{
          dictType: 'static_document',
          labelKey: this.fileData
        }
      }).then((res)=>{
        if(res.data.list && res.data.list[0] && res.data.list[0].description){
          const exportUrl = process.env.VUE_APP_OSS_URL + res.data.list[0].description
          downloadFile(exportUrl)
        }else{
          this.$message.error('没有找到文件')
        }
      }).catch(()=>{

      })
    },
    // type：2，导出接口动态文件
    queryDynamicDocument(){
      const postUrl = this.postUrl || '/excel/export'
      postAxios(postUrl, {
        skipValidate:true,
        params: {
          exportType: this.fileData,
        },
        data:this.postData
      }).then((res)=>{
        if(res.code === '0000'){
            downloadFile(res.data, this.fileName)
        }else{
          this.$message.error(res.message)
        }
      }).catch(()=>{
        this.$message.error('导出失败')
      })
    },
    // 导出
    download(){
      const {type,fileData} = this
      if(type === '0'){
        this.queryStaticDocument()
      }
      if(type === '1'){
        downloadFile(fileData, this.fileName)
      }
      if(type === '2'){
        this.queryDynamicDocument()
        // openServiceUrl('/ss',{dd:11})
      }
    },

  },
  computed:{
  },
}
</script>

<style scoped>

</style>
