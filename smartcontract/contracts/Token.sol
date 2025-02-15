// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor(
        string memory _name, 
        string memory _symbol, 
        uint8 _decimals, 
        uint256 _initialSupply
    ) ERC20(_name, _symbol) Ownable(msg.sender) {
        _mint(msg.sender, _initialSupply * (10 ** uint256(_decimals))); // Mint initial supply
    }

    function decimals() public pure override returns (uint8) {
        return 18; // Standard ERC-20 decimals
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}