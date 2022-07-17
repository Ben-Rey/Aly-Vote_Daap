import { useEth } from 'context'
import { useCallback, useEffect } from 'react'

const useEvent = (event: string, onSuccessCallback: any) => {
  const {
    state: { contract, events },
    dispatch
  } = useEth()

  const setVoterRegisteredEvent = useCallback(async () => {
    if (contract && event) {
      await contract.events[event]()
        .on('data', (event: any) => {
          onSuccessCallback(event)
        })
        .on('changed', (changed: any) => console.log(changed))
        .on('error', (err: any) => alert(err))

      dispatch({ type: 'REGISTER_EVENT', data: event })
    }
  }, [contract, dispatch, event, onSuccessCallback])

  useEffect(() => {
    if (!events.includes(event)) setVoterRegisteredEvent()
  }, [event, events, setVoterRegisteredEvent])

  return { events }
}
export default useEvent
