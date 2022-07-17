import BN from 'bn.js'

export interface IProposalProps {
  vote: (id: BN) => void
  index: number
  content: string
  voteCount: string
  buttonTitle: string
  votingStarted?: boolean
  showVoteNumber: boolean
  isWinner?: boolean
}
