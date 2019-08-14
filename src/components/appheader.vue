<template>
    <v-toolbar color="primary" app dark class="pl-5 pr-5">
        <v-toolbar-items class="ma-5 pa-5">
            <v-btn to="/" flat active-class class="ma-5">
                <v-icon large class="mr-1">description</v-icon>
                Report viewer
            </v-btn>
        </v-toolbar-items>
        <v-spacer/>
        <v-toolbar-items class="ma-5 pa-5">
            <v-btn flat :to="link" :class="link ? '': 'mr-5'">
                {{link}}
            </v-btn>
            <v-btn flat @click="logOut" class="mr-5">
                Выйти
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>
    import axios from "axios";

    export default {
        name: "appheader",
        props: ['link'],
        methods: {
            logOut() {
                axios.defaults.headers.authorization = null;
                localStorage.removeItem('token');
                localStorage.removeItem('admin');
                document.location.reload();
            }
        }
    }
</script>
