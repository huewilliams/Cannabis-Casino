<template>
  <div id="app">
    <Header></Header>
    <div id="content">
      <Profile></Profile>
      <Contents></Contents>
    </div>
  </div>
</template>

<script>
  import Header from './components/Header'
  import Profile from './components/Profile';
  import Contents from './components/Contents';

  export default {
    name: 'app',
    components:{
      Header,
      Profile,
      Contents
    }
  }
</script>

<style>
  #content {
    display: flex;
  }
  h1 {
    color:crimson;
  }
</style>
