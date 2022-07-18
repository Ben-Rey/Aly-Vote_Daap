import { Fragment, useEffect } from 'react'
import { getStatusActionById, getStatusFuncById } from 'utils'
import BN from 'bn.js'
import Button from 'components/Button/Button'
import ModalAddVoter from 'components/ModalAddVoter/ModalAddVoter'
import useStatus from '../hooks/use-status'
import useVoters from 'hooks/use-voters'
import { useEth } from 'context'
import Voter from 'components/Voter/Voter'

const OwnerControl = () => {
  const {
    state: { status, voters }
  } = useEth()
  const { nextStatus, statusLoading, restVotingSystem } = useStatus()
  const { addVoter, getVoters } = useVoters()
  // TODO: Check if voter already registered
  const registeringVoters =
    status && getStatusFuncById(status) === 'RegisteringVoters'

  const votingSessionEnded =
    status && getStatusFuncById(status) === 'VotesTallied'

  useEffect(() => {
    if (!voters) {
      getVoters()
    }
  }, [getVoters, registeringVoters, voters])

  return (
    <div>
      <div className="flex flex-col space-x-3">
        <div className=" space-x-3">
          {votingSessionEnded && (
            <button className="btn" onClick={restVotingSystem}>
              reset voting system
            </button>
          )}
          {!votingSessionEnded && (
            <Fragment>
              <h3 className=" p-4 font-bold text-gray-200">Owner Controls</h3>
              <Button
                className=" border-white  text-white hover:bg-white hover:text-black"
                onClick={nextStatus}
                loading={statusLoading}
              >
                <span>
                  {(status && getStatusActionById(status.add(new BN(1)))) || ''}
                </span>
              </Button>
            </Fragment>
          )}
          {registeringVoters && (
            <>
              {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
              <label htmlFor="add-voter-modal" className="modal-button btn">
                Add Voter
              </label>
              <ModalAddVoter onAdd={addVoter} />
            </>
          )}
        </div>
      </div>
      {voters && voters.length > 0 && (
        <Fragment>
          <h3 className=" p-4 font-bold text-gray-200">Voters List</h3>
          <div className="px-4 pb-8">
            {voters.map((voter, i) => (
              <Voter key={i} voter={voter} />
            ))}
          </div>
        </Fragment>
      )}
    </div>
  )
}
export default OwnerControl
