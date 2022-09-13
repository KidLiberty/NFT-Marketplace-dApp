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

  //   const creators = nfts.reduce((creatorObject, nft) => {
  //     ;(creatorObject[nft.seller] = creatorObject[nft.seller] || []).push(nft)

  //     return creatorObject
  //   }, {})

  //   return Object.entries(creators).map(creator => {
  //     const seller = creator[0]
  //     const sum = creator[1]
  //       .map(item => Number(item.price))
  //       .reduce((prev, curr) => prev + curr, 0)

  //     return { seller, sum }
  //   })
}
