// https://vike.dev/onBeforeRender
import { QueryClient, dehydrate, hashKey } from '@tanstack/react-query'
import type { OnBeforeRenderAsync } from 'vike/types'
import useQueriesState from '#stores/queriesState.js'

export { onBeforeRender }

const onBeforeRender: OnBeforeRenderAsync = async (
  pageContext,
): ReturnType<OnBeforeRenderAsync> => {
  const { prefetchQuery } = pageContext.config // prefetchQuery is exported from file +prefetchQuery.ts
  const knownQueries = useQueriesState.getState().knownQueries
  const hashedQueryKey = hashKey(prefetchQuery?.queryKey)

  if (prefetchQuery && !knownQueries.get(hashedQueryKey)) {
    // This condition is true if a page (doesn't has local onBeforeRender) exports prefetchQuery & has never been cached in the client's queryClient
    await sleep(2000)
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: 50000,
        },
      },
    })

    await queryClient.prefetchQuery(prefetchQuery)

    const dehydratedState = dehydrate(queryClient)

    return {
      pageContext: {
        dehydratedState,
      },
    }
  }
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((r) => setTimeout(r, milliseconds))
}
