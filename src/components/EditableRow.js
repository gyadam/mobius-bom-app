import React, {useState} from 'react';
import ClipLoader from "react-spinners/ClipLoader";

const EditableRow = ({initialValues, toggleEdit, bom, setBom, index}) => {

    const [bomItem, setBomItem] = useState(initialValues);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleChanges = (e) => {
        let inpVal = e.target.value;
        if(e.target.name === "item_unit_cost"){
            inpVal = parseFloat(inpVal).toFixed(4);
        } else if(e.target.name === "quantity"){
            inpVal = parseInt(inpVal, 10);
        }
        const updatedItem = {
            ...bomItem,
            fields: {
              ...bomItem.fields,
              [e.target.name]: inpVal,
              updated_at: new Date()
            },
        };
        setBomItem(updatedItem);
      }

    function handleErrors(response) {
        if (!response.ok) {
            setError(true);
            setLoading(false);
            alert(`The following error occured while updating the BOM: ${response.status} ${response.statusText}`);
            throw Error(response.statusText);
        }
        return response;
    }

    async function saveChanges(e){
        e.persist()
        e.preventDefault();
        setLoading(true);

        const pk = parseInt(e.target.parentNode.parentNode.id);
        const newBom = bom.map((item) => {
            if (item.pk === pk) {
                return bomItem;
            }
            return item;
        });

        try{
            const response = await fetch(`mobiusmaterials.com/api/v1/bom/1001/bomitem/${pk}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                pk: pk,
                body: JSON.stringify(
                    bomItem
                ),
            });
            handleErrors(response);
            setBom(newBom);
            setLoading(false);
            toggleEdit(e);
        }
        catch(error){
          setError(true);
          alert(`The following error occured while updating the BOM: ${error}`);
          setLoading(false);
        }
    }

    const cancelChanges = (e) => {
        toggleEdit(e);
    }

    return(
        <tr key={initialValues.pk} id={initialValues.pk}>
            <td><form id="row-form" onSubmit={saveChanges}></form></td>
            <td>{index + 1}</td>
            <td><input type="text" form="row-form" name="specific_part" required onChange={handleChanges} defaultValue={bomItem.fields.specific_part}/></td>
            <td><input type="number" min="0" form="row-form" name="quantity" required onChange={handleChanges} defaultValue={bomItem.fields.quantity}/></td>
            <td><input type="number" min="0" step="0.0001" form="row-form" name="item_unit_cost" required onChange={handleChanges} defaultValue={bomItem.fields.item_unit_cost}/></td>
            <td className="button-cell">
                {loading ?
                [<span className="button-spinner">
                    <ClipLoader size={20} color={"#0ab1a8"}/>
                </span>,
                <button key="cancel" onClick={cancelChanges}>Cancel</button>
                ] :
                [
                    <input key="save" type="submit" form="row-form" value="Save"/>,
                    <button key="cancel" onClick={cancelChanges}>Cancel</button>
                ]
                }
            </td>
        </tr>
    )
}

export default EditableRow;