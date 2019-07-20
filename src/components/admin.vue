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
                            <v-select label="Отчёт" :items="reports" v-model="rep" class="ma-1"></v-select>
                            <v-layout wrap>
                                <v-text-field v-for="(krit, index) in rows" :label="'Строка #'+ (index + 1) + ':'"
                                              type="text" :counter="100" clearable
                                              v-model="rows[index]" class="ma-2" ref="myref"
                                              @keydown.enter="sendData"></v-text-field>
                            </v-layout>
                        </v-container>
                        <small>Чтобы удалить, оставьте пустым</small>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="green" flat @click="addCriteria">
                            <v-icon dark>add</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="red darken-1" flat @click="openKrits = false">Отменить</v-btn>
                        <v-btn color="blue darken-1" flat @click="sendData">Сохранить</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="openConfig" max-width="600px">
                <template #activator="{ on }">
                    <v-btn color="info" v-on="on" @click="getConfig">показать config</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">Конфигурационный файл</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                                <v-textarea v-model="config.depts" auto-grow label="depts" rows="1"></v-textarea>
                                <v-textarea v-model="config.keys" auto-grow label="keys" rows="1"></v-textarea>
                                <v-textarea v-model="config.roles" auto-grow label="roles" rows="1"></v-textarea>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red darken-1" flat @click="openConfig = false">Отменить</v-btn>
                        <v-btn color="blue darken-1" flat @click="setConfig">Сохранить</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="openUsers" max-width="600px">
                <template #activator="{ on }">
                    <v-btn color="info" v-on="on" @click="getUsers">показать пользователей</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">Список пользователей</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-layout v-for="(item, index) in users">
                                    <v-text-field :label="'Пользователь #'+ (index + 1) + ':'"
                                                  type="text" :counter="20" clearable :rules="[rules.max]"
                                                  v-model="users[index].login" class="ma-2" ref="myref"></v-text-field>
                                    <v-select label="Роль"
                                              :items="userRoles"
                                              v-model="users[index].userrole" class="ma-2"></v-select>
                                </v-layout>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red darken-1" flat @click="openUsers = false">Отменить</v-btn>
                        <v-btn color="blue darken-1" flat @click="sendUsers">Сохранить</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="openNewUser" max-width="600px">
                <template #activator="{ on }">
                    <v-btn color="info" v-on="on" @click="getRoles">добавить пользователя</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">Добавление пользователя</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-form ref="form" lazy-validation>
                                <keep-alive>
                                    <v-layout wrap>
                                        <v-text-field label="Имя пользователя" type="text" :counter="20" clearable
                                                      :rules="[rules.max, rules.required]"
                                                      v-model="newUser.login" class="ma-2"></v-text-field>
                                        <v-text-field label="Пароль" type="text" :counter="20" clearable
                                                      :rules="[rules.min, rules.max, rules.required]"
                                                      v-model="newUser.pass" class="ma-2"></v-text-field>
                                        <v-select label="Роль" :items="userRoles" v-model="newUser.role"
                                                  class="ma-2"></v-select>
                                    </v-layout>
                                </keep-alive>
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
    import Vue from "vue"

    export default {
        name: "admin",
        components: {Appheader},
        data() {
            return {
                rules: {
                    required: value => !!value || 'Должно быть заполнено',
                    max: e => (e && e.length <= 20) || 'Максимум 20 символов',
                    min: e => e.length >= 8 || 'Минимум 8 символов'
                },
                rr: [],
                roles: [],
                users: [],
                reports: [],
                rep: "Свод",
                config: {depts: [], keys: [], roles: []},
                newUser: {login: "", pass: "", role: "Стандарт"},
                openKrits: false,
                openUsers: false,
                openNewUser: false,
                openConfig: false,
                userRoles: [],
                snackbar: false,
                msg: "",
            }
        },
        computed: {
            rows: function () {
                return this.rr[this.reports.indexOf(this.rep)]
            }
        },
        methods: {
            sendData() {
                this.openKrits = false;
                axios.post("/admin/save", {data: this.rr})
                    .then(res => {
                        if (res.data.saved !== true) return;
                        this.msg = "Сохранено!";
                        this.snackbar = true;
                    })
            },
            getKrits() {
                axios.get("/admin/criteria")
                    .then(res => {
                        this.reports = res.data[0];
                        console.log(res.data);
                        this.rr = res.data[1];
                    });
            },
            getRoles() {
                axios.get("/admin/roles")
                    .then(res => {
                        this.userRoles = res.data;
                    })
            },
            getUsers() {
                this.getRoles();
                axios.get("/admin/users")
                    .then(res => {
                        this.users = res.data;
                    })
            },
            getConfig() {
                axios.get('/admin/config')
                    .then(res => {
                        this.config.depts = res.data.depts;
                        this.config.keys = res.data.keys;
                        this.config.roles = res.data.roles;
                    })
            },
            setConfig() {
                this.openConfig = false;
                axios.post('/admin/config', {depts: this.config.depts, keys: this.config.keys, roles: this.config.roles})
                    .then(res => console.log(res))
                    .catch(err => console.log(err))
            },
            addCriteria() {
                this.rows.push("");
                Vue.nextTick(() => {
                    this.$refs.myref[this.rows.length - 1].focus();
                });
            },
            sendNewUser() {
                if (!this.$refs.form.validate()) return;
                this.openNewUser = false;
                axios.post("/admin/newuser", this.newUser)
                    .then(res => {
                        if (res.data.userAdded !== true) return;
                        this.msg = "Пользователь добавлен";
                        this.snackbar = true;
                    });
            }
        },
        beforeCreate() {
            if (localStorage.getItem('admin') !== 'true')
                this.$router.push("/404");
            if (localStorage.getItem('auth') !== 'true')
                this.$router.push("/404");
        }
    }
</script>
