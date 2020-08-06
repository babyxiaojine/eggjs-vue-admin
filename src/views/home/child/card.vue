<template>
  <el-col :span="span">
    <div @click="jumpRouter">
      <el-card class="cards">
          <div class="card-panel">
              <div class="card-panel-icon-wrapper">
                  <img v-if="type === 'img'" :src="icon" class="icon-img" :style="iconStyle" />
                  <i v-else :class="icon || 'el-icon-edit-outline'" :style="iconStyle"></i>
              </div>
              <div class="card-panel-description">
                  <div class="card-panel-text">{{title}}</div>
                  <span class="card-panel-num">{{value}}</span>
              </div>
          </div>
      </el-card>
    </div>
  </el-col>
</template>

<script>

export default {
  props: ['icon','iconStyle','url','title','value','span','query','type'],
  methods:{
    jumpRouter(){
      const {url,query} = this;
      if(url){
            if(query&&query.contractStatus){
                this.$router.push({path:url,query})
            }else{
                 this.$router.push(url)
            }
      }else {
          this.$alert('请前往钉钉端 进行合同录入','提示', {
              confirmButtonText: '我已知晓',
              callback: action => {}
          });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cards {
    margin-bottom: 20px;
    height: 120px;
    cursor: pointer;

    .card-panel {
        overflow: hidden;
    }

    .card-panel-icon-wrapper {
        float: left;
        width: 70px;
        margin-left: -8px;
        @include flexbox;
        i {
            font-size: 60px;
            color: #40c9c6;
        }
    }

    .card-panel-description {
        margin-left: 70px;
    }

    .card-panel-text {
        font-size: 16px;
        color: #999;
    }

    .card-panel-num {
        font-size: 30px;
        display: block;
        margin-top: 10px;
    }
    .icon-img{width:52px; margin-left: 8px;}
}
</style>
