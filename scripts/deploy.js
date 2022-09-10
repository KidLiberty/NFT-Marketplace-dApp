const hre = require('hardhat')

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory('NFTMarketplace')
  const nftMarketPlace = await NFTMarketplace.deploy()

  await nftMarketPlace.deployed()

  console.log('NFTMarketplace deployed to:', nftMarketPlace.address)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
