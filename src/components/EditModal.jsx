
const EditModal = ({setShowModal , editItem , setEditItem, handleEditConfirm}) => {
  return (
    <div className="modal-wrapper">
        <div className="modal-inner">
        <h2>Update to-do</h2>
        <input type="text" className="form-control shadow" 
        value={editItem.title} 
        onChange={(e)=>setEditItem({...editItem, title: e.target.value, date: new Date(),})}/>
        <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-success" onClick={handleEditConfirm}>Commit</button>
            <button className="btn btn-warning" onClick={()=> setShowModal(false)}>Cancel</button>
        </div>
        </div>
    </div>
  )
}

export default EditModal