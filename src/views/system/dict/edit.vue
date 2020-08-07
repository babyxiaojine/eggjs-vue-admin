<template>
  <div class="app-container">
    <el-form ref="form" :model="formData" :rules="rules" label-width="120px" class="app-form" @submit.native.prevent="handleSubmit">
      <el-form-item label="类型标识" prop="dictType">
        <el-input v-model="formData.dictType" ></el-input>
      </el-form-item>
      <el-form-item label="键值" prop="labelKey">
        <el-input v-model="formData.labelKey"></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="labelValue">
        <el-input v-model="formData.labelValue"></el-input>
      </el-form-item>
      <el-form-item label="描述"  prop="description">
        <el-input type="textarea" placeholder="请输入描述文字" :rows="5" v-model="formData.description" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
        <el-button @click="$appBack()">返回</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import {postAxios, getAxios} from '@/utils/request'

export default {
  name: 'SystemDictEdit',
  filters: {
  },
  data() {
    return {
      rules: {
        dictType:{required: true, message: '类型标识不能为空', trigger: 'blur'},
        labelKey:{required: true, message: '键值不能为空', trigger: 'blur'},
        labelValue:{required: true, message: '标签内容不能为空', trigger: 'blur'},
        description:{required: true, message: '描述内容不能为空', trigger: 'blur'},
      },
      formData: {
        dictType:'',
        labelKey: '',
        labelValue:'',
        description:''
      },
      query:{},
    }
  },
  created() {
  },
  mounted(){
    const query=this.$route.query;
    this.query=query;
    if(query.id){
      this.getDiceInfo();
    }
  },
  methods: {
    // 提交操作
    handleSubmit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.postSubmit()
        } else {
          return false;
        }
      })
    },
    // 请求提交
    async postSubmit(){
      const {query} = this;
      let url='',{formData}=this;
      if(query.id){
        url='/sys/dictionary/updateDict'
        formData={...formData,id:query.id}
      }else{
        url='/sys/dictionary/addDict'
      }
      console.log("url",url,formData);
      postAxios(url,{
        data: {
          ...formData
        }
      }).then((res)=>{
        if(res.code==='0000'){
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$appBack()
        }
      })
    },
    //获取用户信息
    getDiceInfo(){
      const {query}=this;
      postAxios('/sys/dictionary/loadAllDict',{
          data: {
            id:query.id
          }
      }).then((res)=>{
        if(res.code==='0000'&&res.data.list){
            let resData=res.data.list[0]||{};
            this.formData={
              dictType:resData.dictType,
              labelKey: resData.labelKey,
              labelValue:resData.labelValue,
              description:resData.description
            }
        }
      })
    },
  

  }
}
</script>

<style scoped>
.app-form{max-width:500px; padding-top: 50px;}
</style>
