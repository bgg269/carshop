import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Addcar from './Addcar';
import Editcar from './Editcar';
import { CSVLink } from "react-csv";
import Grid from '@material-ui/core/Grid';

const Carlist = () => {
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCars();
  }, [])

  const handleClose = (event, reason) => {
    setOpen(false);
  };  
  const fetchCars = () => {
    fetch('https://carstockrest.herokuapp.com/cars')
    .then(response => response.json())
    .then(data => setCars(data._embedded.cars))
    .catch(err => console.error(err))
  }

  const deleteCar = (link) => {
    if (window.confirm('Are you sure?')) {
      fetch(link, {method: 'DELETE'})
      .then(res => fetchCars())
      .then(res => setMessage('Car deleted'))
      .then(res => setOpen(true))
      .catch(err => console.error(err))
    }
  }

  const saveCar = (newCar) => {
    fetch('https://carstockrest.herokuapp.com/cars',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCar)
      }
    )
    .then(res => fetchCars())
    .catch(err => console.error(err))
  }

  const updateCar = (car, link) => {
      fetch(link, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(car)
      })
      .then(res => fetchCars())
      .then(res => setMessage('Changes saved succesfully'))
      .then(res => setOpen(true))
      .catch(err => console.error(err))
  }
  
  const columns = [
    {
      Header: 'Brand',
      accessor: 'brand'
    },
    {
      Header: 'Model',
      accessor: 'model'
    },
    {
      Header: 'Year',
      accessor: 'year'
    },
    {
      Header: 'Fuel',
      accessor: 'fuel'
    },
    {
      Header: 'Color',
      accessor: 'color'
    },
    {
      Header: 'Price (€)',
      accessor: 'price'
    },
    {
        filterable: false,
        sortable: false,
        width: 100,
        Cell: row => <Editcar updateCar={updateCar} car={row.original} />
    },
    {
      accessor: '_links.self.href',
      filterable: false,
      sortable: false,
      Cell: ({value}) => <Button size="small" color="secondary" onClick={() => deleteCar(value)}>Delete</Button>
    },
  ]

  return (
    <div>
        <Grid container>    
        <Grid item>       
          <Addcar saveCar={saveCar} />      
      </Grid>
      <Grid style={{padding: 15}} item>
      <CSVLink data={cars}>Export data</CSVLink>
      </Grid>
      </Grid>
      <ReactTable filterable={true} columns={columns} data={cars}/>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message={message} />
    </div>
  );
}

export default Carlist;