import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Battery from './Battery'

const product = {
  id: 1,
  name: 'Duncan 950',
  price: 159,
  image: 'battery_01',
  description: 'Batería de alto rendimiento.',
}

describe('<Battery />', () => {
  it('renders the product name, description and price', () => {
    render(<Battery {...product} addToCart={() => {}} />)

    expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument()
    expect(screen.getByText(product.description)).toBeInTheDocument()
    expect(screen.getByText(`$${product.price}`)).toBeInTheDocument()
  })

  it('has an accessible image with descriptive alt text', () => {
    render(<Battery {...product} addToCart={() => {}} />)

    expect(screen.getByRole('img', { name: `Batería ${product.name}` })).toBeInTheDocument()
  })

  it('calls addToCart with the product data when the button is clicked', async () => {
    const addToCart = vi.fn()
    render(<Battery {...product} addToCart={addToCart} />)

    await userEvent.click(
      screen.getByRole('button', { name: `Agregar ${product.name} al carrito` }),
    )

    expect(addToCart).toHaveBeenCalledTimes(1)
    expect(addToCart).toHaveBeenCalledWith({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
    })
  })
})
