       // global variables
        let currency_names = ["EUR"];
        let currency_values = [1];
        let name_incomes = [];
        let sum_incomes = [];
        let name_expenses = [];
        let sum_expenses = [];
        let expense_necessity = [];
        let index_income = 1;
        let index_expense = 1;
 
        // Gets data from the API
        async function getAPIConvertRate() {
            let response = await fetch('https://api.exchangeratesapi.io/latest');
            let data = await response.json();
            return data;
        }

        // API call + saving the data
        getAPIConvertRate().then(data => {
            
            Object.entries(data.rates).forEach(([key, value]) => {
                currency_names.push(key);
                currency_values.push(value);
             });
             printCurrencies();
        });
        
        // Show currencies in HTML
        function printCurrencies(){

            aux_innerhtml = '';
            for( i = 0 ; i < currency_names.length ; i++){
                
                aux_innerhtml += `<option>${currency_names[i]}</option>`
            } 
            document.getElementById("currencyToChange").innerHTML = aux_innerhtml;
            document.getElementById("currencyToChangeTo").innerHTML = aux_innerhtml;
        }

        // Convert sum to the desired currency
        function convertToCurrency() {

            let indexChange1 = currency_names.indexOf(document.getElementById("currencyToChange").value);
            let indexChange2 = currency_names.indexOf(document.getElementById("currencyToChangeTo").value);    
            let sum = document.getElementById("currencySum").value;
            
            if( sum.length == 0 ) {

                let result = document.getElementById("convertCurrencyResult");
                result.value = ''

            } else {

                if(isNaN(sum)) {

                    let result = document.getElementById("convertCurrencyResult");
                    result.value = 'NaN'

                } else {

                    let result = document.getElementById("convertCurrencyResult");

                    sum = parseFloat(sum / currency_values[indexChange1]); // in euro
                    sum = parseFloat(sum * currency_values[indexChange2]);
                    sum = Math.round((sum + Number.EPSILON) * 100) / 100; 
                    result.value = sum;
                }
            }
        }

        // adds a new income
        function getNewIncome() {

            if (isNaN(document.getElementById("newIncomeSum").value)){
                alert("The sum you entered is not a number! Please enter a valid value!");
            }
            else {
                name_incomes.push(document.getElementById("newIncomeSource").value);
                sum_incomes.push(document.getElementById("newIncomeSum").value);
                addIncomeToTable();
                calculateBudget();
            }

        }

        // adds a new expense
        function getNewExpense() {

            if (isNaN(document.getElementById("newExpenseSum").value)){
                alert("The sum you entered is not a number! Please enter a valid value!");
            }
            else {
                name_expenses.push(document.getElementById("newExpenseSource").value);
                sum_expenses.push(document.getElementById("newExpenseSum").value);
                expense_necessity.push(document.getElementById("isNecessary").value);
                addExpenseToTable();
                calculateBudget();
                necessityStatistics();
            }

        }

        // adds the income to the Incomes column
        function addIncomeToTable() {
            var table = document.getElementById("incomeTable");
            var row = table.insertRow(index_income);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            cell1.innerHTML = name_incomes[name_incomes.length - 1];
            cell2.innerHTML = sum_incomes[sum_incomes.length - 1];
            cell3.innerHTML = '<button onclick="removeItemIncome('+String(index_income)+')">X</button>';
            index_income += 1;
        }

        // adds the expense to the Expenses column
        function addExpenseToTable() {
            var table = document.getElementById("expensesTable");
            var row = table.insertRow(index_expense);
            row.id = 'row_id'+String(index_expense)
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1); 
            var cell3 = row.insertCell(2); 
            var cell4 = row.insertCell(3);
            cell1.innerHTML = name_expenses[name_expenses.length - 1];
            cell2.innerHTML = sum_expenses[sum_expenses.length - 1];
            cell3.innerHTML = expense_necessity[expense_necessity.length - 1];
            cell4.innerHTML = '<button onclick="removeItemExpense('+String(index_expense)+')">X</button>';
            index_expense += 1;
        }

        // removes the income whose button was clicked from the Incomes column
        function removeItemIncome(id) {
  
            let aux_name = [];
            let aux_sum = [];
            aux_name = name_incomes.map((x) => x);
            aux_sum = sum_incomes.map((x) => x);
            name_incomes = [];
            sum_incomes = [];
            index_income = 1;

            let removeTable = document.getElementById('incomeTable');
            let parentElement = removeTable.parentElement;
            parentElement.removeChild(removeTable);

            document.getElementById("income").innerHTML = `
                    <h2 class="smallTitle">Incomes</h2>
                    <table id="incomeTable">
                        <td>Name</td>
                        <td>Sum</td>
                    </table>
            `

            for (i = 0; i<aux_name.length; i++)
                if(i != id - 1) {
                    name_incomes.push(aux_name[i]);
                    sum_incomes.push(aux_sum[i]);
                    addIncomeToTable();
                }

                calculateBudget();

        }

        // removes the expense whose button was clicked from the Expenses column
        function removeItemExpense(id) {

            let aux_name = [];
            let aux_sum = [];
            let aux_necessity = [];
            aux_name = name_expenses.map((x) => x);
            aux_sum = sum_expenses.map((x) => x);
            aux_necessity = expense_necessity.map((x) => x);
            name_expenses = [];
            sum_expenses = [];
            expense_necessity = [];
            index_expense = 1;

            let removeTable = document.getElementById('expensesTable');
            let parentElement = removeTable.parentElement;
            parentElement.removeChild(removeTable);

            document.getElementById("expense").innerHTML = `
                    <h2 class="smallTitle">
                        Expenses
                    </h2>

                    <table id="expensesTable">
                        <td>Name</td>
                        <td>Sum</td>
                        <td>Necessity</td>
                    </table>
            `

            for (i = 0; i<aux_name.length; i++)
                if(i != id - 1) {
                    name_expenses.push(aux_name[i]);
                    sum_expenses.push(aux_sum[i]);
                    expense_necessity.push(aux_necessity[i]);
                    addExpenseToTable();
                }

                calculateBudget();
                necessityStatistics();

        }

        // calculates the overall budget and updates it
        function calculateBudget() {
            sum = 0.0;
            for(i = 0; i < sum_incomes.length; i++)
                sum += parseFloat(sum_incomes[i]);
            for(i = 0; i < sum_expenses.length; i++)
                sum -= parseFloat(sum_expenses[i]);
            
            let removeBudget = document.getElementById('budgetSum');
            let parentElement = removeBudget.parentElement;
            parentElement.removeChild(removeBudget);

            sum = Math.round((sum + Number.EPSILON) * 100) / 100;

            document.getElementById("bigTitle").innerHTML = `
            <h1 id="budgetSum">Available budget :`+String(sum)+`</h1>
                    `
        }

        // calculates and updates the statistics of necessity for expenses
        function necessityStatistics() {

                sumExpenseNecessary = 0;
                sumExpenseOptional = 0;

                for( i = 0 ; i < sum_expenses.length ; i++){
                    if(expense_necessity[i] == "Optional") 
                        sumExpenseOptional += parseFloat(sum_expenses[i]);
                    else
                        sumExpenseNecessary += parseFloat(sum_expenses[i]);
                }

                sumExpenseNecessary = Math.round((sumExpenseNecessary + Number.EPSILON) * 100) / 100;
                sumExpenseOptional = Math.round((sumExpenseOptional + Number.EPSILON) * 100) / 100;

                let removeNecessities = document.getElementById('necessities');
                let parentElement = removeNecessities.parentElement;
                parentElement.removeChild(removeNecessities);
                document.getElementById("properties").innerHTML = `
                <div id="necessities">
                    <div>Spent on Necessities: `+String(sumExpenseNecessary)+`</div>
                    <div>Optional Spendings: `+String(sumExpenseOptional)+`</div>
                </div>
            `
        }
