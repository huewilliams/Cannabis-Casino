<template>
    <h3>{{ nick }}</h3>
</template>

<script>
    export default {
        name: "Name",
      data() {
          return {
            nick : ''
          }
      },
      beforeCreate :function () {
        axios.get('http://18.220.117.207:5000/user/nick')
          .then((res)=> {
              console.log(res.data);
              this.nick = res.data;
            }
          )
      }
    }
</script>

<style scoped>
  h3 {
    color: white;
    text-align: center;
  }
</style>
