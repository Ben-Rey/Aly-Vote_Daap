import { useCallback } from 'react'
import { toast } from 'react-toastify'
import useEth from '../context/useEth'
import useEvent from './use-event'
import IUser from '../models/IUser'

const useVoters = () => {
  const {
    state: { status, contract, accounts, voters },
    dispatch
  } = useEth()

  const getVoters = useCallback(async () => {
    if (status && accounts) {
      const option = {
        // filter: { myIndexedParam: [20, 23] }, // Using an array means OR: e.g. 20 or 23
        fromBlock: 0,
        toBlock: 'latest'
      }
      const pastEvents = await contract.getPastEvents('VoterRegistered', option)

      const data = []
      for (const { returnValues } of pastEvents) {
        const { voterAddress } = returnValues

        const res = (await contract.methods
          .getVoter(voterAddress)
          .call({ from: accounts[0] })) as IUser

        const { hasVoted, votedProposalId } = res
        data.push({ hasVoted, votedProposalId, address: voterAddress })
      }
      dispatch({ type: 'SET_VOTERS', data })
    }
  }, [status, accounts, contract, dispatch])

  useEvent('VoterRegistered', () => {
    getVoters()
    toast('Voter Added!')
  })
  // INPROGRESS: Add voter
  const addVoter = async (address: string) => {
    if (status && accounts) {
      if (status?.toNumber() > 0) return

      const res = await contract.methods.addVoter(address).send({
        from: accounts[0]
      })

      // TODO: Get revert
    }
  }

  return { addVoter, getVoters, voters }
}

export default useVoters
