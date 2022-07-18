import IUser from 'models/IUser'
import ModalProposalDescription from 'components/ModalProposalDescription/ModalProposalDescription'
import useProposals from 'hooks/use-proposal'

const Voter = ({ voter }: { voter: IUser }) => {
  const { proposals } = useProposals()

  return (
    <div className="my-4 flex flex-col space-y-2 rounded-md bg-slate-100 p-4">
      <p>
        <span className=" font-semibold">Address: </span>
        <span> {voter.address}</span>
      </p>

      <div className="flex items-center space-x-2">
        <span className=" font-semibold">Voted Proposal: </span>
        <span>
          {voter.hasVoted ? (
            <div>
              <ModalProposalDescription
                proposal={proposals[voter.votedProposalId]}
                votedProposalId={voter.votedProposalId}
              />
              <label
                htmlFor={`prop-desc-modal-${voter.votedProposalId}`}
                className=" flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-gray-700 p-3 text-xs text-white hover:brightness-125"
              >
                {voter.votedProposalId}
              </label>
            </div>
          ) : (
            'Has not voted yet'
          )}
        </span>
      </div>
    </div>
  )
}

export default Voter
