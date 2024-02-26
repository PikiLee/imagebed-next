import { ListObjectsV2CommandOutput } from '@aws-sdk/client-s3'

export const getKey = (
  pageIndex: number,
  previousPageData: ListObjectsV2CommandOutput
) => {
  if (previousPageData && !previousPageData.IsTruncated) return null // reached the end
  return {
    pageIndex,
    NextContinuationToken: previousPageData?.NextContinuationToken,
  }
}
