import BN from 'bn.js'

const actions = {
  init: 'INIT',
  setAccounts: 'SET_ACCOUNTS',
  setStatus: 'SET_STATUS',
  setProposals: 'SET_PROPOSALS',
  setWinningProposalId: 'SET_WINNIG_PROPOSAL_ID',
  registerEvent: 'REGISTER_EVENT',
  setUserInfo: 'SET_USER_INFO',
  setVoters: 'SET_VOTERS'
}

const initialState = {
  artifact: null,
  web3: null,
  accounts: null,
  networkID: null,
  contract: null,
  status: null,
  proposals: [],
  winningProposalId: null,
  events: [],
  userInfo: null,
  voters: null
}

const reducer = (state: any, action: { type: string; data: any }) => {
  const { type, data } = action
  switch (type) {
    case actions.init:
      return { ...state, ...data }
    case actions.setStatus:
      return { ...state, status: new BN(parseInt(data), 2) }
    case actions.setAccounts:
      return { ...state, accounts: data }
    case actions.setProposals:
      return { ...state, proposals: data }
    case actions.setWinningProposalId:
      return { ...state, winningProposalId: data }
    case actions.registerEvent:
      return { ...state, events: state.events.concat(data) }
    case actions.setUserInfo:
      return { ...state, userInfo: data }
    case actions.setVoters:
      return { ...state, voters: data }

    default:
      throw new Error('Undefined reducer action type')
  }
}

export { actions, initialState, reducer }
