
import { Card } from '@tremor/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useTradeCall from '../../hooks/useTradeCall';
import useAccountCall from '../../hooks/useAccountCall';
import type { RootState } from '../../app/store';

function classNames(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

export default function KpiCards() {
    const { currentUser } = useSelector((state: RootState) => state.auth);
    const { getTrades } = useTradeCall();
    const { getAccount, updateAccount } = useAccountCall();
    const [account, setAccount] = useState<IAccount>();

    const fetchAccountData = async () => {
        try {
            if (currentUser?._id) {
                getTrades(currentUser._id);
                const accountData = await getAccount(currentUser._id);
                setAccount(accountData.data[0]);
            } else {
                console.log("No user ID found for the current user.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchAccountData();
    }, [currentUser]);

    console.log(account);

    const data = account
        ? [
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
                name: 'Average Profit',
                value: `${account.avarageProfit.toFixed(2)} €`,
                changeType: 'positive',
            },
            {
                name: 'Average Loss',
                value: `${account.avarageLoss.toFixed(2)} €`,
                changeType: 'negative',
            },
            {
                name: 'Win Rate',
                value: `${account.winRate.toFixed(2)}%`,
                change: account.winRate > 0 ? `+${account.winRate.toFixed(2)}%` : `${account.winRate.toFixed(2)}%`,
                changeType: account.winRate > 0 ? 'positive' : 'negative',
            },


            {
                name: 'Average Hold Duration',
                value: `${account.avarageHoldDuration} days`,
                changeType: 'neutral',
            },
        ]
        : [];



    return (
        <>
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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