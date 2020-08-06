<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="topMenuer">
      <template v-if="displayTopMenu">
        <a :class="{'active':activeTopMenu.id === route.id || (activeTopMenu.active === 0 && index ===0)}" v-for="(route, index) in permission_routes" :key="route.title" @click="handleTopMenu(route,index)">
          <i v-if="route.icon" :class="route.icon"></i>
          <span>{{route.title}}</span>
        </a>
      </template>
    </div>
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <el-tooltip content="Global Size" effect="dark" placement="bottom">

        </el-tooltip>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" @command="handleCommand">
        <div class="avatar-wrapper">
          {{userInfo.name}}
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/changePwd">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided :command="logout">
            <span style="display:block;">注销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Hamburger from '@/components/Hamburger'
import Search from '@/components/HeaderSearch'
import {postAxios, getAxios} from '@/utils/request'
export default {
  components: {
    Hamburger,
    Search
  },
  data(){
    return{
    }
  },
  props: {
    count:{
      default: 0,
      type: Number,
    },
  },
  computed: {
    ...mapState({
      displayTopMenu: state => state.settings.displayTopMenu,
    }),
    ...mapGetters([
      'permission_routes',
      'sidebar',
      'avatar',
      'device',
      'activeTopMenu',
      'userInfo'
    ])
  },
  methods: {
    // 显示隐藏左菜单
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 点击头部导航
    handleTopMenu(route,mid) {
      this.$store.dispatch('app/handleTopMenu',{
        id: route.id,
        active: mid
      })
      if(!route.subMenu && route.href){
        this.$router.push(route.href)
      }

    },
    handleCommand(method) {
      if(method && typeof method === 'function'){
        method()
      }else{
        return;
      }

    },
    async logout() {
      await this.$store.dispatch('user/logout')
      await this.$store.dispatch('tagsView/delAllViews')
      await this.$store.dispatch('app/clearTopMenu')
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss" scoped>
.topMenuer{
  float: left; height: 100%;
  a{padding:0 10px; font-size:14px; float: left; line-height: 50px; box-sizing: border-box; height: 50px; @include flexbox;
    &.active{border-bottom:3px solid #DA291C; color:#DA291C;}
    i{font-size: 18px; margin-right:2px;}
  }
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .total{
    float: right;
    height: 100%;
    line-height: 50px;
    width:120px;
    padding-top: 4px;
    span{color:$blue;}
  }
}
</style>
