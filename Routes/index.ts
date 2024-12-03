import express from "express";
import bodyParser from "body-parser";
import router from "./schoolRoutes";

const PORT=3000;
const app = express();


app.use(bodyParser.json());
app.use(express.json());


app.use("/api", router);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
