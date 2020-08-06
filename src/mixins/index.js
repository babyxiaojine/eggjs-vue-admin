
export default {
  methods: {
    $appBack({ zindex, delCache } = { zindex: -1, delCache: ''}) {
      const activeRoute = this.$route
      if (delCache) {
        this.$store.dispatch('tagsView/delCachedView', { name: delCache })
      }
      this.$store.dispatch('tagsView/delView', activeRoute).then(() => {
        console.log()
        this.$router.go(zindex || -1)
      })
    },
    $getOptionName(option, val, nullValue = '-') {
      const actObj = option.find(item => {
        return val === item.id
      }) || {}
      return actObj.name || nullValue
    }
  }
}