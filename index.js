import React from 'react';
import ReactDOM from 'react-dom/client';

import {useState,useEffect} from 'react';

      

function Title() {
  return <h1>Warehouse</h1>;
}

function ProductInList(props){
  fetch('http://localhost:8080/api/products')
}


function ListProducts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const dataFetch = async () => {
    const data = await (
      await fetch(
        "http://localhost:8080/api/products"
      )
    ).json();
    setData(data);
    };

    dataFetch();
  }, []);

  // return <h1>{GetProducts()}</h1>;
}

function GetProducts(){
  useEffect(() => {
    fetch('http://localhost:8080/api/products')
    .then(res => res.json())
    .then((data) => {console.log(data);})
    .catch((err) => {
      console.log(err.message);
    });
    },[]);
  }


ReactDOM.createRoot(document.getElementById('title')).render(<Title/>);
ReactDOM.createRoot(document.getElementById('list')).render(<ListProducts/>);