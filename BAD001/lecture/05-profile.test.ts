import { getProfile } from './05-profile'
import { HttpError } from './http.error'

test('getProfile() should include username in result', () => {
  let user = getProfile(1)
  expect(user).toMatchObject({
    id: expect.any(Number),
    username: expect.any(String),
  })
  expect(user).not.toMatchObject({
    password: expect.any(String),
  })
})

test('getProfile() should raise 404 http error when the user is not existing', () => {
  expect(() => getProfile(1000)).toThrow(new HttpError(404, 'user not found'))
  // expect(() => getProfile(1000)).toThrow()
  // getProfile(1000)
})
