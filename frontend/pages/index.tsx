import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  useTheme,
  Fade,
  Divider,
} from "@mui/material";

const riskTolerances = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

type RecommendationResponse = {
  recommendation: string;
  explanation: string;
};

export default function Home() {
  const theme = useTheme();
  const [form, setForm] = useState({
    age: "",
    income: "",
    dependents: "",
    riskTolerance: "Medium",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/recommendation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            age: Number(form.age),
            income: Number(form.income),
            dependents: Number(form.dependents),
            riskTolerance: form.riskTolerance,
          }),
        }
      );

      if (!res.ok) throw new Error("Invalid input or server error.");
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(120deg, #E0EAFC 0%, #CFDEF3 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Fade in>
          <Card
            sx={{
              borderRadius: 6,
              boxShadow: 6,
              background: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)",
              mb: 4,
            }}
          >
            <CardHeader
              title={
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Life Insurance Advisor
                </Typography>
              }
              subheader={
                <Typography color="text.secondary" sx={{ fontSize: 18 }}>
                  Get a personalized policy recommendation
                </Typography>
              }
              sx={{ textAlign: "center", pb: 0 }}
            />
            <CardContent>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  margin="normal"
                  required
                  value={form.age}
                  onChange={handleChange}
                  inputProps={{ min: 1, max: 120 }}
                  sx={{ bgcolor: "white", borderRadius: 2 }}
                />
                <TextField
                  fullWidth
                  label="Annual Income ($)"
                  name="income"
                  type="number"
                  margin="normal"
                  required
                  value={form.income}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  sx={{ bgcolor: "white", borderRadius: 2 }}
                />
                <TextField
                  fullWidth
                  label="Number of Dependents"
                  name="dependents"
                  type="number"
                  margin="normal"
                  required
                  value={form.dependents}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 10 }}
                  sx={{ bgcolor: "white", borderRadius: 2 }}
                />
                <TextField
                  select
                  fullWidth
                  label="Risk Tolerance"
                  name="riskTolerance"
                  margin="normal"
                  required
                  value={form.riskTolerance}
                  onChange={handleChange}
                  sx={{ bgcolor: "white", borderRadius: 2 }}
                >
                  {riskTolerances.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <Box mt={3} textAlign="center">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ borderRadius: 3, px: 5, fontWeight: 600 }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={26} /> : "Get Recommendation"}
                  </Button>
                </Box>
              </form>
              {error && (
                <Box mt={2}>
                  <Typography color="error" align="center">
                    {error}
                  </Typography>
                </Box>
              )}
              {result && (
                <Fade in>
                  <Box mt={4}>
                    <Divider sx={{ mb: 3 }} />
                    <Paper
                      elevation={3}
                      sx={{
                        borderRadius: 4,
                        p: 3,
                        background:
                          "linear-gradient(130deg, #e0e7ff 40%, #f0fdfa 100%)",
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ fontWeight: 700, mb: 1, textAlign: "center" }}
                      >
                        Your Recommendation
                      </Typography>
                      <Typography
                        variant="h5"
                        align="center"
                        sx={{ fontWeight: 700, mb: 1 }}
                      >
                        {result.recommendation}
                      </Typography>
                      <Typography
                        align="center"
                        color="text.secondary"
                        sx={{ fontSize: 18 }}
                      >
                        {result.explanation}
                      </Typography>
                    </Paper>
                  </Box>
                </Fade>
              )}
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
}
