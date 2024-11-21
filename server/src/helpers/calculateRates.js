function calculateMovingAverage(currentAverage, newValue, totalCount) {
  return (currentAverage * (totalCount - 1) + newValue) / totalCount;
}

function calculateWinRate(account) {
  const profitableTrades = account.profitableTrades || 0;
  const totalTransactions = account.completedTransactions || 0;

  if (totalTransactions === 0) {
    return 0;
  }

  return (profitableTrades / totalTransactions) * 100;
}

function calculateProfitFactor(account) {
  const totalProfits = account.avarageProfit * account.completedTransactions;
  const totalLosses = account.avarageLoss * account.completedTransactions;
  return totalLosses > 0 ? totalProfits / totalLosses : totalProfits;
}

function calculateAverageHoldDuration(currentAverage, newDuration, totalCount) {
  return (currentAverage * (totalCount - 1) + newDuration) / totalCount;
}

module.exports = {
  calculateMovingAverage,
  calculateWinRate,
  calculateProfitFactor,
  calculateAverageHoldDuration,
};
