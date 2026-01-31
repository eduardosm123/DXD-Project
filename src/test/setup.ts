import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock SVG imports
vi.mock('/vite.svg', () => ({ default: 'vite.svg' }))
vi.mock('../assets/react.svg', () => ({ default: 'react.svg' }))
