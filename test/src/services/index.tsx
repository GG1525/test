import axios from 'axios'

export const login = async () => {
  const body = {
    username: 'd3BzYWRtaW4=',
    password: 'WlFZQHRlc3QyMDIzIw==',
    csrfmiddlewaretoken: 'EMWmKhDFFWa7XSKdEshYyY4AmyyRWMFeFsBWeR2ymRX5an5m'
  }
  const res = await axios.post('/c/bjjhaccountsso/api/user/login', body)
  return res.data
}
