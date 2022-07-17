import BN from 'bn.js'
import { actions } from 'context'
import { useCallback, useEffect, useState } from 'react'
import useEth from '../context/useEth'
import useEvent from './use-event'
import { toast } from 'react-toastify'

const useStatus = () => {
  const {
    state: { status, contract, accounts },
    dispatch
  } = useEth()
  const [statusLoading, setStatusLoading] = useState(false)

  useEvent(
    'WorkflowStatusChange',
    (event: { returnValues: { newStatus: any } }) => {
      const { newStatus } = event.returnValues
      // const newStatus = new BN(newStatus).toNumber()
      dispatch({
        type: actions.setStatus,
        data: new BN(newStatus)
      })
    }
  )

  useEvent(
    'LogResetVotingSystem',
    (event: { returnValues: { newStatus: any } }) => {
      toast('Voting System Reset!')
    }
  )

  const restVotingSystem = useCallback(async () => {
    if (contract && accounts) {
      await contract.methods.resetVotingSystem().send({ from: accounts[0] })

      dispatch({
        type: actions.reset,
        data: null
      })
    }
  }, [contract, accounts, dispatch])

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
