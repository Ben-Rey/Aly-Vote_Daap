import { useCallback } from 'react'
import { toast } from 'react-toastify'
import useEth from '../context/useEth'
import useEvent from './use-event'
import IUser from '../models/IUser'
import useUser from './use-user'

const useVoters = () => {
  const {
    state: { status, contract, accounts, voters, lastSessionBlock },
    dispatch
  } = useEth()

  const { getRole } = useUser()

  const getVoters = useCallback(async () => {
    if (status && accounts) {
      const option = {
        // filter: { myIndexedParam: [20, 23] }, // Using an array means OR: e.g. 20 or 23
        fromBlock: lastSessionBlock,
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
  }, [status, accounts, lastSessionBlock, contract, dispatch])

  // useEvent('VoterRegistered', () => {
  //   console.log('Voter Added!')
  // })
  // INPROGRESS: Add voter
  const addVoter = async (address: string) => {
    // check if already registered

    if (status && accounts) {
      if (status?.toNumber() > 0) return

      const voter = await contract.methods
        .getVoter(address)
        .call({ from: accounts[0] })

      if (voter.isRegistered) {
        toast('Voter already registered!')

        return
      }

      const res = await contract.methods.addVoter(address).send({
        from: accounts[0]
      })
      getVoters()
      getRole()
      toast('Voter Added!')

      // TODO: Get revert
    }
  }

  return { addVoter, getVoters, voters }
}

export default useVoters
