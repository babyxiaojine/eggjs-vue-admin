<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
        <FileZoom v-model.sync="uploadFiles" :max-length="10" type="img"  class="clearFloat"/>
        <span slot="footer" class="dialog-footer">
            <el-button  @click="cleraFileZoom">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import FileZoom from '@/components/file/fileZoom'
export default {
  name: 'EditorSlideUpload',
    components: {FileZoom},
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      uploadFiles:''
    }
  },
  methods: {
    handleSubmit() {
      const arr = this.uploadFiles
      this.$emit('successCBK', arr)
      this.dialogVisible = false
      this.uploadFiles = ''
    },
    // 取消上传附件
    cleraFileZoom() {
        this.uploadFiles = ''
        this.dialogVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>
