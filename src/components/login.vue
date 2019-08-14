<template>
    <v-app>
        <appheader link=""/>
        <v-layout align-center justify-center fill-height>
            <v-flex md3>
                <v-card class="elevation-12">
                    <v-toolbar color="primary" flat dark>
                        <v-toolbar-title>Вход в аккаунт</v-toolbar-title>
                    </v-toolbar>
                    <v-form ref="form" lazy-validation class="pr-3 pl-3 pt-4 pb-4">
                        <v-text-field label="Имя пользователя" type="text" counter="20" clearable prepend-icon="person"
                                      :rules="[rules.required, rules.max]" v-model="login" autofocus></v-text-field>
                        <v-text-field label="Пароль" type="password" counter="20" prepend-icon="lock"
                                      :rules="[rules.required, rules.min, rules.max]"
                                      :type="show ? 'text' : 'password'"
                                      :append-icon="show ? 'visibility' : 'visibility_off'"
                                      @click:append="show = !show" v-on:keydown.enter="signIn"
                                      v-model="pass"></v-text-field>
                    </v-form>
                    <!--                    <v-card-actions>-->
                    <v-btn :color="valid ? 'primary' : 'error'" block depressed @click="signIn"
                           v-on:keydown.enter="signIn" :dark="enabled" large :disabled="!enabled">
                        {{valid ? 'Войти' : `Попробовать снова ${time !== 0 ? "через " + time + " секунд" : ''}`}}
                    </v-btn>
                    <!--                    </v-card-actions>-->
                </v-card>
            </v-flex>
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
        name: "login",
        components: {Appheader},
        data() {
            return {
                rules: {
                    required: value => !!value || 'Должно быть заполнено',
                    min: v => v.length >= 8 || 'Минимум 8 символов',
                    max: e => (e && e.length <= 20) || 'Максимум 20 символов'
                },
                show: false,
                login: "",
                pass: "",
                valid: true,
                snackbar: false,
                msg: "",
                attempt: (localStorage.getItem('attempt') !== null) ? this.attempt = localStorage.getItem('attempt') * 1 : 0,
                enabled: true,
                time: 0
            }
        },
        watch: {
            attempt: function () {
                if (this.attempt >= 10 && this.attempt < 25)
                    this.timeout(10);
                if (this.attempt >= 25)
                    this.timeout(60)
            }
        },
        methods: {
            signIn() {
                if (!this.$refs.form.validate()) return;
                this.attempt++;
                localStorage.setItem('attempt', this.attempt);
                if (this.attempt >= 10) {
                    this.msg = "Слишком много попыток, повторите позже";
                    this.snackbar = true;
                    this.enabled = false;
                    this.valid = false;
                    return;
                }
                axios.post("/login", {"login": this.login, "password": this.pass})
                    .then((res) => {
                        if (res.data.auth === true) {
                            console.log(res.data);
                            this.valid = true;
                            localStorage.setItem('token', res.data.token);
                            localStorage.removeItem('attempt');
                            axios.defaults.headers.authorization = res.data.token;
                            if (res.data.admin === true) {
                                localStorage.setItem('admin', 'true');
                                this.$router.push('/admin');
                            } else
                                this.$router.push('/')
                        }
                        this.msg = "Неправильный логин или пароль! Повторите попытку";
                        this.snackbar = true;
                        this.valid = false;
                    })
                    .catch((err) => {
                        console.warn(err);
                        this.msg = "Что-то пошло не так, повторите попытку";
                        this.snackbar = true;
                        this.valid = false;
                    })
            },
            timer(time) {
                setInterval(() => {
                    if (time > 0) {
                        time--;
                        this.time = time;
                    }
                }, 1000)
            },
            timeout(time) {
                setTimeout(() => {
                    this.enabled = true;
                    this.time = 0
                }, time * 1000);
                this.timer(time)
            }
        },
        beforeCreate() {
            if (localStorage.getItem('token') !== null) {
                console.log(localStorage.getItem('token') + '--');
                localStorage.removeItem('token');
            }
        }
    }
</script>
