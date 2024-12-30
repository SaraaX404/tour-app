import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Carousel, Typography, Row, Col, Spin, Divider, List, Avatar, Form, Input, Rate, Button, message } from 'antd'
import { EnvironmentOutlined, HomeOutlined } from '@ant-design/icons'
import Layout from './Layout'
import axios from 'axios'

const { Title, Paragraph } = Typography
const { TextArea } = Input

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

interface Review {
  _id: string
  review: string
  rating: number
  createdAt: string
}

interface Tour {
  _id: string
  name: string
  description: string
  destinations: Destination[]
  reviews?: Review[]
}

const TourDetails = () => {
  const { id } = useParams()
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()
  const [reviews, setReviews] = useState<Review[]>([])

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

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/tours/${id}/reviews`)
        setReviews(response.data.data.reviews)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

    fetchTourDetails()
    fetchReviews()
  }, [id])

  const handleSubmitReview = async (values: { review: string; rating: number }) => {
    try {
      await axios.post(`http://localhost:3000/api/v1/tours/${id}/reviews`, {
        review: values.review,
        rating: values.rating,
        tour: id
      })
      
      message.success('Review submitted successfully!')
      form.resetFields()
      
      // Refresh reviews after submission
      const response = await axios.get(`http://localhost:3000/api/v1/tours/${id}/reviews`)
      setReviews(response.data.data.reviews)
    } catch (error) {
      console.error('Error submitting review:', error)
      message.error('Failed to submit review')
    }
  }

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

        <Divider orientation="left">
          <Title level={2}>Reviews</Title>
        </Divider>

        <Card style={{ marginBottom: '24px' }}>
          <Form form={form} onFinish={handleSubmitReview} layout="vertical">
            <Form.Item
              name="rating"
              label="Rating"
              rules={[{ required: true, message: 'Please give a rating' }]}
            >
              <Rate />
            </Form.Item>
            <Form.Item
              name="review"
              label="Your Review"
              rules={[{ required: true, message: 'Please write your review' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit Review
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {reviews.length > 0 && (
          <List
            itemLayout="horizontal"
            dataSource={reviews}
            renderItem={(review) => (
              <List.Item>
                <List.Item.Meta
                  title={<Rate disabled defaultValue={review.rating} />}
                  description={
                    <>
                      <Paragraph>{review.review}</Paragraph>
                      <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </Layout>
  )
}

export default TourDetails
