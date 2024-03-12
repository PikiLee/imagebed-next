import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import UploadButton from './upload-button' // Adjust the import path as necessary

describe('UploadButton Component', () => {
  afterEach(cleanup) // Unmount components after each test

  it('should render the upload button with correct text when not uploading', () => {
    const onChange = vi.fn()
    const { getByText } = render(
      <UploadButton onChange={onChange} isUploading={false} />
    )

    getByText('Upload Image')
  })

  it('should render the upload button with "Uploading..." text when isUploading is true', () => {
    const onChange = vi.fn()
    const { getByText } = render(
      <UploadButton onChange={onChange} isUploading={true} />
    )

    getByText('Uploading...')
  })

  it('should trigger onChange when a file is selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { getByRole } = render(
      <UploadButton onChange={onChange} isUploading={false} />
    )

    const button = getByRole('button')
    const input = getByRole('hidden-input')
    await user.click(button)

    await user.upload(
      input,
      new File(['image'], 'image.png', { type: 'image/png' })
    )

    expect(onChange).toHaveBeenCalled()
  })

  it('should disable the button while uploading', () => {
    const onChange = vi.fn()
    const { getByText } = render(
      <UploadButton onChange={onChange} isUploading={true} />
    )

    const button = getByText('Uploading...')
    expect(button.getAttribute('disabled')).not.toBeNull()
  })

  it('should not trigger onChange when the button is clicked while isUploading is true', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { getByText } = render(
      <UploadButton onChange={onChange} isUploading={true} />
    )

    const button = getByText('Uploading...')
    await user.click(button)

    expect(onChange).not.toHaveBeenCalled()
  })
})
