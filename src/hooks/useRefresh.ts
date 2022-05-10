import { useContext } from 'react'
import { RefreshContext } from 'contexts/RefreshContext'

const useRefresh = () => {
  // const { fast, slow, block } = useContext(RefreshContext)
  // return { fastRefresh: fast, slowRefresh: slow, blockRefresh: block }
  const { fast, slow } = useContext(RefreshContext)
  return { fastRefresh: fast, slowRefresh: slow }
}

export default useRefresh
