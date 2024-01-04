let onlineUsers = new Map<string, NodeJS.Timer>()

let onlineInterval = 30 * 1000

export function reportOnline(name: string) {
  let timer = onlineUsers.get(name)
  if (timer) {
    clearTimeout(timer as any)
  }

  timer = setTimeout(() => {
    onlineUsers.delete(name)
  }, onlineInterval)

  onlineUsers.set(name, timer)
}

export function getOnlineUserCount(): number {
  return onlineUsers.size
}

export function resetOnlineUserCount() {
  for (let timer of onlineUsers.values()) {
    clearTimeout(timer as NodeJS.Timeout)
  }
  onlineUsers.clear()
}

// export function getOnlineUsers(): string[] {}