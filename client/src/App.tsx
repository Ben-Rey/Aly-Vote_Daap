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
import { Fragment, useEffect } from 'react'
import { useEth } from 'context'
import useStatus from 'hooks/use-status'
import useProposals from 'hooks/use-proposal'
import useUser from 'hooks/use-user'
import { ToastContainer } from 'react-toastify'
import { getStatusIdByFunction } from 'utils'
import 'App.css'

// TODO: Verifier toutes les actions qui pourraient revert
// TODO: Verifier les deconnection de compte

function App() {
  const {
    state: { accounts }
  } = useEth()

  const { getRole, isVoter, isOwner, userInfo } = useUser()
  const { status } = useStatus()
  const { getProposals } = useProposals()

  const isPropRegistration =
    status &&
    status?.toNumber() >= getStatusIdByFunction('ProposalsRegistrationStarted')

  useEffect(() => {
    if (!status) return
    getRole()
  }, [getRole, status])

  useEffect(() => {
    if (isPropRegistration && isVoter) {
      getProposals()
    }
  }, [getProposals, isPropRegistration, isVoter])

  const isConnected = accounts && accounts.length > 0
  const isReady = isConnected && status

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
          {isReady && (
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
