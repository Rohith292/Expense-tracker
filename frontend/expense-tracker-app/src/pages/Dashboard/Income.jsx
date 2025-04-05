import React, { useState,useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import IncomeOverview from '../../components/Income/IncomeOverview';
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';
import {useUserAuth} from "../../hooks/useUserAuth"


const Income = () => {
  useUserAuth();

  const [incomeData,setIncomeData]=useState([]);
  const[loading,setLoading]=useState(false);
  const[openDeleteAlert,setOpenDeleteAlert]=useState({
    show:false,
    data:null,
  });
  const [openAddIncomeModal,setOpenAddIncomeModal] =useState(false);

  //get all income details
  const fetchIncomeDetails=async()=>{
    if(loading) return;
    setLoading(true);

    try{

      console.log("fetching income details");
      const response=await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );

      console.log("api response",response.data);
      if(response.data){
        setIncomeData(response.data);
      }
    }catch(error){
      console.log("something went wrong.please ry again",error);
    }finally{
      setLoading(false);
    }
  };

  //handle all income
  const handleAddIncome=async(income)=>{
    const {source,amount,date,icon}=income;

    //validation chekcs
    if(!source.trim()){
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
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME,{
        source,
        amount,
        date,
        icon,
      });

      setOpenAddIncomeModal(false);
      toast.success("income added successfully");
      fetchIncomeDetails();
    }catch(error){
      console.error("error adding income",error.response?.data?.message||error.message);
    }
  };

  //delete income
  const deleteIncome=async(id)=>{
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELTE_INCOME(id));

      setOpenDeleteAlert({show:false,data:null});
      toast.success("Income details deleted successfully");
      fetchIncomeDetails();
    }catch(error){
      console.log("An error in deleting the income. please try again later",
        error.response?.data?.message||error.message
      )
    }
  };

  //handle download income details
  const handleDownloadIncomeDetails=async()=>{
    try{
      const response=await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType:"blob",
        }
      );
      //create a url for teh blob
       const url=window.URL.createObjectURL(new Blob ([response.data]));
       const link=document.createElement("a");
       link.href=url;
       link.setAttribute("download","income_details.xlsx");
       document.body.appendChild(link);
       link.click();
       link.parentNode.removeChild(link);
       window.URL.revokeObjectURL(url);

    }catch(error){
        console.log("error downloading income details",error);
        toast.error("failed to download income details.please try again later");
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
  
    return () => {
    }
  }, []);
  

  return (
   <DashboardLayout activeMenu="Income">
    <div className='my-5 mx-auto'>
      <div className='grid grid-cols-1 gap-6'>
        <div className=''>
          <IncomeOverview
          transactions={incomeData}
          onAddIncome ={()=>setOpenAddIncomeModal(true)}
          />
        </div>

        <IncomeList
        transactions={incomeData}
        onDelete={(id)=>{
          setOpenDeleteAlert({show:true,data:id});

        }}
        onDownload={handleDownloadIncomeDetails}
        />

      </div>

      <Modal
      isOpen={openDeleteAlert.show}
      onClose={()=>setOpenDeleteAlert({show:false,data:id})}
      title="Delete Income">
        <DeleteAlert
        content="are you sure you want to delete this income"
        onDelete={()=>deleteIncome(openDeleteAlert.data)}
        />
      </Modal>

      <Modal isOpen={openAddIncomeModal}
      onClose={()=>setOpenAddIncomeModal(false)}
      title="add income">
        <AddIncomeForm onAddIncome={handleAddIncome}/>
      </Modal>

    </div>
   </DashboardLayout>
  )
}

export default Income