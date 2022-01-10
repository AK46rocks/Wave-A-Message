//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Wave{
    uint256 totalWaves;
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string _message);

    
    struct Wave{
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    mapping(address => uint256) public lastMsgAt; 

    constructor() payable{
        console.log("Eyy Bidda ,Ye Mera Adda");

        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public{

        //Checking current ts 15min bigger than previous ts
        require(
          lastMsgAt[msg.sender] + 30 seconds < block.timestamp,"Wait 30sec"
        );

        lastMsgAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved! and texted as %w ",msg.sender,_message);

        waves.push(Wave(msg.sender, _message, block.timestamp));
 
        //Generating Random Numbers
        seed = (block.timestamp + block.difficulty) % 100;
        console.log("Random # Generated %d", seed);

        if(seed <= 20){
           console.log("%s has won!", msg.sender);

            uint256 prizeAmount = 0.001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Insufficient balance"
            );
            (bool success,) = (msg.sender).call{value:prizeAmount}("");
            require(success,"Failed to send prizeAmount");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory){
        return waves;
    }

    function getTotalWaves() public view returns (uint256){
        console.log("TOTAL WAVES: ",totalWaves);
        return totalWaves;
    }
}