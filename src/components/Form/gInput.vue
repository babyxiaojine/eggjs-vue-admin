<template>
  <div>
    <!-- input -->
    <template v-if="type === 'input' || type === 'textarea'">
      <template v-if="readonly">
        <div>{{ value }}</div>
      </template>
      <template v-else>
        <el-input :error="error" :rule="rule" :placeholder="placeholder" :maxlength="maxlength" :type="type" :value="value" @input="updateValue">
          <slot name="append"></slot>
        </el-input>
      </template>
    </template>
    <!-- radio -->
    <template v-if="type === 'radio'">
      <template v-if="readonly">
        <div>{{ getOptionsName(option, value) }}</div>
      </template>
      <template v-else>
        <el-radio v-for="(item,index) in option" :key="index" :value="value" @input="updateValue" :label="item.id">{{item.name}}</el-radio>
        <input type="hidden" :value="value" :error="error" :rule="rule">
      </template>
    </template>
    <!-- select -->
    <template v-if="type === 'select'">
      <template v-if="readonly">
        <div>{{ getOptionsName(option, value) }}</div>
      </template>
      <template v-else>
        <el-select :value="getOptionsName(option, value, '')" @input="updateValue" :placeholder="placeholder" style="width:100%" v-bind="{...extendProps}">
          <el-option
            v-for="(item,index) in option"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <input type="hidden" :value="value" :error="error" :rule="rule">
      </template>
    </template>
    <!-- date -->
    <template v-if="type === 'date'">
      <div v-if="readonly">{{value | parseTime('{y}-{m}-{d}')}}</div>
      <template v-else>
        <el-date-picker :value="value" @input="updateValue" value-format="timestamp" suffix-icon="el-icon-date" type="date" :placeholder="placeholder || '选择日期'">
        </el-date-picker>
        <input type="hidden" :value="value" :error="error" :rule="rule">
      </template>
    </template>
    <!-- checkbox  -->
    <template v-if="type === 'checkbox'">
      <template v-if="readonly">
        <span>{{ mapCheckBox }}</span>
      </template>
      <template v-else>
        <el-checkbox-group :value="value || []" @input="updateValue">
          <el-checkbox :key="index" :label="item.id" v-for="(item,index) in option">{{item.name}}</el-checkbox>
        </el-checkbox-group>
        <input type="hidden" :value="value" :error="error" :rule="rule">
      </template>
    </template>
  </div>
</template>

<script>
export default {
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
    beforeInput:{
      default: null
    },
    rule:{
      default: ''
    },
    maxlength:{
      default: 200
    },
    extendProps:{
      type: Object,
      default: ()=>{}
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
      const {beforeInput} = this
      if(beforeInput){
        if(!beforeInput(val)){
          return;
        }
      }
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
      const {option, value=[]} = this
      const arr = []
      console.log(value,'readonly')
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
