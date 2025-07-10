import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { targetGroups } from '../data/target_group';

const TrainingFilterBar = ({ filters, setFilters, handleClear }) => {
  return (
    <div className="card mb-3 p-3">
      <Form>
        <Row className="g-3 align-items-center">
          {/* Location Filter */}
          <Col md={4}>
            <Form.Label>Location</Form.Label>
            <Form.Select
              value={filters.venue}
              onChange={(e) => setFilters({ ...filters, venue: e.target.value })}
            >
              <option value="">All Locations</option>
              <option value="IRDT">IRDT</option>
              <option value="NITTTR Chandigarh">NITTTR Chandigarh</option>
              <option value="ESTC Ramnagar Outstation">ESTC Ramnagar Outstation</option>
              <option value="NITTTR Bhopal">NITTTR Bhopal</option>
              <option value="IUCTE, Varanasi(UP)">IUCTE, Varanasi(UP)</option>
              <option value="IET, Luckhnow(UP)">IET, Luckhnow(UP)</option>
              <option value="NCB Ballabgarh (Out Station)">NCB Ballabgarh (Out Station)</option>
            </Form.Select>
          </Col>

          {/* Branch Filter */}
          <Col md={4}>
            <Form.Label>Branch</Form.Label>
            <Form.Select
              value={filters.target_group}
              onChange={(e) => setFilters({ ...filters, target_group: e.target.value })}
            >
              <option value="">All Branches</option>
              {targetGroups.map((group, idx) => (
                <option key={idx} value={group}>{group}</option>
              ))}
            </Form.Select>
          </Col>

          {/* Mode Filter */}
          <Col md={4}>
            <Form.Label>Mode</Form.Label>
            <Form.Select
              value={filters.mode}
              onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
            >
              <option value="">All Modes</option>
              <option value="Contact">Contact</option>
              <option value="Online">Online</option>
            </Form.Select>
          </Col>

          {/* Single Date Filter */}
          <Col md={4}>
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={filters.start_date || ''}
              onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
            />
          </Col>

          {/* Clear Filters Button */}
          <Col md={4} className="mt-4">
            <Button variant="outline-secondary" onClick={handleClear}>
              Clear Filters
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default TrainingFilterBar;
