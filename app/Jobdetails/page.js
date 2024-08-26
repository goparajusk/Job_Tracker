'use client'
import React, { useState, useEffect } from "react";
import { Box, Stack, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { firestore } from '@/firebase';
import Link from "next/link";
import { collection, doc, getDocs, query, deleteDoc, getDoc } from 'firebase/firestore';

const style = {
  color: '#4042db',
  padding: '10px 20px',
  fontSize: '16px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#4098db',
  },
};

export default function JobDetailsTablePage() {
  const [jobinfo, setJobinfo] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    doa: '',
    appliedThrough: '',
    description: '',
    jobType:''
  });

  const updateJobDetails = async () => {
    const snapshot = query(collection(firestore, 'Job details'));
    const docs = await getDocs(snapshot);
    const jobList = [];
    docs.forEach((doc) => {
      jobList.push({ name: doc.id, ...doc.data() });
    });
    setJobinfo(jobList);
  };

  useEffect(() => {
    updateJobDetails();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

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

  // Filter job info based on search term
  const filteredJobInfo = jobinfo.filter((job) =>
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box border={'1px solid #333'}>
      <Box
        width="100vw"
        height="100px"
        bgcolor={'#ADD8E6'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
          Job Info
        </Typography>
      </Box>

      {/* Search field */}
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        margin="16px"
      >
        <TextField
          variant="outlined"
          label="Search by Company Name"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 450 }} aria-label="job details table">
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell align="center">DOA</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">Applied Through</TableCell>
              <TableCell align="center">Description</TableCell>
               <TableCell align="center">Job Type</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredJobInfo.map(({ name, companyName, role, doa, appliedThrough, description, jobType }) => (
              <TableRow
                key={name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {companyName}
                </TableCell>
                <TableCell align="center">{doa}</TableCell>
                <TableCell align="center">{role}</TableCell>
                <TableCell align="center">{appliedThrough}</TableCell>
                <TableCell align="center">{description}</TableCell>
                <TableCell align="center">{jobType}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    onClick={() => removeItem(name)}
                    sx={{
                      color: '#fff', // Custom text color
                      backgroundColor: '#db4040',
                      '&:hover': {
                        backgroundColor: '#d47979', // Optional: Add a background color on hover
                      },
                    }}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        margin="16px"
      >
        <Link href={"/"}>
          <Button variant="outlined" sx={style}>
            Home
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
