test('string pattern', () => {
    expect('alice').toMatch(/[a-z]/)
  
    expect('alice').not.toMatch(/[0-9]/)
    //expect('alice'.match(/[0-9]/)).toBe(true)
  
    expect('ALICE').toMatch(/[a-z]/i)
    expect('ALICE').toMatch(/[A-Za-z]/)
  })
  
  test('membership (array) element', () => {
    expect(['alice', 'bob', 'charlie']).toContain('bob')
    expect(['alice', 'bob', 'charlie']).toHaveLength(3)
    expect('alice').toHaveLength(5)
    expect('alice').toContain('ice')
  })
  