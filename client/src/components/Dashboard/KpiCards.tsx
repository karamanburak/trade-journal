import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@tremor/react';

interface IAccount {
    winRate: number;
    completedTransactions: number;
    avarageHoldDuration: number;
    totalValue: number;
}

interface KpiCardsProps {
    account?: IAccount;
}

export default function KpiCardsWithChart({ account }: KpiCardsProps) {
    if (!account) {
        return <div>Loading...</div>;
    }

    function classNames(...classes: (string | undefined | null | false)[]): string {
        return classes.filter(Boolean).join(' ');
    }

    const cardData = [
        {
            name: 'Total Value',
            value: `${account.totalValue.toFixed(2)} €`,
            changeType: 'neutral',
        },
        {
            name: 'Completed Transactions',
            value: `${account.completedTransactions}`,
            changeType: 'positive',
        },
        {
            name: 'Win Rate',
            value: `${account.winRate.toFixed(2)}%`,
            change: account.winRate > 0 ? `+${account.winRate.toFixed(2)}%` : `${account.winRate.toFixed(2)}%`,
            changeType: account.winRate > 0 ? 'positive' : 'negative',
        },
        {
            name: 'Average Hold Duration',
            value: `${account.avarageHoldDuration.toFixed(2)} mins`,
            changeType: 'neutral',
        }
    ];

    const chartData = [
        {
            name: 'Total Value',
            value: account.totalValue,
            unit: '€'
        },
        {
            name: 'Completed Transactions',
            value: account.completedTransactions,
            unit: ''
        },
        {
            name: 'Win Rate',
            value: account.winRate,
            unit: '%'
        },
        {
            name: 'Average Hold Duration',
            value: account.avarageHoldDuration,
            unit: 'mins'
        }
    ];

    return (
        <div>
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-5 items-center">
                {cardData.map((item) => (
                    <Card key={item.name} className='border border-light-primary rounded-lg shadow'>
                        <dd className="flex items-start justify-between">
                            <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {item.value}
                            </span>
                            {item.change && (
                                <span
                                    className={classNames(
                                        item.changeType === 'positive'
                                            ? 'text-emerald-700 dark:text-emerald-500'
                                            : 'text-light-danger dark:text-dark-dangers',
                                        'text-tremor-default font-medium',
                                    )}
                                >
                                    {item.change}
                                </span>
                            )}
                        </dd>
                        <dt className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            {item.name}
                        </dt>
                    </Card>
                ))}
            </dl>

            <Card className="w-full h-96 mt-5">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                            formatter={(value, name, props) => [
                                `${value}${props.payload.unit}`,
                                props.payload.name
                            ]}
                        />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
}