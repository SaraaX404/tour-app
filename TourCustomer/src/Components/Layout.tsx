import { Layout as AntLayout, Menu } from 'antd'
import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

const { Header, Footer, Content } = AntLayout

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const menuItems = [
    {
      key: 'tours',
      label: <Link to="/tours">Tours</Link>
    },
    {
      key: 'hotels', 
      label: <Link to="/hotels">Hotels</Link>
    },
    {
      key: 'about',
      label: <Link to="/about-us">About Us</Link>
    }
  ]

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        position: 'fixed',
        width: '100%',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        top: 0
      }}>
        <div style={{ 
          color: '#1890ff', 
          fontSize: '24px', 
          fontWeight: 'bold',
          marginRight: '50px'
        }}>
          TourApp
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname.split('/')[1] || 'tours']}
          items={menuItems}
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent'
          }}
        />
      </Header>

      <Content style={{ marginTop: 64 }}>
        {children}
      </Content>

      <Footer style={{
        textAlign: 'center',
        background: '#001529',
        color: 'rgba(255,255,255,0.8)',
        padding: '24px 50px'
      }}>
        TourApp ©{new Date().getFullYear()} Created with ❤️
      </Footer>
    </AntLayout>
  )
}

export default Layout

