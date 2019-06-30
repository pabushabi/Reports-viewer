<template>
    <v-data-table :headers="headers" :items="table"
                  hide-actions :loading="!loaded">
        <template #items="props">
            <td v-for="(item, index) in headers" @click.stop="getCell(props.item, index)">{{ props.item[index] }}</td>
        </template>
        <template #no-data>
            <v-alert :value="true" color="error" icon="warning">
                Здесь ничего нет.
            </v-alert>
        </template>
        <template #footer>
            <td :colspan="headers.length">
                Тестовая таблица "{{name}}"
            </td>
        </template>
    </v-data-table>
</template>

<script>
    export default {
        name: "apptable",
        props: ['name', 'table', 'loaded'],
        data() {
            return {
                headers: [
                    {text: 'Имя критерия', value: ''},
                    {text: 'Январь', value: '1'},
                    {text: 'Февраль', value: '2'},
                    {text: 'Март', value: '3'},
                    {text: 'Аперль', value: '4'},
                    {text: 'Май', value: '5'},
                    {text: 'Июнь', value: '6'},
                    {text: 'Июль', value: '7'},
                    {text: 'Август', value: '8'},
                    {text: 'Сентябрь', value: '9'},
                    {text: 'Октябрь', value: '10'},
                    {text: 'Ноябрь', value: '11'},
                    {text: 'Декабрь', value: '12'},

                ],
            }
        },
        methods: {
            getCell(item, index) {
                console.log(`clicked on ${item[index]}`);
            }
        }
    }
</script>

<style scoped>

</style>
