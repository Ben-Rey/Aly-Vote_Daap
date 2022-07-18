import useEth from '../context/useEth'
import useProposals from './use-proposal'
import BN from 'bn.js'
import { toast } from 'react-toastify'
import { getStatusIdByFunction } from 'utils'
import useEvent from './use-event'
import useVoters from './use-voters'

const useVote = () => {
  const {
    state: { status, contract, accounts }
  } = useEth()
  const { getProposals } = useProposals()
  const { getVoters } = useVoters()

  // useEvent('Voted', () => {
  //   toast('Your Vote has been recorded!')
  // })

  // INPROGRESS: Add voter
  const vote = async (id: BN) => {
    // check if already voted
    if (status && accounts) {
      const voter = await contract.methods
        .getVoter(accounts[0])
        .call({ from: accounts[0] })
      if (voter.hasVoted) {
        toast('You have already voted')
        return
      }

      if (status?.toNumber() !== getStatusIdByFunction('VotingSessionStarted'))
        return

      const res = await contract.methods.setVote(id).send({
        from: accounts[0]
      })

      getProposals()
      getVoters()
      // TODO: Get revert
    }
  }

  return { vote }
}

export default useVote
