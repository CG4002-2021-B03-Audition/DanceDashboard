import { ChartOptions } from 'chart.js';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import LineChart from '../components/Charts/LineChart';

const selectValue = (dancerId: number, datapoint: string) => (state: any) => state.liveStore.imu[dancerId].map((item: any) => item[datapoint])
const selectTime = (dancerId: number) => (state: any) => state.liveStore.imu[dancerId].map((item: any) => moment(item.timestamp).format('hh:mm:ss:SS'))

interface Props {
    dancerId: number,
    datapoint: string,
    size: number,
}

const SensorChart: React.FC<Props> = (props) => {
    const dataset = useSelector(selectValue(props.dancerId, props.datapoint))
    const timestamp = useSelector(selectTime(props.dancerId))

    const options: ChartOptions = {
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Time'
            },
            ticks: {
              display: false
            },
          },
        ],
      },
    }
    return (
        <>
          <LineChart 
            options={options} 
            xAxis={timestamp.slice(-props.size)}
            yAxis={dataset.slice(-props.size)}
            yLabel={props.datapoint}
          />
        </>
      );
} 

export default SensorChart