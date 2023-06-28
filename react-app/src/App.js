import React from 'react';
import ReactDOM from 'react-dom/client';
import { useRef } from 'react';

import {useState,useEffect} from 'react';

import './App.css';

const list_style = {
  float:"left",
  width:"45%"
}
const div_style = {
  float:"right",
  width:"45%"
}



function App() {
  const [site, setSite] = useState([]);
  const [data, setData] = useState([]);
  const [counter, setCounter] = useState([]);

  let getProducts = () => GetProducts(setData);

  return (
    <div className="App">
      <header><Title /></header>
      <div className="App" style={list_style}>
        <AddProductButton setSite={setSite} getProducts={getProducts}/> 
        <FindProductModule setSite={setSite}/>
        <ListProducts data={data} getProducts={getProducts} setData={setData} setSite={setSite} key={data.length}/></div>
      <div className="App" style={div_style}>{counter}{site}</div>

      <GetRequestsAmount setSite={setCounter}/>
    </div>
  );
}

function Title() {
  return <h1>Warehouse</h1>;
}

function AddProductButton(props){
  return <button onClick={() => props.setSite(<ProductDetailsAddView getProducts={props.getProducts}/>)}>Add Product</button>
}

function FindProductModule(props){
  const [query, setQuery] = useState("");

  return <div><input type="text" id="query" name="query" onChange={(event) => setQuery(event.target.value)}/>
  <button onClick={()=>{
    if(query.length > 0)
      GetProductsByName(query, props.setSite);}
  }>Find</button></div>
}

function sortData(data, sorting, reverseSort){
  if(sorting == "name"){
    if (reverseSort == false){
      data.sort((a,b) => (a.name > b.name) ? 1 : -1);
    }
    else{
      data.sort((a,b) => (a.name < b.name) ? 1 : -1);
    }
  }
  else if (sorting == "id"){
    if (reverseSort  == false){
      data.sort((a,b) => (a.product_id > b.product_id) ? 1 : -1);
    }
    else{
      data.sort((a,b) => (a.product_id < b.product_id) ? 1 : -1);
    }
  }
  
}

function ListProducts(props) {
  let getProducts = props.getProducts;
  let data = props.data;
  let setData = props.setData;
  const [productsList, setList] = useState([]);
  const [reverseSort, setReverseSortingOrder] = useState(false);
  const [sorting, setSorting] = useState("id");

  useEffect(() => {
    getProducts(setData);
    sortList(sorting);

  }, []);


  const sortList = (new_sort) => {
    if(sorting != new_sort){
      setReverseSortingOrder(false);
    } 
    else{
      setReverseSortingOrder(!reverseSort);
    }
    setSorting(new_sort);
    getProducts(setData);
    sortData(data,new_sort,reverseSort);
    setList(data.map((value) => <ProductInList data={data} setData={setData} product={value} setSite={props.setSite} key={value.product_id}/>));
  }


  let tableHead = <tr>
    <th><button onClick={() => {sortList("id");}}>ID</button></th>
    <th><button onClick={() => {sortList("name");}}>Name</button></th>
    <th>Details</th></tr>;

  return (
    <table>
      <thead>{tableHead}</thead>
      <tbody>{productsList}</tbody>
    </table>);
}



function GetRequestsAmount(props){
    const [time, setTime] = useState(Date.now());
    useEffect(()=>{
      const interval = setInterval(() => {setTime(Date.now())
        console.log("fetch")
        fetch("http://localhost:8080/api/products/rq_amount").then((res)=>res.json()).then((data)=> {
        props.setSite(<h1>Requests Count:{data}</h1>);});
      }, 4000);


      return () => {
        clearInterval(interval);
    }}, []);


}


function GetProducts(setData){
    fetch("http://localhost:8080/api/products").then((res)=>res.json()).then((data)=>
    {
      setData([...data.products]);
    } );
}




