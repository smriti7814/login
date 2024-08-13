const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const qs = require('querystring');

// Path to the users file
const usersFile = path.join(__dirname, 'users.json');
const dataFile = path.join(__dirname, 'data.json');

// Server creation
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (req.method === 'GET') {
        if (pathname === '/') {
            res.writeHead(200, { 'Content-Type': 'text/html' });

            
            res.end(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Sign Up / Login</title>
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
                    <style>
                        body { height: 100%; overflow: hidden; width: 100%; box-sizing: border-box; }
                        .background-Right { position: absolute; right: 0; width: 50%; height: 100%; background: linear-gradient(to right, #000428, #004e92); background-size: cover; background-position: 50% 50%; }
                        .background-Left { position: absolute; left: 0; width: 50%; height: 100%; background: linear-gradient(to right, #02a8a8, #4fb783); background-size: cover; background-position: 50% 50%; }
                        #background { width: 100%; height: 100%; position: absolute; z-index: -3; }
                        #slide { width: 50%; max-height: 100%; height: 100%; overflow: hidden; margin-left: 50%; position: absolute; box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22); }
                        .top { width: 200%; height: 100%; position: relative; left: 0; left: -100%; }
                        .left { width: 50%; height: 100%; background: #ffff; left: 0; position: absolute; }
                        .right { width: 50%; height: 100%; background: #ffff; right: 0; position: absolute; }
                        .content { width: 250px; margin: 0 auto; top: 30%; position: absolute; left: 50%; margin-left: -125px; }
                        .content h2 { color: #4caf50; font-size: 35px; }
                        button { background-color: #4caf50; color: white; width: auto; padding: 14px 20px; margin: 8px 0; border: none; cursor: pointer; }
                        input[type="text"], input[type="password"] { width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; box-sizing: border-box; }
                        .on-off { background: none; color: #4caf50; box-shadow: none; }
                        .info-message { font-size: 18px; color: #333; text-align: center; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div id="background">
                        <div class="background-Right"></div>
                        <div class="background-Left"></div>
                    </div>
                    <div id="slide">
                        <div class="top">
                            <div class="left">
                                <div class="content">
                                    <div class="info-message">If you are a new user, kindly register yourself below:</div>
                                    <h2>Sign Up</h2>
                                    <form id="signupForm" action="/signup" method="post">
                                        <div>
                                            <input type="text" id="signupUsername" name="username" placeholder="email" required />
                                            <br />
                                            <input type="password" name="password" placeholder="password" required />
                                        </div>
                                        <button type="submit">Register</button>
                                    </form>
                                    <button id="LeftToRight" class="on-off">Login</button>
                                </div>
                            </div>
                            <div class="right">
                                <div class="content">
                                    <div class="info-message">Already have an account? Login below:</div>
                                    <h2>Login</h2>
                                    <form id="loginForm" action="/login" method="post">
                                        <div>
                                            <input type="text" id="loginUsername" name="username" placeholder="email" required />
                                            <br />
                                            <input type="password" name="password" placeholder="password" required />
                                        </div>
                                        <button type="submit">Login</button>
                                    </form>
                                    <button id="RightToLeft" class="on-off">Register</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <script>
                        $(document).ready(function () {
                            $("#RightToLeft").on("click", function () {
                                $("#slide").animate({ marginLeft: "0" });
                                $(".top").animate({ marginLeft: "100%" });
                            });
                            $("#LeftToRight").on("click", function () {
                                $("#slide").animate({ marginLeft: "50%" });
                                $(".top").animate({ marginLeft: "0" });
                            });

                            // Email validation
                            $("#signupForm").on("submit", function (e) {
                                const email = $("#signupUsername").val();
                                if (!email.endsWith("@gmail.com")) {
                                    alert("Please provide a valid email ending with @gmail.com");
                                    e.preventDefault();
                                }
                            });

                            $("#loginForm").on("submit", function (e) {
                                const email = $("#loginUsername").val();
                                if (!email.endsWith("@gmail.com")) {
                                    alert("Please provide a valid email ending with @gmail.com");
                                    e.preventDefault();
                                }
                            });
                        });
                    </script>
                </body>
                </html>
            `);
        } else if (pathname === '/employees') {
            // Serve JSON data
            fs.readFile(dataFile, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error reading data file');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            });
        } else if (pathname === '/new.html') {
            // Serve the HTML content for employees table
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
                                    alert('Employee deleted successfully');
                                    location.reload();
                                } else {
                                    alert('Error deleting employee');
                                }
                            })
                            .catch(error => console.error('Error deleting employee:', error));
                        }

                        function updateEmployee(empId) {
                            const newEmpName = prompt('Enter new employee name (leave blank to keep current):');
                            const newDesignation = prompt('Enter new designation (leave blank to keep current):');
                            const newSalary = prompt('Enter new salary (leave blank to keep current):');
                            if (newEmpName || newDesignation || newSalary) {
                                fetch('/updateEmployee', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ empId, newEmpName, newDesignation, newSalary })
                                })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        alert('Employee updated successfully');
                                        location.reload();
                                    } else {
                                        alert('Error updating employee');
                                    }
                                })
                                .catch(error => console.error('Error updating employee:', error));
                            }
                        }
                    </script>
                </body>
                </html>
            `);
        } else {
            // Serve static files like JavaScript, CSS, etc.
            const filePath = path.join(__dirname, pathname);
            fs.stat(filePath, (err, stat) => {
                if (err || !stat.isFile()) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('File not found');
                    return;
                }
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error reading file');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': getContentType(filePath) });
                    res.end(data);
                });
            });
        }
    } else if (req.method === 'POST') {
        if (pathname === '/signup') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const data = qs.parse(body);
                const { username, password } = data;

                fs.readFile(usersFile, 'utf8', (err, usersData) => {
                    let users = [];
                    if (!err) {
                        users = JSON.parse(usersData);
                    }
                    users.push({ username, password });
                    fs.writeFile(usersFile, JSON.stringify(users), err => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Error saving user data');
                            return;
                        }
                        res.writeHead(302, { Location: '/' });
                        res.end();
                    });
                });
            });
        } else if (pathname === '/login') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const data = qs.parse(body);
                const { username, password } = data;

                fs.readFile(usersFile, 'utf8', (err, usersData) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error reading user data');
                        return;
                    }
                    const users = JSON.parse(usersData);
                    const user = users.find(user => user.username === username && user.password === password);
                    if (user) {
                        res.writeHead(302, { Location: '/new.html' });
                    } else {
                        res.writeHead(302, { Location: '/' });
                    }
                    res.end();
                });
            });
        } else if (pathname === '/deleteEmployee') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const data = JSON.parse(body);
                const { empId } = data;

                fs.readFile(dataFile, 'utf8', (err, jsonData) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false }));
                        return;
                    }
                    let employees = JSON.parse(jsonData);
                    employees = employees.filter(emp => emp.empId !== empId);
                    fs.writeFile(dataFile, JSON.stringify(employees), err => {
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
        } else if (pathname === '/updateEmployee') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const data = JSON.parse(body);
                const { empId, newEmpName, newDesignation, newSalary } = data;

                fs.readFile(dataFile, 'utf8', (err, jsonData) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false }));
                        return;
                    }
                    let employees = JSON.parse(jsonData);
                    employees = employees.map(emp => {
                        if (emp.empId === empId) {
                            return {
                                ...emp,
                                empName: newEmpName || emp.empName,
                                designation: newDesignation || emp.designation,
                                salary: newSalary || emp.salary
                            };
                        }
                        return emp;
                    });
                    fs.writeFile(dataFile, JSON.stringify(employees), err => {
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
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
});

// Determine the content type based on file extension
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.html': return 'text/html';
        case '.css': return 'text/css';
        case '.js': return 'application/javascript';
        case '.json': return 'application/json';
        case '.png': return 'image/png';
        case '.jpg': return 'image/jpeg';
        case '.gif': return 'image/gif';
        default: return 'application/octet-stream';
    }
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
