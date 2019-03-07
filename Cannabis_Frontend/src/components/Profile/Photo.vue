<template>
  <img v-bind:src="url" v-bind:id="edit()">
</template>

<script>
  export default {
    data() {
      return {
        url: 'hue'
      }
    },
    methods: {
      edit: //엑시오스 GET 요청
      function() {
        axios.get('http://localhost:5000/user/')
          .then((response) => {
            this.url = response.data;
          })
      }
    },
  }
</script>

<style scoped>
  img {
    width: 200px;
    height: 200px;
    margin: 0;
    padding: 0;
    border-radius: 5px;
  }
</style>
