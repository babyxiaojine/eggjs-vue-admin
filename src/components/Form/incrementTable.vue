<template>
  <form ref="tableform" class="inc-table el-table">
    <table v-if="title" class="el-table__body" style="width:100%">
      <tr data-v-4bfaa8a1="" class="el-table__row el-bgth-gray"><th data-v-4bfaa8a1=""><div data-v-4bfaa8a1="" class="cell">{{ title }}</div></th></tr>
    </table>
    <el-table :data="value" row-key="id" border fit highlight-current-row style="width: 100%">
      <el-table-column
        type="index"
        width="60"
      />
      <slot />

      <el-table-column v-if="!readonly" align="left" label="操作" :width="sort ? '230px' :'120px'">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd(scope.$index)" />
          <el-button v-if="value.length>1" type="danger" size="mini" icon="el-icon-minus" @click="handleDelete(scope.row,scope.$index)" />
          <template v-if="sort && value.length>1">
            <el-button size="mini" type="success" class="btn-sort-bottom" :disabled="scope.$index === value.length-1" icon="el-icon-bottom" @click="handleChangeSort(scope.$index,1)" />
            <el-button size="mini" type="success" class="btn-sort-up" :disabled="scope.$index === 0" icon="el-icon-top" @click="handleChangeSort(scope.$index,-1)" />
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="value && value.length===0 && !readonly" class="grid-content bg-purple-dark tb-addItem"><el-button type="primary" size="medium" icon="el-icon-plus" @click="handleAdd(-1)">新增条目</el-button></div>

  </form>
</template>

<script>
import { validForm } from '@/utils/validate'
export default {
  components: {
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    },
    sort: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
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
    updateValue(res) {
      this.$emit('input', res)
    },
    valid() {
      return new Promise((resolve, reject) => {
        const validResult = validForm(this.$refs.tableform)
        if (validResult.status) {
          resolve()
        } else {
          this.$message.error(validResult.msg)
          reject()
        }
      })
    },
    handleAdd(id) {
      this.valid().then(() => {
        const { value } = this
        value.splice(id + 1, 0, {})
        this.updateValue(value)
      }).catch(() => {

      })
    },
    handleDelete(item, id) {
      const { value } = this
      value.splice(id, 1)
      this.updateValue(value)
    },
    handleChangeSort(id, rule) {
      const value = this.swapArray(this.value, id, id + rule)
      this.updateValue(value)
    },
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    }
  }
}
</script>
<style lang="scss" scoped>
.tb-addItem{padding:10px; text-align:right;}
.inc-table{
  .el-button + .el-button{margin-left: 4px;}
}
</style>

