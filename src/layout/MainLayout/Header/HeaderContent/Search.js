/* eslint-disable no-unused-vars */
import { useState } from 'react';

// material-ui
import { Box, FormControl, InputAdornment, OutlinedInput } from '@mui/material';

// assets
import { SearchOutlined } from '@ant-design/icons';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = () => {
    const [searchtext, setSearchtext] = useState('');

    // 통합검색 엔터처리
    const searchEnter = (e) => {
        if (e.key === 'Enter') {
            console.log(searchtext);
        }
    };

    return (
        <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
            <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
                <OutlinedInput
                    size="small"
                    id="header-search"
                    startAdornment={
                        <InputAdornment position="start" sx={{ mr: -0.5 }}>
                            <SearchOutlined />
                        </InputAdornment>
                    }
                    aria-describedby="header-search-text"
                    inputProps={{
                        'aria-label': 'weight'
                    }}
                    value={searchtext}
                    onChange={(e) => setSearchtext(e.target.value)}
                    onKeyPress={searchEnter}
                    placeholder="Search..."
                />
            </FormControl>
        </Box>
    );
};

export default Search;
