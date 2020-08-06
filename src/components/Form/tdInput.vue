<template>
  <td :colspan="colspan">
    <div class="cell">
      <gInput 
        :value="value" 
        @input="updateValue" 
        :type="type" 
        :inputType="inputType"
        :placeholder="placeholder"
        :readonly="readonly"
        :option="option"
        :rule="rule"
        :error="error"
        >
      </gInput>
    </div>
  </td>
</template>

<script>
import gInput from './gInput'
import {validForm} from '@/utils/validate'
export default {
  components:{
    gInput
  },
  props:{
    type:{
      type: String,
      default:'input'
    },
    inputType:{
      type: String,
      default:'input'
    },
    placeholder:{
      type: String,
      default:''
    },
    readonly:{
      type: Boolean,
      default: true
    },
    option:{
      type: Array,
      default: ()=>[]
    },
    value:{
      default: ''
    },
    colspan:{
      type: String,
      default: '1'
    },
    error:{
      type: String,
      default: ''
    },
    rule:{
      default: ''
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
      this.$emit('input',val)
    },
    // 验证信息
    validApplyForm(){
      return new Promise((resolve, reject)=>{
        this.$refs.form.validate((valid) => {
          console.log(valid)
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })

    },

    // 获取配置中的名称
    getOptionsName(option, val, nullValue='-'){
      const actObj = option.find(item=>{
        return val == item.id
      }) || {}
      return actObj.name || nullValue
    },

    
  },
  computed:{
    mapCheckBox(){
      const {option, value} = this
      const arr = []
      value.map(item=>{
        if(item){
          const iobj = option.find( oitem=>{
            return item == oitem.id
          })
          if(iobj){
            arr.push(iobj.name)
          }
        }
      })
      return arr.join('，')
    }
  },
}
</script>

<style scoped>

</style>
