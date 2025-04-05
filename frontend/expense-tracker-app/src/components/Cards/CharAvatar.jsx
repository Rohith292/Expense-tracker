import React from 'react';
import PropTypes from 'prop-types';
import { getInitials } from '../../utils/helper';

const CharAvatar = ({ fullName, width, height, style }) => {
    return (
        <div 
            className={`${width || 'w-12'} ${height || 'h-12'} ${style || ''} flex items-center justify-center rounded-full text-gray-900 font-medium bg-gray-100`}
            aria-label={`Avatar for ${fullName || "Unknown User"}`}
        >
            {getInitials(fullName || "")}
        </div>
    );
};

CharAvatar.propTypes = {
    fullName: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    style: PropTypes.string,
};

CharAvatar.defaultProps = {
    fullName: "",
    width: "w-12",
    height: "h-12",
    style: "",
};

export default CharAvatar;
