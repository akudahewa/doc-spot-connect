// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Card,
//   Container,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
//   IconButton,
//   Paper,
//   Grid
// } from '@mui/material';
// import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
// import { TimeSlotService, TimeSlotFees, DoctorDispensaryFee, Dispensary } from '@/api/services/TimeSlotService';
// import { toast } from 'react-toastify';

// interface FeeDialogProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: (fees: TimeSlotFees) => void;
//   initialFees?: TimeSlotFees;
//   doctorId: string;
//   dispensaryId: string;
// }

// const FeeDialog: React.FC<FeeDialogProps> = ({ open, onClose, onSave, initialFees, doctorId, dispensaryId }) => {
//   const [fees, setFees] = useState<TimeSlotFees>({
//     doctorFee: 0,
//     dispensaryFee: 0,
//     bookingCommission: 0
//   });

//   useEffect(() => {
//     if (initialFees) {
//       setFees(initialFees);
//     }
//   }, [initialFees]);

//   const handleSave = () => {
//     onSave(fees);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Manage Fees</DialogTitle>
//       <DialogContent>
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
//           <TextField
//             label="Doctor Fee"
//             type="number"
//             value={fees.doctorFee}
//             onChange={(e) => setFees({ ...fees, doctorFee: Number(e.target.value) })}
//             fullWidth
//           />
//           <TextField
//             label="Dispensary Fee"
//             type="number"
//             value={fees.dispensaryFee}
//             onChange={(e) => setFees({ ...fees, dispensaryFee: Number(e.target.value) })}
//             fullWidth
//           />
//           <TextField
//             label="Booking Commission"
//             type="number"
//             value={fees.bookingCommission}
//             onChange={(e) => setFees({ ...fees, bookingCommission: Number(e.target.value) })}
//             fullWidth
//           />
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={handleSave} variant="contained" color="primary">
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// const DoctorDispensaryFeeManager: React.FC = () => {
//   const [fees, setFees] = useState<DoctorDispensaryFee[]>([]);
//   const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
//   const [selectedDispensaryId, setSelectedDispensaryId] = useState<string>('');
//   const [feeDialogOpen, setFeeDialogOpen] = useState(false);
//   const [currentFees, setCurrentFees] = useState<TimeSlotFees | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [dispensaries, setDispensaries] = useState<Dispensary[]>([]);

//   useEffect(() => {
//     const fetchDispensaries = async () => {
//       try {
//         const dispensaries = await TimeSlotService.getAllDispensaries();
//         setDispensaries(dispensaries);
//       } catch (error) {
//         toast.error('Failed to fetch dispensaries');
//       }
//     };
//     fetchDispensaries();
//   }, []);

//   const fetchFees = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       console.log('Fetching fees for dispensary:', selectedDispensaryId);
//       const doctorDispensaryFees = await TimeSlotService.getDoctorDispensaryFees(selectedDispensaryId);
//       console.log('Received fees:', doctorDispensaryFees);
//       setFees(doctorDispensaryFees);
//     } catch (error) {
//       console.error('Error fetching fees:', error);
//       setError('Failed to fetch fees');
//       toast.error('Failed to fetch fees');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (selectedDispensaryId) {
//       console.log('Dispensary selected:', selectedDispensaryId);
//       fetchFees();
//     }
//   }, [selectedDispensaryId]);

//   const handleEditFees = (doctorId: string, dispensaryId: string, currentFees: TimeSlotFees) => {
//     setSelectedDoctorId(doctorId);
//     setCurrentFees(currentFees);
//     setFeeDialogOpen(true);
//   };

//   const handleSaveFees = async (fees: TimeSlotFees) => {
//     try {
//       await TimeSlotService.updateDoctorDispensaryFees(selectedDoctorId, selectedDispensaryId, fees);
//       toast.success('Fees updated successfully');
//       fetchFees();
//     } catch (error) {
//       toast.error('Failed to update fees');
//     }
//   };

