import React, { useState } from 'react'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { Dropdown, Form } from 'react-bootstrap'
import classnames from 'classnames'
import ArtGalleries from './artgalleries/artgalleries'

const tabs = [
  { name: 'Zones', key: 'zones' },
  { name: 'Exhibitions', key: 'exhibitions' },
  { name: 'Musical', key: 'musical' },
  { name: 'Conventions', key: 'conventions' },
  { name: 'Museums', key: 'museums' },
  { name: 'Art Galleries', key: 'artgalleries' },
  { name: 'Titlename', key: 'titlename' },
]

const Explore: React.FC = () => {
  const [activeTab, setactiveTab] = useState('artgalleries')

  const toggle = (tab: string) => {
    setactiveTab(tab)
  }
  return (
    <div className="container-fluid px-3 px-sm-4 px-lg-5 my-5">
      <div className="px-0 row mx-0">
        <div className="col-lg-2 mb-lg-0 mb-3 d-flex justify-content-center justify-content-lg-start  align-items-center border-explore-right">
          <Dropdown>
            <Dropdown.Toggle className="explore-dropdown" id="dropdown-basic">
              Location
            </Dropdown.Toggle>

            <Dropdown.Menu className="explore-drop-menu">
              <div className="ps-3 py-2">
                <Form.Check label="Fixed" className="mb-1 location-checkbox" id="Fixed" />
                <Form.Check label="Relocatable" className="mb-1 location-checkbox" id="Relocatable" />
                <Form.Check label="Come to user" className="mb-1 location-checkbox" id="Come to user" />
              </div>
              {/* <Dropdown.Item className="explore-drop-item">relocatable</Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="col-lg-10 px-0 px-lg-2">
          <Nav tabs className="border-0 d-flex justify-content-center">
            {tabs.map((tab) => {
              return (
                <NavItem>
                  <NavLink
                    className={`${classnames({ active: activeTab === `${tab.key}` })} pointer explore-tabs`}
                    onClick={() => {
                      toggle(`${tab.key}`)
                    }}
                  >
                    {tab.name}
                  </NavLink>
                </NavItem>
              )
            })}
          </Nav>
        </div>
      </div>
      <TabContent activeTab={activeTab} className="my-5 pt-4">
        <TabPane tabId="artgalleries">
          <ArtGalleries />
        </TabPane>
      </TabContent>
    </div>
  )
}
export default Explore
