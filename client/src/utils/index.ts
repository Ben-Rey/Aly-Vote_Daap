import BN from 'bn.js'

export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ')
}

export const votingStatus = [
  {
    function: 'RegisteringVoters',
    label: 'Registering Voters',
    action: 'Register Voters',
    percent: 0
  },
  {
    function: 'ProposalsRegistrationStarted',
    label: 'Proposals Registration Started',
    action: 'Start Proposals Registration',
    percent: 20
  },
  {
    function: 'ProposalsRegistrationEnded',
    label: 'Proposals Registration Ended',
    action: 'End Proposals Registration',
    percent: 40
  },
  {
    function: 'VotingSessionStarted',
    label: 'Voting Session Started',
    action: 'Start Voting',
    percent: 60
  },
  {
    function: 'VotingSessionEnded',
    label: 'Voting Session Ended',
    action: 'End Voting',
    percent: 80
  },

  {
    function: 'VotesTallied',
    label: 'Votes Tallied',
    action: 'Tally Votes',
    percent: 100
  }
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
