<template>
    <v-app>
        <appheader link="404"/>
        <h1 class="text-xs-center mt-5 pt-5">Панель Администратора</h1>
        <v-layout justify-center row fill-height>
            <v-dialog v-model="openKrits" max-width="600px">
                <template #activator="{ on }">
                    <v-btn color="info" v-on="on" @click="getKrits">показать критерии</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">Критерии сбора отчёта</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-text-field v-for="(krit, index) in rows" :label="'Строка #'+ (index + 1) + ':'"
                                              type="text" :counter="40" clearable :rules="[rules.max]"
                                              v-model="rows[index]" class="ma-2" :ref="index"></v-text-field>
                            </v-layout>
                        </v-container>
                        <small>Чтобы удалить, оставьте пустым</small>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="green" flat @click="addKrit">
                            <v-icon dark>add</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="red darken-1" flat @click="openKrits = false">Отменить</v-btn>
                        <v-btn color="blue darken-1" flat @click="sendData">Сохранить</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-btn color="info">????</v-btn>

            <v-btn color="info">показать пользователей</v-btn>

            <v-dialog v-model="openNewUser" max-width="600px">
                <template #activator="{ on }">
                    <v-btn color="info" v-on="on">добавить пользователя</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">Добавление пользователя</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-form ref="form" lazy-validation>
                                <v-layout wrap>
                                    <v-text-field label="Имя пользователя" type="text" :counter="20" clearable
                                                  :rules="[rules.max, rules.required]"
                                                  v-model="newUser.login" class="ma-2"></v-text-field>
                                    <v-text-field label="Пароль" type="text" :counter="20" clearable
                                                  :rules="[rules.max, rules.required]"
                                                  v-model="newUser.pass" class="ma-2"></v-text-field>
                                    <v-select label="Роль" :items="['Стандарт', 'Начальник', 'Ген. начальник', 'Админ']"
                                              v-model="newUser.role" class="ma-2"></v-select>
                                </v-layout>
                            </v-form>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red darken-1" flat @click="openNewUser = false">Отменить</v-btn>
                        <v-btn color="blue darken-1" flat @click="sendNewUser">Сохранить</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <br/>
        </v-layout>
        <v-snackbar v-model="snackbar" top :timeout="4000">
            {{msg}}
        </v-snackbar>
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
                    max: e => (e && e.length <= 20) || 'Максимум 20 символов'
                },
                rows: [],
                newUser: {login: "", pass: "", role: "Стандарт"},
                openKrits: false,
                openUsers: false,
                openNewUser: false,
                snackbar: false,
                msg: "",
            }
        },
        methods: {
            sendData() {
                this.openKrits = false;
                axios.post("http://localhost:8001/admin/save", {data: this.rows})
                // axios.post("http://126e4a8c.ngrok.io/admin/save", {data: this.rows})
                    .then(res => {
                        if (res.data.saved !== "true") return;
                        this.msg = "Сохранено!";
                        this.snackbar = true;
                        console.log(res.data)
                    })
            },
            getKrits() {
                axios.post("http://localhost:8001/admin")
                // axios.post("http://126e4a8c.ngrok.io/admin")
                    .then(res => {
                        this.rows = res.data.splice(1, res.data.length - 1)
                    });
            },
            addKrit() {
                this.rows.push("");
                // let tmp = this.rows.length - 1;
                // this.$refs..focus(); //TODO: set focus at new input
            },
            sendNewUser() {
                if (!this.$refs.form.validate()) return;
                this.openNewUser = false;
                axios.post("http://localhost:8001/admin/newuser", this.newUser)
                    .then(res => {
                        if (res.data.userAdded !== "true") return;
                        this.msg = "Пользователь добавлен";
                        this.snackbar = true;
                        console.log(res)
                    });
            }
        }
    }
</script>
