import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Carousel, Typography, Row, Col, Spin, Divider, List, Avatar } from 'antd'
import { EnvironmentOutlined, HomeOutlined } from '@ant-design/icons'
import Layout from './Layout'
import axios from 'axios'

const { Title, Paragraph } = Typography

interface Destination {
  _id: string
  name: string
  description: string
  location: {
    lat: number
    lng: number
  }
  photos: string[]
  hotels: Hotel[]
}

interface Hotel {
  _id: string
  name: string
  description: string
  location: {
    lat: number
    lng: number
  }
  photos: string[]
}

interface Tour {
  _id: string
  name: string
  description: string
  destinations: Destination[]
}

const TourDetails = () => {
  const { id } = useParams()
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/tours/${id}`)    
        setTour(response.data.data.tour)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching tour details:', error)
        setLoading(false)
      }
    }

    fetchTourDetails()
  }, [id])

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spin size="large" />
        </div>
      </Layout>
    )
  }

  if (!tour) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Title level={3}>Tour not found</Title>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={1}>{tour.name}</Title>
        <Paragraph>{tour.description}</Paragraph>

        <Divider orientation="left">
          <Title level={2}>Destinations</Title>
        </Divider>

        {tour.destinations.map((destination) => (
          <Card 
            key={destination._id}
            style={{ marginBottom: '24px' }}
            className="destination-card"
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Carousel autoplay>
                  {destination.photos.map((photo, index) => (
                    <div key={index}>
                      <img
                        src={photo}
                        alt={`${destination.name} - ${index + 1}`}
                        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </Carousel>
              </Col>
              <Col xs={24} md={12}>
                <Title level={3}>
                  <EnvironmentOutlined /> {destination.name}
                </Title>
                <Paragraph>{destination.description}</Paragraph>
                
                <Title level={4}>Available Hotels</Title>
                <List
                  itemLayout="horizontal"
                  dataSource={destination.hotels}
                  renderItem={(hotel) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<HomeOutlined />} />}
                        title={hotel.name}
                        description={hotel.description}
                      />
                    </List.Item>
                  )}
                />
              </Col>
            </Row>
          </Card>
        ))}
      </div>
    </Layout>
  )
}

export default TourDetails

