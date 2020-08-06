<template>
  <div class="app-container">
    <el-form ref="form" :model="formData" :rules="rules" label-width="120px" class="app-form" @submit.native.prevent="handleSubmit">
      <el-form-item label="员工工号" prop="loginName">
        <el-input v-if="!query.id" v-model="formData.loginName" :readonly="false"></el-input>
        <el-input v-else v-model="formData.loginName" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="formData.mobile"></el-input>
      </el-form-item>
      <el-alert title="* 必须使用注册钉钉的电话号码，否则钉钉端将无法登陆收银" type="error"></el-alert>
      <el-form-item label="用户角色"  prop="only_enames">
        <el-radio v-for="enames in enamesList" :key="enames.id" :disabled="$store.getters.queryEnames('DZ') && enames.ename !== 'SYY'" v-model="formData.only_enames" @input="handleChangeEnames" :label="enames.id">{{enames.name}}</el-radio>
      </el-form-item>
      <el-form-item label="归属店铺" :prop="activEname === 'SYY' ? '' :'shopId'">
        <template v-if="!isAllShop">
          <el-radio v-if="activEname ==='SYY'" v-model="formData.shopId" label="">无</el-radio>
          <el-radio v-for="shop in allShop" :key="shop.id" v-model="formData.shopId" :label="shop.id">{{shop.name}}</el-radio>
        </template>
        <el-tag v-else size="medium" type="danger">全部</el-tag>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
        <el-button type="danger" @click="handleResetPass">重置密码</el-button>
        <el-button @click="$appBack()">返回</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import {postAxios, getAxios} from '@/utils/request'
import gInput from '@/components/Form/gInput'

export default {
  name: 'SystemSettingUserEdit',
  components:{
      gInput,
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('电话不能为空'));
      }
      if(!(/^[1][3-9][0-9]{9}/).test(value)){
        return callback(new Error('请输入正确的手机号'));
      }else{
        callback();
      }
    };
    var checkLoginName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('员工工号不能为空'));
      }
      if(!(/^[1-9][0-9]{7}/).test(value)){
        return callback(new Error('请输入正确的员工工号'));
      }else{
        callback();
      }
    };
    return {
      rules: {
        loginName: [{ validator: checkLoginName,required: true, trigger: 'blur' }],
        name:{required: true, message: '姓名不能为空', trigger: 'blur'},
        mobile: [{ validator: checkPhone,required: true, trigger: 'blur' }],
        only_enames:{required: true, message: '角色不能为空', trigger: 'blur'},
        shopId:{required: true, message: '归属店铺不能为空', trigger: 'blur'},
      },
      formData: {
        loginName:'',
        name: '',
        mobile:'',
        enames:[],
        shopId:'',
        only_enames:''
      },
      enamesList:[],
      query:{},
      allShop:[],
      isAllShop: false,
      activEname:''
    }
  },
  created() {
    const allShops = this.$store.getters.queryShops
    this.allShop = allShops
  },
  mounted(){
    const query=this.$route.query
    this.query=query
    this.getAllRole().then(()=>{
      if(query.id){
        this.getUserinfo();
      }
    })
  },
  methods: {
    handleChangeEnames(id){
      const {enamesList, formData} = this
      let ename = enamesList.find(item=>item.id===formData.only_enames).ename
      this.activEname = ename
      if(ename === 'CW' || ename === 'admin'){
        this.formData.shopId = 'ALL'
        this.isAllShop = true
      }else{
        if(formData.shopId === 'ALL'){
          this.formData.shopId = ''
        }
        this.isAllShop = false
      }
      console.log(ename)
    },
    // 重置该用户密码
    handleResetPass(){
      const {query} = this;
      this.$confirm('此操作将重置该用户密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postAxios('/sys/user/resetUserPwd',{
          params: {
            id: query.id
          }
        }).then((res)=>{
          if(res.code==='0000'){
            this.$message.success('已将该用户密码重置为默认密码。')
          }
        })
      }).catch(() => {

      })
    },
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
        url='/sys/user/updateUser'
        formData={...formData,id:query.id}
      }else{
        url='/sys/user/addUser'
      }
      formData.enames = [formData.only_enames]
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
          this.$appBack();
        }else{
          this.$message.error(res.message);
        }
      })
    },
    //获取用户信息
    getUserinfo(){
      const {query}=this;
      getAxios('/sys/user/loadUserById?id='+query.id,{
          data: {
          }
      }).then((res)=>{
        if(res.code==='0000'){
            let resData = res.data||{};
            resData.only_enames = resData.enames[0]
            this.formData = res.data
            this.handleChangeEnames()
        }
      })
    },
    //获取所有角色
    getAllRole(){
      return new Promise((resolve,reject)=>{
        postAxios('/sys/role/loadAllRole',{
          data: {
            roleType: "assianment"
          }
        }).then((res)=>{
          if(res.code==='0000'&&res.data){
            this.enamesList=res.data.list||[]
            resolve()
          }else{
            reject()
          }
        }).catch(()=>{
          reject()
        })
      })
    },

  }
}
</script>

<style scoped>
.app-form{width:600px; padding-top: 50px;}
</style>