function ProductInList(props) {
  let id = props.product["product_id"];
  let name = props.product["name"];
  return (<tr>
    <td>{id}</td>
    <td>{name}</td>
    <td><button onClick={() =>GetProductDetails(id, props.setSite)}>Details</button></td>
    <td><button onClick={() =>EditProductDetails(id, props.setSite)}>Edit</button></td>
    <td><button onClick={() =>{DeleteProductRequest(id); GetProducts(props.setData) }}>Delete</button></td>
        </tr>);
}
function EditProductDetails(id, setSite){
  const dataFetch = async () => {
    const data = await (
      await fetch("http://localhost:8080/api/products/"+id)
    ).json();
    console.log(data);
    setSite(<ProductDetailsEditView product={data} key={id}/>);
  };
  dataFetch();

}


function ListQueriedProducts(props){
  const [productsList, setList] = useState([]);
  const [reverseSort, setSorting] = useState(false);
  //const [data, setData] = useState(props.products)
  var data = props.products;
  useEffect(() => {
    sortList("id");
  }, []);


  const sortList = (sorting) => {
    data = props.products;
    sortData(data,sorting,reverseSort);
    
    setSorting(!reverseSort);
    setList(data.map((value) => <ProductInList product={value} setSite={props.setSite} key={value.product_id}/>));
  }


  let tableHead = <tr>
    <th><button onClick={() => { sortList("id"); }}>ID</button></th>
    <th><button onClick={() => { sortList("name"); }}>Name</button></th>
    <th>Details</th></tr>;
  return (
    <table>
      <thead>{tableHead}</thead>
      <tbody>{data.map((value) => <ProductInList product={value} setSite={props.setSite} key={value.product_id}/>)}</tbody>
    </table>);
}

function GetProductsByName(query, setSite){
  const dataFetch = async () => {
    const data = await (
      await fetch("http://localhost:8080/api/products/find/"+query)
    ).json();
    console.log(data);
    setSite(<ListQueriedProducts products={data.products} setSite={setSite} key={data.products}/>);
  };
  dataFetch();
}


function ProductDetailsEditView(props){
  const [name ,setName] = useState(props.product.name);
  const [quantity ,setQuantity] = useState(props.product.quantity);

 return( 
  <form onSubmit={(event) => UpdateProductRequest(event,
  {id: props.product.product_id,
  name:name,
  quantity:quantity}
  )}>
  <label><b>Update Product</b></label> <br/>
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" value={name}
      onChange={(event) => setName(event.target.value)}/><br/>

  <label for="quantity">Quantity</label>
  <input type="number" id="quantity" name="quantity" value={quantity}  
      onChange={(event) => setQuantity(event.target.value)}/><br/>

  <input type="submit" value="Submit"/>
  </form>) ;
}
function UpdateProductRequest(event,state){
  event.preventDefault();

  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({name: state.name,quantity: state.quantity})
  };
  fetch('http://localhost:8080/api/products/'+state.id, requestOptions);
}




function GetProductDetails(product_id,setSite){
  const dataFetch = async () => {
    const data = await (
      await fetch("http://localhost:8080/api/products/"+product_id)
    ).json();
    console.log(data);
    setSite(<ProductDetailsView product={data}/>);
  };
  dataFetch();
}

function ProductDetailsView(props){
  return (<div><h1>{props.product.name}</h1><h4>id:{props.product.product_id}</h4>
  <h4>quantity:{props.product.quantity}</h4></div>)
}


function ProductDetailsAddView(props){
  const [name ,setName] = useState('');
  const [quantity ,setQuantity] = useState(0);

 return( 
  <form onSubmit={(event) => {AddProductRequest(event,
  { name:name,
  quantity:quantity}); props.getProducts();}}>
  <label><b>Add Product</b></label><br/>
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" value={name}
      onChange={(event) => setName(event.target.value)}/><br/>

  <label for="quantity">Quantity</label>
  <input type="number" id="quantity" name="quantity" value={quantity}  
      onChange={(event) => setQuantity(event.target.value)}/><br/>

  <input type="submit" value="Submit"/>
  </form>) ;
}

function AddProductRequest(event,state){
  event.preventDefault();

  const requestOptions = {
    method: 'Post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({name: state.name,quantity: state.quantity})
  };
  fetch('http://localhost:8080/api/products', requestOptions);
}

function DeleteProductRequest(id){
  const requestOptions = {
    method: 'Delete'
  };
  fetch('http://localhost:8080/api/products/'+id, requestOptions);
}

function ForceUpdate(){
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}


export default App;
