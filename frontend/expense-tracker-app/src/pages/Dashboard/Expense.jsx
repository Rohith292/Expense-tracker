import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import Modal from '../../components/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';

const Expense = () => {
  useUserAuth();

  const [expenseData,setExpenseData]=useState([]);
    const[loading,setLoading]=useState(false);
    const[openDeleteAlert,setOpenDeleteAlert]=useState({
      show:false,
      data:null,
    });
    const [openAddExpenseModal,setOpenAddExpenseModal] =useState(false);

      //get all expense details
  const fetchExpenseDetails=async()=>{
    if(loading) return;
    setLoading(true);

    try{

      console.log("fetching income details");
      const response=await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      console.log("api response",response.data);
      if(response.data){
        setExpenseData(response.data);
      }
    }catch(error){
      console.log("something went wrong.please ry again",error);
    }finally{
      setLoading(false);
    }
  };

  //handle add expense
  const handleAddExpense=async(expense)=>{
    const {category,amount,date,icon}=expense;

    //validation chekcs
    if(!category.trim()){
      toast.error("source is required");
      return;
    }

    if(!amount ||isNaN(amount)||Number(amount)<=0){
      toast.error("amount should be greater than zero");
    return;    }
    if(!date){
      toast.error("date is required");
      return;
    }

    try{
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE,{
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success("expense added successfully");
      fetchExpenseDetails();
    }catch(error){
      console.error("error adding expense",error.response?.data?.message||error.message);
    }
  };

  //delete income
  const deleteExpense=async(id)=>{
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELTE_EXPENSE(id));

      setOpenDeleteAlert({show:false,data:null});
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
    }catch(error){
      console.log("An error in deleting the income. please try again later",
        error.response?.data?.message||error.message
      )
    }
  };

  //handle download income details
  const handleDownloadExpenseDetails=async()=>{
    try{
      const response=await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType:"blob",
        }
      );
      //create a url for teh blob
       const url=window.URL.createObjectURL(new Blob ([response.data]));
       const link=document.createElement("a");
       link.href=url;
       link.setAttribute("download","expense_details.xlsx");
       document.body.appendChild(link);
       link.click();
       link.parentNode.removeChild(link);
       window.URL.revokeObjectURL(url);

    }catch(error){
        console.log("error downloading expense details",error);
        toast.error("failed to download expense details.please try again later");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
  
    return () => {
      
    }
  }, []);
  

  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <ExpenseOverview
            transactions={expenseData}
            onExpenseIncome={()=>setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
        transactions={expenseData}
        onDelete={(id)=>{
          setOpenDeleteAlert({show:true,data:id});

        }}
        onDownload={handleDownloadExpenseDetails}
        />
        </div>

        <Modal
        isOpen={openAddExpenseModal}
        onClose={()=>setOpenAddExpenseModal(false)}
        title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense}/>
        </Modal>

        <Modal
      isOpen={openDeleteAlert.show}
      onClose={()=>setOpenDeleteAlert({show:false,data:id})}
      title="Delete Expense">
        <DeleteAlert
        content="are you sure you want to delete this expense"
        onDelete={()=>deleteExpense(openDeleteAlert.data)}
        />
      </Modal>
      </div>
    </DashboardLayout>
    
  )
}

export default Expense