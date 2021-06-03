pragma solidity ^0.5.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DummyToken is ERC20 {
    string public constant name = "DummyToken";
    string public constant symbol = "DMT";
    uint public constant decimals = 18;
    constructor() public {
        _mint(msg.sender, 10000 * 1e18);
    }
}