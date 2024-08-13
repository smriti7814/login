const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const requestHandler = (req, res) => {
    if (req.url === '/') {
        // Serve the HTML content
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Employees Table</title>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h1>Employees Data</h1>
                <table id="employees-table">
                    <thead>
                        <tr>
                            <th>Emp ID</th>
                            <th>Emp Name</th>
                            <th>Designation</th>
                            <th>Salary</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Data will be inserted here -->
                    </tbody>
                </table>

                <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        fetch('/employees')
                            .then(response => response.json())
                            .then(data => {
                                const tableBody = document.getElementById('employees-table').querySelector('tbody');
                                data.forEach(emp => {
                                    const row = document.createElement('tr');
                                    row.innerHTML = \`
                                        <td>\${emp.empId}</td>
                                        <td>\${emp.empName}</td>
                                        <td>\${emp.designation}</td>
                                        <td>\${emp.salary}</td>
                                        <td>
                                            <button onclick="deleteEmployee('\${emp.empId}')">Delete</button>
                                            <button onclick="updateEmployee('\${emp.empId}')">Update</button>
                                        </td>
                                    \`;
                                    tableBody.appendChild(row);
                                });
                            })
                            .catch(error => console.error('Error fetching data:', error));
                    });

                    function deleteEmployee(empId) {
                        fetch('/deleteEmployee', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ empId })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                location.reload();
                            } else {
                                alert('Error deleting employee');
                            }
                        })
                        .catch(error => console.error('Error deleting employee:', error));
                    }

                    function updateEmployee(empId) {
                        let newEmpId = prompt('Enter new employee ID (leave blank if no change):');
                        let empName = prompt('Enter new name (leave blank if no change):');
                        let designation = prompt('Enter new designation (leave blank if no change):');
                        let salary = prompt('Enter new salary (leave blank if no change):');

                        // Remove empty fields from the update request
                        const updateData = { oldEmpId: empId };
                        if (newEmpId) updateData.newEmpId = newEmpId;
                        if (empName) updateData.empName = empName;
                        if (designation) updateData.designation = designation;
                        if (salary) updateData.salary = salary;

                        fetch('/updateEmployee', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(updateData)
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                location.reload();
                            } else {
                                alert('Error updating employee');
                            }
                        })
                        .catch(error => console.error('Error updating employee:', error));
                    }
                </script>
            </body>
            </html>
        `);
    } else if (req.url === '/employees') {
        // Serve the JSON data
        fs.readFile(path.join(__dirname, 'data.json'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error reading data file');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    } else if (req.url === '/deleteEmployee' && req.method === 'POST') {
        // Handle delete employee
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { empId } = JSON.parse(body);
            fs.readFile(path.join(__dirname, 'data.json'), (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false }));
                    return;
                }
                const employees = JSON.parse(data);
                const updatedEmployees = employees.filter(emp => emp.empId !== empId);
                fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(updatedEmployees, null, 2), err => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                });
            });
        });
    } else if (req.url === '/updateEmployee' && req.method === 'POST') {
        // Handle update employee
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { oldEmpId, newEmpId, empName, designation, salary } = JSON.parse(body);
            fs.readFile(path.join(__dirname, 'data.json'), (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false }));
                    return;
                }
                let employees = JSON.parse(data);
                const empIndex = employees.findIndex(emp => emp.empId === oldEmpId);
                if (empIndex !== -1) {
                    if (newEmpId) employees[empIndex].empId = newEmpId;
                    if (empName) employees[empIndex].empName = empName;
                    if (designation) employees[empIndex].designation = designation;
                    if (salary) employees[empIndex].salary = parseInt(salary);

                    fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(employees, null, 2), err => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false }));
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                    });
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Employee not found' }));
                }
            });
        });
    } else {
        // Handle 404 Not Found
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
};

const server = http.createServer(requestHandler);

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
