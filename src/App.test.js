jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: () => ({
      interceptors: { request: { use: jest.fn() } },
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    }),
  },
}));

import { render } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
});
