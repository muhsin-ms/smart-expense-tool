document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const monthlyIncomeInput = document.getElementById('monthlyIncome');
    const savingsGoalInput = document.getElementById('savingsGoal');
    const foodInput = document.getElementById('foodExpense');
    const travelInput = document.getElementById('travelExpense');
    const shoppingInput = document.getElementById('shoppingExpense');
    const calculateBtn = document.getElementById('calculateBtn');

    // Results
    const resultsGrid = document.getElementById('results');
    const monthlyResult = document.getElementById('monthlyResult');
    const yearlyResult = document.getElementById('yearlyResult');
    const percentResult = document.getElementById('percentResult');
    const topCategoryResult = document.getElementById('topCategoryResult');
    const savingsStatusResult = document.getElementById('savingsStatusResult');
    const suggestionBox = document.getElementById('suggestionBox');

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
            minimumFractionDigits: 0
        }).format(amount);
    }

    function calculate() {
        // 1. Input Validation
        const income = parseFloat(monthlyIncomeInput.value);
        const savingsGoal = parseFloat(savingsGoalInput.value);
        const food = parseFloat(foodInput.value);
        const travel = parseFloat(travelInput.value);
        const shopping = parseFloat(shoppingInput.value);

        // Check for NaN or negative numbers
        const inputs = [
            { val: income, name: 'Monthly Income' },
            { val: savingsGoal, name: 'Savings Goal' },
            { val: food, name: 'Food Expense' },
            { val: travel, name: 'Travel Expense' },
            { val: shopping, name: 'Shopping Expense' }
        ];

        for (const input of inputs) {
            if (isNaN(input.val) || input.val < 0) {
                alert(`Invalid input: ${input.name} must be a positive number.`);
                return;
            }
        }

        if (income === 0) {
            alert('Monthly Income must be greater than 0 for accurate analysis.');
            return;
        }

        // 2. Core Calculations
        const dailyTotal = food + travel + shopping;
        const monthlyExpense = dailyTotal * 30;
        const yearlyExpense = monthlyExpense * 12;
        const rawSpendingPercent = (monthlyExpense / income) * 100;
        const actualSavings = income - monthlyExpense;
        const goalDifference = savingsGoal - actualSavings;

        // 3. Update Results with 2 Decimal Places (with range limiting)
        monthlyResult.textContent = formatCurrency(monthlyExpense);
        yearlyResult.textContent = formatCurrency(yearlyExpense);
        
        // Limit percentage display for better UI (cap at 100%+ for extreme cases)
        if (rawSpendingPercent > 100) {
            percentResult.textContent = '100%+';
            percentResult.style.color = 'var(--danger-color)';
        } else {
            percentResult.textContent = `${rawSpendingPercent.toFixed(2)}%`;
            percentResult.style.color = 'var(--primary-color)';
        }

        // 4. Category Analysis
        const categories = [
            { name: 'Food', value: food },
            { name: 'Travel', value: travel },
            { name: 'Shopping', value: shopping }
        ];
        
        const topCategory = categories.reduce((prev, current) => 
            (prev.value > current.value) ? prev : current
        );

        topCategoryResult.textContent = dailyTotal > 0 ? topCategory.name : 'None';

        // 5. Savings Status
        if (actualSavings >= savingsGoal) {
            savingsStatusResult.textContent = 'Goal Met! 🎉';
            savingsStatusResult.style.color = 'var(--accent-color)';
        } else {
            savingsStatusResult.textContent = `Short by ${formatCurrency(goalDifference)}`;
            savingsStatusResult.style.color = 'var(--danger-color)';
        }

        // 6. Improved Smart Suggestions with Inconsistency Warnings
        suggestionBox.className = 'suggestion-box'; // reset
        let suggestionMsg = '';

        // Data Inconsistency Warning: Spending more than income
        if (monthlyExpense > income) {
            suggestionBox.classList.add('suggestion-warning');
            suggestionMsg = `⚠️ Data Inconsistency: Your monthly expenses (${formatCurrency(monthlyExpense)}) exceed your monthly income (${formatCurrency(income)}). This spending is unsustainable. Focus on cutting down ${topCategory.name.toLowerCase()} costs immediately.`;
        } else if (rawSpendingPercent > 70) {
            suggestionBox.classList.add('suggestion-warning');
            suggestionMsg = `⚠️ High spending. Consider reducing expenses. You're using ${rawSpendingPercent.toFixed(1)}% of your income.`;
        } else if (rawSpendingPercent >= 40) {
            suggestionBox.classList.add('suggestion-info');
            suggestionMsg = `⚖️ Moderate spending. Try optimizing savings. Focus on reducing ${topCategory.name.toLowerCase()} costs.`;
        } else {
            suggestionBox.classList.add('suggestion-success');
            suggestionMsg = `✅ Good financial control. Your spending is well within a healthy range.`;
        }

        // Add additional savings goal insight if the data is consistent but goal is not met
        if (monthlyExpense <= income && actualSavings < savingsGoal) {
            const dailyReductionNeeded = goalDifference / 30;
            suggestionMsg += ` To reach your goal, save ${formatCurrency(dailyReductionNeeded)} more daily.`;
        }

        suggestionBox.textContent = suggestionMsg;

        // Show results
        resultsGrid.classList.remove('hidden');
        resultsGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    calculateBtn.addEventListener('click', calculate);

    [monthlyIncomeInput, savingsGoalInput, foodInput, travelInput, shoppingInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculate();
        });
    });
});
