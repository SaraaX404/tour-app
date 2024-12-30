import { useState, useEffect } from 'react'
import { Card, Row, Col, Typography, Spin, Rate, Image, Button, Carousel } from 'antd'
import { RightOutlined, EnvironmentOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons'
import axios from 'axios'
import Layout from './Layout'
import { MapContainer, TileLayer, Circle, useMapEvents, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const { Title, Text, Paragraph } = Typography

function Dashboard() {
  const [popularTours, setPopularTours] = useState([])
  const [filteredTours, setFilteredTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCenter, setFilterCenter] = useState<any>(null)
  const [filterRadius, setFilterRadius] = useState(100) // radius in km

  useEffect(() => {
    fetchPopularTours()
  }, [])

  const navigate = useNavigate()

  useEffect(() => {
    if (filterCenter && popularTours.length > 0) {
      const filtered = popularTours.filter((tour: any) => {
        return tour.destinations.some((dest: any) => {
          const distance = calculateDistance(
            filterCenter?.lat,
            filterCenter?.lng,
            dest?.location?.lat,
            dest?.location?.lng
          )
          return distance <= filterRadius
        })
      })
      setFilteredTours(filtered)
    } else {
      setFilteredTours(popularTours)
    }
  }, [filterCenter, filterRadius, popularTours])

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

  const fetchPopularTours = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:3000/api/v1/tours')
      setPopularTours(response.data.data.tours)
    } catch (error) {
      console.error('Failed to fetch tours:', error)
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
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '0 0px'
      }}>
        <Title level={1} style={{ color: 'white', fontSize: '4.5rem', marginBottom: '16px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Explore the World with Us
        </Title>
        <Paragraph style={{ color: 'white', fontSize: '1.5rem', maxWidth: '800px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          Discover breathtaking destinations, create unforgettable memories, and embark on extraordinary adventures
        </Paragraph>
        <Button type="primary" size="large" style={{ marginTop: '32px', height: '50px', width: '200px', fontSize: '18px' }}>
          Start Journey
        </Button>
      </div>

      {/* Map Filter Section */}
      <div style={{ padding: '40px', background: '#f0f2f5' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Filter Tours by Location</Title>
        <div style={{ height: '400px', marginBottom: '40px' }}>
          <MapContainer
            center={[20, 0]} // Default center
            zoom={2} // Default zoom
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              tileSize={256}
            />
            <MapEvents />
            {filterCenter && (
              <Circle
                center={filterCenter}
                radius={filterRadius * 1000} // Convert km to meters
                pathOptions={{ color: 'blue', fillColor: 'blue' }}
              />
            )}
            {popularTours.map((tour: any) => 
              tour.destinations.map((dest: any) => (
                dest.location?.lat && dest.location?.lng ? (
                  <Marker 
                    key={dest._id}
                    position={[dest.location.lat, dest.location.lng]}
                  >
                    <Popup>
                      <div>
                        <strong>{dest.name}</strong>
                        <p>Part of tour: {tour.name}</p>
                      </div>
                    </Popup>
                  </Marker>
                ) : null
              ))
            )}
          </MapContainer>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Text>Filter Radius: {filterRadius} km</Text>
          <input
            type="range"
            min="5"
            max="1000"
            value={filterRadius}
            onChange={(e) => setFilterRadius(parseInt(e.target.value))}
            style={{ width: '200px', marginLeft: '20px' }}
          />
        </div>
      </div>

      {/* Featured Tours Section */}
      <div style={{ padding: '40px', background: 'white', width: 'screen'}}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '60px', fontSize: '3rem' }}>
          Popular Tours
          <div style={{ width: '100px', height: '4px', background: 'linear-gradient(90deg, #1890ff, #096dd9)', margin: '20px auto' }}></div>
        </Title>

        <Row gutter={[32, 32]} style={{ margin: '30px' }}>
          {filteredTours.map((tour: any) => (
            <Col xs={24} sm={12} lg={8} key={tour._id}>
              <Card
                onClick={() => navigate(`/tour/${tour._id}`)}
                hoverable
                className="tour-card"
                style={{ 
                  height: '100%',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  transform: 'translateY(0)',
                  transition: 'all 0.3s ease'
                }}
                cover={
                  <div style={{ height: 300, position: 'relative' }}>
                    <Carousel autoplay effect="fade">
                      {tour.destinations[0]?.photos?.map((photo: string, index: number) => (
                        <div key={index}>
                          <Image
                            alt={tour.name}
                            src={photo || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'}
                            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            preview={false}
                          />
                        </div>
                      ))}
                    </Carousel>
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      background: 'rgba(0,0,0,0.7)',
                      padding: '10px 20px',
                      borderRadius: '30px',
                      color: 'white',
                      backdropFilter: 'blur(5px)'
                    }}>
                      <DollarOutlined /> Best Value
                    </div>
                  </div>
                }
                styles={{ body: { padding: '24px' } }}
              >
                <Title level={4} style={{ marginBottom: '16px', color: '#2c3e50', fontSize: '1.5rem' }}>{tour.name}</Title>
                
                <div style={{ marginBottom: '20px' }}>
                  <Rate disabled defaultValue={4.5} style={{ fontSize: '16px', color: '#f39c12' }} />
                  <Text type="secondary" style={{ marginLeft: '8px', fontSize: '1rem' }}>
                    (4.5/5)
                  </Text>
                </div>

                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                  <EnvironmentOutlined style={{ fontSize: '20px', color: '#1890ff', marginRight: '8px' }} />
                  <Text style={{ color: '#34495e', fontSize: '1rem' }}>
                    {tour.destinations.map((dest: any) => dest.name).join(' → ')}
                  </Text>
                </div>

                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                  <ClockCircleOutlined style={{ fontSize: '20px', color: '#1890ff', marginRight: '8px' }} />
                  <Text style={{ color: '#34495e', fontSize: '1rem' }}>
                    {tour.destinations.length} Destinations • {tour.destinations.length * 2} Days
                  </Text>
                </div>

                <Paragraph 
                  ellipsis={{ rows: 3 }}
                  style={{ marginBottom: '24px', color: '#7f8c8d', fontSize: '1rem', lineHeight: '1.6' }}
                >
                  {tour.description}
                </Paragraph>

                <Button 
                  type="primary" 
                  block
                  size="large"
                  icon={<RightOutlined />}
                  style={{ 
                    height: '50px',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(24,144,255,0.3)'
                  }}
                >
                  Explore Tour
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Decorative Elements */}
      <div style={{ 
        position: 'fixed',
        bottom: 0,
        width: 'screen',
        left: 0,
        height: '300px',
        background: `url('https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=1920')`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        opacity: 0.1,
        zIndex: -1
      }} />
    </Layout>
  )
}

export default Dashboard
