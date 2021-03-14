import React from 'react';
import Layout from '../components/Layout/Layout';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import CoachPanel from './CoachPanel';
import DancerPanel from './DancerPanel';

const LiveSessionPage: React.FC = () => {
    return (
        <Layout>
            <Tabs
                ml={4} 
                mr={4} 
                orientation="horizontal" 
                isFitted variant="solid-rounded" 
                colorScheme="purple"
            >
                <TabList mb="1em">
                    <Tab>Dancer</Tab>
                    <Tab>Coach</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <DancerPanel/>        
                    </TabPanel>
                    <TabPanel>
                        <CoachPanel/>        
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Layout>
    )
}

export default LiveSessionPage;