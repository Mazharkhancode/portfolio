import Header from '../components/Header'

function MainLayout({ children }) {
  return (
    <div className="site-shell">
      <Header />
      {children}
    </div>
  )
}

export default MainLayout
