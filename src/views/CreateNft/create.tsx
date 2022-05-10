import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import ImageUploading from 'react-images-uploading'
import './create.css'
import tagzlogo from '../../images/tagz/tagz-logo.png'

const Create: React.FC = () => {
  const [img, setimg] = useState([])

  return (
    <div className="container my-5">
      <p className="text-color mb-5 h2 font-weight-600">Create Your NFT</p>

      <Form.Group className="mb-4 form-width">
        <Form.Label className="text-color h5">AR content to mint</Form.Label>
        <Form.Select className="text-color pointer create-input">
          <option selected disabled>
            Title Name
          </option>
          <option>select2</option>
          <option>select3</option>
          <option>select4</option>
          <option>select5</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-4 form-width">
        <Form.Label className="text-color h5">NFT Name</Form.Label>
        <Form.Control placeholder="Choose a name for your NFT" className="form-bg create-input text-color" />
      </Form.Group>

      <div className="mb-4">
        <p className="text-color h5">Upload screenshots</p>
        <p className="text-secondary">Up to 5 screenshots</p>
        <ImageUploading
          multiple
          value={img}
          onChange={(imageList) => setimg(imageList)}
          maxNumber={5}
          dataURLKey="data_url"
        >
          {({ onImageUpload }) => (
            <Button className="save-btn px-4" onClick={onImageUpload}>
              Upload
            </Button>
          )}
        </ImageUploading>

        <div className="my-4 d-flex flex-column flex-md-row">
          {img.map((item) => {
            return (
              <div className="me-2 mb-2 mb-md-0">
                <img src={item.data_url} alt="..." style={{ width: '120px', height: '120px' }} />
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-color h5">Price</p>
      <div className="d-flex align-items-center relative">
        <img src={tagzlogo} className="me-2" alt="..." />
        <Form.Control
          placeholder="Enter Price"
          type="number"
          className="me-2 font-weight-600 form-bg price-input-field text-color"
        />
        <span className="text-secondary create-dollar-price">($569.81)</span>
        <p className="text-color font-weight-600 mb-0">TAGD</p>
      </div>
    </div>
  )
}
export default Create
