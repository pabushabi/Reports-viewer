<template>
    <v-app>
        <appheader/>
        <v-flex xs16>
            <v-layout align-center justify-center column fill-height>
                <v-form ref="form" id="login-form">
                    <h1>Вход в аккаунт</h1>
                    <v-text-field label="Имя пользователя" type="text" :counter="20" clearable
                                  :rules="[rules.required, rules.max]"/>
                    <v-text-field label="Пароль" type="password"
                                  :rules="[rules.required, rules.min]"
                                  :type="show ? 'text' : 'password'"
                                  :append-icon="show ? 'visibility' : 'visibility_off'" @click:append="show = !show"/>
                    <br>
                    <v-btn color="info" block>Подтвердить</v-btn>
                </v-form>
            </v-layout>
        </v-flex>

    </v-app>
</template>

<script>
    import Appheader from "@/components/appheader";

    export default {
        name: "login",
        components: {Appheader},
        data() {
            return {
                rules: {
                    required: value => !!value || 'Обязательно',
                    min: v => v.length >= 8 || 'Минимум 8 символов',
                    max: e => e.length <= 20 || 'Максимум 20 символов'
                },
                show: false,
            }
        }
    }
</script>

<style scoped>
    #login-form {
        margin-top: -100px;
    }
</style>
