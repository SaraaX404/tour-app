import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Upload, Space, Card, message, Popconfirm } from 'antd'
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
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

interface Destination {
  _id: string
  name: string
  description: string
  photos: string[]
  location: {
    lat: number
    lng: number
  }
  hotels: Hotel[]
}

interface Hotel {
  _id: string
  name: string
  description: string
}

interface Tour {
  _id: string
  name: string
  description: string
  destinations: Destination[]
}

function Tours() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [selectedDestinationIndex, setSelectedDestinationIndex] = useState<number | null>(null)
  const [destinationLocations, setDestinationLocations] = useState<{[key: number]: {lat: number, lng: number}}>({})
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(false)
  const [editingTour, setEditingTour] = useState<Tour | null>(null)

  useEffect(() => {
    fetchTours()
  }, [])

  const fetchTours = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:3000/api/v1/tours')
      setTours(response.data.data.tours)
    } catch (error) {
      message.error('Failed to fetch tours')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/tours/${id}`)
      message.success('Tour deleted successfully')
      fetchTours()
    } catch (error) {
      message.error('Failed to delete tour')
    }
  }

  const handleEdit = (record: Tour) => {
    setEditingTour(record)
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      destinations: record.destinations.map(dest => ({
        name: dest.name,
        description: dest.description,
        hotels: dest.hotels
      }))
    })
    const locations: {[key: number]: {lat: number, lng: number}} = {}
    record.destinations.forEach((dest, index) => {
      locations[index] = dest.location
    })
    setDestinationLocations(locations)
    setIsModalVisible(true)
  }

  const columns = [
    { title: 'Tour Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Destinations',
      dataIndex: 'destinations',
      key: 'destinations',
      render: (destinations: Destination[]) => (
        <ul>
          {destinations.map(dest => (
            <li key={dest._id}>{dest.name}</li>
          ))}
        </ul>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Tour) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this tour?"
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
        if (selectedDestinationIndex !== null) {
          setDestinationLocations({
            ...destinationLocations,
            [selectedDestinationIndex]: e.latlng
          })
        }
      }
    })

    if (selectedDestinationIndex !== null && destinationLocations[selectedDestinationIndex]) {
      return <Marker position={destinationLocations[selectedDestinationIndex]} />
    }
    return null
  }

  const handleAddTour = () => {
    setIsModalVisible(true)
    setDestinationLocations({})
    setSelectedDestinationIndex(null)
    setEditingTour(null)
    form.resetFields()
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      
      const destinationsData = await Promise.all(values.destinations.map(async (dest: any, index: number) => {
        const formData = new FormData()
        formData.append('name', dest.name)
        formData.append('description', dest.description)
        formData.append('location[lat]', destinationLocations[index]?.lat.toString() || '51.505')
        formData.append('location[lng]', destinationLocations[index]?.lng.toString() || '-0.09')
        
        if (dest.photos?.fileList) {
          for (const file of dest.photos.fileList) {
            if (file.originFileObj) {
              const photoFormData = new FormData()
              photoFormData.append('image', file.originFileObj)
              const uploadRes = await axios.post('http://localhost:3000/api/v1/common/upload', photoFormData)
              formData.append('photos', uploadRes.data.data.imageUrl)
            }
          }
        }

        const destResponse = await axios.post('http://localhost:3000/api/v1/destinations', formData)
        return destResponse.data.data.destination._id
      }))

      const tourData = {
        name: values.name,
        description: values.description,
        destinations: destinationsData
      }

      if (editingTour) {
        await axios.patch(`http://localhost:3000/api/v1/tours/${editingTour._id}`, tourData)
        message.success('Tour updated successfully')
      } else {
        await axios.post('http://localhost:3000/api/v1/tours', tourData)
        message.success('Tour created successfully')
      }

      setIsModalVisible(false)
      form.resetFields()
      setDestinationLocations({})
      setSelectedDestinationIndex(null)
      setEditingTour(null)
      fetchTours()
    } catch (error) {
      message.error(editingTour ? 'Failed to update tour' : 'Failed to create tour')
    }
  }

  return (
    <AppLayout>
      <div style={{ padding: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button type="primary" onClick={handleAddTour} icon={<PlusOutlined />}>
            Add New Tour
          </Button>

          <Table 
            columns={columns} 
            dataSource={tours} 
            loading={loading}
            rowKey="_id"
          />

          <Modal
            title={editingTour ? "Edit Tour" : "Add New Tour"}
            visible={isModalVisible}
            onOk={handleModalOk}
            onCancel={() => {
              setIsModalVisible(false)
              setEditingTour(null)
              form.resetFields()
            }}
            width={800}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="name"
                label="Tour Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="description"
                label="Tour Description"
                rules={[{ required: true }]}
              >
                <Input.TextArea />
              </Form.Item>

              <Form.List name="destinations">
                {(fields, { add, remove }) => (
                  <div>
                    {fields.map((field, index) => (
                      <Card key={field.key} title={`Destination ${index + 1}`} style={{ marginBottom: 16 }}>
                        <Form.Item
                          {...field}
                          required={false}
                        >
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <Form.Item
                              name={[field.name, 'name']}
                              label="Destination Name"
                              rules={[{ required: true, message: 'Destination name is required' }]}
                            >
                              <Input />
                            </Form.Item>
                            
                            <Form.Item
                              name={[field.name, 'description']}
                              label="Destination Description"
                              rules={[{ required: true, message: 'Destination description is required' }]}
                            >
                              <Input.TextArea />
                            </Form.Item>

                            <Form.Item
                              name={[field.name, 'photos']}
                              label="Destination Photos"
                              valuePropName="fileList"
                              getValueFromEvent={(e) => {
                                if (Array.isArray(e)) return e
                                return e?.fileList
                              }}
                            >
                              <Upload multiple listType="picture">
                                <Button icon={<UploadOutlined />}>Upload Photos</Button>
                              </Upload>
                            </Form.Item>

                            <Form.Item label="Location (Click on map to set location)">
                              <div style={{ height: '400px', marginBottom: '24px' }}>
                                <Button 
                                  onClick={() => setSelectedDestinationIndex(index)}
                                  type={selectedDestinationIndex === index ? 'primary' : 'default'}
                                  style={{ marginBottom: '8px' }}
                                >
                                  {selectedDestinationIndex === index ? 'Currently Setting Location' : 'Set Location'}
                                </Button>
                                <MapContainer
                                  center={destinationLocations[index] || { lat: 51.505, lng: -0.09 }}
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

                            <Button onClick={() => remove(field.name)}>Remove Destination</Button>
                          </Space>
                        </Form.Item>
                      </Card>
                    ))}
                    <Button type="dashed" onClick={() => add()} block>
                      Add Destination
                    </Button>
                  </div>
                )}
              </Form.List>
            </Form>
          </Modal>
        </Space>
      </div>
    </AppLayout>
  )
}

export default Tours
