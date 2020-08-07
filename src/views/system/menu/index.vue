<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" type="danger" icon="el-icon-circle-plus-outline" @click="handleAddMenu">添加</el-button>
    </div>

    <template v-if="list && list.length">
      <el-table default-expand-all :data="list" row-key="id" border fit highlight-current-row style="width: 100%" :tree-props="{children: 'subMenu', hasChildren: 'hasChildren'}"  >
        <el-table-column align="left" label="菜单名称" min-width="220px">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="150px" align="left" label="菜单链接">
          <template slot-scope="scope">
            <span>{{ scope.row.href }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="140px" align="left" label="权限名称">
          <template slot-scope="scope">
            <span>{{ scope.row.permission }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="140px" align="left" label="图标">
          <template slot-scope="scope">
            <span>{{ scope.row.icon }}</span><i v-if="scope.row.icon" :class="scope.row.icon" style="margin-left:5px; color:#1890ff; font-size:18px"></i>
          </template>
        </el-table-column>
        <el-table-column width="70" align="center" label="排序">
          <template slot-scope="scope">
            <el-tag type="danger">{{ scope.row.sort }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="是否显示" width="80">
          <template slot-scope="{row}">
            <el-tag :type="row.showFlag == '1' ? 'success' : 'danger'">
              {{ row.showFlag == '1' ? '显示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" fixed="right" label="操作" width="240">
          <template slot-scope="{row}">
            <el-button plain type="primary" size="mini" @click="jumpToEdit(row)">编辑</el-button>
            <el-button plain type="danger" size="mini" @click="handleDeleteMenu(row)">删除</el-button>
            <el-button plain type="success" size="mini" icon="el-icon-bottom-right" @click="jumpToAddNext(row)">添加下级</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
import { queryAllMenu } from '@/api/system'
import {postAxios} from '@/utils/request'

export default {
  name: 'SystemMenu',
  filters: {
  },
  data() {
    return {
      list: null,
      listLoading: true,
      expandAll:false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 编辑操作
    jumpToEdit(data){
      this.$router.push({
        name: 'SystemMenuEdit',
        query: { isEdit:true},
        params: {
          ...data,
          children:''
        }
      })
    },
    // 添加下级菜单
    jumpToAddNext(data){
      this.$router.push({
        name: 'SystemMenuEdit',
        query: {
          pageTitle:'添加菜单'
        },
        params:{
          parentId: data.id,
          menuName: data.name
        }
      })
    },
    // 跳转添加页面
    handleAddMenu(){
      this.$router.push({
        name:'SystemMenuEdit',
        query: {pageTitle:'添加菜单'}
      })
    },
    // 删除操作
    handleDeleteMenu(data){
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        data.menuType='0';
        this.postDeleteMenu(data);
      }).catch(() => {

      });
    },
    // 请求删除
    postDeleteMenu(data){
      postAxios('/sys/menu/deleteMenu',{
        data
      }).then((res)=>{
        if(res.code === '0000'){
          this.$message({message:'删除成功',type:'success'})
          this.getList()
        }
      })
    },
    async getList() {
      this.listLoading = true
      const { data } = await queryAllMenu('0')
      this.list = data;
      this.listLoading = false
    },
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.el-button--mini{padding:7px 10px; margin:0 2px;}
</style>
<style>
.el-table tr.el-table__row--level-0{background: #ecf7f9;}
</style>

