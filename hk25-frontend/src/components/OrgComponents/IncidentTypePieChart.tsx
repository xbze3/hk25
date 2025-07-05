import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface Incident {
    type?: string;
}

interface Props {
    incidents: Incident[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#d62728"];

function IncidentTypePieChart({ incidents }: Props) {
    const typeCounts = incidents.reduce(
        (acc: Record<string, number>, incident) => {
            const type = incident.type || "Unknown";
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        },
        {}
    );

    const data = Object.entries(typeCounts).map(([type, count]) => ({
        name: type,
        value: count,
    }));

    return (
        <div style={{ width: "100%", height: 300 }}>
            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
                Incident Types
            </h3>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default IncidentTypePieChart;
