import { useClock } from './ClockContext';

export default function History() {
  const { workers } = useClock();

  return (
    <div>
      <h2>Clock History</h2>
      {workers.map(worker => (
        <div key={worker.id} style={{ marginBottom: '1em' }}>
          <strong>{worker.name}</strong>
          <ul>
            {worker.history.length === 0 ? (
              <li>No history</li>
            ) : (
              worker.history.map((event, idx) => (
                <li key={idx}>
                  {event.type === 'in' ? 'Clocked In' : 'Clocked Out'}: {event.time.toLocaleString()}
                </li>
              ))
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
