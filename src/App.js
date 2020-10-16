import React, {useState, useEffect} from 'react';
import "../src/css/table.css";
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
  let [bom, setBom] = useState([]);

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
    )  
  }, [])
  
  return (
    <div className="App">
      <table className="bom-list-table">
        <thead>
          <tr>
            <th>Part</th>
            <th>Quantity</th>
            <th>Item unit cost</th>
          </tr>
        </thead>
        <tbody>
          {bom.map(item => (
            <tr key={item.pk}>
              <td>{item.fields.specific_part}</td>
              <td>{item.fields.quantity}</td>
              <td>{item.fields.item_unit_cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App;
