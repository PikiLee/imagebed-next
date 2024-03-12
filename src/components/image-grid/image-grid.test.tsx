import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ImageCard from '../image-card/image-card'
// Import the ImageGrid component normally
import ImageGrid from './image-grid'

// Mocking ImageCard with a prop onDelete
vi.mock('@/components/image-card/image-card', () => {
  return {
    __esModule: true,
    default: ({ url, onDelete }: ComponentProps<typeof ImageCard>) => (
      <div data-testid="image-card">
        <button role="button" onClick={() => onDelete(url)}>
          Delete
        </button>
      </div>
    ),
  }
})

// Mocking ImageCardSkeleton
vi.mock('../image-card-skeleton', () => {
  return {
    __esModule: true,
    default: () => (
      <div data-testid="image-card-skeleton">ImageCardSkeleton</div>
    ),
  }
})

describe('ImageGrid Component', () => {
  afterEach(cleanup) // Unmount components after each test

  it('should render stubbed image cards when urls are provided', () => {
    const urls = [
      'http://localhost:3000/image1.jpg',
      'http://localhost:3000/image2.jpg',
    ]
    const onDelete = vi.fn()
    const { getAllByTestId } = render(
      <ImageGrid urls={urls} onDelete={onDelete} />
    )

    const imageCards = getAllByTestId('image-card')
    expect(imageCards.length).toBe(urls.length)
  })

  it('should render stubbed loading skeletons when isLoadingMore is true', () => {
    const isLoadingMore = true
    const { getAllByTestId } = render(
      <ImageGrid isLoadingMore={isLoadingMore} onDelete={() => {}} />
    )

    const skeletons = getAllByTestId('image-card-skeleton')
    expect(skeletons.length).toBe(6)
  })

  it('should display "No images found" when urls are empty', () => {
    const { getByText } = render(<ImageGrid urls={[]} onDelete={() => {}} />)

    getByText('No images found')
  })

  it('should not display "No images found" when urls are not empty', () => {
    const urls = ['http://localhost:3000/image1.jpg']
    const { queryByText } = render(
      <ImageGrid urls={urls} onDelete={() => {}} />
    )

    expect(queryByText('No images found')).toBeNull()
  })

  it('should call onDelete when delete is triggered on a stubbed image card', async () => {
    const user = userEvent.setup()
    const urls = ['http://localhost:3000/image.jpg']
    const onDelete = vi.fn()
    const { getAllByRole } = render(
      <ImageGrid urls={urls} onDelete={onDelete} />
    )

    const deleteButtons = getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0]) // Assuming there's one delete button per ImageCard
    expect(onDelete).toHaveBeenCalledWith(urls[0])
  })
})
