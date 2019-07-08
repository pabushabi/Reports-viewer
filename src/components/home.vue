<template>
    <v-app>
        <appheader link="login"/>
<!--        <h1 class="text-xs-center mt-5 pt-5">Просмотр таблиц</h1>-->
        <v-layout column justify-center class="mt-5">
            <v-tabs color="light-blue darken-1" slider-color="amber" dark class="elevation-3 mt-4">
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
                dialog: false,
                tablets: [[]],
            }
        },
        beforeCreate() {
            axios.post('/')
                .then((res) => {
                    if (res.data[res.data.length - 1].user === undefined) this.$router.push('/login');
                    res.data.splice(res.data.length - 1, res.data.length);
                    for (let i = 0; i < res.data.length; i++) {
                        this.dept.push({id: i, name: res.data[i].name});
                        this.tablets[i] = res.data[i].data.splice(1, res.data[i].data.length);
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }
</script>
