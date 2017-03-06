<template>
  <div class="view index">
    <div class="inner">
      <h1>Martijnderuiter.nl</h1>
      <div id="canvas">

      </div>
    </div>
  </div>

</template>

<script>
    import Vue from 'vue';
    import $ from 'jQuery';
    import animation from '../text.js';
    export default {
      mounted(){
        // this.init();
        // animation();
      },
      data: function(){
        return {
          title: 'component',
          root: ''
        }
      },
      methods:{
      }
    }

</script>
