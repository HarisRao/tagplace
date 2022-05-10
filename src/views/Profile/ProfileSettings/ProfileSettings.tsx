import React, { useState } from 'react'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { Row, Col, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { isEmpty } from 'lodash'
import LinkExternal from 'components/Link/LinkExternal'
import Flex from 'components/Box/Flex'
import CopyToClipboard from 'components/WalletModal/CopyToClipboard'
import { useLoggedInUser, useUpdateUser } from 'state/hooks'
import { useGlobalLoader } from 'components/Loader'
import placeholder from '../../../images/tagz/account_circle.png'

const ProfileSettings: React.FC = () => {
  const { isLoggedIn, isLoggingIn, user, account } = useLoggedInUser()
  const [avatar, setAvatar] = useState(user?.avatar)
  const [username, setUsername] = useState(user?.username)
  const [mailAddress, setMailAddress] = useState(user?.mailAddress)

  const errors: { [key: string]: string } = {}
  const onAvatarChange = (imageList: ImageListType) => setAvatar(imageList[0]?.data_url)
  const onUsernameChange = (value: string) => setUsername(value)
  const onMailAddressChange = (value: string) => setMailAddress(value)

  const valid = isLoggedIn && !isEmpty(user) && isEmpty(errors)
  const updateUser = useUpdateUser()
  const onSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (valid) updateUser({ avatar, username, mailAddress })
  }

  useGlobalLoader(isLoggingIn)

  return (
    <div className="container">
      <div className="content">
        <div className="mt-5 pb-4">
          <p className="h3 text-color">General Settings</p>

          {isLoggedIn ? (
            <Row className="mt-4 mb-3">
              <Col lg={6}>
                <Row>
                  <Col>
                    <p className="text-color mb-0 h5">Profile Picture</p>
                    <p className="grey-color">Upload new profile picture</p>
                    <ImageUploading value={[]} multiple onChange={onAvatarChange} dataURLKey="data_url">
                      {({ onImageUpload }) => (
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip style={{ position: 'absolute', left: '0px' }}>Click to upload an image</Tooltip>
                          }
                        >
                          <div
                            className="mt-3"
                            onClick={onImageUpload}
                            onKeyPress={onImageUpload}
                            role="button"
                            tabIndex={-1}
                            style={{ cursor: 'pointer' }}
                          >
                            <img
                              alt="..."
                              src={isEmpty(avatar) ? placeholder : avatar}
                              className={`avatar-image${isEmpty(avatar) ? ' no-value' : ''}`}
                            />
                          </div>
                        </OverlayTrigger>
                      )}
                    </ImageUploading>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Form.Group as={Col} controlId="area">
                    <Form.Label className="h5 input-color">Username</Form.Label>
                    <Form.Control
                      className="form-control text-white"
                      defaultValue={username}
                      onChange={(e) => onUsernameChange(e.target.value)}
                      placeholder="Enter Your Username"
                      isInvalid={!!errors.username}
                    />
                    {errors.username ? (
                      <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                    ) : null}
                  </Form.Group>
                </Row>

                <Row className="mt-3">
                  <Form.Group as={Col} controlId="area">
                    <Form.Label className="h5 input-color">Email address</Form.Label>
                    <Form.Control
                      className="form-control text-white"
                      defaultValue={mailAddress}
                      onChange={(e) => onMailAddressChange(e.target.value)}
                      placeholder="Enter Your Email"
                      isInvalid={!!errors.mailAddress}
                    />
                    {errors.mailAddress ? (
                      <Form.Control.Feedback type="invalid">{errors.mailAddress}</Form.Control.Feedback>
                    ) : null}
                  </Form.Group>
                </Row>

                <Row className="mt-3">
                  <Form.Group as={Col} controlId="area">
                    <Form.Label className="h5 input-color">Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      className="form-control text-white"
                      placeholder="Let the world know about you"
                    />
                  </Form.Group>
                </Row>

                <Row className="mt-5 mt-4">
                  <Col xs={12} className="d-flex justify-content-center">
                    <Button onClick={onSubmit} disabled={!valid} className="save-btn px-4">
                      Save
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          ) : null}

          {/* <Row className="mt-4 mb-3">
            <Col xs={5}>
              <Row>
                <Col>
                  <p className="text-color mb-0 h5">Profile Picture</p>
                  <p className="grey-color">Upload new profile picture</p>
                  <ImageUploading value={[]} multiple onChange={onAvatarChange} dataURLKey="data_url">
                    {({ onImageUpload }) => (
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip style={{ position: 'absolute', left: '0px' }}>Click to upload an image</Tooltip>
                        }
                      >
                        <div
                          className="mt-3 d-inline"
                          onClick={onImageUpload}
                          onKeyPress={onImageUpload}
                          role="button"
                          tabIndex={-1}
                          style={{ cursor: 'pointer' }}
                        >
                          <img
                            alt="..."
                            src={isEmpty(avatar) ? placeholder : avatar}
                            className={`avatar-image${isEmpty(avatar) ? ' no-value' : ''}`}
                          />
                        </div>
                      </OverlayTrigger>
                    )}
                  </ImageUploading>
                </Col>
              </Row>

              <Row className="mt-3">
                <Form.Group as={Col} controlId="area">
                  <Form.Label className="h5 text-color">Username</Form.Label>
                  <Form.Control
                    className="form-control text-color form-bg"
                    defaultValue={username}
                    onChange={(e) => onUsernameChange(e.target.value)}
                    placeholder="Enter Your Username"
                    isInvalid={!!errors.username}
                  />
                  {errors.username ? (
                    <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                  ) : null}
                </Form.Group>
              </Row>

              <Row className="mt-3">
                <Form.Group as={Col} controlId="area">
                  <Form.Label className="h5 text-color">Email address</Form.Label>
                  <Form.Control
                    className="form-control text-color form-bg"
                    defaultValue={mailAddress}
                    onChange={(e) => onMailAddressChange(e.target.value)}
                    placeholder="Enter Your Email"
                    isInvalid={!!errors.mailAddress}
                  />
                  {errors.mailAddress ? (
                    <Form.Control.Feedback type="invalid">{errors.mailAddress}</Form.Control.Feedback>
                  ) : null}
                </Form.Group>
              </Row>

              <Row className="mt-3">
                <Form.Group as={Col} controlId="area">
                  <Form.Label className="h5 text-color">Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    className="form-control text-color form-bg"
                    placeholder="Let the world know about you"
                  />
                </Form.Group>
              </Row>

              <Row className="mt-5 mt-4">
                <Col xs={12} className="d-flex justify-content-center">
                  <Button onClick={onSubmit} disabled={!valid} className="save-btn px-4">
                    Save
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row> */}
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings
