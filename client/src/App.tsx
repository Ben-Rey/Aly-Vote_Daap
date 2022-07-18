/* eslint-disable react/no-unescaped-entities */
/* eslint-disable tailwindcss/no-custom-classname */
import useUser from 'hooks/use-user'
import VoterView from 'views/VotersView'
import useStatus from 'hooks/use-status'
import { useEth } from 'context'
import Header from 'components/Header/Header'
import useProposals from 'hooks/use-proposal'
import ErrorBoundary from 'utils/ErrorBoundary'
import ProposalView from './views/ProposalsView'
import OwnerControl from 'views/OwnerControlView'
import { ToastContainer } from 'react-toastify'
import { getStatusIdByFunction, networks } from 'utils'
import Navigation from 'components/Navigation/Navigation'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MemoizedGlobalInfo from 'components/GlobalInfo/GlobalInfo'
import { Fragment, useCallback, useEffect, useState } from 'react'
import NotConnectedInfo from 'components/NotConnectedInfo/NotConnectedInfo'
import 'App.css'

function App() {
  const {
    state: { accounts, chainId }
  } = useEth()

  const networkEnv = import.meta.env.VITE_APP_NETWORK as string
  const { getRole, isVoter, isOwner, userInfo } = useUser()
  const { status } = useStatus()
  const { getProposals } = useProposals()
  const [wrongNetwork, setWrongNetwork] = useState(false)
  const isConnected = accounts && accounts.length > 0
  const isReady = isConnected && status
  const isPropRegistration =
    status &&
    status?.toNumber() >= getStatusIdByFunction('ProposalsRegistrationStarted')

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

// if (contract && window.ethereum && !events) {
//   window.ethereum.on('accountsChanged', (_accounts) => {
//     notifyError(_accounts[0])
//     getRole()
//   })

// }
