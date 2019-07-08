<template>
    <v-data-table :headers="headers" :items="table"
                  hide-actions :loading="!loaded">
        <template #items="props">
            <td v-for="(item, index) in headers" @dblclick="getCell(props.item, index)">
<!--                <v-edit-dialog :return-value.sync="props.item.name" lazy @save="save" @cancel="cancel" @open="open"-->
<!--                               @close="close">-->
                    {{ props.item[index] }}
<!--                    <template #input>-->
<!--                        <v-text-field-->
<!--                                v-model="props.item[index]"-->
<!--                                :rules="[max25chars]"-->
<!--                                label="Edit"-->
<!--                                single-line-->
<!--                                counter-->
<!--                        ></v-text-field>-->
<!--                    </template>-->
<!--                </v-edit-dialog>-->
            </td>
        </template>
        <template #no-data>
            <v-alert :value="true" color="error" icon="warning">
                Здесь ничего нет.
            </v-alert>
        </template>
        <template #footer>
            <td :colspan="headers.length">
                Таблица "{{name}}"
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
                    {text: '2019', value: '1'},
                    {text: '1 Янв', value: '2'},
                    {text: '2 Янв', value: '3'},
                    {text: '3 Янв', value: '4'},
                    {text: '4 Янв', value: '5'},
                    {text: 'Итого', value: '6'},
                    {text: '1 Фев', value: '7'},
                    {text: '2 Фев', value: '8'},
                    {text: '3 Фев', value: '9'},
                    {text: '4 Фев', value: '10'},
                    {text: 'Итого', value: '11'},
                    {text: '1 Мар', value: '12'},
                    {text: '2 Мар', value: '13'},
                    {text: '3 Мар', value: '14'},
                    {text: '4 Мар', value: '15'},
                    {text: 'Итого', value: '16'},
                    {text: '1 Апр', value: '17'},
                    {text: '2 Апр', value: '18'},
                    {text: '3 Апр', value: '19'},
                    {text: '4 Апр', value: '20'},
                    {text: 'Итого', value: '21'},
                    {text: '1 Май', value: '22'},
                    {text: '2 Май', value: '23'},
                    {text: '3 Май', value: '24'},
                    {text: '4 Май', value: '25'},
                    {text: 'Итого', value: '26'},
                    {text: '1 Июн', value: '27'},
                    {text: '2 Июн', value: '28'},
                    {text: '3 Июн', value: '29'},
                    {text: '4 Июн', value: '30'},
                    {text: 'Итого', value: '31'},
                    {text: '1 Июл', value: '32'},
                    {text: '2 Июл', value: '33'},
                    {text: '3 Июл', value: '34'},
                    {text: '4 Июл', value: '35'},
                    {text: 'Итого', value: '36'},
                    {text: '1 Авг', value: '37'},
                    {text: '2 Авг', value: '38'},
                    {text: '3 Авг', value: '39'},
                    {text: '4 Авг', value: '40'},
                    {text: 'Итого', value: '41'},
                    {text: '1 Сен', value: '42'},
                    {text: '2 Сен', value: '43'},
                    {text: '3 Сен', value: '44'},
                    {text: '4 Сен', value: '45'},
                    {text: 'Итого', value: '46'},
                    {text: '1 Окт', value: '47'},
                    {text: '2 Окт', value: '48'},
                    {text: '3 Окт', value: '49'},
                    {text: '4 Окт', value: '50'},
                    {text: 'Итого', value: '51'},
                    {text: '1 Ноя', value: '52'},
                    {text: '2 Ноя', value: '53'},
                    {text: '3 Ноя', value: '54'},
                    {text: '4 Ноя', value: '55'},
                    {text: 'Итого', value: '56'},
                    {text: '1 Дек', value: '57'},
                    {text: '2 Дек', value: '58'},
                    {text: '3 Дек', value: '59'},
                    {text: '4 Дек', value: '60'},
                    {text: 'Итого', value: '61'},
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
