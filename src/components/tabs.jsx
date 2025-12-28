import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const DynamicTabs = ({ type, tabs }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ pl: 3, pr: 3 }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
          />
        ))}
      </Tabs>

      {tabs.map((tab, index) => (
        <TabPanel
          key={index}
          value={value}
          index={index}
        >
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
};

export default DynamicTabs;
