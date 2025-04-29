import React, {useState, useEffect} from 'react';
import axios, { AxiosResponse } from 'axios';
import './RouterList.css'

type Router = {
    id: number,
    type: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    coordinates: {
        latitude: number,
        longitude: number,
    },
    parentalControlsEnabled: boolean,

}
const API_URL = `${process.env.REACT_APP_CODESPACE_BACKEND_URL}/routers`;

const Routers: React.FC = () => {
    const [routers, setRouters] = useState<Router[]>([]);
    const [Error, setError] = useState<string>('');
    const [isLoading, toggleLoading] = useState<boolean>(true);

    const formatted = (date: Date) => new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      });

    useEffect(() => {
        const fetchRouters = async () => {
            try {
                toggleLoading(true);
                const res: AxiosResponse<any, any> = await axios.get(API_URL);
                setRouters(res.data);
            }
            catch(err: any) {
                setError(err.message);
                console.error(`Failed to fetch routers, ${err}`);
            }
            finally {
                toggleLoading(false);
            }
        }
        fetchRouters();
    }, [])

    if(Error.length) {
        return <div className="error">Oops something went wrong...</div>
    }
    if(!routers.length) {
        return <div className="loading">No routers to show</div>
    }
    if(isLoading) {
        return <div className="loading">Loading... </div>
    }
    return (
        <div className="router-list-container">
            <div className="router-list-title">Routers</div>
            <table className="router-list">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Updated At</th>
                    </tr>
                </thead>
                <tbody>
                {routers.map((router: Router) => {
                    return (
                        <tr key={router.id} className="router-list-row">
                            <td className="router-list-item-name">{router.name}</td>
                            <td className="router-list-item-type">{router.type}</td> 
                            <td className="router-list-item-update-at">{formatted(router.updatedAt)}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

export default Routers;