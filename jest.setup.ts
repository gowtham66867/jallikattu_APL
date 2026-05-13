import '@testing-library/jest-dom'

// jsdom provides localStorage natively — just clear it between tests

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
    ok: true,
    status: 200,
  })
) as jest.Mock

beforeEach(() => {
  localStorage.clear()
  jest.clearAllMocks()
})
