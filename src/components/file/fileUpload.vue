<template>
  <div class="file-item">
    <template v-if="!progessVisible">
      <input ref="fileInput" :accept="acceptType || accept[fileType]" :multiple="maxLength>1" type="file" class="ipt fileIpt" @change="changeFileUpload($event)">
      <i class="el-icon-plus jia" />
    </template>
    <progess v-else :value="progessValue" />
  </div>
</template>

<script>
import { postAxios } from '@/utils/request'
import progess from '@/components/file/progess'
export default {
  name: 'FileUpload',
  components: {
    progess
  },
  props: {
    fileType: {
      type: String,
      default: 'img'
    },
    fileTag: {
      type: String,
      default: ''
    },
    maxLength: {
      type: Number,
      default: 3
    },
    acceptType: {
      type: String,
      default: ''
    },
    value: {
      default: ''
    },
  },
  data() {
    return {
      accept: {
        'img': 'image/png,image/jpeg,image/gif',
        'video': 'video/*',
        'other': '*'
      },
      progessVisible: false,
      progessValue: 80
    }
  },

  methods: {
    // 上传开始前
    beforeUpload(file) {
      this.$emit('beforeUpload', file, this.fileTag)
      this.progessVisible = true
    },
    // 上传成功回调
    uploaded(res) {
      this.progessValue = 100
      setTimeout(() => {
        this.progessVisible = false
      }, 200)
      this.complete(res)
      this.$emit('success', res, this.fileTag)
    },
    // 上传失败回调
    error(err) {
      this.progessVisible = false
      this.complete(err)
      this.$emit('error', err, this.fileTag)
    },
    // 开始上传完成回调
    complete(res) {
      // this.$refs.fileInput.value = ''
      this.$emit('complete', res, this.fileTag)
    },
    // 开始上传进度时
    uploadProgress(res) {
      const resValue = Math.round(res.loaded / res.total * 100)
      console.log(resValue)
      this.progessValue = resValue
      this.$emit('uploadProgress', res, this.fileTag)
    },
    // 事件触发
    changeFileUpload(e) {
      const fileData = e.target.files
      const formData = new FormData()
      const fileLength = fileData.length
      if (fileLength > this.maxLength-this.value.length) {
        this.$message({ message: `上传失败,文件数量不能超过${this.maxLength}个`, type: 'error' })
        return false
      }
      let sizeFlag = false
      for (var i = 0; i < fileData.length; i++) {
        const sz = fileData[i].size
        if (sz >= 104857600) {
          sizeFlag = true
          break
        }
        formData.append('file', fileData[i], fileData[i].name)
      }

      if (sizeFlag) {
        this.$message({ message: '上传失败，文件不能超过100M..', type: 'error' })
        return false
      }
      this.uploadFile(formData, fileData)
    },
    // 开始上传
    uploadFile(formData, fileData) {
      const fileType = this.fileType
      this.beforeUpload(fileData)
      postAxios('/sys/file/upload', {
        params: {
          fileType: fileType
        },
        data: formData,
        onUploadProgress: (res) => {
          this.uploadProgress(res)
        }
      }).then((res) => {
        if (res.code == '0000') {
          this.uploaded(res.data)
        } else {
          this.error(res.data)
        }
      }).catch(err => {
        this.error(err.data)
      })
    }

  }
}
</script>

