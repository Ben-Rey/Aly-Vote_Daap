/* eslint-disable @typescript-eslint/no-explicit-any */
import BN from 'bn.js'
import IUser from 'models/IUser'
import { createContext, Dispatch } from 'react'
interface IEthContext {
  state: {
    accounts: string[] | null
    artifact: Promise<any> | null
    contract: any | null
    networkID: number | null
    web3: any | null
    status: BN | null
    proposals: any
    winningProposalId: BN | null
    events: string[]
    userInfo: any | null
    voters: IUser[] | null
    lastSessionBlock: BN | null
  }
  dispatch: Dispatch<{ type: string; data: any }>
}

const EthContext = createContext<IEthContext>({
  state: {
    accounts: [],
    artifact: null,
    contract: null,
    networkID: null,
    web3: null,
    status: null,
    proposals: [],
    winningProposalId: null,
    events: [],
    voters: null,
    userInfo: null,
    lastSessionBlock: new BN(0)
  },
  dispatch: () => console.log('Test')
})

export default EthContext
