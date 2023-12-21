import {
    getOnlineUserCount,
    reportOnline,
    resetOnlineUserCount,
  } from './04-timer'
  
  jest.useFakeTimers()
  
  beforeEach(() => {
    resetOnlineUserCount()
  })
  
  it('should count from zero', () => {
    expect(getOnlineUserCount()).toBe(0)
  })
  
  it('should count an active user', () => {
    reportOnline('alice')
    expect(getOnlineUserCount()).toBe(1)
  })
  
  it('should count multiple active users', () => {
    reportOnline('bob')
    reportOnline('charlie')
    expect(getOnlineUserCount()).toBe(2)
  })
  
  it('should treat the user as inactive after 30 seconds', async () => {
    reportOnline('alice')
  
    // await sleep(29 * 1000)
    jest.advanceTimersByTime(29 * 1000)
  
    expect(getOnlineUserCount()).toBe(1)
  
    // await sleep(1 * 1000)
    jest.advanceTimersByTime(1 * 1000)
  
    expect(getOnlineUserCount()).toBe(0)
  })
  
  it('should not treat continuous visiting from the same user as multiple users', () => {
    expect(getOnlineUserCount()).toBe(0)
  
    reportOnline('alice')
    expect(getOnlineUserCount()).toBe(1)
  
    jest.advanceTimersByTime(10 * 1000)
    reportOnline('alice')
    expect(getOnlineUserCount()).toBe(1)
  })
  
  it('should count multiple user with repeating visits', () => {
    reportOnline('alice')
    reportOnline('bob')
    expect(getOnlineUserCount()).toBe(2)
  
    jest.advanceTimersByTime(10 * 1000)
    reportOnline('alice')
    expect(getOnlineUserCount()).toBe(2)
  
    jest.advanceTimersByTime(20 * 1000)
    expect(getOnlineUserCount()).toBe(1)
  
    jest.advanceTimersByTime(10 * 1000)
    expect(getOnlineUserCount()).toBe(0)
  })
  
  export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  // expect('x').rejects.toThrow(/user not found/)
  // expect('x').resolves.toEqual({ id: 1, username: 'alice' })