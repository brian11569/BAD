export interface UserService {
  login(input: { username: string; password: string }): Promise<{ id: number }>

  register(input: {
    username: string
    password: string
    avatar: string | null
    email: string
    tel: string
  }): Promise<{ id: number }>
}