import React, { useReducer, useCallback, useEffect } from 'react'
import Web3 from 'web3'
import EthContext from './EthContext'
import { reducer, actions, initialState } from './state'

const CHAIN_ID = 1337
const CHAIN_ID_HEX = CHAIN_ID.toString(16)

// Erreur si pas metamask
function EthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const checkNetwork = useCallback(async (web3: any) => {
    const ChainId = await web3.eth.getChainId()
    if (ChainId !== CHAIN_ID) {
      try {
        await web3.eth.net.getNetworkType()
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${CHAIN_ID_HEX}` }]
        })
      } catch (e) {
        return
      }
    }
  }, [])

  const init = useCallback(
    async (artifact: any) => {
      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545')
        let accounts: string[] = []
        if (window.ethereum.isConnected())
          accounts = await web3.eth.requestAccounts()
        const networkID = await web3.eth.net.getId()
        const { abi } = artifact
        let address, contract, lastSessionBlock
        // Switch network ID
        checkNetwork(web3)
        try {
          address = artifact.networks[networkID].address
          contract = new web3.eth.Contract(abi, address)
          lastSessionBlock = await contract.methods
            .lastSessionBlock()
            .call({ from: accounts[0] })
        } catch (err) {
          console.error(err)
          console.error('contract not deployed')
        }
        dispatch({
          type: actions.init,
          data: {
            artifact,
            web3,
            accounts,
            networkID,
            contract,
            lastSessionBlock
          }
        })
      }
    },
    [checkNetwork]
  )

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = await import('../contracts/Voting.json')
        init(artifact)
      } catch (err) {
        console.error(err)
      }
    }

    tryInit()
  }, [init])

  useEffect(() => {
    const events = ['chainChanged', 'accountsChanged']
    const handleChange = () => {
      init(state.artifact)
    }

    events.forEach((e) => window.ethereum.on(e, handleChange))
    return () => {
      events.forEach((e) => window.ethereum.removeListener(e, handleChange))
    }
  }, [init, state.artifact])

  return (
    <EthContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      {children}
    </EthContext.Provider>
  )
}

export default EthProvider