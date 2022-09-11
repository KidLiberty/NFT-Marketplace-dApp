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

  const projectId = '2EZum75KPy9XY7mTOUDXHxNmgsT'
  const projectSecret = '886090a87ca800eb2474708a571a9fa4'
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
      const url = `https://bs-openlake.infura-ipfs.io/ipfs/${added.cid}`

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
      const url = `https://bs-openlake.infura-ipfs.io/ipfs/${added.cid}`

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

    const transaction = await contract.createToken(url, price, {
      value: listingPrice.toString()
    })

    await transaction.wait()
  }

  const NFTContextValue = {
    nftCurrency,
    connectWallet,
    currentAccount,
    uploadToIPFS,
    createNFT,
    createSale
  }

  return (
    <NFTContext.Provider value={NFTContextValue}>
      {children}
    </NFTContext.Provider>
  )
}
