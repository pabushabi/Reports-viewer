<template>
    <v-toolbar color="info" app dark>
        <v-layout id="title">
            <v-icon large id="icon">description</v-icon>
            <v-toolbar-title @click="goHome">Report viewer</v-toolbar-title>
        </v-layout>

        <v-spacer/>
        <v-toolbar-items id="items">
            <v-btn flat @click="goToLink">
                {{link}}
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>
    export default {
        name: "appheader",
        props: ['link'],
        data() {
            return {}
        },
        methods: {
            goToLink() {
                if (this.link === "home") {
                    this.goHome();
                    return;
                }
                this.$router.push(`${this.link}`)
            },
            goHome() {
                this.$router.push('/');
            }
        }
    }
</script>

<style scoped>
    #title {
        cursor: pointer;
        margin-left: 12%;
    }
    #items {
        margin-right: 12%;
    }
    #icon {
        margin-right: -2%;
        margin-top: -1%;
    }
</style>
