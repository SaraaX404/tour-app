import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Carousel, Typography, Row, Col, Spin, Divider } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'
import Layout from './Layout'
import axios from 'axios'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const { Title, Paragraph } = Typography

interface Hotel {
  _id: string
  name: string
  description: string
  location: {
    lat: number
    lng: number
  }
  photos: string[]
  destination: {
    _id: string
    name: string
  }
}

const HotelDetails = () => {
  const { id } = useParams()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/hotels/${id}`)    
        setHotel(response.data.data.hotel)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching hotel details:', error)
        setLoading(false)
      }
    }

    fetchHotelDetails()
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

  if (!hotel) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Title level={3}>Hotel not found</Title>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Card>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Carousel autoplay>
                {hotel.photos.map((photo, index) => (
                  <div key={index}>
                    <img
                      src={photo}
                      alt={`${hotel.name} - ${index + 1}`}
                      style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </Carousel>
            </Col>
            <Col xs={24} md={12}>
              <Title level={2}>{hotel.name}</Title>
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                <EnvironmentOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                <span>{hotel.destination.name}</span>
              </div>
              <Paragraph>{hotel.description}</Paragraph>
            </Col>
          </Row>

          <Divider orientation="left">
            <Title level={3}>Location</Title>
          </Divider>

          <div style={{ height: '400px', marginTop: '24px' }}>
            <MapContainer
              center={[hotel.location.lat, hotel.location.lng]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[hotel.location.lat, hotel.location.lng]} />
            </MapContainer>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default HotelDetails
