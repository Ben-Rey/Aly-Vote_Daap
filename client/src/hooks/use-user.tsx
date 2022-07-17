import { useCallback, useState } from 'react'
import useEth from '../context/useEth'

const useUser = () => {
  const {
    state: { contract, accounts, userInfo },
    dispatch
  } = useEth()

  const [isVoter, setIsVoter] = useState<boolean>(false)
  const [isOwner, setIsOwner] = useState<boolean>(false)

  const getRole = useCallback(async () => {
    if (contract && accounts) {
      try {
        const res = await contract.methods
          .getVoter(accounts[0])
          .call({ from: accounts[0] })
        // TODO: Reset sattus if account change
        setIsVoter(res.isRegistered)
        dispatch({ type: 'SET_USER_INFO', data: res })
      } catch (err) {
        // console.error(err)
      }

      // TODO: Store owner
      const owner = await contract.methods.owner().call()
      setIsOwner(owner === accounts[0])
    }
  }, [contract, accounts])

  return { userInfo, isVoter, isOwner, getRole }
}

export default useUser
