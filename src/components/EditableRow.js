import React, {useState} from 'react';

const EditableRow = ({initialValues, toggleEdit, bom, setBom}) => {

    const [bomItem, setBomItem] = useState(initialValues);

    const handleChanges = (e) => {
        const updatedItem = {
            ...bomItem,
            fields: {
              ...bomItem.fields,
              [e.target.name]: e.target.value
            },
        };
        setBomItem(updatedItem);
      }

    const saveChanges = (e) => {
        const pk = parseInt(e.target.parentNode.parentNode.id);
        const newBom = bom.map((item) => {
            if (item.pk === pk) {
                return bomItem;
            }
            return item;
        });

        setBom(newBom);
        
        toggleEdit(e);
    }

    const cancelChanges = (e) => {
        toggleEdit(e);
    }

    return(
        <tr key={initialValues.pk} id={initialValues.pk}>
            <td><input type="text" name="specific_part" onChange={(e) => handleChanges(e)} defaultValue={bomItem.fields.specific_part}/></td>
            <td><input type="text" name="quantity" onChange={(e) => handleChanges(e)} defaultValue={bomItem.fields.quantity}/></td>
            <td><input type="text" name="item_unit_cost" onChange={(e) => handleChanges(e)} defaultValue={bomItem.fields.item_unit_cost}/></td>
            <td>
                <button onClick={(e) => saveChanges(e)}>Save</button>
                <button onClick={(e) => cancelChanges(e)}>Cancel</button>
            </td>
        </tr>
    )
}

export default EditableRow;