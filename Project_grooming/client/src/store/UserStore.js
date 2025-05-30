import { makeAutoObservable } from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false;//флаг, указывающий, авторизован ли пользователь
        this._user = {};//объект, содержащий данные о пользователе
        makeAutoObservable(this);
    }

    setIsAuth(bool) {
        this._isAuth = bool;
    }

    setUser(user) {
        this._user = user;//сохраняет данные о пользв
    }

    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    }

    get isAdmin() {
        return this._user.role === 'ADMIN';
    }
}
