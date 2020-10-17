import React, {useState, useEffect} from 'react';
import "../src/css/table.css";
import "../src/css/spinner.css";
import ClipLoader from "react-spinners/ClipLoader";
import EditableRow from './components/EditableRow'

import { createServer, Model } from "miragejs";
const mockData = require('./mock-data.json');

// Mock server for API calls with Mirage JS
createServer({

  models: {
    bomItem: Model
  },

  seeds(server) {
    server.schema.bomItems.create(mockData.bom[0]);
    server.schema.bomItems.create(mockData.bom[1]);
    server.schema.bomItems.create(mockData.bom[2]);
    server.schema.bomItems.create(mockData.bom[3]);
  },

  routes() {
    this.namespace = "mobiusmaterials.com/api/v1";

    this.get("/bom/1001", (schema, request) => {
      return schema.bomItems.all();
    });

    this.put("/bom/1001/bomitem/:id", (schema, request) => {
      let pk = request.params.id;
      let attrs = JSON.parse(request.requestBody);
      let bomitem = schema.bomItems.findBy({
        pk: pk
      });
      return bomitem.update(attrs);
    });
  },
})


function App() {
  const [loading, setLoading] = useState(true);
  const [bom, setBom] = useState([]);
  const [rowInEdit, setRowInEdit] = useState(-1);

  useEffect(() => {
    // example PUT request
    // fetch("mobiusmaterials.com/api/v1/bom/1001/bomitem/10001", {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   pk: 10001,
    //   body: JSON.stringify(
    //       {
    //         "model":"core.bomitem",
    //         "pk":10001,
    //         "fields":{
    //            "uuid":"0b1ee8c4-03bd-4fd8-a016-226dba25f0f6",
    //            "created_at":"2020-08-27T00:38:01.689Z",
    //            "updated_at":"2020-08-27T00:38:01.689Z",
    //            "is_active":true,
    //            "bom":1001,
    //            "quantity":7,
    //            "specific_part":10004,
    //            "item_unit_cost":"0.3000"
    //         }
    //      }
    //   ),
    // })
    // .then
    (
      fetch("mobiusmaterials.com/api/v1/bom/1001")
      .then((response) => response.json())
      .then((json) => setBom(json.bomItems))
      .then(() => setLoading(false))
    )  
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
        <div className="table-container">
          <table className="bom-list-table">
            <thead>
              <tr>
                <th>Part</th>
                <th>Quantity</th>
                <th>Item unit cost</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bom.map(item => (
                rowInEdit === item.pk ?
                  <EditableRow initialValues={item} toggleEdit={toggleEdit} bom={bom} setBom={setBom} key={item.pk}/>:
                  <tr key={item.pk} id={item.pk}>
                    <td>{item.fields.specific_part}</td>
                    <td>{item.fields.quantity}</td>
                    <td>{item.fields.item_unit_cost}</td>
                    <td><button onClick={(e) => toggleEdit(e)} disabled={rowInEdit === item.pk || rowInEdit === -1 ? false : true}>Edit</button></td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  )
}

export default App;
