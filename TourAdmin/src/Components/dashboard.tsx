import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Card, Row, Col, Statistic, Table } from 'antd'
import { UserOutlined, DollarOutlined, TeamOutlined, GlobalOutlined } from '@ant-design/icons'
import AppLayout from './layout'

function Dashboard() {
  const chartData = [
    { month: 'Jan', bookings: 65, revenue: 4000 },
    { month: 'Feb', bookings: 78, revenue: 4800 },
    { month: 'Mar', bookings: 90, revenue: 5200 },
    { month: 'Apr', bookings: 81, revenue: 4900 },
    { month: 'May', bookings: 95, revenue: 5800 },
  ]

  const tourData = [
    { key: '1', name: 'Paris Explorer', bookings: 45, revenue: 13500, rating: 4.8 },
    { key: '2', name: 'Rome Adventure', bookings: 38, revenue: 11400, rating: 4.7 },
    { key: '3', name: 'Tokyo Discovery', bookings: 42, revenue: 12600, rating: 4.9 },
  ]

  const columns = [
    { title: 'Tour Name', dataIndex: 'name', key: 'name' },
    { title: 'Bookings', dataIndex: 'bookings', key: 'bookings' },
    { title: 'Revenue ($)', dataIndex: 'revenue', key: 'revenue' },
    { title: 'Rating', dataIndex: 'rating', key: 'rating' },
  ]
  return (
    <AppLayout>
      <div>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
            <Statistic title="Total Bookings" value={409} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Revenue" value={89600} prefix={<DollarOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Active Tours" value={12} prefix={<GlobalOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Customers" value={892} prefix={<UserOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Booking & Revenue Trends">
            <LineChart width={1000} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="bookings" stroke="#8884d8" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" />
            </LineChart>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Top Performing Tours">
            <Table columns={columns} dataSource={tourData} />
          </Card>
        </Col>
      </Row>
        </div>

    </AppLayout>
  )
}

export default Dashboard
