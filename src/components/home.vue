<template>
    <v-app>
        <appheader link="login"/>
        <h1 class="text-xs-center mt-5 pt-5">Просмотр таблиц</h1>
        <v-layout align-center column justify-center>
            <v-tabs color="light-blue darken-1" slider-color="amber" dark class="elevation-3">
                <v-tab v-for="item in dept" :key="item.id">
                    {{ item.name }}
                </v-tab>

                <v-tabs-items>
                    <v-tab-item :key="1">
                        <apptable table="1" loaded="loaded"/>
                    </v-tab-item>
                    <v-tab-item :key="2">
                        <apptable table="2" loaded="loaded"/>
                    </v-tab-item>
                    <v-tab-item :key="3">
                        <apptable table="3" loaded="loaded"/>
                    </v-tab-item>

                </v-tabs-items>
            </v-tabs>
        </v-layout>
        <br/>
    </v-app>
</template>

<script>
    import Appheader from "@/components/appheader";
    import Apptable from "@/components/apptable";
    import axios from "axios";

    export default {
        name: "home",
        components: {Apptable, Appheader},
        data() {
            return {
                loaded: true,
                tab: null,
                dept: [
                    {id: 1, name: 'Отдел #1'},
                    {id: 2, name: 'Отдел #2'},
                    {id: 3, name: 'Отдел #3'}
                ],
                dialog : false,
            }
        },
        beforeCreate() {
            axios.post('http://localhost:8001/')
                .then((res) => {
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }
</script>

<style scoped>

</style>
