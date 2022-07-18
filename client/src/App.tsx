/* eslint-disable tailwindcss/no-custom-classname */
import ProposalView from './views/ProposalsView'
import MemoizedGlobalInfo from 'components/GlobalInfo/GlobalInfo'
import OwnerControl from 'views/OwnerControlView'
import Header from 'components/Header/Header'
import ErrorBoundary from 'utils/ErrorBoundary'
import Navigation from 'components/Navigation/Navigation'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import VoterView from 'views/VotersView'
import NotConnectedInfo from 'components/NotConnectedInfo/NotConnectedInfo'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { actions, useEth } from 'context'
import useStatus from 'hooks/use-status'
import useProposals from 'hooks/use-proposal'
import useUser from 'hooks/use-user'
import { toast, ToastContainer } from 'react-toastify'
import { getStatusIdByFunction, networks } from 'utils'
import 'App.css'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import useEvent from 'hooks/use-event'
import BN from 'bn.js'
import useVoters from 'hooks/use-voters'

// TODO: Verifier toutes les actions qui pourraient revert
// TODO: Verifier les deconnection de compte

function App() {
  const {
    state: { accounts, chainId, web3, contract },
    dispatch
  } = useEth()
  const [events, setEvents] = useState(false)

  const [loading, setLoading] = useState(true)
  const networkEnv = import.meta.env.VITE_APP_NETWORK as string
  const { getRole, isVoter, isOwner, userInfo } = useUser()
  const { getVoters } = useVoters()
  const { status } = useStatus()

  const { getProposals } = useProposals()
  const [wrongNetwork, setWrongNetwork] = useState(false)
  const isConnected = accounts && accounts.length > 0
  const isReady = isConnected && status
  const isPropRegistration =
    status &&
    status?.toNumber() >= getStatusIdByFunction('ProposalsRegistrationStarted')
  const notifyError = (account: string) => toast('You changed your account ')

  useEffect(() => {
    if (contract && window.ethereum && !events) {
      window.ethereum.on('accountsChanged', (accounts) => {
        notifyError(accounts[0])
        getRole()
      })
      contract.events.ProposalRegistered().on('data', (newEvent: any) => {
        console.log('Proposal Registered!')
      })

      contract.events
        .WorkflowStatusChange()
        .on('data', (event: { returnValues: { newStatus: any } }) => {
          const { newStatus } = event.returnValues
          // const newStatus = new BN(newStatus).toNumber()
          toast('Status changed')

          dispatch({
            type: actions.setStatus,
            data: new BN(newStatus)
          })
        })

      contract.events.LogResetVotingSystem().on('data', (newEvent: any) => {
        toast('Voting System Reset!')
      })
      contract.events.Voted().on('data', (newEvent: any) => {
        toast('Your Vote has been recorded!')
      })
      contract.events.VoterRegistered().on('data', (newEvent: any) => {
        toast('Voter Added!')
      })
      setEvents(true)
    }
  }, [contract])

  useEffect(() => {
    if (!status) return
    getRole()
  }, [getRole, status])

  const checkNetwork = useCallback(async () => {
    setWrongNetwork(chainId != networks[networkEnv].chainId)
  }, [chainId, networkEnv])

  useEffect(() => {
    chainId && checkNetwork()
  }, [chainId, checkNetwork])

  useEffect(() => {
    if (isPropRegistration && isVoter) {
      getProposals()
    }
  }, [getProposals, isPropRegistration, isVoter])

  useEffect(() => {
    web3 && setLoading(false)
  }, [setLoading, web3])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastContainer />

        <div className="flex h-screen flex-col items-center overflow-scroll bg-gray-900">
          <div className="w-full">
            <Header />
          </div>
          {!isConnected && (
            <div className="-mt-28 w-2/3">
              <NotConnectedInfo />
            </div>
          )}
          {wrongNetwork && (
            <div className="alert alert-error mt-8 w-5/6 shadow-lg">
              <div>
                <ExclamationCircleIcon width={30} />
                <span>Wrong Network</span>
              </div>
            </div>
          )}
          {!isVoter && !isOwner && (
            <div className="alert alert-error mt-8 w-5/6 shadow-lg">
              <div>
                <ExclamationCircleIcon width={30} />
                <span>You're not registered</span>
              </div>
            </div>
          )}
          {isReady && !wrongNetwork && (isVoter || isOwner) && (
            <Fragment>
              <div className="-mt-28 w-2/3">
                <MemoizedGlobalInfo />
              </div>
              <div className="mt-10">
                <Navigation isOwner={isOwner} isVoter={isVoter} />
              </div>

              <div className="h-full w-2/3">
                <Routes>
                  <Route index element={<ProposalView status={status} />} />
                  <Route
                    path="proposals"
                    element={<ProposalView status={status} />}
                  />
                  <Route
                    path="voter"
                    element={<VoterView userInfo={userInfo} />}
                  />
                  <Route path="owner" element={<OwnerControl />} />
                </Routes>
              </div>
            </Fragment>
          )}
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App

// TODO: Add User info -> voted proposal, created proposal etc.

// ownership
// Voter
// Not alloawed to vote
