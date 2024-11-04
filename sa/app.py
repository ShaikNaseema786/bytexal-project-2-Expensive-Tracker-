from flask import Flask, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)

# Sample data store (for simplicity, in-memory)
expenses = []

@app.route('/')
def index():
    return render_template('index.html', expenses=expenses)

@app.route('/add', methods=['GET', 'POST'])
def add():
    if request.method == 'POST':
        name = request.form['name']
        category = request.form['category']
        amount = request.form['amount']
        expenses.append({'id': len(expenses) + 1, 'name': name, 'category': category, 'amount': float(amount)})
        return redirect(url_for('index'))
    return render_template('add.html')

@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit(id):
    expense = next((exp for exp in expenses if exp['id'] == id), None)
    if request.method == 'POST':
        expense['name'] = request.form['name']
        expense['category'] = request.form['category']
        expense['amount'] = float(request.form['amount'])
        return redirect(url_for('index'))
    return render_template('edit.html', expense=expense)

@app.route('/delete/<int:id>')
def delete(id):
    global expenses
    expenses = [expense for expense in expenses if expense['id'] != id]
    return redirect(url_for('index'))

@app.route('/expense_data')
def expense_data():
    return jsonify(expenses)

@app.route('/chart')
def chart():
    return render_template('chart.html')

if __name__ == '__main__':
    app.run(debug=True)
