import { createContext, useContext, useState } from 'react';

const ClockContext = createContext();

export function useClock() {
  return useContext(ClockContext);
}

export function ClockProvider({ children }) {
  const [workers, setWorkers] = useState([
    { id: 1, name: 'Alice', status: 'out', history: [] },
    { id: 2, name: 'Bob', status: 'out', history: [] },
    { id: 3, name: 'Charlie', status: 'out', history: [] },
  ]);

  const clockIn = (id) => {
    setWorkers(workers => workers.map(worker =>
      worker.id === id && worker.status === 'out'
        ? { ...worker, status: 'in', history: [...worker.history, { type: 'in', time: new Date() }] }
        : worker
    ));
  };

  const clockOut = (id) => {
    setWorkers(workers => workers.map(worker =>
      worker.id === id && worker.status === 'in'
        ? { ...worker, status: 'out', history: [...worker.history, { type: 'out', time: new Date() }] }
        : worker
    ));
  };

  return (
    <ClockContext.Provider value={{ workers, clockIn, clockOut }}>
      {children}
    </ClockContext.Provider>
  );
}
