<template>
    <v-toolbar color="light-blue darken-1" app dark class="pl-5 pr-5">
        <v-toolbar-items class="ma-5 pa-5">
            <v-btn to="/" flat active-class class="ma-5">
                <v-icon large class="mr-1">description</v-icon>
                Report viewer
            </v-btn>
        </v-toolbar-items>
        <v-spacer/>
        <v-toolbar-items class="ma-5 pa-5">
            <v-btn flat :to="link" class="ma-5">
                {{link}}
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>
    export default {
        name: "appheader",
        props: ['link']
    }
</script>
