<template>
  <div id="app">
    <router-view v-if="$route.meta.noLayout" />
    <Layout v-else />
  </div>
</template>

<script>
import Layout from '@/layout'
export default {
  name: 'App',
  components: {
    Layout
  }
}
</script>
