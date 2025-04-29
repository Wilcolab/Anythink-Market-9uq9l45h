import {formatted, isDate} from '../utils'
import {EnterpriseRouter, HomeRouter, WiFiRouter} from '../types'
import './RouterDetails.css'

interface WiFiDetailsProps {
    router: WiFiRouter | EnterpriseRouter | HomeRouter;
}

const RouterDetails:React.FC<WiFiDetailsProps> = ({router}) => {
    const displayValue = (value: any) => {
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }
       
        if (isDate(value)) {
            return formatted(value);
        }
        if (typeof value === 'string' || typeof value === 'number') {
            return value;
        }
        return null;
    }

    return (
        <div className="details-type-container">
            {Object.entries(router).map(([key, value]) => {
                return (
                    <div className="details-row" key={key}>
                        <strong>{key}:</strong>
                        {displayValue(value)}
                    </div>
                )
            })}
        </div>
    )
}

export default RouterDetails;