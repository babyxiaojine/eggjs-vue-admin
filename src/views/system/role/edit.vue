<template>
  <div class="app-container">
    <el-form ref="form" :model="formData" :rules="rules" label-width="120px" @submit.native.prevent="handleSubmit">
      <div class="app-form">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" ></el-input>
          <input type="hidden" name="parentId">
        </el-form-item>
        <el-form-item label="英文名称" prop="ename">
          <el-input v-model="formData.ename"></el-input>
        </el-form-item>
        <!-- <el-form-item label="权限范围" required prop="dataScope">
          <el-select v-model="formData.dataScope" placeholder="请选择权限范围">
            <el-option
              v-for="item in Enums.roleDataScope"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="角色类型" required prop="roleType">
          <el-select v-model="formData.roleType" placeholder="请选择角色类型">
            <el-option
              v-for="item in typeList"
              :key="item.roleType"
              :label="item.roleType"
              :value="item.roleType">
            </el-option>
          </el-select>
        </el-form-item> -->
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色菜单">
            <el-tree
              ref="treeForm"
              :data="menuList"
              :props="defaultProps"
              default-expand-all
              show-checkbox
              node-key="id"
              :check-strictly="checkStrictly"
              class="permission-tree"
            />
          </el-form-item>
        </el-col>
        
      </el-row>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
        <el-button @click="$appBack()">返回</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { queryAllMenu } from '@/api/system'
import {postAxios, getAxios} from '@/utils/request'
import Enums from '@/configs/enum'

export default {
  name: 'SystemRoleEdit',
  filters: {
  },
  data() {
    return {
      Enums,
      rules: {
        name:{required: true, message: '角色名称不能为空', trigger: 'blur'},
        ename:{required: true, message: '英文名称不能为空', trigger: 'blur'},
        dataScope:{required: true, message: '权限范围不能为空', trigger: 'blur'},
        roleType:{required: true, message: '角色类型不能为空', trigger: 'blur'},
      },
      formData: {
        name:'',
        ename: '',
        roleType: '1',
        ids:[]
      },
      typeList:[],
      menuList:null,
      defaultProps:{
        label: 'name',
      },
      isEdit:false,
      roleMenus:[],
      checkStrictly: true
    }
  },
  created() {
    const queryData = this.$route.query,
          paramsData = this.$route.params;
    if(queryData.isEdit){
      this.isEdit = true;
      this.formData = paramsData
    }else{
      this.checkStrictly = false
    }
    this.getMenuList()
    this.getRoleType()
  },
  methods: {
    // 重置菜单数据
    mapPermissionMenu(aMenu) {
      aMenu.map(mitem => {
        const childMenu = mitem.subMenu
        if (childMenu && childMenu.length) {
          mitem.children = childMenu
          mitem.hasChildren = true
          delete mitem.subMenu
          mitem = this.mapPermissionMenu(childMenu)
        }
      })
      return aMenu
    },
    // 获取菜单列表
    async getMenuList() {
      const { data:pcMenu } = await queryAllMenu('0')
      this.mapPermissionMenu(pcMenu);
      this.menuList = pcMenu;
      if(this.isEdit && this.formData.id){
        this.getRoleMenus(this.formData.id)
      }
    },
    // 获取角色类型列表
    async getRoleType() {
      const resData = await postAxios('/sys/role/loadAllType',{
      })
      if(resData.code === '0000'){
        this.typeList = resData.data;
      }
    },
    // 获取角色菜单
    async getRoleMenus(id) {
      const resData = await getAxios('/sys/role/getMenuId',{
        params: {rid:id},
      })
      if(resData.code === '0000' && resData.data){
        const menuList = resData.data
        const mapMenus = menuList.map(item=>{
          return item
        })
        this.roleMenus = mapMenus
        this.$refs.treeForm.setCheckedKeys(menuList,false)
        // setTimeout(()=>{
          this.checkStrictly = false
        // },100)
      }
      
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
    postSubmit(){
      const {formData, isEdit} = this;
      const postUrl = isEdit ? '/sys/role/updateRole' : '/sys/role/addRole'
      const menuData =  [...this.getSelectMenu('0'),...this.getSelectMenu('1')]
      postAxios(postUrl,{
        data: {
          ...formData,
          ids: menuData
        }
      }).then(resdata=>{
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.$appBack();
      })
    },
    // 获取当前选择菜单
    getSelectMenu(){
      const checkData = this.$refs.treeForm.getCheckedNodes(false,true)
      return checkData.map(item=>{
        return item.id;
      }) || []
    },

  }
}
</script>

<style scoped>
.app-form{max-width:500px; padding-top: 50px;}
</style>
