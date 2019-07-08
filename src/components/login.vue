<template>
    <v-app>
        <appheader link="admin"/>
        <v-layout align-center justify-center column fill-height>
            <v-form ref="form" lazy-validation class="elevation-5 pa-5">
                <h1>Вход в аккаунт</h1>
                <v-text-field label="Имя пользователя" type="text" counter="20" clearable
                              :rules="[rules.required, rules.max]" v-model="login" autofocus></v-text-field>
                <v-text-field label="Пароль" type="password" counter="20"
                              :rules="[rules.required, rules.min, rules.max]"
                              :type="show ? 'text' : 'password'" :append-icon="show ? 'visibility' : 'visibility_off'"
                              @click:append="show = !show" v-on:keydown.enter="signIn"
                              v-model="pass"></v-text-field>
                <br>
                <v-btn :color="valid ? 'info' : 'error'" block @click="signIn" v-on:keydown.enter="signIn">
                    {{valid ? 'Войти' : 'Попробовать снова'}}
                </v-btn>
            </v-form>
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
            }
        },
        methods: {
            signIn() {
                if (!this.$refs.form.validate()) return;
                this.waiting = true;
                axios.post("/login", {"login": this.login, "password": this.pass})
                    .then((res) => {
                        if (res.data.auth === true) {
                            this.valid = true;
                            if (res.data.admin === true)
                                this.$router.push('/admin');
                            else
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
            }
        }
    }
</script>
