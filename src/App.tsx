import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Footer from './components/common/Footer'
import Navbar from './components/common/Navbar'
import ComingSoonPage from './pages/ComingSoonPage'
import ExplorePage from './pages/ExplorePage'
import HomePage from './pages/HomePage'

/** Jump to the top when the page (not just the query string) changes. */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="*" element={<ComingSoonPage />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
