import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect } from 'vitest'
import UploadButton from './upload-button'
import { testImage } from '@/tests/test-image'

test('upload button', async () => {
  const user = userEvent.setup()
  render(<UploadButton />)

  const uploader = await screen.getByLabelText('Select a Image')
  await user.upload(uploader, testImage)
  expect(
    await screen.findByText('Uploading has succeeded! Copy the image URL.')
  ).toBeTruthy()
  expect(await screen.findByText('https://example.com/test.jpg')).toBeTruthy()

  await screen.getByText('Copy URL')

  const resetButton = await screen.getByRole('button', {
    name: 'Upload New Image',
  })
  await user.click(resetButton)
  expect(await screen.getByLabelText('Select a Image')).toBeTruthy()
})
