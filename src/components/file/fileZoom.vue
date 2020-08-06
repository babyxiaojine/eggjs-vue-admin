<template>
  <ul class="photos-list clearfix bdbtm mt10" :class="`file-size-${size}`">
    <li v-for="(item,index) in vmList" :key="index">
      <div class="file-item">
        <a v-if="type === 'other'" target="_blank" class="static-file" :href="needAll ? item.showPath :item" :download="needAll ? item.fileName : ''">
          <div class="fname">{{ needAll ? item.fileName : splitFileName(item)+'文件' }}</div>
        </a>
        <img v-else :src="item" alt="" @click="openFileZoom(item)">
        <div class="handle-item">
          <i v-if="type !== 'other'" class="el-icon-zoom-in" @click="openPhotoImg(item)" />
          <i v-else class="el-icon-download" @click="downloadFile(needAll ? item.showPath :item, needAll ? item.fileName : '')" />
          <i v-if="!readonly" class="el-icon-delete" @click="delItemImg(item,index)" />
        </div>
      </div>
      <div v-if="title" class="fname">{{ title }}</div>
    </li>
    <li v-if="!readonly && value.length<maxLength">
      <fileUpload :max-length="maxLength" :file-tag="fileTag" :file-type="type" :value="value" :acceptType="acceptType" @success="fileUploadSuccess" />
      <div v-if="title" class="fname">{{ title }}</div>
    </li>
    <el-dialog title="查看图片" :visible.sync="dialogVisible" width="50%" append-to-body modal-append-to-body custom-class="photoImgDialog" top="10vh">
      <div class="bigImgBox"><img :src="dialogImg" alt=""></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </ul>

</template>
<script>
import { postAxios } from '@/utils/request'
import { splitFileName, downloadFile } from '@/utils/index'
import fileUpload from '@/components/file/fileUpload'
export default {
  name: 'FileZoom',
  components: {
    fileUpload
  },
  props: {
    readonly: {
      default: false,
      type: Boolean
    },
    fileTag: {
      default: '',
      type: String
    },
    fileType: {
      default: '',
      type: String
    },

    value: {
      default: ''
    },
    title: {
      default: '',
      type: String
    },
    type: {
      default: 'img',
      type: String
    },
    maxLength: {
      default: 1,
      type: Number
    },
    acceptType: {
      type: String,
      default: ''
    },
    needAll: {
      default: false,
      type: Boolean
    },
    size: {
      default: 'default',
      type: String
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogImg: ''
    }
  },
  computed: {
    vmList() {
      const { value, maxLength } = this
      if (maxLength === 1) {
        if (value) {
          return [value]
        } else {
          return []
        }
      } else {
        return value
      }
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    openPhotoImg(item) {
      this.dialogImg = item
      this.dialogVisible = true
    },
    // 上传成功回调
    fileUploadSuccess(res, tag) {
      const { value, maxLength, needAll } = this
      let newFiles = []
      if(needAll){
        newFiles = maxLength === 1 ? res[0] : [...value, ...res]
      }else{
        newFiles = maxLength === 1 ? res[0].showPath : [...value, ...res.map(item=>item.showPath)]
      }
      this.$emit('input', newFiles)
    },

    // 打开相册编辑
    openFileZoom(url) {},
    // 删除图片
    delItemImg(index) {
      const { value, maxLength } = this
      if (maxLength === 1) {
        this.$emit('input', '')
      } else {
        value.splice(index, 1)
        this.$emit('input', value)
      }
    },
    downloadFile,
    splitFileName
  }
}
</script>
<style lang="scss" >
.photos-list{
  li{width: 120px;  float: left; margin-right:15px;}
  li:last-child{margin-right: 0;}
  .file-item{
    width:100%; height: 120px; border-radius:5px; @include trans; overflow: hidden; position: relative; border:1px dashed #c0ccda; background: #fafafa; color:#d9d9d9;
    img{width: 100%; height: 100%; display: block;}
    input.fileIpt{position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; z-index: 1; cursor: pointer;}
    i.jia{position: absolute; top: 50%; left: 50%; height: 30%; font-size: 32px; height: 30px; width: 30px; line-height: 30px; text-align: center; transform:translate(-50%,-50%); }
    &:hover{border-color:#1890ff; color:#1890ff;}
    .handle-item{position: absolute; @include trans(0.1s); top: 0; left: 0; width: 100%; height: 100%; @include flexbox; background: rgba(0,0,0,.6); color:#fff; font-size: 22px; opacity: 0;
      &:hover{opacity: 1; }
      i{padding:9px 6px; cursor:pointer; margin:0 2px; @include trans(0.2s);
        &:hover{color:$red; transform:scale(1.6);}
      }
    }
  }
    .static-file{display: flex;flex-direction: column;justify-content: flex-end; width: 100%; height: 100%; background:url(../../assets/icon_file.png) no-repeat center -5px/100% 100%;color:#606266;}
  /*.static-file{height: 100%; color:#000;}*/
  .fname{padding:8px 2px 6px; text-align: center; font-size: 13px;  @include ellipsis;}

}
.photoImgDialog{
  .el-dialog__body{padding:15px 10px;}
}
.bigImgBox{width:100%;
  img{display: block; max-width: 100%; max-height:65vh; margin:0 auto;}
}
//小图模式
.file-size-small{
  li{width:60px; margin-right: 10px; margin-bottom: 5px;}
  .file-item{width: 60px; height: 60px;}
  .circles-wrap{transform: scale(0.5); transform-origin: 0 0; top: 10px; left: 10px;}
   .fname{padding:4px 2px 2px; font-size: 12px; line-height: 16px;}
}
</style>
