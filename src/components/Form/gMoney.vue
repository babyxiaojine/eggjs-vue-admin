<template>
  <div>
    <!-- input -->
    <template v-if="type === 'money'">
        <el-input :error="error" :rule="rule" :autofocus="true" :placeholder="placeholder" :maxlength="maxlength" :type="type" :value="value" @input="updateValue">
        </el-input>
    </template>
  </div>
</template>

<script>
import { formatToMoney } from '@/utils'

export default {
  props:{
    type:{
      type: String,
      default:'money'
    },
    inputType:{
      type: String,
      default:'input'
    },
    placeholder:{
      type: String,
      default:''
    },
    option:{
      type: Array,
      default: ()=>[]
    },
    value:{
      default: ''
    },
    error:{
      type: String,
      default: ''
    },
    beforeInput:{
      default: null
    },
    rule:{
      default: ''
    },
    maxlength:{
      default: 200
    }
  },
  data() {
    return {
      
    }
  },
  created() {

  },
  methods: {
    updateValue(val){
      const v = formatToMoney(val)
      this.$emit('input',v)
    },

    
  },
  computed:{
   
  },
}
</script>

<style scoped>

</style>
