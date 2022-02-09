import { Fragment, memo, useEffect, useState } from 'react'
import { useDispatch, useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'
import { shallowEqual, useDidUpdate } from '@mantine/hooks'
import { getTransactionActionCreator } from '../redux/action/creator/transaction'
import moment from 'moment'
import { decode } from 'html-entities'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const CustomDashboardChart = () => {
    const dispatch = useDispatch()
    const transactions = useSelector(state => state.transaction, shallowEqualRedux)
    const [labels, setLabels] = useState([])
    const [dataSets, setDataSets] = useState([])
    const transactionsResponse = transactions.get?.response
    const zoneName = moment().locale()
    // const convertToRupiah = (number = 0) => {
    //     return new Intl.NumberFormat('id-ID', {
    //         style: 'currency',
    //         currency: 'IDR'
    //     }).format(number).replace(/^(\D+)/, '$1 ')
    // }

    useEffect(() => {
        dispatch(getTransactionActionCreator())
    }, [])

    useDidUpdate(() => {
        if (transactionsResponse) {
            setLabels(transactionsResponse.map(value => moment(value?.created_at).locale(zoneName).format('MMM Do YY')))
            setDataSets(transactionsResponse.map((transactionValue, transactionValueIndex) => ({
                label: decode(transactionValue?.product?.category?.name),
                data: transactions.get?.response?.map(value => transactionValue?.created_at === value?.created_at ? value?.price : 0),
                borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                yAxisID: transactionValueIndex === 0 ? 'y' : `y${transactionValueIndex}`
            })))
        }
    }, [transactionsResponse])

    return (
        <Fragment>
            <Line
                options={{
                    responsive: true,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    stacked: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Transactions Line Chart - Per Date'
                        }
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left'
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    }
                }}
                data={{
                    labels,
                    datasets: dataSets
                }}
            />
        </Fragment>
    )
}

export const DashboardChart = memo(CustomDashboardChart, shallowEqual)
