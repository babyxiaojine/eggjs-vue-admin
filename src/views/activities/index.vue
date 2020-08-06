<template>
    <div class="app-container">
        <div class="filter-container" >
            <el-button v-if="$store.getters.queryShopId !== 'ALL'" class="filter-item" type="primary" icon="el-icon-plus" @click="todoAddAct">新建活动</el-button>
            <exportButton type="1" style="float:right; margin-right:10px;" :fileData="OSSURL+'/Templates/recipients_template.xlsx'" fileName="领用单示例" title="示例导出" buttonType="default"></exportButton>
        </div>
        <el-table :data="list" row-key="id" border fit highlight-current-row style="width: 100%">
            <el-table-column min-width="150px" label="活动名称">
                <template slot-scope="{row}">
                    <el-button type="text" @click="jumpToDetail(row)">{{ row.activityName }}</el-button>
                </template>
            </el-table-column>
            <el-table-column min-width="160px" align="center" label="领用单">
                <template slot-scope="{row}">
                    <span>{{ row.receiveListName }}</span>
                </template>
            </el-table-column>

            <el-table-column width="100px" align="center" label="启用状态">
                <template slot-scope="scope">
                    <template v-if="$store.getters.queryShopId !== 'ALL'">
                        <el-switch :disabled="scope.row.activityStatus !== 1" :value="scope.row.activityStatus === 1" @input="(s)=>{switchActivyStatus(scope.row,s,scope.$index)}">
                        </el-switch>
                    </template>
                    <template v-else>
                        <span>{{ $getOptionName(activityStatusOption, scope.row.activityStatus) }}</span>
                    </template>
                </template>
            </el-table-column>


            <el-table-column min-width="160px" align="center" label="创建时间">
                <template slot-scope="{row}">
                    <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>

            <el-table-column width="120px" align="center" label="创建人">
                <template slot-scope="{row}">
                    <span>{{ row.createByName }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="220" fixed="right">
                <template slot-scope="{row}">
                    <div class="esbox">
                        <el-button @click="jumpToDetail(row)" type="primary" plain size="small"> 查看</el-button>
                        <import-button v-if="$store.getters.queryShopId !== 'ALL' && row.activityStatus === 1" @success="(res)=>{ importSuccess(row,res)}" class="imp-btn" style="display:inline-block" type="SPECIAL_SALE_RECEIVE" :params="{}" title="导入领用单"></import-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
                v-if="total"
                style="margin-top:20px"
                background
                :current-page.sync="pageParam.pageNo"
                layout="prev, pager, next"
                :page-size="pageParam.pageSize"
                :total="total"
                @current-change="handlePageChange"
        />
        
        <el-dialog title="导入领用单" :visible.sync="showDialog" width="620px">
            <el-form ref="form"  label-width="110px">
                <el-form-item label="活动名称">{{dialogObject.activityName}}</el-form-item>
                <el-form-item label="领用单名称">{{dialogObject.receiveListName}}</el-form-item>
                <el-table v-if="dialogObject.receiveProduct" :data="dialogObject.receiveProduct" row-key="id" border fit highlight-current-row style="width: 100%">
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
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDialog = false">取 消</el-button>
                <el-button type="primary" @click="editActivityData">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {importButton,exportButton} from '@/components/Form/'
    import {postAxios, getAxios} from '@/utils/request'

    export default {
        name: 'Activities',
        components:{
            importButton,
            exportButton
        },
        filters: {},
        data() {
            return {
                OSSURL:  process.env.VUE_APP_OSS_URL,
                filterForm: {},
                listForm: {},
                pageParam: {
                    pageNo: 1,
                    pageSize: 10
                },
                total: 0,
                list: [],
                shopId: '',
                showDialog: false,
                dialogObject: {
                    id: '',
                    activityName: '',
                    receiveListName: '',
                    receiveProduct: []
                },
                activityStatusOption:[
                    {id:0, name:'已创建'},
                    {id:1, name:'已开启'},
                    {id:2, name:'已结束'},
                ]
            }
        },
        created() {
            
        },
        activated() {
            this.shopId = this.$route.query.shopId
            this.getList()
        },
        methods: {
            // 保存导入领用单
            editActivityData(){
                const {dialogObject} = this
                postAxios('/activity/importReceive', {
                    data: dialogObject
                }).then((res) => {
                    if (res.code === '0000' && res.data) {
                        this.showDialog = false
                        this.$message.success('领用单导入成功')
                    }else{
                        this.$message.error(res.message)
                    }
                })
            },
            // 导入领用单
            importSuccess(item,res={}){
                const resData = res.receiveImportRtn || {}
                this.dialogObject = {
                    id: item.id,
                    activityName: item.activityName,
                    receiveListName: resData.receiveListName,
                    receiveProduct: resData.receiveLists
                }
                this.showDialog = true
            },
            // 切换启用状态
            switchActivyStatus(row,status,index){
                this.$confirm(`你确定要${status ? '启用' : '关闭'}这个活动吗？`,{type: 'warning'}).then(()=>{
                    const statusVal = status ? 1 : 2
                    postAxios('/activity/updateActivity', {
                        data: {
                            id: row.id,
                            activityStatus: statusVal
                        }
                    }).then((res) => {
                        if (res.code === '0000' && res.data) {
                            this.list[index].activityStatus = statusVal
                            this.$message.success(`活动已${status ? '启用' : '关闭'}`)
                        }else{
                            this.$message.error(res.message)
                        }
                    })
                }).catch(()=>{

                })
            },
            // 翻页
            handlePageChange() {
                this.getList()
            },
            // 查看详情
            jumpToDetail(data) {
                this.$router.push({
                    name: 'ActivitiesEdit',
                    query: {
                        shopId: this.shopId,
                        readonly: true,
                        id: data.id,
                        pageTitle:'查看活动'
                    }
                })
            },
            // 新增
            todoAddAct() {
                this.$router.push({
                    name: 'ActivitiesEdit',
                    query: {
                        shopId: this.shopId,
                        pageTitle:'新建活动'
                    }
                })
            },
            // 查询列表
            getList() {
                const {shopId, pageParam} = this
                postAxios('/activity/queryActivityPage', {
                    data: {
                        shopId,
                        pageNo: pageParam.pageNo,
                        pageSize: pageParam.pageSize
                    }
                }).then((res) => {
                    if (res.code === '0000' && res.data) {
                        this.list = res.data.list || []
                        this.total = res.data.total || 0
                    }
                })
            }

        },
        watch: {
            '$route' (to, from) {
                if(to.path === '/activities/index' && to.query.shopId !== this.shopId){
                    this.shopId = to.query.shopId
                    this.getList()
                }
            }
        }
    }
</script>

<style scoped lang="scss">
.esbox{@include flexbox;}
/deep/ .imp-btn .el-button{padding:8px 10px;}
</style>

