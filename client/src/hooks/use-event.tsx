import { useEth } from 'context'
import { useCallback, useEffect, useState } from 'react'

const useEvent = (event: string, onSuccessCallback: any) => {
  const {
    state: { contract, events },
    dispatch
  } = useEth()

  const [listener, setListener] = useState<any>(null)

  const setVoterRegisteredEvent = useCallback(async () => {
    if (contract && event) {
      const emitter = await contract.events[event]()
        .on('data', (newEvent: any) => {
          onSuccessCallback(newEvent)
        })
        .on('changed', (changed: any) => console.log(changed))
        .on('error', (err: any) => alert(err))
      setListener(emitter)

      dispatch({ type: 'REGISTER_EVENT', data: event })
    }
  }, [contract, dispatch, event, onSuccessCallback])

  useEffect(() => {
    if (!events.includes(event)) setVoterRegisteredEvent()
  }, [event, events, listener, setVoterRegisteredEvent])

  return { events }
}
export default useEvent
