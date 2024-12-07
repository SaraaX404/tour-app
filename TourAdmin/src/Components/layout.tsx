import { useState, ReactNode } from 'react'
import { Layout, Menu } from 'antd'
import { UserOutlined, GlobalOutlined, TeamOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Header, Sider, Content } = Layout

interface AppLayoutProps {
  children: ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<GlobalOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<TeamOutlined />}>
            <Link to="/tours">Tours</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<TeamOutlined />}>
            <Link to="/hotels">Hotels</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<UserOutlined />}>
            Customers
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <h1 style={{ margin: '0 16px', color: '#1890ff' }}>Tour Admin Dashboard</h1>
        </Header>
        <Content style={{ margin: '16px' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
