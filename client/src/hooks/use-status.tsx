import { actions } from 'context'
import { useCallback, useEffect, useState } from 'react'
import useEth from '../context/useEth'
import useVoters from 'hooks/use-voters'

const useStatus = () => {
  const {
    state: { status, contract, accounts },
    dispatch
  } = useEth()
  const [statusLoading, setStatusLoading] = useState(false)

  const { getVoters } = useVoters()

  const restVotingSystem = useCallback(async () => {
    if (contract && accounts) {
      await contract.methods.resetVotingSystem().send({ from: accounts[0] })

      dispatch({
        type: actions.reset,
        data: null
      })
      dispatch({ type: 'SET_VOTERS', data: [] })
    }
  }, [contract, accounts, dispatch, getVoters])

  const reloadStatus = useCallback(async () => {
    if (contract && accounts) {
      try {
        const res = await contract.methods
          .workflowStatus()
          .call({ from: accounts[0] })

        dispatch({
          type: actions.setStatus,
          data: res
        })
      } catch (error) {
        console.error(error)
      }
    }
  }, [contract, accounts, dispatch])

  useEffect(() => {
    if (!status && contract) {
      reloadStatus()
    }
  }, [status, reloadStatus, contract, dispatch])

  const nextStatus = async () => {
    if (status && accounts) {
      if (status?.toNumber() >= 5) return

      try {
        setStatusLoading(true)
        await contract.methods.nextStatus().send({
          from: accounts[0]
        })
      } catch (error) {
        console.error(error)
      }
      setStatusLoading(false)
    }
  }

  return { status, reloadStatus, nextStatus, statusLoading, restVotingSystem }
}

export default useStatus
