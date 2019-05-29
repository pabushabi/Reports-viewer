<template>
    <header>
        <router-link to="/">Home</router-link>
        <router-link to="/login">Login</router-link>
    </header>
</template>

<script>
    export default {
        name: "appheader"
    }
</script>

<style scoped>
    header {
        border-bottom: 1px rgba(21, 35, 27, .3) solid;
        height: 60px;
    }
    a {
        padding: 10px;
        position: relative;
        top: 5px;
        left: 100px;
        text-decoration: none;
        font-size: xx-large;
        font-weight: lighter;
    }
    a:visited {
        color: black;
    }
</style>
