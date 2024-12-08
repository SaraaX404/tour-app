import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Upload, Space, Select, message, Popconfirm } from 'antd'
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import AppLayout from './layout'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import axios from 'axios'

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  // ... rest of the options
})

function Hotels() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingHotel, setEditingHotel] = useState<any>(null)
  const [form] = Form.useForm()
  const [selectedLocation, setSelectedLocation] = useState({ lat: 51.505, lng: -0.09 })
  const [hotels, setHotels] = useState([])
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchHotels()
    fetchDestinations()
  }, [])

  const fetchHotels = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:3000/api/v1/hotels')
      setHotels(response.data.data.hotels.map((hotel: any) => ({
        ...hotel,
        key: hotel._id
      })))
    } catch (error) {
      message.error('Failed to fetch hotels')
    } finally {
      setLoading(false)
    }
  }

  const fetchDestinations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/destinations')
      setDestinations(response.data.data.destinations)
    } catch (error) {
      message.error('Failed to fetch destinations')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/hotels/${id}`)
      message.success('Hotel deleted successfully')
      fetchHotels()
    } catch (error) {
      message.error('Failed to delete hotel')
    }
  }

  const handleEdit = (record: any) => {
    setEditingHotel(record)
    setSelectedLocation(record.location)
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      destination: record.destination._id,
      photos: record.photos.map((url: string, index: number) => ({
        uid: index,
        name: `Photo ${index + 1}`,
        status: 'done',
        url
      }))
    })
    setIsModalVisible(true)
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Photos',
      dataIndex: 'photos',
      key: 'photos',
      render: (photos: string[]) => (
        <span>{photos.length} photo(s)</span>
      )
    },
    {
      title: 'Location',
      key: 'location',
      render: (record: any) => (
        <span>
          {record.location.lat.toFixed(4)}, {record.location.lng.toFixed(4)}
        </span>
      )
    },
    {
      title: 'Destination',
      dataIndex: ['destination', 'name'],
      key: 'destination'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this hotel?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      )
    }
  ]

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setSelectedLocation(e.latlng)
      }
    })

    return <Marker position={selectedLocation} />
  }

  const handleSubmit = async (values: any) => {
    try {
      const photos: string[] = []
      
      // Handle both new uploads and existing photos
      if (values.photos) {
        const fileList = Array.isArray(values.photos) ? values.photos : values.photos.fileList
        
        for (const file of fileList) {
          if (file.originFileObj) {
            // This is a new file upload
            const photoFormData = new FormData()
            photoFormData.append('image', file.originFileObj)
            const uploadRes = await axios.post('http://localhost:3000/api/v1/common/upload', photoFormData)
            photos.push(uploadRes.data.data.imageUrl)
          } else if (file.url) {
            // This is an existing photo
            photos.push(file.url)
          }
        }
      }

      const hotelData = {
        name: values.name,
        description: values.description,
        destination: values.destination,
        location: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng
        },
        photos
      }

      if (editingHotel) {
        await axios.patch(`http://localhost:3000/api/v1/hotels/${editingHotel._id}`, hotelData)
        message.success('Hotel updated successfully')
      } else {
        await axios.post('http://localhost:3000/api/v1/hotels', hotelData)
        message.success('Hotel added successfully')
      }

      setIsModalVisible(false)
      form.resetFields()
      setEditingHotel(null)
      fetchHotels()
    } catch (error) {
      message.error(editingHotel ? 'Failed to update hotel' : 'Failed to add hotel')
    }
  }

  return (
    <AppLayout>
      <div style={{ padding: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingHotel(null)
              form.resetFields()
              setIsModalVisible(true)
            }}
          >
            Add Hotel
          </Button>

          <Table 
            columns={columns} 
            dataSource={hotels} 
            loading={loading}
          />

          <Modal
            title={editingHotel ? "Edit Hotel" : "Add New Hotel"}
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false)
              setEditingHotel(null)
              form.resetFields()
            }}
            footer={null}
            width={800}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="name"
                label="Hotel Name"
                rules={[{ required: true, message: 'Hotel name is required' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Hotel description is required' }]}
              >
                <Input.TextArea />
              </Form.Item>

              <Form.Item
                name="destination"
                label="Destination"
                rules={[{ required: true, message: 'Destination is required' }]}
              >
                <Select>
                  {destinations.map((dest: any) => (
                    <Select.Option key={dest._id} value={dest._id}>
                      {dest.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="photos"
                label="Photos"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e
                  return e?.fileList
                }}
              >
                <Upload 
                  multiple 
                  listType="picture" 
                  beforeUpload={() => false}
                  defaultFileList={editingHotel?.photos?.map((url: string, index: number) => ({
                    uid: index,
                    name: `Photo ${index + 1}`,
                    status: 'done',
                    url
                  }))}
                >
                  <Button icon={<UploadOutlined />}>Upload Photos</Button>
                </Upload>
              </Form.Item>

              <Form.Item label="Location (Click on map to set location)">
                <div style={{ height: '400px', marginBottom: '24px' }}>
                  <MapContainer
                    center={selectedLocation}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker />
                  </MapContainer>
                </div>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {editingHotel ? 'Update Hotel' : 'Add Hotel'}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Space>
      </div>
    </AppLayout>
  )
}

export default Hotels
