
import { Card } from '@tremor/react';

function classNames(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

interface KpiCardsProps {
    account?: IAccount;
}

export default function KpiCards({ account }: KpiCardsProps) {

    if (!account) {
        return <div>Loading...</div>;
    }

    const { winRate, completedTransactions, avarageHoldDuration, totalValue } = account;

    const data = account
        ? [
            {
                name: 'Total Value',
                value: `${totalValue.toFixed(2)} €`,
                changeType: 'neutral',
            },
            {
                name: 'Completed Transactions',
                value: `${completedTransactions}`,
                changeType: 'positive',
            },

            {
                name: 'Win Rate',
                value: `${winRate.toFixed(2)}%`,
                change: winRate > 0 ? `+${winRate.toFixed(2)}%` : `${winRate.toFixed(2)}%`,
                changeType: winRate > 0 ? 'positive' : 'negative',
            },


            {
                name: 'Average Hold Duration',
                value: `${avarageHoldDuration.toFixed(2)} minutes`,
                changeType: 'neutral',
            },
        ]
        : [];



    return (
        <>
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-5 items-center">
                {data?.map((item) => (
                    <Card key={item.name} className='border border-gray-300 rounded-lg shadow'>
                        <dd className="flex items-start justify-between">
                            <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {item.value}
                            </span>
                            <span
                                className={classNames(
                                    item.changeType === 'positive'
                                        ? 'text-emerald-700 dark:text-emerald-500'
                                        : 'text-red-700 dark:text-red-500',
                                    'text-tremor-default font-medium',
                                )}
                            >
                                {item.change}
                            </span>
                        </dd>
                        <dt className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            {item.name}
                        </dt>
                    </Card>
                ))}
            </dl>
        </>
    );
}