//   const handleDeleteFees = async (doctorId: string, dispensaryId: string) => {
//     if (window.confirm('Are you sure you want to reset the fees?')) {
//       try {
//         await TimeSlotService.deleteDoctorDispensaryFees(doctorId, dispensaryId);
//         toast.success('Fees reset successfully');
//         fetchFees();
//       } catch (error) {
//         toast.error('Failed to reset fees');
//       }
//     }
//   };

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
//             <Box sx={{ mb: 3 }}>
//               <FormControl sx={{ minWidth: 200 }}>
//                 <InputLabel>Select Dispensary</InputLabel>
//                 <Select
//                   value={selectedDispensaryId}
//                   onChange={(e) => setSelectedDispensaryId(e.target.value)}
//                   label="Select Dispensary"
//                 >
//                   {dispensaries.map((dispensary) => (
//                     <MenuItem key={dispensary._id} value={dispensary._id}>
//                       {dispensary.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Box>

//             {loading && <Typography>Loading...</Typography>}
//             {error && <Typography color="error">{error}</Typography>}
            
//             {!loading && !error && fees.length === 0 && (
//               <Typography color="text.secondary">
//                 No fees found for this dispensary. Please select a different dispensary or add fees.
//               </Typography>
//             )}

//             {fees.length > 0 && (
//               <TableContainer component={Paper} sx={{ mt: 2 }}>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Doctor</TableCell>
//                       <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Dispensary</TableCell>
//                       <TableCell sx={{ fontWeight: 'bold', width: '15%', textAlign: 'right' }}>Doctor Fee</TableCell>
//                       <TableCell sx={{ fontWeight: 'bold', width: '15%', textAlign: 'right' }}>Dispensary Fee</TableCell>
//                       <TableCell sx={{ fontWeight: 'bold', width: '15%', textAlign: 'right' }}>Booking Commission</TableCell>
//                       <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Last Updated</TableCell>
//                       <TableCell sx={{ fontWeight: 'bold', width: '5%', textAlign: 'center' }}>Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {fees.map((fee) => (
//                       <TableRow key={fee._id}>
//                         <TableCell sx={{ width: '20%', fontWeight: 'medium' }}>{fee.doctorName}</TableCell>
//                         <TableCell sx={{ width: '20%' }}>{fee.dispensaryName}</TableCell>
//                         <TableCell sx={{ width: '15%', textAlign: 'right' }}>${fee.doctorFee || 0}</TableCell>
//                         <TableCell sx={{ width: '15%', textAlign: 'right' }}>${fee.dispensaryFee || 0}</TableCell>
//                         <TableCell sx={{ width: '15%', textAlign: 'right' }}>${fee.bookingCommission || 0}</TableCell>
//                         <TableCell sx={{ width: '10%' }}>{new Date(fee.updatedAt).toLocaleDateString()}</TableCell>
//                         <TableCell sx={{ width: '5%' }}>
//                           <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
//                             <IconButton 
//                               onClick={() => handleEditFees(fee.doctorId, fee.dispensaryId, {
//                                 doctorFee: fee.doctorFee,
//                                 dispensaryFee: fee.dispensaryFee,
//                                 bookingCommission: fee.bookingCommission
//                               })} 
//                               color="primary"
//                               size="small"
//                             >
//                               <EditIcon />
//                             </IconButton>
//                             <IconButton 
//                               onClick={() => handleDeleteFees(fee.doctorId, fee.dispensaryId)} 
//                               color="error"
//                               size="small"
//                             >
//                               <DeleteIcon />
//                             </IconButton>
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>

//       <FeeDialog
//         open={feeDialogOpen}
//         onClose={() => setFeeDialogOpen(false)}
//         onSave={handleSaveFees}
//         initialFees={currentFees || undefined}
//         doctorId={selectedDoctorId}
//         dispensaryId={selectedDispensaryId}
//       />
//     </Container>
//   );
// };

// export default DoctorDispensaryFeeManager; 