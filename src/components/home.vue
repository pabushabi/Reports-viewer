<template>
    <v-app>
        <appheader :link="link ? 'admin' : ''"/>
<!--        <h1 class="text-xs-center mt-5 pt-5">Просмотр таблиц</h1>-->
        <v-layout column class="mt-5">
            <v-tabs color="primary" slider-color="" dark class="elevation-3 mt-4">
                <v-tab v-for="item in dept" :key="item.id">
                    {{ item.name }}
                </v-tab>
                <v-tabs-items>
                    <v-tab-item v-for="(dep, index) in dept" :key="index">
                        <apptable :name="dep.name" :table="tables[index]"/>
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
                tab: null,
                dept: [],
                dialog: false,
                tables: [[]],
                link: localStorage.getItem('admin') === 'true'
            }
        },
        beforeCreate() {
            axios.post('/')
                .then((res) => {
                    for (let i = 0; i < res.data.length; i++) {
                        this.dept.push({id: i, name: res.data[i].name});
                        this.tables[i] = res.data[i].data.splice(1, res.data[i].data.length);
                    }
                })
                .catch((err) => {
                    console.log(err)
                });
        }
    }
</script>
