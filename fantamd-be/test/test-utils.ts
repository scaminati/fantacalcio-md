export const authInvalid = 'Authorization token is invalid: The token signature is invalid.'
export const authMissing = 'No Authorization was found in request.headers'

export const adminUser = {
  username: 'admin',
  password: '70d7fa0d132819c0aa92471d1c046e33.d8f65be829bb262cfe33bc9648795437e513afff2bf37510352d822fbfce7ca8'
}

export const username = 'username'
export const password = 'password'
export const fakeUserFromDb = {
  id: 1,
  username,
  password: 'hashed-password'
}

export const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6InVzZXJuYW1lIn0sImlhdCI6MTc1NjgyMDA1NX0.Vo5fapnU6zMXTeQpsfdCpVpOJ2TPDYIbMv5D-dcwZ-k'
export const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30'
export const competitor = {
  id: 1,
  fullname: 'Luca Bianchi',
  phone: '+39 347 123 4567',
  email: 'luca.bianchi@example.com',
  paid: 'yes',
  added_into_app: true,
  created_at: '2025-09-02T13:10:14Z'
}
export const competitorCreate = {
  fullname: 'Luca Bianchi',
  phone: '+39 347 123 4567',
  email: 'luca.bianchi@example.com',
  paid: 'yes',
  added_into_app: true
}
export const competitorsPage = {
  results: [competitor],
  total: 1
}
