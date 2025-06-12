import React from 'react';

const InfoCard = ({
    icon,
    title,
    subtitle,
    bgColor = 'bg-light',
    iconColor = 'text-danger',
    actionIcon = null,        // prop para el icono de “más”
    onActionClick = null      // prop para el handler de click en el icono de “más”
}) => {
    return (
        <div
            className="card shadow-sm  p-3 text-start d-flex flex-row align-items-center gap-4"
        >
            {/* Icono circular principal */}
            <div
                className={`d-flex justify-content-center align-items-center rounded-circle ${bgColor} ${iconColor}`}
                style={{ width: '60px', height: '60px' }}
            >
                {/* <div class="flex-grow-1 d-flex justify-content-around align-items-center" style="">
                    <h5 class="mb-1 pl-4 fw-bold">Ver restaurantes</h5> 
                    <h2>+</h2>
                    <p class="mb-0 text-muted"></p>
                </div> */}
                {icon}
            </div>

            {/* Bloque de texto */}
            <div className="flex-grow-1">
                <h5 className="mb-1 fw-bold">{title}</h5>
                <p className="mb-0 text-muted">{subtitle}</p>
            </div>

            {/* Icono de acción (“más”), si se pasa */}
            {actionIcon && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                        cursor: onActionClick ? 'pointer' : 'default',
                        width: '30px',
                        height: '30px'
                    }}
                    onClick={onActionClick}
                    title={onActionClick ? 'Acción' : undefined}
                >
                    {actionIcon}
                </div>
            )}
        </div>
    );
};

export default InfoCard;
