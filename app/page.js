'use client'

import Image from "next/image";
import styles from "./page.module.css";
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { firestore, storage } from '@/firebase'
import Link from 'next/link';

import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  //backgroundColor: '#be03fc',
    color: '#4042db',
    padding: '10px 20px',
    fontSize: '16px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#4098db',
    },
}

const JobInfoStyle = {
  backgroundColor: '#2bbaac',
  padding: '10px 20px',
    fontSize: '16px',
    textTransform: 'none',
  '&:hover': {
      backgroundColor: '#4098db',
    },
}

const backcover = {
  backgroundColor: '#859491',
 
}
export default function Home() {
  
  //const [, set] = useState('');
  const [jobinfo, setJobinfo] = useState([])
  //const [inputValue, setInputValue] = useState('')
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    doa: '',
    appliedThrough: '',
    description: '',
    jobType:''
  
  });

   const updateJobDetails = async () => {
    const snapshot = query(collection(firestore, 'Job details'))
    const docs = await getDocs(snapshot)
    const jobList = []
    docs.forEach((doc) => {
      jobList.push({name:doc.id,...doc.data()})
    })
    setJobinfo(jobList)
    }
  useEffect(() => {
  updateJobDetails()
}, [])

  const handleChange = (e) => {
    const { name, value} = e.target;
      setFormData({
      ...formData,
      [name]: value
    });
    
    
  }

  
  
  
  const addItem = async () => {
const { companyName, role, doa, appliedThrough, description,jobType } = formData;
      
    if (!companyName || !role || !doa || !appliedThrough || !jobType ) {
    alert('Please fill in all fields before submitting.');
    return; // Exit the function early if validation fails
  }
    try {

      
      const item = `${companyName}_${role}`;  // or any other unique identifier you want to use
      const additionalFields = { companyName, role, doa, appliedThrough, description,jobType };

      const docRef = doc(collection(firestore, 'Job details'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        // If the document exists, update it with additional fields
        await setDoc(docRef, { ...additionalFields }, { merge: true })  // Spread the additional fields into the document 
        // , { merge: true }); Use { merge: true } to only update the fields provided without overwriting the entire document
      } else {
        // If the document doesn't exist, create it with the additional fields
        await setDoc(docRef, additionalFields);
      }
     setFormData({
        companyName: '',
        role: '',
        doa: '',
       appliedThrough: '',
       description: '',
        jobType:''
     });
      
      await updateJobDetails();
      
    }
    catch (error) {
      console.error('Error adding document:', error);
    }
 
  }

  const removeItem = async (item) => {
  try {
    const docRef = doc(collection(firestore, 'Job details'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef); // Delete the entire document
      console.log(`Document with ID ${item} has been deleted.`);
    } else {
      console.log(`No document found with ID ${item}.`);
    }

    await updateJobDetails(); // Refresh the job list after deletion
  } catch (error) {
    console.error('Error deleting document:', error);
  }
};

  
  return (
    <Box 
    width="100vw"
    height="110vh"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
      gap={2}
     sx={backcover}>
      
       <Typography variant="h1" >Job Details</Typography>
      <Box border={'1px solid #333'}
        width="90vw"
        height="300px"
        display={'flex'}
        justifyContent={'center'}
        flexDirection={'row'}
        alignItems={'center'}
        gap={2}
        sx={{color:'#ebeded',bgcolor:'#dae6e3'}}
      >
       
      <TextField variant="outlined" label="Company Name"  type="text" name="companyName"
          value={formData.companyName}
        onChange={handleChange}
      InputLabelProps={{
    shrink: true,
  }}
  sx={{
    padding: '8px 12px',
    marginBottom: '16px',
    color: '#ebeded'
  }}
      />
      <TextField variant="outlined" label="Role" type="text" name="role" 
      value={formData.role}
        onChange={handleChange}
      InputLabelProps={{
    shrink: true,
  }}
  sx={{
    padding: '8px 12px',
    marginBottom: '16px',
  }}
      />
        <TextField variant="outlined" label="DOA" type="text" name="doa"
          placeholder="mm/dd/yyyy"
      value={formData.doa}
        onChange={handleChange}
      InputLabelProps={{
    shrink: true,
  }}
  sx={{
    padding: '8px 12px',
    marginBottom: '16px',
  }}/>
      <TextField variant="outlined" label="Applied Through" type="text" name="appliedThrough"
      value={formData.appliedThrough}
        onChange={handleChange}
        InputLabelProps={{
    shrink: true,
  }}
  sx={{
    padding: '8px 12px',
    marginBottom: '16px',
  }}
        />
        
        <FormControl variant="outlined" sx={{ minWidth: 150, marginBottom: '16px' }}>
          <InputLabel id="jobType-label">Job Type</InputLabel>
          <Select
            labelId="jobType-label"
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            label="Job Type"
          >
            <MenuItem value="Full-time">Full-time</MenuItem>
            <MenuItem value="Part-time">Part-time</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
            <MenuItem value="Internship">Internship</MenuItem>
          </Select>
        </FormControl>

        <TextField variant="outlined" label="Description" type="text" name="description" 
      value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
      InputLabelProps={{
    shrink: true,
  }}
  sx={{
    padding: '8px 12px',
    marginBottom: '16px',
  }}
        />
     
      </Box>
      <Button variant="outlined" sx={style} onClick={addItem}>Submit</Button>
    
      <Link href={"/Jobdetails"} ><Button variant="contained" sx={JobInfoStyle}>
      Job Info</Button></Link>
      
      </Box>
   
      );
  }

