<template>
  <div  class="menu-wrapper">
    <el-submenu v-if="item.subMenu && item.subMenu.length" ref="subMenu" :index="item.title" popper-append-to-body>
      <template slot="title">
        <item :icon="item.icon" :title="item.title" />
      </template>
      <sidebar-item
        v-for="child in item.subMenu"
        :key="child.id"
        :is-nest="true"
        :item="child"
        class="nest-menu"
      />
    </el-submenu>
    <template v-else>
      <app-link :to="item.path">
        <el-menu-item :index="item.path" class="submenu-title-noDropdown">
          <item :icon="item.icon||(item.meta&&item.meta.icon)" :title="item.title||(item.meta&&item.meta.title)" />
        </el-menu-item>
      </app-link>
    </template>

  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
<style lang="scss" >
.el-menu-item [class^="el-icon-"]{color:inherit;}
.el-submenu [class^="el-icon-"]{color:inherit;}
</style>
