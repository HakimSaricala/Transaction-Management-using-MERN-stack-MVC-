import { useEffect } from "react";
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const form = ({date,setDate,owner,setOwner,weight,setWeight,quality, setQuality,
    mode, setMode, amount, setAmount,  setSave, modalRef, _id ,setUpdate}) => {

    
   
    const rate=32;
        
    const formatDate = (date) => {
        const year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
      
        return `${year}-${month}-${day}`;
      };
    const handleDateChange = (date) => {

        setDate(formatDate(date));
    };
    useEffect(() => {
        if (!_id) {
            clear();
        }
    }, [_id]);
    const handleSave = () => {
        if(_id!=''){
            setUpdate(true);
            setSave(false);
        
         }else{
            setUpdate(false);
            setSave(true);
         }
      
       
    }
             
  
    useEffect(() => {
        calculate()
      }, [quality, weight, setAmount]);
     
        
    const calculate = () => {
        let total = 0;
        if (quality == 'Low') {
            total = weight * (rate * 0.75);
        } else if (quality == 'Medium') {
            total = weight * rate;
        } else if (quality == 'High') {
            total = weight * (rate * 1.25);
        }
        setAmount(total);
    };
    
    


    const clear = ()=> {
        setDate("");
        setOwner("");
        setWeight(0);
        setQuality('');
        setMode('');
        setAmount(0);
        setUpdate(false);
        setSave(false);
        modalRef.current.close()
     
    }


  return (
    <>
    <dialog id="my_modal_1" className="modal select-none"  ref={modalRef}>
        <div className="modal-box w-11/12 max-w-5xl h-96 flex flex-col justify-between">
            <div className="flex space-x-8">
            
                <label className="form-control w-full max-w-xs">
                    <div className="label font-bold text-m">
                    <span className="label-text">Owner</span>
                    </div>
                    <input type="text" value={owner} onChange={(e)=>setOwner(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" required />  
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label font-bold text-m">
                    <span className="label-text">Weight</span>
                    </div>
                    <input type="text" value={weight}  onChange={(e) => setWeight(e.target.value)}  placeholder="Type here" className="input input-bordered w-full max-w-xs" required />  
                </label>
                <div className="mt-4">
                    <h3 className="label-text font-bold text-m">Payment Date</h3>
                    <ReactDatePicker
                        selected={date}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        className="block w-full p-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        placeholderText="Select date"
                        required
                    />
                </div>
            </div>
            <div className='flex space-x-8'>
            <label className="form-control w-full max-w-xs">
                <div className="label font-bold text-m">
                    <span className="label-text">Quality</span>
                </div>
                <select 
                value ={quality} onChange={(e)=>setQuality(e.target.value)} className="select select-bordered"  defaultValue="low"> 
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
            </label>
            <label className="form-control w-full max-w-xs">
                <div className="label font-bold text-m">
                    <span className="label-text">Payment Method</span>
                </div>
                <select value={mode} onChange={(e)=>setMode(e.target.value)} className="select select-bordered" defaultValue="Cash">
                    <option>Cash</option>
                    <option>Credit Card</option>
                    <option>Cheque</option>
                </select>
            </label>
            <label className="form-control w-full max-w-xs">
                    <div className="label font-bold text-m">
                    <span className="label-text ">Amount</span>
                    </div>
                    <input type="text" value={amount}   placeholder="Type here" className="input input-bordered w-full max-w-xs "  readOnly />  
                </label>
            </div>
            
            
            
            <div className="modal-action flex justify-end">
            <form method="dialog">
                <button className="btn btn-outline btn-success"onClick={handleSave}>Save</button>

                <button className="btn btn-outline btn-success" onClick={clear} >Close</button>
            </form>
            </div>
        </div>
    </dialog>


    </>
  );
};

export default form;
