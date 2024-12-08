import { Typography, Row, Col, Card, Divider } from 'antd'
import Layout from './Layout'
import { TeamOutlined, SafetyOutlined, CompassOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const AboutUs = () => {
  return (
    <Layout>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Card>
          <Title level={1} style={{ textAlign: 'center', marginBottom: '48px' }}>
            About Us
          </Title>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <img 
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Scenic mountain landscape"
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </Col>
            <Col xs={24} md={12}>
              <Title level={2}>Your Journey Begins With Us</Title>
              <Paragraph style={{ fontSize: '16px' }}>
                Welcome to our premier travel platform, where we transform your travel dreams into unforgettable experiences. With years of expertise in the tourism industry, we pride ourselves on crafting personalized journeys that cater to your unique preferences and desires.
              </Paragraph>
            </Col>
          </Row>

          <Divider />

          <Row gutter={[48, 48]} style={{ marginTop: '48px' }}>
            <Col xs={24} md={8}>
              <Card 
                bordered={false}
                cover={
                  <img
                    alt="Expert team"
                    src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                }
              >
                <TeamOutlined style={{ fontSize: '48px', color: '#1890ff', display: 'block', marginBottom: '24px' }} />
                <Title level={3}>Expert Team</Title>
                <Paragraph>
                  Our experienced team of travel experts is dedicated to providing you with exceptional service and insider knowledge.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card 
                bordered={false}
                cover={
                  <img
                    alt="Safe travel"
                    src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                }
              >
                <SafetyOutlined style={{ fontSize: '48px', color: '#52c41a', display: 'block', marginBottom: '24px' }} />
                <Title level={3}>Safe Travel</Title>
                <Paragraph>
                  Your safety is our top priority. We ensure all our partners maintain the highest standards of safety and hygiene.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card 
                bordered={false}
                cover={
                  <img
                    alt="Curated experiences"
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                }
              >
                <CompassOutlined style={{ fontSize: '48px', color: '#faad14', display: 'block', marginBottom: '24px' }} />
                <Title level={3}>Curated Experiences</Title>
                <Paragraph>
                  Discover handpicked destinations and carefully curated experiences that promise to make your journey special.
                </Paragraph>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Row style={{ marginTop: '48px' }}>
            <Col span={24}>
              <div style={{ 
                backgroundImage: 'url("https://images.unsplash.com/photo-1682686581580-d99b0230064e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '48px',
                borderRadius: '8px',
                position: 'relative'
              }}>
                <div style={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  padding: '32px',
                  borderRadius: '8px'
                }}>
                  <Title level={2} style={{ textAlign: 'center', marginBottom: '24px', color: 'white' }}>
                    Our Mission
                  </Title>
                  <Paragraph style={{ fontSize: '16px', textAlign: 'center', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
                    We are committed to making travel accessible, enjoyable, and memorable for everyone. Our mission is to connect travelers with exceptional destinations and experiences while providing outstanding customer service and maintaining sustainable tourism practices.
                  </Paragraph>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </Layout>
  )
}

export default AboutUs

