<template>
  <div class="circles-wrap" v-if="visible">
    <svg height="80" width="80">
        <circle cx="40" cy="40" r="35" fill="none" stroke="#d9d9d9" stroke-width="5" stroke-linecap="round"/>
        <circle class="c-progress" ref="circle" cx="40" cy="40" r="35" fill="none" stroke="#1890ff" stroke-width="6" stroke-dasharray="0,10000"/>
    </svg>
    <div class="c-text">{{value}}%</div>
  </div>
</template>

<script>
  export default {
    props:{
      visible:{
        type:Boolean,
        default:true,
      },
      value:{
        type:Number,
        default:0,
      }
    },
    created(){
    },
    mounted(){
    },
    methods: {
    },
    watch:{
      value(v){
        const circle = this.$refs.circle;
        var circleLength = Math.floor(2 * Math.PI * circle.getAttribute("r"));
        if(typeof v === 'number'){
          v = parseInt(v);
          v = Math.max(0,Math.min(v,100))
        }else{
          v = 0
        }
        circle.setAttribute("stroke-dasharray","" + circleLength * (v + 2) / 100 + ",10000")
        // this.value = v;
      }
    }

  }
</script>

<style type="text/css" lang="scss" scoped>
    .circles-wrap{position: absolute; top: 20px; left: 20px; width: 80px; height: 80px;
      .c-progress{transform-origin: center; transform: rotate(-90deg); transition: stroke-dasharray .3s ease-in;}
      .c-text{position: absolute; top: 0; left: 0; width: 100%; height: 30px; line-height: 30px; top: 50%; margin-top: -15px; text-align: center; font-size: 16px; color:#1890ff;}
      .circles-tip{font-size: 18px; margin-top: 10px; color:#1890ff; }
    }

</style>