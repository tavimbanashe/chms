const db = require('../config/db');

// ---------- Budget Allocation Management ----------
exports.getAllBudgets = async (req, res) => {
    try {
        const query = `
            SELECT *, (allocated_amount - used_amount) AS remaining_amount
            FROM BudgetAllocations
            ORDER BY category ASC;
        `;
        const budgets = await db.query(query);
        res.status(200).json(budgets.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching budgets', error: error.message });
    }
};

exports.getBudgetSummary = async (req, res) => {
    try {
        const query = `
            SELECT category, SUM(allocated_amount) AS total_allocated, SUM(used_amount) AS total_used
            FROM BudgetAllocations
            GROUP BY category
            ORDER BY category ASC;
        `;
        const summary = await db.query(query);
        res.status(200).json(summary.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching budget summary', error: error.message });
    }
};

exports.createBudget = async (req, res) => {
    const { category, allocated_amount } = req.body;

    try {
        const query = `
            INSERT INTO BudgetAllocations (category, allocated_amount)
            VALUES ($1, $2) RETURNING *;
        `;
        const values = [category, allocated_amount];
        const newBudget = await db.query(query, values);
        res.status(201).json(newBudget.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating budget', error: error.message });
    }
};

exports.updateBudget = async (req, res) => {
    const { id } = req.params;
    const { category, allocated_amount, used_amount } = req.body;

    try {
        const query = `
            UPDATE BudgetAllocations
            SET category = $1, allocated_amount = $2, used_amount = $3
            WHERE id = $4 RETURNING *;
        `;
        const values = [category, allocated_amount, used_amount, id];
        const updatedBudget = await db.query(query, values);

        if (updatedBudget.rows.length === 0) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.status(200).json(updatedBudget.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating budget', error: error.message });
    }
};

exports.deleteBudget = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM BudgetAllocations WHERE id = $1 RETURNING *;`;
        const deletedBudget = await db.query(query, [id]);

        if (deletedBudget.rows.length === 0) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.status(200).json(deletedBudget.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting budget', error: error.message });
    }
};
