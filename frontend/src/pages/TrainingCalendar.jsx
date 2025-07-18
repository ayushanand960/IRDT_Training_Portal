import React, { useEffect, useState } from 'react';
import TrainingCard from '../components/TrainingCard';
import TrainingFilterBar from '../components/TrainingFilterBar';
import axiosInstance from '../utils/axiosInstance';
import DashboardLayout from "../components/DashboardLayout";


const TrainingCalendar = () => {
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [filters, setFilters] = useState({
    venue: '',
    target_group: '',
    mode: '',
    start_date: '',
  });

  // Get Monday of the week for any date
  const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay(); // Sunday = 0
    const diff = (day + 6) % 7; // Monday = 0
    date.setDate(date.getDate() - diff);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/training/training-programs');
        setTrainings(res.data);
      } catch (err) {
        console.error('Error fetching trainings:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filterDate = filters.start_date ? new Date(filters.start_date) : null;
    const baseMonday = getMonday(filterDate || new Date());
    const nextMonday = new Date(baseMonday);
    nextMonday.setDate(baseMonday.getDate() + 7);

    const filtered = trainings.filter((t) => {
      const trainingStart = new Date(t.start_date);

      const matchVenue = filters.venue ? t.venue === filters.venue : true;
      const matchBranch = filters.target_group
        ? t.target_group?.toLowerCase().includes(filters.target_group.toLowerCase()) : true;
      const matchMode = filters.mode
        ? t.mode?.toLowerCase() === filters.mode.toLowerCase() : true;

      return matchVenue && matchBranch && matchMode;
    });

    const thisWeek = [];
    const upcoming = [];
    const past = [];

    filtered.forEach((t) => {
      const start = new Date(t.start_date);
      start.setHours(0, 0, 0, 0);

      if (start >= baseMonday && start < nextMonday) {
        thisWeek.push(t);
      } else if (start >= nextMonday) {
        upcoming.push(t);
      } else {
        past.push(t);
      }
    });

    // Sort sections
    thisWeek.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    upcoming.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    past.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

    setFilteredTrainings([
      { section: '🟢 Trainings This Week', items: thisWeek },
      { section: '🟡 Upcoming Week Trainings', items: upcoming },
      { section: '🔴 Past Trainings', items: past },
    ]);
  }, [filters, trainings]);

  const handleClear = () => {
    setFilters({
      venue: '',
      target_group: '',
      mode: '',
      start_date: '',
    });
  };

  return (
    <DashboardLayout>
    <div className="container py-4">
      <h3 className="text-center mb-4">IRDT Training Calendar 2025–26</h3>

      <TrainingFilterBar
        filters={filters}
        setFilters={setFilters}
        handleClear={handleClear}
        trainings={trainings}
      />

      {Array.isArray(filteredTrainings) && filteredTrainings.every(group => Array.isArray(group.items) && group.items.length === 0) ? (
        <p className="text-center text-muted mt-4">No trainings found.</p>
      ) : (
        filteredTrainings.map((group, idx) => {
          if (!group.items || group.items.length === 0) return null;
          return (
            <div key={idx} className="mb-5">
              <h5 className="border-bottom pb-2">{group.section}</h5>
              {group.items.map((training, index) => (
                <TrainingCard key={index} training={training} />
              ))}
            </div>
          );
        })
      )}
    </div>
    </DashboardLayout>
  );
};

export default TrainingCalendar;




