<template>
    <v-app>
        <appheader link="admin"/>
        <v-layout align-center justify-center column fill-height>
            <v-form ref="form" id="login-form" lazy-validation class="elevation-5 pa-5">
                <h1>Вход в аккаунт</h1>
                <v-text-field label="Имя пользователя" type="text" :counter="20" clearable
                              :rules="[rules.required, rules.max]" v-model="login"></v-text-field>
                <v-text-field label="Пароль" type="password" :counter="35"
                              :rules="[rules.required, rules.min]"
                              :type="show ? 'text' : 'password'"
                              :append-icon="show ? 'visibility' : 'visibility_off'" @click:append="show = !show"
                              v-model="pass"></v-text-field>
                <br>
                <v-layout align-center justify-center>
                    <v-btn :color="valid ? 'info' : 'error'" :loading="waiting" :block="!waiting" :fab="waiting"
                           :small="waiting" @click="loading">{{valid ? 'Войти' : 'Попробовать ещё'}}
                    </v-btn>
                </v-layout>
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
                    max: e => e.length <= 20 || 'Максимум 20 символов'
                },
                show: false,
                login: "",
                pass: "",
                waiting: false,
                valid: true,
                snackbar: false,
                msg: "",
            }
        },
        methods: {
            loading() {
                if (!this.$refs.form.validate()) return;
                this.waiting = true;

                axios.post("http://localhost:8001/login", {"login": this.login, "password": this.pass})
                // axios.post("http://126e4a8c.ngrok.io/login", {"login": this.login, "password": this.pass})
                    .then((res) => {
                        console.log(res);
                        if (res.data.auth === "true") {
                            this.valid = true;
                            this.waiting = false;
                            if (res.data.admin === "true")
                                this.$router.push('/admin');
                            else
                                this.$router.push('/')
                        }
                    })
                    .catch((err) => {
                        console.warn(err)
                    })
            }
        }
    }
</script>

<style scoped>
    #login-form {
        margin-bottom: 7%;
    }
</style>
