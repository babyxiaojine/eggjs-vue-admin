const taskRouterConfig = {
  'IntentionFranchiseeAudit' : 'Task_IntentionApply',
  'FormalFranchiseeAudit' : 'Task_FormalFranchisee',
  'HouseRentalContractAudit': 'leaseContractPushContract',
  'IntentionAgreement': 'ContractAgreementSignFinancialAudit',//意向协议申请
  'IntentionGoldRefund': 'ContractAccountingExamine',//加盟会计打印凭据
  'FranchiseContractProcess': 'FranchisorAccountingAudit',//特许经营活动
  'BusinessRefundProcess': 'Task_FranchiseeBusinessRefund',//营业返款
  'GroupBuyingRefund': 'Task_FranchiseeGroupRefund',//团购返款流程
  'TargetPointApply': 'OfficialTargetTask',//目标点申请
  'ComShopMsgApply':'CompeteStoreTask',//竞店审批
  'ClosedShopAudit': 'CloseShopSubmission',//闭店清算
  'RenovationContractAudit': 'ConstructionTask',//房屋施工合同审核
}
// 流程节点比较长的，或者有分支的才在这里创建，不使用的，不要创建
const taskCheckConfig = {
  'IntentionFranchiseeAudit' : [
    'check1'
  ],
  'FormalFranchiseeAudit' : [
    'check1'
  ],
  'HouseRentalContractAudit' : [
    'check1'
  ],
  'IntentionGoldRefund' : [
    'check3'
  ],
  'FranchiseContractProcess' : [
    'check3'
  ],
  'BusinessRefundProcess' : [
    'check2'
  ],
  'GroupBuyingRefund':{
    line1: []
  }
}
export {
  taskRouterConfig,
  taskCheckConfig
}
