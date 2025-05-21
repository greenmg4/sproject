import React, { useState } from 'react';

import { Routes, Route} from 'react-router-dom';
import MainDefault from '../pages/MainDefault';
import DbTestList from '../pages/DbTestList';
function Main() {
    return (
        <div>
        <Routes>
            <Route path='/' element={<MainDefault />} />
            <Route path="/test/memberlist" element={<DbTestList />} />
        </Routes>
        </div>
    );
}

export default Main;
