const TOKEN_KEY = 'token'
const USERNAME_KEY = 'username'

export const authStorage = {
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
  },
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },
  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
  },
  setUsername(username) {
    localStorage.setItem(USERNAME_KEY, username)
  },
  getUsername() {
    return localStorage.getItem(USERNAME_KEY)
  },
  removeUsername() {
    localStorage.removeItem(USERNAME_KEY)
  },
  clear() {
    this.removeToken()
    this.removeUsername()
  },
}
