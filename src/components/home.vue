<template>
    <v-app>
        <appheader link="login"/>
        <h1 class="text-xs-center ma-5 pa-5">It`s HOME!</h1>
        <v-layout align-center row justify-center>
            <v-data-table :headers="headers" :items="desserts" class="elevation-2" hide-actions :loading="!loaded">
                <template v-slot:items="props">
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.calories }}</td>
                    <td>{{ props.item.fat }}</td>
                    <td>{{ props.item.carbs }}</td>
                    <td>{{ props.item.protein }}</td>
                    <td>{{ props.item.iron }}</td>
                </template>
                <template v-slot:no-data>
                    <v-alert :value="true" color="error" icon="warning">
                        Здесь ничего нет.
                    </v-alert>
                </template>
                <template v-slot:footer>
                    <td :colspan="headers.length">
                        Тестовая таблица #1
                    </td>
                </template>
            </v-data-table>
        </v-layout>
        <br/>
    </v-app>
</template>

<script>
    import Appheader from "@/components/appheader";

    export default {
        name: "home",
        components: {Appheader},
        data() {
            return {
                loaded: true,
                headers: [
                    {text: 'Десерт (100г)', value: 'name'},
                    {text: 'Калории', value: 'calories'},
                    {text: 'Жиры (г)', value: 'fat'},
                    {text: 'Углеводы (г)', value: 'carbs'},
                    {text: 'Белки (г)', value: 'protein'},
                    {text: 'Железо (%)', value: 'iron'}
                ],
                desserts: [
                    {
                        name: 'Йогурт',
                        calories: 159,
                        fat: 6.0,
                        carbs: 24,
                        protein: 4.0,
                        iron: '1%'
                    },
                    {
                        name: 'Морженое',
                        calories: 237,
                        fat: 9.0,
                        carbs: 37,
                        protein: 4.3,
                        iron: '1%'
                    },
                    {
                        name: 'Эклер',
                        calories: 262,
                        fat: 16.0,
                        carbs: 23,
                        protein: 6.0,
                        iron: '7%'
                    },
                    {
                        name: 'Капкейк',
                        calories: 305,
                        fat: 3.7,
                        carbs: 67,
                        protein: 4.3,
                        iron: '8%'
                    },
                    {
                        name: 'Пряник',
                        calories: 356,
                        fat: 16.0,
                        carbs: 49,
                        protein: 3.9,
                        iron: '16%'
                    },
                    {
                        name: 'Мармелад',
                        calories: 375,
                        fat: 0.0,
                        carbs: 94,
                        protein: 0.0,
                        iron: '0%'
                    },
                    {
                        name: 'Леденец',
                        calories: 392,
                        fat: 0.2,
                        carbs: 98,
                        protein: 0,
                        iron: '2%'
                    },
                    {
                        name: 'Медовые соты',
                        calories: 408,
                        fat: 3.2,
                        carbs: 87,
                        protein: 6.5,
                        iron: '45%'
                    },
                    {
                        name: 'Пончик',
                        calories: 452,
                        fat: 25.0,
                        carbs: 51,
                        protein: 4.9,
                        iron: '22%'
                    },
                    {
                        name: 'Кит-кат',
                        calories: 518,
                        fat: 26.0,
                        carbs: 65,
                        protein: 7,
                        iron: '6%'
                    }
                ]
            }
        }
    }
</script>

<style scoped>

</style>
