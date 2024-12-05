"use strict";
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

function calculateLossRate(account) {
  const losingTrades = account.losingTrades || 0;
  const totalTransactions = account.completedTransactions || 0;

  if (totalTransactions === 0) {
    return 0;
  }

  return (losingTrades / totalTransactions) * 100;
}

function calculateProfitFactor(account) {
  const totalProfits =
    account.profitableTrades > 0
      ? account.avarageProfit * account.profitableTrades
      : 0;
  const totalLosses =
    account.losingTrades > 0 ? account.avarageLoss * account.losingTrades : 0;

  return totalLosses > 0 ? totalProfits / totalLosses : totalProfits;
}

function calculateAverageHoldDuration(currentAverage, newDuration, totalCount) {
  return (currentAverage * (totalCount - 1) + newDuration) / totalCount;
}

module.exports = {
  calculateMovingAverage,
  calculateWinRate,
  calculateLossRate,
  calculateProfitFactor,
  calculateAverageHoldDuration,
};
