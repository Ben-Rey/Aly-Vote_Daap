import BN from 'bn.js'
import { actions } from 'context'
import { useCallback, useEffect } from 'react'
import useEth from '../context/useEth'
import useEvent from './use-event'

// const options = {
//   fromBlock: 0,
//   address: ['address-1', 'address-2'], //Only get events from specific addresses
//   topics: [] //What topics to subscribe to
// }

const useStatus = () => {
  const {
    state: { status, contract, accounts },
    dispatch
  } = useEth()

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
        await contract.methods.nextStatus().send({
          from: accounts[0]
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  return { status, reloadStatus, nextStatus }
}

export default useStatus
