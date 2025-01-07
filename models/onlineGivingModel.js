const db = require('../config/db');

// Add a new transaction
exports.addTransaction = async (transaction) => {
    const { donor_name, email, amount, platform, transaction_id, status } = transaction;

    try {
        const query = `
            INSERT INTO online_givings (donor_name, email, amount, platform, transaction_id, status, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING *;
        `;
        const values = [donor_name, email, amount, platform, transaction_id, status];
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error adding transaction:', error);
        throw error;
    }
};

// Update the transaction status
exports.updateTransactionStatus = async (transactionId, status) => {
    try {
        const query = `
            UPDATE online_givings
            SET status = $1, updated_at = NOW()
            WHERE transaction_id = $2
            RETURNING *;
        `;
        const values = [status, transactionId];
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error updating transaction status:', error);
        throw error;
    }
};

// Get all transactions
exports.getAllTransactions = async () => {
    try {
        const query = `
            SELECT *
            FROM online_givings
            ORDER BY created_at DESC;
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};

// Get a transaction by ID
exports.getTransactionById = async (id) => {
    try {
        const query = `
            SELECT *
            FROM online_givings
            WHERE id = $1;
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching transaction by ID:', error);
        throw error;
    }
};

// Delete a transaction
exports.deleteTransaction = async (id) => {
    try {
        const query = `
            DELETE FROM online_givings
            WHERE id = $1
            RETURNING *;
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting transaction:', error);
        throw error;
    }
};
