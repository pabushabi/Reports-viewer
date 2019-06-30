<template>
    <v-app>
        <appheader/>
        <h1 class="text-xs-center mt-5 pt-5">Панель Администатора</h1>
        <v-layout align-center justify-center column fill-height>
            <v-text-field v-for="(krit, index) in rows" :label="'Строка #'+ (index + 1) + ':'" type="text" :counter="40" clearable
                          :rules="[rules.required, rules.max]" v-model="rows[index]"></v-text-field>
            <v-btn color="light-blue darken-1" dark @click="saveData">Сохранить</v-btn>
            <br/>
        </v-layout>
    </v-app>
</template>

<script>
    import Appheader from "@/components/appheader";
    import axios from "axios";

    export default {
        name: "admin",
        components: {Appheader},
        data() {
            return {
                rules: {
                    required: value => !!value || 'Должно быть заполнено',
                    max: e => e.length <= 40 || 'Максимум 40 символов'
                },
                rows: [],
                loaded: false,
            }
        },
        mounted() {
            axios.post("http://localhost:8001/admin")
            // axios.post("http://a7f511e0.ngrok.io/admin")
                .then((res) => {
                    this.rows = res.data.splice(1, res.data.length - 1)
                });
        },
        methods: {
            saveData() {
                axios.post("http://localhost:8001/admin/save", {data: this.rows})
                // axios.post("http://a7f511e0.ngrok.io/admin/save", {data: this.rows})
                    .then((res) => {

                    })
            }
        }
    }
</script>

<style scoped>

</style>
