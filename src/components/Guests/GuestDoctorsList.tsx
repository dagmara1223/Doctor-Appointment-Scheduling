import { useEffect, useState } from "react";
import { loadDoctors } from "../../services/firebaseUsersService";
import { useNavigate } from "react-router-dom";


import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Grid
} from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

const GuestDoctorsList = () => {
    const [doctors, setDoctors] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadDoctors().then(setDoctors);
    }, []);

    return (
        <Grid container spacing={3} sx={{ marginTop: 3 }}>
            {doctors.map(d => (
                <Grid key={d.id} size={{ xs: 12, md: 6 }}>
                    <Card
                        sx={{
                            borderRadius: 3,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                            transition: "transform 0.25s ease",
                            "&:hover": {
                                transform: "translateY(-4px)"
                            }
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <MedicalServicesIcon
                                    fontSize="small"
                                    sx={{ marginRight: 1, verticalAlign: "middle" }}
                                />
                                {d.fullName}
                            </Typography>

                            <Typography color="text.secondary">
                                {d.specialization}
                            </Typography>
                        </CardContent>

                        <CardActions>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#f490a7",
                                    color: "#ffffff",
                                    "&:hover": {
                                        backgroundColor: "#ff4f75",
                                    }
                                }}
                            >
                                Zarejestruj się, aby umówić wizytę
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default GuestDoctorsList;
