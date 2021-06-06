// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


/**
Portfolio factory contract that allow caller to :
- Create new portfolio contract if not already exist.
- Get portfolio address if already created.
 */
contract PortfolioFactory {

    // mapping of (owner => ptfAddress)
    mapping(address => address) public portfolios;

    // Event fired whenever new ptf created.
    event PortfolioCreated(address owner, string data);

    // Error fired when user try to get her/his ptf before creating it.
    error NoPortfolioFound(address caller);

    // Errors fired when try to create her/his ptf twice. 
    error PortfolioAlreadyExist(address caller);

        
    // modifier to check if caller already has a ptf created
    modifier alreadyExist() {
         require(portfolios[msg.sender] == address(0), "Portfolio already exist for the caller address!");
        _;
    }

     /**
        Create new ptf with the given data (IPFS hash).
        @param data : IPFS hash.
        @return newly created ptf address
     */
    function createPortfolio(string memory data) external returns(address){
        require(portfolios[msg.sender] == address(0), "Portfolio already exist!");
        Portfolio portfolio = new Portfolio(msg.sender, data);
        portfolios[msg.sender] = address(portfolio);
        emit PortfolioCreated(msg.sender, data);
        return address(portfolio);
    }

    /**
        Return the sender ptf address
        @return the caller ptf address 
        And throw NoPortfolioFound error if no ptf found.
     */
    function getPortfolioAddress() public view returns(address)  {   
        require(portfolios[msg.sender] != address(0), "Portfolio not fount!");
        return portfolios[msg.sender];
    }


}

/**
Portfolio contract that allow owner to :
- Update her/his IPFS hash.
It expose also methods to :
- Get current IPFS hash
- Get ptf creation date
- Get last updated date
 */
contract Portfolio {
    string public data;
    address public owner; 
    uint256 public created;
    uint256 public updated;

    event PortfolioUpdated(address owner, string data);

    constructor(address _owner, string memory _data) {
        owner = _owner;
        data = _data;
        created = block.timestamp;  
    }
    
    // modifier to check if caller is owner of the portfolio
    modifier isOwner() {
        require(msg.sender == owner, "You must be owner of the portfolio");
        _;
    }

    /**
        Update user portfolio with new ipfs hash
        @param _data : ipfs hash
    */
    function updatePortfolio(string memory _data) isOwner public {
        data = _data;
        updated = block.timestamp;
        emit PortfolioUpdated(owner, _data);
    }

    /**
        @return ptf data
     */
    function getData() public view returns(string memory) {
        return data;
    }

    /**
        @return ptf createion date
     */
    function getCreationDate() public view returns(uint256) {
        return created;
    }

    /**
        @return ptf last updated date
     */
    function getLastUpdatedDate() public view returns(uint256) {
        return updated;
    }
}

