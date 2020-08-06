<template>
    <div class="app-container">
        <el-form ref="form" :model="formData" label-width="120px" class="app-form" @submit.native.prevent="handleSubmit">
            <el-form-item label="活动名称" prop="activityName" :rules="{required: true, message: '活动名称不能为空', trigger: 'blur'}">
                <el-input :disabled="readonly" v-model="formData.activityName"></el-input>
            </el-form-item>
            <el-form-item label="领用单" prop="receiveListName" :rules="{required: true, message: '领用单不能为空', trigger: 'blur'}">
                <div class="expcont">
                    <el-input :disabled="true" v-model="formData.receiveListName"></el-input>
                    <import-button v-if="!readonly" @success="importSuccess" class="sss" style="display:inline-block" type="SPECIAL_SALE_RECEIVE" :params="{}" title="导入领用单"></import-button>
                </div>
            </el-form-item>
            
            <el-table v-if="formData.receiveProduct" :data="formData.receiveProduct" row-key="id" border fit highlight-current-row style="width: 100%">
                <el-table-column min-width="180px" label="订单号">
                    <template slot-scope="{row}"><span>{{ row.orderCode }}</span></template>
                </el-table-column>
                <el-table-column min-width="100px" label="物料编码">
                    <template slot-scope="{row}"><span>{{ row.sku }}</span></template>
                </el-table-column>
                <el-table-column min-width="150px" label="商品名称">
                    <template slot-scope="{row}"><span>{{ row.productName }}</span></template>
                </el-table-column>
                <el-table-column width="80px" label="申请数量">
                    <template slot-scope="{row}"><span>{{ row.applyQty }}</span></template>
                </el-table-column>
            </el-table>
            <el-form-item style="margin-top:30px;">
                <el-button type="primary" native-type="submit" v-if="!readonly">保存</el-button>
                <el-button @click="$appBack()">返回</el-button>
            </el-form-item>
        </el-form>
        
    </div>
</template>

<script>
    import {importButton} from '@/components/Form/'
    import {postAxios, getAxios} from '@/utils/request'

    export default {
        name: 'ActivitiesEdit',
        components:{
            importButton,
        },
        data() {
            return {
                formData: {
                    shopId:'',
                    activityName:'',
                    receiveListName:'',
                    receiveProduct: null
                },
                readonly: true
            }
        },
        created() {
            const queryData = this.$route.query
            this.formData.shopId = queryData.shopId
            this.readonly = !!queryData.readonly
            if(queryData.id){
                this.getDetail(queryData.id)
            }
        },
        mounted() {
        },
        methods: {
            
            // 查询详情
            getDetail(id) {
                getAxios('/activity/getSaleActivityById', {
                    params:{
                        id
                    }
                }).then((res) => {
                    if (res.code === '0000' && res.data) {
                        this.formData = res.data
                    }
                })
            },
            // 导入领用单成功 
            importSuccess(res={}){
                const resData = res.receiveImportRtn || {}
                this.formData.receiveListName = resData.receiveListName
                this.formData.receiveProduct = resData.receiveLists
            },
            // 保存表单
            handleSubmit(){
                this.$refs.form.validate((status)=>{
                    if(status){
                        const {formData} = this
                        postAxios('/activity/createActivity', {
                            data: formData
                        }).then((res) => {
                            if (res.code === '0000' && res.data) {
                                this.$message.success('操作成功')
                                this.$appBack()
                            }
                        })
                    }   
                })
            },

        }
    }
</script>

<style lang="scss" scoped>
.app-form{max-width:600px; padding-top: 50px;}
.el-input{width:270px;}
.expcont{@include flexbox($jc:flex-start);}
</style>

