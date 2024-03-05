import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'

import ImageCard from './image-card'

it('should match snapshot', () => {
  const onDelete = vi.fn()
  const { asFragment, unmount } = render(
    <ImageCard url="http://localhost:3000/image.jpg" onDelete={onDelete} />
  )
  expect(asFragment()).toMatchSnapshot()
  unmount()
})

it('should be able to copy url and delete image', async () => {
  const user = userEvent.setup()

  const onDelete = vi.fn()
  const imageUrl = 'http://localhost:3000/image.jpg'
  const screen = render(<ImageCard url={imageUrl} onDelete={onDelete} />)

  const deleteButton = screen.getByRole('button', { name: /delete/i })
  await user.click(deleteButton)
  expect(onDelete).toHaveBeenCalledWith(imageUrl)

  const spy = vi.spyOn(navigator.clipboard, 'writeText')
  const copyButton = screen.getByRole('button', { name: /copy url/i })
  await user.click(copyButton)
  expect(spy).toHaveBeenCalledWith(imageUrl)
  screen.unmount()
})
