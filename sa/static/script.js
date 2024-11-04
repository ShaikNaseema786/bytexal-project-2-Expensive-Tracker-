document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('expenseChart') ? document.getElementById('expenseChart').getContext('2d') : null;
    let expenseChart;

    function updateChart(data) {
        const categories = {};
        data.forEach(expense => {
            categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
        });

        const categoryLabels = Object.keys(categories);
        const categoryData = Object.values(categories);

        if (expenseChart) {
            expenseChart.data.labels = categoryLabels;
            expenseChart.data.datasets[0].data = categoryData;
            expenseChart.update();
        } else if (ctx) {
            expenseChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: categoryLabels,
                    datasets: [{
                        label: 'Expenses by Category',
                        data: categoryData,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true
                }
            });
        }
    }

    function fetchData() {
        fetch('/expense_data')
            .then(response => response.json())
            .then(data => {
                updateChart(data);
            });
    }

    // Initial data fetch
    fetchData();

    // Update chart every 5 seconds
    setInterval(fetchData, 5000);

    // Show/Hide chart on button click
    const showChartBtn = document.getElementById('showChartBtn');
    if (showChartBtn) {
        showChartBtn.addEventListener('click', function() {
            const chartContainer = document.getElementById('chartContainer');
            if (chartContainer.style.display === 'none') {
                chartContainer.style.display = 'block';
                fetchData();  // Ensure chart is updated with latest data
            } else {
                chartContainer.style.display = 'none';
            }
        });
    }
});
