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
                    <v-tab-item v-for="(dep, index) in dept" :key="index">
                        <apptable :name="dep.name" :table="tablets[index]" loaded="loaded"/>
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
                dept: [],
                dialog : false,
                tablets: [[]],
            }
        },
        beforeCreate() {
            axios.post('http://localhost:8001/')
            // axios.post('http://a7f511e0.ngrok.io/')
                .then((res) => {
                    console.log(res.data);
                    for (let i = 0; i < res.data.length; i++)
                        this.dept.push({id: i, name: res.data[i].name});
                    for (let j = 0; j < res.data.length; j++)
                        this.tablets[j] = res.data[j].data.splice(1, res.data[j].data.length);
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }
</script>

<style scoped>

</style>
