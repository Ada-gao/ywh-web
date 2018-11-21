<template>
  <div class="audio">
    <span class="title">通话录音：</span>
    <el-slider :show-tooltip="false" v-model="slider" @change="change"></el-slider>
    <audio ref="audio" @pause="onPause" @play="onPlay" autoplay hidden @timeupdate="onTimeupdate" @loadedmetadata="onLoadedmetadata" :src="url">
      您的浏览器不支持在线播放
    </audio>
    <span class="time">{{currentTime+'/'+maxTime}}</span>
    <span class="icon" @click="switchPlay">
      <i v-if="playing" class="iconfont icon-zanting"/>
      <i v-else class="iconfont icon-bofang"/>
   </span>
  </div>
</template>
<script>
  function realFormatSecond(second) {
    var secondType = typeof second
    if (secondType === 'number' || secondType === 'string') {
      second = parseInt(second)
      var hours = Math.floor(second / 3600)
      second = second - hours * 3600
      var mimute = Math.floor(second / 60)
      second = second - mimute * 60
      return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    } else {
      return '0:00:00'
    }
  }

  export default {
    props: ["url"],
    data() {
      return {
        total: 0,
        slider: 0,
        currentTime: '0:00:00',
        maxTime: '0:00:00',
        playing: false,
      }
    },
    methods: {
      onTimeupdate(res) {
        this.slider = res.target.currentTime / this.total * 100
        this.currentTime = realFormatSecond(res.target.currentTime)
      },
      onLoadedmetadata(res) {
        this.total = res.target.duration
        this.maxTime = realFormatSecond(res.target.duration)
      },
      change(val) {
        this.$refs.audio.currentTime = val / 100 * this.total
      },
      onPlay() {
        this.playing = true
      },
      onPause() {
        this.playing = false
      },
      switchPlay() {
        if (this.playing){
          this.playing = false
          this.$refs.audio.pause()
        } else{
          this.playing = true
          this.$refs.audio.play()
        }
      },
    },
  }
</script>
<style lang="scss">
  .audio {
    line-height: 24px;
    .title {
      float: left;
      font-size: 12px;
      color: #252525;
    }
    .el-slider {
      height: 9px;
      width: 50%;
      float: left;
    }
    .el-slider__button-wrapper {
      display: none;
    }
    .el-slider__runway {
      margin-top: 10px;
      margin-left: 10px;
      margin-right: 10px;
    }
    .time {
      font-size: 12px;
      margin-left: 20px;
      margin-right: 10px;
      color: #252525;
    }
    .icon {
      i {
        color: #0299CC;
      }
    }
  }
</style>
