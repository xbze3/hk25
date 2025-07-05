import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface Incident {
    date?: string;
}

interface Props {
    incidents: Incident[];
}

function DailyIncidentBarChart({ incidents }: Props) {
    // Count incidents by date
    const countsByDate = incidents.reduce(
        (acc: Record<string, number>, incident) => {
            const date = incident.date?.split("T")[0] || "Unknown";
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        },
        {}
    );

    const data = Object.entries(countsByDate)
        .map(([date, count]) => ({ date, count }))
        .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

    return (
        <div style={{ width: "100%", height: 300 }}>
            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
                Daily Incidents
            </h3>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default DailyIncidentBarChart;
