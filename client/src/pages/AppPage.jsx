import React, { useEffect, useState } from 'react'
import { Pencil, Trash2, Save, XCircle } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast";

const AppPage = () => {

  const [text, setText] = useState("")
  const [quotes, setQuotes] = useState([])
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const getQuotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/quotes")
      setQuotes(res.data);
    } catch (err) {
      toast.error("Failed to fetch")
    }

  }


  useEffect(() => {
    getQuotes();
  }, []);

  const handleAdd = async () => {
    if (!text.trim()) {
      toast.error("Please fill the Quote")
    }
    try {
      await axios.post("http://localhost:5000/api/quotes", { text });
      toast.success("Successfully Added")
    } catch (err) {
      toast.error("Quote didn't Added")
    }
    setText("");
    getQuotes();
  }

  const startEdit = (id, text) => {

    setEditingId(id);
    setEditingText(text);


  }


  const handleUpdate = async () => {
    if (!editingText.trim()) {
      alert("Please fill the Quote")
    }
    try {
      await axios.put(`http://localhost:5000/api/quotes/${editingId}`, { text: editingText })
      toast.success("Updated Successfully")
      setEditingId(null)
      setEditingText("")
      getQuotes()
    } catch (error) {
      toast.error("Update Failed")
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Are deleting this ?")) {
      await axios.delete(`http://localhost:5000/api/quotes/${id}`)
      toast.success("Successfully Deleted")
      getQuotes();
    }
  }

  const handleCancel = () => {
    setEditingId(null);
    setEditingText("")
  }



  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-300 to-pink-300 py-12 px-4 md:px-10'>
      <h1 className='text-4xl font-bold mb-10 text-center text-purple-800'>
        Quotes Sea 📝🌊
      </h1>


      {/* Create from */}

      <div className='max-w-xl mx-auto flex gap-5 mb-10'>
        <input type="text"
          placeholder='Type your quotes...'
          className='w-full px-4 py-2 rounded-md border border-gray-400 shadow-sm'
          value={text}
          onChange={(e) => setText(e.target.value)} />
        <button className='bg-purple-800 text-white px-6 py-2 rounded-md hover:bg-purple-900 font-bold cursor-pointer shadow' onClick={handleAdd}>Add</button>
      </div>

      {/* Quote list */}

      <div className='max-w-xl mx-auto  space-y-4'>
        {quotes.map((q) => (
          <div key={q._id} className='bg-gradient-to-r from-gray-200 to-white shadow-md rounded-lg p-4 flex flex-col'>
            {editingId === q._id ? (
              <div className='flex gap-2'>
                <input type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className='w-full px-3 py-2 border rounded-md' />

                <div className='flex gap-2'>
                  <button className='bg-purple-700 hover:cursor-pointer text-white px-3 py-2 rounded-md flex items-center gap-1' onClick={handleUpdate}>
                    <Save size={16}/>Save
                  </button>
                  <button className='bg-red-500 hover:cursor-pointer text-white px-3 py-2 rounded-md flex items-center gap-1' onClick={handleCancel}>
                    <XCircle size={16}/>Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className='flex justify-between items-center w-full'>
                <p>{q.text}</p>
                <div className='flex gap-5'>
                  <button className='flex items-center gap-1 bg-purple-800 text-white font-bold px-3 py-2 rounded-md cursor-pointer shadow-md hover:bg-purple-900' onClick={() => startEdit(q._id, q.text)}>
                    <Pencil size={16} />Edit
                  </button>

                  <button className='flex items-center gap-1 bg-red-500 text-white font-bold px-3 py-2 rounded-md cursor-pointer shadow-md hover:bg-red-600' onClick={() => handleDelete(q._id)}>
                    <Trash2 size={16} />Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AppPage
