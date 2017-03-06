<template>
  <div class="view index">
    <div class="inner">
      <div id="canvas"></div>
    </div>
  </div>

</template>

<script>
    import Vue from 'vue';
    import $ from 'jQuery';
    var THREE = require('three');
    // console.log(THREE);
    export default {
      mounted(){
        console.log('Component loaded!');
        this.three();
      },
      data: function(){
        return {
          title: 'component'
        }
      },
      methods:{
        three(){
  
        }
      }
    }
</script>
