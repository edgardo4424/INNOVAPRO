import React from 'react';
import { Outlet } from 'react-router-dom';

const BandejaLayout = () => {
    return (
        <div className="bandeja-layout">
            <Outlet />
        </div>
    );
};

export default BandejaLayout;