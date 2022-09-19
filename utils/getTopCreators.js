export const getCreators = nfts => {
  let sumArray = []
  nfts.forEach(nft => {
    if (!sumArray.some(recordedNft => recordedNft.seller === nft.seller)) {
      sumArray.push({ seller: nft.seller, sum: nft.price })
    } else {
      sumArray = sumArray.map(recordedNft =>
        recordedNft.seller === nft.seller
          ? {
              ...recordedNft,
              sum: Number(recordedNft.sum) + Number(nft.price)
            }
          : recordedNft
      )
    }
  })

  return sumArray
}
