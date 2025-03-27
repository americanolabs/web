export default async function handler(req, res) {
    if (req.method === "GET") {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/staking`;
    
        const response = await fetch(url);
    
        if (!response.ok) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }

        const data = await response.json();

        res.status(200).json(data);
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
