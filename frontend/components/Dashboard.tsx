type Props = {
  toolsCount: number;
};

function Dashboard({ toolsCount }: Props) {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>Gesamt Werkzeuge: {toolsCount}</p>
    </div>
  );
}

export default Dashboard;