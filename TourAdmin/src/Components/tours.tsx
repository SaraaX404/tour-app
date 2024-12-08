import { useState, useEffect } from 'react'
import { Table, Button, Modal, Space, Card, message, Popconfirm, Upload } from 'antd'
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
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

interface FormInputs {
  name: string
  description: string
  destinations: {
    name: string
    description: string
    photos: any
  }[]
}

function Tours() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDestinationIndex, setSelectedDestinationIndex] = useState<number | null>(null)
  const [destinationLocations, setDestinationLocations] = useState<{[key: number]: {lat: number, lng: number}}>({})
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(false)
  const [editingTour, setEditingTour] = useState<Tour | null>(null)

  const { control, handleSubmit, reset } = useForm<FormInputs>({
    defaultValues: {
      name: '',
      description: '',
      destinations: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'destinations'
  })

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
    reset({
      name: record.name,
      description: record.description,
      destinations: record.destinations.map(dest => ({
        name: dest.name,
        description: dest.description,
        photos: []
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
    reset()
  }

  const onSubmit = async (data: FormInputs) => {
    try {
      const destinationsData = await Promise.all(data.destinations.map(async (dest: any, index: number) => {
        // Upload photos first
        const photos: string[] = []
        if (dest.photos?.fileList) {
          for (const file of dest.photos.fileList) {
            if (file.originFileObj) {
              const photoFormData = new FormData()
              photoFormData.append('image', file.originFileObj)
              const uploadRes = await axios.post('http://localhost:3000/api/v1/common/upload', photoFormData)
              photos.push(uploadRes.data.data.imageUrl)
            }
          }
        }

        // Create destination with JSON data
        const destinationData = {
          name: dest.name,
          description: dest.description,
          location: {
            lat: destinationLocations[index]?.lat || 51.505,
            lng: destinationLocations[index]?.lng || -0.09
          },
          photos
        }

        const destResponse = await axios.post('http://localhost:3000/api/v1/destinations', destinationData)
        return destResponse.data.data.destination._id
      }))

      const tourData = {
        name: data.name,
        description: data.description,
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
      reset()
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
            onOk={handleSubmit(onSubmit)}
            onCancel={() => {
              setIsModalVisible(false)
              setEditingTour(null)
              reset()
            }}
            width={800}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ marginBottom: 16 }}>
                <label>Tour Name</label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }: { field: any }) => <input {...field} style={{ width: '100%', padding: '4px 11px' }} />}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Tour Description</label>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }: { field: any }) => <textarea {...field} style={{ width: '100%', padding: '4px 11px' }} />}
                />
              </div>

              <div>
                {fields.map((field: any, index: number) => (
                  <Card key={field.id} title={`Destination ${index + 1}`} style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 16 }}>
                      <label>Destination Name</label>
                      <Controller
                        name={`destinations.${index}.name`}
                        control={control}
                        render={({ field }: { field: any }) => <input {...field} style={{ width: '100%', padding: '4px 11px' }} />}
                      />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label>Destination Description</label>
                      <Controller
                        name={`destinations.${index}.description`}
                        control={control}
                        render={({ field }: { field: any }) => <textarea {...field} style={{ width: '100%', padding: '4px 11px' }} />}
                      />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label>Destination Photos</label>
                      <Controller
                        name={`destinations.${index}.photos`}
                        control={control}
                        render={({ field }: { field: any }) => (
                          <Upload
                            {...field}
                            multiple
                            listType="picture"
                            onChange={(info: any) => field.onChange(info)}
                          >
                            <Button icon={<UploadOutlined />}>Upload Photos</Button>
                          </Upload>
                        )}
                      />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label>Location (Click on map to set location)</label>
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
                    </div>

                    <Button onClick={() => remove(index)}>Remove Destination</Button>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => append({ name: '', description: '', photos: [] })} block>
                  Add Destination
                </Button>
              </div>
            </form>
          </Modal>
        </Space>
      </div>
    </AppLayout>
  )
}

export default Tours
