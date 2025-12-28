import React, { Component, useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';

import FileManagerPage from 'src/pages/dashboard/file-manager';

const TabsContainerFiles = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };
  const TABS=[
    {
      value: 0,
      label: 'PLE',
      component:<div>hola0</div>
    },
    {
      value: 1,
      label: 'Vouching',
      component:<div>hola1</div>
    }
  ]

  return (
    <Box sx={{ width: '100%' }}>
     <Box>
      <Tabs value={tabIndex} onChange={(event, newValue)=>setTabIndex(newValue)}>
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      {TABS.map((tab) => (
        tab.value === tabIndex && (
          <Box key={tab.value}>
            {tab.component}
          </Box>
        )
      ))}
     </Box>
    </Box>
  );
};

export default TabsContainerFiles;
