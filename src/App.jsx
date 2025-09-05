import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';

function App() { 

  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setshowFinished] = useState(true)

  // Load todos from localStorage on first render
  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if(todoString){
      let storedTodos = JSON.parse(todoString) 
      setTodos(storedTodos)
    }
  }, [])
  
  // Helper function to save updated todos
  const saveToLS = (updatedTodos) => {
    localStorage.setItem("todos", JSON.stringify(updatedTodos))
  }

  const toggleFinished = () => {
    setshowFinished(!showFinished)
  }

  const handleEdit = (e, id)=>{ 
    let t = todos.filter(i=>i.id === id) 
    setTodo(t[0].todo)
    let newTodos = todos.filter(item=> item.id!==id); 
    setTodos(newTodos) 
    saveToLS(newTodos)
  }

  const handleDelete= (e, id)=>{  
    let newTodos = todos.filter(item=> item.id!==id); 
    setTodos(newTodos) 
    saveToLS(newTodos)
  }

  const handleAdd= ()=>{ 
    if (todo.trim().length > 3) {
      let newTodo = {
        id: uuidv4(), 
        todo, 
        isCompleted: false,
        createdAt: new Date().toLocaleString() // ✅ store date + time
      }
      let newTodos = [...todos, newTodo]
      setTodos(newTodos)
      setTodo("") 
      saveToLS(newTodos)
    }
  }
  
  const handleChange= (e)=>{ 
    setTodo(e.target.value)
  }

  const handleCheckbox = (e) => { 
    let id = e.target.name;  
    let index = todos.findIndex(item=> item.id === id) 
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos)
    saveToLS(newTodos)
  }
  
  return (
    <>
      <Navbar/> 
      <div className="mx-3 md:container md:mx-auto my-10 rounded-2xl shadow-lg p-6 bg-gradient-to-br from-violet-200 to-violet-100 min-h-[80vh] md:w-[40%]">
        <h1 className='font-extrabold text-center text-4xl text-violet-900 mb-6 tracking-tight'>
          LetsDo <span className="text-violet-700">— Manage your Work Todo</span>
        </h1>
        
        {/* Add Todo Section */}
        <div className="addTodo mb-8">
          <h2 className='text-2xl font-semibold text-violet-800 mb-3'>✨ Add a Todo</h2>
          <div className="flex items-center gap-2">
            <input  
              onChange={handleChange} 
              value={todo} 
              type="text" 
              placeholder="Enter your task..."
              className='flex-1 rounded-full border border-violet-300 focus:ring-2 focus:ring-violet-500 focus:outline-none px-5 py-2 text-gray-700'
            />
            <button 
              onClick={handleAdd} 
              disabled={todo.length<=3} 
              className='bg-violet-700 hover:bg-violet-900 disabled:bg-violet-400 rounded-full px-6 py-2 text-sm font-semibold text-white transition-all'
            >
              Save
            </button>
          </div>
        </div>

        {/* Show Finished Toggle */}
        <div className="flex items-center mb-6">
          <input 
            id='show' 
            onChange={toggleFinished} 
            type="checkbox" 
            checked={showFinished} 
            className="h-4 w-4 text-violet-700 border-gray-300 rounded"
          /> 
          <label className='ml-2 text-gray-700 text-sm font-medium' htmlFor="show">Show Finished</label> 
        </div>

        {/* Divider */}
        <div className='h-[1px] bg-gray-300 w-[90%] mx-auto my-4'></div>

        {/* Todo List */}
        <h2 className='text-2xl font-semibold text-violet-800 mb-4'>📌 Your Todos</h2>
        <div className="todos space-y-3">
          {todos.length ===0 && 
            <div className='text-center text-gray-500 italic'>No Todos to display</div> 
          }

          {todos.map(item=>{
            return (showFinished || !item.isCompleted) && (
              <div 
                key={item.id} 
                className="todo flex flex-col bg-white rounded-xl shadow-sm px-4 py-3 transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div className='flex items-center gap-3'> 
                    <input 
                      name={item.id} 
                      onChange={handleCheckbox} 
                      type="checkbox" 
                      checked={item.isCompleted} 
                      className="h-4 w-4 text-violet-600 border-gray-300 rounded"
                    />
                    <div className={`text-gray-800 ${item.isCompleted ? "line-through text-gray-400" : ""}`}>
                      {item.todo}
                    </div>
                  </div>
                  <div className="buttons flex gap-2">
                    <button 
                      onClick={(e)=>handleEdit(e, item.id)} 
                      className='bg-violet-600 hover:bg-violet-800 p-2 text-white rounded-md shadow-sm transition-all'
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={(e)=>{handleDelete(e, item.id)}} 
                      className='bg-red-500 hover:bg-red-700 p-2 text-white rounded-md shadow-sm transition-all'
                    >
                      <AiFillDelete />
                    </button>
                  </div> 
                </div>
                {/* ✅ Date & Time */}
                <div className="text-xs text-gray-500 mt-1">
                  Added on: {item.createdAt}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default App
