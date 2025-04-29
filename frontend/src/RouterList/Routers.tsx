import React, {useState, useEffect} from 'react';
import axios, { AxiosResponse } from 'axios';
import {BaseRouter, EnterpriseRouter, HomeRouter, WiFiRouter} from '../types';
import './RouterList.css'
import RouterDetails from '../RouterDetails/RouterDetails';
import {formatted} from '../utils'

const API_URL = `${process.env.REACT_APP_CODESPACE_BACKEND_URL}/routers`;

const Routers: React.FC = () => {
    const [routers, setRouters] = useState<BaseRouter[]>([]);
    const [Error, setError] = useState<string>('');
    const [isLoading, toggleLoading] = useState<boolean>(true);
    const [selectedRouter, setSelectedRouter] = useState<BaseRouter | null>(null);
    const [filterType, setFilterType] = useState<BaseRouter['type'] | 'all'>('all');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [sortBy, setSortBy] = useState<'name' | 'updatedAt'>('name');


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

    const handleRouterSelect = (router: BaseRouter) => {
      setSelectedRouter(selectedRouter?.id === router.id ? null : router);
    }

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterType(event.target.value as BaseRouter['type'] | 'all');
    }

    const handleSortChange = (field: 'name' | 'updatedAt') => {
        if(sortBy === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDirection('asc');
        }
    } 

    const filterRouters = filterType === "all" ? routers : routers.filter(router => router.type === filterType);

    const sortedRouters = [...filterRouters].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
    
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else {
          return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
        }
      });
    
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
        <div className="routers-page">
            <div className="router-list-container">
                <div className="routers-title">
                    <h3>Routers</h3>
                    <div className="filteredBy">
                        <label>Filter by Type: </label>
                        <select id="filterType" value={filterType} onChange={handleFilterChange}>
                            <option value="all">All</option>
                            <option value="wifi">WiFi</option>
                            <option value="enterprise">Enterprise</option>
                            <option value="home">Home</option>
                        </select>
                    </div>
                </div>
                <table className="router-list">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th onClick={() => handleSortChange('name')}>Name</th>
                            <th onClick={() => handleSortChange('updatedAt')}>Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                    {sortedRouters.map((router: BaseRouter) => {
                        return (
                            <tr key={router.id} className={`router-list-row ${selectedRouter?.id === router.id && 'selected'}`} onClick={() => handleRouterSelect(router)}>
                                <td className="router-list-item-type">{router.type}</td> 
                                <td className="router-list-item-name">{router.name}</td>       
                                <td className="router-list-item-update-at">{formatted(router.updatedAt)}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
            <div className="details-overlay">
            {selectedRouter && (
                <div className="details-container">
                    <h3>Router Details:</h3>
                    {selectedRouter.type === 'wifi' && <RouterDetails router={selectedRouter as WiFiRouter}></RouterDetails>}
                    {selectedRouter.type === 'enterprise' && <RouterDetails router={selectedRouter as EnterpriseRouter}></RouterDetails>}
                    {selectedRouter.type === 'home' && <RouterDetails router={selectedRouter as HomeRouter}></RouterDetails>}
                </div>
            )}
             </div>
        </div>
    )
}

export default Routers;