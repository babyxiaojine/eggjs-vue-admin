<template>
  <div class="login-container">
    <img class="login-bg" src="@/assets/login-bg.png" fit="cover"></img>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <div class="title-container" style="text-align:center">
        <!-- <svg-icon icon-class="logo" style="width:160px; height:60px; margin:0 auto;" /> -->
        <el-image src="" style="width:160px; height:60px; margin:0 auto;">
          <div slot="error" style="background:#f0f0f0; line-height:60px; color:#aaa;"><i style="font-size:24px" class="el-icon-picture-outline"></i> LOGO</div>
        </el-image>
        <h3 class="title">后台管理系统</h3>
      </div>

      <el-form-item prop="loginName">
        <span class="svg-container"><svg-icon icon-class="user" /></span>
        <el-input  ref="username" v-model="loginForm.loginName" placeholder="输入用户名" name="username" type="text" tabindex="1" autocomplete="on" />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="大写锁定已打开" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container"><svg-icon icon-class="password" /></span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" show-password :type="passwordType" placeholder="输入密码" name="password" tabindex="2" autocomplete="off" @keyup.native="checkCapslock" @blur="capsTooltip = false" @keyup.enter.native="handleLogin" />
          <!-- <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span> -->
        </el-form-item>
      </el-tooltip>
      <el-button :loading="loading" type="danger" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
      <el-row class="tal" style="text-align:center" v-if="env !== 'production'">
        <el-button type="primary" @click="openChangeService" icon="el-icon-help">切换服务器</el-button>
        <el-button type="danger" @click="showDialog=true" icon="el-icon-user">切换用户</el-button>
      </el-row>
    </el-form>
    <el-dialog title="选择切换用户" :visible.sync="showDialog" width="800px">
      <el-table :data="testUsers" row-key="id" border fit highlight-current-row style="width: 100%" max-height="600px" @row-click="switchUser">
        <el-table-column align="left" label="用户名" min-width="100px" >
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="角色" min-width="100px" >
          <template slot-scope="{row}">
            <span>{{ row.enames }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="账号" min-width="100px" >
          <template slot-scope="{row}">
            <span>{{ row.loginName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="登录时间" min-width="100px" >
          <template slot-scope="{row}">
            <span>{{ row.loginTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- <div class="rightTools"></div> -->
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import Cookies from 'js-cookie'
export default {
  name: 'Login',
  components: {  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('账号格式错误'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码格式错误'))
      } else {
        callback()
      }
    }
    return {
      env:process.env.NODE_ENV,
      OSSURL: process.env.VUE_APP_OSS_URL,
      constantUsers:{
        'admin': {'name':'系统管理员'},
        '10000001': {'name':'拼夕夕店长'},
        '10000002': {'name':'天猫自营店长'},
        '10000003': {'name':'天猫超市店长'},
      },
      testUsers:[],
      loginForm: {
        loginName:'admin',
        password:'111111',
        loginSrc: 'pc',
        verifyCode: ''
      },
      loginRules: {
        loginName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    if(process.env.NODE_ENV !== 'production'){
      const testUsers = {...this.constantUsers, ...(Cookies.getJSON('testUsers') || {})}
      const testUsersArray = []
      for (let i in testUsers){
        testUsers[i].loginName = i
        testUsersArray.push(testUsers[i])
      }
      this.testUsers = testUsersArray.sort((a, b)=>{
        return b.loginTime - a.loginTime
      })
    }
  },
  mounted() {
    if (!this.loginForm.loginName) {
      this.$refs.username.focus()
    } else if (!this.loginForm.password) {
      this.$refs.password.focus()
    }

  },
  destroyed() {
    
  },
  methods: {
    // 切换用户
    switchUser(item){
      this.loginForm = {loginSrc: 'pc',verifyCode: '',password:'111111', ...item }
      this.getLoginForm()
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    // 显示隐藏密码
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 操作登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.getLoginForm()
        } else {
          return false
        }
      })
    },
    // 请求登录
    getLoginForm(){
      const {loginForm} = this
      this.loading = true
      this.$store.dispatch('user/login', loginForm)
      .then(() => {
        this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    // 修改调试服务器地址
    openChangeService(){
      const testServiceUrl = Cookies.get('testServiceUrl')
      this.$prompt('', '修改调试服务器地址', {
          confirmButtonText: '确定',
          cancelButtonText: '重置',
          inputPlaceholder:'请输入服务器地址',
          inputValue: testServiceUrl || '',
        }).then(({ value }) => {
          Cookies.set('testServiceUrl', value)
          window.location.reload()
        }).catch(() => {
          Cookies.remove('testServiceUrl')   
          window.location.reload()   
        })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
$bg:rgba(232,56,13,.5);
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

@keyframes customerQuan {
    0% { transform: scale(1.9) rotate(0); } 
    25% { transform: scale(2.5) rotate(90deg); } 
    50% { transform: scale(1.5) rotate(180deg);}
    75% { transform: scale(2.5) rotate(270deg); } 
    100% { transform: scale(1.9) rotate(360deg);}
}
/* reset element-ui css */
.login-container {overflow: hidden; position: relative;
  
  .login-bg{
    position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
    // animation: customerQuan 500s 0s linear infinite;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    flex:1;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color:#333;
      height: 47px;
      background-color: #fff;
      font-size:15px;
      border-radius:0 5px 5px 0;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item__content{
    position: relative;
    @include flexbox;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.rightTools{position: fixed; bottom:20px; right: 20px;
  i{font-size: 18px;}
}
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  @include flexbox;
  .login-form {
    position: relative;
    z-index: 2;
    width: 500px;
    max-width: 100%;
    padding: 40px 35px 55px;
    margin: 0 auto;
    overflow: hidden;
    box-sizing:border-box;
    background: #fff;
    border-radius:8px;
    margin-bottom: 100px;
    box-shadow:0 3px 18px rgba(0,0,0,.15);
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 40px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #DA291C;
      margin: 8px auto 30px;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
