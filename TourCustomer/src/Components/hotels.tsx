import { useState, useEffect } from 'react'
import { Card, Row, Col, Typography, Spin, Rate, Image, Button, Carousel } from 'antd'
import { RightOutlined, EnvironmentOutlined } from '@ant-design/icons'
import axios from 'axios'
import Layout from './Layout'
import { MapContainer, TileLayer, Circle, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useNavigate } from 'react-router-dom'
const { Title, Text, Paragraph } = Typography

function Hotels() {
  const [hotels, setHotels] = useState([])
  const [filteredHotels, setFilteredHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCenter, setFilterCenter] = useState<any>(null)
  const [filterRadius, setFilterRadius] = useState(100) // radius in km

  useEffect(() => {
    fetchHotels()
  }, [])

  const navigate = useNavigate()

  useEffect(() => {
    if (filterCenter && hotels.length > 0) {
      const filtered = hotels.filter((hotel: any) => {
        const distance = calculateDistance(
          filterCenter?.lat,
          filterCenter?.lng,
          hotel.location.lat,
          hotel.location.lng
        )
        return distance <= filterRadius
      })
      setFilteredHotels(filtered)
    } else {
      setFilteredHotels(hotels)
    }
  }, [filterCenter, filterRadius, hotels])

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const MapEvents = () => {
    useMapEvents({
      click: (e: any) => {
        setFilterCenter(e.latlng)
      }
    })
    return null
  }

  const fetchHotels = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:3000/api/v1/hotels')
      setHotels(response.data.data.hotels)
    } catch (error) {
      console.error('Failed to fetch hotels:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
          <Spin size="large" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div style={{ 
        height: '100vh',
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        <Title level={1} style={{ color: 'white', fontSize: '4.5rem', marginBottom: '16px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Find Your Perfect Stay
        </Title>
        <Paragraph style={{ color: 'white', fontSize: '1.5rem', maxWidth: '800px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          Discover luxurious hotels and comfortable accommodations for your dream vacation
        </Paragraph>
      </div>

      {/* Map Filter Section */}
      <div style={{ padding: '40px', background: '#f0f2f5' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Filter Hotels by Location</Title>
        <div style={{ height: '400px', marginBottom: '40px' }}>
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents />
            {filterCenter && (
              <Circle
                center={filterCenter}
                radius={filterRadius * 1000}
                pathOptions={{ color: 'blue', fillColor: 'blue' }}
              />
            )}
          </MapContainer>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Text>Filter Radius: {filterRadius} km</Text>
          <input
            type="range"
            min="50"
            max="1000"
            value={filterRadius}
            onChange={(e) => setFilterRadius(parseInt(e.target.value))}
            style={{ width: '200px', marginLeft: '20px' }}
          />
        </div>
      </div>

      {/* Hotels Section */}
      <div style={{ padding: '40px', background: 'white' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '60px', fontSize: '3rem' }}>
          Available Hotels
          <div style={{ width: '100px', height: '4px', background: 'linear-gradient(90deg, #1890ff, #096dd9)', margin: '20px auto' }}></div>
        </Title>

        <Row gutter={[32, 32]}>
          {filteredHotels.map((hotel: any) => (
            <Col xs={24} sm={12} lg={8} key={hotel._id}>
              <Card
                onClick={() => navigate(`/hotel/${hotel._id}`)}
                hoverable
                className="hotel-card"
                style={{ 
                  height: '100%',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }}
                cover={
                  <div style={{ height: 300, position: 'relative' }}>
                    <Carousel autoplay>
                      {hotel.photos.map((photo: string, index: number) => (
                        <div key={index}>
                          <Image
                            alt={hotel.name}
                            src={photo || 'https://via.placeholder.com/400x300'}
                            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            preview={false}
                          />
                        </div>
                      ))}
                    </Carousel>
                  </div>
                }
              >
                <Title level={4} style={{ marginBottom: '16px', color: '#2c3e50' }}>{hotel.name}</Title>
                
                <div style={{ marginBottom: '16px' }}>
                  <Rate disabled defaultValue={4.5} style={{ fontSize: '16px' }} />
                </div>

                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                  <EnvironmentOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                  <Text>{hotel.destination.name}</Text>
                </div>

                <Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: '24px' }}>
                  {hotel.description}
                </Paragraph>

                <Button 
                  type="primary" 
                  block
                  icon={<RightOutlined />}
                  style={{ 
                    height: '40px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)'
                  }}
                >
                  View Details
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Layout>
  )
}

export default Hotels
