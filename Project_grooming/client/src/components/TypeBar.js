import { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';

const TypeBar = observer(() => {//observer для отслеживания изменений состояний
    const {service} = useContext(Context);//контекст для доступа к сервисам

    return (
        <div className="type-bar-container">
            <div className="d-flex flex-wrap gap-2">
                <button 
                    className={`category-button btn ${!service.selectedType ? 'btn-outline-success' : 'btn-outline-dark'}`}
                    onClick={() => service.setSelectedType(null)}
                >
                    Все услуги
                </button>
                {service.types && service.types.map(type => (//
                    <button 
                        key={type}
                        className={`category-button btn ${service.selectedType === type ? 'btn-outline-success' : 'btn-outline-dark'}`}
                        onClick={() => service.setSelectedType(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
    );
});

export default TypeBar;