import { toast } from 'react-toastify'
import { useCallback, useEffect } from 'react'
import BN from 'bn.js'
import useEth from '../context/useEth'
import useEvent from './use-event'
import { getStatusFuncById } from '../utils/index'

// TODO: Proposal Interface

const useProposals = () => {
  const {
    state: {
      status,
      contract,
      accounts,
      proposals,
      winningProposalId,
      lastSessionBlock
    },
    dispatch
  } = useEth()

  useEvent('ProposalRegistered', () => toast('Proposal Added!'))

  const getProposals = useCallback(async () => {
    if (status && accounts) {
      const option = {
        // filter: { myIndexedParam: [20, 23] }, // Using an array means OR: e.g. 20 or 23
        fromBlock: lastSessionBlock,
        toBlock: 'latest'
      }
      const pastEvents = await contract.getPastEvents(
        'ProposalRegistered',
        option
      )

      const data = []
      for (const { returnValues } of pastEvents) {
        const { proposalId } = returnValues
        const { description, voteCount } = await contract.methods
          .getOneProposal(proposalId)
          .call({ from: accounts[0] })
        data.push({ description, voteCount })
      }
      dispatch({ type: 'SET_PROPOSALS', data })
    }
  }, [status, accounts, contract, dispatch])

  // useEffect(() => {
  //   getProposals()
  // }, [getProposals])

  const addProposal = async (proposal: string) => {
    if (status && accounts) {
      // TODO: Make it more clear
      if (status?.toNumber() > 1) return

      const res = await contract.methods.addProposal(proposal).send({
        from: accounts[0]
      })

      getProposals()
    }
  }

  const getWinner = useCallback(
    async (account: string) => {
      const id = await contract.methods.winningProposalID().call({
        from: account
      })
      dispatch({ type: 'SET_WINNIG_PROPOSAL_ID', data: new BN(id) })
    },
    [contract, dispatch]
  )

  useEffect(() => {
    const votesTallied = status && getStatusFuncById(status) === 'VotesTallied'

    if (votesTallied && !winningProposalId) {
      accounts && getWinner(accounts[0])
    }
  }, [getWinner, status, winningProposalId, accounts, contract])

  return { addProposal, getProposals, proposals, winningProposalId }
}

export default useProposals
