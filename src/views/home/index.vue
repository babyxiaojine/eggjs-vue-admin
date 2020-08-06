<template>
    <div class="home-page">
        <img :src="homeJpg" >
    </div>
</template>
<script>
    import homeJpg from '@/assets/PC.png'
    import {postAxios, getAxios} from '@/utils/request'
    import CardItem from './child/card'

    export default {
        name: 'home',
        components: {
            CardItem,
        },
        data() {
            return {
                homeJpg,
            }
        },
        created() {
            this.getList()
        },
        mounted() {
        },
        methods: {
            // 查询列表
            getList() {
                // const {filterForm,pageParam}=this;
                postAxios('/sys/user/loadAllUser',{
                    data:{
                    // ...filterForm,
                    userType:'1',
                    // pageNo:pageParam.pageNo,
                    // pageSize:pageParam.pageSize
                    }
                }).then((res)=>{ 
                    if(res.code === '0000' && res.data){
                    this.list = res.data.list||[];
                    this.total = res.data.total||0;
                    }
                })
            },

        }
    }

</script>
<style lang="scss" scoped>
.home-page{@include flexbox; height: calc(100vh - 84px);
    img{max-width:90%; max-height:90%;}
}
</style>
