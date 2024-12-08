import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Card, Row, Col, message } from 'antd'
import AppLayout from './layout'
import axios from 'axios'

function Dashboard() {
  const [stats, setStats] = useState({
    totalTours: 0,
    totalHotels: 0,
    totalDestinations: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch tours count
      const toursResponse = await axios.get('http://localhost:3000/api/v1/tours')
      const totalTours = toursResponse.data.results

      // Fetch destinations count
      const destinationsResponse = await axios.get('http://localhost:3000/api/v1/destinations')
      const totalDestinations = destinationsResponse.data.results

      // Fetch hotels count (assuming hotels endpoint exists)
      const hotelsResponse = await axios.get('http://localhost:3000/api/v1/hotels')
      const totalHotels = hotelsResponse.data.results

      setStats({
        totalTours,
        totalHotels,
        totalDestinations
      })

    } catch (error) {
      message.error('Failed to fetch statistics')
    } finally {
      setLoading(false)
    }
  }

  const chartData = [
    {
      name: 'Total Count',
      tours: stats.totalTours,
      hotels: stats.totalHotels,
      destinations: stats.totalDestinations
    }
  ]

  return (
    <AppLayout>
      <div>
        <Row style={{ marginTop: '24px' }}>
          <Col span={24}>
            <Card title="Tours, Hotels & Destinations Statistics" loading={loading}>
              <BarChart width={1000} height={400} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tours" fill="#8884d8" name="Total Tours" />
                <Bar dataKey="hotels" fill="#82ca9d" name="Total Hotels" />
                <Bar dataKey="destinations" fill="#ffc658" name="Total Destinations" />
              </BarChart>
            </Card>
          </Col>
        </Row>
      </div>
    </AppLayout>
  )
}

export default Dashboard
