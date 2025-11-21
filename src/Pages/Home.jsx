import React from 'react'
import Navbar from '../Pages/Navbar'
import PriceTicker from '../Components/Dashboard/PriceTicker'
import MarketPage  from './MarketPage' 
import ScrollToTopButton from '../Pages/ScrollToTopButton'
import MarketStatsCards from './MarketStatsCards'

function Home() {
  return (
    <div>
      
      <Navbar />
      <PriceTicker />
      <MarketStatsCards/>
      <MarketPage />
      <ScrollToTopButton />
    </div>
  )
}

export default Home