import IUser from 'models/IUser'

const VoterView = ({ userInfo }: { userInfo: IUser }) => {
  return (
    <div className="mt-4">
      <div className="image-full card w-96 bg-base-100 shadow-xl">
        <figure>
          <img src="https://placeimg.com/400/225/arch" alt="Shoes" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Address</h2>
          <p>Voted Propsal {userInfo && userInfo.votedProposalId}</p>
          {/* <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default VoterView
