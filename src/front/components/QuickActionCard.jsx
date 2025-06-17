import React from 'react';
import PropTypes from 'prop-types';
import '../styles/QuickActionCard.css';

const QuickActionCard = ({icon, title, subtitle = '',
  onClick = () => {},
}) => {
  return (
    <button className="quick-action-card" onClick={onClick}>
      <div className="icon-wrapper">
        {icon}
      </div>
      <div className="text-content">
        <p className="qa-title">{title}</p>
        <p className="qa-subtitle">{subtitle}</p>
      </div>
    </button>
  );
};

QuickActionCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string, 
  onClick: PropTypes.func,    
};

export default QuickActionCard;