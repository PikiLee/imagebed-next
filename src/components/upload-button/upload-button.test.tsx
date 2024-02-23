import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect } from 'vitest'
import UploadButton from './upload-button'
import fs from 'fs'
import path from 'path'

const file = new File(
  [fs.readFileSync(path.join(__dirname, '../../assets/test.jpg'))],
  'test.png',
  {
    type: 'image/jpg',
  }
)

test('upload button', async () => {
  const user = userEvent.setup()
  render(<UploadButton />)

  const uploader = await screen.getByLabelText('Select a Image')
  await user.upload(uploader, file)
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
