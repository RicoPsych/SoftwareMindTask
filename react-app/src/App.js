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
  const [list, setList] = useState([]);
  
  return (
    <div className="App">
      <header><Title /></header>
      <div className="App" style={list_style}>
        <AddProductButton setSite={setSite}/>
        <ListProducts list={list} setList={setList} setSite={setSite}/></div>
      <div className="App" style={div_style}>{site}</div>
    </div>
  );
}


function Title() {
  return <h1>Warehouse</h1>;
}

function AddProductButton(props){
  return <button onClick={() => props.setSite(<ProductDetailsAddView />)}>Add Product</button>
}

function ListProducts(props) {
  let data = props.list;
  let setData = props.setList;
  //const [data, setData] = useState([]);
  const [productsList, setList] = useState([]);
  const [reverseSort, setSorting] = useState(false);

  const update = ForceUpdate();

  useEffect(() => {
    GetProducts(setData);
    printList();
    //sortList("id");
  }, []);

  const printList = () =>{
    update();
    let new_products = [];
    for (let i = 0; i < data.length; i++){
      new_products.push(<ProductInList product={data[i]} setSite={props.setSite}/>);
    }
    setList(new_products);
  }

  const sortList = (sorting) => {

    GetProducts(setData);

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
    
    setSorting(!reverseSort);
    printList();
  }


  let tableHead = <tr>
    <th><button onClick={() => { sortList("id");}}>ID</button></th>
    <th><button onClick={() => { sortList("name");}}>Name</button></th>
    <th>Details</th></tr>;

  

  return (
    <table>
      <thead>{tableHead}</thead>
      <tbody>{productsList}</tbody>
    </table>);
}

function GetProducts(setData){
  //const dataFetch = async () => {
    // const data = await (
    //   await fetch(
    //     "http://localhost:8080/api/products"
    //   )
    // ).json();

    fetch("http://localhost:8080/api/products").then((res)=>res.json()).then((data)=>
    {
      setData(data.products);
    } )

   // };
    //dataFetch();
}

function ProductInList(props) {
  let id = props.product["product_id"];
  let name = props.product["name"];
  return (<tr>
    <td>{id}</td>
    <td>{name}</td>
    <td><button onClick={() =>GetProductDetails(id, props.setSite)}>Details</button></td>
    <td><button onClick={() =>EditProductDetails(id, props.setSite)}>Edit</button></td>
    <td><button onClick={() =>DeleteProductRequest(id)}>Delete</button></td>
        </tr>);
}
function EditProductDetails(id, setSite){
  const dataFetch = async () => {
    const data = await (
      await fetch("http://localhost:8080/api/products/"+id)
    ).json();
    console.log(data);
    setSite(<ProductDetailsEditView product={data}/>);
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


function ProductDetailsAddView(){
  const [name ,setName] = useState('');
  const [quantity ,setQuantity] = useState(0);

 return( 
  <form onSubmit={(event) => AddProductRequest(event,
  { name:name,
  quantity:quantity})}>
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
