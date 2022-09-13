import React, { useState, useEffect } from 'react'
import Web3Modal from 'web3modal'
import { ethers, Signer } from 'ethers'
import axios from 'axios'
import { create } from 'ipfs-http-client'

import { MarketAddress, MarketAddressABI } from './constants'

const fetchContract = signerOrProvider =>
  new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider)

export const NFTContext = React.createContext()

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const nftCurrency = 'ETH'

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert('Please install MetaMask.')
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    })

    if (accounts.length) {
      setCurrentAccount(accounts[0])
    } else {
      console.log('No accounts found.')
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask.')
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })

    setCurrentAccount(accounts[0])

    window.location.reload()
  }

  const projectId = '2EdUjPaf5EdyYQ0N76xCSpZ7Qjn'
  const projectSecret = 'bf9665acc547dc6abf25973eda88574a'
  const auth =
    'Basic ' + Buffer.from(`${projectId}:${projectSecret}`).toString('base64')

  const uploadToIPFS = async file => {
    try {
      const client = await create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
          authorization: auth
        }
      })

      const added = await client.add({ content: file })
      const url = `https://bs-nft-marketplace.infura-ipfs.io/ipfs/${added.cid}`

      return url
    } catch (err) {
      console.log('Error uploading file to IPFS.')
    }
  }

  const createNFT = async (formInput, fileURL, router) => {
    const { name, description, price } = formInput

    if (!name || !description || !price || !fileURL) return
    const data = JSON.stringify({ name, description, image: fileURL })

    try {
      const client = await create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
          authorization: auth
        }
      })

      const added = await client.add(data)
      const url = `https://bs-nft-marketplace.infura-ipfs.io/ipfs/${added.cid}`

      await createSale(url, price)

      router.push('/')
    } catch (err) {
      console.log('Error uploading file to IPFS.')
    }
  }

  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner() // Address of NFT creator

    const price = ethers.utils.parseUnits(formInputPrice, 'ether')
    const contract = fetchContract(signer)

    const listingPrice = await contract.getListingPrice()

    const transaction = !isReselling
      ? await contract.createToken(url, price, {
          value: listingPrice.toString()
        })
      : await contract.resellToken(id, price, {
          value: listingPrice.toString()
        })

    await transaction.wait()
  }

  const fetchNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider()
    const contract = fetchContract(provider) // Fetch ALL NFTs

    const data = await contract.fetchMarketItems()

    const items = await Promise.all(
      data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId)
        const {
          data: { image, name, description }
        } = await axios.get(tokenURI)
        const price = ethers.utils.formatUnits(
          unformattedPrice.toString(),
          'ether'
        )

        return {
          price,
          tokenId: tokenId.toNumber(),
          seller,
          owner,
          image,
          name,
          description,
          tokenURI
        }
      })
    )

    return items
  }

  const fetchMyNFTsOrListedNFTs = async type => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner() // Address of NFT creator

    const contract = fetchContract(signer)

    const data =
      type === 'fetchItemsListed'
        ? await contract.fetchItemsListed()
        : await contract.fetchMyNFTs()

    const items = await Promise.all(
      data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId)
        const {
          data: { image, name, description }
        } = await axios.get(tokenURI)
        const price = ethers.utils.formatUnits(
          unformattedPrice.toString(),
          'ether'
        )

        return {
          price,
          tokenId: tokenId.toNumber(),
          seller,
          owner,
          image,
          name,
          description,
          tokenURI
        }
      })
    )
    return items
  }

  const buyNFT = async nft => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const contract = fetchContract(signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price
    })

    await transaction.wait()
  }

  const NFTContextValue = {
    nftCurrency,
    connectWallet,
    currentAccount,
    uploadToIPFS,
    createNFT,
    createSale,
    fetchNFTs,
    fetchMyNFTsOrListedNFTs,
    buyNFT
  }

  return (
    <NFTContext.Provider value={NFTContextValue}>
      {children}
    </NFTContext.Provider>
  )
}
