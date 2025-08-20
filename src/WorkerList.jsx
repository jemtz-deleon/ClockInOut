import { useClock } from './ClockContext';

export default function WorkerList() {
  const { workers, clockIn, clockOut } = useClock();

  return (
    <div>
      <h2>Workers</h2>
      <ul>
        {workers.map(worker => (
          <li key={worker.id} style={{ marginBottom: '1em' }}>
            <strong>{worker.name}</strong> - Status: <span style={{ color: worker.status === 'in' ? 'green' : 'red' }}>{worker.status.toUpperCase()}</span>
            {worker.status === 'out' ? (
              <button style={{ marginLeft: '1em' }} onClick={() => clockIn(worker.id)}>Clock In</button>
            ) : (
              <button style={{ marginLeft: '1em' }} onClick={() => clockOut(worker.id)}>Clock Out</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
