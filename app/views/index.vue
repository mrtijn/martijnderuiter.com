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
    import TweenMax from 'gsap';
    // import animation from '../text.js';
    export default {
      mounted(){
        // this.init();
        // animation();

        TweenMax.fromTo('h1', 0.7,
        {scale: 0},
        {scale: 1,ease: Elastic.easeOut});
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
