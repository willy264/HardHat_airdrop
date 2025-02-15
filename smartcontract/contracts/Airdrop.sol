// SPDX License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Airdrop {

  IERC20 public token;
  address public owner;
  uint256 public totalAirdrop;
  uint256 public airdropAmt;
  bool public isAirdropActive;

  mapping (address => bool) public hasClaimed;
  
  constructor(address _token, uint256 _airdropAmt) {
    require(_token != address(0), "Invalid token address");
    token = IERC20(_token);
    owner = msg.sender;
    airdropAmt = _airdropAmt;
    isAirdropActive = true;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this function");
    _;
  }

  modifier airdropActive() {
    require(isAirdropActive, "Airdrop is not active");
    _;
  }

  function startAirdrop(bool _status) external onlyOwner {
    isAirdropActive = _status;
  }

  function airdropAmount(uint256 _amount) external onlyOwner {
    airdropAmt = _amount;
  }

  function claimAirdrop() external airdropActive {
    require(!hasClaimed[msg.sender], "Already claimed");
    require(token.balanceOf(address(this)) >= airdropAmt, "Insufficient balance in contract"); // contract should have enough balance

    hasClaimed[msg.sender] = true;
    token.transfer(msg.sender, airdropAmt);
    totalAirdrop += airdropAmt;
  }

  function airdropDistribution(address[] calldata _recipients) external onlyOwner airdropActive { // calldata specifies that the array's data is located in the transaction's calldata (input data)
    require(_recipients.length > 0, "No recipients specified");

    for (uint256 i = 0; i < _recipients.length; i++) {
      if (!hasClaimed[_recipients[i]]) { // runs if the recipient has not claimed the airdrop
        require(token.balanceOf(address(this)) >= airdropAmt, "Insufficient balance in contract"); // contract should have enough balance

        hasClaimed[_recipients[i]] = true;
        token.transfer(_recipients[i], airdropAmt);
        totalAirdrop += airdropAmt;
      }
    }
  }

  function withdrawTokens() external onlyOwner {
    require(token.balanceOf(address(this)) > 0, "No tokens to withdraw");
    
    token.transfer(owner, token.balanceOf(address(this)));
  }

}