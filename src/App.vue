<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <lg-preview></lg-preview>
  </div>
</template>
<script>
  export default {
    name: 'app'
  }
</script>

