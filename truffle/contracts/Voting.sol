// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/// @title Alyra Voting Contract
/// @author Benjamin Reynes => benjmain@morio.co
contract Voting is Ownable {
    uint256 public winningProposalID;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
    }

    struct Proposal {
        string description;
        uint256 voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping(address => Voter) voters;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint256 proposalId);
    event Voted(address voter, uint256 proposalId);
    event LogReceive(address user, uint quantity);
    event LogFallback(address user);

    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    modifier inStatus(WorkflowStatus _status) {
        require(workflowStatus == _status, "Action not allowed in this status");
        _;
    }

    // on peut faire un modifier pour les états
    /**
     * @dev Emit an event if ethers are sent to the contract.
     */
    receive() external payable {
        emit LogReceive(msg.sender, msg.value);
    }

    /**
     * @dev Emit event if bad call.
     */
    fallback() external {
        emit LogFallback(msg.sender);
    }

    /**
    * @notice withdraw function. Can only be used by the owner of the contract.
    *
    * @dev withdraw function. OnlyOwner.
    *
    * @param amount the amount to withdraw.
    */
    function withdraw(uint amount) external onlyOwner {
        msg.sender.call{value: amount}("");
    }

    // ::::::::::::: GETTERS ::::::::::::: //

    function getVoter(address _addr)
        external
        view
        onlyVoters
        returns (Voter memory)
    {
        return voters[_addr];
    }

    function getOneProposal(uint256 _id)
        external
        view
        onlyVoters
        returns (Proposal memory)
    {
        return proposalsArray[_id];
    }

    function getProposals()
        external
        view
        onlyVoters
        returns (Proposal[] memory)
    {
        return proposalsArray;
    }
    // ::::::::::::: REGISTRATION ::::::::::::: //

    function addVoter(address _addr) external onlyOwner inStatus(WorkflowStatus.RegisteringVoters) {

        require(voters[_addr].isRegistered != true, "Already registered");

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    // ::::::::::::: PROPOSAL ::::::::::::: //


    function addProposal(string memory _desc) external onlyVoters inStatus(WorkflowStatus.ProposalsRegistrationStarted) {

        require(
            keccak256(abi.encode(_desc)) != keccak256(abi.encode("")),
            "Vous ne pouvez pas ne rien proposer"
        ); // facultatif
        // voir que desc est different des autres
        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length - 1);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    function setVote(uint256 _id) external onlyVoters inStatus(WorkflowStatus.VotingSessionStarted) {

        require(voters[msg.sender].hasVoted != true, "You have already voted");
        require(_id < proposalsArray.length, "Proposal not found"); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;
        // Prevent ddos arttack by avoiding to calculate with a loop
        if (proposalsArray[_id].voteCount > proposalsArray[winningProposalID].voteCount) {
            winningProposalID = _id;
        }
        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //
    
    /**
     * @notice Change the status to the next 
     * @dev Only owner function
     */
    function nextStatus() external onlyOwner {
        require(uint256(workflowStatus) < 5, "No status left");

        WorkflowStatus prevStatus = workflowStatus;
        workflowStatus = WorkflowStatus(uint256(workflowStatus) + 1);
        emit WorkflowStatusChange(prevStatus, workflowStatus);
    }
}
