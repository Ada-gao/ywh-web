<template>
    <canvas id="canvas"></canvas>
</template>


<script type="application/ecmascript">
  import QRCode from 'qrcode'
  export default {
    props: ['config', 'text'],
    data () {
      return {
      }
    },
    methods: {
    },
    mounted(){
      QRCode.toCanvas(this.$el, this.text, this.config, function (error) {
        if (error) console.error(error)
        console.log('success!')
      })
    },
  }
</script>
