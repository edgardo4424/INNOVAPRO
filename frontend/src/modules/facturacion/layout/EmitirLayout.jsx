import React from 'react';
import { Outlet } from 'react-router-dom';

const EmitirLayout = () => {
    return (
        <div className="bandeja-layout">
            <Outlet />
        </div>
    );
};

export default EmitirLayout;