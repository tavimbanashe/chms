const db = require('../config/db');

// ---------- Expense Management ----------
exports.getAllExpenses = async (req, res) => {
    try {
        const query = `
            SELECT * FROM Expenses
            ORDER BY expense_date DESC;
        `;
        const expenses = await db.query(query);
        res.status(200).json(expenses.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expenses', error: error.message });
    }
};

exports.getExpenseSummary = async (req, res) => {
    try {
        const query = `
            SELECT category, SUM(amount) AS total_amount
            FROM Expenses
            GROUP BY category
            ORDER BY total_amount DESC;
        `;
        const summary = await db.query(query);
        res.status(200).json(summary.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expense summary', error: error.message });
    }
};

exports.createExpense = async (req, res) => {
    const { category, description, amount, expense_date } = req.body;

    try {
        const query = `
            INSERT INTO Expenses (category, description, amount, expense_date)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const values = [category, description, amount, expense_date];
        const newExpense = await db.query(query, values);
        res.status(201).json(newExpense.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating expense', error: error.message });
    }
};

exports.updateExpense = async (req, res) => {
    const { id } = req.params;
    const { category, description, amount, expense_date } = req.body;

    try {
        const query = `
            UPDATE Expenses
            SET category = $1, description = $2, amount = $3, expense_date = $4
            WHERE id = $5 RETURNING *;
        `;
        const values = [category, description, amount, expense_date, id];
        const updatedExpense = await db.query(query, values);

        if (updatedExpense.rows.length === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json(updatedExpense.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating expense', error: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM Expenses WHERE id = $1 RETURNING *;`;
        const deletedExpense = await db.query(query, [id]);

        if (deletedExpense.rows.length === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json(deletedExpense.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting expense', error: error.message });
    }
};
