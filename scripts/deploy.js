const main = async() => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
     
     console.log(" Contract Deployers address: ",deployer.address);
     console.log("Account Balance: ",accountBalance.toString());

     const Token = await hre.ethers.getContractFactory('Wave');
     const portal = await Token.deploy({
         value : hre.ethers.utils.parseEther("0.1"),
     });
     await portal.deployed();

     console.log("Contract Address: ",portal.address);
  
};

const runMain = async() =>{
    try{
        await main();
        process.exit(0);
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
};
runMain();