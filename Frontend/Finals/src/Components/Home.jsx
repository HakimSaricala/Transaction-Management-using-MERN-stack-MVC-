import React from 'react'
import { useEffect, useState,  useRef } from "react";
import axios from 'axios';
import Form from './form'
import Warning from './warning';

// const API_KEY = process.env
const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [editMode, setEditMode] = useState(false);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isdelete,setDelete] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [Date, setDate]=useState("");
  const [Owner,setOwner]=useState("");
  const [Weight, setWeight] = useState(0);
  const [Quality,setQuality]=useState('');
  const [Mode, setMode]= useState('');
  const [Amount, setAmount]=useState(0);
  const [isSaved, setSave] = useState(false);
  const [update,setUpdate] = useState(false);
  const [_id, set_id]=useState("");
  const [searchName, setSearchName]=useState("");
  const [find, setFind]=useState(false);
  const modalRef = useRef(null);
  const token = localStorage.getItem('authToken');
  
 
 
  useEffect(() => {
    if(isSaved==true){
      createTrans();
      setSave(false)
    }
   
    
  }, [isSaved]);

  useEffect(() => {
    if(update==true){
      updateTransaction(_id);
      setUpdate(false);
      set_id('');
    }
  }, [update]);

  useEffect(() => {
    if(isdelete==true){
      deleteTransaction(_id);
      setDelete(false)
  
    }
  }, [isdelete]);

  useEffect(() => {
    
    fetchTransactions();

  }, [isSaved,update,isdelete]);
  
  //Add data
  const openModal = () => {
    set_id('');
    modalRef.current.showModal();
    
    setEditMode(false)

  }
  //Edit Data
  const updateData = async (id) => {
    try {
      await fetchbyId(id);
      modalRef.current.showModal();
      console.log(id);
    } catch (err) {
      console.error('Error updating data:', err);
    }
  }

  const clear = ()=> {
    setDate("");
    setOwner("");
    setWeight(0);
    setQuality('');
    setMode('');
    setAmount(0);
    setSave(false);
  }
  const handleToggle = () => {
    setEditMode(!editMode);
  };
 

  



  //get data
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}transactions`, {
        headers: {
          Authorization: `Bearer ${token}` // Use the token obtained after login
        }
      });
      
      if (response.status === 200) {
        // Access transactions from response.data.transactions
        setRecords(response.data.transactions);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching transactions:', error);
      // Optionally, throw the error or handle it in another way
    }
  };
  
  //get by id
  const fetchbyId = async (id) => {
    try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}transactions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Use the token obtained after login
          }
        });

        if(response.status == 200) {
            const responseData = response.data;
            set_id(responseData._id)
            setDate(responseData.PaymentDate);
            setOwner(responseData.Owner);
            setWeight(responseData.Weight);
            setQuality(responseData.Quality);
            setAmount(responseData.Amount);
            setMode(responseData.Mode);
            setIsLoading(false);
        }
    } 
    catch(err)
    {
        setIsLoading(false);
        alert('may error');
    }
  } 
  //add new record
  const createTrans = async () => {
    try {
        setIsLoading(true);
        const payload = {
            PaymentDate:Date,
            Owner: Owner,
            Weight: Weight,
            Quality: Quality,
            Amount :Amount,
            Mode: Mode ,
           
        };
        
        const response = await axios.post(`${API_URL}transactions`, payload, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        
        if(response.status == 201)
        {
            await fetchTransactions();
            setIsLoading(false);
            clear();
        }else{
          console.log('something wrong')
        }
    } 
    catch(err)
    {   
        console.log('Error', err.message);
        setIsLoading(false);
        setSave(false);
    }
  }
  //Update
  const updateTransaction = async (id) => {
    try {
      setIsLoading(true);
        const payload = {
            PaymentDate:Date,
            Owner: Owner,
            Weight: Weight,
            Quality: Quality,
            Amount :Amount,
            Mode: Mode ,
           
        };

      const response = await axios.put(`${API_URL}transactions/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
        

      if (response.status == 200) {
        setIsLoading(false);
        console.log('Updated Successfuly')
        return response.data;
      } else {
        throw new Error('Failed to update transaction');
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Error', err.message);
    }
  };

  //Delete
  const deleteTransaction = async (id) => {
    try {
      setIsLoading(true);
      console.log(id)

      const response = await axios.delete(`${API_URL}transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
   
      if (response.status == 200) {
        setIsLoading(false);
        console.log('Deleted Successfuly')
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Error', err.message);
    }
  };

  const handleDelete = (id) =>{
    
    setShowWarning(!showWarning);
    set_id(id);
    console.log(_id);

  }

  const handleSearch = () => {

    const regex = new RegExp(`^${searchName.toLowerCase()}`);

    const foundRecords = records.filter(record => regex.test(record.Owner.toLowerCase()));
    
    
    if(foundRecords.length>0){
      setFind(true);
    }
    else{
      setFind(false);
    }
    setFilteredRecords(foundRecords);
   
  };
  //Error
  useEffect(() => {
    handleSearch();
    
  }, [searchName,find,records] );

  return (
    <>
    <form className="max-w-md mx-auto">   
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input value={searchName} onChange={(e) => setSearchName(e.target.value)}  type="text" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Transaction" required />
            <button type="submit" onClick={ handleSearch} className="text-white absolute end-2.5 bottom-2.5 bg-custom-green hover:btn-outline focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
        </div>
    </form>

    <div className="overflow-x-auto select-none justify-center">

      <div className="flex justify-between  mb-5 text-center">
        <p className="text-left font-bold text-xl ml-5 ">Transaction Records</p>
        <div className='mr-3 space-x-4'>
          <button className="btn btn-outline bg-custom-green text-white" onClick={openModal}>Add new</button>
          {editMode ? (
            <button className="btn btn-outline bg-custom-green text-white" onClick={handleToggle}>Cancel</button>
          ) : (
            <button className="btn btn-outline bg-custom-green text-white" onClick={handleToggle}>Manage</button>
          )}
        </div>
      </div>


      
      { isLoading ? (<p>Loading...</p>) : (
        <>
        <table className="table w-full bg-white shadow-md rounded-lg overflow-hidden">
          {/* head */}
          <thead>
            <tr className='text-black text-center'>
              <th>Payment Date</th>
              <th>Owner</th>
              <th>Weight (kg)</th>
              <th>Quality</th>
              <th>Amount</th>
              <th>Payment Mode</th>
              {editMode && 
                <th>Action</th>
              }
            </tr>
          </thead>


          <tbody>
              { !find ? (
                records.map(record => (
                  <tr className="hover justify-center text-center border-b border-gray-200" key={record._id}>
                    <td  className="py-3">{record.PaymentDate}</td>
                    <td  className="py-3">{record.Owner}</td>
                    <td  className="py-3">{record.Weight}</td>
                    <td  className="py-3">{record.Quality}</td>
                    <td  className="py-3">{record.Amount}</td>
                    <td  className="py-3">{record.Mode}</td>
                    {editMode && (
                      <td className="space-x-4 py-3">
                        <button className="btn btn-info btn-sm" onClick={() => updateData(record._id)}>Edit</button>
                        <button className="btn btn-error btn-sm" onClick={() => handleDelete(record._id)}>Delete</button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                filteredRecords.map(record => (
                  <tr className="hover justify-center text-center border-b border-gray-200" key={record._id}>
                    <td className="py-3">{record.PaymentDate}</td>
                    <td className="py-3">{record.Owner}</td>
                    <td className="py-3">{record.Weight}</td>
                    <td className="py-3">{record.Quality}</td>
                    <td className="py-3">{record.Amount}</td>
                    <td className="py-3">{record.Mode}</td>
                    {editMode && (
                      <td className="space-x-4 py-3">
                        <button className="btn btn-info btn-sm" onClick={() => updateData(record._id)}>Edit</button>
                        <button className="btn btn-error btn-sm" onClick={() => handleDelete(record._id)}>Delete</button>
                      </td>
                    )}
                  </tr>
                )
            
              ))}
          </tbody>

        </table>
      </>
    )}


      
      {showWarning && <Warning setDelete={setDelete} setShowWarning={setShowWarning} />}
       <Form date = {Date} setDate = {setDate} owner = {Owner} setOwner = {setOwner} weight = {Weight} setWeight = {setWeight} quality = {Quality} setQuality = {setQuality}
    mode = {Mode} setMode = {setMode} amount = {Amount} setAmount = {setAmount}  setSave={setSave} _id = {_id} setUpdate = {setUpdate}
    modalRef={modalRef} />
    </div>
    </>
  )
  
  
}

export default Home