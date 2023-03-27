import React, { useState, useEffect } from 'react';

const ADMIN = '000';
const DIRECTOR = '001';

function useUserRole(props) {
    return [
        {
            admin: ADMIN,
            director: DIRECTOR
        }
    ];
}

export default useUserRole;
