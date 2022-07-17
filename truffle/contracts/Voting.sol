// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/// @title Alyra Voting Contract
/// @author Benjamin Reynes benjmain@morio.co
contract Voting is Ownable {
    uint256 public winningProposalID;
    uint256 public lastSessionBlock = block.number;
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
    address[] votersAddressArray;
    mapping(address => Voter) voters;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint256 proposalId);
    event Voted(address voter, uint256 proposalId);
    event LogWithdraw(address user, uint256 amount);
    event LogReceive(address user, uint quantity);
    event LogFallback(address user);
    event LogResetVotingSystem();


    /**
     * @notice Allows to verify if it's a voter or the Owner
     */
    modifier onlyVotersOrOwner() {
        require(voters[msg.sender].isRegistered || msg.sender == owner(),  "You're not a voter");
        _;
    }

    /**
     * @notice Allows to verify if it's a voter or not.
     */
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered,  "You're not a voter");
        _;
    }

    /**
     * @notice Allows to verify if we are in the right status
     */
    modifier inStatus(WorkflowStatus _status) {
        require(workflowStatus == _status, "Action not allowed in this status");
        _;
    }

    /**
     * @notice Allows contract to receive Ethers (Security)
     *
     * @dev Emit an event if ethers are sent to the contract.
     */
    receive() external payable {
        emit LogReceive(msg.sender, msg.value);
    }

    /**
     * @notice Allows to handle bad calls (Security)
     *
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
        (bool success, ) = msg.sender.call{value: amount}("");
        if (success) {
            emit LogWithdraw(msg.sender, amount);
        }

    }

    // ::::::::::::: GETTERS ::::::::::::: //

    /**
    * @notice getVoter Function, returns the voter object.
    *
    * @dev Only Registered Voters can access this fuction.
    *
    * @param _addr the address of the desired voter.
    */
    function getVoter(address _addr)
        external
        view
        onlyVotersOrOwner
        returns (Voter memory)
    {
        return voters[_addr];
    }

    /**
    * @notice getProposal Function, returns the proposal object.
    *
    * @dev Only Registered Voters can access this fuction.
    *
    * @param _id the id of the desired proposal.
    */
    function getOneProposal(uint256 _id)
        external
        view
        onlyVoters
        returns (Proposal memory)
    {
        return proposalsArray[_id];
    }

    // ::::::::::::: REGISTRATION ::::::::::::: //
    /**
    * @notice addVoter Function, registers a voter. Only the owner of the contract can register a voter.
    *
    * @dev Emit an event on success.
    *
    * @param _addr the address of the voter.
    */
    function addVoter(address _addr) external onlyOwner inStatus(WorkflowStatus.RegisteringVoters) {

        require(voters[_addr].isRegistered != true, "Already registered");

        votersAddressArray.push(_addr);
        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    // ::::::::::::: PROPOSAL ::::::::::::: //

    /**
    * @notice addProposal Function, registers a proposal. Only the owner of the contract can register a proposal
    *
    * @dev Emit an event on success.
    *
    * @param _desc the description of the proposal.
    */
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
    /**
    * @notice setVote Function, votes for a proposal. Only Registered Voters can access this fuction.
    *
    * @dev Emit an event on success.
    *
    * @param _id the id of the proposal to vote for.
    */
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
    * @notice nextStatus Function, change to the next status. Only the owner of the contract can change the status
    *
    * @dev Emit an event on success, revert if status equal to five
    */
    function nextStatus() external onlyOwner {
        require(uint256(workflowStatus) < 5, "No status left");

        WorkflowStatus prevStatus = workflowStatus;
        workflowStatus = WorkflowStatus(uint256(workflowStatus) + 1);
        emit WorkflowStatusChange(prevStatus, workflowStatus);
    }

    /**
    * @notice Reset the voting system
    *
    * @dev Emit an event on success, reset workflowStatus, proposalsArray, winningProposalID, voters
    */
    function resetVotingSystem() external onlyOwner inStatus(WorkflowStatus.VotesTallied) {
        for (uint i = 0; i < votersAddressArray.length; i++) {
            delete voters[votersAddressArray[i]];
        }
        workflowStatus = WorkflowStatus(0);
        delete proposalsArray;
        delete winningProposalID;
        lastSessionBlock = block.number;
        emit LogResetVotingSystem();
    }
}
