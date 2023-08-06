import { Suspense, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
import './App.css'
import { v4 as uuidv4 } from 'uuid';
import EditModal from './components/EditModal'

function App() {

  const [todos, setTodos] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [page, setPage] = useState(1);

  axios.defaults.baseURL = "http://localhost:3030"

  const options = {
    _limit: 5,
    _page: page,
  }

  useEffect(()=>{
    axios.get(`/todos`, {params: options , timeout: 5000})
    .then((res)=> setTodos(res.data))
    .catch((err)=> alert("Your connection has timed out!"))
    
  },[page]);

  const handleSubmit = (e)=>{
    // forumun yenilenmesini durdur
    e.preventDefault();
    // new todo oluşturma
    const newTodos = {
      date : new Date(),
      id: uuidv4(), // uuid eşsiz id
      title: e.target[0].value,
      isDone: false,
    };
    // input boş ise değer ekleme
    if(e.target[0].value == "") return;
    // newTodo yu json a ekleme
    axios.post(`/todos`, newTodos)
    .then(()=> setTodos([...todos, newTodos]))
    .catch(()=> alert("Sorry, we encountered an error!"))

    // submit olduktan sonra input u sıfırlama
    e.target[0].value= ""
  };

  // del btn olayı
  const handleDelete = (delete_id) =>{
    axios.delete(`/todos/${delete_id}`)
    .then(()=> {
      const updatedTodos = todos.filter((todo)=> todo.id !== delete_id);
      setTodos(updatedTodos);
    })
    .catch(()=> alert("An error occurred while deleting!"))
  };

  // checked değeri düzenleme
  const handleCheckboxClick = (todo)=> {
    const updatedTodo = {...todo, isDone: !todo.isDone};

    axios.put(`/todos/${todo.id}`, updatedTodo)
    .then(()=> {
      const filtred = todos.map((item)=> item.id === todo.id ? updatedTodo : item)
      setTodos(filtred);
    })
    .catch((err)=> {
      if(err.code === "ECONNABORTED"){
        
        alert("The server is unreachable!")
      }else{
        console.log(err)
      }
    })
  };

  // modal aç kapa
  const handleModal = (todo)=> {
    setShowModal(true)
    setEditItem(todo)

  }

  // düzenle butonunu aktif
  const handleEditConfirm = ()=>{
    axios.put(`/todos/${editItem.id}`, editItem)
    .then(()=> {
      const clone = [...todos];
      const index = clone.findIndex((i)=> i.id === editItem.id)
      clone[index] = editItem
      if(index === -1) return;
      setTodos(clone)
      setShowModal(false)
    })
    .catch(()=> alert("The server is unreachable!"))
  }
  
  return (
    <>
    <div className='container'>

    <h1 className='text-center'>Transactions</h1>

    

    <form onSubmit={handleSubmit} className='d-flex gap-3 my-3'>
      <input type="text" className='form-control' />
      <button className='btn btn-primary'>Add</button>
    </form>

    {/* todos yok ise henüz ekrana yükleniyor yaz */}
    {!todos && <h2 className='text-center mt-3'>Loading...</h2> }

    <ul className='list-group'>
      {todos?.map((todo)=>(
        <li key={todo.id} className='list-group-item d-flex justify-content-between align-items-center text-center'>
          <div className='d-flex gap-2'>
          <input checked={todo.isDone} onClick={()=>handleCheckboxClick(todo)} type="checkbox" className='form-check-input' />
          <span>{todo.title}</span>
          </div>
          
          <span> {todo.isDone ? "Tamamlandı." : "Devam ediyor."}</span>
          <div className='gap-2 d-flex'>
          <button className='btn btn-success' onClick={()=>handleModal(todo)}>Edit</button>
          <button onClick={()=>handleDelete(todo.id)} className='btn btn-danger'>Delete</button>
          </div>
        </li>
      ))}
    </ul>
        
        <div className='d-flex gap-3 justify-content-center align-center'>
          <button 
          className='btn btn-secondary'
          disabled={page === 1} 
          onClick={()=>{
            setPage(page - 1)
          }}>Back</button>
          <p className='lead fw-bold'>{page}</p>
          <button 
          className='btn btn-success' 
          onClick={()=> setPage(page + 1)}
          >Next</button>
        </div>

        {showModal && <EditModal 
        setEditItem={setEditItem} 
        editItem={editItem} 
        setShowModal={setShowModal} 
        handleEditConfirm = {handleEditConfirm} />}
    </div>
    </>
  )
}

export default App;
