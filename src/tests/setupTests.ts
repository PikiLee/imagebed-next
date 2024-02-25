// tests/setupTests.js
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'

// Define handlers
const handlers = [
  http.post('/upload', ({ request, params, cookies }) => {
    return HttpResponse.json({
      url: 'https://example.com/test.jpg',
    })
  }),
]

// Create the MSW server with the handlers
const server = setupServer(...handlers)

// Start the server before all tests
beforeAll(() => server.listen())

// Reset handlers after each test
afterEach(() => server.resetHandlers())

// Close the server once the tests are done
afterAll(() => server.close())
