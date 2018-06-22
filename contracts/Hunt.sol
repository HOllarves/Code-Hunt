pragma solidity ^0.4.18;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Hunt is Ownable {
    
    using SafeMath for uint;

    struct Bounty {
        string repoUrl;
        string username;
        uint issueID;
        uint256 prize;
        uint256 duration;
        uint256 createdOn;
        uint256 expiresOn;
        bool finished;
        bool exists;
        bytes32 fixedBy;
    }

    struct Submission {
        bytes32 bountyId;
        uint prId;
        bool accepted;
        bool exists;
    }

    mapping(address => bytes32[]) public bountyCreators;
    mapping(address => bytes32[]) public submissionCreators;
    mapping(bytes32 => Bounty) public bounties;
    mapping(bytes32 => Submission) public submissions;
    mapping(address => uint) public balances;
    mapping(bytes32 => address) private bountyAddresses;
    mapping(bytes32 => address) private submissionAddresses;
    
    bytes32[] public allBounties;
    bytes32[] public allSubmissions;
    
    constructor() public { }

    event fixSubmitted(bytes32 bountyId, bytes32 subId);
    event fixAccepted(bytes32 bountyId, bytes32 subId);
    
    /**
    @dev Creates a new bounty to be solved by the users.
    @param repo Repository URL.
    @param username Github username.
    @param issue Issue ID.
    @param duration Duration in seconds.
    */
    function createBounty(string memory repo, string memory username, uint issue, uint256 duration) public payable returns(bytes32) {
        require(msg.value > 0);
        require(duration > 0);
        bytes32 bountyId = keccak256(abi.encodePacked(username, repo, issue, msg.sender));
        require(bounties[bountyId].exists != true);
        bountyCreators[msg.sender].push(bountyId);
        bounties[bountyId] = Bounty(repo, username, issue, msg.value,  duration, now,  now.add(duration), false, true, 0);
        bountyAddresses[bountyId] = msg.sender;
        allBounties.push(bountyId);
        return bountyId;
    }
    
    /**
    @dev Submits de Pull Request URL of the submission.
    @param bountyId Bounty's unique id.
    @param prId Pull Request's ID.
    */
    function submitHunt(bytes32 bountyId, uint prId) public returns(bytes32) {

        require(bounties[bountyId].exists == true);
        assert(bounties[bountyId].expiresOn > now);
        assert(bounties[bountyId].finished != true);

        bytes32 subId = keccak256(abi.encodePacked(bountyId, prId, msg.sender));
        require(submissions[subId].exists != true);

        submissionCreators[msg.sender].push(subId);
        submissions[subId] = Submission(subId, prId, false, true);
        submissionAddresses[subId] = msg.sender;
        allSubmissions.push(subId);
        
        emit fixSubmitted(bountyId, subId);
        return subId;
    }
    
    /**
    @dev Marks a submission as accepted.
    @param subId Submission's unique id.
    @param bountyId Bounty's unique id.
    */
    function acceptHunt(bytes32 subId, bytes32 bountyId) public returns(bool) {

        assert(submissions[subId].exists == true);
        assert(submissions[subId].accepted != true);
        assert(bounties[bountyId].exists == true);
        assert(bounties[bountyId].expiresOn > now);
        assert(bounties[bountyId].finished != true);

        address owner = bountyAddresses[bountyId];
        assert(msg.sender == owner);
        address submitter = submissionAddresses[subId];

        bounties[bountyId].fixedBy = subId;
        bounties[bountyId].finished = true;
        submissions[subId].accepted = true;
        balances[submitter] += bounties[bountyId].prize;
        emit fixAccepted(bountyId, subId);
        return true;
    }
    
    /**
    @dev Cancels a bounty if not expired or finished.
    @param bountyId Bounty's unique id.
    */
    function cancelBounty(bytes32 bountyId) public returns(bool) {
        address owner = bountyAddresses[bountyId];
        assert(owner == msg.sender);
        require(bounties[bountyId].exists == true);
        assert(bounties[bountyId].finished != true);
        assert(bounties[bountyId].expiresOn > now);
        bounties[bountyId].finished = true;
        balances[msg.sender] += bounties[bountyId].prize;
        return true;
    }
    
    /**
    @dev Checks if a bounty has expired, if so the bounty is finished.
    @param bountyId Bounty's unique id.
    */
    function bountyHasExpired(bytes32 bountyId) public onlyOwner() {
        assert(bounties[bountyId].expiresOn < now);
        bounties[bountyId].finished = true;
    }
    /**
    Returns a list of all bounties post by all addresses.
    */
    function getBounties() public view returns (bytes32[]) {
        return allBounties;
    }

    /**
    @dev Returns a Repo URL
    @param bountyId Bounty's unique id.
    */
    function getBounty(bytes32 bountyId) public view returns 
        (string, string, uint,
        uint, uint, uint, bool) {
    
        assert(bounties[bountyId].exists == true);
        
        return 
        (bounties[bountyId].username, bounties[bountyId].repoUrl, bounties[bountyId].issueID, 
        bounties[bountyId].prize, bounties[bountyId].duration, bounties[bountyId].createdOn,
        bounties[bountyId].finished);
    }
    
    
    /**
    @dev Returns a specificied issue of a registered repository
    @param bountyId Bounty's unique id.
    */
    function getBountyIssue(bytes32 bountyId) public view returns (uint) {
        assert(bounties[bountyId].exists == true);
        assert(bounties[bountyId].expiresOn > now);
        return bounties[bountyId].issueID;
    }
    
    /**
    @dev Returns a specific bounty's reward
    @param bountyId Bounty's unique id.
    */
    function getBountyReward(bytes32 bountyId) public view returns (uint) {
        require(bounties[bountyId].exists == true);
        assert(bounties[bountyId].expiresOn > now);
        return bounties[bountyId].prize;
    }

    /**
    @dev Withdraws user's available funds
     */
    function withdrawFunds() public {
        assert(balances[msg.sender] > 0);
        msg.sender.transfer(balances[msg.sender]);
        balances[msg.sender] = 0;
    }

    function() public payable { }
}
