import { httpService } from './http.service.js'

var gLoggedinUser = JSON.parse(sessionStorage.getItem('loggedinUser'));

export const userService = {
    signUp,
    login,
    getLoggedinUser,
    getUsers,
    logout,
    getById
}

function getById(userId) {
    // return storageService.get('user', userId)
    return httpService.get(`user/${userId}`)
}

async function signUp(user) {
    const signedUser = await httpService.post('auth/signup', user)
    _handleLoggedinUser(signedUser)
    return signedUser
}
async function login(user) {
    const loginedUser = await httpService.post('auth/login', user)
    _handleLoggedinUser(loginedUser)
    return loginedUser
}

async function logout() {
    const logedout = await httpService.post('auth/logout')
    sessionStorage.clear()
    return logedout
}

async function getUsers() {
    const users = await httpService.get('user/')
    return users
}

function _handleLoggedinUser(user) {
    sessionStorage.setItem('loggedinUser', JSON.stringify(user))
    return user;
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem('loggedinUser') || 'null')
}