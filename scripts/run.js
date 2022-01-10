const main = async() => {
    const [owner,randomPerson] = await hre.ethers.getSigners();
     const waveContractFactory = await hre.ethers.getContractFactory('Wave');
     const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"),
     });

     await waveContract.deployed();
     console.log("Contarct deployed to: ",waveContract.address);
     console.log("Contarct deployed by: ",owner.address);

     //Print Contract Balance
     let contractBalance = await hre.ethers.provider.getBalance(
         waveContract.address
     );
     console.log("Contract Balance: ",hre.ethers.utils.formatEther(contractBalance));
     
     //Print Total Waves Count
     let waveCount;
     waveCount = await waveContract.getTotalWaves();

     //1st Transaction
     let waveTxn = await waveContract.wave("1st Waver");
     await waveTxn.wait();
     //Second Transaction    
     waveTxn = await waveContract.connect(randomPerson).wave("2nd Waver");
     await waveTxn.wait();

     //Print Contract Balance
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract Balance: ",hre.ethers.utils.formatEther(contractBalance));
    
    //Print Total Waves Count
    waveCount = await waveContract.getTotalWaves();

    //Print All Waves
    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
     

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