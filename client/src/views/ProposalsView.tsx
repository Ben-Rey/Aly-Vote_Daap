/* eslint-disable tailwindcss/no-custom-classname */
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { IProposal } from 'models/IProposal'
import { Spinner } from 'components/Spinner/Spinner'
import { toast } from 'react-toastify'
import BN from 'bn.js'
import ModalNewProp from 'components/ModalNewProp/ModalNewProp'
import Proposal from 'components/Proposal/Proposal'
import useEvent from 'hooks/use-event'
import useProposals from 'hooks/use-proposal'
import useVote from 'hooks/use-vote'
import { getStatusIdByFunction } from 'utils'

const ProposalView = ({ status }: { status: BN }) => {
  const { addProposal, proposals, winningProposalId } = useProposals()
  const { vote } = useVote()

  // custom hook ?
  const votingStarted =
    status?.toNumber() === getStatusIdByFunction('VotingSessionStarted')

  const proposalRegistrationStarted =
    status?.toNumber() >= getStatusIdByFunction('ProposalsRegistrationStarted')

  const proposalsRegistrationEnded =
    status?.toNumber() >= getStatusIdByFunction('ProposalsRegistrationEnded')

  const votesTallied =
    status?.toNumber() >= getStatusIdByFunction('VotesTallied')

  const addNewProposal = async (text: string) => {
    await addProposal(text)
  }

  if (!proposalRegistrationStarted)
    return (
      <div className="alert alert-warning mt-8 shadow-lg">
        <div>
          <ExclamationCircleIcon width={30} />
          <span>The voting session will soon be launched</span>
        </div>
      </div>
    )

  if (!proposals)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    )

  // if (getPropStatus === 'error') return <div>Something went wrong</div>

  // if (getPropStatus === 'success')
  if (proposalRegistrationStarted)
    return (
      <div className="mb-6 h-full rounded-xl pb-10 shadow-md">
        <ModalNewProp onAdd={addNewProposal} />
        <div className="w-full ">
          {votesTallied && winningProposalId && proposals.length > 0 && (
            <>
              <span className="text-xl font-bold text-gray-200">
                Winning Proposals
              </span>
              <Proposal
                index={winningProposalId.toNumber()}
                content={proposals[winningProposalId.toNumber()].description}
                voteCount={proposals[winningProposalId.toNumber()].voteCount}
                buttonTitle="Vote"
                vote={vote}
                showVoteNumber
                isWinner
              />
            </>
          )}
        </div>

        <div className="mt-5 flex justify-between">
          <span className="text-xl font-bold text-gray-200">Proposals</span>
          {proposalsRegistrationEnded ? (
            <span className=" rounded-full bg-gray-700 p-3 text-xs text-white">
              Proposal Registartion Ended
            </span>
          ) : (
            <label htmlFor="new-prop-modal" className="modal-button btn">
              Add Proposal
            </label>
          )}
        </div>

        {proposals.length === 0 && (
          <div className=" text-white">No Proposal Yet</div>
        )}

        {proposals.map((content: IProposal, index: number) => {
          if (winningProposalId && winningProposalId.toNumber() === index)
            return
          return (
            <Proposal
              key={index}
              index={index}
              content={content.description}
              voteCount={content.voteCount}
              buttonTitle="Vote"
              votingStarted={votingStarted}
              showVoteNumber={votesTallied}
              vote={vote}
            />
          )
        })}
      </div>
    )
  else return <></>
}

export default ProposalView
