<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <template v-if="displayTopMenu">
          <template v-if="permission_routes[activeTopMenu.active] && permission_routes[activeTopMenu.active].subMenu">
            <sidebar-item v-for="route in permission_routes[activeTopMenu.active].subMenu" :key="route.id" :item="route" />
          </template>
        </template>
        <template v-else>
          <template v-if="permission_routes">
            <sidebar-item v-for="route in permission_routes" :key="route.id" :item="route" />
          </template>

        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  name:'sideBar',
  components: { SidebarItem, Logo },
  computed: {
    ...mapState({
      displayTopMenu: state => state.settings.displayTopMenu,
    }),
    ...mapGetters([
      'permission_routes',
      'sidebar',
      'activeTopMenu'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
