<script>
import { setToken } from '@/utils/auth'
export default {
  created() {
    const { query } = this.$route
    if (query.token) {
      this.$store.commit('user/SET_TOKEN', query.token)
      setToken(query.token)
    }
    this.$router.replace({ path: '/' })
  },
  render: function(h) {
    return h() 
  }
}
</script>
