import BN from 'bn.js'
import { actions } from 'context'

export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ')
}

export const votingStatus = [
  {
    function: 'RegisteringVoters',
    label: 'Registering Voters',
    action: 'Register Voters'
  },
  {
    function: 'ProposalsRegistrationStarted',
    label: 'Proposals Registration Started',
    action: 'Start Proposals Registration'
  },
  {
    function: 'ProposalsRegistrationEnded',
    label: 'Proposals Registration Ended',
    action: 'End Proposals Registration'
  },
  {
    function: 'VotingSessionStarted',
    label: 'Voting Session Started',
    action: 'Start Voting'
  },
  {
    function: 'VotingSessionEnded',
    label: 'Voting Session Ended',
    action: 'End Voting'
  },
  { function: 'VotesTallied', label: 'Votes Tallied', action: 'Tally Votes' }
]

export const getStatusFuncById = (id: BN) => {
  const status = votingStatus[id.toNumber()]
  return status.function
}

export const getStatusLabelById = (id: BN) => {
  const status = votingStatus[id.toNumber()]
  return status.label
}

export const getStatusActionById = (id: BN) => {
  const status = votingStatus[id.toNumber()]
  return status?.action || null
}

export const getStatusIdByFunction = (functionName: string) => {
  const index = votingStatus.findIndex((s) => s.function === functionName)
  return index
}
