<template>
    <v-app>
        <appheader link="/"/>
        <v-layout align-center column justify-center>
            <h1 class="text-xs-center">404</h1>
            <h2 class="text-md-center">Здесь ничего нет. Как вы сюда попали?</h2>
            <v-btn to="/" flat>Вернуться домой</v-btn>
        </v-layout>
    </v-app>
</template>

<script>
    import Appheader from "@/components/appheader";

    export default {
        name: "pageNotFound",
        components: {Appheader}
    }
</script>
