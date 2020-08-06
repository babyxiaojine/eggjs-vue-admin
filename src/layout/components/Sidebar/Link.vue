
<template>
  <!-- eslint-disable vue/require-component-is -->
  <a @click="linkProps(to)">
    <slot />
  </a>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    linkProps(url) {
      console.log(url)
      if (isExternal(url)) {
        window.open(url,'_blank')
      }else{
        this.$router.push(url)
      }
    }
  },
  created(){
    // console.log(this.to,'tooooo')
  }
}
</script>
