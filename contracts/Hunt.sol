pragma solidity ^0.4.18;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Hunt is Ownable {
    
    using SafeMath for uint;
  
    address[] public bounties;

    struct Bounty {
        string repoUrl;
        string username;
        uint issueID;
        uint256 prize;
        uint256 duration;
        uint256 createdOn;
        bool finished;
        bool exists;
        address fixedBy;
    }
    struct Submission {
        address clientAddr;
        uint prID;
        bool accepted;
    }

    mapping(address => Bounty) public avBounties;
    mapping(address => Submission) public submissions;
    mapping(address => uint) public balances;
    
    constructor() public { }
    
    event fixSubmitted(address bountyAddr);
    
    event fixAccepted(address bountyAddr, address hunterAddr);
    
    event fixDenied(address bountyAddr);
    
    /**
    @dev Creates a new bounty to be solved by the users
    @param repo Repository URL
    @param issue Issue ID
    @param duration Duration in milliseconds
    */
    function createBounty(string memory repo, string memory username, uint issue, uint256 duration) public payable {
        assert(msg.value > 0);
        assert(duration > 0);
        require(avBounties[msg.sender].exists != true);
        avBounties[msg.sender].repoUrl = repo;
        avBounties[msg.sender].username = username;
        avBounties[msg.sender].issueID = issue;
        avBounties[msg.sender].prize = msg.value;
        avBounties[msg.sender].duration = duration;
        avBounties[msg.sender].createdOn = now;
        avBounties[msg.sender].exists = true;
        bounties.push(msg.sender);
    }
    
    /**
    @dev Submits de Pull Request URL of the submission
    @param bountyAddr Bounty Address
    @param prID Pull Request's ID
    */
    function submitHunt(address bountyAddr, uint prID) public view returns(bool) {
        assert(avBounties[bountyAddr].exists == true);
        assert(avBounties[bountyAddr].createdOn > 0);
        assert(avBounties[bountyAddr].duration > 0);
        // assert(avBounties[bountyAddr].createdOn.add(avBounties[bountyAddr].duration) <= now);
        assert(avBounties[bountyAddr].finished != true);

        submissions[msg.sender].clientAddr = bountyAddr;
        submissions[msg.sender].prID  = prID;
        submissions[msg.sender].accepted = false;

        emit fixSubmitted(bountyAddr);

        return true;
    }
    
    /**
    @dev Marks a submission as accepted
    @param subAddr Submission address (Same as submitter)
    @param bountyAddr Bounty address
    */
    function acceptHunt(address subAddr, address bountyAddr) public view returns(bool) {
        assert(submissions[subAddr].accepted != true);
        assert(avBounties[bountyAddr].exists == true);
        // assert(avBounties[bountyAddr].createdOn.add(avBounties[bountyAddr].duration) <= now);
        assert(avBounties[bountyAddr].finished != true);
        
        avBounties[bountyAddr].fixedBy = subAddr;
        avBounties[bountyAddr].finished = true;
        submissions[subAddr].accepted = true;
        emit fixAccepted(bountyAddr, subAddr);
        subAddr.transfer(avBounties[bountyAddr].prize);
        return true;
    }
    
    /**
    @dev Cancels a bounty if not expired or finished
    */
    function cancelBounty() public view returns(bool) {
        require(avBounties[msg.sender].exists == true);
        assert(avBounties[msg.sender].finished != true);
        // assert((avBounties[msg.sender].createdOn + avBounties[msg.sender].duration) < now);
        avBounties[msg.sender].finished = true;
        return true;
    }
    
    /**
    @dev Checks if a bounty has expired, if so the bounty is finished.
    @param bountyAddr Bounty address.
    */
    function bountyHasExpired(address bountyAddr) public onlyOwner() {
        assert(avBounties[bountyAddr].createdOn.add(avBounties[bountyAddr].duration) <= now);
        avBounties[bountyAddr].finished = true;
    }
    
    /**
    @dev Returns a Repo URL
    */
    function getBounty(address bountyAddr) public view returns 
        (string, string, uint,
        uint, uint, uint, bool) {
    
        assert(avBounties[bountyAddr].exists == true);
        
        return 
        (avBounties[bountyAddr].username, avBounties[bountyAddr].repoUrl, avBounties[bountyAddr].issueID, 
        avBounties[bountyAddr].prize, avBounties[bountyAddr].duration, avBounties[bountyAddr].createdOn,
        avBounties[bountyAddr].finished);
    }
    
    /**
    Returns a list of all bounties post by all addresses.
    */
    function getBounties() public view returns (address[]) {
        return bounties;
    }
    
    /**
    @dev Returns a specificied issue of a registered repository
    @param bountyAddr Bounty address.
    */
    function getBountyIssue(address bountyAddr) public view returns (uint) {
        assert(avBounties[bountyAddr].exists == true);
        // assert(avBounties[bountyAddr].createdOn.add(avBounties[bountyAddr].duration) <= now);
        return avBounties[bountyAddr].issueID;
    }
    
    /**
    @dev Returns a specific bounty's reward
    @param bountyAddr Bounty address.
    */
    function getBountyReward(address bountyAddr) public view returns (uint) {
        // require(avBounties[bountyAddr].exists == true);
        // assert(avBounties[bountyAddr].createdOn.add(avBounties[bountyAddr].duration) <= now);
        return avBounties[bountyAddr].prize;
    }
}
