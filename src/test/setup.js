import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// react-toastify dispara efectos secundarios (DOM/timers) que no aportan al test
// de la lógica del carrito: lo mockeamos para que las llamadas a toast no fallen.
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
  ToastContainer: () => null,
}))

// Limpia el DOM y el localStorage entre tests para mantenerlos aislados.
afterEach(() => {
  cleanup()
  localStorage.clear()
})
