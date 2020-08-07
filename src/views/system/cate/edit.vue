<template>
  <div class="app-container">
    
    <el-form ref="form" :model="formData" :rules="rules" label-width="120px" class="app-form" @submit.native.prevent="handleSubmit">
      <el-form-item label="上级栏目名称">
        <el-input v-model="formData.parentMenuName" @focus="dialogVisible=true" readonly suffix-icon="el-icon-arrow-down"></el-input>
        <input type="hidden" name="parentId">
      </el-form-item>
      <el-form-item label="栏目名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="formData.href"></el-input>
      </el-form-item>
      <el-form-item label="链接别名">
        <el-input v-model="formData.href_alias"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="formData.sort" :min="0" :max="9999"></el-input-number>
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="formData.icon" :suffix-icon="formData.icon"></el-input>
      </el-form-item>
      <el-form-item label="可见">
        <el-radio-group v-model="formData.showFlag">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="权限标识">
        <el-input v-model="formData.permission"></el-input>
      </el-form-item>
      <el-form-item>
        <FileZoom v-model="formData.files" :max-length="10" type="img"  />
      </el-form-item>
    </el-form>

    <div class="app-footer-wrap">
      <div class="app-footer">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="$appBack()">返回</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="选择栏目">
      <el-form >
        <el-form-item >
          <el-tree
            ref="treeForm"
            @check-change="treeCheckChange"
            :check-strictly="true"
            :data="menuList"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryAllCate } from '@/api/system'
import {postAxios, getAxios} from '@/utils/request'

import FileZoom from '@/components/file/fileZoom'
export default {
  name: 'SystemCateEdit',
  filters: {
  },
  components: {
    FileZoom
  },
  data() {
    return {
      rules: {
        name:{required: true, message: '栏目不能为空', trigger: 'blur'},
        permission:{required: true, message: '权限标识不能为空', trigger: 'blur'},
      },
      formData: {
        parentId: '',
        parentMenuName: '',
        name:'',
        icon: '',
        showFlag: 1,
        href: '',
        permission: '',
        sort: '',
      },
      dialogVisible:false,
      menuList:null,
      defaultProps:{
        label: 'name',
      },
      checkedTreeId:'',
    }
  },
  created() {
    const queryData = this.$route.query;
    this.formData = {...this.formData,...queryData}
    if(queryData.id){
      this.getMenuData(queryData.id).then((res)=>{
        this.formData = {
          ...this.formData,
          ...res
        }
      })
    }
    if(queryData.parentId!=='0'){
      this.getMenuData(queryData.parentId).then((res)=>{
        this.formData = {
          ...this.formData,
          parentMenuName: res.name
        }
      })
    }
    this.getMenuList()
  },
  methods: {
    // 递归设置栏目
    mapPermissionMenu(aMenu) {
      const menuList = []
      aMenu.map((mitem, mindex) => {
        const sid = this.formData.id
        if(!sid || sid !== mitem.id) {
          const childMenu = mitem.subMenu
          if (childMenu && childMenu.length) {
            mitem.children = this.mapPermissionMenu(childMenu)
            mitem.hasChildren = true
            delete mitem.subMenu
          }
          menuList.push(mitem)
        }
      })
      return menuList
    },
    async getMenuList() {
      const { data } = await queryAllCate('0')
      let menuBox = this.mapPermissionMenu(data)
      this.menuList = menuBox
    },
    async getMenuData(id) {
      const resData = await getAxios('/sys/cate/findCateById',{
        params: {id},
      })
      if(resData.code === '0000'){
        return resData.data
      }else{
        return false
      }
    },
    handleSubmit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.postSubmit()
        } else {
          return false;
        }
      })
    },
    async postSubmit(){
      const {formData} = this;
      formData.menuType='0';
      const postUrl = formData.id ? '/sys/cate/updateCate' : '/sys/cate/addCate'
      const resData = await postAxios(postUrl,{
        data: formData,
      })
      if(resData.code === '0000'){
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.$appBack({delCache:'SystemCate'})
      }
    },
    // 确认选择上级栏目
    confirmRole(e){
      const checkData = this.$refs.treeForm.getCheckedNodes()
      if(checkData && checkData.length){
        this.formData.parentId = checkData[0].id;
        this.formData.parentMenuName = checkData[0].name;
        this.dialogVisible = false;
      }else{
        this.$message({
          message: '请选择栏目',
          type: 'error'
        })
      }
    },
    treeCheckChange(data, checked, node){
      if(checked == true){
        this.checkedId = data.id;
        this.$refs.treeForm.setCheckedNodes([data]);
      }
    },
    treeNodeClick(data,checked,node){
        this.checkedId = data.id
        this.$refs.treeForm.setCheckedNodes([data]);
    }

  }
}
</script>

<style scoped>
.app-form{max-width:500px; padding-top: 50px;}
</style>
