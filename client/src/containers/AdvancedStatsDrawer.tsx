import React from 'react'
import SideDrawer from '../components/SideDrawer/SideDrawer'
import MoveAccuracyChart from './MoveAccuracyChart'

const AdvancedStatsDrawer: React.FC = () => {
    return (
        <SideDrawer drawerButtonName="Advanced Stats" drawerHeaderName="Advanced Stats">
            <MoveAccuracyChart/>
        </SideDrawer>
    )
}

export default AdvancedStatsDrawer;