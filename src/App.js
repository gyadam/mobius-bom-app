import React, {useState, useEffect} from 'react';
import "../src/css/app.css";
import "../src/css/table.css";
import "../src/css/spinner.css";
import ClipLoader from "react-spinners/ClipLoader";
import EditableRow from './components/EditableRow';

import { createServer, Model, RestSerializer } from "miragejs";

// start mock server with mock data, then use sessionStorage to persist state
const mockData = require('./mock-data.json');
const sessionData = JSON.parse(sessionStorage.getItem("mockData"));
const data = sessionData ? sessionData.bomItems : mockData.bom;

// mock server for API calls with Mirage JS
createServer({

  models: {
    bomItem: Model
  },

  serializers: {
    application: RestSerializer,
  },

  seeds(server) {
    server.schema.bomItems.create(data[0]);
    server.schema.bomItems.create(data[1]);
    server.schema.bomItems.create(data[2]);
    server.schema.bomItems.create(data[3]);
  },

  routes() {
    this.namespace = "mobiusmaterials.com/api/v1";

    this.get("/bom/1001", function(schema, request){
      return schema.bomItems.all();
    });

    this.put("/bom/1001/bomitem/:id", function(schema, request){
      let pk = request.params.id;
      let attrs = JSON.parse(request.requestBody);
      let bomitem = schema.bomItems.findBy({
        pk: pk
      });
      const updatedBomitem = bomitem.update(attrs);

      const json = JSON.stringify(this.serialize(schema.bomItems.all()));
      sessionStorage.setItem("mockData", json);

      return updatedBomitem;
    });

    this.passthrough();
  },
})


function App() {
  const [loading, setLoading] = useState(true);
  const [bom, setBom] = useState([]);
  const [rowInEdit, setRowInEdit] = useState(-1);
  const [error, setError] = useState(false);
  const [bomID, setBomID] = useState(1001);

  function handleErrors(response) {
    if (!response.ok) {
      setError(true);
      setLoading(false);
      throw Error(response.statusText);
    }
    return response;
  }

  
  useEffect(() => {
    async function loadBomData(){
      try{
        const response = await fetch(`mobiusmaterials.com/api/v1/bom/${bomID}`);
        handleErrors(response);
        const data = await response.json();
        setBom(data.bomItems);
        setLoading(false);
      }
      catch(error){
        setError(true);
        setLoading(false);
      }
    }

    loadBomData();
  }, [])

  const toggleEdit = (e) => {
    e.target.blur();
    if (parseInt(e.target.parentNode.parentNode.id) === rowInEdit){
      setRowInEdit(-1);
    } else{
      setRowInEdit(parseInt(e.target.parentNode.parentNode.id))
    }
  }
  
  return (
    <div className="App">
      {loading ?
        <div className="spinner-container"><ClipLoader color="#0ab1a8"></ClipLoader></div> :
        <div>
          <h1 className="page-title">Bill of materials</h1>
          <h3 className="bom-id">BOM ID: {1001}</h3>
          <div className="table-container">
            <table className="bom-list-table">
              <thead>
                <tr>
                  <th></th>
                  <th>#</th>
                  <th>Part number</th>
                  <th>Quantity</th>
                  <th>Item unit cost</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {error ?
                <tr><td colSpan={4} className="error-text">Oops! An error occured</td></tr> :
                bom.map((item, index) => (
                  rowInEdit === item.pk ?
                    <EditableRow initialValues={item} toggleEdit={toggleEdit} bom={bom} setBom={setBom} key={item.pk} index={index}/>:
                    <tr key={item.pk} id={item.pk}>
                      <td></td>
                      <td>{index + 1}</td>
                      <td>{item.fields.specific_part}</td>
                      <td>{item.fields.quantity}</td>
                      <td>{item.fields.item_unit_cost}</td>
                      <td><button onClick={(e) => toggleEdit(e)} disabled={rowInEdit === item.pk || rowInEdit === -1 ? false : true}>Edit</button></td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h5 className="footer-text">Made with <span role="img" aria-label="react-icon">⚛️</span> by Adam Gyarmati</h5>
        </div>
      }
    </div>
  )
}

export default App;
