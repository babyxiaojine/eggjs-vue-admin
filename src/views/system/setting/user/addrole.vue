<template>
  <div class="app-container">
    <el-table :data="list" row-key="id" type="index"  stripe border fit highlight-current-row style="width:460px"  >
        <el-table-column align="center" label="序号" min-width="150px">
          <template slot-scope="scope">
            <span>{{ scope.$index+1}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="150px" align="center" label="分公司名称">
          <template slot-scope="scope">
            <el-select  v-if="submitStatus&&scope.$index+1==list.length" v-model="level2Obj" value-key="id" placeholder="请选择分公司">
                <el-option
                v-for="item in level2List"
                :key="item.id"
                :label="item.name"
                :value="item">
                </el-option>
            </el-select>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="150px" align="center" label="操作">
          <template slot-scope="scope" v-if="!submitStatus||scope.$index+1!=list.length">
            <el-button plain type="danger" size="small" @click="delLevel2(scope.row.id)" >删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <div class="filter-container" style="margin-top:30px">
        <el-button @click="addRole" class="filter-item"  type="danger" icon="el-icon-circle-plus-outline" :disabled="submitStatus">添加</el-button>
        <el-button v-if="submitStatus" @click="handleSubmit" class="filter-item" style="margin-left: 250px;" type="primary">保存</el-button>
    </div>
  </div>
</template>

<script>
import {postAxios, getAxios} from '@/utils/request'

export default {
  name: 'SystemSettingUserAddrole',
  filters: {
  },
  data() {
    return {
      formData:{
        userId:'',
      },
      level2Obj:{},
      level2List:[],
      submitStatus:false,
      list:[],
    }
  },
  created() {
  },
  mounted(){
      this.formData.userId=this.$route.query.id;
      this.getUserRole().then((data)=>{
        this.getLevel2(data);
      });
  },
  methods: {

    addRole(){
        this.submitStatus=true;
        this.list.push({name:''});
    },

    // 提交操作
    handleSubmit(){
        const {formData,level2Obj} = this;
        if(!level2Obj.id){
          this.$message({message: '分公司名称不能为空',type: 'error'});
          return;
        }
        this.submitStatus=false;
        postAxios('/sys/user/saveUserPermission',{
            data: {
              ...formData,
              level2:level2Obj.id,
              name:level2Obj.name
            }
        }).then((res)=>{
            if(res.code==='0000'){
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.formData.level2="";
              this.getUserRole().then((data)=>{
                this.getLevel2(data);
              });
            }
        }).catch((err)=>{
          this.list.pop();
        })
    },
    //删除权限
    delLevel2(id){
      this.$confirm('此操作将永久此条用户权限, 是否继续?', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
          .then(() => {
              postAxios('/sys/user/delUserPermission?id='+id,{
                  data: {
                  }
              }).then((res)=>{
                  if(res.code==='0000'){
                    this.$message({
                      message: '保存成功',
                      type: 'success'
                    })
                    this.getUserRole().then((data)=>{
                      this.getLevel2(data);
                    });
                  }
              })
          })
          .catch(action => {

          });

    },
    //获取分公司列表
    getLevel2(data){
      this.$store.dispatch('user/queryAllLevel2').then((resData)=>{
          let newList=[];
          resData.forEach((item,ind)=>{
            const sid = data.findIndex(ditem=>{
              return ditem.level2 === item.id
            })
            if(sid<0){
              newList.push(item)
            }
          })
          this.level2List=newList;
      })
    },
    //获取用户权限
    getUserRole(){
      return new Promise((resolve,reject)=>{
        getAxios('/sys/user/loadUserPermissionById?id='+this.formData.userId,{
            data: {
            }
        }).then((res)=>{
          if(res.code==='0000'){
              let resData=res.data||[];
              this.list=resData;
              resolve(resData);
          }
        })
      })

    }
  }
}
</script>

<style scoped>
.app-form{max-width:500px; padding-top: 50px;}
</style>

