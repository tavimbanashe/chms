const db = require('../config/db');
const jsPDF = require('jspdf');
const XLSX = require('xlsx');

exports.getReportData = async (req, res) => {
    const { reportType, filters } = req.body;

    try {
        let query = '';
        if (reportType === 'memberDemographics') {
            query = 'SELECT gender, COUNT(*) as count FROM Members GROUP BY gender';
        } else if (reportType === 'attendanceTrends') {
            query = `
                SELECT date, COUNT(*) as attendees 
                FROM Attendance 
                WHERE date >= $1 AND date <= $2 
                GROUP BY date ORDER BY date
            `;
        } else if (reportType === 'financialSummary') {
            query = `
                SELECT type, SUM(amount) as total 
                FROM GivingReports 
                WHERE date >= $1 AND date <= $2 
                GROUP BY type
            `;
        }

        const result = await db.query(query, filters || []);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching report data:', error);
        res.status(500).json({ message: 'Error fetching report data' });
    }
};

exports.exportReport = async (req, res) => {
    const { reportType, format } = req.body;

    try {
        // Fetch data based on the reportType
        const data = await this.getReportData(req, res);

        if (format === 'pdf') {
            const doc = new jsPDF();
            doc.text('Report Title', 10, 10);
            doc.autoTable({
                head: [['Column1', 'Column2']],
                body: data.map((row) => [row.column1, row.column2]),
            });
            res.setHeader('Content-Type', 'application/pdf');
            res.send(doc.output());
        } else if (format === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
            const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
            res.setHeader('Content-Disposition', 'attachment; filename="report.xlsx"');
            res.send(buffer);
        }
    } catch (error) {
        console.error('Error exporting report:', error);
        res.status(500).json({ message: 'Error exporting report' });
    }
};
