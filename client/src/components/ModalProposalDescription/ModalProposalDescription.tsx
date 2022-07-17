/* eslint-disable tailwindcss/no-custom-classname */
import { IProposal } from 'models/IProposal'

const ModalProposalDescription = ({
  proposal,
  votedProposalId
}: {
  proposal: IProposal
  votedProposalId: string
}) => {
  return (
    <div>
      <input
        type="checkbox"
        id={`prop-desc-modal-${votedProposalId}`}
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor={`prop-desc-modal-${votedProposalId}`}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Proposal Description</h3>
          <p className="py-4">
            <span className=" font-semibold">Vote count: </span>
            {proposal.voteCount}
          </p>
          <p className="">
            <span className=" font-semibold">Description:</span>
            {proposal.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ModalProposalDescription
