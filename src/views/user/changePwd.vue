<template>
  <div class="app-container">
    <!-- 未开始 -->
    <el-form ref="form" :model="formData" :rules="rules" label-width="120px" class="app-form" @submit.native.prevent="handleSubmit">
      <el-form-item label="当前密码" prop="oldPassWord">
        <el-input placeholder="请输入当前密码" v-model="formData.oldPassWord" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassWord">
        <el-input placeholder="请输入6-12位新密码" v-model="formData.newPassWord" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="confirmPwd">
        <el-input placeholder="请再次输入密码" v-model="formData.confirmPwd" show-password></el-input>
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
  name: 'SystemSettingChangePwd',
  filters: {
  },
  data() {
    var checkNewPassWord = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('新密码不能为空'));
      }
      if(!(/^[0-9a-zA-Z_]{6,12}/).test(value)){
        return callback(new Error('请输入6-12位密码，组成为数字、字母、下划线'));
      }else{
        callback();
      }
    };
    var checkConfirmPwd = (rule, value, callback) => {
      let newPassWord=this.formData.newPassWord;
      console.log("val",value,newPassWord);
      if(newPassWord!==value){
        return callback(new Error('两次输入的密码不一致'));
      }else{
        callback();
      }
    };
    return {
      rules: {
        oldPassWord:{required: true, message: '旧密码不能为空', trigger: 'blur'},
        newPassWord: [{ validator: checkNewPassWord, trigger: 'blur' }],
        confirmPwd: [{ validator: checkConfirmPwd, trigger: 'blur' }]
      },
      formData: {
        oldPassWord:'',
        newPassWord: '',
        confirmPwd:''
      },
    }
  },
  created() {
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
      const {formData} = this;
      postAxios('/sys/user/saveUserPwd',{
        data: {
          ...formData
        }
      }).then((res)=>{
        if(res.code==='0000'){
          this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.$appBack();
        }
      })
    }
    
  }
}
</script>

<style scoped>
.app-form{max-width:500px; padding-top: 50px;}
</style>
