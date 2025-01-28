import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:3001/datos-protegidos',
                    {
                        headers: {
                            'x-api-key': 'tu_api_key_secreta',
                            'Authorization': `Bearer ${auth.token}`,
                        },
                    });
                setData(response.data);
            } catch (err) {
                if(err.response && err.response.status === 403){
                  logout();
                  navigate('/login');
                  setError('Su sesión ha expirado por favor vuelva a iniciar sesión')
                } else if (err.response) {
                  setError(err.response.data.message);
                }else {
                  setError('Error al cargar los datos');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [auth.token, navigate, logout]);

    return (
        <div>
            <h2>Dashboard</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? <p>Cargando datos...</p> :
                <ul>
                    {data.map((item) => (
                        <li key={item.id}>
                            {item.nombre} - Cita: {item.cita}
                        </li>
                    ))}
                </ul>
            }
        </div>
    );
};

export default Dashboard;