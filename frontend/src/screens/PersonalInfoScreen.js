import { useNavigate } from 'react-router-dom';
import { useEffect, useReducer } from 'react';
import { Store } from '../Store';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import React, { useState, useContext } from 'react';
import { Row } from 'react-bootstrap';
import { right } from '@popperjs/core';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, erroe: action.payload };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'FETCH_REQUEST2':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS2':
      return { ...state, users: action.payload, loading: false };
    case 'FETCH_FAIL2':
      return { ...state, loading: false, erroe: action.payload };
    default:
      return state;
  }
};

function PersonalInfoScreen() {
  const navigate = useNavigate();
  const [{ products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  const [{ users }, dispatch2] = useReducer(logger(reducer), {
    users: [],
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { user } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      dispatch2({ type: 'FETCH_REQUEST2' });
      try {
        const result = await axios.get('/api/users');
        dispatch2({ type: 'FETCH_SUCCESS2', payload: result.data });
      } catch (err) {
        dispatch2({ type: 'FETCH_FAIL2', payload: err.message });
      }
    };
    fetchData();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        //toast.success('product deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
        // fetch data again
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });

        // remove from the screen
      } catch (err) {
        console.log(err);
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <div class="card-body">
      {user && (
        <h1 style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Personal Info
        </h1>
      )}
      {user && (
        <Card className="w-100 h-80 my-3 p-3 rounded text-center">
          <Card.Body>
            <h7>
              Hello, {user.name}
              <div>
                <span style={{ fontWeight: 'bold' }}>Phone number: </span>
                {user.numberPhone}
              </div>
              <div>
                <span style={{ fontWeight: 'bold' }}>Email : </span>
                {user.email}
              </div>
              <div>
                <span style={{ fontWeight: 'bold' }}>Rating : </span>
                {users
                  .filter((users) => users.numberPhone === user.numberPhone)
                  .map((user) => user.userRating)}
              </div>
            </h7>
          </Card.Body>
        </Card>
      )}

      <div className="products">
        {user &&
          products
            .filter((products) => products.numberPhoneUser === user.numberPhone)
            .map((product) => (
              <Col
                className="align-items-stretch d-flex"
                key={product._id}
                sm={12}
                md={6}
                lg={4}
                xl={3}
                style={{ padding: '5px' }}
              >
                <Card className="w-100 h-80 my-3 p-3 rounded text-center">
                  <Link
                    style={{
                      height: '100%',
                    }}
                    to={`/product/${product._id}`}
                  >
                    <Card.Img
                      style={{
                        height: '100%',
                      }}
                      src={product.image}
                      alt={product.name}
                      variant="top"
                    />
                  </Link>
                  <Card.Body>
                    <Link to={`/product/${product._id}`}>
                      <Card.Title as="div">
                        <strong>{product.name}</strong>
                        <div style={{ color: 'black' }}>
                          {product.pauseAd ? 'Pause' : 'Active'}
                        </div>
                      </Card.Title>
                    </Link>

                    <Row>
                      <Col>
                        <Link
                          variant="outline-info"
                          to={`/EditProduct/${product._id}`}
                          class="btn btn-info"
                          style={{
                            padding: '0px 20px 0px 20px',
                            positionAlign: 'center',
                          }}
                        >
                          Edit
                        </Link>
                      </Col>
                      <Col>
                        <Button
                          variant="outline-danger"
                          to={`/info/${product._id}`}
                          class="btn btn-info"
                          style={{
                            padding: '0px 10px 0px 10px',
                            positionAlign: 'center',
                          }}
                          onClick={() => deleteHandler(product._id)}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
      </div>
    </div>
  );
}

export default PersonalInfoScreen;
