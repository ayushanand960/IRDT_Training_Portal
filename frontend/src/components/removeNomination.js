import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const removeNomination = async (trainingCode, ehrmsCode) => {
  try {
    await axiosInstance.delete(`/training/nominations/${trainingCode}/${ehrmsCode}/`);
    toast.success('Nomination removed successfully');
  } catch (error) {
    console.error(error);
    toast.error('Failed to remove nomination');
  }
};

export default removeNomination;
